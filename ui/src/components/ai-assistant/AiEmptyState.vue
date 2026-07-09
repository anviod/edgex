<template>
  <div class="ai-empty-state" :class="`ai-empty-state--${variant}`">
    <div v-if="$slots.icon" class="ai-empty-state__icon" aria-hidden="true">
      <slot name="icon" />
    </div>
    <h5 v-if="title" class="ai-empty-state__title">{{ title }}</h5>
    <p v-if="description" class="ai-empty-state__desc">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  variant: { type: String, default: 'default' }
})
</script>
