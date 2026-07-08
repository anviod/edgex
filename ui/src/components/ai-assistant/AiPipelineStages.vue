<template>
  <div class="ai-pipeline-wrap">
    <header class="ai-pipeline-wrap__head">
      <span>流水线进度</span>
      <span class="ai-pipeline-wrap__pct">{{ progressPct }}%</span>
    </header>
    <div class="ai-pipeline" role="list" aria-label="分析流水线阶段">
      <div
        v-for="(stage, i) in stages"
        :key="stage.stage || i"
        class="ai-pipeline__step"
        :class="`ai-pipeline__step--${stage.status || 'pending'}`"
        role="listitem"
      >
        <div class="ai-pipeline__indicator">
          <span class="ai-pipeline__dot">
            <icon-check v-if="stage.status === 'done'" :size="10" />
            <span v-else-if="stage.status === 'running'" class="ai-pipeline__spinner"></span>
          </span>
          <div v-if="i < stages.length - 1" class="ai-pipeline__line" :class="{ 'ai-pipeline__line--done': stage.status === 'done' }"></div>
        </div>
        <div class="ai-pipeline__content">
          <span class="ai-pipeline__label">{{ stage.label }}</span>
          <span v-if="stage.message" class="ai-pipeline__msg">{{ stage.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { IconCheck } from '@arco-design/web-vue/es/icon'

const props = defineProps({
  stages: { type: Array, default: () => [] }
})

const progressPct = computed(() => {
  if (!props.stages.length) return 0
  const done = props.stages.filter((s) => s.status === 'done').length
  const running = props.stages.some((s) => s.status === 'running') ? 0.5 : 0
  return Math.round(((done + running) / props.stages.length) * 100)
})
</script>
