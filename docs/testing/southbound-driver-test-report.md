---
layout: default
title: Southbound Driver Test Report
description: EdgeX southbound driver unit, performance, and boundary scenario test report
---

# Southbound Driver Test Report

> **Date**: 2026-06-28  
> **Environment**: macOS (darwin), Go toolchain, `CGO_ENABLED=0`  
> **Scope**: `internal/driver/...`, `internal/core/...`, `internal/integration/...`

[中文版](南向驱动测试报告.html)

---

## 1. Executive Summary

### Commands

```bash
CGO_ENABLED=0 go test ./internal/driver/... -count=1 -cover
CGO_ENABLED=0 go test ./internal/core/... -count=1 -cover
CGO_ENABLED=0 go test ./internal/integration/... -count=1
CGO_ENABLED=0 go test -bench=. -benchmem ./internal/driver/ethernetip ./internal/driver/profinetio ./internal/driver/dlt645 -run=^$ -count=1
```

| Scope | Result | Coverage | Notes |
| :--- | :--- | :--- | :--- |
| `internal/driver/*` (main packages) | PASS | 12–70% | All 12 production drivers |
| `internal/driver/modbus` | PASS | 27.0% | ~122s (includes scenario tests) |
| `internal/driver/bacnet` | PASS | 59.1% | ~85s |
| `internal/driver/opcua` | PASS | 40.3% | ~127s |
| `internal/driver/s7` | PASS | 42.0% | ~122s |
| `internal/driver/ethernetip` | PASS | 30.3% | — |
| `internal/driver/omron` | PASS | 31.2% | Mock PLC read/write |
| `internal/driver/snmp` | PASS | 44.8% | gosnmp + transport hooks |
| `internal/driver/ice104` | PASS | 44.9% | APDU codec + cache/command |
| `internal/driver/dlt645` | PASS | 70.5% | Real frame codec + mock link |
| `internal/driver/mitsubishi` | PASS | 57.3% | SLMP frames + mock PLC |
| `internal/driver/knxnetip` | PASS | 66.7% | KNXnet/IP simulator |
| `internal/driver/profinetio` | PASS | 49.0% | PNIO RPC + simulation mode |
| **`internal/driver/...` overall** | **PASS** | — | Includes bacnet sub-packages |
| `internal/core/...` | PASS | 48.0% | VirtualShadowEngine pipeline |
| `internal/integration/...` | PASS | — | Channel add regression |

**Conclusion**: All 12 southbound drivers use **real protocol stacks** on production code paths (not stubs). Unit, boundary, and benchmark tests pass under `CGO_ENABLED=0`.

---

## 2. Real Protocol Implementation Verification

| Driver | Registry Key | Production Stack | Notes |
| :--- | :--- | :--- | :--- |
| Modbus | `modbus-tcp`, `modbus-rtu`, `modbus-rtu-over-tcp` | `github.com/simonvetter/modbus` | TCP/RTU/RTU-over-TCP, ConnectionManager |
| BACnet IP | `bacnet-ip` | In-tree BACnet/IP stack | BVLC, APDU, Read/WriteProperty, fault isolation |
| OPC UA | `opc-ua` | `github.com/gopcua/opcua` | Client connect, browse, read/write |
| Siemens S7 | `s7` | `github.com/robinson/gos7` | S7comm read/write, PLC model support |
| EtherNet/IP | `ethernet-ip` | In-tree CIP/EIP | Register/session, Tag read/write |
| Omron FINS | `omron-fins` | `github.com/anviod/fins` | FINS TCP/UDP frame I/O |
| SNMP | `snmp` | `github.com/gosnmp/gosnmp` | v2c/v3 GET/SET, ScanObjects |
| IEC 60870-5-104 | `iec60870-5-104` | In-tree 104 APDU | STARTDT/TESTFR, cache read, single command |
| DL/T645-2007 | `dlt645` | In-tree DL/T645-2007 | Serial/TCP frame codec, meter address/DI |
| Mitsubishi SLMP | `mitsubishi-slmp` | In-tree MC Protocol 3E | SLMP batch read/write |
| Profinet IO | `profinet-io` | In-tree PNIO RPC (TCP 34964) | Acyclic record read/write; simulation mode for CI |
| KNXnet/IP | `knxnet-ip` | In-tree KNXnet/IP | Tunneling UDP/TCP, group address I/O |

---

## 3. Per-Driver Unit Test Summary

| Driver | Test Files | ~Tests | Coverage | Read | Write | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| Modbus | 7 | 33 | 27.0% | Yes | Yes | Pass |
| BACnet IP | 28+ | 80+ | 59.1% | Yes | Yes | Pass |
| OPC UA | 5 | 25 | 40.3% | Yes | Yes | Pass |
| Siemens S7 | 5 | 52 | 42.0% | Yes | Yes | Pass |
| EtherNet/IP | 14 | 60 | 30.3% | Yes | Yes | Pass |
| Omron FINS | 2 | 12 | 31.2% | Yes | Yes | Pass |
| SNMP | 4 | 22 | 44.8% | Yes | Yes | Pass |
| IEC 60870-5-104 | 4 | 16 | 44.9% | Yes | Yes | Pass |
| DL/T645 | 4 | 24 | 70.5% | Yes | Yes | Pass |
| Mitsubishi SLMP | 3 | 13 | 57.3% | Yes | Yes | Pass |
| KNXnet/IP | 2 | 13 | 66.7% | Yes | Yes | Pass |
| Profinet IO | 3 | 11 | 49.0% | Yes | Yes | Pass |

