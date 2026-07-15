<template>
  <div class="ai-json-preview-wrap" :class="{ 'ai-json-preview-wrap--compact': compact }">
    <div v-if="title || copyable" class="ai-json-preview__toolbar">
      <span v-if="title" class="ai-json-preview__title">{{ title }}</span>
      <button
        v-if="copyable"
        type="button"
        class="ai-json-preview__copy"
        :title="copied ? '已复制' : '复制 JSON'"
        @click="copyJson"
      >
        {{ copied ? '✓' : '复制' }}
      </button>
    </div>
    <pre
      class="ai-json-preview"
      :class="{ 'ai-json-preview--editable': editable }"
      :contenteditable="editable"
      spellcheck="false"
      v-html="highlighted"
    ></pre>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { highlightJson } from '@/utils/jsonHighlight'

const props = defineProps({
  data: { type: [Object, Array, String, Number, Boolean], default: null },
  title: { type: String, default: '' },
  compact: { type: Boolean, default: false },
  copyable: { type: Boolean, default: true },
  editable: { type: Boolean, default: false }
})

const copied = ref(false)

const rawJson = computed(() => {
  if (props.data == null) return '{}'
  return typeof props.data === 'string' ? props.data : JSON.stringify(props.data, null, 2)
})

const highlighted = computed(() => highlightJson(rawJson.value))

const copyJson = async () => {
  try {
    await navigator.clipboard.writeText(rawJson.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    /* clipboard unavailable */
  }
}
</script>
