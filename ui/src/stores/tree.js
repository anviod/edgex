import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTreeStore = defineStore('tree', () => {
  // 当前选中的节点ID
  const currentNodeId = ref('')
  
  // 当前选中的配置项
  const selectedItem = ref(null)
  
  // 树结构数据
  const treeData = ref({
    channels: [],
    devices: {},
    points: {}
  })
  
  // 展开状态
  const expandedSections = ref(['channels'])
  const expandedChannelIds = ref([])
  const expandedDeviceIds = ref([])
  const expandedSubSections = ref([])
  
  // 差异状态
  const diffStatus = ref({})
  
  // 加载状态
  const loadingStates = ref({
    devices: '',
    points: ''
  })
  
  // 节点信息缓存
  const nodeInfo = ref(null)

  // 设置当前节点ID
  function setCurrentNodeId(nodeId) {
    currentNodeId.value = nodeId
    // 切换节点时重置展开状态
    resetExpandedState()
  }

  // 获取当前节点ID
  function getCurrentNodeId() {
    return currentNodeId.value
  }

  // 设置节点信息
  function setNodeInfo(info) {
    nodeInfo.value = info
  }

  // 获取节点信息
  function getNodeInfo() {
    return nodeInfo.value
  }

  // 选择配置项
  function selectItem(item) {
    selectedItem.value = item
  }

  // 清除选择
  function clearSelection() {
    selectedItem.value = null
  }

  // 设置树数据
  function setTreeData(data) {
    treeData.value = data
  }

  // 重置展开状态
  function resetExpandedState() {
    expandedSections.value = ['channels']
    expandedChannelIds.value = []
    expandedDeviceIds.value = []
    expandedSubSections.value = []
  }

  // 更新通道数据
  function updateChannels(channels) {
    treeData.value.channels = channels
  }

  // 更新设备数据
  function updateDevices(channelId, devices) {
    treeData.value.devices[channelId] = devices
  }

  // 更新点位数据
  function updatePoints(deviceId, points) {
    treeData.value.points[deviceId] = points
  }

  // 获取通道设备
  function getDevices(channelId) {
    return treeData.value.devices[channelId] || []
  }

  // 获取设备点位
  function getPoints(deviceId) {
    return treeData.value.points[deviceId] || []
  }

  // 切换章节展开状态
  function toggleSection(section) {
    const index = expandedSections.value.indexOf(section)
    if (index === -1) {
      expandedSections.value.push(section)
    } else {
      expandedSections.value.splice(index, 1)
    }
  }

  // 切换通道展开状态
  function toggleChannel(channelId) {
    const index = expandedChannelIds.value.indexOf(channelId)
    if (index === -1) {
      expandedChannelIds.value.push(channelId)
      expandedSubSections.value.push('devices-' + channelId)
    } else {
      expandedChannelIds.value.splice(index, 1)
      const idx = expandedSubSections.value.indexOf('devices-' + channelId)
      if (idx !== -1) expandedSubSections.value.splice(idx, 1)
    }
  }

  // 切换设备展开状态
  function toggleDevice(deviceId) {
    const index = expandedDeviceIds.value.indexOf(deviceId)
    if (index === -1) {
      expandedDeviceIds.value.push(deviceId)
      expandedSubSections.value.push('points-' + deviceId)
    } else {
      expandedDeviceIds.value.splice(index, 1)
      const idx = expandedSubSections.value.indexOf('points-' + deviceId)
      if (idx !== -1) expandedSubSections.value.splice(idx, 1)
    }
  }

  // 设置子章节展开状态
  function setSubSection(key, expanded) {
    const index = expandedSubSections.value.indexOf(key)
    if (expanded && index === -1) {
      expandedSubSections.value.push(key)
    } else if (!expanded && index !== -1) {
      expandedSubSections.value.splice(index, 1)
    }
  }

  // 设置差异状态
  function setDiffStatus(key, hasDiff) {
    diffStatus.value[key] = hasDiff
  }

  // 获取差异状态
  function getDiffStatus(key) {
    return diffStatus.value[key] || false
  }

  // 设置加载状态
  function setLoadingState(type, id) {
    loadingStates.value[type] = id
  }

  // 清除加载状态
  function clearLoadingState(type) {
    loadingStates.value[type] = ''
  }

  // 是否正在加载
  function isLoading(type, id) {
    return loadingStates.value[type] === id
  }

  // 重置所有状态
  function resetState() {
    currentNodeId.value = ''
    selectedItem.value = null
    expandedChannelIds.value = []
    expandedDeviceIds.value = []
    expandedSubSections.value = []
    diffStatus.value = {}
    loadingStates.value = { devices: '', points: '' }
  }

  // 当前选中项类型
  const selectedType = computed(() => selectedItem.value?.type || '')

  // 当前选中的通道
  const selectedChannel = computed(() => {
    if (selectedItem.value?.type === 'channel') {
      return selectedItem.value.channel
    }
    if (selectedItem.value?.channel) {
      return selectedItem.value.channel
    }
    return null
  })

  // 当前选中的设备
  const selectedDevice = computed(() => {
    if (selectedItem.value?.type === 'device') {
      return selectedItem.value.device
    }
    if (selectedItem.value?.device) {
      return selectedItem.value.device
    }
    return null
  })

  // 当前选中的点位
  const selectedPoint = computed(() => {
    if (selectedItem.value?.type === 'point') {
      return selectedItem.value.point
    }
    return null
  })

  return {
    // 状态
    currentNodeId,
    selectedItem,
    treeData,
    expandedSections,
    expandedChannelIds,
    expandedDeviceIds,
    expandedSubSections,
    diffStatus,
    loadingStates,
    nodeInfo,
    
    // 计算属性
    selectedType,
    selectedChannel,
    selectedDevice,
    selectedPoint,
    
    // 方法
    setCurrentNodeId,
    getCurrentNodeId,
    setNodeInfo,
    getNodeInfo,
    selectItem,
    clearSelection,
    setTreeData,
    resetExpandedState,
    updateChannels,
    updateDevices,
    updatePoints,
    getDevices,
    getPoints,
    toggleSection,
    toggleChannel,
    toggleDevice,
    setSubSection,
    setDiffStatus,
    getDiffStatus,
    setLoadingState,
    clearLoadingState,
    isLoading,
    resetState
  }
})