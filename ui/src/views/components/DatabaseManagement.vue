<template>
  <div class="database-management">
    <!-- 数据库概览 -->
    <a-card title="数据库概览" :bordered="false">
      <div class="overview-grid">
        <div class="overview-item config-db">
          <div class="overview-header">
            <span class="db-type">配置库 (config.db)</span>
            <a-tag color="red">受保护 · 不可清理</a-tag>
          </div>
          <div class="overview-label">数据库路径</div>
          <div class="overview-value">{{ stats.config_db?.path || '-' }}</div>
          <div class="overview-label mt-2">配置 Bucket 数</div>
          <div class="overview-value">{{ configBucketCount }} 个</div>
        </div>
        <div class="overview-item runtime-db">
          <div class="overview-header">
            <span class="db-type">运行时库 (edgex.db)</span>
            <a-tag color="green">可清理 · 可压缩</a-tag>
          </div>
          <div class="overview-label">数据库路径</div>
          <div class="overview-value">{{ stats.runtime_db?.path || '-' }}</div>
          <div class="overview-label mt-2">运行时 Bucket 数</div>
          <div class="overview-value">{{ runtimeBucketCount }} 个</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">总大小 (MB)</div>
          <div class="overview-value">{{ formatSize(stats.total_size) }}</div>
          <div class="overview-label mt-2">可清理数据大小 (MB)</div>
          <div class="overview-value text-warning">{{ formatSize(clearableSize) }}</div>
        </div>
      </div>
    </a-card>

    <!-- 配置库管理 -->
    <a-card title="配置库管理" :bordered="false" class="mt-4">
      <template #headerExtra>
        <a-tag color="red">优先备份</a-tag>
      </template>
      <a-alert type="info" show-icon :closable="false" class="mb-4">
        配置库包含设备配置、通道、点位、用户、系统设置等关键数据。
        <strong>配置库不可清理</strong>，建议定期备份。
      </a-alert>
      <div class="action-group">
        <a-button type="primary" status="success" @click="handleBackupConfig" :loading="backupLoading">
          <template #icon>
            <icon-download />
          </template>
          备份配置库
        </a-button>
        <a-button @click="handleRefresh" :loading="loading">
          <template #icon>
            <icon-refresh />
          </template>
          刷新统计
        </a-button>
      </div>
      <div v-if="backupResult" class="backup-result mt-3">
        <a-alert type="success" show-icon :closable="true" @close="backupResult = null">
          <template #title>备份成功</template>
          {{ backupResult.message }}<br />
          备份文件：{{ backupResult.backup_path }}<br />
          文件大小：{{ backupResult.size_display }}
        </a-alert>
      </div>
    </a-card>

    <!-- 运行时库管理 -->
    <a-card title="运行时库管理" :bordered="false" class="mt-4">
      <template #headerExtra>
        <a-tag color="orange">可清理 · 可压缩 · 可重建</a-tag>
      </template>
      <a-alert type="warning" show-icon :closable="false" class="mb-4">
        运行时库包含实时值、缓存、历史数据、WAL 等。清理运行时数据
        <strong>不影响采集配置</strong>，但会丢失历史记录和缓存。
      </a-alert>

      <!-- Bucket 列表 -->
      <a-table
        :columns="columns"
        :data="runtimeBuckets"
        :pagination="pagination"
        row-key="name"
        :loading="loading"
        size="compact"
      >
        <template #category="{ record }">
          <a-tag :color="getCategoryColor(record.category)">
            {{ getCategoryLabel(record.category) }}
          </a-tag>
        </template>
        <template #total_size="{ record }">
          {{ formatSize(record.total_size) }}
        </template>
        <template #clearable="{ record }">
          <a-badge v-if="record.clearable" status="success" text="可清理" />
          <a-badge v-else status="error" text="受保护" />
        </template>
      </a-table>

      <!-- 快捷操作 -->
      <div class="action-group mt-4">
        <a-button type="primary" status="warning" @click="handleClearCache" :loading="loading">
          <template #icon>
            <icon-delete />
          </template>
          清空运行缓存
        </a-button>
        <a-button status="warning" @click="handleClearRuntime" :loading="loading" :disabled="!hasRuntime">
          <template #icon>
            <icon-delete />
          </template>
          清空实时值快照
        </a-button>
        <a-button status="warning" @click="handleClearHistory" :loading="loading" :disabled="!hasHistory">
          <template #icon>
            <icon-delete />
          </template>
          清空历史数据
        </a-button>
      </div>

      <!-- 高级操作 -->
      <a-divider orientation="left">高级操作</a-divider>
      <div class="action-group">
        <a-button type="outline" status="warning" @click="handleClearAllRuntime" :loading="loading">
          <template #icon>
            <icon-delete />
          </template>
          清空所有运行时数据（重建）
        </a-button>
        <a-button type="outline" @click="handleCompactRuntime" :loading="compactLoading">
          <template #icon>
            <icon-shrink />
          </template>
          压缩运行时库
        </a-button>
      </div>
      <div class="action-desc mt-3">
        <a-alert type="warning" show-icon :closable="false">
          <strong>清空所有运行时数据</strong>：将清理 values、DataCache、WindowData、NorthboundCache、RuleState 及所有 device_history_*。实时值由内存影子设备持有，清空后下一轮采集自动恢复。配置库不受影响。
        </a-alert>
        <a-alert type="info" show-icon :closable="false" class="mt-2">
          <strong>压缩运行时库</strong>：回收已删除数据占用的磁盘空间，配置库不受影响。建议在维护窗口执行。
        </a-alert>
      </div>

      <div v-if="compactResult" class="compact-result mt-3">
        <a-alert type="success" show-icon :closable="true" @close="compactResult = null">
          <template #title>压缩完成</template>
          {{ compactResult.message }}<br />
          压缩前：{{ compactResult.before_size }} → 压缩后：{{ compactResult.after_size }}<br />
          节省空间：{{ compactResult.saved_size }}
        </a-alert>
      </div>
    </a-card>

    <!-- 配置库 Bucket 详情（只读展示） -->
    <a-card title="配置库 Bucket 详情（只读）" :bordered="false" class="mt-4">
      <template #headerExtra>
        <a-tag color="red">受保护</a-tag>
      </template>
      <a-table
        :columns="columns"
        :data="configBuckets"
        :pagination="false"
        row-key="name"
        :loading="loading"
        size="compact"
      >
        <template #category>
          <a-tag color="red">配置</a-tag>
        </template>
        <template #total_size="{ record }">
          {{ formatSize(record.total_size) }}
        </template>
        <template #clearable>
          <a-badge status="error" text="不可清理" />
        </template>
      </a-table>
    </a-card>

    <!-- 一次性迁移工具 -->
    <a-card title="一次性迁移工具" :bordered="false" class="mt-4">
      <template #headerExtra>
        <a-tag color="blue">edgex.db → config.db + runtime.db</a-tag>
      </template>
      <a-alert type="info" show-icon :closable="false" class="mb-4">
        将旧版 <code>data/edgex.db</code> 中的配置 bucket 迁移到 <code>data/config.db</code>，
        运行时 bucket 保留在 <code>data/edgex.db</code>。启动时已自动执行，此工具用于手动迁移。
      </a-alert>
      <div class="action-group">
        <a-button type="outline" @click="handleMigrateLegacy" :loading="migrateLoading">
          <template #icon>
            <icon-swap />
          </template>
          执行迁移
        </a-button>
      </div>
      <div v-if="migrateResult" class="migrate-result mt-3">
        <a-alert
          :type="migrateResult.status === 'success' ? 'success' : 'error'"
          show-icon
          :closable="true"
          @close="migrateResult = null"
        >
          <template #title>迁移结果</template>
          {{ migrateResult.message }}<br />
          <span v-if="migrateResult.migrated?.length">
            已迁移：{{ migrateResult.migrated.join(', ') }}
          </span>
          <span v-if="migrateResult.skipped?.length" class="ml-2">
            跳过：{{ migrateResult.skipped.join(', ') }}
          </span>
        </a-alert>
      </div>
    </a-card>

    <!-- 确认弹窗 -->
    <a-modal
      v-model:visible="confirmVisible"
      :title="confirmTitle"
      @ok="handleConfirm"
      @cancel="confirmVisible = false"
      ok-text="确认"
      cancel-text="取消"
      :ok-button-props="{ status: 'danger' }"
    >
      <p>{{ confirmMessage }}</p>
      <div v-if="confirmBuckets.length > 0" class="confirm-buckets mt-3">
        <a-tag v-for="b in confirmBuckets" :key="b" color="error">
          {{ b }}
        </a-tag>
      </div>
      <a-checkbox v-model="confirmChecked" class="mt-3">
        我已了解此操作的影响
      </a-checkbox>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { IconRefresh, IconDelete, IconDownload, IconShrink, IconSwap } from '@arco-design/web-vue/es/icon'
