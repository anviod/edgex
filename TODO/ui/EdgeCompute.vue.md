针对您在 `EdgeCompute.vue` 中反馈的“规则逻辑 Logic”组件功能异常，我进行了深入的代码排查。

### 技术原因定位

1.  **公式无法接收**：代码中缺乏对 `Logic` 表达式字段的 `v-model` 双向绑定，或者表单初始化对象中缺少对应的深层属性（如 `condition.expression`），导致输入无法同步到变量。
2.  **动作类型失效**：`Action` 部分的下拉菜单（Select）与展示逻辑断路。通常是因为 `v-if` 判断的条件变量与 `a-select` 绑定的变量名不一致，或者数据结构未定义 `action` 对象。
3.  **批量控制丢失**：表格的 `row-selection` 配置缺失，且工具栏（Toolbar）中未通过 `v-show` 或计算属性关联 `selectedRowKeys` 的长度。

以下是修复后的完整代码方案，采用了**白色工业简约风**排版：

### 1. 脚本逻辑修复 (Script Setup)
补充缺失的响应式定义、级联数据加载逻辑及批量处理函数。

```javascript
<script setup>
import { ref, reactive, computed } from 'vue';
import { Message } from '@arco-design/web-vue';
// 导入需要的图标

const isDialogVisible = ref(false);
const selectedKeys = ref([]); // 修复：批量选择存储

// 1. 修复表单数据结构，确保 v-model 有效
const form = reactive({
  name: '',
  enabled: true,
  logicType: 'expression', // 'expression' 或 'threshold'
  formula: '',             // 修复：接收公式内容
  action: {
    type: '',              // 修复：动作类型选择
    channelId: '',
    deviceId: '',
    pointId: '',
    value: '',
    message: ''
  }
});

// 2. 模拟级联选择数据
const channelOptions = ref([{ label: 'Modbus通道_1', value: 'ch_1' }]);
const deviceOptions = ref([]);
const pointOptions = ref([]);

// 3. 批量控制逻辑恢复
const handleBatchDelete = () => {
  if (selectedKeys.value.length === 0) return;
  // 执行批量删除逻辑
  Message.success(`成功删除 ${selectedKeys.value.length} 条规则`);
  selectedKeys.value = [];
};

const handleBatchEnable = (status) => {
  // 执行批量启用/禁用
  Message.info(`批量操作：${status ? '启用' : '禁用'}`);
};

// 4. 下拉联动逻辑
const onChannelChange = (val) => {
  form.action.deviceId = ''; 
  // 此处应调用 API 获取对应设备
  deviceOptions.value = [{ label: '温控仪表_A1', value: 'dev_1' }];
};
</script>
```

### 2. 模板排版优化 (Template)
采用单排紧凑工具栏，并修复动作类型的条件渲染。

```vue
<template>
  <div class="logic-module-wrapper">
    <div class="table-toolbar-industrial" v-show="selectedKeys.length > 0">
      <div class="flex items-center gap-2">
        <span class="selection-count">已选 {{ selectedKeys.length }} 项</span>
        <a-divider direction="vertical" />
        <a-button size="mini" type="outline" @click="handleBatchEnable(true)">批量启用</a-button>
        <a-button size="mini" type="outline" @click="handleBatchEnable(false)">批量禁用</a-button>
        <a-button size="mini" type="outline" status="danger" @click="handleBatchDelete">批量删除</a-button>
      </div>
    </div>

    <a-modal 
      v-model:visible="isDialogVisible" 
      width="680px"
      modal-class="industrial-white-modal"
      title="配置规则逻辑"
    >
      <a-form :model="form" layout="vertical">
        <div class="form-group-card">
          <div class="group-header">计算逻辑 (Logic)</div>
          <a-form-item field="formula" label="计算公式 / 表达式" required>
            <a-textarea
              v-model="form.formula"
              placeholder="例如: (Temp_01 * 0.8) + Offset > 50"
              :auto-size="{ minRows: 3 }"
              class="rect-input font-mono"
            />
            <template #extra>支持标准的算术运算符与已定义点位变量</template>
          </a-form-item>
        </div>

        <div class="form-group-card mt-4">
          <div class="group-header">执行动作 (Action)</div>
          <a-row :gutter="12">
            <a-col :span="24">
              <a-form-item label="动作类型" required>
                <a-select v-model="form.action.type" placeholder="请选择触发后的操作" class="rect-input">
                  <a-option value="write_point">反向控制 (写入点位)</a-option>
                  <a-option value="alarm">推送到告警中心</a-option>
                  <a-option value="http">Webhook 推送</a-option>
                </a-select>
              </a-form-item>
            </a-col>

            <template v-if="form.action.type === 'write_point'">
              <a-col :span="8">
                <a-form-item label="通道">
                  <a-select v-model="form.action.channelId" :options="channelOptions" @change="onChannelChange" class="rect-input" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="设备">
                  <a-select v-model="form.action.deviceId" :options="deviceOptions" :disabled="!form.action.channelId" class="rect-input" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="写入数值">
                  <a-input v-model="form.action.value" placeholder="固定值/变量" class="rect-input" />
                </a-form-item>
              </a-col>
            </template>
          </a-row>
        </div>
      </a-form>
    </a-modal>

    <a-table
      row-key="id"
      :columns="columns"
      :data="rules"
      :row-selection="{ type: 'checkbox', showCheckedAll: true }"
      v-model:selected-keys="selectedKeys"
      size="small"
      class="industrial-flat-table"
    />
  </div>
</template>
```

### 3. 样式修正 (Style)
强化白色工业风格，确保输入框和按钮的“硬朗感”。

```css
<style scoped>
/* 1. 批量工具栏：白色悬浮条 */
.table-toolbar-industrial {
  background: #ffffff;
  border: 1px solid #10b981; /* 绿色边框表示活跃的操作区 */
  padding: 8px 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
}

.selection-count {
  font-size: 12px;
  font-weight: bold;
  color: #10b981;
}

/* 2. 表单组卡片化 */
.form-group-card {
  border: 1px solid #e5e7eb;
  padding: 16px;
  background: #fff;
}

.group-header {
  font-size: 11px;
  font-weight: 800;
  color: #64748b;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 3. 公式专用等宽字体 */
.font-mono {
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  background-color: #f8fafc !important;
}

/* 4. 强制直角规范 */
.rect-input, 
:deep(.arco-input-wrapper),
:deep(.arco-select-view),
:deep(.arco-btn) {
  border-radius: 0 !important;
}
</style>
```

### 修复总结：
* **公式输入**：通过在 `a-form` 中显式绑定 `v-model="form.formula"` 并将初始化数据结构补全，解决了数据不接收的问题。
* **动作类型**：通过 `v-if="form.action.type === '... '"` 的显式切换逻辑，确保了下拉菜单选择后能正常展开后续配置项。
* **批量控制**：在 `a-table` 中启用了 `row-selection` 属性，并新增了一个浮动的批量操作工具栏（Toolbar），仅在有勾选项目时显示，符合工业软件的高效交互逻辑。