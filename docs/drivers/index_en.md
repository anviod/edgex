---
layout: section-index
title: Device Drivers (English)
description: EdgeX southbound collection drivers — Modbus, BACnet, OPC UA, S7, EtherNet/IP, FINS, SNMP, IEC 104, DL/T645, Mitsubishi MC, Profinet IO, KNXnet/IP
hero_eyebrow: Southbound Drivers
hero_title: Device Drivers
hero_lead: Design docs, test reports, and optimization notes for EdgeX southbound drivers — Modbus, BACnet, OPC UA, S7, EtherNet/IP, Omron FINS, SNMP, IEC 104, DL/T645, Mitsubishi MC, Profinet IO, KNXnet/IP, and more.
hero_buttons:
  - text: Home
    url: ../index.html
    style: primary
  - text: 中文版
    url: index.html
    style: secondary
  - text: Test Report
    url: ../testing/southbound-driver-test-report.html
    style: secondary
---

## Driver Support Matrix

| Protocol | Registry Key | Status | Read | Write | Scan / Discover | ConnectionManager | Unit Tests |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Modbus TCP/RTU** | `modbus-tcp`, `modbus-rtu`, `modbus-rtu-over-tcp` | Production | Yes | Yes | — | Yes | 33 tests, 27% cov |
| **BACnet IP** | `bacnet-ip` | Production | Yes | Yes | Scan + ScanObjects | Partial | 80+ tests, 59% cov |
| **OPC UA Client** | `opc-ua` | Production | Yes | Yes | Scan + ScanObjects | Yes | 25 tests, 40% cov |
| **Siemens S7** | `s7` | Production | Yes | Yes | — | Yes | 52 tests, 42% cov |
| **EtherNet/IP** | `ethernet-ip` | Production | Yes | Yes | — | Yes | 60 tests, 30% cov |
| **Omron FINS** | `omron-fins` | Production | Yes | Yes | — | Yes | 12 tests, 31% cov |
| **SNMP v2c/v3** | `snmp` | Production | Yes | Yes | ScanObjects | Yes | 22 tests, 45% cov |
| **IEC 60870-5-104** | `iec60870-5-104` | M1 delivered | Yes | Yes (single command) | — | Yes | 16 tests, 45% cov |
| **DL/T645-2007** | `dlt645` | Implemented | Yes | Yes | — | Yes | 24 tests, 71% cov |
| **Mitsubishi SLMP** | `mitsubishi-slmp` | Production | Yes | Yes | — | Yes | 13 tests, 57% cov |
| **Profinet IO** | `profinet-io` | Implemented | Yes | Yes | — | Yes | 11 tests, 49% cov |
| **KNXnet/IP** | `knxnet-ip` | Production | Yes | Yes | Gateway discovery | Yes | 13 tests, 67% cov |

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
| Profinet IO | `local_interface`, `timeout`, `simulation`; device `ip`, `port`, `slot`, `subslot` |
| KNXnet/IP | `ip`, `port`, `mode` (TCP/UDP), `discovery`, `discovery_timeout`, `discovery_multicast` |
| SNMP | `snmpVersion`, `targetIP`, `community` (v2c), USM auth/priv (v3), `maxBulkSize` |
| DLT645 | `connectionType` (serial/tcp), `port`, `ip`, `baudRate`, `timeout`, meter address + DI |
| IEC 104 | `ip`, `port`, `commonAddress`, T0–T3 timers, general call interval |

---

## Connection Management (2026-06)

Shared **ConnectionManager** (`internal/driver/connection_manager.go`):

- State machine: `Disconnected → Connecting → Connected → Retrying → Dead`
- Exponential backoff with jitter and cooldown (max 1 hour)
- Collection health: successful read = healthy; no separate heartbeat
- Low-frequency probe when scan interval exceeds 3× threshold

**Supported**: S7, Modbus, EtherNet/IP, OPC UA, FINS, SNMP, DL/T645, Profinet IO, KNXnet/IP

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
