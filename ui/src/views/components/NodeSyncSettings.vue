<template>
  <div class="node-sync-container">
    <!-- 节点列表 -->
    <a-card class="mb-4">
      <template #title>
        <div class="card-header">
          <span class="card-title">网络节点列表</span>
          <a-button size="small" type="primary" @click="syncAllNodes">
            <template #icon><icon-refresh /></template>
            同步所有节点
          </a-button>
        </div>
      </template>
      <div class="node-list">
        <div 
          v-for="node in nodeList" 
          :key="node.id"
          class="node-item"
          :class="{ 
            'node-new': node.isNew,
            'node-offline': node.status === 'offline',
            'node-online': node.status === 'online',
            'node-syncing': node.status === 'syncing'
          }"
          @click="viewNodeDevices(node)"
        >
          <div class="node-status-dot">
            <span class="status-indicator"></span>
            <span v-if="node.isNew" class="new-badge">NEW</span>
          </div>
          <div class="node-info">
            <div class="node-name">{{ node.name }}</div>
            <div class="node-id">{{ node.id }}</div>
          </div>
          <div class="node-meta">
            <div class="node-status">{{ getStatusText(node.status) }}</div>
            <div class="node-device-count">{{ node.deviceCount }} 设备</div>
          </div>
          <div class="node-actions">
            <a-button 
              size="mini" 
              @click.stop="syncNode(node)"
              :loading="node.syncing"
            >
              <template #icon><icon-refresh /></template>
              同步
            </a-button>
          </div>
        </div>
      </div>
      
      <a-empty v-if="nodeList.length === 0" description="暂无网络节点" />
    </a-card>

    <!-- 同步模式选择 -->
    <a-row :gutter="16" class="mb-4">
      <a-col :span="12">
        <a-card class="sync-mode-card" hoverable>
          <div class="sync-mode-body">
            <div class="mode-icon push-icon">
              <icon-send />
            </div>
            <div class="mode-content">
              <div class="mode-title">推模式</div>
              <div class="mode-desc">将本机配置同步到指定节点</div>
              <a-button type="primary" size="small" @click="showPushModal = true">
                执行推送
              </a-button>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card class="sync-mode-card" hoverable>
          <div class="sync-mode-body">
            <div class="mode-icon pull-icon">
              <icon-download />
            </div>
            <div class="mode-content">
              <div class="mode-title">拉模式</div>
              <div class="mode-desc">指定设备，让节点同步该设备数据</div>
              <a-button type="primary" size="small" @click="showPullModal = true">
                执行拉取
              </a-button>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 同步状态概览 -->
    <a-card>
      <template #title>
        <span class="card-title">同步状态概览</span>
      </template>
      <a-row :gutter="16">
        <a-col :span="6">
          <a-statistic title="在线节点" :value="onlineCount" suffix="个" />
        </a-col>
        <a-col :span="6">
          <a-statistic title="离线节点" :value="offlineCount" suffix="个" />
        </a-col>
        <a-col :span="6">
          <a-statistic title="同步中" :value="syncingCount" suffix="个" />
        </a-col>
        <a-col :span="6">
          <a-statistic title="总设备数" :value="totalDevices" suffix="台" />
        </a-col>
      </a-row>
    </a-card>
  </div>

  <!-- 推模式弹窗 -->
  <a-modal 
    v-model:visible="showPushModal" 
    title="推模式同步" 
    @ok="executePushSync"
  >
    <a-form :model="pushForm" layout="vertical">
      <a-form-item field="targetNode" label="目标节点">
        <a-select 
          v-model="pushForm.targetNode" 
          :options="onlineNodeOptions"
          placeholder="选择目标节点"
        />
      </a-form-item>
      <a-form-item field="syncScope" label="同步范围">
        <a-checkbox-group v-model="pushForm.syncScope">
          <a-checkbox value="channel">采集通道</a-checkbox>
          <a-checkbox value="device">设备配置</a-checkbox>
          <a-checkbox value="northbound">北向接口</a-checkbox>
          <a-checkbox value="rules">边缘规则</a-checkbox>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item field="forceOverwrite" label="强制覆盖">
        <a-switch v-model="pushForm.forceOverwrite" />
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- 拉模式弹窗 -->
  <a-modal 
    v-model:visible="showPullModal" 
    title="拉模式同步" 
    @ok="executePullSync"
  >
    <a-form :model="pullForm" layout="vertical">
      <a-form-item field="sourceNode" label="源节点">
        <a-select 
          v-model="pullForm.sourceNode" 
          :options="onlineNodeOptions"
          placeholder="选择源节点"
        />
      </a-form-item>
      <a-form-item field="deviceCode" label="设备编码">
        <a-input 
          v-model="pullForm.deviceCode" 
          placeholder="输入设备编码"
          class="monospace"
        />
      </a-form-item>
      <a-form-item field="syncAll" label="同步整个节点">
        <a-switch v-model="pullForm.syncAll" />
        <span v-if="pullForm.syncAll" class="text-sm text-gray-500">将同步源节点的所有设备数据</span>
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- 设备列表弹窗 -->
  <a-modal 
    v-model:visible="showDeviceModal" 
    :title="selectedNode?.name + ' - 设备列表'" 
    width="900px"
  >
    <a-table 
      :columns="deviceColumns" 
      :data="deviceList" 
      :pagination="false"
      row-key="id"
      :bordered="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'syncStatus'">
          <a-tag :color="record.syncStatus === 'success' ? 'green' : 'red'">
            {{ record.syncStatus === 'success' ? '同步成功' : '同步失败' }}
          </a-tag>
        </template>
        <template v-if="column.key === 'versionHash'">
          <code class="hash-code">{{ record.versionHash }}</code>
        </template>
        <template v-if="column.key === 'actions'">
          <a-button size="mini" @click="syncSingleDevice(record)">同步</a-button>
        </template>
      </template>
    </a-table>
  </a-modal>

  <!-- 故障提醒弹窗 -->
  <a-modal 
    v-model:visible="showAlertModal" 
    title="节点离线警告" 
    :closable="false"
    confirm-text="确认"
    class="alert-modal"
  >
    <div class="alert-content">
      <icon-info-circle class="alert-icon" />
      <div class="alert-text">
        <div class="alert-title">节点连接异常</div>
        <div class="alert-desc">节点 "{{ alertNodeName }}" 已离线，请检查网络连接或节点状态</div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  IconRefresh, 
  IconSend, 
  IconDownload,
  IconInfoCircle 
} from '@arco-design/web-vue/es/icon'

