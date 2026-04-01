<template>
  <a-modal 
    v-model:visible="visible" 
    title="HTTP 导出通道配置" 
    :width="1000" 
    @ok="saveSettings" 
    :ok-loading="loading" 
    unmount-on-close
    :footer="true"
    :mask-closable="false"
    class="industrial-modal"
  >
    <a-form :model="form" layout="horizontal" :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 19 }" class="industrial-form">
      <a-form-item label="通道名称" required>
        <a-input v-model="form.name" placeholder="例如: 云端生产环境 HTTP" />
      </a-form-item>
      
      <a-form-item label="启用状态">
        <a-switch v-model="form.enable" type="round" />
      </a-form-item>

      <a-divider orientation="left">服务器配置</a-divider>

      <a-form-item label="服务器地址" required>
        <a-input v-model="form.url" placeholder="http://localhost:8080" class="mono-text" />
      </a-form-item>
      
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="请求方法">
            <a-select v-model="form.method">
              <a-option value="POST">POST</a-option>
              <a-option value="PUT">PUT</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="数据端点">
            <a-input v-model="form.data_endpoint" placeholder="/api/data" class="mono-text" />
          </a-form-item>
        </a-col>
      </a-row>
      
      <a-form-item label="设备事件端点">
        <a-input v-model="form.device_event_endpoint" placeholder="/api/events" class="mono-text" />
      </a-form-item>

      <a-divider orientation="left">认证配置</a-divider>
      <a-form-item label="认证方式">
        <a-select v-model="form.auth_type">
          <a-option value="None">无认证</a-option>
          <a-option value="Basic">Basic Auth</a-option>
          <a-option value="Bearer">Bearer Token</a-option>
          <a-option value="APIKey">API Key</a-option>
        </a-select>
      </a-form-item>
      <a-row :gutter="16" v-if="form.auth_type === 'Basic'">
        <a-col :span="12">
          <a-form-item label="用户名">
            <a-input v-model="form.username" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="密码">
            <a-input-password v-model="form.password" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item label="Token" v-if="form.auth_type === 'Bearer'">
        <a-input-password v-model="form.token" />
      </a-form-item>
      <template v-if="form.auth_type === 'APIKey'">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Key Name">
              <a-input v-model="form.api_key_name" placeholder="X-API-Key" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Key Value">
              <a-input-password v-model="form.api_key_value" />
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <a-divider orientation="left">缓存配置</a-divider>
      <a-form-item label="启用缓存">
        <a-switch v-model="form.cache.enable" />
      </a-form-item>
      <a-row :gutter="16" v-if="form.cache.enable">
        <a-col :span="12">
          <a-form-item label="最大缓存数">
            <a-input-number v-model="form.cache.max_count" :min="1" :max="100000" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="刷新间隔">
            <a-input v-model="form.cache.flush_interval" placeholder="1m" class="mono-text" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

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
import { IconPlus } from '@arco-design/web-vue/es/icon'
import { showMessage } from '@/composables/useGlobalState'
import request from '@/utils/request'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  config: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'saved'])

const visible = ref(false)
const loading = ref(false)
const form = ref({})

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
        id: 'http_' + Date.now(),
        enable: true,
        name: 'New HTTP',
        url: 'http://localhost:8080',
        method: 'POST',
        headers: {},
        auth_type: 'None',
        username: '',
        password: '',
        token: '',
        api_key_name: '',
        api_key_value: '',
        data_endpoint: '/api/data',
        device_event_endpoint: '/api/events',
        cache: { enable: true, max_count: 1000, flush_interval: '1m' },
        devices: {}
      }
    }
    if (!form.value.cache) form.value.cache = { enable: true, max_count: 1000, flush_interval: '1m' }
  }
})

const saveSettings = async () => {
  loading.value = true
  try {
    const payload = JSON.parse(JSON.stringify(form.value))
    if (payload.devices && typeof payload.devices === 'object') {
      for (const k of Object.keys(payload.devices)) {
        const v = payload.devices[k]
        if (v && typeof v === 'object') {
          payload.devices[k] = !!v.enable
        } else {
          payload.devices[k] = !!v
        }
      }
    }
    await request.post('/api/northbound/http', payload)
    showMessage('HTTP 配置已保存', 'success')
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
