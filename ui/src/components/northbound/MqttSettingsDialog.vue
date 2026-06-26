<template>
  <a-modal
    v-model:visible="visible"
    title="MQTT 客户端"
    :width="960"
    modal-class="northbound-settings-modal"
    unmount-on-close
    :footer="true"
    :mask-closable="false"
    :ok-loading="loading"
    @ok="saveSettings"
  >
    <div class="nb-mode-banner nb-mode-banner--push">
      <span class="nb-mode-banner__tag">主动上报</span>
      <span>网关连接 MQTT Broker，按配置策略主动推送采集数据</span>
    </div>

    <a-tabs v-model:active-key="activeTab" type="rounded" size="small">
      <a-tab-pane key="basic">
        <template #title>连接配置</template>
        <a-form :model="form" layout="vertical" class="industrial-form form-controls-md">
          <a-row :gutter="16">
            <a-col :span="16">
              <a-form-item label="通道名称" required>
                <a-input v-model="form.name" placeholder="例如: 云端生产环境 MQTT" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="启用"><a-switch v-model="form.enable" /></a-form-item>
            </a-col>
          </a-row>

          <div class="nb-form-section">
            <div class="nb-form-section__title">Broker 连接</div>
            <a-form-item label="Broker 地址" required>
              <a-input v-model="form.broker" placeholder="tcp://127.0.0.1:1883" class="mono-text" />
            </a-form-item>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="Client ID">
                  <a-input v-model="form.client_id" placeholder="edgex-01" class="mono-text">
                    <template #append>
                      <a-button type="text" size="mini" @click="autoFillTopics">生成推荐</a-button>
                    </template>
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="用户名"><a-input v-model="form.username" /></a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="密码"><a-input-password v-model="form.password" /></a-form-item>
              </a-col>
            </a-row>
          </div>

          <div class="nb-form-section">
            <div class="nb-form-section__title">主题</div>
            <a-form-item label="上报主题 (Upstream)">
              <a-input v-model="form.topic" class="mono-text" />
            </a-form-item>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="订阅主题 (Downstream)">
                  <a-input v-model="form.subscribe_topic" placeholder="/things/{client_id}/write/req" class="mono-text" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="写入响应主题">
                  <a-input v-model="form.write_response_topic" placeholder="默认: 订阅主题/resp" class="mono-text" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <a-collapse :bordered="false">
            <a-collapse-item header="设备状态与 LWT（可选）" key="advanced">
              <a-form-item label="状态上报主题"><a-input v-model="form.status_topic" class="mono-text" /></a-form-item>
              <a-form-item label="生命周期主题"><a-input v-model="form.device_lifecycle_topic" class="mono-text" /></a-form-item>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="上线消息"><a-textarea v-model="form.online_payload" :auto-size="{ minRows: 2 }" class="mono-text" /></a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="离线消息"><a-textarea v-model="form.offline_payload" :auto-size="{ minRows: 2 }" class="mono-text" /></a-form-item>
                </a-col>
              </a-row>
              <a-form-item label="遗嘱主题"><a-input v-model="form.lwt_topic" placeholder="默认同状态主题" class="mono-text" /></a-form-item>
              <a-form-item label="遗嘱消息"><a-textarea v-model="form.lwt_payload" :auto-size="{ minRows: 2 }" class="mono-text" /></a-form-item>
              <a-checkbox v-model="form.ignore_offline_data">设备离线时不主动上报历史数据</a-checkbox>
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
        <div class="table-container saas-table nb-device-table">
          <a-table row-key="id" :columns="deviceColumns" :data="deviceTableData" size="small" :bordered="false" :pagination="false" class="industrial-table-inline">
            <template #empty>
              <a-empty description="暂无南向设备，请先在通道管理中创建设备" />
            </template>
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
import { ref, computed, watch, nextTick } from 'vue'
import request from '@/utils/request'
import { showMessage } from '@/composables/useGlobalState'
import { buildNorthboundDeviceRows } from '@/utils/southboundDevices'

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

watch(() => props.visible, async (val) => {
  if (!val) return
  activeTab.value = 'basic'
  if (props.config) {
    form.value = JSON.parse(JSON.stringify(props.config))
  } else {
    form.value = {
      id: 'mqtt_' + Date.now(),
      enable: true,
      name: 'New MQTT',
      broker: 'tcp://127.0.0.1:1883',
      client_id: '',
      topic: '',
      subscribe_topic: '',
      write_response_topic: '',
      ignore_offline_data: false,
      device_lifecycle_topic: '',
      status_topic: '',
      online_payload: '',
      offline_payload: '',
      lwt_topic: '',
      lwt_payload: '',
      username: '',
      password: '',
      devices: {}
    }
  }
  if (!form.value.devices) form.value.devices = {}
  batchInterval.value = DEFAULT_INTERVAL
  await nextTick()
  buildDeviceTable()
})

watch(() => props.allDevices, () => {
  if (props.visible) buildDeviceTable()
}, { deep: true })

const buildDeviceTable = () => {
  deviceTableData.value = buildNorthboundDeviceRows(props.allDevices, form.value.devices, DEFAULT_INTERVAL)
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

const autoFillTopics = () => {
  if (!form.value.client_id) form.value.client_id = 'edgex'
  const root = 'things/{client_id}'
  form.value.topic = `${root}/up`
  form.value.subscribe_topic = `${root}/down/req`
  form.value.write_response_topic = `${root}/down/resp`
  form.value.status_topic = `${root}/{device_id}/status`
  form.value.device_lifecycle_topic = `${root}/lifecycle`
  form.value.lwt_topic = `${root}/lwt`
  form.value.online_payload = JSON.stringify({ status: 'online', device_id: '%device_id%', timestamp: '%timestamp%' })
  form.value.offline_payload = JSON.stringify({ status: 'offline', device_id: '%device_id%', timestamp: '%timestamp%' })
  form.value.lwt_payload = JSON.stringify({ status: 'lwt', device_id: '%device_id%', timestamp: '%timestamp%' })
  showMessage('已生成推荐主题', 'success')
}

const saveSettings = async () => {
  loading.value = true
  try {
    await request.post('/api/northbound/mqtt', { ...form.value })
    showMessage('MQTT 配置已保存', 'success')
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
/* v3.0 — styles in src/styles/ */
</style>
