---
layout: default
title: Southbound Driver Test Report
description: EdgeX southbound driver unit test and boundary scenario coverage report
---

# Southbound Driver Test Report

> **Date**: 2026-07-04  
> **Environment**: macOS (darwin/amd64), Go toolchain, `CGO_ENABLED=0`  
> **Scope**: `internal/driver/...` — twelve southbound drivers, `-short` CI-friendly

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
| `internal/driver/modbus` | PASS | 52.8% | ~122s |
| `internal/driver/bacnet` | PASS | 66.1% | ~77s |
| `internal/driver/opcua` | PASS | 47.6% | ~125s |
| `internal/driver/s7` | PASS | 61.3% | ~126s |
| `internal/driver/ethernetip` | PASS | 40.4% | ~5s |
| `internal/driver/omron` | PASS | 43.3% | Mock PLC (TCP) |
| `internal/driver/snmp` | PASS | 63.7% | transport hook mocks |
| `internal/driver/ice104` | PASS | 60.2% | APDU codec + cache read |
| `internal/driver/dlt645` | PASS | **76.5%** | frame codec + mock link |
| `internal/driver/mitsubishi` | PASS | **70.7%** | SLMP + mock PLC |
| `internal/driver/knxnetip` | PASS | **77.2%** | KNXnet/IP simulator |
| `internal/driver/profinetio` | PASS | 55.9% | simulation + PNIO codec |
| **`internal/driver/...` overall** | **PASS** | — | 21/21 packages (`-short`) |

**2026-07-04**: All southbound driver packages PASS under `-short`. Added/extended `coverage_test.go` across drivers; fixed flaky `modbus/reconnect_test.go` single-flight timing.

### Coverage Before → After

| Driver | Before | After | ≥70% |
| :--- | ---: | ---: | :---: |
| ConnectionManager | 87.4% | **87.4%** | ✅ |
| Modbus | 51.6% | **52.8%** | ❌ |
| BACnet | 66.0% | **66.1%** | ❌ |
| OPC UA | 45.0% | **47.6%** | ❌ |
| S7 | 42.0% | **61.3%** | ❌ |
| EtherNet/IP | 30.3% | **40.4%** | ❌ |
| Omron FINS | 31.2% | **43.3%** | ❌ |
| SNMP | 62.0% | **63.7%** | ❌ |
| ICE104 | 58.2% | **60.2%** | ❌ |
| DL/T645 | 70.5% | **76.5%** | ✅ |
| Mitsubishi | 70.7% | **70.7%** | ✅ |
| KNXnet/IP | 77.2% | **77.2%** | ✅ |
| Profinet IO | 55.1% | **55.9%** | ❌ |

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

---

## 3. Per-Driver Summary

| Driver | ~Test files | Coverage | Read mock | Write mock | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Modbus | 12 | 52.8% | Yes | Yes | PASS |
| BACnet IP | 31 | 66.1% | Yes | Yes | PASS |
| OPC UA | 7 | 47.6% | Yes | Yes | PASS |
| Siemens S7 | 6 | 61.3% | Yes | Yes | PASS |
| EtherNet/IP | 16 | 40.4% | Yes | Yes | PASS |
| Omron FINS | 3 | 43.3% | Yes | Yes | PASS |
| SNMP | 6 | 63.7% | Yes | Yes | PASS |
| IEC 60870-5-104 | 12 | 60.2% | Yes | Yes | PASS |
| DL/T645 | 6 | 76.5% | Yes | Yes | PASS |
| Mitsubishi SLMP | 4 | 70.7% | Yes | Yes | PASS |
| KNXnet/IP | 3 | 77.2% | Yes | Yes | PASS |
| Profinet IO | 5 | 55.9% | Yes | Yes | PASS |
| ConnectionManager | 2 | 87.4% | — | — | PASS |

### 3.1 New/Updated Test Files (2026-07-04)

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

---

## 4. Boundary Scenario Matrix

All 104 cells covered (timeout, reconnect, Dead, invalid config, mock read/write, fault isolation, concurrency). See each package `scenario_test.go`.

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
- [Testing index](index.md)
- [Channel regression plan](南向采集通道回归验证测试方案.html)
- [Live test plan](../TODO/联机测试方案.html)