// 节点列表数据
const nodeList = ref([
  { id: 'node-001', name: '主节点-A', status: 'online', deviceCount: 12, isNew: false, syncing: false },
  { id: 'node-002', name: '备份节点-B', status: 'online', deviceCount: 8, isNew: false, syncing: false },
  { id: 'node-003', name: '边缘节点-C', status: 'syncing', deviceCount: 5, isNew: true, syncing: true },
  { id: 'node-004', name: '远程节点-D', status: 'offline', deviceCount: 0, isNew: false, syncing: false },
])

// 设备列表数据
const deviceList = ref([
  { id: 'dev-001', name: '西门子 S7-1200', syncTime: '2024-01-15 10:30:25', syncStatus: 'success', versionHash: 'a1b2c3d4' },
  { id: 'dev-002', name: '三菱 FX5U', syncTime: '2024-01-15 10:30:28', syncStatus: 'success', versionHash: 'e5f6g7h8' },
  { id: 'dev-003', name: '欧姆龙 CP1H', syncTime: '2024-01-15 10:28:15', syncStatus: 'failed', versionHash: 'i9j0k1l2' },
  { id: 'dev-004', name: '施耐德 M340', syncTime: '2024-01-15 10:30:30', syncStatus: 'success', versionHash: 'm3n4o5p6' },
])

