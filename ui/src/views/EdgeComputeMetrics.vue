<template>
  <div class="edge-compute-metrics">
    <section class="edge-compute-zone edge-compute-zone--metrics" aria-label="运行指标">
      <div class="edge-compute-zone-header">
        <h3 class="edge-compute-zone-title">运行指标</h3>
      </div>
      <div class="stats-grid stats-grid--compact edge-compute-stats-grid">
        <div class="stat-card">
          <div class="stat-label">规则总数</div>
          <div class="stat-value">{{ metrics.rule_count }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">共享源数量</div>
          <div class="stat-value">{{ metrics.shared_source_count }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">缓存大小</div>
          <div class="stat-value">{{ metrics.cache_size }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">执行 / 触发 / 丢弃</div>
          <div class="stat-value stat-value--compound">
            <span>{{ metrics.rules_executed }}</span>
            <span class="stat-value-sep">/ {{ metrics.rules_triggered }} / {{ metrics.rules_dropped }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">并发执行 (使用/总量)</div>
          <div class="stat-value stat-value--compound">
            <span>{{ metrics.worker_pool_usage }}</span>
            <span class="stat-value-sep">/ {{ metrics.worker_pool_size }}</span>
            <span class="stat-value-sep">· {{ workerUsagePercent }}%</span>
          </div>
        </div>
      </div>
    </section>

    <section class="edge-compute-zone edge-compute-zone--table" aria-label="共享源详情">
      <div class="edge-compute-zone-header">
        <h3 class="edge-compute-zone-title">共享源详情</h3>
      </div>
      <div class="edge-compute-tertiary-block">
        <div class="table-container saas-table">
          <a-table
            :columns="columns"
            :data="sharedSources"
            size="small"
            :bordered="false"
            :scroll="{ x: 720 }"
          >
            <template #subscribers="{ record }">
              <div class="subscribers-line">
                <span
                  v-for="sub in record.subscribers"
                  :key="sub"
                  class="sub-item"
                >
                  {{ sub }}
                </span>
              </div>
            </template>
          </a-table>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import request from '@/utils/request'

const metrics = ref({
  worker_pool_size: 0,
  worker_pool_usage: 0,
  rule_count: 0,
  shared_source_count: 0,
  cache_size: 0,
  rules_triggered: 0,
  rules_executed: 0,
  rules_dropped: 0
})

const sharedSources = ref([])
const columns = [
  { title: '数据源 ID', dataIndex: 'source_id', width: 200 },
  { title: '订阅数量', dataIndex: 'subscriber_count', width: 100 },
  { title: '订阅规则', dataIndex: 'subscribers', slotName: 'subscribers' }
]

const workerUsagePercent = computed(() => {
  if (metrics.value.worker_pool_size === 0) return 0
  return Math.round((metrics.value.worker_pool_usage / metrics.value.worker_pool_size) * 100)
})

let timer = null

const fetchMetrics = async () => {
  try {
    const data = await request.get('/api/edge/metrics')
    if (data) {
      metrics.value = data
    }
  } catch (e) {
    console.error(e)
  }
}

const fetchSharedSources = async () => {
  try {
    const data = await request.get('/api/edge/shared-sources')
    if (data) {
      sharedSources.value = data || []
    }
  } catch (e) {
    console.error(e)
  }
}

const fetchData = () => {
  fetchMetrics()
  fetchSharedSources()
}

onMounted(() => {
  fetchData()
  timer = setInterval(fetchData, 2000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
/* v3.0 — styles in src/styles/edge-compute.css */
</style>
