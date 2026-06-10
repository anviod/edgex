import request from '../utils/request'

// 节点管理相关API
export const NodeApi = {
  // 获取节点状态
  getStatus() {
    return request({
      url: '/api/node/status',
      method: 'get'
    })
  },

  // 启动节点
  startNode() {
    return request({
      url: '/api/node/start',
      method: 'post'
    })
  },

  // 停止节点
  stopNode() {
    return request({
      url: '/api/node/stop',
      method: 'post'
    })
  },

  // 获取节点信息
  getNodeInfo() {
    return request({
      url: '/api/node/info',
      method: 'get'
    })
  },

  // 获取已发现的节点列表
  getDiscoveredNodes() {
    return request({
      url: '/api/node/discover',
      method: 'get'
    })
  },

  // 连接到节点
  connectNode(peerId) {
    return request({
      url: `/api/node/connect/${peerId}`,
      method: 'post'
    })
  },

  // 断开节点连接
  disconnectNode(peerId) {
    return request({
      url: `/api/node/disconnect/${peerId}`,
      method: 'post'
    })
  },

  // 启用/禁用自动发现
  toggleDiscovery(enabled) {
    return request({
      url: `/api/node/discovery/${enabled ? 'enable' : 'disable'}`,
      method: 'post'
    })
  }
}

// 群组管理相关API
export const GroupApi = {
  // 获取群组列表
  getGroups() {
    return request({
      url: '/api/groups',
      method: 'get'
    })
  },

  // 创建群组
  createGroup(data) {
    return request({
      url: '/api/groups',
      method: 'post',
      data
    })
  },

  // 获取群组详情
  getGroupDetail(groupId) {
    return request({
      url: `/api/groups/${groupId}`,
      method: 'get'
    })
  },

  // 加入群组
  joinGroup(groupId) {
    return request({
      url: `/api/groups/${groupId}/join`,
      method: 'post'
    })
  },

  // 退出群组
  leaveGroup(groupId) {
    return request({
      url: `/api/groups/${groupId}/leave`,
      method: 'post'
    })
  },

  // 删除群组（仅创建者）
  deleteGroup(groupId) {
    return request({
      url: `/api/groups/${groupId}`,
      method: 'delete'
    })
  },

  // 获取已加入的群组
  getJoinedGroups() {
    return request({
      url: '/api/groups/joined',
      method: 'get'
    })
  },

  // 添加成员到群组
  addMemberToGroup(groupId, peerId) {
    return request({
      url: `/api/groups/${groupId}/members`,
      method: 'post',
      data: { peerId }
    })
  }
}

// 同步管理相关API
export const SyncApi = {
  // 推送配置到群组
  pushConfig(groupIds, options = {}) {
    return request({
      url: '/api/sync/push',
      method: 'post',
      data: { groupIds, ...options }
    })
  },

  // 从群组拉取配置
  pullConfig(groupIds, options = {}) {
    return request({
      url: '/api/sync/pull',
      method: 'post',
      data: { groupIds, ...options }
    })
  },

  // 从指定远程节点拉取配置
  pullFromNode(nodeId, options = {}) {
    return request({
      url: `/api/sync/node/${nodeId}/pull`,
      method: 'post',
      data: options
    })
  },

  // 清除远程节点配置
  clearRemoteConfig(nodeId) {
    return request({
      url: `/api/sync/node/${nodeId}/clear`,
      method: 'post'
    })
  },

  // 同步还原远程节点配置
  restoreRemoteConfig(nodeId, snapshotId = '') {
    return request({
      url: `/api/sync/node/${nodeId}/restore`,
      method: 'post',
      data: snapshotId ? { snapshot_id: snapshotId } : {}
    })
  },

  // 获取远程节点快照列表
  getRemoteSnapshots(nodeId) {
    return request({
      url: `/api/sync/node/${nodeId}/snapshots`,
      method: 'get'
    })
  },

  // 获取同步状态
  getSyncStatus() {
    return request({
      url: '/api/sync/status',
      method: 'get'
    })
  },

  // 获取同步历史记录
  getSyncHistory() {
    return request({
      url: '/api/sync/history',
      method: 'get'
    })
  },

  // 取消正在进行的同步
  cancelSync() {
    return request({
      url: '/api/sync/cancel',
      method: 'post'
    })
  },

  getNodeTree(nodeId) {
    return request({
      url: `/api/sync/node/${nodeId}/tree`,
      method: 'get'
    })
  },

  getNodeDevices(nodeId, channelId = '') {
    return request({
      url: `/api/sync/node/${nodeId}/devices`,
      method: 'get',
      params: channelId ? { channel_id: channelId } : {}
    })
  },

  getNodePoints(nodeId, channelId, deviceId) {
    return request({
      url: `/api/sync/node/${nodeId}/device/${deviceId}/points`,
      method: 'get',
      params: { channel_id: channelId }
    })
  },

  getNodeDiff(sourceNodeId, targetNodeId) {
    return request({
      url: `/api/sync/node/${sourceNodeId}/diff`,
      method: 'get',
      params: targetNodeId ? { target_node_id: targetNodeId } : {}
    })
  },

  startTakeover(nodeId, data) {
    return request({
      url: `/api/sync/node/${nodeId}/takeover`,
      method: 'post',
      data
    })
  },

  getTakeoverEvents(deviceKey = '') {
    return request({
      url: '/api/sync/takeovers',
      method: 'get',
      params: deviceKey ? { device_key: deviceKey } : {}
    })
  }
}

// 网络监控相关API
export const NetworkApi = {
  // 获取网络状态
  getNetworkStatus() {
    return request({
      url: '/api/network/status',
      method: 'get'
    })
  },

  // 获取连接的节点列表
  getConnectedPeers() {
    return request({
      url: '/api/network/peers',
      method: 'get'
    })
  },

  // 获取网络统计信息
  getNetworkStats() {
    return request({
      url: '/api/network/stats',
      method: 'get'
    })
  },

  // 获取通信日志
  getNetworkLogs() {
    return request({
      url: '/api/network/logs',
      method: 'get'
    })
  },

  // 清空日志
  clearLogs() {
    return request({
      url: '/api/network/logs/clear',
      method: 'post'
    })
  }
}

export default {
  NodeApi,
  GroupApi,
  SyncApi,
  NetworkApi
}
