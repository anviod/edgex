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
            <a-tag :color="stepTagColor(step)" size="small" class="rule-flow-node__tag">
              {{ stepTagLabel(step) }}
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
import {
  buildRulePipeline,
  getPipelineSummary,
  STEP_STATUS,
  EVAL_OUTCOME,
} from '@/utils/ruleFlow'

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

function evalOutcomeMeta(step) {
  if (step.id !== 'evaluate' || !step.evalOutcome) return null
  return EVAL_OUTCOME[step.evalOutcome] || null
}

function stepTagLabel(step) {
  const outcome = evalOutcomeMeta(step)
  if (outcome) return outcome.shortLabel
  return statusShortLabel(step.status)
}

function stepTagColor(step) {
  const outcome = evalOutcomeMeta(step)
  if (outcome) return outcome.color
  return statusMeta(step.status).color
}

function nodeClass(step) {
  const outcome = evalOutcomeMeta(step)
  const pipelineActive = step.status === 'active' || step.status === 'pending'
  let statusClass = statusMeta(step.status).className
  if (outcome && !pipelineActive) {
    statusClass = outcome.className
  }
  return [
    statusClass,
    props.compact ? 'rule-flow-node--compact' : '',
  ].filter(Boolean)
}

function nodeTitle(step) {
  const outcome = evalOutcomeMeta(step)
  const statusLabel = outcome?.label || statusMeta(step.status).label
  const parts = [step.label, step.sublabel, statusLabel]
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
