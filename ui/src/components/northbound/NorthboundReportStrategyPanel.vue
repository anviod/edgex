<template>
  <div v-if="deviceKind === 'real'" class="nb-report-strategy-panel">
    <div class="table-header table-header--strategy">
      <span class="table-header__hint">启用设备默认周期上报 {{ defaultInterval }}</span>
      <div class="table-header__actions">
        <a-input
          v-model="batchInterval"
          size="small"
          :placeholder="defaultInterval"
          class="mono-text batch-interval-input"
          @press-enter="batchSetInterval('real')"
        />
        <a-button type="outline" size="small" @click="batchSetInterval('real')">批量设置周期</a-button>
        <a-button type="outline" size="small" @click="autoFillDevices('real')">全部启用 ({{ defaultInterval }})</a-button>
      </div>
    </div>
    <div class="table-container saas-table nb-device-table">
      <a-table
        row-key="id"
        :columns="realDeviceColumns"
        :data="realDeviceTableData"
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
          <a-switch v-model="record._enable" size="small" @change="updateRealDeviceEnable(record)" />
        </template>
        <template #strategy="{ record }">
          <a-select
            v-model="record._strategy"
            size="small"
            :disabled="!record._enable"
            class="mono-text strategy-select"
            @change="updateRealDeviceStrategy(record)"
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
            :placeholder="defaultInterval"
            class="mono-text strategy-interval-input"
            @change="updateRealDeviceInterval(record)"
          />
        </template>
      </a-table>
    </div>
  </div>

  <div v-else class="nb-report-strategy-panel">
    <div class="table-header table-header--strategy">
      <span class="table-header__hint">启用虚拟影子设备默认周期上报 {{ defaultInterval }}</span>
      <div class="table-header__actions">
        <a-input
          v-model="virtualBatchInterval"
          size="small"
          :placeholder="defaultInterval"
          class="mono-text batch-interval-input"
          @press-enter="batchSetInterval('virtual')"
        />
        <a-button type="outline" size="small" @click="batchSetInterval('virtual')">批量设置周期</a-button>
        <a-button type="outline" size="small" @click="autoFillDevices('virtual')">全部启用 ({{ defaultInterval }})</a-button>
      </div>
    </div>
    <div class="table-container saas-table nb-device-table">
      <a-table
        row-key="id"
        :columns="virtualDeviceColumns"
        :data="virtualDeviceTableData"
        size="small"
        :bordered="false"
        :pagination="false"
        class="industrial-table-inline"
      >
        <template #empty>
          <a-empty description="暂无虚拟影子设备，请先在虚拟影子页面创建" />
        </template>
        <template #name="{ record }">
          <span>{{ record.name || record.id }}</span>
        </template>
        <template #configEnable="{ record }">
          <a-tag :color="record.enable ? 'green' : 'gray'" size="small">
            {{ record.enable ? '启用' : '禁用' }}
          </a-tag>
        </template>
        <template #enable="{ record }">
          <a-switch
            v-model="record._enable"
            size="small"
            :disabled="!record.enable"
            @change="updateVirtualDeviceEnable(record)"
          />
        </template>
        <template #strategy="{ record }">
          <a-select
            v-model="record._strategy"
            size="small"
            :disabled="!record._enable || !record.enable"
            class="mono-text strategy-select"
            @change="updateVirtualDeviceStrategy(record)"
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
            :disabled="!record._enable || !record.enable"
            :placeholder="defaultInterval"
            class="mono-text strategy-interval-input"
            @change="updateVirtualDeviceInterval(record)"
          />
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { showMessage } from '@/composables/useGlobalState'
import { listVirtualShadows } from '@/api/virtualShadow'
import {
  buildNorthboundDeviceRows,
  buildNorthboundVirtualDeviceStrategyRows
} from '@/utils/southboundDevices'

const props = defineProps({
  visible: { type: Boolean, default: false },
  deviceKind: { type: String, default: 'real', validator: (v) => ['real', 'virtual'].includes(v) },
  allDevices: { type: Array, default: () => [] },
  devices: { type: Object, default: () => ({}) },
  virtualDevices: { type: Object, default: () => ({}) },
  defaultInterval: { type: String, default: '10s' }
})

const emit = defineEmits(['update:devices', 'update:virtualDevices'])

const realDeviceTableData = ref([])
const virtualDeviceTableData = ref([])
const batchInterval = ref(props.defaultInterval)
const virtualBatchInterval = ref(props.defaultInterval)

const realDeviceColumns = [
  { title: '设备', dataIndex: 'name', width: 180, ellipsis: true, tooltip: true },
  { title: '通道', dataIndex: 'channelName', width: 120 },
  { title: '状态', slotName: 'state', width: 80, align: 'center' },
  { title: '启用', slotName: 'enable', width: 70, align: 'center' },
  { title: '策略', slotName: 'strategy', width: 130 },
  { title: '上报周期', slotName: 'interval', width: 100 }
]

const virtualDeviceColumns = [
  { title: '设备', slotName: 'name', width: 160, ellipsis: true, tooltip: true },
  { title: '归属通道', dataIndex: 'channel_id', width: 110, ellipsis: true, tooltip: true },
  { title: '点位', dataIndex: 'pointCount', width: 60, align: 'center' },
  { title: '配置', slotName: 'configEnable', width: 70, align: 'center' },
  { title: '启用', slotName: 'enable', width: 70, align: 'center' },
  { title: '策略', slotName: 'strategy', width: 120 },
  { title: '上报周期', slotName: 'interval', width: 90 }
]

