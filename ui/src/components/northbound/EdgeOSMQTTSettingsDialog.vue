<template>
  <a-modal
    v-model:visible="visible"
    :title="isEdit ? '编辑 edgeOS (MQTT)' : '新增 edgeOS (MQTT)'"
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
      <span>edgeOS 平台 MQTT 3.1.1，节点注册与双向通信</span>
    </div>

    <a-tabs v-model:active-key="activeTab" type="rounded" size="small">
      <a-tab-pane key="basic">
        <template #title>连接配置</template>
        <a-form :model="form" layout="vertical" class="industrial-form form-controls-md">
          <a-row :gutter="16">
            <a-col :span="16">
              <a-form-item label="通道名称" required>
                <a-input v-model="form.name" placeholder="例如: edgeOS MQTT 生产通道" />
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
                <a-form-item label="Client ID" required>
                  <a-input v-model="form.client_id" placeholder="edgex-node-001" class="mono-text" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="节点 ID" required>
                  <a-input v-model="form.node_id" placeholder="edgex-node-001" class="mono-text" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="用户名"><a-input v-model="form.username" placeholder="可选" /></a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="密码"><a-input-password v-model="form.password" placeholder="可选" /></a-form-item>
              </a-col>
            </a-row>
          </div>

          <div class="nb-form-section">
            <div class="nb-form-section__title">MQTT 选项</div>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="QoS 级别">
                  <a-select v-model="form.qos">
                    <a-option :value="0">0 - 最多一次</a-option>
                    <a-option :value="1">1 - 至少一次</a-option>
                    <a-option :value="2">2 - 恰好一次</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="心跳周期">
                  <a-input v-model="form.heartbeat_interval" placeholder="30s" class="mono-text" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="心跳间隔 (秒)">
                  <a-input-number v-model="form.keep_alive" :min="10" :max="3600" placeholder="60" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="保留消息"><a-switch v-model="form.retain" /></a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="自动重连"><a-switch v-model="form.auto_reconnect" /></a-form-item>
              </a-col>
            </a-row>
          </div>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="device-strategy">
        <template #title>上报策略</template>
        <div class="table-header table-header--strategy">
          <span class="table-header__hint">启用设备默认周期上报 {{ DEFAULT_INTERVAL }}</span>
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
          <a-table
            row-key="id"
            :columns="deviceColumns"
            :data="deviceTableData"
            size="small"
            :bordered="false"
            :pagination="false"
            class="industrial-table-inline"
          >
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
              <a-select
                v-model="record._strategy"
                size="small"
                :disabled="!record._enable"
                class="mono-text strategy-select"
                @change="updateDeviceStrategy(record)"
              >
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
import { showMessage } from '@/composables/useGlobalState'
import request from '@/utils/request'
import { buildNorthboundDeviceRows, fetchAllSouthboundDevices } from '@/utils/southboundDevices'

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
const deviceTableData = ref([])
const activeTab = ref('basic')
const batchInterval = ref('10s')

const DEFAULT_INTERVAL = '10s'
const isEdit = computed(() => props.config && props.config.id)

const deviceColumns = [
  { title: '设备', dataIndex: 'name', width: 180, ellipsis: true, tooltip: true },
  { title: '通道', dataIndex: 'channelName', width: 120 },
  { title: '状态', slotName: 'state', width: 80, align: 'center' },
  { title: '启用', slotName: 'enable', width: 70, align: 'center' },
  { title: '策略', slotName: 'strategy', width: 130 },
  { title: '上报周期', slotName: 'interval', width: 100 }
]

const localDevices = ref([])

const initForm = () => {
  activeTab.value = 'basic'
  if (props.config) {
    form.value = JSON.parse(JSON.stringify(props.config))
  } else {
    form.value = {
      id: 'edgeos-mqtt_' + Date.now(),
      enable: true,
      name: 'New edgeOS MQTT',
      broker: 'tcp://127.0.0.1:1883',
      client_id: 'edgex-node-001',
      node_id: 'edgex-node-001',
      username: '',
      password: '',
      qos: 1,
      retain: false,
      keep_alive: 60,
      auto_reconnect: true,
      heartbeat_interval: '30s',
      devices: {}
    }
  }
  if (!form.value.devices) form.value.devices = {}
  batchInterval.value = DEFAULT_INTERVAL
}

const resolveDevices = async () => {
  if (props.allDevices?.length) {
    localDevices.value = props.allDevices
    return
  }
  try {
    localDevices.value = await fetchAllSouthboundDevices(request)
  } catch (e) {
    console.error('Failed to fetch southbound devices', e)
    localDevices.value = []
  }
}

const buildDeviceTable = () => {
  const source = localDevices.value.length ? localDevices.value : props.allDevices
  deviceTableData.value = buildNorthboundDeviceRows(source, form.value.devices, DEFAULT_INTERVAL)
}

watch(() => props.visible, async (val) => {
  if (!val) return
  initForm()
  await resolveDevices()
  await nextTick()
  buildDeviceTable()
})

watch(() => props.allDevices, async (devs) => {
  if (!props.visible || !devs?.length) return
  localDevices.value = devs
  buildDeviceTable()
}, { deep: true })

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
    await request.post('/api/northbound/edgeos-mqtt', { ...form.value })
    showMessage('edgeOS (MQTT) 配置已保存', 'success')
    visible.value = false
    emit('saved')
  } catch (e) {
    showMessage('保存失败: ' + e.message, 'error')
  } finally {
    loading.value = false
  }
}
</script>
