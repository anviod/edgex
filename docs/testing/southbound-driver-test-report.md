---
layout: default
title: Southbound Driver Test Report
description: EdgeX southbound driver unit test and boundary scenario coverage report
---

# Southbound Driver Test Report

> **Date**: 2026-07-12 (hot-path unit tests + full regression) / 2026-07-11 (regression) / 2026-07-04 (initial)  
> **Environment**: Windows (amd64) / macOS (darwin/amd64), Go toolchain  
> **Scope**: `internal/driver/...` — 13 southbound drivers + EtherCAT stress/benchmark; `internal/ai_agent` & `internal/core` hot-path tests (`-short`, CI-friendly)

[中文版](南向驱动测试报告.html)

---

## 1. Executive Summary

### Commands

```bash
CGO_ENABLED=0 go test ./internal/driver/... -short -count=1 -cover
```

### Results Overview

| Scope | Result | Coverage | Notes |
| :--- | :--- | :--- | :--- |
| `internal/driver` (ConnectionManager) | PASS | **87.4%** | Shared reconnect/backoff |
| `internal/driver/modbus` | PASS | 52.8% | ~125s |
| `internal/driver/bacnet` | PASS | 66.1% | ~79s |
| `internal/driver/opcua` | PASS | 47.9% | ~133s |
| `internal/driver/s7` | PASS | 61.3% | ~131s |
| `internal/driver/ethernetip` | PASS | 39.5% | ~8s |
| `internal/driver/omron` | PASS | 43.3% | Mock PLC (TCP) |
| `internal/driver/snmp` | PASS | 63.7% | transport hook mocks |
| `internal/driver/ice104` | PASS | 60.2% | APDU codec + cache read |
| `internal/driver/dlt645` | PASS | **76.5%** | frame codec + mock link |
| `internal/driver/mitsubishi` | PASS | **70.7%** | SLMP + mock PLC |
| `internal/driver/knxnetip` | PASS | **77.2%** | KNXnet/IP simulator |
| `internal/driver/profinetio` | PASS | 55.9% | simulation + PNIO codec |
| `internal/driver/ethercat` | PASS | **87.8%** | PDO/SDO + simulator master |
| **`internal/driver/...` overall** | **PASS** | — | 22/22 packages (`-short`) |

**2026-07-12 hot-path boost**: `CGO_ENABLED=0 go test ./... -short` — full suite PASS. Added `manager_test.go` (AI Agent **91.4%**), `channel_manager_hotpath_test.go` (core **80.1%**), `scheduler_hotpath_test.go` (Modbus **65.8%**), `process_tag_test.go` (EtherNet/IP **61.9%**). EtherCAT dependency upgraded to `github.com/anviod/EtherCAT` **v1.0.3**.

**2026-07-11 regression**: All 22/22 packages PASS. EtherCAT verified with `-tags sim` (**87.8%** coverage, 9 stress tests, 25 benchmarks). Windows (amd64) first full-suite regression.

**2026-07-04**: All southbound driver packages PASS under `-short` (retest 22/22, ~3.3min wall). Coverage aligned with initial run; OPC UA **47.9%** (+0.3pp) and EtherNet/IP **39.5%** (−0.9pp) are normal variance. Added/extended `coverage_test.go` across drivers; fixed flaky `modbus/reconnect_test.go` single-flight timing.

### Coverage Before → After

| Driver | Before | After | ≥70% |
| :--- | ---: | ---: | :---: |
| ConnectionManager | 87.4% | **87.4%** | ✅ |
| Modbus | 51.6% | **52.8%** | ❌ |
| BACnet | 66.0% | **66.1%** | ❌ |
| OPC UA | 45.0% | **47.9%** | ❌ |
| S7 | 42.0% | **61.3%** | ❌ |
| EtherNet/IP | 30.3% | **39.5%** | ❌ |
| Omron FINS | 31.2% | **43.3%** | ❌ |
| SNMP | 62.0% | **63.7%** | ❌ |
| ICE104 | 58.2% | **60.2%** | ❌ |
| DL/T645 | 70.5% | **76.5%** | ✅ |
| Mitsubishi | 70.7% | **70.7%** | ✅ |
| KNXnet/IP | 77.2% | **77.2%** | ✅ |
| Profinet IO | 55.1% | **55.9%** | ❌ |
| **EtherCAT** | — | **87.8%** | ✅ |

