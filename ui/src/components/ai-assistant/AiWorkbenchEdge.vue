<template>
  <div class="ai-workbench-edge">
    <div class="ai-workbench-section">
      <h4 class="ai-workbench-section__title">边缘场景生成 · G4</h4>
      <p class="ai-workbench-section__hint">输入场景描述，生成 EdgeRule / 场景模版 JSON 草案</p>
      <div class="ai-edge-keywords">
        <button
          v-for="kw in keywordPresets"
          :key="kw"
          type="button"
          class="ai-suggestion-chip"
          @click="description = kw"
        >
          {{ kw.slice(0, 20) }}…
        </button>
      </div>
      <a-textarea
        v-model="description"
        :auto-size="{ minRows: 2, maxRows: 4 }"
        placeholder="例如：冷机出水温度超过 12°C 持续 30 秒触发 MQTT 报警"
        aria-label="边缘场景描述"
      />
      <a-button type="primary" size="small" :loading="loading" style="margin-top: 8px" @click="generate">
        生成草案
      </a-button>
    </div>

    <div v-if="loading" class="ai-skeleton ai-skeleton--card"></div>

    <template v-else-if="draft">
      <div class="ai-edge-preview-head">
        <span>EdgeRule 草案预览</span>
        <span class="ai-file-badge ai-file-badge--solid">JSON</span>
      </div>
      <AiJsonPreview :data="draft" title="edge-rule-draft" />
      <div class="ai-confirm-bar__actions">
        <a-button type="outline" size="small" @click="exportDraft">导出 JSON</a-button>
        <a-button size="small" @click="$router.push('/edge-compute')">前往边缘计算</a-button>
      </div>
    </template>

    <AiEmptyState
      v-else
      title="描述你的边缘场景"
      description="支持温度阈值、MQTT 上报、持续时间等关键词，AI助手 将生成规则草案"
    >
      <template #icon>
        <icon-thunderbolt :size="22" />
      </template>
    </AiEmptyState>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconThunderbolt } from '@arco-design/web-vue/es/icon'
import AiApi from '@/api/ai'
import AiJsonPreview from './AiJsonPreview.vue'
import AiEmptyState from './AiEmptyState.vue'

const description = ref('冷机出水温度超过12度持续30秒触发MQTT报警')
const draft = ref(null)
const loading = ref(false)

const keywordPresets = [
  '冷机出水温度超过12度持续30秒触发MQTT报警',
  '配电柜功率因数低于0.85发送邮件通知',
  'UPS电池电压低于48V联动关闭非关键负载'
]

const generate = async () => {
  loading.value = true
  draft.value = null
  try {
    const res = await AiApi.generateEdgeRuleDraft(description.value)
    if (res.code === '0') draft.value = res.data.draft
    else throw new Error(res.message || '生成失败')
  } catch (e) {
    Message.error(e.message || '生成草案失败')
  } finally {
    loading.value = false
  }
}

const exportDraft = () => {
  if (!draft.value) return
  const blob = new Blob([JSON.stringify(draft.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'edge-rule-draft.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>
