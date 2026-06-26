---
layout: default
title: EdgeX 工业网关 UI 设计规范
description: EdgeX 样式参考
---

# EdgeX SaaS v3.0 样式参考（Arco + Linear 级高端范式）

> **定位**：工业数据平台 → 现代 SaaS 操作系统  
> **技术栈**：Vue 3 · Arco Design Vue · Tailwind CSS（辅助）· CSS Variables  
> **风格参考**：Linear / Notion / Vercel / Stripe Dashboard

> **v3.0 一句话定义**：EdgeX v3.0 is a **Linear-class low-noise industrial SaaS system UI**——极低视觉噪声 + 空间驱动 + 轻交互反馈 + 高信息可读性。

---

## 1. 设计总原则（v3.0 核心）

### 1.1 三个核心关键词

| 关键词 | 含义 |
|--------|------|
| **空间优先（Spacing-first）** | 用 spacing 表达层级，不依赖 border 分割结构 |
| **低噪声（Low Noise UI）** | 极少阴影、极轻边框、单一主色系统 |
| **信息流（Flow UI）** | UI 不再「分块」而是「流动」；Card / Table / Form 都是 flow container |

### 1.2 三条执行规则

1. **80% spacing，20% border**
2. **UI 不再「分割」，而是「组织流动」**
3. **默认状态必须「轻」，只有 hover 才「明显」**

### 1.3 范式转变

| 维度 | v2.x（工业风） | v3.0（SaaS 风） |
|------|---------------|-----------------|
| 结构驱动 | border-driven UI | **spacing-driven UI** |
| 布局 | dense layout / structured blocks | **flow-based layout** |
| 视觉 | 强分割、强结构感 | **low-noise interface** |
| 激活态 | 左侧蓝条、强 border | **hover 高亮 + subtle indicator** |
| 页面 | full-width 控制台 | **centered SaaS layout** |

### 1.4 最终视觉形态

- **Linear** 的干净感
- **Notion** 的信息流
- **Vercel** 的轻浮层
- **Stripe Dashboard** 的数据清晰度
- **Grafana** 的数据能力（不显工业 UI）

---

## 2. 视觉系统（Design Tokens）

全局 CSS 变量定义于 `ui/src/App.vue` 与 `ui/src/styles/globals.css`。

### 2.1 色彩系统（极简 Neutral + Single Accent）

```css
:root {
  /* 背景 */
  --bg: #ffffff;
  --surface: #f8fafc;
  --surface-2: #f1f5f9;

  /* 边框 */
  --border: rgba(15, 23, 42, 0.08);

  /* 文字 */
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-tertiary: #94a3b8;

  /* Accent（唯一主色） */
  --primary: #0ea5e9;
  --primary-hover: #0284c7;
}
```

**关键原则**：❗ 一个页面只允许一个强调色系统（Primary）。Success / Warning / Error **仅用于状态语义**。

#### 功能色（状态专用）

| 语义 | 色值 | 用途 |
|------|------|------|
| Success | `#16a34a` | 在线、正常 |
| Warning | `#d97706` | 告警、降级 |
| Error | `#dc2626` | 离线、失败 |
| Info | `#3b82f6` | 信息提示、进度 |

#### 深色主题

| Token | Light | Dark |
|-------|-------|------|
| `--bg` | `#ffffff` | `#1e293b` |
| `--surface` | `#f8fafc` | `#0f172a` |
| `--surface-2` | `#f1f5f9` | `#334155` |
| `--border` | `rgba(15,23,42,0.08)` | `rgba(255,255,255,0.08)` |
| `--text-primary` | `#0f172a` | `#f8fafc` |
| `--text-secondary` | `#64748b` | `#94a3b8` |
| `--text-tertiary` | `#94a3b8` | `#64748b` |
| `--edgex-surface-subtle` | `#fafafa` | `#334155` |

切换方式：`document.documentElement.classList.toggle('dark-theme')` + Arco `body[arco-theme='dark']`。

**Dark 规则（必须）**：

