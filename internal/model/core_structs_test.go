package model

import (
	"testing"
	"time"
)

// TestProtocolConfig 测试ProtocolConfig结构体
func TestProtocolConfig(t *testing.T) {
	// 测试创建ProtocolConfig
	config := ProtocolConfig{
		HeartbeatInterval: 60,
	}

	// 测试字段值
	if config.HeartbeatInterval != 60 {
		t.Errorf("Expected HeartbeatInterval to be 60, got %d", config.HeartbeatInterval)
	}
}

// TestRTTNode 测试RTTNode结构体
func TestRTTNode(t *testing.T) {
	// 测试创建RTTNode
	sendTS := time.Now()
	recvTS := sendTS.Add(10 * time.Millisecond)
	rtt := recvTS.Sub(sendTS).Microseconds()

	node := RTTNode{
		SeqNo:     1,
		SendTS:    sendTS,
		RecvTS:    recvTS,
		AckStatus: true,
		RTT:       rtt,
	}

	// 测试字段值
	if node.SeqNo != 1 {
		t.Errorf("Expected SeqNo to be 1, got %d", node.SeqNo)
	}

	if !node.SendTS.Equal(sendTS) {
		t.Errorf("Expected SendTS to be %v, got %v", sendTS, node.SendTS)
	}

	if !node.RecvTS.Equal(recvTS) {
		t.Errorf("Expected RecvTS to be %v, got %v", recvTS, node.RecvTS)
	}

	if node.AckStatus != true {
		t.Errorf("Expected AckStatus to be true, got %v", node.AckStatus)
	}

	if node.RTT != rtt {
		t.Errorf("Expected RTT to be %d, got %d", rtt, node.RTT)
	}
}

// TestMTUNegotiationRecord 测试MTUNegotiationRecord结构体
func TestMTUNegotiationRecord(t *testing.T) {
	// 测试创建MTUNegotiationRecord
	timestamp := time.Now()

	record := MTUNegotiationRecord{
		AttemptValue: 1500,
		ResponseTime: 1000,
		RetryCount:   0,
		Success:      true,
		Timestamp:    timestamp,
	}

	// 测试字段值
	if record.AttemptValue != 1500 {
		t.Errorf("Expected AttemptValue to be 1500, got %d", record.AttemptValue)
	}

	if record.ResponseTime != 1000 {
		t.Errorf("Expected ResponseTime to be 1000, got %d", record.ResponseTime)
	}

	if record.RetryCount != 0 {
		t.Errorf("Expected RetryCount to be 0, got %d", record.RetryCount)
	}

	if record.Success != true {
		t.Errorf("Expected Success to be true, got %v", record.Success)
	}

	if !record.Timestamp.Equal(timestamp) {
		t.Errorf("Expected Timestamp to be %v, got %v", timestamp, record.Timestamp)
	}
}

// TestBatchReadSnapshot 测试BatchReadSnapshot结构体
func TestBatchReadSnapshot(t *testing.T) {
	// 测试创建BatchReadSnapshot
	snapshot := BatchReadSnapshot{
		CurrentGap:     64,
		MaxGap:         256,
		MergedRequests: 10,
		SavedRequests:  90,
		FillEfficiency: 0.85,
	}

	// 测试字段值
	if snapshot.CurrentGap != 64 {
		t.Errorf("Expected CurrentGap to be 64, got %d", snapshot.CurrentGap)
	}

	if snapshot.MaxGap != 256 {
		t.Errorf("Expected MaxGap to be 256, got %d", snapshot.MaxGap)
	}

	if snapshot.MergedRequests != 10 {
		t.Errorf("Expected MergedRequests to be 10, got %d", snapshot.MergedRequests)
	}

	if snapshot.SavedRequests != 90 {
		t.Errorf("Expected SavedRequests to be 90, got %d", snapshot.SavedRequests)
	}

	if snapshot.FillEfficiency != 0.85 {
		t.Errorf("Expected FillEfficiency to be 0.85, got %f", snapshot.FillEfficiency)
	}
}

// TestCoreStructsPerformance 测试核心结构体的性能
func TestCoreStructsPerformance(t *testing.T) {
	// 测试结构体创建性能
	start := time.Now()
	for i := 0; i < 100000; i++ {
		_ = ProtocolConfig{
			HeartbeatInterval: 60,
		}
	}
	duration := time.Since(start)
	t.Logf("ProtocolConfig creation time for 100,000 instances: %v", duration)

	start = time.Now()
	for i := 0; i < 100000; i++ {
		sendTS := time.Now()
		recvTS := sendTS.Add(10 * time.Millisecond)
		rtt := recvTS.Sub(sendTS).Microseconds()

		_ = RTTNode{
			SeqNo:     uint16(i),
			SendTS:    sendTS,
			RecvTS:    recvTS,
			AckStatus: true,
			RTT:       rtt,
		}
	}
	duration = time.Since(start)
	t.Logf("RTTNode creation time for 100,000 instances: %v", duration)

	start = time.Now()
	for i := 0; i < 100000; i++ {
		timestamp := time.Now()

		_ = MTUNegotiationRecord{
			AttemptValue: 1500,
			ResponseTime: 1000,
			RetryCount:   0,
			Success:      true,
			Timestamp:    timestamp,
		}
	}
	duration = time.Since(start)
	t.Logf("MTUNegotiationRecord creation time for 100,000 instances: %v", duration)

	start = time.Now()
	for i := 0; i < 100000; i++ {
		_ = BatchReadSnapshot{
			CurrentGap:     64,
			MaxGap:         256,
			MergedRequests: uint64(i),
			SavedRequests:  uint64(1000 - i),
			FillEfficiency: 0.85,
		}
	}
	duration = time.Since(start)
	t.Logf("BatchReadSnapshot creation time for 100,000 instances: %v", duration)
}

// TestCoreStructsMemory 测试核心结构体的内存使用
func TestCoreStructsMemory(t *testing.T) {
	// 计算单个结构体的内存大小
	configSize := int64(4) // 1 int field
	t.Logf("ProtocolConfig size: %d bytes", configSize)

	// 估算time.Time大小（在64位系统上约为16字节）
	timeSize := int64(16)
	nodeSize := int64(2) + int64(2*timeSize) + int64(1) + int64(8)
	t.Logf("RTTNode size: %d bytes", nodeSize)

	recordSize := int64(4) + int64(8) + int64(4) + int64(1) + timeSize
	t.Logf("MTUNegotiationRecord size: %d bytes", recordSize)

	snapshotSize := int64(4) + int64(4) + int64(8) + int64(8) + int64(8)
	t.Logf("BatchReadSnapshot size: %d bytes", snapshotSize)

	// 计算1000个实例的内存大小
	t.Logf("1000 ProtocolConfig instances: %d bytes", configSize*1000)
	t.Logf("1000 RTTNode instances: %d bytes", nodeSize*1000)
	t.Logf("1000 MTUNegotiationRecord instances: %d bytes", recordSize*1000)
	t.Logf("1000 BatchReadSnapshot instances: %d bytes", snapshotSize*1000)
}

func TestDevice_WithPointsSummary(t *testing.T) {
	dev := Device{
		ID: "dev-1",
		Points: []Point{
			{ID: "p1", Name: "P1"},
			{ID: "p2", Name: "P2"},
		},
	}
	summary := dev.WithPointsSummary()
	if len(summary.Points) != 0 {
		t.Fatalf("expected points stripped, got %d", len(summary.Points))
	}
	if summary.PointsCount != 2 {
		t.Fatalf("points_count = %d, want 2", summary.PointsCount)
	}
}
