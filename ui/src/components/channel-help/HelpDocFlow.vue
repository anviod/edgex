<template>
  <div class="help-doc-flow" role="img" :aria-label="ariaLabel">
    <template v-for="(step, idx) in steps" :key="idx">
      <div
        v-if="step.type === 'node'"
        class="help-doc-flow__node"
        :class="step.variant ? `help-doc-flow__node--${step.variant}` : ''"
      >
        {{ step.text }}
      </div>
      <div v-else class="help-doc-flow__arrow" aria-hidden="true">↓</div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  steps: { type: Array, default: () => [] },
  ariaLabel: { type: String, default: '流程示意' },
})
</script>
