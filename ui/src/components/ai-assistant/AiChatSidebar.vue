<template>
  <aside
    class="ai-chat-sidebar"
    aria-label="AI助手 对话"
  >
    <header class="ai-chat-sidebar__header">
      <span>对话助手</span>
    </header>

    <div v-if="contextLabel" class="ai-chat-sidebar__context">
      <span class="ai-chat-sidebar__context-badge">{{ contextLabel }}</span>
    </div>

    <div ref="messagesRef" class="ai-chat-sidebar__messages" role="log" aria-live="polite">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="ai-message ai-message--compact"
        :class="`ai-message--${msg.role}`"
      >
        <div v-if="msg.role === 'assistant'" class="ai-message__avatar" aria-hidden="true">
          <AiAssistantIcon />
        </div>
        <div class="ai-message__bubble">
          <div
            v-if="msg.role === 'assistant'"
            class="ai-message__text ai-message__text--md"
            v-html="formatContent(msg.content)"
          ></div>
          <p v-else class="ai-message__text">{{ msg.content }}</p>
        </div>
      </div>
      <div v-if="loading" class="ai-message ai-message--assistant ai-message--compact">
        <div class="ai-message__avatar" aria-hidden="true"><AiAssistantIcon /></div>
        <div class="ai-message__bubble ai-message__bubble--typing">
          <span class="ai-typing-dot"></span>
          <span class="ai-typing-dot"></span>
          <span class="ai-typing-dot"></span>
        </div>
      </div>
    </div>

    <div v-if="suggestions.length" class="ai-panel__suggestions ai-panel__suggestions--compact">
      <button
        v-for="item in suggestions"
        :key="item"
        type="button"
        class="ai-suggestion-chip"
        :disabled="loading"
        @click="sendMessage(item)"
      >
        {{ item }}
      </button>
    </div>

    <form class="ai-chat-sidebar__input" @submit.prevent="sendMessage()">
      <div
        class="ai-chat-input__box"
        :class="{ 'ai-chat-input__box--focused': inputFocused }"
      >
        <a-textarea
          v-model="input"
          class="ai-chat-input__textarea"
          :auto-size="{ minRows: 2, maxRows: 6 }"
          placeholder="问答 · 排障 · 配置帮助…"
          :disabled="loading"
          aria-label="对话输入"
          @focus="inputFocused = true"
          @blur="inputFocused = false"
          @keydown.enter.exact.prevent="sendMessage()"
          @keydown.enter.shift.exact.stop
        />
        <button
          type="submit"
          class="ai-chat-input__send"
          :class="{
            'ai-chat-input__send--active': input.trim() && !loading,
            'ai-chat-input__send--loading': loading
          }"
          :disabled="!input.trim() || loading"
          aria-label="发送消息"
          title="发送 (Enter)"
        >
          <span v-if="loading" class="ai-chat-input__send-spinner" aria-hidden="true"></span>
          <icon-send v-else :size="16" />
        </button>
      </div>
      <p class="ai-chat-input__hint">Enter 发送 · Shift+Enter 换行</p>
    </form>
  </aside>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { IconSend } from '@arco-design/web-vue/es/icon'
import { formatMarkdownLite } from '@/utils/markdownLite'
import { AI_WORKSPACES } from '@/composables/useAiAssistant'
import AiApi from '@/api/ai'
import AiAssistantIcon from './AiAssistantIcon.vue'

const props = defineProps({
  workspace: { type: String, default: 'protocol' },
  taskId: { type: String, default: '' },
  taskStatus: { type: String, default: '' }
})

const route = useRoute()
const messagesRef = ref(null)
const input = ref('')
const inputFocused = ref(false)
const loading = ref(false)
const suggestions = ref(['系统运行概况', '通道离线排查', 'PCAP 逆向流程'])
const messages = ref([
  { role: 'assistant', content: '我是 **AI助手**，可配合左侧工作台使用。\n- 协议逆向与配置生成\n- Schema 校验与联调诊断' }
])

const contextLabel = computed(() => {
  const ws = AI_WORKSPACES.find((w) => w.id === props.workspace)
  const parts = [ws?.label || props.workspace]
  if (props.taskId) parts.push(`#${props.taskId.slice(-8)}`)
  return parts.join(' · ')
})

const formatContent = (text) => formatMarkdownLite(text)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesRef.value) messagesRef.value.scrollTop = messagesRef.value.scrollHeight
}

const sendMessage = async (text) => {
  const content = (text || input.value).trim()
  if (!content || loading.value) return
  messages.value.push({ role: 'user', content })
  input.value = ''
  loading.value = true
  suggestions.value = []
  await scrollToBottom()
  try {
    const res = await AiApi.chat({
      message: content,
      context: {
        route: route.path,
        page_title: route.meta?.title || '',
        mode: 'workbench',
        workspace: props.workspace,
        task_id: props.taskId || undefined,
        task_status: props.taskStatus || undefined
      }
    })
    if (res.code === '0' && res.data) {
      messages.value.push({ role: 'assistant', content: res.data.reply })
      if (res.data.suggestions?.length) suggestions.value = res.data.suggestions
      // Workbench chat should not auto-navigate away from the current page
    }
  } catch {
    messages.value.push({ role: 'assistant', content: '助手暂时无法响应，请稍后重试。' })
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

watch(messages, scrollToBottom, { deep: true })

watch(() => props.workspace, () => {
  suggestions.value = workspaceSuggestions(props.workspace)
})

const workspaceSuggestions = (ws) => {
  const map = {
    protocol: ['PCAP 逆向流程', 'Modbus 字节序说明', '如何填写观测值'],
    validation: ['Schema 校验规则', '如何提高通过率', '点位 ID 规范'],
    cases: ['验证用例如何回放', '帧证据链说明', '容差设置建议'],
    edge: ['EdgeRule 触发条件', 'MQTT 上报配置', '阈值规则示例'],
    diagnostics: ['通道离线排查', 'ScanEngine 指标', 'Soak 验收说明']
  }
  return map[ws] || ['系统运行概况', '帮助']
}
</script>
