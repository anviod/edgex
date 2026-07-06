const EXTRA_FIELD_SKIP = new Set([
  'ts',
  'time',
  'timestamp',
  '@timestamp',
  'level',
  'severity',
  'msg',
  'caller',
  'logger',
  'stacktrace',
  'stack',
  'name',
  'function',
  'category',
  'channel_id',
  'device_id',
  'channelID',
  'channelId',
  'deviceID',
  'deviceId',
  'deviceKey',
])

export const LOG_CATEGORY_OPTIONS = [
  { label: '南向', value: 'southbound' },
  { label: '边缘计算', value: 'edge_compute' },
  { label: '系统', value: 'system' },
  { label: '北向', value: 'northbound' },
]

export const LOG_CATEGORY_LABELS = Object.fromEntries(
  LOG_CATEGORY_OPTIONS.map((item) => [item.value, item.label])
)

export function createDefaultLogViewerFilters() {
  return {
    level: 'ALL',
    categories: [],
    channelId: '',
    deviceId: '',
  }
}

let nextLogEntryId = 1

export function resetLogEntryIdSequence() {
  nextLogEntryId = 1
}

export function normalizeLogEntry(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      entryId: nextLogEntryId++,
      ts: new Date().toISOString(),
      level: 'INFO',
      msg: String(raw ?? ''),
    }
  }

  return {
    ...raw,
    entryId: raw.entryId ?? nextLogEntryId++,
    ts: raw.ts || raw.time || raw.timestamp || raw['@timestamp'] || '',
    level: raw.level || raw.severity || 'INFO',
    msg: raw.msg ?? raw.message ?? '',
  }
}

export function getLogCategory(log) {
  const category = String(
    log?.category || inferCategoryFromLogger(log?.logger) || 'system'
  ).trim()
  return category || 'system'
}

export function inferCategoryFromLogger(loggerName) {
  const name = String(loggerName || '').toLowerCase()
  if (!name) return ''
  if (name.includes('northbound')) return 'northbound'
  if (name.includes('edge')) return 'edge_compute'
  if (name.includes('scan') || name.includes('channel') || name.includes('driver')) {
    return 'southbound'
  }
  return ''
}

export function getLogChannelId(log) {
  return String(
    log?.channel_id || log?.channelID || log?.channelId || ''
  ).trim()
}

export function getLogDeviceId(log) {
  return String(
    log?.device_id || log?.deviceID || log?.deviceId || log?.deviceKey || ''
  ).trim()
}

export function matchesLogViewerFilters(log, filters) {
  if (!filters) return true

  const level = String(log?.level || 'INFO').toUpperCase()
  if (filters.level && filters.level !== 'ALL' && level !== filters.level) {
    return false
  }

  const categories = filters.categories || []
  if (categories.length > 0 && !categories.includes(getLogCategory(log))) {
    return false
  }

  if (filters.channelId && getLogChannelId(log) !== filters.channelId) {
    return false
  }

  if (filters.deviceId && getLogDeviceId(log) !== filters.deviceId) {
    return false
  }

  return true
}

export function formatLogFieldValue(value) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export function getLogExtraFields(log) {
  const fields = {}

  for (const [key, value] of Object.entries(log || {})) {
    if (EXTRA_FIELD_SKIP.has(key)) continue
    if (value === null || value === undefined || value === '') continue
    fields[key] = formatLogFieldValue(value)
  }

  return Object.keys(fields)
    .sort()
    .reduce((acc, key) => {
      acc[key] = fields[key]
      return acc
    }, {})
}

export function formatLogTime(ts) {
  if (!ts) return ''
  const date = new Date(ts)
  if (Number.isNaN(date.getTime())) return String(ts)
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  const ms = String(date.getMilliseconds()).padStart(3, '0')
  return `${h}:${m}:${s}.${ms}`
}

export function getLogLevelClass(level) {
  const normalized = String(level || '').toUpperCase()
  if (normalized === 'ERROR' || normalized === 'FATAL') return 'error'
  if (normalized === 'WARN' || normalized === 'WARNING') return 'warn'
  if (normalized === 'DEBUG') return 'debug'
  return 'info'
}

export function getLogCategoryClass(category) {
  switch (category) {
    case 'southbound':
      return 'southbound'
    case 'edge_compute':
      return 'edge'
    case 'northbound':
      return 'northbound'
    default:
      return 'system'
  }
}

export function formatLogScopeLabel(log, channelNameMap = {}, deviceNameMap = {}) {
  const channelId = getLogChannelId(log)
  const deviceId = getLogDeviceId(log)
  if (!channelId && !deviceId) return ''

  const channelLabel = channelNameMap[channelId] || channelId
  const deviceLabel = deviceNameMap[deviceId] || deviceId
  if (channelId && deviceId) return `${channelLabel} / ${deviceLabel}`
  return channelLabel || deviceLabel
}

export function extractCallerInfo(log) {
  const caller = String(log?.caller || '').trim()
  if (caller) {
    return { location: caller }
  }

  const filePath = String(log?.file || log?.filePath || '').trim()
  const line = String(log?.line ?? '').trim()
  if (filePath && /^\d+$/.test(line)) {
    return { location: `${filePath}:${line}` }
  }
  if (filePath) {
    return { location: filePath }
  }

  return null
}

export function getLogMetadataFields(log) {
  const meta = {}
  const category = getLogCategory(log)
  meta.category = LOG_CATEGORY_LABELS[category] || category

  if (log?.logger) meta.logger = String(log.logger)
  if (log?.function) meta.function = String(log.function)
  else if (log?.name) meta.function = String(log.name)

  const channelId = getLogChannelId(log)
  const deviceId = getLogDeviceId(log)
  if (channelId) meta.channel_id = channelId
  if (deviceId) meta.device_id = deviceId

  const stack = log?.stacktrace || log?.stack
  if (stack) meta.stacktrace = String(stack)

  return meta
}

export function formatLogDetailTime(ts) {
  if (!ts) return ''
  const date = new Date(ts)
  if (Number.isNaN(date.getTime())) return String(ts)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  })
}

export function formatLogRawJson(log) {
  try {
    return JSON.stringify(log, null, 2)
  } catch {
    return String(log ?? '')
  }
}

export function isSameLogEntry(a, b) {
  if (!a || !b) return false
  if (a === b) return true
  if (a.entryId != null && b.entryId != null) {
    return a.entryId === b.entryId
  }
  return (
    a.ts === b.ts
    && a.msg === b.msg
    && a.caller === b.caller
    && a.level === b.level
  )
}

export function getLogEntryKey(log) {
  if (log?.entryId != null) return String(log.entryId)
  return `${log?.ts ?? ''}|${log?.level ?? ''}|${log?.caller ?? ''}|${log?.msg ?? ''}`
}

export function findLogEntryIndex(logs, target) {
  if (!Array.isArray(logs) || !target) return -1
  return logs.findIndex((log) => isSameLogEntry(log, target))
}

export function isLogInList(logs, target) {
  return findLogEntryIndex(logs, target) !== -1
}
