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

> **工程铁律：** 任何性能优化不得以牺牲稳定性为代价；任何架构优化不得增加系统恢复复杂度。

## 目录

### 功能说明
- [边缘计算基础功能](边缘计算基础功能.html)
- [边缘计算规则帮助](边缘计算规则帮助.html) — **官方用户帮助**（规则类型、表达式、动作链，与 UI 帮助抽屉同步）
- [边缘计算 Pipeline 配置指南](边缘计算Pipeline配置指南.html) — **技术对照**：用户配置 ↔ V2.2 Pipeline Worker · bbolt 样例
- [边缘计算高阶功能](边缘计算高阶功能.html)
- [边缘计算首页监控](边缘计算首页监控.html)
- [边缘计算功能走查](边缘计算功能走查.html)
- [边缘计算功能增加存储功能](边缘计算功能增加存储功能.html)

### 设计文档
- [边缘计算逻辑图](edge_compute_logic_diagram.html)
- [边缘计算拓扑图](edge_compute_topology_diagram.html)
- [边缘网关架构设计总览](边缘网关架构设计总览.html)

### 最佳实践
- [边缘计算最佳实践](../guide/EDGE_COMPUTING_BEST_PRACTICES.html)
- [边缘计算场景手册](EDGE_COMPUTING_SCENARIO_MANUAL.html)
- [边缘流](EDGE_FLOW.html)

### ScanEngine / ShadowCore

<div align="center">
  <img src="../img/dataScanEngineCN.svg" width="100%" alt="EdgeX V2.0 架构 · ScanEngine引擎" />
</div>

> **EdgeX V2.0 架构 · ScanEngine 统一调度**：12 种南向驱动经 ScanEngine（EDF + CB + SLA）写入 ShadowIngress → ShadowCore，再联通虚拟设备、边缘计算与北向接口。详见 [边缘网关架构设计总览](边缘网关架构设计总览.html)。

- [1. 项目现状分析](1. 项目现状分析.html)
- [ScanEngine 重构方案](../TODO/ScanEngine重构方案.html) — 内核技术规范（权威）
- [影子设备设计](6. 影子设备设计.html)
- [RTT 管理器](8. RTT管理器实现.html)
- [MTU 管理器](9. MTU管理器实现.html)
- [Gap 优化器](10. Gap优化器实现.html)

## 相关文档

- [开发原则与验收标准](../DEVELOPMENT_PRINCIPLES.html) · [分阶段路线图](../ROADMAP.html) · [版本发布门禁](../RELEASE_GATE.html)
- [架构设计](../architecture/index.html) — 完整架构与设计文档
- [北向数据](../northbound/index.html) — MQTT / Sparkplug B 数据格式
- [测试验证](../testing/index.html) — 影子设备集成测试
