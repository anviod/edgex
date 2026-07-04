---
layout: default
---

# 采集状态机 - 快速参考

## 状态速查表

| 状态 | 采集行为 | 失败处理 | 成功处理 |
|-----|---------|---------|---------|
| **Online** | 每次采集 | → Unstable (3+) | 保持 |
| **Unstable** | 每次采集 | → Quarantine (10+) | → Online |
| **Offline** | 按退避重试 | ← 等待恢复 | → Online |
| **Quarantine** | 按指数退避 | 延长退避时间 | → Online |

## 快速调用

### 初始化
```go
manager := core.NewCommunicationManageTemplate()
node := manager.RegisterNode("device1", "Device Name")
```

### 采集决策
```go
if manager.ShouldCollect(node) {
    // 执行采集
    results, err := drv.ReadPoints(ctx, dev.Points)
}
```

### 结果处理
```go
// 创建采集上下文
ctx := &core.CollectContext{
    TotalCmd:   len(dev.Points),
    SuccessCmd: len(results),
    FailCmd:    len(dev.Points) - len(results),
    PanicOccur: false,
}

// 最终裁决
manager.finalizeCollect(node, ctx)
```

### 状态查询
```go
state := dm.GetDeviceState("device1")
fmt.Printf("State: %d, Failures: %d\n", state.State, state.FailCount)
```

## 状态转换触发条件

### → Online (恢复)
- **条件**: 任何状态下采集成功 (SuccessCmd >= 1)
- **效果**: FailCount = 0, SuccessCount = 1

### → Unstable (降级)
- **条件**: Online 状态下连续 3 次采集失败
- **效果**: NextRetryTime = now() + 5s

### → Quarantine (隔离)
- **条件**: Unstable 状态下连续 10 次采集失败 (FailCount >= 10)
- **效果**: NextRetryTime = now() + min(FailCount*1s, 5分钟)

### → Offline (离线)
- **条件**: 未在代码中主动设置，通常通过监控系统设置
- **效果**: 进入退避时间

## 采集成功判定

```
成功率 = SuccessCmd / (SuccessCmd + FailCmd)

判定为"成功"的条件:
  ✓ 无 Panic
  ✓ 有交互 (TotalCmd > 0)  
  ✓ 成功率 >= 30%

否则判定为"失败"
```

## 常见问题速答

**Q: 设备故障了会怎样?**
```
采集1-2次失败  → Online 状态（等待诊断）
采集3-9次失败  → Unstable（5秒退避）
采集10+次失败  → Quarantine（指数退避，最长5分钟）
采集成功       → Online（立即恢复）
```

**Q: 为什么采集被跳过了?**
```
原因: 设备处于 Offline/Quarantine 状态且退避时间未过
解决: 等待 NextRetryTime 或手动干预
```

**Q: 多少个命令失败才算采集失败?**
```
只要成功率 >= 30%，就判定为成功
例: 10个命令，3个成功7个失败 → 30% 成功率 → 判定为成功
```

**Q: 一次成功能恢复设备吗?**
```
是的！OnSuccess() 会立即：
  - 重置 FailCount 为 0
  - 设置状态为 Online
  - 给设备快速恢复的机会
```

## 监控要点

```go
// 需要监控的关键指标
state := dm.GetDeviceState("device1")

// 1. 设备状态
fmt.Printf("State: %d\n", state.State)  // 0=Online, 1=Unstable, 2=Offline, 3=Quarantine

// 2. 失败趋势
fmt.Printf("FailCount: %d\n", state.FailCount)  // 连续失败次数

// 3. 恢复能力
fmt.Printf("SuccessCount: %d\n", state.SuccessCount)  // 连续成功次数

// 4. 恢复预期
fmt.Printf("NextRetry: %v\n", state.NextRetryTime)  // 下次重试时间
```

## 告警设置建议

```
告警条件:
  ⚠️  State == Unstable AND FailCount > 5
  🔴 State == Quarantine AND Duration > 1分钟
  🔴 LastFailTime 距今 > 30分钟 AND State != Online
```

## 文件速查

| 文件 | 位置 | 说明 |
|-----|-----|------|
| 状态机实现 | `internal/core/node_status.go` | 核心状态机逻辑 |
| 采集集成 | `internal/core/channel_manager.go` | ScanEngineAdapter + finalizeScanCollect |
| 单元测试 | `internal/core/node_status_test.go` | 测试用例 |
| 完整文档 | `STATE_MACHINE_API.md` | API 参考 |
| 集成指南 | `INTEGRATION_GUIDE.md` | 使用指南 |

---

**最后更新**: 2026-01-21 | **版本**: 1.0.0 | **状态**: ✅ 生产就绪