// 弹窗状态
const showPushModal = ref(false)
const showPullModal = ref(false)
const showDeviceModal = ref(false)
const showAlertModal = ref(false)

// 选中的节点
const selectedNode = ref(null)
const alertNodeName = ref('')

// 推模式表单
const pushForm = ref({
  targetNode: '',
  syncScope: ['channel', 'device'],
  forceOverwrite: false
})

// 拉模式表单
const pullForm = ref({
  sourceNode: '',
  deviceCode: '',
  syncAll: false
})

// 设备列表列定义
const deviceColumns = [
  { title: '设备名称', dataIndex: 'name' },
  { title: '同步时间', dataIndex: 'syncTime' },
  { title: '同步状态', dataIndex: 'syncStatus' },
  { title: '版本哈希', dataIndex: 'versionHash' },
  { title: '操作', dataIndex: 'actions', width: 80 },
]

// 计算属性
const onlineCount = computed(() => nodeList.value.filter(n => n.status === 'online').length)
const offlineCount = computed(() => nodeList.value.filter(n => n.status === 'offline').length)
const syncingCount = computed(() => nodeList.value.filter(n => n.status === 'syncing').length)
const totalDevices = computed(() => nodeList.value.reduce((sum, n) => sum + n.deviceCount, 0))

const onlineNodeOptions = computed(() => 
  nodeList.value
    .filter(n => n.status === 'online')
    .map(n => ({ label: n.name, value: n.id }))
)

// 获取状态文本
function getStatusText(status) {
  const statusMap = {
    online: '在线',
    offline: '离线',
    syncing: '同步中',
    error: '异常'
  }
  return statusMap[status] || status
}

// 查看节点设备
function viewNodeDevices(node) {
  selectedNode.value = node
  showDeviceModal.value = true
}

// 同步节点
function syncNode(node) {
  node.syncing = true
  node.status = 'syncing'
  setTimeout(() => {
    node.syncing = false
    node.status = 'online'
  }, 2000)
}

// 同步所有节点
function syncAllNodes() {
  nodeList.value.forEach(node => {
    if (node.status === 'online') {
      syncNode(node)
    }
  })
}

// 同步单个设备
function syncSingleDevice(device) {
  device.syncStatus = 'success'
  device.syncTime = new Date().toLocaleString()
}

// 执行推模式同步
function executePushSync() {
  showPushModal.value = false
}

// 执行拉模式同步
function executePullSync() {
  showPullModal.value = false
}

// 模拟节点离线检测
let offlineTimer = null
function startOfflineDetection() {
  offlineTimer = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * nodeList.value.length)
    const node = nodeList.value[randomIndex]
    if (node.status === 'online' && Math.random() > 0.8) {
      node.status = 'offline'
      alertNodeName.value = node.name
      showAlertModal.value = true
      
      // 播放提示音
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        oscillator.frequency.value = 800
        oscillator.type = 'sine'
        gainNode.gain.value = 0.3
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.5)
      } catch (e) {
        console.log('Audio notification not supported')
      }
    }
  }, 10000)
}

onMounted(() => {
  startOfflineDetection()
  
  // 模拟新节点加入
  setTimeout(() => {
    const newNode = {
      id: 'node-005',
      name: '新增节点-E',
      status: 'syncing',
      deviceCount: 3,
      isNew: true,
      syncing: true
    }
    nodeList.value.push(newNode)
    
    setTimeout(() => {
      newNode.status = 'online'
      newNode.syncing = false
      setTimeout(() => {
        newNode.isNew = false
      }, 3000)
    }, 2000)
  }, 3000)
})

onUnmounted(() => {
  if (offlineTimer) {
    clearInterval(offlineTimer)
  }
})
</script>

<style scoped>
/* v3.0 — styles in src/styles/ */
</style>
