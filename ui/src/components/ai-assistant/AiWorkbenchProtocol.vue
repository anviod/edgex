<template>
  <div class="ai-workbench-protocol">
    <!-- Upload section -->
    <div class="ai-workbench-section">
      <h4 class="ai-workbench-section__title">文件上传 · Scenario A/B</h4>
      <p class="ai-workbench-section__hint">拖拽或点击上传 · PCAP/HEX 最大 50MB · 文档最大 20MB</p>

      <div class="ai-upload-zones">
        <div
          v-for="zone in uploadZones"
          :key="zone.skill"
          class="ai-upload-zone"
          :class="{
            'ai-upload-zone--dragover': dragOver === zone.skill,
            'ai-upload-zone--active': pendingFile?.skill === zone.skill
          }"
          role="button"
          tabindex="0"
          :aria-label="`上传 ${zone.label}`"
          @dragover.prevent="onDragOver(zone.skill)"
          @dragleave="onDragLeave"
          @drop.prevent="onDrop($event, zone.skill)"
          @keydown.enter="triggerFileInput(zone.skill)"
          @click="triggerFileInput(zone.skill)"
        >
          <input
            :ref="(el) => setFileRef(zone.skill, el)"
            type="file"
            :accept="zone.accept"
            hidden
            @change="onFileSelect($event, zone.skill)"
          />
          <div class="ai-upload-zone__icon">{{ zone.icon }}</div>
          <span class="ai-upload-zone__label">{{ zone.label }}</span>
          <small>{{ zone.hint }}</small>
          <div class="ai-upload-zone__badges">
            <span v-for="ext in zone.extensions" :key="ext" class="ai-file-badge">{{ ext }}</span>
          </div>
        </div>
      </div>

      <div v-if="uploadProgress > 0 && uploadProgress < 100" class="ai-upload-progress">
        <div class="ai-upload-progress__bar">
          <div class="ai-upload-progress__fill" :style="{ width: `${uploadProgress}%` }"></div>
        </div>
        <span class="ai-upload-progress__text">上传中 {{ uploadProgress }}%</span>
      </div>

      <div v-if="pendingFile" class="ai-upload-file-card">
        <span class="ai-file-badge ai-file-badge--solid">{{ fileExt(pendingFile.file.name) }}</span>
        <span class="ai-upload-file-card__name">{{ pendingFile.file.name }}</span>
        <span class="ai-upload-file-card__size">{{ formatFileSize(pendingFile.file.size) }}</span>
        <button type="button" class="ai-upload-file-card__clear" aria-label="清除文件" @click="clearPending">×</button>
      </div>
    </div>

    <!-- Observations -->
    <div class="ai-workbench-section">
      <h4 class="ai-workbench-section__title">HMI 观测值（可选）</h4>
      <div v-for="(obs, i) in observations" :key="i" class="ai-obs-row">
        <a-input v-model="obs.label" placeholder="标签" size="small" />
        <a-input-number v-model="obs.value" placeholder="显示值" size="small" />
      </div>
      <a-select v-model="protocolId" size="small" placeholder="协议（可选）" style="width: 180px; margin-top: 8px">
        <a-option value="modbus-tcp">Modbus TCP</a-option>
        <a-option value="modbus-rtu">Modbus RTU</a-option>
        <a-option value="bacnet-ip">BACnet/IP</a-option>
        <a-option value="s7">S7</a-option>
      </a-select>
      <a-button
        v-if="pendingFile"
        type="primary"
        size="small"
        :loading="loading"
        style="margin-top: 10px"
        @click="submitUpload"
      >
        开始分析
      </a-button>
    </div>

    <!-- Pipeline -->
    <div v-if="loading && !stages.length" class="ai-workbench-section">
      <div class="ai-skeleton ai-skeleton--pipeline"></div>
    </div>
    <AiPipelineStages v-else-if="stages.length" :stages="stages" />

    <!-- Deliverables -->
    <div v-if="loading && !deliverables" class="ai-workbench-section">
      <div class="ai-skeleton ai-skeleton--card"></div>
      <div class="ai-skeleton ai-skeleton--card"></div>
    </div>
    <AiDeliverablesPanel
      v-else-if="deliverables"
      :deliverables="deliverables"
      @export="$emit('export', $event)"
    />

    <AiEmptyState
      v-else-if="!loading && !task"
      icon="📡"
      title="开始协议分析"
      description="上传 PCAP 抓包或厂家文档，AI助手 将生成四类生产配置"
    />

    <!-- Human Confirm with diff -->
    <AiConfirmDiff
      v-if="task?.status === 'waiting_confirm' && deliverables"
      :deliverables="deliverables"
      :validation="task.validation"
      :loading="loading"
      @confirm="(mode) => $emit('confirm', mode)"
      @export-all="$emit('export-all')"
    />

    <div
      v-if="task?.status === 'applied'"
      class="ai-success-banner"
      role="status"
    >
      ✓ Human Confirm 完成 · 产出已确认
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { validateAiUploadFile, formatFileSize, getFileExtension } from '@/utils/aiFileValidation'
import AiPipelineStages from './AiPipelineStages.vue'
import AiDeliverablesPanel from './AiDeliverablesPanel.vue'
import AiConfirmDiff from './AiConfirmDiff.vue'
import AiEmptyState from './AiEmptyState.vue'

