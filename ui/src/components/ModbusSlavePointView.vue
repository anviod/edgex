<template>
  <div class="modbus-slave-view">
    <a-collapse :default-active-key="defaultActiveKeys" expand-icon-position="right" bordered>
      <a-collapse-item
        v-for="group in visibleGroups"
        :key="group.key"
        :header="groupHeader(group)"
        :name="group.key"
      >
        <template #extra>
          <span class="group-meta font-mono">{{ group.points.length }} 点 · FC {{ group.fc }}</span>
        </template>

        <div v-if="group.points.length === 0" class="group-empty font-mono">
          该寄存器类型暂无点位
        </div>

        <a-table
          v-else
          :columns="columns"
          :data="group.points"
          :row-selection="rowSelectionFor(group.key)"
          row-key="id"
          :pagination="paginationFor(group.points.length)"
          size="small"
          class="industrial-table-fluid modbus-group-table"
          :bordered="{ wrapper: true, cell: true }"
          :scroll="{ x: 960 }"
          @selection-change="(keys) => onGroupSelectionChange(group.key, keys)"
        >
          <template #offset="{ record }">
            <span class="font-mono text-xs">{{ formatOffsetAddress(record.address) }}</span>
          </template>

          <template #plc="{ record }">
            <span class="font-mono text-xs text-slate-600">{{ record.plc_address ?? formatPlcAddress(record.register_key, record.address) }}</span>
          </template>

          <template #value="{ record }">
            <a-tooltip :content="valueTooltip(record)">
              <div class="value-cell cursor-pointer truncate" @click="$emit('show-value', record)">
                <span class="value-text font-mono">{{ formatValue(record.value) }}</span>
                <span v-if="record.unit" class="value-unit">{{ record.unit }}</span>
              </div>
            </a-tooltip>
          </template>

          <template #quality="{ record }">
            <div class="status-display flex items-center">
              <IconCheckCircle v-if="isQualityGood(record.quality)" class="mr-1 text-emerald-500" />
              <IconCloseCircle v-else class="mr-1 text-red-500" />
              <span class="font-mono text-xs">{{ record.quality || 'Bad' }}</span>
            </div>
          </template>

          <template #readwrite="{ record }">
            <span class="font-mono text-xs">{{ record.readwrite || 'R' }}</span>
          </template>

          <template #timestamp="{ record }">
            <a-tooltip v-if="record?.updated_at" :content="`更新 ${formatDate(record.updated_at)}`">
              <div class="font-mono text-xs text-slate-500 cursor-default">
                {{ record && (record.collected_at || record.timestamp) ? formatDate(record.collected_at || record.timestamp) : 'N/A' }}
              </div>
            </a-tooltip>
            <div v-else class="font-mono text-xs text-slate-500">
              {{ record && (record.collected_at || record.timestamp) ? formatDate(record.collected_at || record.timestamp) : 'N/A' }}
            </div>
          </template>

          <template #actions="{ record }">
            <div class="actions-container flex gap-1 flex-wrap">
              <a-button
                v-if="record.readwrite === 'RW' || record.readwrite === 'W'"
                type="text"
                size="mini"
                @click="$emit('write', record)"
              >
                写入
              </a-button>
              <a-button type="text" size="mini" @click="$emit('edit', record)">编辑</a-button>
              <a-button type="text" size="mini" status="danger" @click="$emit('delete', record)">删除</a-button>
              <a-button type="text" size="mini" status="info" @click="$emit('debug', record)">调试</a-button>
            </div>
          </template>
        </a-table>
      </a-collapse-item>
    </a-collapse>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { IconCheckCircle, IconCloseCircle } from '@arco-design/web-vue/es/icon'
import {
  MODBUS_REGISTER_GROUPS,
  groupPointsByRegisterType,
  formatPlcAddress,
  formatOffsetAddress
} from '@/utils/modbusRegisterGroups'

const props = defineProps({
  points: {
    type: Array,
    default: () => []
  },
  selectedIds: {
    type: Array,
    default: () => []
  },
  registerTypeFilter: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'selection-change',
  'write',
  'edit',
  'delete',
  'debug',
  'show-value'
])

const grouped = computed(() => groupPointsByRegisterType(props.points))

