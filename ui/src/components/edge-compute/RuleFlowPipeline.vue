<template>
  <div
    class="rule-flow-pipeline"
    role="img"
    :aria-label="`${ruleName || '规则'} 执行流程`"
  >
    <div class="rule-flow-track">
      <div
        v-for="(step, idx) in steps"
        :key="step.id"
        class="rule-flow-step"
      >
        <div
          class="rule-flow-node"
          :class="nodeClass(step)"
          :title="nodeTitle(step)"
        >
          <div class="rule-flow-node__header">
            <span class="rule-flow-node__kind">{{ kindLabel(step.kind) }}</span>
            <a-tag :color="statusMeta(step.status).color" size="small" class="rule-flow-node__tag">
              {{ statusShortLabel(step.status) }}
            </a-tag>
          </div>
          <div class="rule-flow-node__label">{{ step.label }}</div>
          <div v-if="step.sublabel" class="rule-flow-node__sublabel">{{ step.sublabel }}</div>
          <div v-if="step.meta" class="rule-flow-node__meta">{{ step.meta }}</div>
        </div>
        <span
          v-if="idx < steps.length - 1"
          class="rule-flow-connector"
          :class="connectorClass(step, steps[idx + 1])"
          aria-hidden="true"
        >›</span>
      </div>
    </div>
    <div v-if="summary" class="rule-flow-summary">
      <span class="rule-flow-summary__label">当前阶段</span>
      <span class="rule-flow-summary__value" :class="`rule-flow-summary__value--${summary.phase}`">
        {{ summary.label }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { buildRulePipeline, getPipelineSummary, STEP_STATUS } from '@/utils/ruleFlow'

const props = defineProps({
  rule: { type: Object, required: true },
  state: { type: Object, default: null },
  ruleName: { type: String, default: '' },
  compact: { type: Boolean, default: false },
})

const steps = computed(() => buildRulePipeline(props.rule, props.state))
const summary = computed(() => getPipelineSummary(steps.value, props.state))

function statusMeta(status) {
  return STEP_STATUS[status] || STEP_STATUS.idle
}

function statusShortLabel(status) {
  const meta = statusMeta(status)
  return meta.shortLabel || meta.label
}

function nodeClass(step) {
  return [
    statusMeta(step.status).className,
    props.compact ? 'rule-flow-node--compact' : '',
  ].filter(Boolean)
}

function nodeTitle(step) {
  const parts = [step.label, step.sublabel, statusMeta(step.status).label]
  if (step.meta) parts.push(step.meta)
  return parts.filter(Boolean).join(' · ')
}

function kindLabel(kind) {
  const map = {
    source: '输入',
    process: '处理',
    trigger: '决策',
    action: '输出',
  }
  return map[kind] || kind
}

function connectorClass(fromStep, toStep) {
  const doneStatuses = ['completed', 'skipped']
  if (doneStatuses.includes(fromStep.status)) return 'rule-flow-connector--done'
  if (fromStep.status === 'active' || fromStep.status === 'pending') return 'rule-flow-connector--active'
  if (fromStep.status === 'stopped') return 'rule-flow-connector--stopped'
  if (toStep.status === 'active') return 'rule-flow-connector--active'
  return ''
}
</script>
