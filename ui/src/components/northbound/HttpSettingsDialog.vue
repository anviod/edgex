<template>
  <a-modal
    v-model:visible="visible"
    title="HTTP 推送"
    :width="960"
    modal-class="northbound-settings-modal"
    unmount-on-close
    :footer="true"
    :mask-closable="false"
  >
    <div class="nb-mode-banner nb-mode-banner--push">
      <span class="nb-mode-banner__tag">主动上报</span>
      <span>
        网关通过 HTTP POST/PUT 定时推送采集数据到 REST 接口。
        配置项与 Payload 见
        <a href="/docs/API/Northbound_Configuration_CN.html" target="_blank" class="nb-help-link">北向配置 API</a>。
      </span>
    </div>

    <a-tabs v-model:active-key="activeTab" type="rounded" size="small">
      <a-tab-pane key="basic">
        <template #title>连接配置</template>
        <a-form :model="form" layout="vertical" class="industrial-form form-controls-md">
          <a-row :gutter="16">
            <a-col :span="16">
              <a-form-item label="通道名称" required>
                <a-input v-model="form.name" placeholder="例如: 云端生产环境 HTTP" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="启用"><a-switch v-model="form.enable" /></a-form-item>
            </a-col>
          </a-row>

          <div class="nb-form-section">
            <div class="nb-form-section__title">目标服务器</div>
            <a-form-item label="服务器地址" required>
              <a-input v-model="form.url" placeholder="http://localhost:8080" class="mono-text" />
            </a-form-item>
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="请求方法">
                  <a-select v-model="form.method">
                    <a-option value="POST">POST</a-option>
                    <a-option value="PUT">PUT</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="数据端点">
                  <a-input v-model="form.data_endpoint" placeholder="/api/data" class="mono-text" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="事件端点">
                  <a-input v-model="form.device_event_endpoint" placeholder="/api/events" class="mono-text" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <a-collapse :bordered="false">
            <a-collapse-item header="认证与缓存（可选）" key="advanced">
              <a-form-item label="认证方式">
                <a-select v-model="form.auth_type">
                  <a-option value="None">无认证</a-option>
                  <a-option value="Basic">Basic Auth</a-option>
                  <a-option value="Bearer">Bearer Token</a-option>
                  <a-option value="APIKey">API Key</a-option>
                </a-select>
              </a-form-item>
              <a-row :gutter="16" v-if="form.auth_type === 'Basic'">
                <a-col :span="12"><a-form-item label="用户名"><a-input v-model="form.username" /></a-form-item></a-col>
                <a-col :span="12"><a-form-item label="密码"><a-input-password v-model="form.password" /></a-form-item></a-col>
              </a-row>
              <a-form-item v-if="form.auth_type === 'Bearer'" label="Token"><a-input-password v-model="form.token" /></a-form-item>
              <a-row :gutter="16" v-if="form.auth_type === 'APIKey'">
                <a-col :span="12"><a-form-item label="Key Name"><a-input v-model="form.api_key_name" /></a-form-item></a-col>
                <a-col :span="12"><a-form-item label="Key Value"><a-input-password v-model="form.api_key_value" /></a-form-item></a-col>
              </a-row>
              <a-divider style="margin: 12px 0" />
              <a-form-item label="启用离线缓存"><a-switch v-model="form.cache.enable" /></a-form-item>
              <a-row :gutter="16" v-if="form.cache.enable">
                <a-col :span="12"><a-form-item label="最大条数"><a-input-number v-model="form.cache.max_count" :min="1" style="width: 100%" /></a-form-item></a-col>
                <a-col :span="12"><a-form-item label="刷新间隔"><a-input v-model="form.cache.flush_interval" placeholder="1m" class="mono-text" /></a-form-item></a-col>
              </a-row>
            </a-collapse-item>
          </a-collapse>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="real-devices">
        <template #title>上报真实设备</template>
        <NorthboundReportStrategyPanel
          device-kind="real"
          :visible="visible"
          :all-devices="allDevices"
          v-model:devices="form.devices"
          v-model:virtual-devices="form.virtual_devices"
        />
      </a-tab-pane>

      <a-tab-pane key="virtual-devices">
        <template #title>上报虚拟设备</template>
        <NorthboundReportStrategyPanel
          device-kind="virtual"
          :visible="visible"
          :all-devices="allDevices"
          v-model:devices="form.devices"
          v-model:virtual-devices="form.virtual_devices"
        />
      </a-tab-pane>
    </a-tabs>

    <template #footer>
      <div class="industrial-modal-footer">
        <a-button @click="visible = false">取消</a-button>
        <a-button type="primary" :loading="loading" @click="saveSettings">保存</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import request from '@/utils/request'
import {
  closeNorthboundSettingsDialog,
  northboundSaveRequestConfig,
  notifyNorthboundSaveError,
  notifyNorthboundSaveSuccess,
  notifyNorthboundValidationError,
  validateNorthboundChannelName
} from '@/utils/northboundSave'
import NorthboundReportStrategyPanel from '@/components/northbound/NorthboundReportStrategyPanel.vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  config: { type: Object, default: null },
  allDevices: { type: Array, default: () => [] },
  northboundConfig: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:visible', 'saved'])

const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})
const loading = ref(false)
const form = ref({})
const activeTab = ref('basic')
const isNewMode = ref(false)

watch(() => props.visible, (val) => {
  if (val) {
    activeTab.value = 'basic'
    isNewMode.value = !props.config
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
        devices: {},
        virtual_devices: {}
      }
    }
    if (!form.value.cache) form.value.cache = { enable: true, max_count: 1000, flush_interval: '1m' }
    if (!form.value.devices) form.value.devices = {}
    if (!form.value.virtual_devices) form.value.virtual_devices = {}
  }
})

const buildPayload = () => {
  const payload = JSON.parse(JSON.stringify(form.value))
  if (!payload.headers || typeof payload.headers !== 'object') payload.headers = {}
  if (!payload.devices) payload.devices = {}
  if (!payload.virtual_devices) payload.virtual_devices = {}
  if (!payload.cache) payload.cache = { enable: true, max_count: 1000, flush_interval: '1m' }
  return payload
}

const saveSettings = async () => {
  const missing = []
  if (!form.value.name?.trim()) missing.push('通道名称')
  if (!form.value.url?.trim()) missing.push('服务器地址')
  if (missing.length) {
    notifyNorthboundValidationError('请填写必填项：' + missing.join('、'))
    activeTab.value = 'basic'
    return
  }

  const nameError = validateNorthboundChannelName(form.value.name, form.value.id, props.northboundConfig)
  if (nameError) {
    notifyNorthboundValidationError(nameError)
    activeTab.value = 'basic'
    return
  }

  loading.value = true
  try {
    await request.post('/api/northbound/http', buildPayload(), northboundSaveRequestConfig)
    notifyNorthboundSaveSuccess('HTTP 推送', isNewMode.value)
    closeNorthboundSettingsDialog(emit)
    emit('saved')
  } catch (e) {
    notifyNorthboundSaveError(e, 'HTTP 推送')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* v3.0 — styles in src/styles/ */
</style>
