import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useClusterStore = defineStore('cluster', () => {
  const nodes = ref([])
  const syncEnabled = ref(false)
  const syncStatus = ref('stopped')
  const localNodeId = ref('')
  const localNodeAddress = ref('')

  function setNodes(data) {
    nodes.value = data
  }

  function addNode(node) {
    const existing = nodes.value.find(n => n.id === node.id)
    if (!existing) {
      nodes.value.push(node)
    }
  }

  function updateNode(nodeId, updates) {
    const index = nodes.value.findIndex(n => n.id === nodeId)
    if (index !== -1) {
      nodes.value[index] = { ...nodes.value[index], ...updates }
    }
  }

  function removeNode(nodeId) {
    nodes.value = nodes.value.filter(n => n.id !== nodeId)
  }

  function setSyncEnabled(enabled) {
    syncEnabled.value = enabled
  }

  function setSyncStatus(status) {
    syncStatus.value = status
  }

  function setLocalNodeInfo(nodeId, address) {
    localNodeId.value = nodeId
    localNodeAddress.value = address
  }

  return {
    nodes,
    syncEnabled,
    syncStatus,
    localNodeId,
    localNodeAddress,
    setNodes,
    addNode,
    updateNode,
    removeNode,
    setSyncEnabled,
    setSyncStatus,
    setLocalNodeInfo
  }
})