import request from '../../utils/request'

const stats = ref({})
const loading = ref(false)
const backupLoading = ref(false)
const compactLoading = ref(false)
const migrateLoading = ref(false)
const backupResult = ref(null)
const compactResult = ref(null)
const migrateResult = ref(null)

const confirmVisible = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmBuckets = ref([])
const confirmMode = ref('')
const confirmChecked = ref(false)

const pagination = {
  pageSize: 10,
  showPageSize: true,
  showTotal: true,
}

const columns = [
  { title: '名称', dataIndex: 'name', width: 200 },
  { title: '分类', dataIndex: 'category', slotName: 'category', width: 100 },
  { title: '记录数', dataIndex: 'record_count', width: 100 },
  { title: '大小 (MB)', dataIndex: 'total_size', slotName: 'total_size', width: 120 },
  { title: '状态', dataIndex: 'clearable', slotName: 'clearable', width: 100 },
]

const configBuckets = computed(() => {
  return (stats.value.buckets || []).filter(b => b.database === 'config')
})

const runtimeBuckets = computed(() => {
  return (stats.value.buckets || []).filter(b => b.database === 'runtime')
})

const configBucketCount = computed(() => configBuckets.value.length)

const runtimeBucketCount = computed(() => runtimeBuckets.value.length)