const visibleGroups = computed(() => {
  const list = MODBUS_REGISTER_GROUPS.map(g => ({
    ...g,
    points: grouped.value[g.key] || []
  }))
  if (props.registerTypeFilter) {
    return list.filter(g => g.key === props.registerTypeFilter)
  }
  return list
})

const defaultActiveKeys = computed(() => {
  if (props.registerTypeFilter) return [props.registerTypeFilter]
  return visibleGroups.value.filter(g => g.points.length > 0).map(g => g.key)
})

const columns = [
  { title: '点位 ID', dataIndex: 'id', width: 110, ellipsis: true, tooltip: true },
  { title: '名称', dataIndex: 'name', width: 120, ellipsis: true, tooltip: true },
  { title: 'PDU 偏移', slotName: 'offset', width: 90 },
  { title: 'PLC 地址', slotName: 'plc', width: 100 },
  { title: '类型', dataIndex: 'datatype', width: 80, ellipsis: true },
  { title: 'R/W', slotName: 'readwrite', width: 60 },
  { title: '数值', slotName: 'value', width: 120 },
  { title: '质量', slotName: 'quality', width: 90 },
  { title: '采集时间', slotName: 'timestamp', width: 150 },
  { title: '操作', slotName: 'actions', width: 220 }
]

const groupHeader = (group) => `${group.label} — ${group.title}`

const paginationFor = (total) => ({
  pageSize: total > 100 ? 50 : total || 10,
  showTotal: true,
  size: 'small'
})

const groupRowSelections = {}

const rowSelectionFor = (groupKey) => {
  if (!groupRowSelections[groupKey]) {
    groupRowSelections[groupKey] = reactive({
      type: 'checkbox',
      showCheckedAll: true,
      onlyCurrent: false,
      selectedRowKeys: []
    })
  }
  return groupRowSelections[groupKey]
}

const syncGroupSelectionsFromProps = () => {
  for (const g of MODBUS_REGISTER_GROUPS) {
    const pts = grouped.value[g.key] || []
    const keys = props.selectedIds.filter(id => pts.some(p => p.id === id))
    rowSelectionFor(g.key).selectedRowKeys = keys
  }
}

const onGroupSelectionChange = (groupKey, keys) => {
  rowSelectionFor(groupKey).selectedRowKeys = keys
  const otherIds = props.selectedIds.filter(id => {
    return !(grouped.value[groupKey] || []).some(p => p.id === id)
  })
  emit('selection-change', [...otherIds, ...keys])
}

watch(() => props.selectedIds, syncGroupSelectionsFromProps, { deep: true })
watch(grouped, syncGroupSelectionsFromProps, { deep: true })
syncGroupSelectionsFromProps()

const formatValue = (val) => {
  if (val === null || val === undefined) return 'N/A'
  if (typeof val === 'number') return Number.isInteger(val) ? String(val) : val.toFixed(2)
  return String(val)
}

const formatDate = (ts) => {
  if (!ts) return 'N/A'
  const date = new Date(ts)
  if (Number.isNaN(date.getTime())) return 'N/A'
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const isQualityGood = (q) => q === 'Good' || q === 'good'

const valueTooltip = (record) => {
  const dt = record.datatype || ''
  const addr = record.address ?? ''
  return `${formatValue(record.value)} ${record.unit || ''} · ${addr} · ${dt}`.trim()
}
</script>

<style scoped>
.modbus-slave-view {
  width: 100%;
}

.group-meta {
  font-size: 11px;
  color: #64748b;
}

.group-empty {
  padding: 24px;
  text-align: center;
  color: #94a3b8;
  background: var(--edgex-surface-inset);
  border: 1px dashed #cbd5e1;
}

.modbus-group-table :deep(.arco-table-pagination) {
  margin-top: 8px;
}

.value-cell {
  max-width: 120px;
}

.value-unit {
  margin-left: 4px;
  font-size: 11px;
  color: #64748b;
}

:deep(.arco-collapse-item-header) {
  font-weight: 600;
  background: var(--edgex-surface-muted);
}

:deep(.arco-collapse-item-content) {
  background: var(--edgex-surface-raised);
}
</style>
