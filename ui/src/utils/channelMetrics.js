/**
 * 通道监控指标 — 统一计算与格式化
 */

export function computeQualityScore(metrics) {
  if (!metrics) return 0

  if (metrics.qualityScore !== undefined && metrics.qualityScore !== null) {
    return Math.max(0, Math.min(100, Math.round(metrics.qualityScore)))
  }

  let score = 100
  const m = metrics

  if (m.successRate !== undefined) score -= (1 - m.successRate) * 40
  if (m.crcErrorRate !== undefined) score -= m.crcErrorRate * 20
  if (m.retryRate !== undefined) score -= m.retryRate * 20
  if (m.avgRtt > 100) score -= Math.min(10, (m.avgRtt - 100) / 50)

  return Math.max(0, Math.round(score))
}

export function getQualityTier(score) {
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

export function formatMetricsPercent(val) {
  if (val === undefined || val === null) return '-'
  return `${(val * 100).toFixed(1)}%`
}

export function formatMetricsDuration(ms) {
  if (ms === undefined || ms === null) return '-'
  if (ms < 1) return '<1ms'
  if (ms < 1000) return `${ms.toFixed(2)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

export function formatConnectionDuration(seconds) {
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
  if (!metrics) return '暂无网络连接信息'

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

export function getSuccessRateClass(rate) {
  if (rate >= 0.99) return 'is-success'
  if (rate >= 0.95) return 'is-warning'
  return 'is-danger'
}

export function getPacketLossClass(rate) {
  if (rate === undefined || rate === null) return ''
  if (rate < 0.01) return 'is-success'
  if (rate < 0.05) return 'is-warning'
  return 'is-danger'
}

export function runtimeFromQualityScore(qualityScore) {
  if (qualityScore >= 90) return { text: '运行中 (优秀)', status: 'success' }
  if (qualityScore >= 75) return { text: '运行中 (良好)', status: 'success' }
  if (qualityScore >= 60) return { text: '运行中 (一般)', status: 'warning' }
  if (qualityScore > 0) return { text: '运行中 (较差)', status: 'danger' }
  return { text: '离线', status: 'normal' }
}
