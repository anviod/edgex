<template>
  <a-card class="nb-card" hoverable>
    <template #title>
      <div class="nb-card__head">
        <span class="nb-card__proto" :style="{ background: meta.color }">{{ meta.shortLabel }}</span>
        <span class="nb-card__name">{{ item.name || item.id }}</span>
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
import { showMessage } from '@/composables/useGlobalState'

const props = defineProps({
  meta: { type: Object, required: true },
  item: { type: Object, required: true },
  connectionStatus: { type: Object, default: () => ({}) }
})

defineEmits(['help', 'settings', 'stats', 'delete', 'sync'])

const infoRows = computed(() => props.meta.infoFields(props.item) || [])

const copyText = (text) => {
  navigator.clipboard.writeText(text).then(
    () => showMessage('已复制', 'success'),
    () => showMessage('复制失败', 'error')
  )
}
</script>

<style scoped>
/* v3.0 — styles in src/styles/ */
</style>
