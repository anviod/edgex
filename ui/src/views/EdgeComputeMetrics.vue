<template>
  <div class="edge-compute-metrics">
    <section class="edge-compute-zone edge-compute-zone--metrics" aria-label="运行指标">
      <div class="stats-grid stats-grid--compact edge-compute-stats-grid">
        <div class="stat-card">
          <div class="stat-label">规则总数</div>
          <div class="stat-value">{{ metrics.rule_count }}</div>
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import request from '@/utils/request'

const metrics = ref({
  worker_pool_size: 0,
  worker_pool_usage: 0,
  rule_count: 0,
  cache_size: 0,
  rules_triggered: 0,
  rules_executed: 0,
  rules_dropped: 0
})

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

onMounted(() => {
  fetchMetrics()
  timer = setInterval(fetchMetrics, 2000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
/* v3.0 — styles in src/styles/edge-compute.css */
</style>
