<template>
  <a-card v-for="item in items" :key="item.id" class="northbound-card" hoverable>
    <template #title>
      <div class="card-title-row">
        <span class="protocol-tag">HTTP</span>
        <span class="card-name">{{ item.name || item.id }}</span>
      </div>
    </template>
    <template #extra>
      <a-space size="small">
        <a-tooltip content="配置">
          <a-button type="text" size="mini" @click="$emit('settings', item)">
            <template #icon><icon-settings :size="14" /></template>
          </a-button>
        </a-tooltip>
        <a-tooltip content="运行监控">
          <a-button type="text" size="mini" @click="$emit('stats', item)">
            <template #icon><icon-bar-chart :size="14" /></template>
          </a-button>
        </a-tooltip>
        <a-tooltip content="删除">
          <a-button type="text" size="mini" status="danger" @click="$emit('delete', 'http', item.id)">
            <template #icon><icon-delete :size="14" /></template>
          </a-button>
        </a-tooltip>
      </a-space>
    </template>

    <div class="card-info-list">
      <div class="info-row">
        <span class="info-label"><icon-cloud :size="14" /> 服务器地址</span>
        <span class="info-value text-ellipsis">
          {{ item.url }}
          <a-button type="text" size="mini" @click="copyToClipboard(item.url)" style="margin-left: 4px">
            <template #icon><icon-copy :size="12" /></template>
          </a-button>
        </span>
      </div>
      <div class="info-row">
        <span class="info-label"><icon-send :size="14" /> 请求方法</span>
        <span class="info-value">{{ item.method || 'POST' }}</span>
      </div>
      <div class="info-row" v-if="item.data_endpoint">
        <span class="info-label"><icon-code-block :size="14" /> 数据端点</span>
        <span class="info-value text-ellipsis">{{ item.data_endpoint }}</span>
      </div>
    </div>

    <template #actions>
      <a-tag :color="item.enable ? 'green' : 'gray'" size="small">
        {{ item.enable ? '启用' : '禁用' }}
      </a-tag>
    </template>
  </a-card>
</template>

<script setup>
import { IconSettings, IconDelete, IconCloud, IconSend, IconCodeBlock, IconCopy, IconBarChart } from '@arco-design/web-vue/es/icon'
import { showMessage } from '@/composables/useGlobalState'

defineProps({
  items: { type: Array, default: () => [] }
})

defineEmits(['settings', 'delete', 'stats'])

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    showMessage('已复制到剪贴板', 'success')
  }).catch(() => {
    showMessage('复制失败', 'error')
  })
}
</script>

<style scoped>
/* v3.0 — styles in src/styles/ */
</style>