defineProps({
  task: { type: Object, default: null },
  stages: { type: Array, default: () => [] },
  deliverables: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  uploadProgress: { type: Number, default: 0 }
})

const emit = defineEmits(['upload', 'export', 'export-all', 'confirm'])

const protocolId = ref('modbus-tcp')
const observations = ref([
  { label: 'Uab', value: 220.5 },
  { label: 'Ubc', value: 221.1 },
  { label: 'Uca', value: 219.8 }
])

const dragOver = ref(null)
const pendingFile = ref(null)
const fileRefs = ref({})

const uploadZones = [
  {
    skill: 'protocol-reverse',
    label: 'PCAP / HEX',
    hint: 'Scenario B · 无文档逆向',
    icon: '📦',
    accept: '.pcap,.pcapng,.hex',
    extensions: ['.pcap', '.pcapng', '.hex']
  },
  {
    skill: 'doc-parse',
    label: 'Excel / CSV / PDF',
    hint: 'Scenario A · 厂家文档',
    icon: '📄',
    accept: '.xlsx,.xls,.csv,.pdf,.doc,.docx',
    extensions: ['.csv', '.xlsx', '.pdf']
  }
]

const setFileRef = (skill, el) => {
  if (el) fileRefs.value[skill] = el
}

const triggerFileInput = (skill) => {
  fileRefs.value[skill]?.click()
}

const handleFile = (file, skill) => {
  const result = validateAiUploadFile(file, skill)
  if (!result.ok) {
    Message.warning(result.error)
    return
  }
  pendingFile.value = { file, skill }
}

const onFileSelect = (e, skill) => {
  const file = e.target.files?.[0]
  if (file) handleFile(file, skill)
  e.target.value = ''
}

const onDragOver = (skill) => { dragOver.value = skill }
const onDragLeave = () => { dragOver.value = null }

const onDrop = (e, skill) => {
  dragOver.value = null
  const file = e.dataTransfer?.files?.[0]
  if (file) handleFile(file, skill)
}

const clearPending = () => { pendingFile.value = null }

const submitUpload = () => {
  if (!pendingFile.value) return
  emit('upload', {
    file: pendingFile.value.file,
    skill: pendingFile.value.skill,
    protocol_id: protocolId.value,
    observations: observations.value.filter((o) => o.label || o.value)
  })
  pendingFile.value = null
}

const fileExt = (name) => getFileExtension(name).replace('.', '').toUpperCase() || 'FILE'
</script>
