/**
 * 通道监控指标 — 统一计算与格式化
 */

export function getTotalRequests(metrics) {
  if (!metrics) return 0
  return metrics.totalRequests ?? metrics.total_requests ?? 0
}

export function getSuccessCount(metrics) {
  if (!metrics) return 0
  return metrics.successCount ?? metrics.success_count ?? metrics.successRequests ?? 0
}

export function getFailureCount(metrics) {
  if (!metrics) return 0
  return metrics.failureCount ?? metrics.failure_count ?? metrics.failedRequests ?? 0
}

export function hasObservedTraffic(metrics) {
  return getTotalRequests(metrics) > 0
}

export function isChannelLinkUp(metrics) {
  if (!metrics) return false
  if (metrics.linkUp === true) return true
  if (metrics.linkUp === false) return false

  const info = parseNetworkInfo(metrics)
  const hasEndpoint =
    (info.remoteIp && info.remoteIp !== '-') ||
    (info.localIp && info.localIp !== '-')

  if (!hasEndpoint && getTotalRequests(metrics) === 0) {
    return false
  }

  return metrics.qualityScore > 0 || hasEndpoint
}

export function computeQualityScore(metrics) {
  if (!metrics) return 0
  if (!isChannelLinkUp(metrics)) return 0
  if (!hasObservedTraffic(metrics)) return 0

  if (metrics.qualityScore !== undefined && metrics.qualityScore !== null) {
    return Math.max(0, Math.min(100, Math.round(metrics.qualityScore)))
  }

  let score = 100
  const m = metrics

  if (m.successRate !== undefined && m.successRate !== null) {
    score -= (1 - m.successRate) * 40
  }
  if (m.crcErrorRate !== undefined && m.crcErrorRate !== null) {
    score -= m.crcErrorRate * 20
  }
  if (m.retryRate !== undefined && m.retryRate !== null) {
    score -= m.retryRate * 20
  }
  if (m.avgRtt > 100) score -= Math.min(10, (m.avgRtt - 100) / 50)

  const scanLag = m.scanLagP95Ms ?? m.scan_lag_p95_ms
  if (scanLag > 100) score -= Math.min(15, (scanLag - 100) / 20)

  const cbOpen = m.circuitBreakerOpen ?? m.circuit_breaker_open ?? 0
  if (cbOpen > 0) score -= Math.min(20, cbOpen * 10)

  return Math.max(0, Math.round(score))
}

export function getQualityTier(score, metrics = null) {
  if (metrics && !isChannelLinkUp(metrics)) {
    return { label: '离线', className: 'is-offline', status: 'normal', color: '#6b7280' }
  }
  if (metrics && isChannelLinkUp(metrics) && !hasObservedTraffic(metrics)) {
    return { label: '待采样', className: 'is-idle', status: 'processing', color: '#64748b' }
  }
  if (score <= 0) {
    return { label: '离线', className: 'is-offline', status: 'normal', color: '#6b7280' }
  }
  if (score >= 90) {
    return { label: '优秀', className: 'is-excellent', status: 'success', color: '#16a34a' }
  }
  if (score >= 75) {
    return { label: '良好', className: 'is-good', status: 'processing', color: '#0ea5e9' }
  }
  if (score >= 60) {
    return { label: '一般', className: 'is-fair', status: 'warning', color: '#d97706' }
  }
  return { label: '较差', className: 'is-poor', status: 'danger', color: '#dc2626' }
}

export function getQualityScoreDisplay(score, metrics = null) {
  if (metrics && !isChannelLinkUp(metrics)) return '—'
  if (metrics && isChannelLinkUp(metrics) && !hasObservedTraffic(metrics)) return '—'
  return String(score)
}

export function formatMetricsPercent(val, metrics = null) {
  if (!hasObservedTraffic(metrics)) return '—'
  if (val === undefined || val === null) return '—'
  return `${(val * 100).toFixed(1)}%`
}

export function formatMetricsDuration(ms, metrics = null) {
  if (!hasObservedTraffic(metrics)) return '—'
  if (ms === undefined || ms === null) return '—'
  if (ms < 1) return '<1ms'
  if (ms < 1000) return `${ms.toFixed(2)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

export function formatConnectionDuration(seconds, metrics = null) {
  if (metrics && !isChannelLinkUp(metrics)) return '未连接'
  if (seconds === undefined || seconds === null) return '暂无连接信息'
  if (seconds === 0) return '刚建立连接'
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${h}h ${m}m`
}

