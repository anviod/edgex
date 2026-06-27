---
layout: default
title: Southbound Driver Test Report
description: EdgeX southbound driver unit, performance, and boundary scenario test report
---

# Southbound Driver Test Report

> **Date**: 2026-06-27  
> **Environment**: macOS (darwin), Go toolchain, `CGO_ENABLED=0`  
> **Scope**: `internal/driver/...` and related `internal/core/...` tests

[中文版](南向驱动测试报告.html)

---

## 1. Executive Summary

### Commands

```bash
CGO_ENABLED=0 go test ./internal/driver/... -count=1 -cover
CGO_ENABLED=0 go test ./internal/core/... -count=1 -cover
CGO_ENABLED=0 go test -bench=. -benchmem ./internal/driver/ethernetip -run=^$ -count=1
```

| Scope | Result | Coverage | Notes |
| :--- | :--- | :--- | :--- |
| Main driver packages | ✅ PASS | 12–59% | All production drivers pass |
| `bacnet/utsm` sub-package | ✅ PASS | — | Async UTSM unit tests |
| `internal/driver/...` overall | ✅ PASS | — | All sub-packages |
| `internal/core/...` | ✅ PASS | 47.9% | Includes VirtualShadowEngine pipeline fan-out |

---

## 2. Per-Driver Unit Test Summary

| Driver | Registry Key | ~Tests | Coverage | Status |
| :--- | :--- | :---: | :---: | :---: |
| Modbus | `modbus-tcp`, `modbus-rtu`, `modbus-rtu-over-tcp` (+ simple variants) | 33 | 27.0% | ✅ Production |
| BACnet IP | `bacnet-ip` | 80+ | 59.1% | ✅ Production |
| OPC UA | `opc-ua` | 25 | 40.3% | ✅ Production |
| Siemens S7 | `s7` | 52 | 42.0% | ✅ Production |
| EtherNet/IP | `ethernet-ip` | 57 | 30.3% | ✅ Production |
| Omron FINS | `omron-fins` | 6 | 25.3% | ✅ Production |
| SNMP | `snmp` | 15 | 33.9% | ✅ Production |
| IEC 60870-5-104 | `iec60870-5-104` | 8 | 23.4% | 🚧 M1 partial |
| DL/T645 | `dlt645` | 0 | 0.0% | ⚠️ Stub |
| Mitsubishi SLMP | `mitsubishi-slmp` | 0 | 0.0% | ⚠️ Stub |

---

## 3. Performance / Benchmark Results

### EtherNet/IP scheduler (2026-06-27, CGO_ENABLED=0)

| Benchmark | Result | Allocations |
| :--- | :--- | :--- |
| GroupTags 100 points | 119.8 ns/op | 72 B/op, 2 allocs |
| GroupTags 500 points | 496.7 ns/op | 744 B/op, 5 allocs |
| GroupTags 1000 points | 941.2 ns/op | 1640 B/op, 6 allocs |
| PointParsing | 5833 ns/op | 498 B/op, 12 allocs |
| StatsIncrement | 12.33 ns/op | 0 allocs |
| TagGroup Add 100 | 22622 ns/op | 8071 B/op, 200 allocs |

### ShadowCore benchmarks

Located in `internal/core/shadow_performance_test.go` with `//go:build integration`. Currently blocked by duplicate `mockStressDriver` declarations when building with `-tags=integration`.

See also [ScanEngine Refactoring Test Report](../TODO/ScanEngine重构测试报告.html) for historical scale/stress results.

---

## 4. Boundary Scenario Coverage

| Scenario | Modbus | BACnet | OPC UA | S7 | ENIP | SNMP | Core |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Timeout / backoff | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Reconnect / half-open probe | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Cooldown / Dead state | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| Invalid config / address | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ |
| Channel offline | — | — | — | — | — | — | ✅ |
| Scan priority | — | — | — | — | — | — | ✅ |
| Fault isolation | — | ✅ | — | — | — | — | — |

---

## 5. Gaps and Follow-ups

1. Add tests for DLT645 and Mitsubishi SLMP when real protocol is implemented
2. Add live integration tests for SNMP and IEC 104 (see [Online Test Plan](../TODO/联机测试方案.html))
3. Resolve integration-tag build conflict for ShadowCore benchmarks

---

## 6. How to Run Locally

```bash
# Full driver + core packages
CGO_ENABLED=0 go test ./internal/driver/... ./internal/core/... -count=1 -cover

# Single driver verbose
CGO_ENABLED=0 go test ./internal/driver/snmp -v -count=1

# Benchmarks
CGO_ENABLED=0 go test -bench=. -benchmem ./internal/driver/ethernetip -run=^$ -count=1
```

---

## Related Docs

- [Driver Matrix (CN)](../drivers/index.html) · [Driver Matrix (EN)](../drivers/index_en.html)
- [Channel Regression Plan](南向采集通道回归验证测试方案.html)
- [ScanEngine Test Report](../TODO/ScanEngine重构测试报告.html)
