package modbus

import (
	"context"
	"fmt"
	"industrial-edge-gateway/internal/model"
	"log"
	"sort"
	"sync"
	"time"
)

// Scheduler 接口定义
type Scheduler interface {
	Read(ctx context.Context, points []model.Point) (map[string]model.Value, error)
	Write(ctx context.Context, point model.Point, value any) error
	GetDecoder() Decoder
}

// PointRuntime 点位运行态状态
type PointRuntime struct {
	Point         model.Point
	FailCount     int
	LastSuccess   time.Time
	State         string // OK, SKIPPED
	CooldownUntil time.Time
}

// PointGroup 表示一组连续的点位及其地址信息
type PointGroup struct {
	RegType     string        // 寄存器类型
	StartOffset uint16        // 起始地址
	Count       uint16        // 数量
	Points      []model.Point // 该组中的所有点位
}

// AddressInfo 用于存储点位的地址信息
type AddressInfo struct {
	Point         model.Point
	RegType       string
	Offset        uint16
	RegisterCount uint16 // 该点位占用的寄存器数
}

// PointScheduler 实现 Scheduler 接口
type PointScheduler struct {
	transport           Transport
	decoder             Decoder
	maxPacketSize       uint16
	groupThreshold      uint16
	instructionInterval time.Duration
	
	pointStates map[string]*PointRuntime
	mu          sync.Mutex
}

func NewPointScheduler(transport Transport, decoder Decoder, maxPacketSize uint16, groupThreshold uint16, instructionInterval time.Duration) *PointScheduler {
	if maxPacketSize == 0 {
		maxPacketSize = 125
	}
	if groupThreshold == 0 {
		groupThreshold = 50
	}
	return &PointScheduler{
		transport:           transport,
		decoder:             decoder,
		maxPacketSize:       maxPacketSize,
		groupThreshold:      groupThreshold,
		instructionInterval: instructionInterval,
		pointStates:         make(map[string]*PointRuntime),
	}
}

func (s *PointScheduler) GetDecoder() Decoder {
	return s.decoder
}

func (s *PointScheduler) Read(ctx context.Context, points []model.Point) (map[string]model.Value, error) {
	now := time.Now()
	result := make(map[string]model.Value)

	// 1. Prepare runtimes and filter points
	activePoints := s.prepareRuntimes(points)
	
	// If no points to read (all skipped), return empty result
	if len(activePoints) == 0 {
		return result, nil
	}

	// 2. Group points
	groups, err := s.groupPoints(activePoints)
	if err != nil {
		return nil, err
	}

	log.Printf("Optimized reading %d points into %d groups", len(activePoints), len(groups))

	// 3. Read groups
	for i, group := range groups {
		if i > 0 && s.instructionInterval > 0 {
			time.Sleep(s.instructionInterval)
		}

		values, err := s.readGroup(ctx, group)
		if err != nil {
			log.Printf("Error reading group starting at offset %d: %v", group.StartOffset, err)
			// Mark group failed
			for _, p := range group.Points {
				s.markPointFailed(p.ID)
				result[p.ID] = model.Value{
					PointID: p.ID,
					Value:   nil,
					Quality: "Bad",
					TS:      now,
				}
			}
			continue
		}

		// Process success
		for id, val := range values {
			result[id] = model.Value{
				PointID: id,
				Value:   val,
				Quality: "Good",
				TS:      now,
			}
			s.markPointSuccess(id, now)
		}
	}
	
	return result, nil
}

func (s *PointScheduler) Write(ctx context.Context, point model.Point, value any) error {
	// Encode value
	regs, err := s.decoder.Encode(point, value)
	if err != nil {
		return err
	}
	
	// Determine write method based on type
	regType, offset, err := s.decoder.ParseAddress(point.Address)
	if err != nil {
		return err
	}

	switch regType {
	case "COIL":
		var boolVal bool
		switch v := value.(type) {
		case bool:
			boolVal = v
		case int:
			boolVal = v != 0
		case float64:
			boolVal = v != 0
		case string:
			boolVal = v == "true" || v == "1"
		default:
			return fmt.Errorf("unsupported value type for coil: %T", value)
		}
		return s.transport.WriteCoil(ctx, offset, boolVal)
		
	case "HOLDING_REGISTER":
		if len(regs) == 1 {
			return s.transport.WriteRegister(ctx, offset, regs[0])
		}
		return s.transport.WriteRegisters(ctx, offset, regs)
		
	default:
		return fmt.Errorf("write not supported for register type: %s", regType)
	}
}

func (s *PointScheduler) prepareRuntimes(points []model.Point) []model.Point {
	s.mu.Lock()
	defer s.mu.Unlock()
	
	var active []model.Point
	now := time.Now()

	for _, p := range points {
		rt, exists := s.pointStates[p.ID]
		if !exists {
			rt = &PointRuntime{
				Point: p,
				State: "OK",
			}
			s.pointStates[p.ID] = rt
		}

		// Check if skipped
		if rt.State == "SKIPPED" {
			if now.After(rt.CooldownUntil) {
				// Cooldown over, try again
				rt.State = "OK"
				rt.FailCount = 0 // Reset fail count to give it a chance
				active = append(active, p)
			}
			// else skip
		} else {
			active = append(active, p)
		}
	}
	return active
}

