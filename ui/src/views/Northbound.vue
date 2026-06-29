<template>
  <div class="page-shell northbound-page">
    <div class="page-header">
      <div>
        <h2 class="page-title">北向接口</h2>
        <p class="page-subtitle">配置数据上行通道，支持主动推送与被动暴露两种模式</p>
      </div>
      <a-button type="primary" @click="addDialogVisible = true">
        <template #icon><icon-plus :size="16" /></template>
        添加通道
      </a-button>
    </div>

    <!-- 模式说明条 -->
    <div class="mode-legend">
      <div class="mode-legend__item mode-legend__item--push">
        <span class="mode-legend__dot" />
        <span><strong>主动上报</strong> — 网关连接 Broker / 云平台并推送数据</span>
      </div>
      <div class="mode-legend__item mode-legend__item--passive">
        <span class="mode-legend__dot" />
        <span><strong>被动读取</strong> — 网关暴露服务，等待上位机连接读取</span>
      </div>
    </div>

    <div v-if="loading" class="loading-wrap">
      <a-spin size="32" />
    </div>

    <a-empty v-else-if="hasNoChannels" class="empty-wrap">
      <template #image><icon-upload :size="64" class="empty-icon-muted" /></template>
      <div class="empty-title">暂无北向通道</div>
      <div class="empty-desc">点击「添加通道」选择协议并开始配置</div>
    </a-empty>

    <template v-else>
      <!-- 主动上报 -->
      <section v-if="channelGroups.push.length" class="channel-section">
        <div class="section-header section-header--push">
          <div class="section-header__left">
            <icon-send :size="18" />
            <span class="section-header__title">主动上报</span>
            <a-tag size="small" color="arcoblue">{{ channelGroups.push.length }}</a-tag>
          </div>
          <span class="section-header__desc">MQTT · Sparkplug B · HTTP · edgeOS</span>
        </div>
        <a-row :gutter="[24, 24]">
          <a-col
            v-for="{ meta, item } in channelGroups.push"
            :key="`${meta.key}-${item.id}`"
            :xs="24" :sm="12" :lg="8"
          >
            <NorthboundChannelCard
              :meta="meta"
              :item="item"
              :connection-status="config.status"
              @help="onHelp(meta.key, item)"
              @settings="onSettings(meta.key, item)"
              @stats="onStats(meta.key, item)"
              @delete="deleteProtocol"
              @sync="syncOpcuaServer"
            />
          </a-col>
        </a-row>
      </section>

      <!-- 被动读取 -->
      <section v-if="channelGroups.passive.length" class="channel-section">
        <div class="section-header section-header--passive">
          <div class="section-header__left">
            <icon-storage :size="18" />
            <span class="section-header__title">被动读取</span>
            <a-tag size="small" color="purple">{{ channelGroups.passive.length }}</a-tag>
          </div>
          <span class="section-header__desc">OPC UA Server · 等待 SCADA / MES 连接</span>
        </div>
        <a-row :gutter="[24, 24]">
          <a-col
            v-for="{ meta, item } in channelGroups.passive"
            :key="`${meta.key}-${item.id}`"
            :xs="24" :sm="12" :lg="8"
          >
            <NorthboundChannelCard
              :meta="meta"
              :item="item"
              :connection-status="config.status"
              @help="onHelp(meta.key, item)"
              @settings="onSettings(meta.key, item)"
              @stats="onStats(meta.key, item)"
              @delete="deleteProtocol"
              @sync="syncOpcuaServer"
            />
          </a-col>
        </a-row>
      </section>
    </template>

    <NorthboundAddDialog v-model:visible="addDialogVisible" @select="addProtocol" />

    <MqttSettingsDialog v-model:visible="mqttDialogVisible" :config="mqttEditConfig" :all-devices="allDevices" @saved="fetchConfig" />
    <HttpSettingsDialog v-model:visible="httpDialogVisible" :config="httpEditConfig" :all-devices="allDevices" @saved="fetchConfig" />
    <OpcuaSettingsDialog v-model:visible="opcuaDialogVisible" :config="opcuaEditConfig" :all-devices="allDevices" @saved="fetchConfig" />
    <SparkplugSettingsDialog v-model:visible="sparkplugDialogVisible" :config="sparkplugEditConfig" :all-devices="allDevices" @saved="fetchConfig" />
    <EdgeOSMQTTSettingsDialog v-model:visible="edgeosMQTTDialogVisible" :config="edgeosMQTTEditConfig" :all-devices="allDevices" @saved="fetchConfig" />
    <EdgeOSNATSSettingsDialog v-model:visible="edgeosNATSDialogVisible" :config="edgeosNATSEditConfig" :all-devices="allDevices" @saved="fetchConfig" />

    <MqttHelpDialog
      v-model:visible="mqttHelpVisible"
      :topic="mqttHelpData.topic"
      :subscribe_topic="mqttHelpData.subscribe_topic"
      :write_response_topic="mqttHelpData.write_response_topic"
      :status_topic="mqttHelpData.status_topic"
      :online_payload="mqttHelpData.online_payload"
      :offline_payload="mqttHelpData.offline_payload"
    />
    <OpcuaHelpDialog v-model:visible="opcuaHelpVisible" :port="opcuaHelpData.port" :endpoint="opcuaHelpData.endpoint" />
    <EdgeOSHelpDialog v-model:visible="edgeosHelpVisible" />

    <StatsDialog v-model:visible="mqttStatsVisible" type="mqtt" :item-id="mqttStatsId" />
    <StatsDialog v-model:visible="httpStatsVisible" type="http" :item-id="httpStatsId" />
    <StatsDialog v-model:visible="opcuaStatsVisible" type="opcua" :item-id="opcuaStatsId" />
    <StatsDialog v-model:visible="sparkplugStatsVisible" type="sparkplug_b" :item-id="sparkplugStatsId" />
    <StatsDialog v-model:visible="edgeosMQTTStatsVisible" type="edgeos-mqtt" :item-id="edgeosMQTTStatsId" />
    <StatsDialog v-model:visible="edgeosNATSStatsVisible" type="edgeos-nats" :item-id="edgeosNATSStatsId" />

    <a-modal
      v-model:visible="deleteDialog.visible"
      title="确认删除"
      ok-text="确认删除"
      cancel-text="取消"
      :ok-button-props="{ status: 'danger' }"
      @ok="executeDeleteProtocol"
      @cancel="deleteDialog.visible = false"
    >
      <p>确定要删除该北向通道吗？</p>
      <p class="text-secondary">此操作不可撤销。</p>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { IconPlus, IconUpload, IconSend, IconStorage } from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import { showMessage } from '@/composables/useGlobalState'
