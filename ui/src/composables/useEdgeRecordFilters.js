export const EVENT_STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '已完成', value: 'completed' },
  { label: '运行中', value: 'running' },
  { label: '错误', value: 'error' },
  { label: '已丢弃', value: 'dropped' },
]

export const LOG_STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '告警', value: 'ALARM' },
  { label: '警告', value: 'WARNING' },
  { label: '正常', value: 'NORMAL' },
]

export function createDefaultFilters(mode) {
  const base = {
    ruleId: '',
    start: '',
    end: '',
    status: '',
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
  if (mode === 'events' && filters.limit && filters.limit !== 100) count++
  return count
}

export function buildLogApiParams(filters) {
  const params = new URLSearchParams()
  if (filters.start) params.append('start_date', filters.start.replace('T', ' '))
  if (filters.end) params.append('end_date', filters.end.replace('T', ' '))
  if (filters.ruleId) params.append('rule_id', filters.ruleId)
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

export function filterEventsClient(events, filters) {
  let result = events || []
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
  if (!filters?.status) return logs || []
  return (logs || []).filter((log) => log.status === filters.status)
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
    const options = mode === 'events' ? EVENT_STATUS_OPTIONS : LOG_STATUS_OPTIONS
    const match = options.find((item) => item.value === filters.status)
    chips.push({ key: 'status', label: `状态: ${match?.label || filters.status}` })
  }
  if (mode === 'events' && filters.limit && filters.limit !== 100) {
    chips.push({ key: 'limit', label: `上限: ${filters.limit}` })
  }
  return chips
}
