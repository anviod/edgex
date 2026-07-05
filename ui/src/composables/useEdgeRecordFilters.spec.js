import { describe, it, expect } from 'vitest'
import {
  buildEventApiParams,
  buildLogApiParams,
  countActiveFilters,
  createDefaultFilters,
  filterEventsClient,
  filterLogsClient,
} from './useEdgeRecordFilters'

describe('useEdgeRecordFilters', () => {
  it('builds log API params from datetime-local values', () => {
    const params = buildLogApiParams({
      start: '2026-01-01T08:00',
      end: '2026-01-02T18:30',
      ruleId: 'rule-1',
    })
    expect(params.get('start_date')).toBe('2026-01-01 08:00')
    expect(params.get('end_date')).toBe('2026-01-02 18:30')
    expect(params.get('rule_id')).toBe('rule-1')
  })

  it('builds event API params with rule and limit', () => {
    const params = buildEventApiParams({ ruleId: 'rule-2', limit: 50 })
    expect(params.get('rule_id')).toBe('rule-2')
    expect(params.get('limit')).toBe('50')
  })

  it('counts active filters per mode', () => {
    const eventFilters = { ...createDefaultFilters('events'), ruleId: 'a', status: 'error', limit: 200 }
    expect(countActiveFilters(eventFilters, 'events')).toBe(3)

    const logFilters = { ...createDefaultFilters('logs'), start: '2026-01-01T00:00' }
    expect(countActiveFilters(logFilters, 'logs')).toBe(1)
  })

  it('filters events by status and time on client', () => {
    const events = [
      { id: '1', status: 'completed', started_at: '2026-01-01T10:00:00' },
      { id: '2', status: 'error', started_at: '2026-01-01T11:00:00' },
      { id: '3', status: 'completed', started_at: '2026-01-02T10:00:00' },
    ]
    const filtered = filterEventsClient(events, {
      status: 'completed',
      start: '2026-01-01T09:00',
      end: '2026-01-01T12:00',
    })
    expect(filtered.map((item) => item.id)).toEqual(['1'])
  })

  it('filters minute logs by status on client', () => {
    const logs = [
      { status: 'ALARM' },
      { status: 'NORMAL' },
    ]
    expect(filterLogsClient(logs, { status: 'ALARM' })).toHaveLength(1)
    expect(filterLogsClient(logs, { status: '' })).toHaveLength(2)
  })
})
