<template>
  <article
    class="rule-flow-card"
    :class="{
      'rule-flow-card--disabled': !rule.enable,
      'rule-flow-card--selected': selected,
    }"
  >
    <header class="rule-flow-card__header">
      <a-checkbox
        v-if="selectable"
        :model-value="selected"
        @change="(checked) => $emit('select', checked)"
        class="rule-flow-card__checkbox"
      />
      <div class="rule-flow-card__title-block">
        <div class="rule-flow-card__title-row">
          <h4 class="rule-flow-card__name">{{ rule.name || rule.id }}</h4>
          <a-tag :color="rule.enable ? 'green' : 'gray'" size="small">
            {{ rule.enable ? '启用' : '禁用' }}
          </a-tag>
          <a-tag v-if="runtimeStatus" :color="statusColor" size="small">
            {{ runtimeStatusLabel }}
          </a-tag>
        </div>
        <div class="rule-flow-card__meta">
          <span>{{ formatRuleType(rule.type) }}</span>
          <span class="rule-flow-card__sep">·</span>
          <span>{{ formatTriggerMode(rule.trigger_mode) }}</span>
          <span class="rule-flow-card__sep">·</span>
          <span>优先级 {{ rule.priority ?? 0 }}</span>
          <template v-if="state?.trigger_count">
            <span class="rule-flow-card__sep">·</span>
            <span>触发 {{ state.trigger_count }} 次</span>
          </template>
          <template v-if="state?.success_count || state?.failure_count">
            <span class="rule-flow-card__sep">·</span>
            <span class="rule-flow-card__stat--success">成功 {{ state.success_count || 0 }}</span>
            <span class="rule-flow-card__sep">·</span>
            <span class="rule-flow-card__stat--failure">失败 {{ state.failure_count || 0 }}</span>
          </template>
          <template v-if="state?.action_success_count || state?.action_failure_count">
            <span class="rule-flow-card__sep">·</span>
            <span>动作 {{ state.action_success_count || 0 }}/{{ (state.action_success_count || 0) + (state.action_failure_count || 0) }}</span>
          </template>
        </div>
      </div>
      <div class="rule-flow-card__ops">
        <slot name="operations" />
      </div>
    </header>

    <RuleFlowPipeline
      :rule="rule"
      :state="state"
      :rule-name="rule.name"
      :compact="compact"
    />

    <footer v-if="state?.error_message" class="rule-flow-card__error">
      {{ state.error_message }}
    </footer>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import RuleFlowPipeline from './RuleFlowPipeline.vue'
import { getRuntimeStatusLabel } from '@/utils/ruleFlow'

const props = defineProps({
  rule: { type: Object, required: true },
  state: { type: Object, default: null },
  selected: { type: Boolean, default: false },
  selectable: { type: Boolean, default: true },
  compact: { type: Boolean, default: false },
})

defineEmits(['select'])

const runtimeStatus = computed(() => props.state?.current_status)
const runtimeStatusLabel = computed(() => getRuntimeStatusLabel(runtimeStatus.value))

const statusColor = computed(() => {
  switch (runtimeStatus.value) {
    case 'ALARM': return 'red'
    case 'WARNING': return 'orange'
    case 'NORMAL': return 'green'
    default: return 'gray'
  }
})

function formatRuleType(type) {
  const map = {
    threshold: 'Threshold (阈值触发)',
    calculation: 'Calculation (计算公式)',
    window: 'Window (时间/计数窗口)',
    state: 'State (状态持续)',
  }
  return map[type] || type
}

function formatTriggerMode(mode) {
  const map = {
    always: 'Always (始终触发)',
    on_change: 'On Change (仅状态改变时触发)',
  }
  return map[mode] || mode
}
</script>
