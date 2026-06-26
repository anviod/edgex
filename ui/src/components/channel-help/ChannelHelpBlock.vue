<template>
  <section class="help-doc-section">
    <h2 v-if="title" class="help-doc-section__title">{{ title }}</h2>
    <p v-if="text" class="help-doc-section__text">{{ text }}</p>
    <slot />
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  text: { type: String, default: '' },
})
</script>
