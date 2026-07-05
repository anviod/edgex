<template>
  <a-modal
    :visible="visible"
    :title="mode === 'events' ? '筛选事件记录' : '筛选分钟日志'"
    width="480px"
    unmount-on-close
    modal-class="industrial-white-modal edge-record-filter-modal"
    @update:visible="(value) => emit('update:visible', value)"
    @cancel="emit('update:visible', false)"
  >
    <a-form layout="vertical" class="industrial-form edge-record-filter-form form-controls-md">
      <a-form-item label="规则">
        <a-select
          v-model="draft.ruleId"
          placeholder="全部规则"
          allow-clear
          allow-search
          :options="ruleOptions"
        />
      </a-form-item>
      <a-row :gutter="12">
        <a-col :span="12">
          <a-form-item label="开始时间">
            <a-input v-model="draft.start" type="datetime-local" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="结束时间">
            <a-input v-model="draft.end" type="datetime-local" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item label="状态">
        <a-select
          v-model="draft.status"
          placeholder="全部状态"
          allow-clear
          :options="statusOptions"
        />
      </a-form-item>
      <a-form-item v-if="mode === 'events'" label="返回条数上限">
        <a-input-number v-model="draft.limit" :min="10" :max="500" :step="10" class="edge-record-filter-limit" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="handleReset">重置</a-button>
      <a-button @click="emit('update:visible', false)">取消</a-button>
      <a-button type="primary" @click="handleApply">应用筛选</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import {
  createDefaultFilters,
  EVENT_STATUS_OPTIONS,
  LOG_STATUS_OPTIONS,
} from '@/composables/useEdgeRecordFilters'

const props = defineProps({
  visible: { type: Boolean, default: false },
  mode: {
    type: String,
    required: true,
    validator: (value) => ['events', 'logs'].includes(value),
  },
  filters: { type: Object, required: true },
  rules: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:visible', 'apply'])

const draft = ref(createDefaultFilters(props.mode))

const ruleOptions = computed(() =>
  (props.rules || []).map((rule) => ({
    label: rule.name || rule.id,
    value: rule.id,
  }))
)

const statusOptions = computed(() =>
  (props.mode === 'events' ? EVENT_STATUS_OPTIONS : LOG_STATUS_OPTIONS).filter((item) => item.value !== '')
)

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      draft.value = { ...createDefaultFilters(props.mode), ...props.filters }
    }
  }
)

watch(
  () => props.mode,
  (mode) => {
    draft.value = { ...createDefaultFilters(mode), ...props.filters }
  }
)

const handleReset = () => {
  draft.value = createDefaultFilters(props.mode)
}

const handleApply = () => {
  emit('apply', { ...draft.value })
  emit('update:visible', false)
}
</script>