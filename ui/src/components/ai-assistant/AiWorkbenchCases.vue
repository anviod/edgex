<template>
  <div class="ai-workbench-cases">
    <div class="ai-workbench-section">
      <h4 class="ai-workbench-section__title">Validation Case · G3</h4>
      <p class="ai-workbench-section__hint">可回放验证用例：期望读数、容差 ε、帧证据链</p>
    </div>

    <AiEmptyState
      v-if="!cases.length"
      title="暂无验证用例"
      description="请先完成协议分析任务，AI助手 将生成带帧证据的验证用例"
    >
      <template #icon>
        <icon-link :size="22" />
      </template>
    </AiEmptyState>

    <div v-else class="ai-case-timeline">
      <div v-for="(c, i) in cases" :key="i" class="ai-case-timeline__item">
        <div class="ai-case-timeline__rail">
          <span class="ai-case-timeline__node">{{ i + 1 }}</span>
          <span v-if="i < cases.length - 1" class="ai-case-timeline__line"></span>
        </div>
        <div class="ai-case-card">
          <div class="ai-case-card__header">
            <strong>{{ c.point_id }}</strong>
            <span class="ai-case-card__conf" :class="confClass(c.confidence)">
              置信度 {{ (c.confidence * 100).toFixed(0) }}%
            </span>
          </div>
          <div class="ai-case-card__grid">
            <div><label>期望值</label><span>{{ c.expected_value }}</span></div>
            <div><label>容差</label><span>±{{ c.tolerance_pct }}%</span></div>
            <div><label>观测时间</label><span>{{ c.observation_time || '—' }}</span></div>
          </div>

          <div v-if="c.frame_evidence" class="ai-case-evidence-chain">
            <div class="ai-case-evidence-chain__step">
              <span class="ai-case-evidence-chain__icon">
                <icon-storage :size="14" />
              </span>
              <div>
                <label>抓包帧</label>
                <code>FC{{ c.frame_evidence.fc }} @{{ c.frame_evidence.start_addr }}</code>
              </div>
            </div>
            <div class="ai-case-evidence-chain__arrow">
              <icon-arrow-right :size="12" />
            </div>
            <div class="ai-case-evidence-chain__step">
              <span class="ai-case-evidence-chain__icon">
                <icon-code :size="14" />
              </span>
              <div>
                <label>Raw Hex</label>
                <code>0x{{ c.frame_evidence.raw_hex }}</code>
              </div>
            </div>
            <div class="ai-case-evidence-chain__arrow">
              <icon-arrow-right :size="12" />
            </div>
            <div class="ai-case-evidence-chain__step">
              <span class="ai-case-evidence-chain__icon">
                <icon-bar-chart :size="14" />
              </span>
              <div>
                <label>解码值</label>
                <code>{{ c.frame_evidence.decoded }} → 期望 {{ c.expected_value }}</code>
              </div>
            </div>
          </div>

          <a-button size="mini" type="outline" @click="exportCase(c)">导出用例</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { IconLink, IconStorage, IconCode, IconBarChart, IconArrowRight } from '@arco-design/web-vue/es/icon'
import AiEmptyState from './AiEmptyState.vue'

const props = defineProps({
  deliverables: { type: Object, default: null }
})

const cases = computed(() => props.deliverables?.validation_case?.validation_cases || [])

const confClass = (c) => (c >= 0.8 ? 'ai-case-card__conf--high' : c >= 0.6 ? 'ai-case-card__conf--mid' : 'ai-case-card__conf--low')

const exportCase = (c) => {
  const blob = new Blob([JSON.stringify(c, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `validation-case-${c.point_id}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