1. 所有页面背景用 `--surface`，卡片/表格行用 `--bg`，**禁止**硬编码 `#fff` / `#000`
2. 输入框、Select 背景 `--edgex-surface-subtle`，边框 `--border`
3. Table floating rows：行背景 `--bg`，hover `--surface-2`，box-shadow `0 0 0 1px var(--border)`
4. Alert / Info 提示：背景 `rgba(14,165,233,0.1)`，边框 `rgba(14,165,233,0.25)`，文字 `--text-primary`
5. 拖拽投放区、选中态：用 primary / success 的 **rgba 半透明**，不用 Arco `--color-fill-*` 或白色遮罩
6. Modal / Drawer：header/body/footer 均 `--surface`，分割线 `--border`
7. 代码/表达式：`--primary` 或 `--font-mono`，实时值 `--edgex-success`

样式文件分工：

| 文件 | Dark 职责 |
|------|-----------|
| `theme.css` | Token 定义 + 通用 page/card/form dark |
| `dark-arco.css` | Arco Table / Input / Pagination 覆写 |
| `virtual-shadow.css` | 虚拟影子列表 + 积木编辑器 modal |

### 2.2 间距系统（核心升级）

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;

  /* 语义别名 */
  --page-padding-y: var(--space-8);   /* 32px */
  --page-padding-x: var(--space-6);   /* 24px */
  --section-gap: var(--space-8);      /* 32px */
  --component-gap: var(--space-4);    /* 16px */
}
```

#### 核心节奏（必须遵守）

| 层级 | 值 | 用途 |
|------|-----|------|
| **8px** | `--space-2` | UI 内部（icon/text、按钮组） |
| **16px** | `--space-4` | 组件间（field→field、卡片内部） |
| **24px** | `--space-6` | 模块间（card block、toolbar→table） |
| **32px** | `--space-8` | 页面级（section gap、page padding-y） |

#### 表单 Flow spacing

| 关系 | spacing |
|------|---------|
| label → input | 6px |
| field → field | 16px |
| group → group | 28px |

### 2.3 圆角系统

```css
--radius-sm: 6px;     /* input、tag、nav-item */
--radius-md: 10px;    /* 辅助容器 */
--radius-lg: 12px;    /* card */
--radius-xl: 14px;    /* modal、drawer */
--radius-full: 9999px;
```

### 2.4 阴影

```css
--shadow-none: none;   /* 默认：card、table、sidebar */
--shadow-md: 0 4px 12px rgba(15, 23, 42, 0.06);  /* 仅 Dropdown / Modal */
```

**规则**：Card **禁止** shadow-heavy / glow；hover 用 border 变化 + `translateY(-1px)`。

### 2.5 字体（Typography）

```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, monospace;
```

| Level | 字号 | 字重 | 行高 | 场景 |
|-------|------|------|------|------|
| H1 | 24px | 600 | 1.3 | 页面主标题 |
| H2 | 18px | 600 | 1.4 | 区块标题 |
| H3 | 14–16px | 600 | 1.5 | 卡片标题、表单分组 |
| Body | 14px | 400 | 1.5–1.7 | 正文、表格、输入框 |
| Caption | 12px | 400 | 1.4 | 辅助信息、表头、表单标签 |
| Micro | 11px | 500 | 1.2 | 协议标签、Badge |

**原则**：可读性 > 信息密度；行高 1.5–1.7；`font-mono` 仅用于 IP、Commit ID、寄存器地址、NodeId 等技术标识。

### 2.6 信息层级系统

| 层级 | Token | 样式 |
|------|-------|------|
| **Primary** | `--text-primary` | 深色 + medium weight（L1 主信息） |
| **Secondary** | `--text-secondary` | gray-600 等价（L2 辅助信息） |
| **Tertiary** | `--text-tertiary` | gray-400 等价（L3 元信息） |

### 2.7 信息密度模式（可选）

| 模式 | 场景 | 表格行高 | 间距缩放 |
|------|------|----------|----------|
| **Relaxed（默认）** | 日常操作、配置 | 44px | 1× |
| **Compact（Ops mode）** | 监控大屏、高级用户 | 36px | 0.75× |

通过根容器 `data-density="compact"` 切换。

---

## 3. 布局系统（Linear 风格结构）

### 3.1 页面结构

```
Sidebar (minimal / vanishing)
Header (floating / soft)
Main Content (centered max-width)
```

```
┌─────────────┬──────────────────────────────────────────┐
│  Sidebar    │  Header（floating, blur 10px）            │
│  200px      │  h: 48px                                  │
│  transparent├──────────────────────────────────────────┤
│  无 border  │  Main Content                             │
│  hover 显现 │  max-width: 1200px, margin: 0 auto      │
│             │  padding: 32px 24px                       │
└─────────────┴──────────────────────────────────────────┘
```

### 3.2 内容容器（关键）

```css
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: var(--section-gap);
}
```

**变化**：
- ❌ full-width 工业控制台
- ✅ centered SaaS layout（Linear 风格）

Dashboard 等数据密集型页面可选用 `max-width: none`，但保持内边距。

### 3.3 Sidebar（极简化 — 消失感 Vanishing UI）

**设计目标**：Sidebar 平时「消失」，hover 才显现结构。

```css
.sidebar {
  width: 200px;
  background: transparent;
  padding: 16px;
}
```

**菜单项**：

```css
.nav-item {
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--text-secondary);
  transition: all 160ms ease;
}