const clearableSize = computed(() => {
  return (stats.value.buckets || []).reduce((sum, bucket) => {
    if (bucket.clearable) return sum + bucket.total_size
    return sum
  }, 0)
})

const hasRuntime = computed(() => {
  return (stats.value.buckets || []).some(b => b.name === 'values')
})

const hasHistory = computed(() => {
  return (stats.value.buckets || []).some(b => b.category === 'history')
})

const formatSize = (bytes) => {
  const n = Number(bytes)
  if (!n || n <= 0) return '0 MB'
  const mb = n / (1024 * 1024)
  const digits = mb < 0.01 ? 4 : 2
  return `${mb.toFixed(digits)} MB`
}

const getCategoryColor = (category) => {
  const colors = {
    config: 'red',
    cache: 'blue',
    runtime: 'orange',
    history: 'purple',
    unknown: 'gray',
  }
  return colors[category] || 'gray'
}

const getCategoryLabel = (category) => {
  const labels = {
    config: '配置',
    cache: '缓存',
    runtime: '运行时',
    history: '历史',
    unknown: '未知',
  }
  return labels[category] || category
}

const showMessage = (content, type = 'info') => {
  const msgMap = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
  }
  Message[msgMap[type] || 'info']({ content })
}

const fetchStats = async () => {
  loading.value = true
  try {
    const res = await request.get('/api/data/stats')
    stats.value = res
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    showMessage('获取统计信息失败', 'error')
  } finally {
    loading.value = false
  }
}

const handleRefresh = () => {
  fetchStats()
}

// ===== 配置库备份 =====
const handleBackupConfig = async () => {
  backupLoading.value = true
  backupResult.value = null
  try {
    const res = await request.post('/api/data/backup-config')
    backupResult.value = res
    showMessage('配置库备份成功', 'success')
  } catch (error) {
    console.error('Backup config failed:', error)
    showMessage(error?.response?.data?.error || '备份失败', 'error')
  } finally {
    backupLoading.value = false
  }
}

// ===== 运行时库清理 =====
const handleClearCache = () => {
  confirmTitle.value = '确认清空运行缓存'
  confirmMessage.value = '将清理以下缓存数据：DataCache、WindowData、NorthboundCache、RuleState。采集配置不会受影响。'
  confirmBuckets.value = ['DataCache', 'WindowData', 'NorthboundCache', 'RuleState']
  confirmMode.value = 'cache'
  confirmChecked.value = false
  confirmVisible.value = true
}

