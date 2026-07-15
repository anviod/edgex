<template>
  <a-modal
    v-model:visible="visible"
    title="Sparkplug B"
    :width="960"
    modal-class="northbound-settings-modal"
    unmount-on-close
    :footer="true"
    :mask-closable="false"
  >
    <div class="nb-mode-banner nb-mode-banner--push">
      <span class="nb-mode-banner__tag">主动上报</span>
      <span>基于 MQTT 的 Sparkplug B 工业协议，自动发布 NBIRTH/DBIRTH 等标准消息</span>
    </div>

    <a-tabs v-model:active-key="activeTab" type="rounded" size="small">
      <a-tab-pane key="basic">
        <template #title>连接配置</template>
        <a-form :model="form" layout="vertical" class="industrial-form form-controls-md">
          <a-row :gutter="16">
            <a-col :span="16">
              <a-form-item label="通道名称" required>
                <a-input v-model="form.name" placeholder="例如: 工厂 Sparkplug B 网关" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="启用"><a-switch v-model="form.enable" /></a-form-item>
            </a-col>
          </a-row>

          <div class="nb-form-section">
            <div class="nb-form-section__title">Broker 连接</div>
            <a-row :gutter="16">
              <a-col :span="16">
                <a-form-item label="Broker 地址" required>
                  <a-input v-model="form.broker" placeholder="127.0.0.1" class="mono-text" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="端口" required>
                  <a-input-number v-model="form.port" :min="1" :max="65535" placeholder="1883" style="width: 100%" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="Client ID" required>
                  <a-input v-model="form.client_id" class="mono-text" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="用户名"><a-input v-model="form.username" /></a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="密码"><a-input-password v-model="form.password" /></a-form-item>
              </a-col>
            </a-row>
          </div>

          <div class="nb-form-section">
            <div class="nb-form-section__title">Sparkplug 标识</div>
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="Group ID" required>
                  <a-input v-model="form.group_id" class="mono-text" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="Node ID" required>
                  <a-input v-model="form.node_id" class="mono-text" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="选项">
                  <a-space direction="vertical" size="mini" fill>
                    <a-checkbox v-model="form.group_path">Group Path</a-checkbox>
                    <a-checkbox v-model="form.enable_alias">启用别名</a-checkbox>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <a-collapse :bordered="false">
            <a-collapse-item header="SSL/TLS 与离线缓存（可选）" key="advanced">
              <a-form-item label="启用 SSL/TLS"><a-switch v-model="form.ssl" /></a-form-item>
              <template v-if="form.ssl">
                <a-form-item label="CA 证书"><a-textarea v-model="form.ca_cert" :auto-size="{ minRows: 2 }" class="mono-text" /></a-form-item>
                <a-row :gutter="16">
                  <a-col :span="12"><a-form-item label="客户端证书"><a-textarea v-model="form.client_cert" :auto-size="{ minRows: 2 }" class="mono-text" /></a-form-item></a-col>
                  <a-col :span="12"><a-form-item label="客户端密钥"><a-textarea v-model="form.client_key" :auto-size="{ minRows: 2 }" class="mono-text" /></a-form-item></a-col>
                </a-row>
              </template>
              <a-divider style="margin: 12px 0" />
              <a-form-item label="启用离线缓存"><a-switch v-model="form.offline_cache" /></a-form-item>
              <a-row :gutter="16" v-if="form.offline_cache">
                <a-col :span="8"><a-form-item label="内存 (MB)"><a-input-number v-model="form.cache_mem_size" :min="1" style="width: 100%" /></a-form-item></a-col>
                <a-col :span="8"><a-form-item label="磁盘 (MB)"><a-input-number v-model="form.cache_disk_size" :min="1" style="width: 100%" /></a-form-item></a-col>
                <a-col :span="8"><a-form-item label="重发 (ms)"><a-input-number v-model="form.cache_resend_int" :min="100" style="width: 100%" /></a-form-item></a-col>
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
  extractNorthboundSaveWarning,
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
        id: 'sparkplug_' + Date.now(),
        enable: true,
        name: 'New Sparkplug B',
        broker: '127.0.0.1',
        port: 1883,
        client_id: 'sparkplug_client_' + Date.now(),
        group_id: 'Sparkplug B Devices',
        node_id: 'Edge Gateway',
        devices: {},
        virtual_devices: {},
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
    if (!form.value.virtual_devices) form.value.virtual_devices = {}
  }
})

const buildPayload = () => {
  const payload = JSON.parse(JSON.stringify(form.value))
  if (!payload.devices) payload.devices = {}
  if (!payload.virtual_devices) payload.virtual_devices = {}
  return payload
}

const saveSettings = async () => {
  const missing = []
  if (!form.value.name?.trim()) missing.push('通道名称')
  if (!form.value.broker?.trim()) missing.push('Broker 地址')
  if (!form.value.port) missing.push('端口')
  if (!form.value.client_id?.trim()) missing.push('Client ID')
  if (!form.value.group_id?.trim()) missing.push('Group ID')
  if (!form.value.node_id?.trim()) missing.push('Node ID')
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
    const res = await request.post('/api/northbound/sparkplugb', buildPayload(), northboundSaveRequestConfig)
    notifyNorthboundSaveSuccess('Sparkplug B', isNewMode.value, extractNorthboundSaveWarning(res))
    closeNorthboundSettingsDialog(emit)
    emit('saved')
  } catch (e) {
    notifyNorthboundSaveError(e, 'Sparkplug B')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* v3.0 — styles in src/styles/ */
</style>