.nav-item:hover {
  background: var(--surface);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--surface-2);
  color: var(--text-primary);
  font-weight: 500;
  /* minimal indicator：subtle dot 或字重变化，不用蓝条 */
}
```

**关键变化**：

| ❌ 移除 | ✅ 采用 |
|---------|---------|
| 左侧蓝条 active indicator | hover 才显现结构 |
| 强 border 分割 | active 轻背景 + subtle dot |
| box sidebar | transparent + spacing 分组 |

**结构**：Logo → ↑16px → Nav Group 1 → ↑24px → Nav Group 2 → ↑auto → Status Area（L3，无 border-t）

### 3.4 Header（Vercel 风格）

```css
.header {
  height: 48px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
```

**体验重点**：floating header、非「盒子感」、UI 轻漂浮。

面包屑：项间距 12px，`font-weight: 400`，L2 色 `--text-secondary`。

### 3.5 列表页标准结构

```vue
<!-- 列表详情页（设备 / 点位）：顶栏一行，左标题右操作 -->
<div class="page-shell list-detail-page">
  <div class="page-header list-page-header">
    <div class="header-left">
      <a-button class="list-back-btn">返回</a-button>
      <div class="header-info header-info--inline">
        <span class="protocol-tag">modbus-tcp</span>
        <h2 class="page-title title-text">设备列表</h2>
      </div>
    </div>
    <div class="header-right header-actions"><!-- 操作按钮 --></div>
  </div>
  <div class="list-detail-body">
    <div class="table-container saas-table"><!-- SaaS data grid --></div>
    <div class="list-detail-meta"><!-- 通道上下文 --></div>
  </div>
</div>
```

**列表详情页标题规则（必须）**：

| 规则 | 说明 |
|------|------|
| **标题不换行** | `.page-title` / `.title-text` 使用 `white-space: nowrap` |
| **协议 + 标题同行** | `.header-info--inline`：标签与 H1 横向排列，间距 12px |
| **标题与操作同行** | 左：返回 + 协议 + 页面名；右：`.header-actions` 操作按钮组 |
| **省略处理** | 极窄屏下标题 `text-overflow: ellipsis`，不折行 |

**通用列表页**：

```vue
<div class="page-header">       <!-- H1 + 描述 -->
<div class="toolbar">           <!-- 筛选 + 操作 -->
<div class="table-container">   <!-- SaaS data grid -->
```

- 工具栏与表格用 **spacing 分组**，无共用外边框
- 操作按钮右对齐，间距 8px
- 表格操作列固定右侧（`:fixed="'right'"`）
- 表格使用 `.saas-table` + floating rows，**禁止** `bordered cell` 工业网格

### 3.6 响应式断点

| 断点 | 宽度 | 策略 |
|------|------|------|
| sm | < 768px | 侧栏 overlay，page padding 16px |
| md | 768–1024px | 侧栏可折叠 |
| lg | > 1024px | 内容 max-width 1200px 居中 |
| xl | > 1440px | Dashboard 可放宽 max-width |

---

## 4. 组件规范

### 4.1 Card 系统（Linear 核心）

**基础卡片**：

```css
.card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 160ms ease;
}
```

**Hover（关键体验）**：

```css
.card:hover {
  border-color: rgba(14, 165, 233, 0.2);
  transform: translateY(-1px);
}
```

**禁止**：shadow-heavy · glow · thick border

结构：`header` → `body` → `footer（可选）`；卡片间距 ≥ 24px，推荐 32px。

### 4.2 Table（SaaS Data Grid）

**核心理念**：行之间「分离」，不是「切割」——floating rows。

```css
.saas-table {
  border-collapse: separate;
  border-spacing: 0 6px;
}

