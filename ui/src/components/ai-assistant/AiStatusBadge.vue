<template>
  <span class="ai-status-badge" :class="`ai-status-badge--${statusClass}`">
    <span v-if="pulse" class="ai-status-badge__dot"></span>
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const STATUS_MAP = {
  pending: { label: '等待中', class: 'pending' },
  queued: { label: '排队', class: 'queued' },
  processing: { label: '处理中', class: 'running', pulse: true },
  waiting_model: { label: '模型推理', class: 'running', pulse: true },
  validating: { label: '校验中', class: 'running', pulse: true },
  waiting_confirm: { label: '待确认', class: 'confirm' },
  applied: { label: '已应用', class: 'success' },
  failed: { label: '失败', class: 'error' },
  cancelled: { label: '已取消', class: 'muted' }
}

const props = defineProps({
  status: { type: String, default: 'pending' }
})

const meta = computed(() => STATUS_MAP[props.status] || { label: props.status, class: 'muted' })
const label = computed(() => meta.value.label)
const statusClass = computed(() => meta.value.class)
const pulse = computed(() => meta.value.pulse)
</script>