const buildRealDeviceTable = () => {
  realDeviceTableData.value = buildNorthboundDeviceRows(
    props.allDevices,
    props.devices,
    props.defaultInterval
  )
}

const buildVirtualDeviceTable = async () => {
  try {
    const res = await listVirtualShadows()
    const items = Array.isArray(res) ? res : (res?.data || [])
    virtualDeviceTableData.value = buildNorthboundVirtualDeviceStrategyRows(
      items,
      props.virtualDevices,
      props.defaultInterval
    )
  } catch (e) {
    console.error('[NorthboundReportStrategy] load virtual shadows failed', e)
    virtualDeviceTableData.value = buildNorthboundVirtualDeviceStrategyRows(
      [],
      props.virtualDevices,
      props.defaultInterval
    )
  }
}

const rebuildTables = async () => {
  batchInterval.value = props.defaultInterval
  virtualBatchInterval.value = props.defaultInterval
  buildRealDeviceTable()
  await buildVirtualDeviceTable()
}

onMounted(() => {
  if (props.visible) {
    rebuildTables()
  }
})

watch(() => props.visible, async (val) => {
  if (!val) return
  await rebuildTables()
})

watch(() => props.allDevices, async () => {
  if (props.visible) buildRealDeviceTable()
}, { deep: true })

watch(() => props.devices, () => {
  if (props.visible) buildRealDeviceTable()
}, { deep: true })

watch(() => props.virtualDevices, async () => {
  if (props.visible) await buildVirtualDeviceTable()
}, { deep: true })

const syncRealRecordToForm = (record) => {
  const next = { ...props.devices }
  next[record.id] = {
    enable: record._enable,
    strategy: record._strategy,
    interval: record._interval || props.defaultInterval
  }
  emit('update:devices', next)
}

const syncVirtualRecordToForm = (record) => {
  const next = { ...props.virtualDevices }
  next[record.id] = {
    enable: record._enable,
    strategy: record._strategy,
    interval: record._interval || props.defaultInterval
  }
  emit('update:virtualDevices', next)
}

const updateRealDeviceEnable = (record) => {
  if (record._enable) {
    record._strategy = 'periodic'
    record._interval = record._interval || props.defaultInterval
  }
  const current = props.devices[record.id]
  if (!current || typeof current === 'boolean') {
    syncRealRecordToForm(record)
  } else {
    const next = { ...props.devices }
    next[record.id] = { ...current, enable: record._enable }
    if (record._enable) {
      next[record.id].strategy = 'periodic'
      next[record.id].interval = record._interval
    }
    emit('update:devices', next)
  }
}

const updateRealDeviceStrategy = (record) => {
  if (record._strategy === 'periodic' && !record._interval) {
    record._interval = props.defaultInterval
  }
  const current = props.devices[record.id]
  if (!current || typeof current === 'boolean') {
    syncRealRecordToForm(record)
  } else {
    const next = { ...props.devices }
    next[record.id] = { ...current, strategy: record._strategy }
    if (record._strategy === 'periodic') {
      next[record.id].interval = record._interval
    }
    emit('update:devices', next)
  }
}

const updateRealDeviceInterval = (record) => {
  record._interval = record._interval || props.defaultInterval
  const current = props.devices[record.id]
  if (!current || typeof current === 'boolean') {
    syncRealRecordToForm(record)
  } else {
    const next = { ...props.devices }
    next[record.id] = { ...current, interval: record._interval }
    emit('update:devices', next)
  }
}

const updateVirtualDeviceEnable = (record) => {
  if (!record.enable) {
    record._enable = false
    return
  }
  if (record._enable) {
    record._strategy = 'periodic'
    record._interval = record._interval || props.defaultInterval
  }
  syncVirtualRecordToForm(record)
}

const updateVirtualDeviceStrategy = (record) => {
  if (record._strategy === 'periodic' && !record._interval) {
    record._interval = props.defaultInterval
  }
  syncVirtualRecordToForm(record)
}

const updateVirtualDeviceInterval = (record) => {
  record._interval = record._interval || props.defaultInterval
  syncVirtualRecordToForm(record)
}

const batchSetInterval = (kind) => {
  const isVirtual = kind === 'virtual'
  const interval = ((isVirtual ? virtualBatchInterval.value : batchInterval.value) || props.defaultInterval).trim()
  if (!interval) {
    showMessage('请输入上报周期', 'warning')
    return
  }
  const rows = isVirtual ? virtualDeviceTableData.value : realDeviceTableData.value
  let count = 0
  rows.forEach(record => {
    if (!record._enable || (isVirtual && !record.enable)) return
    record._strategy = 'periodic'
    record._interval = interval
    if (isVirtual) syncVirtualRecordToForm(record)
    else syncRealRecordToForm(record)
    count++
  })
  if (count === 0) {
    showMessage('请先启用至少一个设备', 'warning')
    return
  }
  showMessage(`已为 ${count} 个设备设置周期 ${interval}`, 'success')
}

const autoFillDevices = (kind) => {
  const isVirtual = kind === 'virtual'
  const rows = isVirtual ? virtualDeviceTableData.value : realDeviceTableData.value
  rows.forEach(record => {
    if (isVirtual && !record.enable) return
    record._enable = true
    record._strategy = 'periodic'
    record._interval = props.defaultInterval
    if (isVirtual) syncVirtualRecordToForm(record)
    else syncRealRecordToForm(record)
  })
  showMessage(`已启用全部${isVirtual ? '虚拟' : ''}设备，周期 ${props.defaultInterval}`, 'success')
}

defineExpose({ rebuildTables })
</script>

<style scoped>
/* v3.0 — styles in src/styles/northbound-form.css */
</style>
