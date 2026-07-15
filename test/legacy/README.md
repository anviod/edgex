# Legacy 测试配置归档

本目录存放已废弃的配置格式与联调快照，仅供对照历史文档（如 [多从站指南](../../docs/deployment/MULTI_SLAVE_GUIDE.md)）时参考。**请勿用于新部署或 CI。**

## 文件说明

| 文件 | 格式 | 说明 |
|------|------|------|
| `config_multi_slave_legacy.yaml` | `devices` + `slaves:` 嵌套 | 2026-01 多从站初版示例 |
| `config_full_snapshot.yaml.bak` | v2 `channels` 全量快照 | 联调/手工测试时的网关配置导出备份，非 schema 模板 |

## 现行配置参考

- **v2 三级架构**：见 [三级架构快速入门](../../docs/deployment/QUICK_START_THREE_LEVEL.md) 与 [产品说明 — 配置结构](../../docs/guide/产品说明.md#配置结构)
- **多从站 Modbus**：见 [多从站指南](../../docs/deployment/MULTI_SLAVE_GUIDE.md)（每 `slave_id` 独立 Device）
- **BACnet 通道片段**：见 [产品说明](../../docs/guide/产品说明.md#配置结构) 内联示例

运行时配置以 **`data/config.db`** 为唯一数据源（`internal/config`）；上述 YAML 为历史对照与文档引用，不直接被 `go test` 加载。
