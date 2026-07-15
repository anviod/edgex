<template>
  <a-modal v-model:visible="visible" title="MQTT 接入文档" :width="900" :footer="false" modal-class="northbound-help-modal" unmount-on-close>
    <a-tabs v-model:active-key="activeTab" type="line">
      <a-tab-pane key="reporting" title="数据上报">
        <div class="nb-help-tab">
          <header class="nb-help-hero">
            <h4 class="nb-help-hero__title">数据上报 (Data Reporting)</h4>
            <p class="nb-help-hero__lead">
              设备采集的数据将按以下格式上报。完整字段说明见
              <a href="/docs/northbound/MQTT数据上下行格式.html" target="_blank" class="nb-help-link">MQTT 数据上下行格式</a>。
            </p>
          </header>

          <div class="nb-help-topic-card nb-help-topic-card--primary">
            <div class="nb-help-topic-card__body">
              <div class="nb-help-topic-card__label">Topic (发布主题)</div>
              <div class="nb-help-code-row">
                <span class="nb-help-code-row__text">{{ topic }}</span>
                <a-button type="text" size="mini" @click="copyToClipboard(topic)">
                  <template #icon><icon-copy :size="12" /></template>
                </a-button>
              </div>
            </div>
          </div>

          <div class="nb-help-block">
            <div class="nb-help-block-title">Payload 格式 (JSON)</div>
            <pre class="nb-help-pre">{
  "timestamp": 1678888888888,
  "node": "device_name",
  "group": "channel_name",
  "values": {
    "point_name": 123.45
  },
  "errors": {},
  "metas": {}
}</pre>
          </div>
        </div>
      </a-tab-pane>

      <a-tab-pane key="control" title="设备控制">
        <div class="nb-help-tab">
          <header class="nb-help-hero">
            <h4 class="nb-help-hero__title">设备控制 (Device Control)</h4>
            <p class="nb-help-hero__lead">向设备写入数据，支持多点位同时写入。</p>
          </header>

          <div class="nb-help-topic-card nb-help-topic-card--blue">
            <div class="nb-help-topic-card__body">
              <div class="nb-help-topic-card__label">Topic (订阅主题 - 发送请求)</div>
              <div class="nb-help-code-row">
                <span class="nb-help-code-row__text">{{ subscribe_topic || '未配置' }}</span>
                <a-button type="text" size="mini" @click="copyToClipboard(subscribe_topic)">
                  <template #icon><icon-copy :size="12" /></template>
                </a-button>
              </div>
            </div>
          </div>

          <div class="nb-help-block">
            <div class="nb-help-block-title">请求 Payload (JSON)</div>
            <pre class="nb-help-pre">{
  "uuid": "req_123456",
  "group": "channel_name",
  "node": "device_name",
  "values": {
    "point_name": 1
  }
}</pre>
          </div>

          <div class="nb-help-topic-card nb-help-topic-card--green">
            <div class="nb-help-topic-card__body">
              <div class="nb-help-topic-card__label">Topic (响应主题 - 接收结果)</div>
              <div class="nb-help-code-row">
                <span class="nb-help-code-row__text">{{ write_response_topic || (subscribe_topic ? subscribe_topic + '/resp' : '未配置') }}</span>
                <a-button type="text" size="mini" @click="copyToClipboard(write_response_topic || (subscribe_topic ? subscribe_topic + '/resp' : ''))">
                  <template #icon><icon-copy :size="12" /></template>
                </a-button>
              </div>
            </div>
          </div>

          <div class="nb-help-block">
            <div class="nb-help-block-title">响应 Payload (JSON)</div>
            <pre class="nb-help-pre">{
  "uuid": "req_123456",
  "success": true,
  "message": "error msg"
}</pre>
          </div>
        </div>
      </a-tab-pane>

      <a-tab-pane key="status" title="在线状态">
        <div class="nb-help-tab">
          <header class="nb-help-hero">
            <h4 class="nb-help-hero__title">上下线状态 (Status)</h4>
            <p class="nb-help-hero__lead">网关/通道以及南向设备的连接状态变更时发布。</p>
          </header>

          <a-alert type="info" class="nb-help-alert">
            支持变量替换: <code>{status}</code>, <code>{timestamp}</code>, <code>{device_id}</code>, <code>{device_name}</code>。
          </a-alert>

          <div class="nb-help-topic-card nb-help-topic-card--orange">
            <div class="nb-help-topic-card__body">
              <div class="nb-help-topic-card__label">Topic (状态主题)</div>
              <div class="nb-help-code-row">
                <span class="nb-help-code-row__text">{{ status_topic || topic + '/status' }}</span>
                <a-button type="text" size="mini" @click="copyToClipboard(status_topic || topic + '/status')">
                  <template #icon><icon-copy :size="12" /></template>
                </a-button>
              </div>
            </div>
          </div>

          <div class="nb-help-block">
            <div class="nb-help-block-title">Payload (上线 - Online)</div>
            <pre class="nb-help-pre">{{ online_payload || '{\n  "status": "online",\n  "timestamp": 1678888888888\n}' }}</pre>
          </div>

          <div class="nb-help-block">
            <div class="nb-help-block-title">Payload (离线/遗嘱 - Offline/LWT)</div>
            <pre class="nb-help-pre">{{ offline_payload || '{\n  "status": "offline",\n  "timestamp": 1678888888888\n}' }}</pre>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup>
import { ref, computed } from 'vue'
import { IconCopy } from '@arco-design/web-vue/es/icon'
import { showMessage } from '@/composables/useGlobalState'

const props = defineProps({
  visible: { type: Boolean, default: false },
  topic: { type: String, default: '' },
  subscribe_topic: { type: String, default: '' },
  write_response_topic: { type: String, default: '' },
  status_topic: { type: String, default: '' },
  online_payload: { type: String, default: '' },
  offline_payload: { type: String, default: '' }
})

const emit = defineEmits(['update:visible'])

const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})
const activeTab = ref('reporting')

const copyToClipboard = (text) => {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    showMessage('已复制到剪贴板', 'success')
  }).catch(() => {
    showMessage('复制失败', 'error')
  })
}
</script>
