package ethernetip

import (
	"context"
	"fmt"
	"math"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"edge-gateway/internal/model"

	go_ethernet_ip "github.com/anviod/ethernet-ip"
	"go.uber.org/zap"
)

type ENIPScheduler struct {
	transport *ENIPTransport
	decoder   *ENIPDecoder

	batchReadMax int
	minInterval  time.Duration

	totalRequests int64
	successCount  int64
	failureCount  int64
	mu            sync.Mutex
}

func NewENIPScheduler(transport *ENIPTransport, decoder *ENIPDecoder, cfg map[string]any) *ENIPScheduler {
	s := &ENIPScheduler{
		transport:    transport,
		decoder:      decoder,
		batchReadMax: 50,
		minInterval:  5 * time.Millisecond,
	}

	if v, ok := cfg["batch_read_max"]; ok {
		switch val := v.(type) {
		case float64:
			s.batchReadMax = int(val)
		case int:
			s.batchReadMax = val
		}
	}

	if s.batchReadMax > 50 {
		s.batchReadMax = 50
	}

	return s
}

type pointWithTag struct {
	Point model.Point
	Tag   *ENIPTag
}

func (s *ENIPScheduler) ReadPoints(ctx context.Context, points []model.Point) (map[string]model.Value, error) {
	results := make(map[string]model.Value)

	tcp := s.transport.GetClient()
	if tcp == nil {
		return nil, fmt.Errorf("ENIP client not connected")
	}

	var parsed []pointWithTag
	for _, p := range points {
		tag, err := s.decoder.ParseAddress(p.Address)
		if err != nil {
			zap.L().Warn("[ENIP] Failed to parse address",
				zap.String("point", p.Name),
				zap.String("address", p.Address),
				zap.Error(err),
			)
			results[p.ID] = model.Value{
				PointID: p.ID,
				Quality: "Bad",
				TS:      time.Now(),
			}
			s.incFailure()
			continue
		}
		parsed = append(parsed, pointWithTag{Point: p, Tag: tag})
	}

	if len(parsed) == 0 {
		return results, nil
	}

	groups := s.groupTags(parsed)

	for _, group := range groups {
		if err := s.readGroup(ctx, tcp, group, results); err != nil {
			zap.L().Warn("[ENIP] Failed to read group",
				zap.Error(err),
			)
		}
	}

	return results, nil
}

func (s *ENIPScheduler) groupTags(points []pointWithTag) [][]pointWithTag {
	if len(points) <= s.batchReadMax {
		return [][]pointWithTag{points}
	}

	var groups [][]pointWithTag
	for i := 0; i < len(points); i += s.batchReadMax {
		end := i + s.batchReadMax
		if end > len(points) {
			end = len(points)
		}
		groups = append(groups, points[i:end])
	}

	return groups
}

func (s *ENIPScheduler) readGroup(ctx context.Context, tcp *go_ethernet_ip.EIPTCP, points []pointWithTag, results map[string]model.Value) error {
	if len(points) == 0 {
		return nil
	}

	s.incTotal()

	for _, pwt := range points {
		fullName := pwt.Tag.Name
		if pwt.Tag.ArrayIndex >= 0 {
			fullName = fmt.Sprintf("%s[%d]", pwt.Tag.Name, pwt.Tag.ArrayIndex)
		}
		if len(pwt.Tag.Path) > 1 {
			fullName = strings.Join(pwt.Tag.Path, ".")
		}

		tag := new(go_ethernet_ip.Tag)

		zap.L().Info("[ENIP] Attempting to initialize tag",
			zap.String("name", fullName),
			zap.Bool("connected", tcp.IsConnected()),
		)

		err := tcp.InitializeTag(fullName, tag)
		if err != nil {
			zap.L().Warn("[ENIP] Failed to initialize tag",
				zap.String("name", fullName),
				zap.Error(err),
			)
			results[pwt.Point.ID] = model.Value{
				PointID: pwt.Point.ID,
				Quality: "Bad",
				TS:      time.Now(),
			}
			s.incFailure()
			continue
		}

		err = tag.Read()
		if err != nil {
			zap.L().Warn("[ENIP] Failed to read tag",
				zap.String("name", fullName),
				zap.Error(err),
			)
			results[pwt.Point.ID] = model.Value{
				PointID: pwt.Point.ID,
				Quality: "Bad",
				TS:      time.Now(),
			}
			s.incFailure()
			continue
		}

		val := tag.GetValue()
		if val == nil {
			zap.L().Warn("[ENIP] Tag value is nil",
				zap.String("name", fullName),
			)
			results[pwt.Point.ID] = model.Value{
				PointID: pwt.Point.ID,
				Quality: "Bad",
				TS:      time.Now(),
			}
			s.incFailure()
			continue
		}

		results[pwt.Point.ID] = model.Value{
			PointID: pwt.Point.ID,
			Value:   val,
			Quality: "Good",
			TS:      time.Now(),
		}
		s.incSuccess()
	}

	return nil
}

