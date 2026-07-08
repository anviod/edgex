<template>
  <div class="ai-task-history">
    <header class="ai-task-history__header">
      <span class="ai-task-history__label">最近任务</span>
      <button
        v-if="tasks.length"
        type="button"
        class="ai-task-history__refresh"
        title="刷新任务列表"
        :disabled="loading"
        @click="$emit('refresh')"
      >
        ↻
      </button>
    </header>

    <div v-if="loading && !tasks.length" class="ai-task-history__skeleton">
      <div v-for="i in 3" :key="i" class="ai-skeleton ai-skeleton--row"></div>
    </div>

    <AiEmptyState
      v-else-if="!tasks.length"
      icon="📋"
      title="暂无任务"
      description="上传 PCAP 或文档开始协议分析"
    />

    <ul v-else class="ai-task-history__list" role="list">
      <li
        v-for="t in tasks.slice(0, 8)"
        :key="t.id"
        class="ai-task-history__item"
        :class="{ 'ai-task-history__item--active': activeId === t.id }"
      >
        <button
          type="button"
          class="ai-task-history__btn"
          :aria-current="activeId === t.id ? 'true' : undefined"
          @click="$emit('select', t.id)"
        >
          <span class="ai-task-history__id">{{ shortId(t.id) }}</span>
          <span class="ai-task-history__meta">
            {{ skillLabel(t.skill) }}
            <span v-if="t.input_files?.[0]" class="ai-task-history__file">{{ t.input_files[0] }}</span>
          </span>
          <AiStatusBadge :status="t.status" />
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import AiEmptyState from './AiEmptyState.vue'
import AiStatusBadge from './AiStatusBadge.vue'

defineProps({
  tasks: { type: Array, default: () => [] },
  activeId: { type: String, default: '' },
  loading: { type: Boolean, default: false }
})

defineEmits(['select', 'refresh'])

const shortId = (id) => id?.slice(-10) || '—'

const skillLabel = (skill) => {
  const map = {
    'protocol-reverse': '逆向',
    'doc-parse': '文档',
    'config-gen': '配置',
    'edge-rule-draft': '边缘',
    diagnostics: '诊断'
  }
  return map[skill] || skill || '任务'
}
</script>