**Legend (Read/Write)**: Mock/simulator/simulation-mode `ReadPoints` / `WritePoint` unit tests

### Key Test Files

| Driver | Key Test Files | Coverage |
| :--- | :--- | :--- |
| Modbus | `scenario_test.go`, `decoder_*_test.go`, `modbus_optimization_test.go` | Connection, decode, read/write, MTU |
| BACnet | `scenario_test.go`, `isolation_test.go`, `acceptance_test.go` | Fault isolation, discovery, read/write |
| OPC UA | `scenario_test.go`, `opcua_test.go` | Connection, read/write, data format |
| S7 | `scenario_test.go`, `decoder_test.go`, `connection_manager_test.go` | Address parse, backoff, read/write |
| EtherNet/IP | `scenario_test.go`, `integration_test.go`, `scheduler_perf_test.go` | Reconnect, tag grouping, benchmarks |
| SNMP | `scenario_test.go`, `scheduler_test.go`, `decoder_test.go` | v2c/v3 config, mock GET/SET |
| ICE104 | `scenario_test.go`, `scheduler_test.go`, `decoder_test.go` | Cache read, command write, APDU |
| Omron FINS | `scenario_test.go`, `fins_test.go` | Mock PLC read/write, concurrency |
| DL/T645 | `scenario_test.go`, `decoder_test.go`, `scheduler_test.go` | Frame codec, backoff, mock link |
| Mitsubishi SLMP | `scenario_test.go`, `mitsubishi_test.go`, `address_test.go` | SLMP mock PLC, retry, concurrency |
| KNXnet/IP | `knxnetip_test.go`, `scenario_test.go` | Simulator UDP/TCP, discovery, concurrency |
| Profinet IO | `scenario_test.go`, `decoder_test.go`, `decoder_benchmark_test.go` | Simulation I/O, PNIO decode, backoff |

---

## 4. Performance / Benchmark Results

Environment: Intel Core i5-5257U @ 2.70GHz, darwin/amd64, `CGO_ENABLED=0`

### EtherNet/IP scheduler

| Benchmark | Result | Allocations |
| :--- | :--- | :--- |
| `GroupTags_100_Points` | 1985 ns/op | 1640 B/op, 6 allocs |
| `PointParsing` | 7340 ns/op | 499 B/op, 12 allocs |
| `StatsIncrement` | 16.70 ns/op | 0 allocs |
| `TagGroup_Add_100` | 61986 ns/op | 8582 B/op, 200 allocs |

### Profinet IO decoder

| Benchmark | Result | Allocations |
| :--- | :--- | :--- |
| `DecodeValue` | 93.78 ns/op | 8 B/op, 2 allocs |
| `EncodeValue` | 142.4 ns/op | 4 B/op, 1 allocs |

### DL/T645 frame codec

| Benchmark | Result | Allocations |
| :--- | :--- | :--- |
| `BuildFrame` | 24.31 ns/op | 0 allocs |
| `DecodeFrame` | 132.1 ns/op | 40 B/op, 2 allocs |

```bash
CGO_ENABLED=0 go test -bench=. -benchmem ./internal/driver/ethernetip ./internal/driver/profinetio ./internal/driver/dlt645 -run=^$ -count=1
```

---

## 5. Boundary Scenario Coverage Matrix

| Scenario | Modbus | BACnet | OPC UA | S7 | ENIP | FINS | SNMP | ICE104 | DLT645 | MELSEC | KNX | PNIO | Core |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Timeout / backoff | Yes | Yes | Yes | Yes | Yes | — | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Reconnect / half-open | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Cooldown / Dead state | Yes | Yes | Yes | Yes | Yes | — | — | — | Yes | — | — | — | — |
| Invalid config / address | Yes | Yes | — | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Read (mock/sim) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | — |
| Write (mock/sim) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | — |
| Fault isolation | — | Yes | — | — | — | — | — | — | — | — | — | — | — |
| Concurrency | Yes | — | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |

**Legend**: Yes = dedicated test · — = not covered

---

## 6. Known Gaps and Risks

| Item | Description | Recommendation |
| :--- | :--- | :--- |
| Profinet IO live device | CI uses simulation mode; real PNIO IO exchange needs hardware | Add live-station RPC/IO tests |
| SNMP / ICE104 / DL/T645 live CI | Unit tests use mock/simulator | See [Online Test Plan](../TODO/联机测试方案.html) |
| ShadowCore benchmarks | `integration` build tag compile conflict | Merge mock definitions or split tags |
| Coverage | 27–70% per driver | Continue scenario and integration tests |

---

## 7. How to Run Locally

```bash
CGO_ENABLED=0 go test ./internal/driver/... ./internal/core/... -count=1 -cover
CGO_ENABLED=0 go test ./internal/driver/snmp -v -count=1
CGO_ENABLED=0 go test -bench=. -benchmem ./internal/driver/ethernetip -run=^$ -count=1
CGO_ENABLED=0 go test ./internal/integration/... -count=1
```

---

## Related Docs

- [Driver Matrix (CN)](../drivers/index.html) · [Driver Matrix (EN)](../drivers/index_en.html)
- [Channel Regression Plan](南向采集通道回归验证测试方案.html)
- [Online Test Plan](../TODO/联机测试方案.html)
