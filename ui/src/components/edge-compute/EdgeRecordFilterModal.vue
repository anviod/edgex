<template>
  <a-modal
    :visible="visible"
    :title="mode === 'events' ? '筛选错误事件' : '筛选错误日志'"
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
      <a-form-item :label="mode === 'events' ? '状态' : '错误类型'">
        <a-select
          v-model="draft.status"
          placeholder="全部状态"
          allow-clear
          :options="statusOptions"
        />
      </a-form-item>
      <template v-if="mode === 'logs'">
        <a-form-item label="日志分类">
          <a-select
            v-model="draft.categories"
            :options="LOG_CATEGORY_OPTIONS"
            placeholder="全部分类"
            multiple
            allow-clear
            :max-tag-count="2"
          />
        </a-form-item>
        <a-form-item label="采集通道">
          <a-select
            v-model="draft.channelId"
            :options="channelOptions"
            placeholder="全部通道"
            allow-clear
            allow-search
            :loading="loadingChannels"
          />
        </a-form-item>
        <a-form-item label="设备">
          <a-select
            v-model="draft.deviceId"
            :options="deviceOptions"
            placeholder="全部设备"
            allow-clear
            allow-search
            :disabled="!draft.channelId"
            :loading="loadingDevices"
          />
        </a-form-item>
      </template>
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
import request from '@/utils/request'
import { LOG_CATEGORY_OPTIONS } from '@/utils/logFormat'
import {
  createDefaultFilters,
  EVENT_STATUS_OPTIONS,
  LOG_ERROR_TYPE_OPTIONS,
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
const channelOptions = ref([])
const deviceOptions = ref([])
const loadingChannels = ref(false)
const loadingDevices = ref(false)

const ruleOptions = computed(() =>
  (props.rules || []).map((rule) => ({
    label: rule.name || rule.id,
    value: rule.id,
  }))
)

const statusOptions = computed(() =>
  (props.mode === 'events' ? EVENT_STATUS_OPTIONS : LOG_ERROR_TYPE_OPTIONS).filter((item) => item.value !== '')
)

const normalizeDraft = (filters) => {
  const defaults = createDefaultFilters(props.mode)
  return {
    ...defaults,
    ...filters,
    categories: Array.isArray(filters?.categories) ? [...filters.categories] : defaults.categories,
  }
}

const loadChannels = async () => {
  loadingChannels.value = true
  try {
    const res = await request({ url: '/api/channels', method: 'get' })
    const raw = Array.isArray(res) ? res : (res?.data || [])
    channelOptions.value = raw.map((item) => ({
      label: item.name || item.id,
      value: item.id,
    }))
  } finally {
    loadingChannels.value = false
  }
}

const loadDevices = async (channelId) => {
  if (!channelId) {
    deviceOptions.value = []
    return
  }
  loadingDevices.value = true
  try {
    const res = await request({
      url: `/api/channels/${encodeURIComponent(channelId)}/devices`,
      method: 'get',
    })
    const raw = Array.isArray(res) ? res : (res?.data || [])
    deviceOptions.value = raw.map((item) => ({
      label: item.name || item.id,
      value: item.id,
    }))
  } finally {
    loadingDevices.value = false
  }
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      draft.value = normalizeDraft(props.filters)
      loadChannels()
      if (draft.value.channelId) {
        loadDevices(draft.value.channelId)
      } else {
        deviceOptions.value = []
      }
    }
  }
)

watch(
  () => props.mode,
  (mode) => {
    draft.value = normalizeDraft(props.filters)
  }
)

watch(
  () => draft.value.channelId,
  (channelId, previous) => {
    if (channelId !== previous) {
      draft.value.deviceId = ''
    }
    loadDevices(channelId)
  }
)

const handleReset = () => {
  draft.value = createDefaultFilters(props.mode)
  deviceOptions.value = []
}

const handleApply = () => {
  emit('apply', { ...draft.value, categories: [...(draft.value.categories || [])] })
  emit('update:visible', false)
}
</script>