.saas-table tr {
  height: 44px;
  background: var(--bg);
}

.saas-table tbody tr:hover {
  background: rgba(248, 250, 252, 0.8);
}
```

| 属性 | 规范 |
|------|------|
| 行高 | 44px（Compact: 36px） |
| 行间距 | 6px gap，无强 row border |
| 表头 | 12px / 600 / L2，透明或极浅背景；**单行不换行**（`white-space: nowrap`），行高 40px |
| 选中 | subtle bg，不用左蓝条 |
| 单元格 | 左对齐；长文本 Tooltip |

**语义列 vs 文本列（必须）**：

| 列类型 | 展示 | 截断 | 列宽建议 |
|--------|------|------|----------|
| **文本列**（ID、名称、通道、表达式） | 单行 + `ellipsis` + Tooltip | ✅ 允许 | 按内容，≥ 112px |
| **语义列**（Tag、Badge、Switch） | 完整显示，**禁止截断** | ❌ 禁止 | 启用 ≥ 88px，状态 ≥ 108px |
| **计数列**（点位数、设备数） | 仅数字，Tooltip 补全语义 | ❌ 禁止 | 56–72px，居中 |
| **操作列** | `table-ops` 单行按钮组 | ❌ 禁止 | ≥ 200px，可 `fixed: right` |

实现约定：

- 语义内容外包 `.table-cell-semantic`；计数用 `.table-cell-count` + Tooltip
- 操作列用 `.table-ops`，`flex-wrap: nowrap`
- 全局样式 `globals.css` 对含 Tag/Switch/Badge 的单元格强制 `overflow: visible`
- **不得**对整表 `.arco-table-cell` 设 `overflow: hidden`（会裁切 Tag）

**滚动条（必须 — 不得遮挡文字）**：

Arco Table 默认 `embed` 滚动条会浮在单元格之上，**禁止**直接沿用。`.saas-table` / `.table-container` 须预留滚动 gutter，thumb 只在 gutter 内绘制。

| 场景 | 规范 |
|------|------|
| 水平滚动（`scroll.x`） | 内容区 `padding-bottom: 10px`，thumb 高 **6px**，在底部 gutter 内 |
| 垂直滚动（`scroll.y`） | 内容区 `padding-right: 8px`，thumb 宽 **6px**，在右侧 gutter 内 |
| 双轴滚动 | 同时预留底 + 右 gutter |
| 固定列 | 滚动条不得覆盖固定列内文字；靠 gutter + 禁用 inset 渐变阴影 |
| 样式 | thumb 圆角 3px；Light `#cbd5e1`，Dark `var(--text-tertiary)` |
| Arco 覆写 | `globals.css` §SaaS table scrollbars；**禁止** embed 全宽遮罩行内容 |

实现约定：

- 表格容器使用 `.table-container.saas-table`
- 有横向滚动时，末行文字与滚动条之间须保留 ≥ 10px 净距
- 长文本列仍用 `ellipsis` + Tooltip，**不得**依赖滚动条压住内容来「藏字」

**内容规则**：设备名称 L1（14px 600）+ ID L3（12px `--text-tertiary`）。

**单行文字规则（全局）**：

