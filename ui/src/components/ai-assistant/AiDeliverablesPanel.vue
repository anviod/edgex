<template>
  <div class="ai-deliverables">
    <header class="ai-deliverables__head">
      <h4 class="ai-workbench-section__title">四类产出</h4>
      <span class="ai-deliverables__count">{{ DELIVERABLE_TYPES.length }} 类配置</span>
    </header>

    <div class="ai-deliverables__tabs" role="tablist">
      <button
        v-for="dt in DELIVERABLE_TYPES"
        :key="dt.id"
        type="button"
        role="tab"
        class="ai-deliverable-tab"
        :class="{ 'ai-deliverable-tab--active': activeTab === dt.id }"
        :aria-selected="activeTab === dt.id"
        @click="activeTab = dt.id"
      >
        <span class="ai-deliverable-tab__label">{{ dt.label }}</span>
        <span class="ai-deliverable-tab__desc">{{ dt.desc }}</span>
      </button>
    </div>

    <AiEmptyState
      v-if="!deliverables"
      icon="📋"
      description="完成分析任务后，四类产出将在此预览"
    />

    <template v-else>
      <div class="ai-deliverables__header">
        <span class="ai-deliverables__desc">{{ currentType?.desc }}</span>
        <a-button size="mini" type="outline" @click="$emit('export', activeTab)">
          导出 JSON
        </a-button>
      </div>
      <AiJsonPreview :data="currentData" :title="currentType?.label" />
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { DELIVERABLE_TYPES } from '@/composables/useAiAssistant'
import AiJsonPreview from './AiJsonPreview.vue'
import AiEmptyState from './AiEmptyState.vue'

const props = defineProps({
  deliverables: { type: Object, default: null }
})

defineEmits(['export'])

const activeTab = ref('protocol_model')

const currentType = computed(() => DELIVERABLE_TYPES.find((d) => d.id === activeTab.value))

const currentData = computed(() => {
  if (!props.deliverables) return null
  return props.deliverables[activeTab.value] || {}
})
</script>
