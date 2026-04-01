<template>
  <a-modal 
    v-model:visible="visible" 
    title="Sparkplug B 导出通道配置" 
    :width="1000" 
    @ok="saveSettings" 
    :ok-loading="loading" 
    unmount-on-close
    :footer="true"
    :mask-closable="false"
    class="industrial-modal"
  >
    <a-tabs v-model:active-key="activeTab" type="line" class="industrial-tabs">
      <a-tab-pane key="basic">
        <template #title><icon-settings /> 基本配置</template>
        <a-form :model="form" layout="horizontal" :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 19 }" class="industrial-form">
          <a-form-item label="通道名称" required>
            <a-input v-model="form.name" placeholder="例如: 工厂 Sparkplug B 网关" />
          </a-form-item>
          
          <a-form-item label="启用状态">
            <a-switch v-model="form.enable" type="round" />
          </a-form-item>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="Broker 地址" required>
                <a-input v-model="form.broker" placeholder="127.0.0.1" class="mono-text" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="端口" required>
                <a-input-number v-model="form.port" :min="1" :max="65535" placeholder="1883" />
              </a-form-item>
            </a-col>
          </a-row>
          
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="Client ID" required>
                <a-input v-model="form.client_id" placeholder="请输入 Client ID" class="mono-text" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Group ID" required>
                <a-input v-model="form.group_id" placeholder="请输入 Group ID" class="mono-text" />
              </a-form-item>
            </a-col>
          </a-row>
          
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="Node ID" required>
                <a-input v-model="form.node_id" placeholder="请输入 Node ID" class="mono-text" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="启用 Group Path">
                <a-switch v-model="form.group_path" />
              </a-form-item>
            </a-col>
          </a-row>
          
          <a-form-item label="启用别名">
            <a-switch v-model="form.enable_alias" />
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="cache">
        <template #title><icon-cloud /> 缓存配置</template>
        <a-form :model="form" layout="horizontal" :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 19 }" class="industrial-form">
          <a-form-item label="启用离线缓存">
            <a-switch v-model="form.offline_cache" />
          </a-form-item>
          <a-row :gutter="16" v-if="form.offline_cache">
            <a-col :span="8">
              <a-form-item label="内存缓存 (MB)">
                <a-input-number v-model="form.cache_mem_size" :min="1" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="磁盘缓存 (MB)">
                <a-input-number v-model="form.cache_disk_size" :min="1" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="重发间隔 (ms)">
                <a-input-number v-model="form.cache_resend_int" :min="100" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="security">
        <template #title><icon-lock /> 安全配置</template>
        <a-form :model="form" layout="horizontal" :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 19 }" class="industrial-form">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="用户名">
                <a-input v-model="form.username" placeholder="可选" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="密码">
                <a-input-password v-model="form.password" placeholder="可选" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-divider orientation="left">SSL/TLS</a-divider>
          <a-form-item label="启用 SSL/TLS">
            <a-switch v-model="form.ssl" />
          </a-form-item>
          <template v-if="form.ssl">
            <a-form-item label="CA 证书">
              <a-textarea v-model="form.ca_cert" :auto-size="{ minRows: 3 }" placeholder="PEM 格式" class="mono-text" />
            </a-form-item>
            <a-form-item label="客户端证书">
              <a-textarea v-model="form.client_cert" :auto-size="{ minRows: 3 }" placeholder="PEM 格式" class="mono-text" />
            </a-form-item>
            <a-form-item label="客户端密钥">
              <a-textarea v-model="form.client_key" :auto-size="{ minRows: 3 }" placeholder="PEM 格式" class="mono-text" />
            </a-form-item>
            <a-form-item label="密钥密码">
              <a-input-password v-model="form.key_password" />
            </a-form-item>
          </template>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="subscription">
        <template #title><icon-scan /> 数据订阅</template>
        <div class="table-container">
          <a-table 
            :columns="deviceColumns" 
            :data="deviceTableData" 
            size="small" 
            :bordered="{ wrapper: true, cell: true }" 
            :pagination="false"
            class="industrial-table-inline"
          >
            <template #enable="{ record }">
              <a-switch v-model="record._enable" size="small" @change="updateDeviceEnable(record)" />
            </template>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>

    <template #footer>
      <div class="industrial-modal-footer">
        <a-button @click="visible = false" class="btn-secondary">取消</a-button>
        <a-button type="primary" :loading="loading" @click="saveSettings" class="btn-primary">
          <template #icon><icon-plus /></template>保存通道配置
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { IconSettings, IconCloud, IconLock, IconScan, IconPlus } from '@arco-design/web-vue/es/icon'
import { showMessage } from '@/composables/useGlobalState'
import request from '@/utils/request'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  config: { type: Object, default: null },
  allDevices: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue', 'saved'])

