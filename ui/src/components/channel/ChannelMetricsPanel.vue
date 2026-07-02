<template>
  <div class="channel-metrics-panel">
    <div v-if="loading" class="channel-metrics-panel__loading">
      <a-spin tip="加载监控指标中..." size="large" />
    </div>

    <div v-else-if="error" class="channel-metrics-panel__error">
      <a-alert type="error" :title="error" show-icon />
    </div>

    <div v-else-if="metrics" class="channel-metrics-panel__body">
      <section class="channel-metrics-hero">
        <div class="channel-metrics-score" :class="qualityTier.className">
          <div class="channel-metrics-score__ring">
            <a-progress
              v-if="showScoreRing"
              type="circle"
              :percent="qualityScore"
              :color="qualityTier.color"
              :stroke-width="8"
              :show-text="false"
              :size="112"
            />
            <div class="channel-metrics-score__center">
              <span class="channel-metrics-score__value">{{ qualityScoreDisplay }}</span>
              <span class="channel-metrics-score__label">质量评分</span>
            </div>
          </div>
          <a-tag :color="qualityTier.status" size="small" class="channel-metrics-score__badge">
            {{ qualityTier.label }}
          </a-tag>
        </div>

        <div class="channel-metrics-meta">
          <div class="channel-metrics-meta__item">
            <span class="channel-metrics-meta__label">通道状态</span>
            <a-badge :status="qualityTier.status" :text="qualityTier.label" />
          </div>
          <div class="channel-metrics-meta__item">
            <span class="channel-metrics-meta__label">连接时长</span>
            <span class="channel-metrics-meta__value">{{ connectionDuration }}</span>
          </div>
          <div class="channel-metrics-meta__item channel-metrics-meta__item--wide">
            <span class="channel-metrics-meta__label">本地地址</span>
            <code class="channel-metrics-meta__mono">{{ network.local }}</code>
          </div>
          <div class="channel-metrics-meta__item channel-metrics-meta__item--wide">
            <span class="channel-metrics-meta__label">目标地址</span>
            <code class="channel-metrics-meta__mono">{{ network.remote }}</code>
          </div>
          <div v-if="metrics.reconnectCount > 0" class="channel-metrics-meta__item">
            <span class="channel-metrics-meta__label">重连次数</span>
            <a-tag color="orange" size="small">{{ metrics.reconnectCount }} 次</a-tag>
          </div>
        </div>
      </section>

      <section class="channel-metrics-kpis">
        <div class="channel-metric-stat">
          <span class="channel-metric-stat__label">成功率</span>
          <span class="channel-metric-stat__value" :class="successRateClass">
            {{ formatMetricsPercent(metrics.successRate, metrics) }}
          </span>
        </div>
        <div class="channel-metric-stat">
          <span class="channel-metric-stat__label">平均 RTT</span>
          <span class="channel-metric-stat__value">{{ formatMetricsDuration(metrics.avgRtt, metrics) }}</span>
        </div>
        <div class="channel-metric-stat">
          <span class="channel-metric-stat__label">丢包率</span>
          <span class="channel-metric-stat__value" :class="packetLossClass">
            {{ formatMetricsPercent(metrics.packetLoss, metrics) }}
          </span>
        </div>
      </section>

      <section v-if="scanDiagnostics" class="channel-metrics-detail channel-metrics-sla">
        <h3 class="channel-metrics-detail__title">调度 SLA</h3>
        <div class="channel-metrics-detail__grid">
          <div class="channel-metrics-detail__cell">
            <span class="channel-metrics-detail__label">Lag P95</span>
            <span class="channel-metrics-detail__val" :class="lagClass">
              {{ formatLag(scanDiagnostics.scan_lag_p95_ms) }}
            </span>
          </div>
          <div class="channel-metrics-detail__cell">
            <span class="channel-metrics-detail__label">Drift 均值</span>
            <span class="channel-metrics-detail__val">{{ formatLag(scanDiagnostics.scan_drift_avg_ms) }}</span>
          </div>
          <div class="channel-metrics-detail__cell">
            <span class="channel-metrics-detail__label">CB Open</span>
            <span class="channel-metrics-detail__val" :class="cbOpenClass">
              {{ cbOpenCount }}
            </span>
          </div>
          <div class="channel-metrics-detail__cell">
            <span class="channel-metrics-detail__label">反压拒绝</span>
            <span class="channel-metrics-detail__val">{{ scanDiagnostics.backpressure_reject_total ?? 0 }}</span>
          </div>
        </div>
        <a-alert
          v-if="slaWarnings.length"
          type="warning"
          show-icon
          class="channel-metrics-sla__warnings"
          :title="`SLA 告警 (${slaWarnings.length})`"
        >
          <ul class="channel-metrics-sla__warning-list">
            <li v-for="(w, idx) in slaWarnings" :key="idx">{{ w.message || w.code }}</li>
          </ul>
        </a-alert>
      </section>

      <section class="channel-metrics-detail">
        <h3 class="channel-metrics-detail__title">详细指标</h3>
        <div class="channel-metrics-detail__grid">
          <div class="channel-metrics-detail__cell">
            <span class="channel-metrics-detail__label">CRC 错误率</span>
            <span class="channel-metrics-detail__val">{{ formatMetricsPercent(metrics.crcErrorRate, metrics) }}</span>
          </div>
          <div class="channel-metrics-detail__cell">
            <span class="channel-metrics-detail__label">重试率</span>
            <span class="channel-metrics-detail__val">{{ formatMetricsPercent(metrics.retryRate, metrics) }}</span>
          </div>
          <div class="channel-metrics-detail__cell">
            <span class="channel-metrics-detail__label">总请求数</span>
            <span class="channel-metrics-detail__val">{{ totalRequests }}</span>
          </div>
          <div class="channel-metrics-detail__cell">
            <span class="channel-metrics-detail__label">成功请求数</span>
            <span class="channel-metrics-detail__val is-success">{{ successCount }}</span>
          </div>
          <div class="channel-metrics-detail__cell">
            <span class="channel-metrics-detail__label">失败请求数</span>
            <span class="channel-metrics-detail__val is-danger">{{ failureCount }}</span>
          </div>
          <div class="channel-metrics-detail__cell">
            <span class="channel-metrics-detail__label">重连次数</span>
            <span class="channel-metrics-detail__val">{{ metrics.reconnectCount ?? 0 }}</span>
          </div>
        </div>
      </section>
    </div>

    <a-empty v-else class="channel-metrics-panel__empty" description="暂无监控指标数据" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  computeQualityScore,
  getQualityTier,
  getQualityScoreDisplay,
  formatMetricsPercent,
  formatMetricsDuration,
  formatConnectionDuration,
  parseNetworkInfo,
  getNetworkConnectionText,
  getSuccessRateClass,
  getPacketLossClass,
  getTotalRequests,
  getSuccessCount,
  getFailureCount,
  hasObservedTraffic,
  isChannelLinkUp,
} from '@/utils/channelMetrics'

