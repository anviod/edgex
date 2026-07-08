<template>
  <div class="ai-workbench-diagnostics">
    <div class="ai-workbench-section ai-workbench-section--row">
      <div>
        <h4 class="ai-workbench-section__title">联调诊断 · G5</h4>
        <p v-if="generatedAt" class="ai-workbench-section__hint">更新于 {{ formatTime(generatedAt) }}</p>
      </div>
      <a-button size="small" type="primary" :loading="loading" @click="load">刷新诊断</a-button>
    </div>

    <div v-if="loading && !steps.length" class="ai-skeleton ai-skeleton--card"></div>

    <div v-if="channelHealth.length" class="ai-channel-health">
      <h5 class="ai-channel-health__title">通道健康</h5>
      <div class="ai-channel-health__grid">
        <div
          v-for="ch in channelHealth"
          :key="ch.name"
          class="ai-channel-card"
          :class="`ai-channel-card--${ch.status}`"
        >
          <span class="ai-channel-card__status-dot"></span>
          <strong>{{ ch.name }}</strong>
          <span class="ai-channel-card__proto">{{ ch.protocol }}</span>
          <span class="ai-channel-card__devices">{{ ch.online_count }}/{{ ch.device_count }} 在线</span>
        </div>
      </div>
    </div>

    <div v-if="steps.length" class="ai-diag-checklist" role="list" aria-label="诊断步骤">
      <div
        v-for="step in steps"
        :key="step.order"
        class="ai-diag-step"
        :class="[
          `ai-diag-step--${step.status || 'pending'}`,
          { 'ai-diag-step--warn': step.severity === 'warning' }
        ]"
        role="listitem"
      >
        <span class="ai-diag-step__icon" :aria-label="step.status || 'pending'">
          <icon-check-circle-fill v-if="step.status === 'done'" />
          <icon-exclamation-circle-fill v-else-if="step.severity === 'warning'" />
          <icon-loading v-else-if="step.status === 'running'" />
          <span v-else class="ai-diag-step__num">{{ step.order }}</span>
        </span>
        <div class="ai-diag-step__body">
          <strong>{{ step.title }}</strong>
          <p>{{ step.detail }}</p>
          <a-button
            v-if="step.action?.type === 'navigate'"
            size="mini"
            type="text"
            @click="$router.push(step.action.path)"
          >
            前往 →
          </a-button>
        </div>
      </div>
    </div>

    <div v-if="snapshot" class="ai-diag-snapshot">
      <h5>网关快照</h5>
      <AiJsonPreview :data="snapshot" compact :copyable="false" />
    </div>

    <AiEmptyState
      v-if="!loading && !steps.length"
      icon="🔧"
      title="诊断数据加载中"
      description="点击刷新获取 ScanEngine、Soak 与通道健康摘要"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  IconCheckCircleFill,
  IconExclamationCircleFill,
  IconLoading
} from '@arco-design/web-vue/es/icon'
import AiApi from '@/api/ai'
import AiJsonPreview from './AiJsonPreview.vue'
import AiEmptyState from './AiEmptyState.vue'

const steps = ref([])
const snapshot = ref(null)
const channelHealth = ref([])
const generatedAt = ref('')
const loading = ref(false)

const formatTime = (iso) => {
  try {
    return new Date(iso).toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return iso
  }
}

const load = async () => {
  loading.value = true
  try {
    const res = await AiApi.getDiagnosticsSummary()
    if (res.code === '0') {
      steps.value = res.data.steps || []
      snapshot.value = res.data.snapshot
      generatedAt.value = res.data.generated_at || ''
      const items = res.data.snapshot?.channels?.items || []
      channelHealth.value = items.slice(0, 6)
    }
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
