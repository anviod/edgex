import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const selectedConfig = ref(null)
  const configContent = ref(null)
  const diffResult = ref(null)
  const lockedKeys = ref([])
  const syncStatus = ref({ 
    lastSyncTime: null, 
    syncing: false, 
    pendingChanges: 0 
  })
  
  // 文件路径映射（物理层）
  const filePaths = ref({})
  
  // 视图模式
  const viewMode = ref('structured')
  
  // 当前选中节点
  const currentNodeId = ref('')

  function selectConfig(config) {
    selectedConfig.value = config
  }

  function setConfigContent(content) {
    configContent.value = content
  }

  function setDiffResult(diff) {
    diffResult.value = diff
  }

  function lockConfig(key) {
    if (!lockedKeys.value.includes(key)) {
      lockedKeys.value.push(key)
    }
  }

  function unlockConfig(key) {
    const index = lockedKeys.value.indexOf(key)
    if (index !== -1) {
      lockedKeys.value.splice(index, 1)
    }
  }

  function isLocked(key) {
    return lockedKeys.value.includes(key)
  }

  function setSyncStatus(status) {
    syncStatus.value = { ...syncStatus.value, ...status }
  }

  // 文件路径管理
  function setFilePath(key, path) {
    filePaths.value[key] = path
  }

  function getFilePath(key) {
    return filePaths.value[key] || ''
  }

  function clearFilePaths() {
    filePaths.value = {}
  }

  // 视图模式切换
  function setViewMode(mode) {
    viewMode.value = mode
  }

  // 节点管理
  function setCurrentNodeId(nodeId) {
    currentNodeId.value = nodeId
  }

  function getCurrentNodeId() {
    return currentNodeId.value
  }

  return {
    selectedConfig,
    configContent,
    diffResult,
    lockedKeys,
    syncStatus,
    filePaths,
    viewMode,
    currentNodeId,
    selectConfig,
    setConfigContent,
    setDiffResult,
    lockConfig,
    unlockConfig,
    isLocked,
    setSyncStatus,
    setFilePath,
    getFilePath,
    clearFilePaths,
    setViewMode,
    setCurrentNodeId,
    getCurrentNodeId
  }
})
