<template>
  <div class="ai-confirm-diff">
    <div class="ai-confirm-diff__header">
      <icon-exclamation-circle-fill class="ai-confirm-diff__icon" />
      <div>
        <strong>Human Confirm</strong>
        <p>确认前不会写入 config.db · 请对比预览后选择应用方式</p>
      </div>
    </div>

    <div class="ai-confirm-diff__mode">
      <button
        type="button"
        class="ai-confirm-mode"
        :class="{ 'ai-confirm-mode--active': applyMode === 'preview' }"
        @click="applyMode = 'preview'"
      >
        预览模式
        <small>仅导出 JSON，不写入数据库</small>
      </button>
      <button
        type="button"
        class="ai-confirm-mode"
        :class="{ 'ai-confirm-mode--active': applyMode === 'import' }"
        @click="applyMode = 'import'"
      >
        导入模式
        <small>写入 Channel / Point（本地 Mock 为模拟）</small>
      </button>
    </div>

    <div class="ai-confirm-diff__panes">
      <div class="ai-confirm-diff__pane">
        <header class="ai-confirm-diff__pane-head">
          <span>当前配置</span>
          <span class="ai-confirm-diff__tag ai-confirm-diff__tag--empty">空</span>
        </header>
        <AiJsonPreview :data="currentStub" :copyable="false" compact />
      </div>
      <div class="ai-confirm-diff__divider" aria-hidden="true">→</div>
      <div class="ai-confirm-diff__pane ai-confirm-diff__pane--proposed">
        <header class="ai-confirm-diff__pane-head">
          <span>AI助手 产出</span>
          <span class="ai-confirm-diff__tag ai-confirm-diff__tag--new">新增</span>
        </header>
        <AiJsonPreview :data="proposedPreview" :copyable="false" compact />
      </div>
    </div>

    <div v-if="validation" class="ai-confirm-diff__validation">
      <span :class="validation.passed ? 'ai-confirm-diff__pass' : 'ai-confirm-diff__fail'">
        Schema {{ validation.pass_rate?.toFixed(0) }}% · {{ validation.passed ? '可导入' : '需修正' }}
      </span>
    </div>

    <div class="ai-confirm-diff__actions">
      <a-button type="primary" :loading="loading" @click="$emit('confirm', applyMode)">
        {{ applyMode === 'import' ? '确认并导入' : '确认预览' }}
      </a-button>
      <a-button @click="$emit('export-all')">导出全部 JSON</a-button>
    </div>

    <p v-if="applyMode === 'import'" class="ai-confirm-diff__hint">
      导入将创建通道 <code>{{ deliverables?.driver_parameter?.name || '—' }}</code>
      及 {{ deliverables?.point_definition?.points?.length || 0 }} 个点位（本地 Mock 不实际写入）
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { IconExclamationCircleFill } from '@arco-design/web-vue/es/icon'
import AiJsonPreview from './AiJsonPreview.vue'

const props = defineProps({
  deliverables: { type: Object, default: null },
  validation: { type: Object, default: null },
  loading: { type: Boolean, default: false }
})

defineEmits(['confirm', 'export-all'])

const applyMode = ref('preview')

const currentStub = computed(() => ({
  channel: null,
  points: [],
  note: 'config.db 中尚无对应通道配置'
}))

const proposedPreview = computed(() => ({
  protocol_model: props.deliverables?.protocol_model,
  driver_parameter: props.deliverables?.driver_parameter,
  points: props.deliverables?.point_definition?.points?.map((p) => ({
    id: p.id,
    name: p.name,
    address: p.address,
    datatype: p.datatype,
    confidence: p.confidence
  })),
  validation_cases: props.deliverables?.validation_case?.validation_cases?.length || 0
}))
</script>
