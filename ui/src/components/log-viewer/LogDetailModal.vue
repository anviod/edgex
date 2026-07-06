<template>
  <a-modal
    :visible="visible"
    title="日志详情"
    width="720px"
    unmount-on-close
    :esc-to-close="true"
    modal-class="industrial-white-modal log-detail-modal"
    @update:visible="(value) => emit('update:visible', value)"
    @cancel="emit('update:visible', false)"
  >
    <div v-if="log" class="log-detail">
      <div class="log-detail__meta">
        <span class="log-detail__time">{{ formatLogDetailTime(log.ts) }}</span>
        <span :class="['log-level', getLogLevelClass(log.level)]">
          {{ (log.level || 'INFO').toUpperCase() }}
        </span>
        <span :class="['log-category', getLogCategoryClass(getLogCategory(log))]">
          {{ LOG_CATEGORY_LABELS[getLogCategory(log)] || getLogCategory(log) }}
        </span>
        <span v-if="scopeLabel" class="log-detail__scope">{{ scopeLabel }}</span>
      </div>

      <section class="log-detail__section">
        <h4 class="log-detail__label">消息</h4>
        <pre class="log-detail__message">{{ log.msg || '' }}</pre>
      </section>

      <section v-if="callerInfo" class="log-detail__section">
        <h4 class="log-detail__label">代码位置</h4>
        <div class="log-detail__caller">
          <code>{{ callerInfo.location }}</code>
        </div>
      </section>

      <section v-if="metadataEntries.length > 0" class="log-detail__section">
        <h4 class="log-detail__label">元数据</h4>
        <dl class="log-detail__dl">
          <template v-for="entry in metadataEntries" :key="entry.key">
            <dt>{{ entry.label }}</dt>
            <dd>{{ entry.value }}</dd>
          </template>
        </dl>
      </section>

      <section v-if="extraFieldEntries.length > 0" class="log-detail__section">
        <h4 class="log-detail__label">扩展字段</h4>
        <div class="log-detail__fields">
          <span
            v-for="entry in extraFieldEntries"
            :key="entry.key"
            class="log-extra log-detail__extra"
          >
            <span class="log-extra__key">{{ entry.key }}</span>
            <span class="log-extra__sep">=</span>
            <span class="log-extra__val">{{ entry.value }}</span>
          </span>
        </div>
      </section>

      <section class="log-detail__section">
        <a-collapse :bordered="false" expand-icon-position="right" class="log-detail__raw-collapse">
          <a-collapse-item key="raw" header="原始 JSON">
            <pre class="log-detail__raw">{{ rawJson }}</pre>
          </a-collapse-item>
        </a-collapse>
      </section>
    </div>

    <template #footer>
      <div class="log-detail-modal__footer">
        <div v-if="pinnedLogs.length > 1" class="log-detail-modal__nav">
          <a-button size="small" :disabled="!canGoPrev" @click="emit('prev')">
            上一条
          </a-button>
          <span class="log-detail-modal__nav-count">{{ activeIndex + 1 }} / {{ pinnedLogs.length }}</span>
          <a-button size="small" :disabled="!canGoNext" @click="emit('next')">
            下一条
          </a-button>
        </div>
        <div class="log-detail-modal__actions">
          <a-button @click="emit('unpin')">取消钉住</a-button>
          <a-button type="primary" @click="emit('update:visible', false)">关闭</a-button>
        </div>
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { computed } from 'vue'
import {
  LOG_CATEGORY_LABELS,
  extractCallerInfo,
  findLogEntryIndex,
  formatLogDetailTime,
  formatLogRawJson,
  formatLogScopeLabel,
  getLogCategory,
  getLogCategoryClass,
  getLogExtraFields,
  getLogLevelClass,
  getLogMetadataFields,
} from '@/utils/logFormat'

const props = defineProps({
  visible: { type: Boolean, default: false },
  log: { type: Object, default: null },
  pinnedLogs: { type: Array, default: () => [] },
  channelNameMap: { type: Object, default: () => ({}) },
  deviceNameMap: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:visible', 'unpin', 'prev', 'next'])

const activeIndex = computed(() => findLogEntryIndex(props.pinnedLogs, props.log))

const canGoPrev = computed(() => activeIndex.value > 0)

const canGoNext = computed(() =>
  activeIndex.value >= 0 && activeIndex.value < props.pinnedLogs.length - 1
)

const scopeLabel = computed(() =>
  formatLogScopeLabel(props.log, props.channelNameMap, props.deviceNameMap)
)

const callerInfo = computed(() => extractCallerInfo(props.log))

const metadataEntries = computed(() => {
  const meta = getLogMetadataFields(props.log)
  const labels = {
    category: '分类',
    logger: 'Logger',
    function: 'Function',
    channel_id: '通道 ID',
    device_id: '设备 ID',
    stacktrace: 'Stacktrace',
  }
  return Object.entries(meta).map(([key, value]) => ({
    key,
    label: labels[key] || key,
    value,
  }))
})

const extraFieldEntries = computed(() =>
  Object.entries(getLogExtraFields(props.log || {})).map(([key, value]) => ({ key, value }))
)

const rawJson = computed(() => formatLogRawJson(props.log))
</script>
