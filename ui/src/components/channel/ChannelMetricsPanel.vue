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
              type="circle"
              :percent="qualityScore"
              :color="qualityTier.color"
              :stroke-width="8"
              :show-text="false"
              :size="112"
            />
            <div class="channel-metrics-score__center">
              <span class="channel-metrics-score__value">{{ qualityScore }}</span>
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
            {{ formatMetricsPercent(metrics.successRate) }}
          </span>
        </div>
        <div class="channel-metric-stat">
          <span class="channel-metric-stat__label">平均 RTT</span>
          <span class="channel-metric-stat__value">{{ formatMetricsDuration(metrics.avgRtt) }}</span>
        </div>
        <div class="channel-metric-stat">
          <span class="channel-metric-stat__label">丢包率</span>
          <span class="channel-metric-stat__value" :class="packetLossClass">
            {{ formatMetricsPercent(metrics.packetLoss) }}
          </span>
        </div>
      </section>

      <section class="channel-metrics-detail">
        <h3 class="channel-metrics-detail__title">详细指标</h3>
        <div class="channel-metrics-detail__grid">
          <div class="channel-metrics-detail__cell">
            <span class="channel-metrics-detail__label">CRC 错误率</span>
            <span class="channel-metrics-detail__val">{{ formatMetricsPercent(metrics.crcErrorRate) }}</span>
          </div>
          <div class="channel-metrics-detail__cell">
            <span class="channel-metrics-detail__label">重试率</span>
            <span class="channel-metrics-detail__val">{{ formatMetricsPercent(metrics.retryRate) }}</span>
          </div>
          <div class="channel-metrics-detail__cell">
            <span class="channel-metrics-detail__label">总请求数</span>
            <span class="channel-metrics-detail__val">{{ metrics.totalRequests ?? 0 }}</span>
          </div>
          <div class="channel-metrics-detail__cell">
            <span class="channel-metrics-detail__label">成功请求数</span>
            <span class="channel-metrics-detail__val is-success">{{ metrics.successRequests ?? 0 }}</span>
          </div>
          <div class="channel-metrics-detail__cell">
            <span class="channel-metrics-detail__label">失败请求数</span>
            <span class="channel-metrics-detail__val is-danger">{{ metrics.failedRequests ?? 0 }}</span>
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
  formatMetricsPercent,
  formatMetricsDuration,
  formatConnectionDuration,
  parseNetworkInfo,
  getNetworkConnectionText,
  getSuccessRateClass,
  getPacketLossClass,
} from '@/utils/channelMetrics'

const props = defineProps({
  metrics: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const qualityScore = computed(() => computeQualityScore(props.metrics))
const qualityTier = computed(() => getQualityTier(qualityScore.value))

const connectionDuration = computed(() => {
  const seconds = props.metrics?.connectionSeconds
  const text = formatConnectionDuration(seconds)
  return seconds === undefined || seconds === null ? text : `已连接 ${text}`
})

const network = computed(() => {
  const info = parseNetworkInfo(props.metrics)
  return getNetworkConnectionText(props.metrics, info)
})

const successRateClass = computed(() => getSuccessRateClass(props.metrics?.successRate))
const packetLossClass = computed(() => getPacketLossClass(props.metrics?.packetLoss))
</script>

<style scoped>
/* v3.0 — src/styles/channel-metrics.css */
</style>