const props = defineProps({
  metrics: { type: Object, default: null },
  scanDiagnostics: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const qualityScore = computed(() => computeQualityScore(props.metrics))
const qualityTier = computed(() => getQualityTier(qualityScore.value, props.metrics))
const qualityScoreDisplay = computed(() => getQualityScoreDisplay(qualityScore.value, props.metrics))
const showScoreRing = computed(() => hasObservedTraffic(props.metrics) && isChannelLinkUp(props.metrics))

const connectionDuration = computed(() => {
  if (!isChannelLinkUp(props.metrics)) {
    return formatConnectionDuration(undefined, props.metrics)
  }
  const text = formatConnectionDuration(props.metrics?.connectionSeconds, props.metrics)
  return text === '未连接' ? text : `已连接 · ${text}`
})

const network = computed(() => {
  const info = parseNetworkInfo(props.metrics)
  return getNetworkConnectionText(props.metrics, info)
})

const totalRequests = computed(() => getTotalRequests(props.metrics))
const successCount = computed(() => getSuccessCount(props.metrics))
const failureCount = computed(() => getFailureCount(props.metrics))

const successRateClass = computed(() => getSuccessRateClass(props.metrics?.successRate, props.metrics))
const packetLossClass = computed(() => getPacketLossClass(props.metrics?.packetLoss, props.metrics))

const slaWarnings = computed(() => {
  const list = props.scanDiagnostics?.sla_warnings
  return Array.isArray(list) ? list : []
})

const cbOpenCount = computed(() => {
  const cb = props.scanDiagnostics?.circuit_breaker
  const devices = cb?.devices
  if (!devices || typeof devices !== 'object') return 0
  return Object.values(devices).filter((d) => d?.state === 'Open').length
})

const lagClass = computed(() => {
  const lag = props.scanDiagnostics?.scan_lag_p95_ms
  if (lag == null) return ''
  if (lag <= 100) return 'is-success'
  if (lag <= 200) return 'is-warning'
  return 'is-danger'
})

const cbOpenClass = computed(() => (cbOpenCount.value > 0 ? 'is-danger' : 'is-success'))

function formatLag(ms) {
  if (ms == null || ms === undefined) return '—'
  if (ms < 1) return '<1ms'
  return `${Number(ms).toFixed(2)}ms`
}
</script>

<style scoped>
/* v3.0 — src/styles/channel-metrics.css */
</style>
