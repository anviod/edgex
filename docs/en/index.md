---
layout: section-index
title: EdgeX Documentation (English)
description: English documentation index for EdgeX industrial edge gateway expert knowledge base
---

<div class="section-index-hero">
  <div class="eyebrow">Expert Knowledge Base</div>
  <h1>EdgeX Documentation (English)</h1>
  <p>English reference hub for driver matrices, test reports, and architecture documentation. Primary technical content is maintained in Chinese.</p>
  <div class="hero-actions">
    <a class="button-link button-link--primary" href="../index.html">Home (中文)</a>
    <a class="button-link button-link--secondary" href="../drivers/index_en.html">Driver Matrix</a>
    <a class="button-link button-link--secondary" href="../testing/southbound-driver-test-report.html">Test Report</a>
  </div>
</div>

<div class="markdown-body">

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

</div>
