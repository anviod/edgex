<template>
  <div class="ai-quota-bar" role="status" :aria-label="ariaLabel">
    <div class="ai-quota-bar__mode">
      <span class="ai-quota-bar__badge" :class="`ai-quota-bar__badge--${mode}`">{{ modeLabel }}</span>
    </div>

    <div v-if="quota" class="ai-quota-bar__meters">
      <div
        v-if="showTokenUsage"
        class="ai-quota-ring"
        :title="`Token ${quota.tokens_used?.toLocaleString()} / ${quota.tokens_limit?.toLocaleString()}`"
      >
        <svg viewBox="0 0 36 36" class="ai-quota-ring__svg">
          <path
            class="ai-quota-ring__bg"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            class="ai-quota-ring__fill"
            :class="{ 'ai-quota-ring__fill--warn': tokenPct > 80 }"
            :stroke-dasharray="`${tokenPct}, 100`"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <span class="ai-quota-ring__label">Token</span>
      </div>

      <div
        class="ai-quota-bar__details"
        :class="{ 'ai-quota-bar__details--tasks-only': !showTokenUsage }"
      >
        <span v-if="showTokenUsage" class="ai-quota-bar__stat">
          {{ quota.tokens_used?.toLocaleString() }} / {{ quota.tokens_limit?.toLocaleString() }}
        </span>
        <div class="ai-quota-bar__progress">
          <div
            class="ai-quota-bar__fill"
            :class="{ 'ai-quota-bar__fill--warn': taskPct > 80 }"
            :style="{ width: `${taskPct}%` }"
          ></div>
        </div>
        <span class="ai-quota-bar__tasks">今日任务 {{ quota.tasks_today }}/{{ quota.tasks_limit }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  quota: { type: Object, default: null },
  mode: { type: String, default: 'remote' }
})

const modeLabel = computed(() => (props.mode === 'remote' ? 'AI Model Center' : '云端'))
const showTokenUsage = computed(() => props.mode === 'remote')
const ariaLabel = computed(() =>
  showTokenUsage.value ? 'AI 配额使用情况' : 'AI 今日任务使用情况'
)

const tokenPct = computed(() => {
  if (!props.quota?.tokens_limit) return 0
  return Math.min(100, (props.quota.tokens_used / props.quota.tokens_limit) * 100)
})

const taskPct = computed(() => {
  if (!props.quota?.tasks_limit) return 0
  return Math.min(100, (props.quota.tasks_today / props.quota.tasks_limit) * 100)
})
</script>
