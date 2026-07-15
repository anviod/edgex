import { LOG_CATEGORY_LABELS } from '@/utils/logFormat'

export const EVENT_STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '错误', value: 'error' },
  { label: '已丢弃', value: 'dropped' },
]

export const LOG_ERROR_TYPE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '公式匹配异常', value: 'formula_error' },
  { label: '执行异常', value: 'execution_error' },
  { label: '超时', value: 'timeout' },
  { label: '调度异常', value: 'dispatch_error' },
  { label: '其他错误', value: 'other' },
]

export const LOG_ERROR_TYPE_LABELS = Object.fromEntries(
  LOG_ERROR_TYPE_OPTIONS.filter((item) => item.value).map((item) => [item.value, item.label])
)

export function createDefaultFilters(mode) {
  const base = {
    ruleId: '',
    start: '',
    end: '',
    status: '',
    categories: [],
    channelId: '',
    deviceId: '',
  }
  if (mode === 'events') {
    return { ...base, limit: 100 }
  }
  return base
}

export function countActiveFilters(filters, mode) {
  if (!filters) return 0
  let count = 0
  if (filters.ruleId) count++
  if (filters.start) count++
  if (filters.end) count++
  if (filters.status) count++
  if (filters.categories?.length) count++
  if (filters.channelId) count++
  if (filters.deviceId) count++
  if (mode === 'events' && filters.limit && filters.limit !== 100) count++
  return count
}

export function buildLogApiParams(filters) {
  const params = new URLSearchParams()
  if (filters.start) params.append('start_date', filters.start.replace('T', ' '))
  if (filters.end) params.append('end_date', filters.end.replace('T', ' '))
  if (filters.ruleId) params.append('rule_id', filters.ruleId)
  const categories = filters.categories || []
  if (categories.length === 1) {
    params.append('category', categories[0])
  }
  if (filters.channelId) params.append('channel_id', filters.channelId)
  if (filters.deviceId) params.append('device_id', filters.deviceId)
  return params
}

export function buildEventApiParams(filters) {
  const params = new URLSearchParams()
  if (filters.ruleId) params.append('rule_id', filters.ruleId)
  params.append('limit', String(filters.limit || 100))
  return params
}

function parseDatetimeLocal(value) {
  if (!value) return null
  const ms = new Date(value).getTime()
  return Number.isNaN(ms) ? null : ms
}

export function formatFilterDatetime(value) {
  if (!value) return ''
  return value.replace('T', ' ')
}

export function hasEdgeErrorMessage(message) {
  return typeof message === 'string' && message.trim().length > 0
}

export function filterEventsClient(events, filters) {
  let result = (events || []).filter((event) => hasEdgeErrorMessage(event.error_message))
  if (filters.status) {
    result = result.filter((event) => event.status === filters.status)
  }
  const startMs = parseDatetimeLocal(filters.start)
  const endMs = parseDatetimeLocal(filters.end)
  if (startMs != null) {
    result = result.filter((event) => new Date(event.started_at).getTime() >= startMs)
  }
  if (endMs != null) {
    result = result.filter((event) => new Date(event.started_at).getTime() <= endMs)
  }
  return result
}

export function filterLogsClient(logs, filters) {
  let result = (logs || []).filter((log) => hasEdgeErrorMessage(log.error_message))
  if (filters?.status) {
    result = result.filter((log) => log.error_type === filters.status)
  }
  const categories = filters?.categories || []
  if (categories.length > 0) {
    result = result.filter((log) => categories.includes(log.category || 'edge_compute'))
  }
  if (filters?.channelId) {
    result = result.filter((log) => log.channel_id === filters.channelId)
  }
  if (filters?.deviceId) {
    result = result.filter((log) => log.device_id === filters.deviceId)
  }
  return result
}

export function describeFilterChips(filters, mode, rules = []) {
  const chips = []
  if (filters.ruleId) {
    const rule = rules.find((item) => item.id === filters.ruleId)
    chips.push({
      key: 'ruleId',
      label: rule ? `规则: ${rule.name}` : `规则: ${filters.ruleId}`,
    })
  }
  if (filters.start) {
    chips.push({ key: 'start', label: `起: ${formatFilterDatetime(filters.start)}` })
  }
  if (filters.end) {
    chips.push({ key: 'end', label: `止: ${formatFilterDatetime(filters.end)}` })
  }
  if (filters.status) {
    const options = mode === 'events' ? EVENT_STATUS_OPTIONS : LOG_ERROR_TYPE_OPTIONS
    const match = options.find((item) => item.value === filters.status)
    chips.push({ key: 'status', label: `${mode === 'events' ? '状态' : '错误类型'}: ${match?.label || filters.status}` })
  }
  if (mode === 'events' && filters.limit && filters.limit !== 100) {
    chips.push({ key: 'limit', label: `上限: ${filters.limit}` })
  }
  if (mode === 'logs' && filters.categories?.length) {
    const labels = filters.categories.map((item) => LOG_CATEGORY_LABELS[item] || item)
    chips.push({ key: 'categories', label: `分类: ${labels.join('、')}` })
  }
  if (mode === 'logs' && filters.channelId) {
    chips.push({ key: 'channelId', label: `通道: ${filters.channelId}` })
  }
  if (mode === 'logs' && filters.deviceId) {
    chips.push({ key: 'deviceId', label: `设备: ${filters.deviceId}` })
  }
  return chips
}
