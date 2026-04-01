<template>
  <div class="northbound-container">
    <div class="header-container">
      <h2 class="page-title">北向数据上报</h2>
      <a-button type="primary" @click="addDialogVisible = true">
        <template #icon><icon-plus :size="16" /></template>
        添加上行通道
      </a-button>
    </div>

    <div v-if="loading" style="display: flex; justify-content: center; padding: 120px 0">
      <a-spin size="32" />
    </div>

    <a-empty v-else-if="hasNoChannels" style="padding: 120px 0">
      <template #image><icon-upload :size="64" style="color: #cbd5e1" /></template>
      <div style="font-size: 16px; font-weight: 500; color: #4e5969">暂无已启用的上行通道</div>
      <div style="font-size: 13px; color: #86909c; margin-top: 8px">点击右上角"添加上行通道"进行配置</div>
    </a-empty>

    <div v-else class="channels-container">
      <div v-if="config.mqtt && config.mqtt.length > 0" class="channel-item">
        <NorthboundMqtt
          :items="config.mqtt"
          :connection-status="config.status"
          @help="openMqttHelp"
          @settings="openMqttSettings"
          @stats="openMqttStats"
          @delete="deleteProtocol"
        />
      </div>
      <div v-if="config.http && config.http.length > 0" class="channel-item">
        <NorthboundHttp
          :items="config.http"
          @settings="openHttpSettings"
          @delete="deleteProtocol"
        />
      </div>
      <div v-if="config.opcua && config.opcua.length > 0" class="channel-item">
        <NorthboundOpcua
          :items="config.opcua"
          @help="openOpcuaHelp"
          @settings="openOpcuaSettings"
          @stats="openOpcuaStats"
          @delete="deleteProtocol"
        />
      </div>
      <div v-if="config.sparkplug_b && config.sparkplug_b.length > 0" class="channel-item">
        <NorthboundSparkplug
          :items="config.sparkplug_b"
          :connection-status="config.status"
          @settings="openSparkplugBSettings"
          @delete="deleteProtocol"
        />
      </div>
    </div>

    <a-modal v-model:visible="addDialogVisible" title="选择上行协议" :width="480" :footer="false" unmount-on-close>
      <a-list :bordered="false">
        <a-list-item @click="addProtocol('mqtt')" style="cursor: pointer">
          <a-list-item-meta title="MQTT 客户端" description="通用 MQTT 协议，支持自定义 Payload">
            <template #avatar><icon-cloud :size="24" style="color: #0ea5e9" /></template>
          </a-list-item-meta>
        </a-list-item>
        <a-list-item @click="addProtocol('http')" style="cursor: pointer">
          <a-list-item-meta title="HTTP 推送" description="通过 HTTP POST/PUT 推送数据到服务器">
            <template #avatar><icon-upload :size="24" style="color: #165dff" /></template>
          </a-list-item-meta>
        </a-list-item>
        <a-list-item @click="addProtocol('sparkplug_b')" style="cursor: pointer">
          <a-list-item-meta title="Sparkplug B 客户端" description="基于 MQTT 的工业物联网标准协议">
            <template #avatar><icon-swap :size="24" style="color: #00b42a" /></template>
          </a-list-item-meta>
        </a-list-item>
        <a-list-item @click="addProtocol('opcua')" style="cursor: pointer">
          <a-list-item-meta title="OPC UA 服务端" description="OPC UA Server，供 SCADA/MES 采集">
            <template #avatar><icon-storage :size="24" style="color: #722ed1" /></template>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </a-modal>

    <MqttSettingsDialog
      v-model="mqttDialogVisible"
      :config="mqttEditConfig"
      :all-devices="allDevices"
      @saved="fetchConfig"
    />

    <HttpSettingsDialog
      v-model="httpDialogVisible"
      :config="httpEditConfig"
      :all-devices="allDevices"
      @saved="fetchConfig"
    />

    <OpcuaSettingsDialog
      v-model="opcuaDialogVisible"
      :config="opcuaEditConfig"
      :all-devices="allDevices"
      @saved="fetchConfig"
    />

    <SparkplugSettingsDialog
      v-model="sparkplugDialogVisible"
      :config="sparkplugEditConfig"
      :all-devices="allDevices"
      @saved="fetchConfig"
    />

    <MqttHelpDialog
      v-model="mqttHelpVisible"
      :topic="mqttHelpData.topic"
      :subscribe_topic="mqttHelpData.subscribe_topic"
      :write_response_topic="mqttHelpData.write_response_topic"
      :status_topic="mqttHelpData.status_topic"
      :online_payload="mqttHelpData.online_payload"
      :offline_payload="mqttHelpData.offline_payload"
    />

    <OpcuaHelpDialog
      v-model="opcuaHelpVisible"
      :port="opcuaHelpData.port"
      :endpoint="opcuaHelpData.endpoint"
    />

    <StatsDialog
      v-model="mqttStatsVisible"
      type="mqtt"
      :item-id="mqttStatsId"
    />

    <StatsDialog
      v-model="opcuaStatsVisible"
      type="opcua"
      :item-id="opcuaStatsId"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { IconPlus, IconCloud, IconUpload, IconSwap, IconStorage } from '@arco-design/web-vue/es/icon'
import { showMessage } from '@/composables/useGlobalState'
import request from '@/utils/request'