import request from '@/utils/request'
import { flattenChannels } from '@/utils/northboundProtocols'
import { fetchAllSouthboundDevices } from '@/utils/southboundDevices'

import NorthboundChannelCard from '@/components/northbound/NorthboundChannelCard.vue'
import NorthboundAddDialog from '@/components/northbound/NorthboundAddDialog.vue'
import MqttSettingsDialog from '@/components/northbound/MqttSettingsDialog.vue'
import HttpSettingsDialog from '@/components/northbound/HttpSettingsDialog.vue'
import OpcuaSettingsDialog from '@/components/northbound/OpcuaSettingsDialog.vue'
import SparkplugSettingsDialog from '@/components/northbound/SparkplugSettingsDialog.vue'
import EdgeOSMQTTSettingsDialog from '@/components/northbound/EdgeOSMQTTSettingsDialog.vue'
import EdgeOSNATSSettingsDialog from '@/components/northbound/EdgeOSNATSSettingsDialog.vue'
import MqttHelpDialog from '@/components/northbound/MqttHelpDialog.vue'
import OpcuaHelpDialog from '@/components/northbound/OpcuaHelpDialog.vue'
import EdgeOSHelpDialog from '@/components/northbound/EdgeOSHelpDialog.vue'
import StatsDialog from '@/components/northbound/StatsDialog.vue'

const loading = ref(false)
const config = ref({ mqtt: [], http: [], opcua: [], sparkplug_b: [], edgeos_mqtt: [], edgeos_nats: [], status: {} })
const allDevices = ref([])

const channelGroups = computed(() => flattenChannels(config.value))

const hasNoChannels = computed(() =>
  channelGroups.value.push.length === 0 && channelGroups.value.passive.length === 0
)

const addDialogVisible = ref(false)
const mqttDialogVisible = ref(false)
const httpDialogVisible = ref(false)
const opcuaDialogVisible = ref(false)
const sparkplugDialogVisible = ref(false)
const edgeosMQTTDialogVisible = ref(false)
const edgeosNATSDialogVisible = ref(false)

const mqttEditConfig = ref(null)
const httpEditConfig = ref(null)
const opcuaEditConfig = ref(null)
const sparkplugEditConfig = ref(null)
const edgeosMQTTEditConfig = ref(null)
const edgeosNATSEditConfig = ref(null)

const mqttHelpVisible = ref(false)
const mqttHelpData = ref({})
const opcuaHelpVisible = ref(false)
const opcuaHelpData = ref({ port: 4840, endpoint: '' })
const edgeosHelpVisible = ref(false)

