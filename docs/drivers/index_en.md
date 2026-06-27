---
layout: section-index
title: Device Drivers (English)
description: EdgeX southbound collection drivers — Modbus, BACnet, OPC UA, S7, EtherNet/IP, FINS, SNMP, IEC 104
---

<div class="section-index-hero">
  <div class="eyebrow">Southbound Drivers</div>
  <h1>Device Drivers</h1>
  <p>Design docs, test reports, and optimization notes for EdgeX southbound drivers — Modbus, BACnet, OPC UA, S7, EtherNet/IP, Omron FINS, SNMP, IEC 104, and more.</p>
  <div class="hero-actions">
    <a class="button-link button-link--primary" href="../index.html">Home</a>
    <a class="button-link button-link--secondary" href="index.html">中文版</a>
    <a class="button-link button-link--secondary" href="../testing/southbound-driver-test-report.html">Test Report</a>
  </div>
</div>

<div class="markdown-body">

## Driver Support Matrix

| Protocol | Registry Key | Status | Read | Write | Scan / Discover | ConnectionManager | Unit Tests |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Modbus TCP/RTU** | `modbus-tcp`, `modbus-rtu`, `modbus-rtu-over-tcp` | ✅ Production | ✅ | ✅ | — | ✅ | 33 tests, 27% cov |
| **Modbus Simple** | `modbus-*-simple` | ✅ Production | ✅ | ✅ | — | ✅ | (shared) |
| **BACnet IP** | `bacnet-ip` | ✅ Production | ✅ | ✅ | Scan + ScanObjects | Partial | 80+ tests, 59% cov |
| **OPC UA Client** | `opc-ua` | ✅ Production | ✅ | ✅ | Scan + ScanObjects | ✅ | 25 tests, 40% cov |
| **Siemens S7** | `s7` | ✅ Production | ✅ | ✅ | — | ✅ | 52 tests, 42% cov |
| **EtherNet/IP** | `ethernet-ip` | ✅ Production | ✅ | ✅ | — | ✅ | 57 tests, 30% cov |
| **Omron FINS** | `omron-fins` | ✅ Production | ✅ | ✅ | — | ✅ | 6 tests, 25% cov |
| **SNMP v2c/v3** | `snmp` | ✅ Production | ✅ | ✅ | ScanObjects | ✅ | 15 tests, 34% cov |
| **IEC 60870-5-104** | `iec60870-5-104` | 🚧 M1 delivered | ✅ | ✅ (single command) | — | 🚧 In progress | 8 tests, 23% cov |
| **DL/T645-2007** | `dlt645` | ⚠️ Stub | Simulated | Simulated | — | — | No tests |
| **Mitsubishi SLMP** | `mitsubishi-slmp` | ✅ Production | ✅ | ✅ | — | ✅ | 7 tests |

> All drivers above are registered via blank imports in `cmd/main.go`. Only document drivers that exist in code.

---

## Key Configuration Parameters

| Driver | Main Config Keys |
| :--- | :--- |
| Modbus | `ip`, `port`, `slaveId`, `timeout`, connection type (TCP/RTU/RTU-over-TCP) |
| BACnet | `ip`, `port`, `deviceId`, broadcast interface, object instance |
| OPC UA | `endpoint`, security policy/mode, credentials, subscription interval |
| S7 | `ip`, `port`, `rack`, `slot`, PLC model (200Smart/1200/1500/300/400) |
| EtherNet/IP | `ip`, `port`, `slot`, tag path, connection type |
| Omron FINS | `plcIP`/`ip`, `plcPort`/`port`, `timeout`, src/dst node addresses, TCP/UDP mode |
| Mitsubishi MC | `ip`, `port`, `frame_type`, `network_no`, `station_no`, `timeout` |
| SNMP | `snmpVersion`, `targetIP`, `community` (v2c), USM auth/priv (v3), `maxBulkSize` |
| IEC 104 | `ip`, `port`, `commonAddress`, T0–T3 timers, general call interval |

---

## Connection Management (2026-06)

Shared **ConnectionManager** (`internal/driver/connection_manager.go`):

- State machine: `Disconnected → Connecting → Connected → Retrying → Dead`
- Exponential backoff with jitter and cooldown (max 1 hour)
- Collection health: successful read = healthy; no separate heartbeat
- Low-frequency probe when scan interval exceeds 3× threshold

**Supported**: S7, Modbus, EtherNet/IP, OPC UA, FINS, SNMP, Mitsubishi MC

---

## Test Coverage

Full report: [Southbound Driver Test Report](../testing/southbound-driver-test-report.html)

```bash
CGO_ENABLED=0 go test ./internal/driver/modbus ./internal/driver/bacnet ... -count=1 -cover
```

Last run (2026-06-27): all main driver packages **PASS**; `bacnet/utsm` sub-package FAIL (known issue).

---

## Related Docs

- [Driver Index (中文)](index.html)
- [Modbus Optimization](MODBUS_OPTIMIZATION.html)
- [BACnet Design](BACnet_设计说明.html)
- [SNMP Driver](SNMP.html)
- [Architecture](../architecture/index.html)
- [Development Plan](../development_plan/index.html)

</div>