import NorthboundMqtt from '@/components/northbound/NorthboundMqtt.vue'
import NorthboundHttp from '@/components/northbound/NorthboundHttp.vue'
import NorthboundOpcua from '@/components/northbound/NorthboundOpcua.vue'
import NorthboundSparkplug from '@/components/northbound/NorthboundSparkplug.vue'
import MqttSettingsDialog from '@/components/northbound/MqttSettingsDialog.vue'
import HttpSettingsDialog from '@/components/northbound/HttpSettingsDialog.vue'
import OpcuaSettingsDialog from '@/components/northbound/OpcuaSettingsDialog.vue'
import SparkplugSettingsDialog from '@/components/northbound/SparkplugSettingsDialog.vue'
import MqttHelpDialog from '@/components/northbound/MqttHelpDialog.vue'
import OpcuaHelpDialog from '@/components/northbound/OpcuaHelpDialog.vue'
import StatsDialog from '@/components/northbound/StatsDialog.vue'

const loading = ref(false)
const config = ref({ mqtt: [], http: [], opcua: [], sparkplug_b: [], status: {} })
const allDevices = ref([])

const hasNoChannels = computed(() => {
  const c = config.value
  return (!c.mqtt || c.mqtt.length === 0) &&
    (!c.http || c.http.length === 0) &&
    (!c.opcua || c.opcua.length === 0) &&
    (!c.sparkplug_b || c.sparkplug_b.length === 0)
})

const addDialogVisible = ref(false)

const mqttDialogVisible = ref(false)
const httpDialogVisible = ref(false)
const opcuaDialogVisible = ref(false)
const sparkplugDialogVisible = ref(false)

const mqttEditConfig = ref(null)
const httpEditConfig = ref(null)
const opcuaEditConfig = ref(null)
const sparkplugEditConfig = ref(null)

const mqttHelpVisible = ref(false)
const mqttHelpData = ref({ topic: '', subscribe_topic: '', write_response_topic: '', status_topic: '', online_payload: '', offline_payload: '' })

const opcuaHelpVisible = ref(false)
const opcuaHelpData = ref({ port: 4840, endpoint: '' })

const mqttStatsVisible = ref(false)
const mqttStatsId = ref('')

const opcuaStatsVisible = ref(false)
const opcuaStatsId = ref('')

const fetchConfig = async () => {
  loading.value = true
  try {
    const data = await request.get('/api/northbound/config')
    config.value = {
      mqtt: data.mqtt || [],
      http: data.http || [],
      opcua: data.opcua || [],
      sparkplug_b: data.sparkplug_b || [],
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
    const channels = await request.get('/api/channels')
    const devices = []
    for (const ch of channels) {
      const devs = await request.get(`/api/channels/${ch.id}/devices`)
      devs.forEach(d => { d.channelName = ch.name; devices.push(d) })
    }
    allDevices.value = devices
  } catch (e) {
    console.error('Failed to fetch devices', e)
  }
}

const addProtocol = (type) => {
  addDialogVisible.value = false
  if (type === 'mqtt') openMqttSettings(null)
  else if (type === 'http') openHttpSettings(null)
  else if (type === 'sparkplug_b') openSparkplugBSettings(null)
  else if (type === 'opcua') openOpcuaSettings(null)
}

const openMqttSettings = async (item) => {
  await fetchAllDevices()
  mqttEditConfig.value = item ? JSON.parse(JSON.stringify(item)) : null
  mqttDialogVisible.value = true
}

const openHttpSettings = async (item) => {
  await fetchAllDevices()
  httpEditConfig.value = item ? JSON.parse(JSON.stringify(item)) : null
  httpDialogVisible.value = true
}

const openOpcuaSettings = async (item) => {
  await fetchAllDevices()
  opcuaEditConfig.value = item ? JSON.parse(JSON.stringify(item)) : null
  opcuaDialogVisible.value = true
}

const openSparkplugBSettings = async (item) => {
  await fetchAllDevices()
  sparkplugEditConfig.value = item ? JSON.parse(JSON.stringify(item)) : null
  sparkplugDialogVisible.value = true
}

const openMqttHelp = (item) => {
  mqttHelpData.value = {
    topic: item.topic || '',
    subscribe_topic: item.subscribe_topic || '',
    write_response_topic: item.write_response_topic || '',
    status_topic: item.status_topic || '',
    online_payload: item.online_payload || '',
    offline_payload: item.offline_payload || ''
  }
  mqttHelpVisible.value = true
}

const openOpcuaHelp = (item) => {
  opcuaHelpData.value = { port: item.port || 4840, endpoint: item.endpoint || '' }
  opcuaHelpVisible.value = true
}

const openMqttStats = (item) => {
  mqttStatsId.value = item.id
  mqttStatsVisible.value = true
}

const openOpcuaStats = (item) => {
  opcuaStatsId.value = item.id
  opcuaStatsVisible.value = true
}

const deleteProtocol = async (type, id) => {
  if (!confirm('确定要删除该配置吗？')) return
  try {
    await request.delete(`/api/northbound/${type}/${id}`)
    showMessage('删除成功', 'success')
    fetchConfig()
  } catch (e) {
    showMessage('删除失败: ' + e.message, 'error')
  }
}

onMounted(fetchConfig)
</script>

<style scoped>
.northbound-container {
  padding: 24px;
  min-height: calc(100vh - 56px);
  background: #f1f5f9;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.channels-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.channel-item {
  width: 100%;
  max-width: 100%;
}
</style>