func (s *ENIPScheduler) WritePoint(ctx context.Context, p model.Point, value interface{}) error {
	tcp := s.transport.GetClient()
	if tcp == nil {
		return fmt.Errorf("ENIP client not connected")
	}

	tagInfo, err := s.decoder.ParseAddress(p.Address)
	if err != nil {
		return fmt.Errorf("invalid ENIP tag address %s: %w", p.Address, err)
	}

	fullName := tagInfo.Name
	if tagInfo.ArrayIndex >= 0 {
		fullName = fmt.Sprintf("%s[%d]", tagInfo.Name, tagInfo.ArrayIndex)
	}
	if len(tagInfo.Path) > 1 {
		fullName = strings.Join(tagInfo.Path, ".")
	}

	tag := new(go_ethernet_ip.Tag)
	tag.TCP = tcp
	tag.Lock = new(sync.Mutex)
	tcp.InitializeTag(fullName, tag)

	switch v := value.(type) {
	case bool:
		if v {
			tag.SetInt32(1)
		} else {
			tag.SetInt32(0)
		}
	case int:
		if v > math.MaxInt32 || v < math.MinInt32 {
			return fmt.Errorf("int value %d exceeds int32 range", v)
		}
		tag.SetInt32(int32(v))
	case int32:
		tag.SetInt32(v)
	case int64:
		if v > math.MaxInt32 || v < math.MinInt32 {
			return fmt.Errorf("int64 value %d exceeds int32 range", v)
		}
		tag.SetInt32(int32(v))
	case float32:
		tag.SetInt32(int32(v))
	case float64:
		tag.SetInt32(int32(v))
	case string:
		switch strings.ToUpper(p.DataType) {
		case "BOOL":
			boolVal, err := strconv.ParseBool(v)
			if err != nil {
				return fmt.Errorf("invalid bool value: %w", err)
			}
			if boolVal {
				tag.SetInt32(1)
			} else {
				tag.SetInt32(0)
			}
		case "INT", "SINT":
			intVal, err := strconv.ParseInt(v, 10, 32)
			if err != nil {
				return fmt.Errorf("invalid int value: %w", err)
			}
			tag.SetInt32(int32(intVal))
		case "UINT", "USINT":
			uintVal, err := strconv.ParseUint(v, 10, 32)
			if err != nil {
				return fmt.Errorf("invalid uint value: %w", err)
			}
			tag.SetInt32(int32(uintVal))
		case "DINT":
			intVal, err := strconv.ParseInt(v, 10, 32)
			if err != nil {
				return fmt.Errorf("invalid dint value: %w", err)
			}
			tag.SetInt32(int32(intVal))
		case "UDINT":
			uintVal, err := strconv.ParseUint(v, 10, 32)
			if err != nil {
				return fmt.Errorf("invalid udint value: %w", err)
			}
			tag.SetInt32(int32(uintVal))
		case "LINT":
			intVal, err := strconv.ParseInt(v, 10, 64)
			if err != nil {
				return fmt.Errorf("invalid lint value: %w", err)
			}
			if intVal > math.MaxInt32 || intVal < math.MinInt32 {
				return fmt.Errorf("lint value %d exceeds int32 range, library does not support int64 write", intVal)
			}
			tag.SetInt32(int32(intVal))
		case "ULINT":
			uintVal, err := strconv.ParseUint(v, 10, 64)
			if err != nil {
				return fmt.Errorf("invalid ulint value: %w", err)
			}
			if uintVal > math.MaxUint32 {
				return fmt.Errorf("ulint value %d exceeds uint32 range, library does not support uint64 write", uintVal)
			}
			tag.SetInt32(int32(uintVal))
		case "REAL":
			floatVal, err := strconv.ParseFloat(v, 32)
			if err != nil {
				return fmt.Errorf("invalid real value: %w", err)
			}
			tag.SetInt32(int32(floatVal))
		case "LREAL":
			floatVal, err := strconv.ParseFloat(v, 64)
			if err != nil {
				return fmt.Errorf("invalid lreal value: %w", err)
			}
			tag.SetInt32(int32(floatVal))
		default:
			tag.SetString(v)
		}
	default:
		return fmt.Errorf("unsupported value type: %T", value)
	}

	if err := tag.Write(); err != nil {
		return fmt.Errorf("write failed for %s: %w", fullName, err)
	}

	return nil
}

func (s *ENIPScheduler) GetStats() (totalRequests, successCount, failureCount int64) {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.totalRequests, s.successCount, s.failureCount
}

func (s *ENIPScheduler) incTotal() {
	atomic.AddInt64(&s.totalRequests, 1)
}

func (s *ENIPScheduler) incSuccess() {
	atomic.AddInt64(&s.successCount, 1)
}

func (s *ENIPScheduler) incFailure() {
	atomic.AddInt64(&s.failureCount, 1)
}
