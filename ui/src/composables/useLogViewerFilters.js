import { ref, watch } from 'vue'
import request from '@/utils/request'
import { createDefaultLogViewerFilters } from '@/utils/logFormat'

export function useLogViewerFilters() {
  const filters = ref(createDefaultLogViewerFilters())
  const channelOptions = ref([])
  const deviceOptions = ref([])
  const channelNameMap = ref({})
  const deviceNameMap = ref({})
  const loadingChannels = ref(false)
  const loadingDevices = ref(false)

  const loadChannels = async () => {
    loadingChannels.value = true
    try {
      const res = await request({ url: '/api/channels', method: 'get' })
      const raw = Array.isArray(res) ? res : (res?.data || [])
      channelOptions.value = raw.map((item) => ({
        label: item.name || item.id,
        value: item.id,
      }))
      channelNameMap.value = Object.fromEntries(
        raw.map((item) => [item.id, item.name || item.id])
      )
    } finally {
      loadingChannels.value = false
    }
  }

  const loadDevices = async (channelId) => {
    if (!channelId) {
      deviceOptions.value = []
      deviceNameMap.value = {}
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
      deviceNameMap.value = Object.fromEntries(
        raw.map((item) => [item.id, item.name || item.id])
      )
    } finally {
      loadingDevices.value = false
    }
  }

  watch(
    () => filters.value.channelId,
    (channelId, previous) => {
      if (channelId !== previous) {
        filters.value.deviceId = ''
      }
      loadDevices(channelId)
    }
  )

  const resetFilters = () => {
    filters.value = createDefaultLogViewerFilters()
    deviceOptions.value = []
    deviceNameMap.value = {}
  }

  return {
    filters,
    channelOptions,
    deviceOptions,
    channelNameMap,
    deviceNameMap,
    loadingChannels,
    loadingDevices,
    loadChannels,
    loadDevices,
    resetFilters,
  }
}