const handleClearRuntime = () => {
  confirmTitle.value = '确认清空实时值快照'
  confirmMessage.value = '将清理 values bucket 中的遗留缓存（当前实时值以内存影子设备为准）。清空后 UI 仍由影子设备推送，无需等待落库。采集配置不会受影响。'
  confirmBuckets.value = ['values']
  confirmMode.value = 'runtime'
  confirmChecked.value = false
  confirmVisible.value = true
}

const handleClearHistory = () => {
  const historyBuckets = (stats.value.buckets || []).filter(b => b.category === 'history').map(b => b.name)
  confirmTitle.value = '确认清空历史数据'
  confirmMessage.value = `将清理 ${historyBuckets.length} 个历史数据 bucket。不影响采集配置。`
  confirmBuckets.value = historyBuckets
  confirmMode.value = 'history'
  confirmChecked.value = false
  confirmVisible.value = true
}

const handleClearAllRuntime = () => {
  confirmTitle.value = '确认清空所有运行时数据（重建）'
  confirmMessage.value = '将清理所有运行时数据：values、DataCache、WindowData、NorthboundCache、RuleState 及所有 device_history_*。配置库不受影响。'
  confirmBuckets.value = ['values', 'DataCache', 'WindowData', 'NorthboundCache', 'RuleState', 'device_history_*']
  confirmMode.value = 'all_runtime'
  confirmChecked.value = false
  confirmVisible.value = true
}

const handleConfirm = async () => {
  if (!confirmChecked.value) {
    showMessage('请先勾选"我已了解此操作的影响"', 'warning')
    return
  }
  confirmVisible.value = false
  loading.value = true
  try {
    let res
    if (confirmMode.value === 'all_runtime') {
      res = await request.post('/api/data/clear-all-runtime')
    } else {
      res = await request.post('/api/data/clear-cache', { mode: confirmMode.value })
    }
    if (res.status === 'success') {
      showMessage(`成功清理 ${res.cleared?.length || 0} 个 bucket`, 'success')
      await fetchStats()
    } else {
      showMessage('清理失败', 'error')
    }
  } catch (error) {
    console.error('Clear failed:', error)
    showMessage(error?.response?.data?.error || '清理失败', 'error')
  } finally {
    loading.value = false
  }
}

// ===== 运行时库压缩 =====
const handleCompactRuntime = async () => {
  compactLoading.value = true
  compactResult.value = null
  try {
    const res = await request.post('/api/data/compact-runtime')
    compactResult.value = res
    showMessage('运行时库压缩成功', 'success')
    await fetchStats()
  } catch (error) {
    console.error('Compact failed:', error)
    showMessage(error?.response?.data?.error || '压缩失败', 'error')
  } finally {
    compactLoading.value = false
  }
}

// ===== 一次性迁移工具 =====
const handleMigrateLegacy = async () => {
  migrateLoading.value = true
  migrateResult.value = null
  try {
    const res = await request.post('/api/data/migrate-legacy', { legacy_path: 'data/edgex.db' })
    migrateResult.value = res
    showMessage('迁移完成', 'success')
    await fetchStats()
  } catch (error) {
    console.error('Migrate failed:', error)
    migrateResult.value = error?.response?.data || { status: 'error', message: '迁移失败' }
    showMessage(error?.response?.data?.error || '迁移失败', 'error')
  } finally {
    migrateLoading.value = false
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.database-management {
  padding: 20px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.overview-item {
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
  border-left: 4px solid #1650e8;
}

.overview-item.config-db {
  border-left-color: #f53f3f;
  background: linear-gradient(135deg, #fff1f0 0%, #f5f5f5 100%);
}

.overview-item.runtime-db {
  border-left-color: #00b42a;
  background: linear-gradient(135deg, #f3fff3 0%, #f5f5f5 100%);
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.db-type {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.overview-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.overview-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  word-break: break-all;
}

.overview-value.text-warning {
  color: #ff7d00;
}

.mt-2 {
  margin-top: 8px;
}

.mt-3 {
  margin-top: 12px;
}

.mt-4 {
  margin-top: 16px;
}

.mb-4 {
  margin-bottom: 16px;
}

.ml-2 {
  margin-left: 8px;
}

.action-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-desc {
  margin-top: 16px;
}

.confirm-buckets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.backup-result,
.compact-result,
.migrate-result {
  margin-top: 12px;
}
</style>
