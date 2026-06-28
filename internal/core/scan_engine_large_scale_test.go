//go:build integration

package core

import (
	"testing"
	"time"
)

type StressTestResult struct {
	TotalTasks         int
	ExecutedTasks      int64
	FailedTasks        int64
	TotalDuration      time.Duration
	MinLatency         time.Duration
	MaxLatency         time.Duration
	AvgLatency         time.Duration
	GoroutinePeak      int32
	ConnectionPeak     int32
	QueuePeak          int
	Throughput         float64
}

func TestScanEngine_SerialProtocolIsolation(t *testing.T) {
	config := ScanEngineConfig{
		TickInterval:      10 * time.Millisecond,
		WorkerCount:       16,
		MaxQueueSize:      10000,
		AntiStarvationSec: 300,
		GoroutineLimit:    100,
		ConnectionLimit:   50,
	}

	se := NewScanEngine(config)
	se.RegisterProtocol("modbus-rtu", ProtocolTypeSerial)

	const deviceCount = 20

	for i := 0; i < deviceCount; i++ {
		deviceKey := "serial_isolation_" + string(rune('A'+i%26))
		se.AddTask(deviceKey, "modbus-rtu", 50*time.Millisecond, 5, []string{"point1", "point2"}, nil)
		se.RegisterDriver(deviceKey, &mockStressDriver{})
	}

	se.Run()
	time.Sleep(5 * time.Second)
	se.Stop()

	t.Logf("Serial protocol isolation test completed with %d devices", deviceCount)
}

func TestScanEngine_ParallelProtocolBackpressure(t *testing.T) {
	config := ScanEngineConfig{
		TickInterval:      10 * time.Millisecond,
		WorkerCount:       8,
		MaxQueueSize:      1000,
		AntiStarvationSec: 300,
		GoroutineLimit:    20,
		ConnectionLimit:   10,
	}

	se := NewScanEngine(config)
	se.RegisterProtocol("opc-ua", ProtocolTypeParallel)

	const deviceCount = 50

	for i := 0; i < deviceCount; i++ {
		deviceKey := "parallel_backpressure_" + string(rune('A'+i%26)) + "_" + string(rune('0'+i/26))
		se.AddTask(deviceKey, "opc-ua", 20*time.Millisecond, 3, []string{"point1"}, nil)
		se.RegisterDriver(deviceKey, &mockStressDriver{})
	}

	se.Run()
	time.Sleep(10 * time.Second)
	se.Stop()

	t.Logf("Parallel protocol backpressure test completed with %d devices", deviceCount)
}

func TestScanEngine_MixedProtocolStressTest(t *testing.T) {
	config := ScanEngineConfig{
		TickInterval:      10 * time.Millisecond,
		WorkerCount:       32,
		MaxQueueSize:      50000,
		AntiStarvationSec: 300,
		GoroutineLimit:    256,
		ConnectionLimit:   80,
	}

	se := NewScanEngine(config)

	se.RegisterProtocol("modbus-rtu", ProtocolTypeSerial)
	se.RegisterProtocol("modbus-tcp", ProtocolTypeParallel)
	se.RegisterProtocol("opc-ua", ProtocolTypeParallel)

	const rtuCount = 30
	const tcpCount = 40
	const opcCount = 30

	for i := 0; i < rtuCount; i++ {
		deviceKey := "mixed_rtu_" + string(rune('A'+i%26)) + "_" + string(rune('0'+i/26))
		se.AddTask(deviceKey, "modbus-rtu", 100*time.Millisecond, 5, []string{"p1", "p2", "p3"}, nil)
		se.RegisterDriver(deviceKey, &mockStressDriver{})
	}

	for i := 0; i < tcpCount; i++ {
		deviceKey := "mixed_tcp_" + string(rune('A'+i%26)) + "_" + string(rune('0'+i/26))
		se.AddTask(deviceKey, "modbus-tcp", 50*time.Millisecond, 3, []string{"p1", "p2"}, nil)
		se.RegisterDriver(deviceKey, &mockStressDriver{})
	}

	for i := 0; i < opcCount; i++ {
		deviceKey := "mixed_opc_" + string(rune('A'+i%26)) + "_" + string(rune('0'+i/26))
		se.AddTask(deviceKey, "opc-ua", 100*time.Millisecond, 2, []string{"p1"}, nil)
		se.RegisterDriver(deviceKey, &mockStressDriver{})
	}

	t.Logf("Mixed protocol test: %d RTU + %d TCP + %d OPC = %d devices",
		rtuCount, tcpCount, opcCount, rtuCount+tcpCount+opcCount)

	se.Run()
	time.Sleep(20 * time.Second)
	se.Stop()

	t.Logf("Mixed protocol stress test completed")
}