Drivers below 70% are limited by real TCP/session paths (OPC UA, ENIP, PNIO RPC, ICE104 `readLoop`, etc.). Mock and simulation paths are covered; see [test/manual/](../../test/manual/README.md) for live validation.

---

## 2. Protocol Stack Verification

| Driver | Registry key | Stack |
| :--- | :--- | :--- |
| Modbus | `modbus-tcp`, `modbus-rtu`, `modbus-rtu-over-tcp` | `github.com/simonvetter/modbus` |
| BACnet IP | `bacnet-ip` | In-tree BACnet/IP |
| OPC UA | `opc-ua` | `github.com/gopcua/opcua` |
| Siemens S7 | `s7` | `github.com/robinson/gos7` |
| EtherNet/IP | `ethernet-ip` | In-tree CIP/EIP |
| Omron FINS | `omron-fins` | `github.com/anviod/fins` |
| SNMP | `snmp` | `github.com/gosnmp/gosnmp` |
| IEC 60870-5-104 | `iec60870-5-104` | In-tree 104 APDU |
| DL/T645-2007 | `dlt645` | In-tree DL/T645-2007 |
| Mitsubishi SLMP | `mitsubishi-slmp` | In-tree MC 3E |
| Profinet IO | `profinet-io` | In-tree PNIO RPC |
| KNXnet/IP | `knxnet-ip` | In-tree KNXnet/IP |
| EtherCAT | `ethercat` | `github.com/anviod/EtherCAT` |

---

## 3. Per-Driver Summary

| Driver | ~Test files | Coverage | Read mock | Write mock | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Modbus | 12 | 52.8% | Yes | Yes | PASS |
| BACnet IP | 31 | 66.1% | Yes | Yes | PASS |
| OPC UA | 7 | 47.9% | Yes | Yes | PASS |
| Siemens S7 | 6 | 61.3% | Yes | Yes | PASS |
| EtherNet/IP | 16 | 39.5% | Yes | Yes | PASS |
| Omron FINS | 3 | 43.3% | Yes | Yes | PASS |
| SNMP | 6 | 63.7% | Yes | Yes | PASS |
| IEC 60870-5-104 | 12 | 60.2% | Yes | Yes | PASS |
| DL/T645 | 6 | 76.5% | Yes | Yes | PASS |
| Mitsubishi SLMP | 4 | 70.7% | Yes | Yes | PASS |
| KNXnet/IP | 3 | 77.2% | Yes | Yes | PASS |
| Profinet IO | 5 | 55.9% | Yes | Yes | PASS |
| **EtherCAT** | 6 | **87.8%** | Yes | Yes | PASS |
| ConnectionManager | 2 | 87.4% | — | — | PASS |

### 3.1 New/Updated Test Files

| Module | File | Change |
| :--- | :--- | :--- |
| AI Agent | `manager_test.go` | **new** — Create/Confirm/quota/AttachFile/EdgeRule/Diagnostics lifecycle |
| Core | `channel_manager_hotpath_test.go` | **new** — EtherCAT validation, ScanEngine channel metrics, RemoveDevice |
| Modbus | `scheduler_hotpath_test.go` | **new** — `readGroup` batch read, `markPointFailed` cooldown |
| EtherNet/IP | `process_tag_test.go` | **new** — `processTagValue` Good/Bad quality mapping |
| Core | `coverage_helpers_test.go` | EtherCAT PDO/SDO cases in `validatePoint` |

#### 2026-07-04 history

