<template>
  <a-modal 
    v-model:visible="visible" 
    title="HTTP 推送" 
    :width="960" 
    @ok="saveSettings" 
    :ok-loading="loading" 
    unmount-on-close
    :footer="true"
    :mask-closable="false"
  >
    <div class="nb-mode-banner nb-mode-banner--push">
      <span class="nb-mode-banner__tag">主动上报</span>
      <span>网关通过 HTTP POST/PUT 定时推送采集数据到 REST 接口</span>
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

      <a-tab-pane key="device-strategy">
        <template #title>上报策略</template>
        <div class="table-header table-header--strategy">
          <span class="table-header__hint">启用设备默认周期上报 10s</span>
          <div class="table-header__actions">
            <a-input
              v-model="batchInterval"
              size="small"
              placeholder="10s"
              class="mono-text batch-interval-input"
              @press-enter="batchSetInterval"
            />
            <a-button type="outline" size="small" @click="batchSetInterval">批量设置周期</a-button>
            <a-button type="outline" size="small" @click="autoFillDevices">全部启用 (10s)</a-button>
          </div>
        </div>
        <div class="table-container">
          <a-table :columns="deviceColumns" :data="deviceTableData" size="small" :pagination="false" class="industrial-table-inline">
            <template #state="{ record }">
              <a-tag v-if="record.state === 0" color="green" size="small">在线</a-tag>
              <a-tag v-else-if="record.state === 1" color="orangered" size="small">不稳定</a-tag>
              <a-tag v-else color="red" size="small">离线</a-tag>
            </template>
            <template #enable="{ record }">
              <a-switch v-model="record._enable" size="small" @change="updateDeviceEnable(record)" />
            </template>
            <template #strategy="{ record }">
              <a-select v-model="record._strategy" size="small" :disabled="!record._enable" @change="updateDeviceStrategy(record)" class="mono-text strategy-select">
                <a-option value="periodic">周期上报</a-option>
                <a-option value="change">变化上报</a-option>
              </a-select>
            </template>
            <template #interval="{ record }">
              <a-input
                v-if="record._strategy === 'periodic'"
                v-model="record._interval"
                size="small"
                :disabled="!record._enable"
                placeholder="10s"
                class="mono-text strategy-interval-input"
                @change="updateDeviceInterval(record)"
              />
            </template>
          </a-table>
        </div>
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
import { showMessage } from '@/composables/useGlobalState'
import request from '@/utils/request'

const props = defineProps({
  visible: { type: Boolean, default: false },
  config: { type: Object, default: null },
  allDevices: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:visible', 'saved'])

const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})
const loading = ref(false)
const form = ref({})
const activeTab = ref('basic')
const deviceTableData = ref([])
const batchInterval = ref('10s')

const DEFAULT_INTERVAL = '10s'

const deviceColumns = [
  { title: '设备', dataIndex: 'name', width: 180, ellipsis: true, tooltip: true },
  { title: '通道', dataIndex: 'channelName', width: 120 },
  { title: '状态', slotName: 'state', width: 80, align: 'center' },
  { title: '启用', slotName: 'enable', width: 70, align: 'center' },
  { title: '策略', slotName: 'strategy', width: 130 },
  { title: '上报周期', slotName: 'interval', width: 100 }
]

watch(() => props.visible, (val) => {
  if (val) {
    activeTab.value = 'basic'
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
    if (!form.value.devices) form.value.devices = {}
    batchInterval.value = DEFAULT_INTERVAL
    buildDeviceTable()
  }
})

const buildDeviceTable = () => {
  deviceTableData.value = props.allDevices.map(dev => {
    const current = form.value.devices[dev.id]
    let _enable = false, _strategy = 'periodic', _interval = DEFAULT_INTERVAL
    if (current === undefined || current === null) {
      _enable = false
    } else if (typeof current === 'boolean') {
      _enable = current
      if (_enable) {
        _strategy = 'periodic'
        _interval = DEFAULT_INTERVAL
      }
    } else if (typeof current === 'object') {
      _enable = !!current.enable
      _strategy = current.strategy || 'periodic'
      _interval = current.interval || DEFAULT_INTERVAL
    }
    return { ...dev, _enable, _strategy, _interval }
  })
}

const syncRecordToForm = (record) => {
  form.value.devices[record.id] = {
    enable: record._enable,
    strategy: record._strategy,
    interval: record._interval || DEFAULT_INTERVAL
  }
}

const updateDeviceEnable = (record) => {
  if (record._enable) {
    record._strategy = 'periodic'
    record._interval = record._interval || DEFAULT_INTERVAL
  }
  if (!form.value.devices[record.id] || typeof form.value.devices[record.id] === 'boolean') {
    syncRecordToForm(record)
  } else {
    form.value.devices[record.id].enable = record._enable
    if (record._enable) {
      form.value.devices[record.id].strategy = 'periodic'
      form.value.devices[record.id].interval = record._interval
    }
  }
}

const updateDeviceStrategy = (record) => {
  if (record._strategy === 'periodic' && !record._interval) {
    record._interval = DEFAULT_INTERVAL
  }
  if (!form.value.devices[record.id] || typeof form.value.devices[record.id] === 'boolean') {
    syncRecordToForm(record)
  } else {
    form.value.devices[record.id].strategy = record._strategy
    if (record._strategy === 'periodic') {
      form.value.devices[record.id].interval = record._interval
    }
  }
}

const updateDeviceInterval = (record) => {
  record._interval = record._interval || DEFAULT_INTERVAL
  if (!form.value.devices[record.id] || typeof form.value.devices[record.id] === 'boolean') {
    syncRecordToForm(record)
  } else {
    form.value.devices[record.id].interval = record._interval
  }
}

const batchSetInterval = () => {
  const interval = (batchInterval.value || DEFAULT_INTERVAL).trim()
  if (!interval) {
    showMessage('请输入上报周期', 'warning')
    return
  }
  let count = 0
  deviceTableData.value.forEach(record => {
    if (!record._enable) return
    record._strategy = 'periodic'
    record._interval = interval
    syncRecordToForm(record)
    count++
  })
  if (count === 0) {
    showMessage('请先启用至少一个设备', 'warning')
    return
  }
  showMessage(`已为 ${count} 个设备设置周期 ${interval}`, 'success')
}

const autoFillDevices = () => {
  deviceTableData.value.forEach(record => {
    record._enable = true
    record._strategy = 'periodic'
    record._interval = DEFAULT_INTERVAL
    syncRecordToForm(record)
  })
  showMessage('已启用全部设备，周期 10s', 'success')
}

const saveSettings = async () => {
  loading.value = true
  try {
    const payload = JSON.parse(JSON.stringify(form.value))
    if (payload.devices && typeof payload.devices === 'object') {
      for (const k of Object.keys(payload.devices)) {
        const v = payload.devices[k]
        payload.devices[k] = (v && typeof v === 'object') ? !!v.enable : !!v
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
@import '@/styles/northbound-form.css';
</style>
