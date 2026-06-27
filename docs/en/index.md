---
layout: section-index
title: EdgeX Documentation (English)
description: English documentation index for EdgeX industrial edge gateway expert knowledge base
hero_eyebrow: Expert Knowledge Base
hero_title: EdgeX Documentation (English)
hero_lead: English reference hub for driver matrices, test reports, and architecture documentation. Primary technical content is maintained in Chinese.
hero_buttons:
  - text: Home (中文)
    url: ../index.html
    style: primary
  - text: Driver Matrix
    url: ../drivers/index_en.html
    style: secondary
  - text: Test Report
    url: ../testing/southbound-driver-test-report.html
    style: secondary
---

## Quick Links

| Topic | Link |
| :--- | :--- |
| Home (中文) | [首页](../index.html) |
| Device Drivers (EN) | [Driver Matrix](../drivers/index_en.html) |
| Southbound Test Report | [Test Report](../testing/southbound-driver-test-report.html) |
| Product Overview | [产品说明](../man/产品说明.html) |
| Architecture | [Architecture](../architecture/index.html) |
| Development Plan | [Development Plan](../development_plan/index.html) |

## Implemented Southbound Drivers

Registered in `cmd/main.go`:

| Protocol | Key | Status |
| :--- | :--- | :--- |
| Modbus | `modbus-tcp`, `modbus-rtu`, `modbus-rtu-over-tcp` | Production |
| BACnet IP | `bacnet-ip` | Production |
| OPC UA | `opc-ua` | Production |
| Siemens S7 | `s7` | Production |
| EtherNet/IP | `ethernet-ip` | Production |
| Omron FINS | `omron-fins` | Production |
| SNMP | `snmp` | Production |
| IEC 60870-5-104 | `iec60870-5-104` | M1 partial |
| DL/T645 | `dlt645` | Implemented |
| Mitsubishi SLMP | `mitsubishi-slmp` | Production |

See [Southbound Driver Test Report](../testing/southbound-driver-test-report.html) for test results and coverage.