| 场景 | 规则 |
|------|------|
| 表头 `.arco-table-th` | `white-space: nowrap`，固定 40px 行高，溢出省略 |
| 表格 Tag / Badge / Switch | **禁止截断**，列宽充足 |
| 表格计数列 | 仅数字 + Tooltip，列宽 56–72px |
| 表格操作列 | `table-ops` 单行不换行 |
| 表单标签 `.arco-form-item-label` / `.field-label` | 不换行 |
| 弹窗 / 抽屉标题 | 不换行 + 省略 |
| 侧栏菜单 / Tab / 小按钮 | 不换行 |
| 页面标题 `.page-title` | 不换行（见 §3.5 列表详情页） |

### 4.3 Form（Notion / Linear 风格 — Flow Form）

**设计理念**：表单 = 信息流，不是 grid。

```css
.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.flow-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.flow-form-group {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
```

**Vue 示例（v3.0 默认）**：

```vue
<div class="form-controls-md flow-form">
  <div class="form-field">
    <div class="field-label">设备 ID <span class="req">*</span></div>
    <a-input v-model="form.id" />
  </div>
  <div class="form-field">
    <div class="field-label">设备名称</div>
    <a-input v-model="form.name" />
  </div>
</div>
```

**关键变化**：❌ grid form · rigid label alignment → ✅ flow layout

#### 输入框规格

| 属性 | 值 |
|------|-----|
| 高度 | 32px |
| 圆角 | 6px |
| 边框 | 1px `var(--border)` |
| Focus | `var(--primary)`，no glow |
| 字号 | 14px Inter |

#### 容器 class

| Class | 作用 |
|-------|------|
| `.form-controls-md` | 控件 32px、圆角 6px |
| `.form-controls-sm` | Compact 区 28px |
| `.flow-form` | 字段间距 16px |
| `.flow-form-group` | 分组间距 28px |
| `.form-field` | 标签 + 控件，gap 6px |
| `.field-label` | 12px Caption，L2 色 |

### 4.4 按钮

| 类型 | 高度 | 样式 |
|------|------|------|
| Primary | 32px | `#0ea5e9` 背景，白字，圆角 6px |
| Secondary | 32px | 白底 + `var(--border)` 边框 |
| Ghost | 28px | 无边框，hover `var(--surface-2)` |
| 行内操作 | 24px | 表格/积木块 |

- Focus：border color change only，**no glow / no ring**
- Click（可选）：`scale(0.98)`
- 危险操作：`#dc2626`

### 4.5 图标

- **库**：`@arco-design/web-vue/es/icon`
- 颜色跟随 `currentColor`

| 场景 | 尺寸 |
|------|------|
| 按钮内 | 14px |
| 导航 / 列表 | 16–18px |
| 空状态 | 48px |

### 4.6 标签与 Badge

协议标签：mono 10–11px，圆角 6px，配色见 `EdgeProtocolBadge.vue`。

状态 Badge：6px 圆点 + 文字（Success / Error 色）。

### 4.7 弹窗与抽屉

- 圆角 14px，标题 18px 600
- 内容区 padding 24px，max-height `70vh`
- 根容器 `form-controls-md flow-form`

### 4.8 通知与反馈

- `a-notification` 右上角，3s 自动关闭
- 加载：Skeleton / 按钮 loading
- 页面切换：fade 200ms

### 4.9 虚拟影子设备页（Virtual Shadow）

**列表页**（`VirtualShadowDevices.vue`）：

```vue
<div class="page-shell page-shell--compact virtual-shadow-page">
  <div class="page-header">…</div>
  <a-alert type="info" />           <!-- 快速指引 -->
  <div class="table-container saas-table">
    <a-table :expandable="…" />     <!-- 展开行显示点位表达式 -->
  </div>
</div>
```

| 元素 | 规范 |
|------|------|
| 页面容器 | `virtual-shadow-page` + `page-shell--compact` |
| 表格 | `.saas-table` floating rows，**禁止** bordered cell 工业网格 |
| 展开行 | `.expand-points` 背景 `--surface`（Dark: `--bg`） |
| 表达式 | `.ep-expr` / `.expr-code`：`--font-mono` + `--primary` |
| 实时值 | `.ep-value` / `.inline-live`：`--edgex-success` |

