const STATUS_PALETTE = {
  excellent: '#00B26A',
  good: '#3EC7A6',
  fair: '#FFC247',
  poor: '#F77F00',
  offline: '#D7263D'
}

// Normalize backend status or fallback runtime state to a canonical label
// - status: ChannelStatus.Status (string: Excellent / Good / Fair / Poor / Offline)
// - runtimeState: numeric node state fallback (0 online, 1 unstable, 2 offline, 3 quarantine)
export function normalizeChannelStatus(status, runtimeState) {
  if (status) return status
  switch (runtimeState) {
    case 0:
      return 'Excellent'
    case 1:
      return 'Good'
    case 2:
      return 'Offline'
    case 3:
      return 'Poor'
    default:
      return 'Unknown'
  }
}

export function channelStatusColor(status) {
  const key = (status || '').toString().toLowerCase()
  return STATUS_PALETTE[key] || 'grey'
}

const STATUS_LABEL_CN = {
  excellent: '优秀',
  good: '良好',
  fair: '一般',
  poor: '较差',
  offline: '离线',
  unknown: '未知'
}

export function channelStatusLabel(status) {
  const key = (status || '').toString().toLowerCase()
  const cn = STATUS_LABEL_CN[key] || STATUS_LABEL_CN.unknown
  const en = status || 'Unknown'
  return `${cn} (${en})`
}

export const CHANNEL_STATUS_PALETTE = STATUS_PALETTE
