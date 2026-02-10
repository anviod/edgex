<template>
  <v-row density="compact" class="align-center">
    <v-col cols="12" md="3">
      <v-select
        v-model="target.channel_id"
        :items="channels"
        item-title="name"
        item-value="id"
        label="通道"
        density="compact"
        variant="outlined"
        hide-details
        @update:model-value="onChannelChange"
      ></v-select>
    </v-col>
    <v-col cols="12" md="3">
      <v-select
        v-model="target.device_id"
        :items="deviceList"
        item-title="name"
        item-value="id"
        label="设备"
        density="compact"
        variant="outlined"
        hide-details
        @update:model-value="onDeviceChange"
      ></v-select>
    </v-col>
    <v-col cols="12" md="3">
      <v-combobox
        v-model="target.point_id"
        :items="pointList"
        item-title="name"
        item-value="id"
        label="点位"
        density="compact"
        variant="outlined"
        hide-details
      ></v-combobox>
    </v-col>
    <v-col cols="12" md="3">
       <v-text-field
         v-model="target.value"
         label="值/模板"
         placeholder="1 或 ${v}"
         density="compact"
         variant="outlined"
         hide-details
       ></v-text-field>
    </v-col>
     <v-col cols="12" md="12" class="mt-2">
       <v-text-field
         v-model="target.expression"
         label="计算表达式 (Expression)"
         placeholder="e.g. v | 1 (置位)"
         density="compact"
         variant="outlined"
         hide-details
       ></v-text-field>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import request from '@/utils/request'

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

const deviceList = ref([])
const pointList = ref([])

const onChannelChange = async () => {
    props.target.device_id = ''
    props.target.point_id = ''
    deviceList.value = []
    pointList.value = []
    if (props.target.channel_id) {
        const data = await request.get(`/api/channels/${props.target.channel_id}/devices`)
        deviceList.value = data || []
    }
}

const onDeviceChange = () => {
    props.target.point_id = ''
    pointList.value = []
    if (props.target.device_id && deviceList.value.length > 0) {
        const dev = deviceList.value.find(d => d.id === props.target.device_id)
        if (dev && dev.points) {
            pointList.value = dev.points.filter(p => p.readwrite !== 'R')
        }
    }
}

const loadDevices = async () => {
    if (props.target.channel_id && deviceList.value.length === 0) {
        const data = await request.get(`/api/channels/${props.target.channel_id}/devices`)
        deviceList.value = data || []
        if (props.target.device_id) {
            onDeviceChange()
        }
    }
}

onMounted(() => {
    loadDevices()
})
</script>