---
layout: section-index
title: EdgeX Documentation (English)
description: English documentation hub for EdgeX industrial edge gateway — product overview, architecture, drivers, and testing
hero_eyebrow: Expert Knowledge Base
hero_title: EdgeX Documentation (English)
hero_lead: English entry for EdgeX industrial edge gateway. Primary technical content is maintained in Chinese; this hub mirrors README.en and links to published Pages.
hero_buttons:
  - text: README.en (GitHub)
    url: https://github.com/anviod/edgex/blob/dev/README.en.md
    style: primary
  - text: Home (中文)
    url: ../index.html
    style: secondary
  - text: Driver Matrix (EN)
    url: ../drivers/index_en.html
    style: secondary
  - text: Product Guide (中文)
    url: ../guide/产品说明.html
    style: secondary
---

## Product Overview

Industrial Edge Gateway runs at the industrial edge to bridge **OT devices ↔ IT systems** — unified southbound access, local edge processing, and flexible northbound integration in a single gateway. **12 southbound protocols, edge rules, and multi-channel northbound integration, backed by industrial-grade SLA and Soak long-stability verification.**

- **Unified access**: heterogeneous PLCs, meters, building and network devices — one gateway for collection
- **Edge intelligence**: local rules and derived tags for control linkage and reduced uplink traffic
- **Open integration**: cloud platforms, SCADA, and enterprise apps with reverse write/control
- **Industrial-grade stability**: built-in metric gates, Soak regression, and CI five-gate verification

Full narrative: [README.en.md](https://github.com/anviod/edgex/blob/dev/README.en.md) on GitHub.

## Product Advantages

| Capability | Core Value | Key Metrics |
| :--- | :--- | :--- |
| **Quality assurance** | Metric gates + Soak + CI five-gate | lag P95 **<100ms** · miss deadline **=0** · 10k-tag benchmark |
| **Southbound access** | 12 industrial protocols | device discovery · object scan · batch tag registration |
| **Collection scheduling** | 10ms-class kernel, in-memory shadow SoT | P99 lag **<150ms** (≤10k tags, statistical SLA) |
| **Edge intelligence** | rules + virtual shadow derived computation | cross-device mapping · formula aggregation |
| **Northbound integration** | cloud, SCADA, enterprise | MQTT · Sparkplug B · OPC UA · EdgeOS |

Detailed SLA, protocols, and virtual shadow: [Product Guide (中文)](../guide/产品说明.html#产品优势).

## Documentation

| Document | Description |
| :--- | :--- |
| [Architecture](../architecture/index.html) | ScanEngine scheduling kernel, ShadowCore, system diagrams |
| [Product Guide (中文)](../guide/产品说明.html) | capabilities, SLA metrics, feature details |
| [Edge Gateway Architecture (中文)](../edge/边缘网关架构设计总览.html) | component layout and data flow |
| [Southbound Driver Matrix (EN)](../drivers/index_en.html) | 12 protocol drivers and development standards |
| [Testing & Verification](../testing/index.html) | SLA benchmarks, Soak, regression, and driver test reports |
| [Southbound Driver Test Report](../testing/southbound-driver-test-report.html) | **2026-07-04** retest — 21/21 PASS, coverage matrix |
| [Deployment](../deployment/index.html) | bare-metal / systemd deployment guides |

## Implemented Southbound Drivers

Registered in `cmd/main.go`:

| Protocol | Registry Key | Status |
| :--- | :--- | :--- |
| Modbus TCP/RTU | `modbus-tcp`, `modbus-rtu`, `modbus-rtu-over-tcp` | Production |
| BACnet IP | `bacnet-ip` | Production |
| OPC UA Client | `opc-ua` | Production |
| Siemens S7 | `s7` | Production |
| EtherNet/IP | `ethernet-ip` | Production |
| Omron FINS | `omron-fins` | Production |
| SNMP v2c/v3 | `snmp` | Production |
| IEC 60870-5-104 | `iec60870-5-104` | M1 delivered |
| DL/T645-2007 | `dlt645` | Implemented |
| Mitsubishi SLMP | `mitsubishi-slmp` | Production |
| Profinet IO | `profinet-io` | Implemented |
| KNXnet/IP | `knxnet-ip` | Production |

See [Southbound Driver Test Report](../testing/southbound-driver-test-report.html) for **2026-07-04** coverage (21/21 main packages PASS under `-short`).

## Related

- **中文 README**: [README.md](https://github.com/anviod/edgex/blob/dev/README.md)
- **English README**: [README.en.md](https://github.com/anviod/edgex/blob/dev/README.en.md)
- **中文文档首页**: [首页](../index.html)
