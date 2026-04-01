在工业风格（Industrial UI）的设计中，核心在于**清晰的层级**、**高对比度**、**几何线条感**以及**克制的色彩运用**（通常使用 Slate/Gray 灰色系作为主色，配合 Arco 蓝或运行状态的红绿色作为功能点缀）。

您提供的代码中存在两个主要问题：
1.  **图标异常**：使用的是自定义的 `<Icon name="xxx" />` 组件，如果未正确配置图标库，会导致图标无法显示。
2.  **视觉风格偏软**：原有的标题栏（`.device-header`）和底部的玻璃拟态（Glass-card）设计偏向通用 Web 风格，不够坚硬。

### 优化方案执行指南

我们将按照以下 4 个步骤对 `DeviceList.vue` 进行重构，全面转向 Arcor Design 的极简工业风。

#### 步骤 1：修复并标准化图标组件
Arco Design Pro 自带了一套非常严谨的图标库，更适合工业风。我们将替换所有自定义的 `Icon` 组件为 Arco 原生图标。

**在 `<script setup>` 中引入图标：**
```javascript
import { 
  IconArrowLeft, IconPlus, IconDelete, IconRadar, IconList, 
  IconSettings, IconHistory, IconSearch, IconEye, IconLink, 
  IconClockCircle, IconInfoCircle, IconCheckCircle, IconCloseCircle 
} from '@arco-design/web-vue/es/icon';
```

**在 `<template>` 中替换对应的图标：**
例如，将 `<Icon name="icon-arrow-left" />` 替换为 `<icon-arrow-left />`。

#### 步骤 2：工业风美化 "设备列表" 标题栏
标题栏是用户进入页面的第一视觉点。我们需要将其改造成类似于“控制面板”的顶部装饰条。

**优化点：**
* **高冷色调**：使用深灰色 (`#1e293b`) 作为 Header 背景。
* **几何排版**：强化垂直和水平的线条对齐。
* **版本/状态信息**：增加一个 Monospace 字体的协议小标签，强化技术感。

**修改模板 (`<template>`) 中的 Header 部分：**
```vue
<template>
  <div class="device-list-container">
    <div class="device-header">
      <div class="header-left">
        <a-button type="outline" size="small" @click="$router.push('/channels')">
          <template #icon><icon-arrow-left /></template>返回通道
        </a-button>
        <div class="header-info">
          <span class="protocol-tag">{{ channelProtocol || 'UNKNOWN' }}</span>
          <h2 class="title-text">设备列表</h2>
        </div>
      </div>
      
      <div class="header-right">
        <a-space size="small">
          <a-button v-if="selected.length > 0" status="danger" type="primary" size="small" @click="confirmBatchDelete">
            <template #icon><icon-delete /></template>
            批量删除 ({{ selected.length }})
          </a-button>
          <a-button v-if="channelProtocol === 'bacnet-ip'" type="outline" status="success" size="small" @click="openScanDialog()">
            <template #icon><icon-radar /></template>扫描设备
          </a-button>
          <a-button type="primary" size="small" @click="openDialog()">
            <template #icon><icon-plus /></template>新增设备
          </a-button>
        </space>
      </div>
    </div>
    </div>
</template>
```

#### 步骤 3：重构卡片视觉为 "1px 线构 + 硬投影"
工业风不使用模糊的阴影（v-shadow），而是使用实心的边框和硬偏移投影。

**修改 `<style scoped>`：**
```css
/* 容器背景色调整为Slate灰色系 */
.device-list-container {
  padding: 24px;
  background-color: #f1f5f9; /* Slate 100 */
  min-height: 100vh;
}

/* 顶部线构标题 */
.device-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #1e293b; /* 深色线条 */
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-info {
  display: flex;
  flex-direction: column;
}

/* 协议小标签：等宽字体，技术感 */
.protocol-tag {
  font-family: monospace;
  font-size: 10px;
  background: #1e293b;
  color: #0ea5e9; /* 功能点缀蓝 */
  padding: 0 4px;
  width: fit-content;
  border-radius: 2px;
}

.title-text {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

/* 工业风卡片优化：强化线条，移除模糊阴影，改用硬投影 */
.industrial-card {
  border: 1px solid #cbd5e1 !important; /* Slate 300 */
  border-radius: 2px; /* 较硬的圆角 */
  box-shadow: 6px 6px 0px #e2e8f0; /* 实心偏移投影 */
}

/* 底部技术装饰条 */
.device-footer {
  margin-top: 24px;
  padding: 12px;
  border: 1px dashed #cbd5e1;
  text-align: center;
  background-color: #f8fafc;
}

.terminal-info {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* 呼吸灯效果指示器 */
.terminal-dot {
  width: 6px;
  height: 6px;
  background: #22c55e; /* 正常运行绿 */
  box-shadow: 0 0 4px #22c55e;
  border-radius: 50%;
}

.monospace-text {
  font-family: monospace;
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}
```

#### 步骤 4：标准化表格与表单的工业对齐
确保表格内的操作按钮组和表单项在垂直方向上严格对齐。

**表格操作插槽 (`<template #actions>`) 优化：**
```vue
<template #actions="{ record }">
  <a-space size="mini">
    <a-tooltip content="查看点位"><a-button type="text" size="mini" @click="goToPoints(record)"><icon-eye /></a-button></a-tooltip>
    <a-tooltip content="规则链"><a-button type="text" size="mini" @click="showRuleUsage(record)"><icon-link /></a-button></a-tooltip>
    <a-tooltip content="历史数据"><a-button type="text" size="mini" @click="openHistoryDialog(record)"><icon-clock-circle /></a-button></a-tooltip>
    <a-divider direction="vertical" />
    <a-button type="text" size="mini" @click="openDialog(record)">编辑</a-button>
    <a-button type="text" size="mini" status="danger" @click="confirmDelete(record)">删除</a-button>
  </a-space>
</template>
```

**对话框表单 (`<a-modal>`) 优化：**
通过 `:label-col-props="{ span: 6 }"` 强制 Lable 宽度，确保输入框对齐。
```vue
<a-form :model="form" layout="horizontal" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
  <a-form-item field="id" label="设备 ID" required>
    <a-input v-model="form.id" :disabled="isEdit" placeholder="设备唯一标识" />
  </a-form-item>
  </a-form>
```

### 执行总结
您只需按照上述四个步骤，直接复制对应的 `<template>`、`<script>` 和 `<style scoped>` 代码段进行覆盖即可完成风格化改造。这一方案在修复图标的同时，将视觉重点放在了线条感、高冷色调和硬投影上，非常契合“边缘计算/工业控制台”的定位。