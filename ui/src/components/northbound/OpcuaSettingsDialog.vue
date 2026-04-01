<template>
  <a-modal 
    v-model:visible="visible" 
    title="OPC UA 服务端配置" 
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
            <a-input v-model="form.name" placeholder="例如: 工厂 SCADA OPC UA" />
          </a-form-item>
          
          <a-form-item label="启用状态">
            <a-switch v-model="form.enable" type="round" />
          </a-form-item>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="监听端口" required>
                <a-input-number v-model="form.port" :min="1" :max="65535" placeholder="4840" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Endpoint" required>
                <a-input v-model="form.endpoint" placeholder="/ipp/opcua/server" class="mono-text" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-form-item label="安全策略">
            <a-select v-model="form.security_policy">
              <a-option value="Auto">自动</a-option>
              <a-option value="None">None (不加密)</a-option>
              <a-option value="Basic256Sha256">Basic256Sha256 (推荐)</a-option>
              <a-option value="Aes128_Sha256_RsaOaep">Aes128_Sha256_RsaOaep</a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="信任证书路径">
            <a-input v-model="form.trusted_cert_path" placeholder="可选" class="mono-text" />
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="authentication">
        <template #title><icon-lock /> 身份认证</template>
        <a-form :model="form" layout="horizontal" :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 19 }" class="industrial-form">
          <a-form-item label="认证方式">
            <a-checkbox-group v-model="form.auth_methods">
              <a-checkbox value="Anonymous">匿名登录</a-checkbox>
              <a-checkbox value="UserName">用户名/密码</a-checkbox>
              <a-checkbox value="Certificate">证书认证</a-checkbox>
            </a-checkbox-group>
          </a-form-item>

          <template v-if="form.auth_methods && form.auth_methods.includes('UserName')">
            <div class="user-list-container">
              <div class="user-list-header">
                <span>用户列表</span>
                <a-button type="outline" size="small" @click="addUser" class="industrial-btn">
                  <template #icon><icon-plus :size="12" /></template>
                  添加用户
                </a-button>
              </div>
              <div v-for="(user, index) in userList" :key="index" class="user-item">
                <a-input v-model="user.username" placeholder="用户名" size="small" />
                <a-input-password v-model="user.password" placeholder="密码" size="small" />
                <a-button type="text" status="danger" size="small" @click="userList.splice(index, 1)">
                  <template #icon><icon-delete :size="14" /></template>
                </a-button>
              </div>
            </div>
          </template>

          <template v-if="form.auth_methods && form.auth_methods.includes('Certificate')">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="服务器证书路径">
                  <a-input v-model="form.cert_file" placeholder="server.crt" class="mono-text" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="服务器私钥路径">
                  <a-input v-model="form.key_file" placeholder="server.key" class="mono-text" />
                </a-form-item>
              </a-col>
            </a-row>
          </template>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="device-mapping">
        <template #title><icon-scan /> 设备映射</template>
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
import { IconPlus, IconDelete, IconSettings, IconLock, IconScan } from '@arco-design/web-vue/es/icon'
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
const userList = ref([])
const deviceTableData = ref([])
const activeTab = ref('basic')

const deviceColumns = [
  { title: '设备名称', dataIndex: 'name', width: 200 },
  { title: '设备 ID', dataIndex: 'id', width: 200 },
  { title: '通道', dataIndex: 'channelName', width: 150 },
  { title: '启用映射', slotName: 'enable', width: 80, align: 'center' }
]

watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(visible, (val) => {
  emit('update:modelValue', val)
  if (val) {
    if (props.config) {
      form.value = JSON.parse(JSON.stringify(props.config))
    } else {
      form.value = {
        enable: true,
        name: 'New OPC UA Server',
        port: 4840,
        endpoint: '/ipp/opcua/server',
        security_policy: 'Auto',
        trusted_cert_path: '',
        devices: {},
        auth_methods: ['Anonymous'],
        users: {},
        cert_file: '',
        key_file: ''
      }
    }
    if (!form.value.devices) form.value.devices = {}
    if (!form.value.auth_methods) form.value.auth_methods = ['Anonymous']
    if (!form.value.users) form.value.users = {}

    userList.value = []
    if (form.value.users) {
      for (const [u, p] of Object.entries(form.value.users)) {
        userList.value.push({ username: u, password: p })
      }
    }

    deviceTableData.value = props.allDevices.map(dev => ({
      ...dev,
      _enable: !!form.value.devices[dev.id]
    }))
  }
})

const addUser = () => {
  userList.value.push({ username: '', password: '' })
}

const updateDeviceEnable = (record) => {
  form.value.devices[record.id] = record._enable
}

const saveSettings = async () => {
  loading.value = true
  form.value.users = {}
  if (userList.value) {
    userList.value.forEach(u => {
      if (u.username) form.value.users[u.username] = u.password
    })
  }
  try {
    await request.post('/api/northbound/opcua', form.value)
    showMessage('OPC UA 配置已保存', 'success')
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

/* 工业风按钮 */
.industrial-btn {
  border-radius: 0 !important;
  box-shadow: none !important;
}

/* 用户列表样式 */
.user-list-container {
  margin-bottom: 16px;
}

.user-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.user-list-header span {
  font-size: 14px;
  font-weight: 500;
}

.user-item {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}

.user-item .arco-input {
  flex: 1;
  border-radius: 0;
  background-color: #fcfcfc;
  border-color: #e5e7eb;
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