const mqttStatsVisible = ref(false)
const mqttStatsId = ref('')
const httpStatsVisible = ref(false)
const httpStatsId = ref('')
const opcuaStatsVisible = ref(false)
const opcuaStatsId = ref('')
const sparkplugStatsVisible = ref(false)
const sparkplugStatsId = ref('')
const edgeosMQTTStatsVisible = ref(false)
const edgeosMQTTStatsId = ref('')
const edgeosNATSStatsVisible = ref(false)
const edgeosNATSStatsId = ref('')

const fetchConfig = async () => {
  loading.value = true
  try {
    const data = await request.get('/api/northbound/config')
    config.value = {
      mqtt: data.mqtt || [],
      http: data.http || [],
      opcua: data.opcua || [],
      sparkplug_b: data.sparkplug_b || [],
      edgeos_mqtt: data.edgeos_mqtt || [],
      edgeos_nats: data.edgeos_nats || [],
      status: data.status || {}
    }
  } catch (e) {
    showMessage('获取配置失败: ' + e.message, 'error')
  } finally {
    loading.value = false
  }
}

const fetchAllDevices = async () => {
  try {
    allDevices.value = await fetchAllSouthboundDevices(request)
  } catch (e) {
    console.error('Failed to fetch devices', e)
    allDevices.value = []
  }
}

const settingsHandlers = {
  mqtt: { open: () => { mqttDialogVisible.value = true }, ref: mqttEditConfig },
  http: { open: () => { httpDialogVisible.value = true }, ref: httpEditConfig },
  opcua: { open: () => { opcuaDialogVisible.value = true }, ref: opcuaEditConfig },
  sparkplug_b: { open: () => { sparkplugDialogVisible.value = true }, ref: sparkplugEditConfig },
  edgeos_mqtt: { open: () => { edgeosMQTTDialogVisible.value = true }, ref: edgeosMQTTEditConfig },
  edgeos_nats: { open: () => { edgeosNATSDialogVisible.value = true }, ref: edgeosNATSEditConfig }
}

const onSettings = async (type, item) => {
  await fetchAllDevices()
  const h = settingsHandlers[type]
  if (h) {
    h.ref.value = item ? JSON.parse(JSON.stringify(item)) : null
    h.open()
  }
}

const addProtocol = (type) => {
  addDialogVisible.value = false
  onSettings(type, null)
}

const onHelp = (type, item) => {
  if (type === 'mqtt') {
    mqttHelpData.value = {
      topic: item.topic || '',
      subscribe_topic: item.subscribe_topic || '',
      write_response_topic: item.write_response_topic || '',
      status_topic: item.status_topic || '',
      online_payload: item.online_payload || '',
      offline_payload: item.offline_payload || ''
    }
    mqttHelpVisible.value = true
  } else if (type === 'opcua') {
    opcuaHelpData.value = { port: item.port || 4840, endpoint: item.endpoint || '' }
    opcuaHelpVisible.value = true
  } else if (type === 'edgeos_mqtt' || type === 'edgeos_nats') {
    edgeosHelpVisible.value = true
  }
}

const onStats = (type, item) => {
  const map = {
    mqtt: [mqttStatsId, mqttStatsVisible],
    http: [httpStatsId, httpStatsVisible],
    opcua: [opcuaStatsId, opcuaStatsVisible],
    sparkplug_b: [sparkplugStatsId, sparkplugStatsVisible],
    edgeos_mqtt: [edgeosMQTTStatsId, edgeosMQTTStatsVisible],
    edgeos_nats: [edgeosNATSStatsId, edgeosNATSStatsVisible]
  }
  const [idRef, visRef] = map[type] || []
  if (idRef) { idRef.value = item.id; visRef.value = true }
}

const deleteDialog = reactive({ visible: false, type: '', id: '' })

const deleteProtocol = (type, id) => {
  deleteDialog.type = type
  deleteDialog.id = id
  deleteDialog.visible = true
}

const executeDeleteProtocol = async () => {
  const { type, id } = deleteDialog
  if (!type || !id) return

  try {
    await request.delete(`/api/northbound/${type}/${id}`)
    showMessage('删除成功', 'success')
    deleteDialog.visible = false
    fetchConfig()
  } catch (e) {
    showMessage('删除失败: ' + e.message, 'error')
  }
}

const syncOpcuaServer = async (item) => {
  if (!item?.id) return
  const closeLoading = Message.loading({ content: '正在同步 OPC UA 点位映射...', duration: 0 })
  try {
    await request.post(`/api/northbound/opcua/${item.id}/sync`)
    showMessage('点位映射已同步，读写权限已更新', 'success')
  } catch (e) {
    showMessage('同步失败: ' + (e.message || e), 'error')
  } finally {
    closeLoading()
  }
}

onMounted(fetchConfig)
</script>

<style scoped>
/* v3.0 — styles in src/styles/ */
</style>