**积木编辑器 Modal**（`modal-class="virtual-shadow-builder-modal"`）：

| 区域 | Class | 说明 |
|------|-------|------|
| 分栏 | `.builder-split` | 左 340px 源设备/点位，右虚拟积木 |
| 左栏 | `.source-panel` | 设备检索 + 点位 chip 列表 |
| 右栏 | `.points-panel` | 批量映射投放区 + 积木块 |
| 点位 chip | `.point-chip` | 可拖拽；选中 primary tint |
| 批量投放 | `.batch-drop-canvas` | 虚线边框；拖入时 success tint |
| 积木块 | `.point-block` | 映射/计算两种 badge |

Dark 下 panel 背景 `--bg`，chip/block 背景 `--bg`，投放区半透明 tint（见 §2.1 Dark 规则 §5）。

样式文件：`ui/src/styles/virtual-shadow.css`。

### 4.10 北向接口页（Northbound）

**列表页**（`Northbound.vue`）：

```vue
<div class="page-shell northbound-page">
  <div class="mode-legend">…</div>          <!-- 主动/被动模式说明 -->
  <section class="channel-section">…</section>
  <NorthboundChannelCard />                  <!-- .nb-card -->
</div>
```

**添加通道弹窗**（`modal-class="northbound-add-modal"`）：

| 元素 | Class | 说明 |
|------|-------|------|
| 模式分区 | `.add-section__header--push/passive` | push/passive tint 背景 |
| 协议选项 | `.proto-option` | 卡片 hover primary tint + 右箭头 |
| 协议图标 | `.proto-option__icon` | `--proto-accent` 12% 混色底 |

**配置弹窗**（`modal-class="northbound-settings-modal"`）：

- 顶部 `.nb-mode-banner` 标明主动/被动模式
- 表单 `industrial-form form-controls-md` + `.nb-form-section__title` 分组
- Modal 圆角 14px，body padding 24px，max-height 70vh

**帮助 / 监控弹窗**：

| 类型 | modal-class |
|------|-------------|
| 接入文档 | `northbound-help-modal` |
| 运行监控 | `northbound-stats-modal` |

样式文件：`ui/src/styles/northbound-form.css`（含 Dark 覆写）。

---

## 5. 交互规范（Linear 级体验）

```css
transition: all 160ms ease;
```

| 场景 | 规范 |
|------|------|
| **Hover** | subtle background，no structural shift |
| **Focus** | border color change only，❌ no glow / ring |
| **Click** | optional `scale(0.98)` |
| **禁用** | opacity 0.5 |
| **空状态** | 48px 图标 + 一行说明 |
| **确认删除** | Modal 二次确认，危险按钮红色 |

---

## 6. Arco 组件尺寸（工程约束）

同一视觉区域必须统一 `size`，不可混用。

| Arco `size` | 高度 | 场景 |
|-------------|------|------|
| `large` | 36px | 登录页、安装向导 |
| **默认** | **32px** | **页面表单、弹窗、筛选区** |
| `small` | 28px | 表格内嵌、Compact 模式 |
| `mini` | 24px | 行内图标按钮 |

### Arco 覆写清单

| 组件 | v3.0 值 |
|------|---------|
| `Button` / `Input` / `Select` | 圆角 6px，无 ring |
| `Card` | 圆角 12px，`var(--border)`，无 shadow |
| `Modal` | 圆角 14px |
| `Table` | separate + border-spacing 6px；滚动条 gutter 不遮文字 |
| `Menu` | 移除左侧蓝条，subtle bg |
| `Layout.Sider` | transparent，无 border-r |

---

## 7. 深色模式

1. 使用 `--bg` / `--surface` / `--text-*` / `--border` token（完整表见 §2.1）
2. Sidebar 透明背景在 Dark 下自然过渡
3. Card hover、Table floating rows 在 Dark 下同样适用
4. 表格水平/垂直滚动条须在 gutter 内，**不得遮挡**单元格文字（见 §4.2）
5. 虚拟影子、配置弹窗、Help Drawer 等复杂页须单独验证 Dark
6. 每个主要页面提供 Light + Dark 截图