const visible = ref(false)
const loading = ref(false)
const form = ref({})
const activeTab = ref('basic')

const deviceColumns = [
  { title: '设备名称', dataIndex: 'name', width: 200 },
  { title: '通道', dataIndex: 'channelName', width: 150 },
  { title: '启用上报', slotName: 'enable', width: 80, align: 'center' }
]

const deviceTableData = ref([])

watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(visible, (val) => {
  emit('update:modelValue', val)
  if (val) {
    activeTab.value = 'basic'
    if (props.config) {
      form.value = JSON.parse(JSON.stringify(props.config))
    } else {
      form.value = {
        enable: true,
        name: 'New Sparkplug B',
        broker: '127.0.0.1',
        port: 1883,
        client_id: 'sparkplug_client_' + Date.now(),
        group_id: 'Sparkplug B Devices',
        node_id: 'Edge Gateway',
        devices: {},
        enable_alias: false,
        group_path: false,
        offline_cache: false,
        cache_mem_size: 100,
        cache_disk_size: 500,
        cache_resend_int: 5000,
        ssl: false,
        username: '',
        password: '',
        ca_cert: '',
        client_cert: '',
        client_key: '',
        key_password: ''
      }
    }
    if (!form.value.devices) form.value.devices = {}
    deviceTableData.value = props.allDevices.map(dev => ({
      ...dev,
      _enable: !!form.value.devices[dev.id]
    }))
  }
})

const updateDeviceEnable = (record) => {
  form.value.devices[record.id] = record._enable
}

const saveSettings = async () => {
  loading.value = true
  try {
    await request.post('/api/northbound/sparkplugb', form.value)
    showMessage('Sparkplug B 配置保存成功', 'success')
    visible.value = false
    emit('saved')
  } catch (e) {
    showMessage('保存失败: ' + e.message, 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 弹窗整体风格优化 */
:deep(.arco-modal) {
  border-radius: 0;
}

:deep(.arco-modal-header) {
  border-bottom: 1px solid #e5e7eb;
  height: 48px;
}

/* 标签页对齐 */
.industrial-tabs :deep(.arco-tabs-nav-tab) {
  padding: 0 16px;
}

.industrial-tabs :deep(.arco-tabs-content) {
  padding: 24px;
}

/* 极简表单样式 */
.industrial-form :deep(.arco-form-item-label) {
  font-weight: 500;
  color: #475569;
  font-size: 13px;
  white-space: nowrap;
}

.industrial-form :deep(.arco-input),
.industrial-form :deep(.arco-textarea),
.industrial-form :deep(.arco-select-view),
.industrial-form :deep(.arco-input-number) {
  border-radius: 0; /* 直角设计 */
  background-color: #fcfcfc;
  border-color: #e5e7eb;
}

/* 技术数据专用字体 */
.mono-text {
  font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
  font-size: 12px;
}

/* 表格融合规范 */
.table-container {
  border: 1px solid #e5e7eb;
}

.industrial-table-inline :deep(.arco-table-th) {
  background-color: #f8fafc;
  font-weight: bold;
  height: 34px;
  border-bottom: 1px solid #e5e7eb;
}

.industrial-table-inline :deep(.arco-table-td) {
  height: 34px;
}

/* 底部操作区 */
.industrial-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 0 0;
}

.btn-primary {
  background-color: #0f172a !important;
  border-radius: 0 !important;
}

.btn-secondary {
  border-radius: 0 !important;
  border-color: #cbd5e1;
}

/* 消除 Arco Divider 默认外边距 */
:deep(.arco-divider-horizontal) {
  margin: 16px 0;
  border-bottom-style: dashed;
}
</style>
