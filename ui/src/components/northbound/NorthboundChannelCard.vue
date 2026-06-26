<template>
  <a-card class="nb-card" :class="[`nb-card--${meta.mode}`]" hoverable>
    <template #title>
      <div class="nb-card__head">
        <span class="nb-card__proto" :style="{ background: meta.color }">{{ meta.shortLabel }}</span>
        <span class="nb-card__name">{{ item.name || item.id }}</span>
        <a-tag
          size="small"
          :color="modeInfo.color"
          class="nb-card__mode-tag"
        >{{ modeInfo.label }}</a-tag>
      </div>
    </template>
    <template #extra>
      <a-space size="mini">
        <a-tooltip v-if="meta.hasHelp" content="帮助">
          <a-button type="text" size="mini" @click="$emit('help', item)">
            <template #icon><icon-question-circle :size="14" /></template>
          </a-button>
        </a-tooltip>
        <a-tooltip v-if="meta.hasSync" content="同步点位映射">
          <a-button type="text" size="mini" @click="$emit('sync', item)">
            <template #icon><icon-sync :size="14" /></template>
          </a-button>
        </a-tooltip>
        <a-tooltip content="配置">
          <a-button type="text" size="mini" @click="$emit('settings', item)">
            <template #icon><icon-settings :size="14" /></template>
          </a-button>
        </a-tooltip>
        <a-tooltip v-if="meta.hasStats" content="监控">
          <a-button type="text" size="mini" @click="$emit('stats', item)">
            <template #icon><icon-bar-chart :size="14" /></template>
          </a-button>
        </a-tooltip>
        <a-tooltip content="删除">
          <a-button type="text" size="mini" status="danger" @click="$emit('delete', meta.apiType, item.id)">
            <template #icon><icon-delete :size="14" /></template>
          </a-button>
        </a-tooltip>
      </a-space>
    </template>

    <div class="nb-card__body">
      <div v-for="(field, idx) in infoRows" :key="idx" class="nb-card__row">
        <span class="nb-card__label">{{ field.label }}</span>
        <span class="nb-card__value">
          <span class="text-ellipsis">{{ field.value || '—' }}</span>
          <a-button
            v-if="field.copy && field.value"
            type="text"
            size="mini"
            @click="copyText(field.value)"
          >
            <template #icon><icon-copy :size="12" /></template>
          </a-button>
        </span>
      </div>
    </div>

    <template #actions>
      <template v-if="meta.hasConnection">
        <a-tag v-if="!item.enable" color="gray" size="small">未启用</a-tag>
        <a-tag v-else-if="connectionStatus?.[item.id] === 1" color="green" size="small">已连接</a-tag>
        <a-tag v-else-if="connectionStatus?.[item.id] === 2" color="orangered" size="small">重连中</a-tag>
        <a-tag v-else color="red" size="small">连接断开</a-tag>
      </template>
      <a-tag v-else :color="item.enable ? 'green' : 'gray'" size="small">
        {{ item.enable ? '运行中' : '已停用' }}
      </a-tag>
    </template>
  </a-card>
</template>

<script setup>
import { computed } from 'vue'
import {
  IconQuestionCircle, IconSettings, IconBarChart, IconDelete, IconCopy, IconSync
} from '@arco-design/web-vue/es/icon'
import { NORTHBOUND_MODES } from '@/utils/northboundProtocols'
import { showMessage } from '@/composables/useGlobalState'

const props = defineProps({
  meta: { type: Object, required: true },
  item: { type: Object, required: true },
  connectionStatus: { type: Object, default: () => ({}) }
})

defineEmits(['help', 'settings', 'stats', 'delete', 'sync'])

const modeInfo = computed(() => NORTHBOUND_MODES[props.meta.mode] || NORTHBOUND_MODES.push)
const infoRows = computed(() => props.meta.infoFields(props.item) || [])

const copyText = (text) => {
  navigator.clipboard.writeText(text).then(
    () => showMessage('已复制', 'success'),
    () => showMessage('复制失败', 'error')
  )
}
</script>

<style scoped>
.nb-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  height: 100%;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.nb-card:hover {
  border-color: #94a3b8;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
}

.nb-card--push { border-top: 3px solid #0ea5e9; }
.nb-card--passive { border-top: 3px solid #722ed1; }

.nb-card__head {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.nb-card__proto {
  flex-shrink: 0;
  color: #fff;
  font-family: ui-monospace, monospace;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 18px;
}

.nb-card__name {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--edgex-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nb-card__mode-tag {
  flex-shrink: 0;
  font-size: 11px;
}

.nb-card__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nb-card__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 0;
  font-size: 13px;
  border-bottom: 1px dashed #e2e8f0;
}

.nb-card__row:last-child { border-bottom: none; }

.nb-card__label {
  color: #64748b;
  flex-shrink: 0;
}

.nb-card__value {
  display: flex;
  align-items: center;
  gap: 2px;
  color: #334155;
  max-width: 62%;
  justify-content: flex-end;
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
</style>
