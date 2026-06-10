<template>
  <div class="sync-control-container">
    <!-- 顶部状态栏 -->
    <header class="sync-header">
      <div class="header-left">
        <div class="header-title-section">
          <h1 class="header-title">节点同步管理</h1>
          <p class="header-subtitle">管理边缘节点配置同步与网络通信</p>
        </div>
        <div class="local-node-info" v-if="localNodeInfo">
          <div class="node-info-item">
            <span class="info-label">节点 ID</span>
            <span class="info-value monospace">{{ localNodeInfo.nodeId || 'N/A' }}</span>
          </div>
          <div class="node-info-item">
            <span class="info-label">网络地址</span>
            <span class="info-value monospace">{{ localNodeInfo.address || 'N/A' }}</span>
          </div>
        </div>
      </div>
      <div class="header-right">
        <a-space size="middle">
          <a-tooltip :content="localNodeStatus === 'running' ? '节点运行中' : '节点已停止'" placement="bottom">
            <div class="status-indicator" :class="localNodeStatus === 'running' ? 'status-online' : 'status-offline'">
              <span class="status-dot"></span>
            </div>
          </a-tooltip>
          <a-button 
            type="primary" 
            :loading="isStarting"
            @click="toggleNode"
            :class="localNodeStatus === 'running' ? 'btn-stop' : 'btn-start'"
          >
            <template #icon>
              <svg v-if="localNodeStatus !== 'running'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
            </template>
            {{ localNodeStatus === 'running' ? '停止节点' : '启动节点' }}
          </a-button>
        </a-space>
      </div>
    </header>

    <div class="sync-layout">
      <!-- 左侧面板：节点列表 -->
      <aside class="left-panel">
        <!-- 网络发现区域 -->
        <a-card class="discovery-card" :bordered="false">
          <template #title>
            <div class="card-title-flex">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 15s1.5-2 4-2 4 2 4 2"/>
                <circle cx="12" cy="9" r="3"/>
              </svg>
              <span>网络发现</span>
            </div>
          </template>
          <div class="discovery-content">
            <div class="discovery-toggle">
              <span class="toggle-label">自动发现</span>
              <a-switch v-model="discoveryEnabled" @change="toggleDiscovery" :disabled="localNodeStatus !== 'running'" />
            </div>
            <div class="discovery-status">
              <div class="status-line">
                <span class="label">发现状态:</span>
                <span class="value" :class="discoveryStatus === 'scanning' ? 'status-scanning' : 'status-idle'">
                  {{ discoveryStatus === 'scanning' ? '扫描中...' : '已就绪' }}
                </span>
              </div>
              <div class="status-line">
                <span class="label">已发现节点:</span>
                <span class="value value-highlight">{{ discoveredNodes.length }}</span>
              </div>
            </div>
          </div>
        </a-card>

        <!-- 发现的节点列表 -->
        <a-card class="discovered-nodes-card" :bordered="false">
          <template #title>
            <div class="card-title-flex">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="20" x2="12" y2="10"/>
                <line x1="18" y1="20" x2="18" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="16"/>
              </svg>
              <span>发现的节点</span>
            </div>
          </template>
          <div v-if="discoveredNodes.length > 0" class="discovered-nodes-list">
            <div 
              v-for="node in discoveredNodes" 
              :key="node.peerId" 
              class="discovered-node-item"
              :class="{ 'node-connected': node.connected }"
            >
              <div class="node-indicator" :class="node.connected ? 'indicator-connected' : 'indicator-discovered'"></div>
              <div class="node-info">
                <div class="node-name">{{ node.name }}</div>
                <div class="node-meta">
                  <span class="meta-label">地址:</span>
                  <span class="meta-value mono">{{ node.address }}</span>
                </div>
              </div>
              <div class="node-actions">
                <a-button 
                  v-if="!node.connected" 
                  type="primary" 
                  size="small" 
                  @click="connectToDiscoveredNode(node)"
                  :disabled="localNodeStatus !== 'running'"
                >
                  连接
                </a-button>
                <a-tag v-else color="green" size="small">已连接</a-tag>
              </div>
            </div>
          </div>
          <a-empty v-else description="暂无发现节点" />
        </a-card>
      </aside>

      <!-- 主内容区 -->
      <main class="main-content">
        <a-tabs default-active-key="sync" class="main-tabs-inner">
          <!-- 同步控制 -->
          <a-tab-pane key="sync" tab="同步控制">
            <!-- 远程节点同步还原 -->
            <div class="remote-sync-section">
              <a-card class="remote-sync-card" :bordered="false">
                <template #title>
                  <div class="card-title-flex">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 20V10"/>
                      <path d="M18 20V4"/>
                      <path d="M6 20v-6"/>
                    </svg>
                    <span>远程节点同步还原</span>
                  </div>
                </template>
                
                <div class="remote-sync-content">
                  <!-- 目标节点选择 -->
                  <div class="remote-target-section">
                    <label class="section-label">目标节点</label>
                    <a-input 
                      v-model="remoteTargetNode" 
                      placeholder="输入远程节点IP或节点ID"
                      class="target-input"
                    />
                    <a-button 
                      type="primary" 
                      size="small" 
                      @click="selectRemoteNode"
                      :disabled="!remoteTargetNode"
                    >
                      选择节点
                    </a-button>
                  </div>

                  <!-- 远程节点信息 -->
                  <div v-if="selectedRemoteNode" class="remote-node-info">
                    <div class="info-row">
                      <span class="info-label">节点名称:</span>
                      <span class="info-value">{{ selectedRemoteNode.name }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">节点地址:</span>
                      <span class="info-value monospace">{{ selectedRemoteNode.address }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">同步状态:</span>
                      <a-tag :color="remoteSyncStatus === 'synced' ? 'green' : remoteSyncStatus === 'syncing' ? 'blue' : 'orange'">
                        {{ remoteSyncStatus === 'synced' ? '已同步' : remoteSyncStatus === 'syncing' ? '同步中' : '待同步' }}
                      </a-tag>
                    </div>
                  </div>

                  <!-- 操作按钮组 -->
                  <div class="remote-actions">
                    <a-button 
                      type="primary" 
                      :loading="remoteSyncing"
                      @click="pullRemoteConfig"
                      :disabled="!selectedRemoteNode || remoteSyncing"
                    >
                      <template #icon>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      </template>
                      拉取配置
                    </a-button>
                    
                    <a-button 
                      :loading="remoteSyncing"
                      @click="clearRemoteNodeConfig"
                      :disabled="!selectedRemoteNode || remoteSyncing"
                      danger
                    >
                      <template #icon>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M3 6h18"/>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                      </template>
                      清除远程配置
                    </a-button>
                    
                    <a-button 
                      type="primary" 
                      :loading="remoteSyncing"
                      @click="restoreRemoteConfig"
                      :disabled="!selectedRemoteNode || remoteSyncing"
                    >
                      <template #icon>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8"/>
                          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7"/>
                          <path d="M3 12l9 9 9-9"/>
                        </svg>
                      </template>
                      同步还原
                    </a-button>
                  </div>

                  <!-- 快照列表 -->
                  <div v-if="remoteSnapshots.length > 0" class="snapshot-section">
                    <label class="section-label">可用快照</label>
                    <div class="snapshot-list">
                      <div 
                        v-for="snapshot in remoteSnapshots" 
                        :key="snapshot.id" 
                        class="snapshot-item"
                        :class="{ 'snapshot-selected': selectedSnapshotId === snapshot.id }"
                        @click="selectSnapshot(snapshot.id)"
                      >
                        <div class="snapshot-info">
                          <div class="snapshot-name">{{ snapshot.name }}</div>
                          <div class="snapshot-time">{{ snapshot.timestamp }}</div>
                        </div>
                        <div class="snapshot-size">{{ snapshot.size }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </a-card>
            </div>
            <div class="sync-panel">
              <div class="sync-header-section">
                <div class="sync-title">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                  </svg>
                  <span>配置同步</span>
                </div>
              </div>

              <!-- 同步模式选择 -->
              <a-card class="sync-modes-card" :bordered="false">
                <div class="sync-modes">
                  <div class="sync-mode-card" @click="selectSyncMode('push')">
                    <div class="mode-icon push-icon">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </div>
                    <div class="mode-info">
                      <div class="mode-title">主动推送</div>
                      <div class="mode-desc">将本机配置推送到所有已连接节点</div>
                    </div>
                    <a-radio v-model="syncMode" value="push" />
                  </div>
                  <div class="sync-mode-card" @click="selectSyncMode('pull')">
                    <div class="mode-icon pull-icon">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </div>
                    <div class="mode-info">
                      <div class="mode-title">主动拉取</div>
                      <div class="mode-desc">从已连接节点拉取最新配置</div>
                    </div>
                    <a-radio v-model="syncMode" value="pull" />
                  </div>
                </div>
              </a-card>

              <!-- 同步选项 -->
              <a-card class="sync-options-card" :bordered="false">
                <template #title>同步选项</template>
                <div class="sync-options">
                  <a-form :model="syncOptions" layout="horizontal">
                    <a-form-item field="syncAll" label="同步全部配置">
                      <a-switch v-model="syncOptions.syncAll" />
                    </a-form-item>
                    <a-form-item field="forceOverwrite" label="强制覆盖目标配置">
                      <a-switch v-model="syncOptions.forceOverwrite" />
                    </a-form-item>
                  </a-form>
                </div>
              </a-card>

              <!-- 同步按钮 -->
              <div class="sync-action">
                <a-button 
                  type="primary" 
                  size="large" 
                  :loading="syncing"
                  :disabled="connectedPeers.length === 0 || localNodeStatus !== 'running'"
                  @click="executeSync"
                >
                  <template #icon>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                    </svg>
                  </template>
                  {{ syncMode === 'push' ? '推送配置' : '拉取配置' }}
                </a-button>
              </div>

              <!-- 同步历史 -->
              <a-card v-if="syncHistory.length > 0" class="sync-history-card" :bordered="false">
                <template #title>同步历史</template>
                <a-timeline>
                  <a-timeline-item 
                    v-for="(record, index) in syncHistory" 
                    :key="index"
                    :color="record.status === 'success' ? 'green' : 'red'"
                  >
                    <div class="timeline-content">
                      <div class="timeline-title">{{ record.mode === 'push' ? '推送同步' : '拉取同步' }}</div>
                      <div class="timeline-status" :class="record.status">
                        {{ record.status === 'success' ? '成功' : '失败' }}
                      </div>
                      <div class="timeline-time">{{ record.time }}</div>
                    </div>
                  </a-timeline-item>
                </a-timeline>
              </a-card>
            </div>
          </a-tab-pane>

          <!-- 网络状态 -->
          <a-tab-pane key="network" tab="网络状态">
            <div class="network-panel">
              <div class="network-header">
                <div class="network-title">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>网络通信状态</span>
                </div>
              </div>

              <!-- 网络指标卡片 -->
              <div class="network-metrics">
                <a-card class="metric-card">
                  <template #title>
                    <span class="metric-icon">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="20" x2="12" y2="10"/>
                        <line x1="18" y1="20" x2="18" y2="4"/>
                        <line x1="6" y1="20" x2="6" y2="16"/>
                      </svg>
                    </span>
                    <span>已连接节点</span>
                  </template>
                  <a-statistic :value="connectedPeers.length" suffix="个" />
                </a-card>
                <a-card class="metric-card">
                  <template #title>
                    <span class="metric-icon">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <circle cx="12" cy="12" r="6"/>
                        <circle cx="12" cy="12" r="2"/>
                      </svg>
                    </span>
                    <span>平均延迟</span>
                  </template>
                  <a-statistic :value="networkStats.latency" suffix="ms" />
                </a-card>
              </div>

              <!-- 连接状态列表 -->
              <a-card class="connections-card" :bordered="false">
                <template #title>连接状态</template>
                <div v-if="connectedPeers.length > 0" class="connections-list">
                  <div v-for="peer in connectedPeers" :key="peer.peerId" class="connection-item">
                    <div class="connection-indicator" :class="peer.status"></div>
                    <div class="connection-info">
                      <div class="connection-name">{{ peer.name }}</div>
                      <div class="connection-peer-id">{{ truncatePeerId(peer.peerId) }}</div>
                    </div>
                    <div class="connection-metrics">
                      <div class="metric-row">
                        <span class="metric-label">延迟</span>
                        <span class="metric-value">{{ peer.latency }}ms</span>
                      </div>
                    </div>
                    <a-button type="text" size="small" @click="disconnectPeer(peer)" :disabled="localNodeStatus !== 'running'">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </a-button>
                  </div>
                </div>
                <a-empty v-else description="暂无连接" />
              </a-card>

              <!-- 通信日志 -->
              <a-card class="network-log-card" :bordered="false">
                <template #title>
                  <span>通信日志</span>
                  <a-button type="text" size="small" @click="clearLogs">清空</a-button>
                </template>
                <div class="log-container">
                  <div v-for="(log, index) in networkLogs" :key="index" class="log-item" :class="log.type">
                    <span class="log-time">{{ log.time }}</span>
                    <span class="log-type" :class="log.type.toLowerCase()">{{ log.type }}</span>
                    <span class="log-message">{{ log.message }}</span>
                  </div>
                </div>
              </a-card>
            </div>
          </a-tab-pane>
        </a-tabs>
      </main>
    </div>

    <!-- 同步进度弹窗 -->
    <a-modal 
      v-model:visible="showSyncProgressModal" 
      title="同步进度" 
      :closable="false"
      :footer="false"
    >
      <div class="sync-progress">
        <div class="progress-header">
          <div class="progress-icon" :class="syncProgress.status">
            <svg v-if="syncProgress.status === 'running'" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <svg v-else-if="syncProgress.status === 'success'" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div class="progress-title">{{ syncProgress.title }}</div>
        </div>
        <a-progress :percent="syncProgress.percent" :show-info="false" />
        <div class="progress-info">
          <span>{{ syncProgress.message }}</span>
        </div>
        <div v-if="syncProgress.status === 'failed'" class="progress-error">
          <a-button type="primary" @click="executeSync">重试</a-button>
          <a-button type="outline" @click="showSyncProgressModal = false">关闭</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { showMessage } from '../../composables/useGlobalState'
import { NodeApi, SyncApi, NetworkApi } from '../../api/nodeSync'

const emit = defineEmits(['refresh'])

// 本地节点状态
const localNodeStatus = ref('stopped')
const isStarting = ref(false)

// 本地节点信息
const localNodeInfo = ref(null)

// 网络发现
const discoveryEnabled = ref(false)
const discoveryStatus = ref('idle')

// 发现的节点
const discoveredNodes = ref([])

// 同步相关
const syncMode = ref('push')
const syncing = ref(false)
const syncOptions = ref({
  syncAll: true,
  forceOverwrite: false
})

const syncHistory = ref([])

const syncProgress = ref({
  status: 'running',
  percent: 0,
  title: '',
  message: ''
})

// 网络监控
const connectedPeers = ref([])

const networkStats = ref({
  latency: 0
})

const networkLogs = ref([])

const showSyncProgressModal = ref(false)

// 远程节点同步还原
const remoteTargetNode = ref('192.168.3.230')
const selectedRemoteNode = ref(null)
const remoteSyncStatus = ref('pending')
const remoteSyncing = ref(false)
const remoteSnapshots = ref([])
const selectedSnapshotId = ref('')

// 节点管理方法
async function toggleNode() {
  if (localNodeStatus.value === 'running') {
    try {
      await NodeApi.stopNode()
      localNodeStatus.value = 'stopped'
      discoveryEnabled.value = false
      discoveryStatus.value = 'idle'
      addNetworkLog('INFO', '本地节点已停止')
      showMessage('节点已停止', 'success')
    } catch (error) {
      showMessage('停止节点失败: ' + error.message, 'error')
    }
  } else {
    isStarting.value = true
    try {
      await NodeApi.startNode()
      localNodeStatus.value = 'running'
      discoveryEnabled.value = true
      discoveryStatus.value = 'scanning'
      addNetworkLog('INFO', '本地节点已启动')
      showMessage('节点已启动', 'success')
      refreshDiscoveredNodes()
      refreshConnectedPeers()
    } catch (error) {
      showMessage('启动节点失败: ' + error.message, 'error')
    } finally {
      isStarting.value = false
    }
  }
}

async function toggleDiscovery(enabled) {
  try {
    await NodeApi.toggleDiscovery(enabled)
    discoveryStatus.value = enabled ? 'scanning' : 'idle'
    addNetworkLog(enabled ? 'INFO' : 'WARN', enabled ? 'mDNS 发现已启用' : 'mDNS 发现已禁用')
    showMessage(enabled ? '已启用自动发现' : '已禁用自动发现', 'success')
  } catch (error) {
    discoveryEnabled.value = !enabled
    showMessage('切换发现状态失败: ' + error.message, 'error')
  }
}

async function connectToDiscoveredNode(node) {
  try {
    await NodeApi.connectNode(node.peerId)
    node.connected = true
    addNetworkLog('INFO', `已连接到节点 ${node.name}`)
    showMessage(`已连接到节点 ${node.name}`, 'success')
    refreshConnectedPeers()
    emit('refresh')
  } catch (error) {
    showMessage('连接节点失败: ' + error.message, 'error')
  }
}

async function refreshDiscoveredNodes() {
  try {
    const response = await NodeApi.getDiscoveredNodes()
    const data = response.data !== undefined ? response.data : response
    discoveredNodes.value = data.map(node => ({
      peerId: node.peer_id || node.peerId,
      address: node.address || '',
      name: node.name || extractAddress(node.address),
      connected: node.status === 'online' || false,
      status: node.status || 'offline'
    }))
  } catch (error) {
    console.error('刷新发现节点失败:', error)
  }
}

function extractAddress(addr) {
  if (!addr) return '未知节点'
  const ipMatch = addr.match(/\/ip4\/([\d.]+)/)
  if (ipMatch) return ipMatch[1]
  return '未知节点'
}

// 同步控制方法
function selectSyncMode(mode) {
  syncMode.value = mode
}

async function executeSync() {
  syncing.value = true
  showSyncProgressModal.value = true
  
  const modeText = syncMode.value === 'push' ? '推送' : '拉取'
  syncProgress.value = {
    status: 'running',
    percent: 0,
    title: `${modeText}配置同步`,
    message: `正在${modeText}配置...`
  }
  
  try {
    let progress = 0
    const progressInterval = setInterval(() => {
      progress += Math.random() * 20
      if (progress >= 100) {
        progress = 100
        clearInterval(progressInterval)
      }
      syncProgress.value.percent = Math.floor(progress)
    }, 200)
  
    const options = {
      syncAll: syncOptions.value.syncAll,
      forceOverwrite: syncOptions.value.forceOverwrite
    }
    
    await SyncApi.pushConfig([], options)
    
    clearInterval(progressInterval)
    syncProgress.value.percent = 100
    syncProgress.value.status = 'success'
    syncProgress.value.message = '同步完成'
    
    addNetworkLog('INFO', `${modeText}同步完成`)
    showMessage(`${modeText}同步成功`, 'success')
    
    syncHistory.value.unshift({
      mode: syncMode.value,
      status: 'success',
      time: new Date().toLocaleString()
    })
    
    setTimeout(() => {
      showSyncProgressModal.value = false
      syncing.value = false
    }, 1500)
    
  } catch (error) {
    syncProgress.value.status = 'failed'
    syncProgress.value.message = '同步失败: ' + error.message
    addNetworkLog('ERROR', `${modeText}同步失败: ${error.message}`)
    showMessage(`${modeText}同步失败: ${error.message}`, 'error')
    syncing.value = false
    
    syncHistory.value.unshift({
      mode: syncMode.value,
      status: 'failed',
      time: new Date().toLocaleString()
    })
  }
}

// 网络监控方法
async function refreshConnectedPeers() {
  try {
    const response = await NetworkApi.getConnectedPeers()
    connectedPeers.value = response.data || []
  } catch (error) {
    console.error('刷新连接节点失败:', error)
  }
}

async function disconnectPeer(peer) {
  try {
    await NetworkApi.disconnectNode(peer.peerId)
    connectedPeers.value = connectedPeers.value.filter(p => p.peerId !== peer.peerId)
    addNetworkLog('WARN', `已断开与 ${peer.name} 的连接`)
    showMessage(`已断开与 ${peer.name} 的连接`, 'success')
    emit('refresh')
  } catch (error) {
    showMessage('断开连接失败: ' + error.message, 'error')
  }
}

// 远程节点同步还原方法
async function selectRemoteNode() {
  try {
    const target = remoteTargetNode.value.trim()
    if (!target) {
      showMessage('请输入目标节点IP或ID', 'warning')
      return
    }
    
    selectedRemoteNode.value = {
      name: `远程节点 ${target}`,
      address: target,
      peerId: target,
      status: 'online'
    }
    remoteSyncStatus.value = 'pending'
    
    await loadRemoteSnapshots(target)
    showMessage(`已选择远程节点: ${target}`, 'success')
  } catch (error) {
    showMessage('选择节点失败: ' + error.message, 'error')
  }
}

async function loadRemoteSnapshots(nodeId) {
  try {
    const response = await SyncApi.getRemoteSnapshots(nodeId)
    remoteSnapshots.value = response.data || []
  } catch (error) {
    console.warn('加载快照列表失败:', error)
    remoteSnapshots.value = [
      { id: 'auto', name: '自动选择最新快照', timestamp: '当前时间', size: '自动检测' }
    ]
  }
}

function selectSnapshot(snapshotId) {
  selectedSnapshotId.value = snapshotId
}

async function pullRemoteConfig() {
  if (!selectedRemoteNode.value) {
    showMessage('请先选择目标节点', 'warning')
    return
  }
  
  remoteSyncing.value = true
  remoteSyncStatus.value = 'syncing'
  
  try {
    await SyncApi.pullFromNode(selectedRemoteNode.value.peerId, {
      syncAll: true,
      forceOverwrite: false
    })
    
    remoteSyncStatus.value = 'synced'
    addNetworkLog('INFO', `从远程节点 ${selectedRemoteNode.value.address} 拉取配置完成`)
    showMessage(`成功从 ${selectedRemoteNode.value.address} 拉取配置`, 'success')
    
    syncHistory.value.unshift({
      mode: 'pull',
      status: 'success',
      time: new Date().toLocaleString(),
      target: selectedRemoteNode.value.address
    })
    
    emit('refresh')
  } catch (error) {
    remoteSyncStatus.value = 'pending'
    addNetworkLog('ERROR', `从远程节点 ${selectedRemoteNode.value.address} 拉取配置失败: ${error.message}`)
    showMessage(`拉取配置失败: ${error.message}`, 'error')
  } finally {
    remoteSyncing.value = false
  }
}

async function clearRemoteNodeConfig() {
  if (!selectedRemoteNode.value) {
    showMessage('请先选择目标节点', 'warning')
    return
  }
  
  remoteSyncing.value = true
  
  try {
    await SyncApi.clearRemoteConfig(selectedRemoteNode.value.peerId)
    
    remoteSyncStatus.value = 'pending'
    remoteSnapshots.value = []
    selectedSnapshotId.value = ''
    
    addNetworkLog('WARN', `已清除远程节点 ${selectedRemoteNode.value.address} 的配置`)
    showMessage(`已清除 ${selectedRemoteNode.value.address} 的配置`, 'success')
  } catch (error) {
    addNetworkLog('ERROR', `清除远程节点配置失败: ${error.message}`)
    showMessage(`清除配置失败: ${error.message}`, 'error')
  } finally {
    remoteSyncing.value = false
  }
}

async function restoreRemoteConfig() {
  if (!selectedRemoteNode.value) {
    showMessage('请先选择目标节点', 'warning')
    return
  }
  
  remoteSyncing.value = true
  remoteSyncStatus.value = 'syncing'
  
  try {
    await SyncApi.restoreRemoteConfig(selectedRemoteNode.value.peerId, selectedSnapshotId.value)
    
    remoteSyncStatus.value = 'synced'
    addNetworkLog('INFO', `远程节点 ${selectedRemoteNode.value.address} 同步还原完成`)
    showMessage(`成功还原 ${selectedRemoteNode.value.address} 的配置`, 'success')
    
    syncHistory.value.unshift({
      mode: 'restore',
      status: 'success',
      time: new Date().toLocaleString(),
      target: selectedRemoteNode.value.address
    })
    
    await loadRemoteSnapshots(selectedRemoteNode.value.peerId)
    emit('refresh')
  } catch (error) {
    remoteSyncStatus.value = 'pending'
    addNetworkLog('ERROR', `远程节点 ${selectedRemoteNode.value.address} 同步还原失败: ${error.message}`)
    showMessage(`同步还原失败: ${error.message}`, 'error')
  } finally {
    remoteSyncing.value = false
  }
}

async function clearLogs() {
  try {
    await NetworkApi.clearLogs()
    networkLogs.value = []
    showMessage('日志已清空', 'success')
  } catch (error) {
    showMessage('清空日志失败: ' + error.message, 'error')
  }
}

function addNetworkLog(type, message) {
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
  networkLogs.value.unshift({ time, type, message })
  if (networkLogs.value.length > 100) {
    networkLogs.value.pop()
  }
}

function truncatePeerId(peerId) {
  if (!peerId) return ''
  return peerId.length > 12 ? peerId.substring(0, 6) + '...' + peerId.substring(peerId.length - 6) : peerId
}

// 初始化和清理
let networkUpdateTimer = null

onMounted(() => {
  NodeApi.getStatus().then(response => {
    const data = response.data !== undefined ? response.data : response
    localNodeStatus.value = data.status || 'stopped'
    if (localNodeStatus.value === 'running') {
      discoveryEnabled.value = true
      discoveryStatus.value = 'scanning'
      refreshDiscoveredNodes()
      refreshConnectedPeers()
    }
  }).catch(() => {
    localNodeStatus.value = 'stopped'
  })
  
  NodeApi.getNodeInfo().then(response => {
    const data = response.data !== undefined ? response.data : response
    localNodeInfo.value = data
  }).catch(() => {
    localNodeInfo.value = {
      nodeId: 'node-local-001',
      name: '本地节点',
      address: '192.168.1.100:4001'
    }
  })
  
  networkUpdateTimer = setInterval(() => {
    if (localNodeStatus.value === 'running') {
      networkStats.value.latency = Math.floor(Math.random() * 20 + 5)
      
      connectedPeers.value.forEach(peer => {
        peer.latency = Math.floor(Math.random() * 20 + 5)
      })
    }
  }, 3000)
})

onUnmounted(() => {
  if (networkUpdateTimer) {
    clearInterval(networkUpdateTimer)
  }
})
</script>

<style scoped>
/* 主容器 */
.sync-control-container {
  min-height: calc(100vh - 56px);
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

/* 顶部状态栏 */
.sync-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 32px;
}

.header-title-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 220px;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.header-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.local-node-info {
  display: flex;
  gap: 24px;
}

.node-info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label {
  font-size: 12px;
  color: #94a3b8;
  flex-shrink: 0;
}

.info-value {
  font-size: 13px;
  color: #1e293b;
  font-weight: 500;
}

.info-value.monospace {
  font-family: monospace;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  border-radius: 4px;
  background: #f8fafc;
}

.status-online {
  background: rgba(34, 197, 94, 0.08);
  color: #22c55e;
}

.status-offline {
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-online .status-dot {
  background: #22c55e;
}

.status-offline .status-dot {
  background: #ef4444;
}

/* 布局容器 */
.sync-layout {
  display: flex;
  flex: 1;
}

/* 左侧面板 */
.left-panel {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 20px;
}

.card-title-flex {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 发现卡片 */
.discovery-card {
  background: white;
  border-radius: 8px;
}

.discovery-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px 0;
}

.discovery-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-label {
  font-size: 13px;
  color: #475569;
}

.discovery-status {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-line {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.status-line .label {
  color: #64748b;
}

.status-line .value {
  color: #1e293b;
  font-weight: 500;
}

.status-scanning {
  color: #0ea5e9;
}

.value-highlight {
  color: #0ea5e9;
}

/* 发现节点列表 */
.discovered-nodes-card {
  flex: 1;
  background: white;
  border-radius: 8px;
}

.discovered-nodes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.discovered-node-item {
  display: grid;
  grid-template-columns: 12px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.discovered-node-item:hover {
  background: #f1f5f9;
}

.node-connected {
  background: rgba(34, 197, 94, 0.05);
}

.node-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.indicator-discovered {
  background: #f59e0b;
}

.indicator-connected {
  background: #22c55e;
}

.node-info {
  flex: 1;
  min-width: 0;
}

.node-name {
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
}

.node-meta {
  display: flex;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
}

.meta-label {
  color: #94a3b8;
}

.meta-value.mono {
  font-family: monospace;
}

/* 主内容区 */
.main-content {
  flex: 1;
  background: #f8fafc;
  padding: 0;
}

.main-tabs-inner {
  height: 100%;
  padding: 16px 20px;
}

/* 同步面板 */
.sync-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sync-header-section {
  margin-bottom: 4px;
}

.sync-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

/* 同步模式卡片 */
.sync-modes-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
}

.sync-modes {
  display: flex;
  gap: 16px;
}

.sync-mode-card {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.15s ease;
  min-height: 88px;
}

.sync-mode-card:hover {
  border-color: #e2e8f0;
}

.sync-mode-card .arco-radio {
  margin-left: auto;
}

.mode-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.push-icon {
  background: rgba(14, 165, 233, 0.1);
  color: #0ea5e9;
}

.pull-icon {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.mode-info {
  flex: 1;
}

.mode-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.mode-desc {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

/* 同步选项 */
.sync-options-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.sync-options {
  display: flex;
  gap: 48px;
  align-items: center;
}

.sync-options :deep(.arco-form-item) {
  margin-bottom: 0;
}

.sync-options :deep(.arco-form-item-label) {
  width: 120px;
  flex-shrink: 0;
  text-align: left;
  font-size: 13px;
  color: #475569;
}

.sync-options :deep(.arco-form-item-wrapper-col) {
  flex: 1;
}

/* 同步按钮 */
.sync-action {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

/* 同步历史 */
.sync-history-card {
  background: #f8fafc;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timeline-title {
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
}

.timeline-status {
  font-size: 12px;
  font-weight: 500;
}

.timeline-status.success {
  color: #22c55e;
}

.timeline-status.failed {
  color: #ef4444;
}

.timeline-time {
  font-size: 12px;
  color: #94a3b8;
}

/* 网络面板 */
.network-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.network-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.network-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

/* 网络指标 */
.network-metrics {
  display: flex;
  gap: 16px;
}

.metric-card {
  flex: 1;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  min-width: 160px;
}

.metric-card :deep(.arco-card-body) {
  padding: 16px 20px;
}

.metric-card :deep(.arco-statistic) {
  text-align: center;
}

.metric-icon {
  margin-right: 8px;
}

/* 连接状态 */
.connections-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.connections-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.connection-item {
  display: grid;
  grid-template-columns: 12px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
}

.connection-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.connection-indicator.online {
  background: #22c55e;
}

.connection-indicator.offline {
  background: #ef4444;
}

.connection-info {
  flex: 1;
}

.connection-name {
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
}

.connection-peer-id {
  font-size: 12px;
  color: #64748b;
  font-family: monospace;
}

.connection-metrics {
  display: flex;
  gap: 16px;
}

.metric-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric-label {
  font-size: 11px;
  color: #94a3b8;
}

.metric-value {
  font-size: 12px;
  font-weight: 500;
  color: #1e293b;
}

/* 网络日志 */
.network-log-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
  font-size: 12px;
}

.log-time {
  color: #94a3b8;
  font-family: monospace;
  flex-shrink: 0;
}

.log-type {
  font-weight: 500;
  flex-shrink: 0;
}

.log-type.info {
  color: #0ea5e9;
}

.log-type.warn {
  color: #f59e0b;
}

.log-type.error {
  color: #ef4444;
}

.log-message {
  color: #475569;
  flex: 1;
}

/* 同步进度弹窗 */
.sync-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
}

.progress-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.progress-icon {
  color: #0ea5e9;
}

.progress-icon.success {
  color: #22c55e;
}

.progress-icon.failed {
  color: #ef4444;
}

.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.progress-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.progress-info {
  margin-top: 16px;
  font-size: 13px;
  color: #64748b;
}

.progress-error {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

/* 按钮样式 */
.btn-start {
  background: #0ea5e9;
  border-color: #0ea5e9;
}

.btn-start:hover {
  background: #0284c7;
  border-color: #0284c7;
}

.btn-stop {
  background: #ef4444;
  border-color: #ef4444;
}

.btn-stop:hover {
  background: #dc2626;
  border-color: #dc2626;
}

/* 远程节点同步还原样式 */
.remote-sync-section {
  margin-bottom: 16px;
}

.remote-sync-card {
  background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%);
  border: 1px solid #e0f2fe;
}

.remote-sync-card :deep(.arco-card-body) {
  padding: 20px;
}

.remote-sync-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.remote-target-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-label {
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  min-width: 80px;
}

.target-input {
  flex: 1;
  max-width: 300px;
}

.remote-node-info {
  display: flex;
  gap: 32px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label {
  font-size: 12px;
  color: #64748b;
}

.info-value {
  font-size: 13px;
  color: #1e293b;
  font-weight: 500;
}

.info-value.monospace {
  font-family: monospace;
}

.remote-actions {
  display: flex;
  gap: 12px;
}

.snapshot-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.snapshot-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.snapshot-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}

.snapshot-item:hover {
  border-color: #e2e8f0;
  background: #f8fafc;
}

.snapshot-selected {
  border-color: #0ea5e9;
  background: rgba(14, 165, 233, 0.05);
}

.snapshot-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.snapshot-name {
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
}

.snapshot-time {
  font-size: 12px;
  color: #64748b;
}

.snapshot-size {
  font-size: 12px;
  color: #94a3b8;
  font-family: monospace;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .sync-layout {
    flex-direction: column;
  }

  .left-panel {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }

  .remote-target-section {
    flex-wrap: wrap;
  }

  .remote-node-info {
    flex-wrap: wrap;
  }

  .remote-actions {
    flex-wrap: wrap;
  }
}
</style>