func (s *PointScheduler) markPointFailed(pointID string) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if rt, ok := s.pointStates[pointID]; ok {
		rt.FailCount++
		// If failed 3 times in a row, skip for 30 seconds
		if rt.FailCount >= 3 {
			rt.State = "SKIPPED"
			rt.CooldownUntil = time.Now().Add(30 * time.Second)
			log.Printf("Point %s skipped due to repeated failures", pointID)
		}
	}
}

func (s *PointScheduler) markPointSuccess(pointID string, now time.Time) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if rt, ok := s.pointStates[pointID]; ok {
		rt.FailCount = 0
		rt.LastSuccess = now
		rt.State = "OK"
	}
}

func (s *PointScheduler) groupPoints(points []model.Point) ([]PointGroup, error) {
	if len(points) == 0 {
		return []PointGroup{}, nil
	}

	// 1. Parse address info
	addressInfos := make([]AddressInfo, len(points))
	for i, p := range points {
		regType, offset, err := s.decoder.ParseAddress(p.Address)
		if err != nil {
			return nil, err
		}
		addressInfos[i] = AddressInfo{
			Point:         p,
			RegType:       regType,
			Offset:        offset,
			RegisterCount: s.decoder.GetRegisterCount(p.DataType),
		}
	}

	// 2. Group by RegType
	typeGroups := make(map[string][]AddressInfo)
	for _, info := range addressInfos {
		typeGroups[info.RegType] = append(typeGroups[info.RegType], info)
	}

	// 3. Group by continuity
	var groups []PointGroup

	for regType, infos := range typeGroups {
		if regType == "COIL" || regType == "DISCRETE_INPUT" {
			// No optimization for boolean types for now (can be added later)
			for _, info := range infos {
				groups = append(groups, PointGroup{
					RegType:     regType,
					StartOffset: info.Offset,
					Count:       1,
					Points:      []model.Point{info.Point},
				})
			}
			continue
		}

		// Sort by offset
		sort.Slice(infos, func(i, j int) bool {
			return infos[i].Offset < infos[j].Offset
		})

		currentGroup := PointGroup{
			RegType:     regType,
			StartOffset: infos[0].Offset,
			Points:      []model.Point{infos[0].Point},
			Count:       infos[0].RegisterCount,
		}

		for i := 1; i < len(infos); i++ {
			info := infos[i]
			currentEndOffset := currentGroup.StartOffset + currentGroup.Count
			
			gap := int(info.Offset) - int(currentEndOffset)
			// Gap can be negative if overlaps (shouldn't happen with valid config but safety check)
			if gap < 0 {
				gap = 0
			}
			
			wouldExceedMax := (currentGroup.Count + uint16(gap) + info.RegisterCount) > s.maxPacketSize

			if gap <= int(s.groupThreshold) && !wouldExceedMax {
				// Merge
				newCount := info.Offset - currentGroup.StartOffset + info.RegisterCount
				currentGroup.Count = newCount
				currentGroup.Points = append(currentGroup.Points, info.Point)
			} else {
				// New group
				groups = append(groups, currentGroup)
				currentGroup = PointGroup{
					RegType:     regType,
					StartOffset: info.Offset,
					Points:      []model.Point{info.Point},
					Count:       info.RegisterCount,
				}
			}
		}
		groups = append(groups, currentGroup)
	}

	return groups, nil
}

func (s *PointScheduler) readGroup(ctx context.Context, group PointGroup) (map[string]any, error) {
	result := make(map[string]any)

	// Single point read for bools
	if group.RegType == "COIL" {
		val, err := s.transport.ReadCoil(ctx, group.StartOffset)
		if err != nil {
			return nil, err
		}
		result[group.Points[0].ID] = val
		return result, nil
	}
	if group.RegType == "DISCRETE_INPUT" {
		val, err := s.transport.ReadDiscreteInput(ctx, group.StartOffset)
		if err != nil {
			return nil, err
		}
		result[group.Points[0].ID] = val
		return result, nil
	}

	// Batch read for registers
	bytes, err := s.transport.ReadRegisters(ctx, group.RegType, group.StartOffset, group.Count)
	if err != nil {
		return nil, err
	}

	// Distribute data to points
	for _, point := range group.Points {
		_, offset, _ := s.decoder.ParseAddress(point.Address)
		regCount := s.decoder.GetRegisterCount(point.DataType)

		byteOffset := (offset - group.StartOffset) * 2
		byteLength := regCount * 2

		if int(byteOffset+byteLength) > len(bytes) {
			continue
		}

		pointBytes := bytes[byteOffset : byteOffset+byteLength]
		val, _, err := s.decoder.Decode(point, pointBytes)
		if err != nil {
			log.Printf("Error decoding point %s: %v", point.ID, err)
			continue
		}
		result[point.ID] = val
	}

	return result, nil
}