---

## 8. 性能与工程

| 文件 | 说明 |
|------|------|
| `ui/src/App.vue` | 全局布局、v3 token |
| `ui/src/styles/globals.css` | SaaS table、Focus、spacing |
| `ui/src/styles/form-controls.css` | Flow Form |
| `ui/src/styles/northbound-form.css` | 北向列表卡片 + 弹窗（添加/配置/帮助/监控） |
| `ui/src/components/EdgeProtocolBadge.vue` | 协议标签 |
| `ui/src/styles/lists-views.css` | 设备/点位列表页、标题不换行 |
| `ui/src/styles/config-modal.css` | 通道/设备配置弹窗 |
| `ui/src/styles/virtual-shadow.css` | 虚拟影子列表 + 积木编辑器 |
| `ui/src/views/VirtualShadowDevices.vue` | 分栏弹窗范例 |

- **Tailwind**：原子类 + v3.1 preset 计划
- **懒加载**：路由 code split；ECharts 动态 import

---

## 9. 验收清单

### 设计系统
- [ ] Spacing Token 统一（8 / 16 / 24 / 32px 节奏）
- [ ] 80/20 规则：结构靠 spacing，border 极轻
- [ ] 一页一 accent（Primary only）
- [ ] 内容居中：`max-width: 1200px`

### 布局
- [ ] Sidebar transparent，无蓝条，hover 显现
- [ ] Header blur 10px，48px，底边框 `rgba(0,0,0,0.05)`
- [ ] 列表详情页标题不换行，协议标签与标题同行
- [ ] 表格表头单行 40px，标签/菜单/Tab/小按钮不换行
- [ ] 非 edge-to-edge 控制台布局

### 组件
- [ ] Card：12px 圆角，hover `translateY(-1px)` + primary tint border，无 shadow
- [ ] Table：separate 6px spacing，44px 行高，floating rows；语义列/Tag/操作不截断；滚动条不遮文字
- [ ] Form：Flow layout，field 16px / group 28px
- [ ] Typography：Inter 为主，mono 仅技术 ID
- [ ] L1/L2/L3 信息层级正确
- [ ] Light / Dark 正常（含虚拟影子、配置弹窗）

### 交互
- [ ] 160ms 过渡，Focus 无 glow
- [ ] 768px / 1200px 布局正常
- [ ] 无工业遗留：蓝条、sharp box、双边框、grid-heavy form

---

## 附录 A. v2.x → v3.0 迁移对照

| 区域 | v2.x | v3.0 |
|------|------|------|
| 范式 | border-driven / dense | **spacing-driven / flow** |
| Page layout | full-width | **max-width 1200px 居中** |
| Sidebar | 蓝条 + border | **transparent + vanishing** |
| Header | 盒子感 | **floating blur** |
| Card hover | 边框加深 | **primary tint + translateY** |
| Table | row border 切割 | **floating rows 6px gap** |
| Form | grid | **Flow Form** |
| 字体 | mono 倾向 | **Inter 文档级可读** |

---

## 附录 B. 参考案例

| 产品 | 可借鉴点 |
|------|----------|
| **Linear** | 极低噪声、hover 交互、轻微圆角 |
| **Notion** | Flow layout、默认舒展 |
| **Vercel** | Floating header、blur、内容居中 |
| **Stripe Dashboard** | 数据清晰、低噪声表格 |
| Arco Design | 组件体系、工程落地 |

---

## 附录 C. v3.1 路线图（组件级实现）

| 优先级 | 任务 | 产出 |
|--------|------|------|
| ① | Arco Vue Theme 重写 | v3 token 注入 Arco 变量 |
| ② | 组件级封装 | Table / Form / Sidebar Vue 组件 |
| ③ | Tailwind preset | `@edgex/ui-preset` 自动 SaaS 化 |

---

*文档版本：v3.0 样式参考基线（Arco + Linear 级高端范式）*  
*最后更新：2026-06-26*  
*维护者：EdgeX UI 团队*