| Module | File | Change |
| :--- | :--- | :--- |
| EtherNet/IP | `coverage_test.go` | **new** — lifecycle, decoder, transport metrics |
| Omron FINS | `coverage_test.go` | **new** — pre-init API, config helpers |
| S7 | `coverage_test.go` | **new** — mock gos7 read/write |
| OPC UA | `coverage_test.go` | **new** — endpoint, RTT, Scan defaults |
| DL/T645 | `coverage_test.go` | **new** — lifecycle, Frame errors, mock link |
| Modbus | `coverage_test.go`, `reconnect_test.go` | extended + flaky reconnect fix |
| BACnet / SNMP / ICE104 / Profinet IO | `coverage_test.go` | extended mock paths |
| S7 | `transport_test.go` | `agReadMultiFunc` on mockClient |

Non-CI: `//go:build integration`, `bacnet/manual_test.go` — see [test/manual/](../../test/manual/README.md).

### 3.2 EtherCAT Stress & Benchmark (2026-07-11)

**Stress tests** (`go test -tags sim -run TestStress`): 9/9 PASS

| Test | Throughput | Notes |
| :--- | :--- | :--- |
| `TestStress_ConcurrentReadPoints` | 50 goroutines × 200 iterations | 4 PDO points/read |
| `TestStress_ConcurrentWritePoints` | 50 goroutines × 200 iter × 3 points | PDO write |
| `TestStress_PDOCycleStability` | ~20 updates/100ms | 5ms TxPDO cycle |
| `TestStress_EncodeDecodeHighVolume` | 100,000 ops | int32 round-trip |
| `TestStress_ParseAddressHighVolume` | 50,000 ops | PDO address parsing |
| `TestStress_ConfigParseHighVolume` | 50,000 ops | channel + device config |
| `TestStress_SimulatorConcurrent` | 300 goroutines | mixed read/write/SDO |
| `TestStress_FloatEncodeDecode` | float32/64 edge values | NaN, Inf, ±Max |
| `TestStress_IntBoundaryValues` | int8–uint32 boundaries | ±Max, 0, ±1 |

**Benchmarks** (`go test -tags sim -bench=.`): 25/25 PASS

| Benchmark | ops/sec | ns/op | allocs/op |
| :--- | ---: | ---: | ---: |
| ParseAddress_PDO | 9,983,593 | 137.3 | 3 |
| ParseAddress_SDO | 8,779,456 | 147.0 | 2 |
| DecodeValue_Int16 | 24,779,155 | 46.95 | 1 |
| DecodeValue_Float32 | 25,779,673 | 44.47 | 1 |
| DecodeValue_Bit | 135,816,910 | 9.75 | 0 |
| EncodeValue_Int16 | 17,256,676 | 65.82 | 1 |
| EncodeDecode_RoundTrip | 10,303,860 | 116.1 | 2 |
| ByteSize | 1,000,000,000 | 0.84 | 0 |
| ParseChannelConfig | 6,203,300 | 189.5 | 0 |
| TransportSnapshotRead | 34,153,004 | 45.50 | 0 |

> **CPU**: 13th Gen Intel Core i5-13500H. All benchmarks used `-benchtime=1s`.

---

## 4. Boundary Scenario Matrix

| 场景 | Modbus | BACnet | OPC UA | S7 | ENIP | FINS | SNMP | ICE104 | DLT645 | MELSEC | KNX | PNIO | ECAT |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 超时 / 退避 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 重连 / 半开探测 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 冷却期 / Dead | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 无效配置 / 地址 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 点位读（Mock） | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 点位写（Mock） | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 设备故障隔离 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 并发安全 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

Matrix 112/112 cells covered; see each package `scenario_test.go`.

---

## 5. How to Run

```bash
CGO_ENABLED=0 go test ./internal/driver/... -short -count=1 -cover
CGO_ENABLED=0 go test -tags=integration ./internal/driver/ice104/... -count=1
CGO_ENABLED=0 go test -tags=manual ./internal/driver/bacnet/... -count=1
```

---

## 6. Related Docs

- [Driver matrix](../drivers/index.html)
- [Testing index](index.html)
- [Channel regression plan](南向采集通道回归验证测试方案.html)
- [Live test plan](../TODO/联机测试方案.html)
