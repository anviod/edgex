import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNodeStore = defineStore('node', () => {
  const currentNode = ref(null)
  const nodeTree = ref(null)
  const nodeStats = ref({
    cpu: 0,
    memory: 0,
    deviceCount: 0,
    channelCount: 0,
    pointCount: 0
  })

  function setCurrentNode(node) {
    currentNode.value = node
  }

  function setNodeTree(tree) {
    nodeTree.value = tree
  }

  function setNodeStats(stats) {
    nodeStats.value = stats
  }

  const channels = computed(() => {
    return nodeTree.value?.channels || []
  })

  const northbound = computed(() => {
    return nodeTree.value?.northbound || []
  })

  const system = computed(() => {
    return nodeTree.value?.system || []
  })

  function getChannelById(channelId) {
    return channels.value.find(c => c.id === channelId)
  }

  function getDeviceById(channelId, deviceId) {
    const channel = getChannelById(channelId)
    return channel?.devices?.find(d => d.id === deviceId)
  }

  function getPointById(channelId, deviceId, pointId) {
    const device = getDeviceById(channelId, deviceId)
    return device?.points?.find(p => p.id === pointId)
  }

  return {
    currentNode,
    nodeTree,
    nodeStats,
    channels,
    northbound,
    system,
    setCurrentNode,
    setNodeTree,
    setNodeStats,
    getChannelById,
    getDeviceById,
    getPointById
  }
})