function parseAddressString(addrStr) {
  if (!addrStr) return { ip: '-', port: '-' }

  let addr = addrStr
  if (addr.includes('://')) {
    addr = addr.split('://')[1] || addr
  }

  if (addr.startsWith('[')) {
    const bracketIdx = addr.indexOf(']')
    if (bracketIdx > 0) {
      const ip = addr.substring(1, bracketIdx)
      const rest = addr.substring(bracketIdx + 1)
      if (rest.startsWith(':')) {
        return { ip, port: rest.substring(1).split('/')[0] }
      }
      return { ip, port: '-' }
    }
  }

  const colonIdx = addr.lastIndexOf(':')
  if (colonIdx > 0) {
    const ip = addr.substring(0, colonIdx)
    let port = addr.substring(colonIdx + 1)
    const slashIdx = port.indexOf('/')
    if (slashIdx > 0) port = port.substring(0, slashIdx)
    return { ip, port }
  }

  return { ip: addr, port: '-' }
}

export function parseNetworkInfo(metrics) {
  if (!metrics) {
    return { localIp: '-', localPort: '-', remoteIp: '-', remotePort: '-', remoteAddr: '' }
  }

  let localIp = metrics.localIp || metrics.local_ip
  let localPort = metrics.localPort || metrics.local_port
  let remoteIp = metrics.remoteIp || metrics.remote_ip
  let remotePort = metrics.remotePort || metrics.remote_port

  if (!localIp && metrics.localAddr) {
    const parsed = parseAddressString(metrics.localAddr)
    localIp = parsed.ip
    localPort = parsed.port
  }

  if (!remoteIp && metrics.remoteAddr) {
    const parsed = parseAddressString(metrics.remoteAddr)
    remoteIp = parsed.ip
    remotePort = parsed.port
  }

  return {
    localIp: localIp || '-',
    localPort: localPort || '-',
    remoteIp: remoteIp || '-',
    remotePort: remotePort || '-',
    remoteAddr: metrics.remoteAddr || '',
  }
}

export function getNetworkConnectionText(metrics, info) {
  if (!metrics) return { local: '-:-', remote: '-:-', endpoint: '' }
  if (!isChannelLinkUp(metrics)) {
    return { local: '—', remote: '—', endpoint: '' }
  }

  const local = `${info.localIp}:${info.localPort}`
  const remoteAddr = info.remoteAddr

  if (remoteAddr && remoteAddr.includes(':')) {
    const parts = remoteAddr.split(':')
    if (parts.length >= 2 && !Number.isNaN(Number(parts[1]))) {
      return { local, remote: `${info.remoteIp}:${info.remotePort}`, endpoint: remoteAddr }
    }
  }

  if (remoteAddr) {
    return { local, remote: remoteAddr, endpoint: remoteAddr }
  }

  return { local, remote: '-:-', endpoint: '' }
}

export function getSuccessRateClass(rate, metrics = null) {
  if (!hasObservedTraffic(metrics)) return ''
  if (rate === undefined || rate === null) return ''
  if (rate >= 0.99) return 'is-success'
  if (rate >= 0.95) return 'is-warning'
  return 'is-danger'
}

export function getPacketLossClass(rate, metrics = null) {
  if (!hasObservedTraffic(metrics)) return ''
  if (rate === undefined || rate === null) return ''
  if (rate < 0.01) return 'is-success'
  if (rate < 0.05) return 'is-warning'
  return 'is-danger'
}

export function runtimeFromQualityScore(qualityScore, metrics = null) {
  if (metrics && !isChannelLinkUp(metrics)) {
    return { text: '离线', status: 'normal' }
  }
  if (metrics && isChannelLinkUp(metrics) && !hasObservedTraffic(metrics)) {
    return { text: '已连接 · 待采样', status: 'processing' }
  }
  if (qualityScore >= 90) return { text: '运行中 (优秀)', status: 'success' }
  if (qualityScore >= 75) return { text: '运行中 (良好)', status: 'success' }
  if (qualityScore >= 60) return { text: '运行中 (一般)', status: 'warning' }
  if (qualityScore > 0) return { text: '运行中 (较差)', status: 'danger' }
  return { text: '离线', status: 'normal' }
}
