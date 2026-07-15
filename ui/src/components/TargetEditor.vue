<template>
  <a-card class="target-editor-card" :bordered="true">
    <a-row :gutter="12">
      <a-col :span="24" :md="6">
        <a-form-item label="通道">
          <a-select
            v-model="localTarget.channel_id"
            :options="channels"
            placeholder="选择通道"
            class="rect-input"
            @change="onChannelChange"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24" :md="6">
        <a-form-item label="设备">
          <a-select
            v-model="localTarget.device_id"
            :options="deviceList"
            placeholder="选择设备"
            class="rect-input"
            :disabled="!localTarget.channel_id"
            @change="onDeviceChange"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24" :md="6">
        <a-form-item label="点位(仅可写类型)">
          <a-select
            v-model="localTarget.point_id"
            :options="pointList"
            placeholder="选择点位"
            class="rect-input"
            :disabled="!localTarget.device_id"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24" :md="6">
        <a-form-item label="写入值">
          <a-input
            v-model="localTarget.value"
            placeholder="固定值或表达式"
            class="rect-input"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import request from '@/utils/request'
import {
  normalizeDeviceOptions,
  fetchWritablePointOptions
} from '@/utils/southboundPointOptions'

const props = defineProps({
  target: {
    type: Object,
    required: true
  },
  channels: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:target'])

const localTarget = ref(props.target || {})
const deviceList = ref([])
const pointList = ref([])
const loadedChannelId = ref('')
const pointLoadToken = ref(0)

watch(() => props.target, (val) => {
  if (val === localTarget.value) return

  localTarget.value = val || {}

  if (localTarget.value?.channel_id) {
    loadDevices()
  }
}, { immediate: true })

watch(localTarget, (val) => {
  emit('update:target', val)
}, { deep: true })

const onChannelChange = async () => {
  localTarget.value.device_id = ''
  localTarget.value.point_id = ''
  deviceList.value = []
  pointList.value = []
  loadedChannelId.value = ''

  if (!localTarget.value.channel_id) return

  const data = await request.get(`/api/channels/${encodeURIComponent(localTarget.value.channel_id)}/devices`)
  deviceList.value = normalizeDeviceOptions(data)
  loadedChannelId.value = localTarget.value.channel_id
}

const loadPointsForDevice = async () => {
  const channelId = localTarget.value.channel_id
  const deviceId = localTarget.value.device_id

  if (!channelId || !deviceId) {
    pointList.value = []
    return
  }

  const token = ++pointLoadToken.value
  const dev = deviceList.value.find((d) => String(d.value) === String(deviceId))
  const embeddedPoints = dev?.raw?.points

  const options = await fetchWritablePointOptions(
    request,
    channelId,
    deviceId,
    embeddedPoints
  )

  if (token !== pointLoadToken.value) return
  if (String(channelId) !== String(loadedChannelId.value)) return
  if (String(deviceId) !== String(localTarget.value.device_id)) return

  pointList.value = options
}

const onDeviceChange = async () => {
  localTarget.value.point_id = ''
  pointList.value = []

  if (!localTarget.value.device_id) return

  if (deviceList.value.length === 0 && localTarget.value.channel_id) {
    await loadDevices()
    return
  }

  await loadPointsForDevice()
}

const loadDevices = async () => {
  const channelId = localTarget.value?.channel_id

  if (!channelId) {
    loadedChannelId.value = ''
    deviceList.value = []
    pointList.value = []
    return
  }

  const channelChanged = loadedChannelId.value !== channelId

  if (channelChanged || deviceList.value.length === 0) {
    const data = await request.get(`/api/channels/${encodeURIComponent(channelId)}/devices`)
    deviceList.value = normalizeDeviceOptions(data)
    loadedChannelId.value = channelId
  }

  if (localTarget.value.device_id) {
    await loadPointsForDevice()
  } else {
    pointList.value = []
  }
}
</script>

<style scoped>
/* v3.0 — styles in src/styles/ */
</style>
