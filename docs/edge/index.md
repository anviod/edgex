---
layout: section-index
title: 边缘计算
description: EdgeX 边缘计算 — 规则引擎、ShadowCore 影子设备与场景编排
hero_eyebrow: Edge Computing
hero_lead: EdgeX 边缘计算功能文档 — 规则引擎、数据流转、ShadowCore 影子设备、ScanEngine 调度驱动采集与场景编排。
hero_buttons:
  - text: 基础功能
    url: 边缘计算基础功能.html
    style: primary
  - text: 架构设计
    url: ../architecture/index.html
    style: secondary
  - text: 返回首页
    url: ../index.html
    style: secondary
---

## 目录

### 功能说明
- [边缘计算基础功能](边缘计算基础功能.html)
- [边缘计算高阶功能](边缘计算高阶功能.html)
- [边缘计算首页监控](边缘计算首页监控.html)
- [边缘计算功能走查](边缘计算功能走查.html)
- [边缘计算功能增加存储功能](边缘计算功能增加存储功能.html)

### 设计文档
- [边缘计算逻辑图](edge_compute_logic_diagram.html)
- [边缘计算拓扑图](edge_compute_topology_diagram.html)
- [边缘网关架构设计总览](边缘网关架构设计总览.html)

### 最佳实践
- [边缘计算最佳实践](EDGE_COMPUTING_BEST_PRACTICES.html)
- [边缘计算场景手册](EDGE_COMPUTING_SCENARIO_MANUAL.html)
- [边缘流](EDGE_FLOW.html)

### ScanEngine / ShadowCore

<div align="center">
  <img src="../img/dataScanEngineCN.svg" width="100%" alt="Edgex V2.0 架构 · ScanEngine引擎" />
</div>

> **Edgex V2.0 架构 · ScanEngine 统一调度**：12 种南向驱动经 ScanEngine 写入影子设备实时快照，再联通虚拟设备、边缘计算与北向接口。

- [边缘网关架构设计总览](边缘网关架构设计总览.html) — 全生命周期与调度驱动架构
- [ScanEngine 重构方案](../TODO/ScanEngine重构方案.html) — 内核技术规范
- [影子设备设计](../architecture/6. 影子设备设计.html)
- [RTT 管理器](../architecture/8. RTT管理器实现.html)
- [MTU 管理器](../architecture/9. MTU管理器实现.html)
- [Gap 优化器](../architecture/10. Gap优化器实现.html)

## 相关文档

- [架构设计](../architecture/index.html) — 完整架构与设计文档
- [北向数据](../northbound/index.html) — MQTT / Sparkplug B 数据格式
- [测试验证](../testing/index.html) — 影子设备集成测试
