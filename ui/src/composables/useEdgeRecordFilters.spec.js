import { describe, it, expect } from 'vitest'
import {
  buildEventApiParams,
  buildLogApiParams,
  countActiveFilters,
  createDefaultFilters,
  describeFilterChips,
  filterEventsClient,
  filterLogsClient,
} from './useEdgeRecordFilters'

describe('useEdgeRecordFilters', () => {
  it('builds log API params from datetime-local values', () => {
    const params = buildLogApiParams({
      start: '2026-01-01T08:00',
      end: '2026-01-02T18:30',
      ruleId: 'rule-1',
      categories: ['edge_compute'],
      channelId: 'ch1',
      deviceId: 'dev1',
    })
    expect(params.get('start_date')).toBe('2026-01-01 08:00')
    expect(params.get('end_date')).toBe('2026-01-02 18:30')
    expect(params.get('rule_id')).toBe('rule-1')
    expect(params.get('category')).toBe('edge_compute')
    expect(params.get('channel_id')).toBe('ch1')
    expect(params.get('device_id')).toBe('dev1')
  })

  it('omits category API param when multiple categories selected', () => {
    const params = buildLogApiParams({
      categories: ['edge_compute', 'system'],
    })
    expect(params.get('category')).toBeNull()
  })

  it('builds event API params with rule and limit', () => {
    const params = buildEventApiParams({ ruleId: 'rule-2', limit: 50 })
    expect(params.get('rule_id')).toBe('rule-2')
    expect(params.get('limit')).toBe('50')
  })

  it('counts active filters per mode', () => {
    const eventFilters = { ...createDefaultFilters('events'), ruleId: 'a', status: 'error', limit: 200 }
    expect(countActiveFilters(eventFilters, 'events')).toBe(3)

    const logFilters = {
      ...createDefaultFilters('logs'),
      start: '2026-01-01T00:00',
      categories: ['system'],
      channelId: 'ch1',
    }
    expect(countActiveFilters(logFilters, 'logs')).toBe(3)
  })

  it('filters events by status and time on client', () => {
    const events = [
      { id: '1', status: 'error', error_message: 'eval failed', started_at: '2026-01-01T10:00:00' },
      { id: '2', status: 'dropped', error_message: 'pool full', started_at: '2026-01-01T11:00:00' },
      { id: '3', status: 'error', error_message: 'later', started_at: '2026-01-02T10:00:00' },
    ]
    const filtered = filterEventsClient(events, {
      status: 'error',
      start: '2026-01-01T09:00',
      end: '2026-01-01T12:00',
    })
    expect(filtered.map((item) => item.id)).toEqual(['1'])
  })

  it('filters error logs by error_type on client', () => {
    const logs = [
      { error_type: 'formula_error', error_message: 'bad expr' },
      { error_type: 'execution_error', error_message: 'write failed' },
      { error_type: 'other', error_message: '' },
    ]
    expect(filterLogsClient(logs, { status: 'formula_error' })).toHaveLength(1)
    expect(filterLogsClient(logs, { status: '' })).toHaveLength(2)
  })

  it('filters error logs by category, channel, and device on client', () => {
    const logs = [
      { error_message: 'a', category: 'edge_compute', channel_id: 'ch1', device_id: 'dev1' },
      { error_message: 'b', category: 'system', channel_id: 'ch1', device_id: 'dev1' },
      { error_message: 'c', category: 'northbound', channel_id: 'ch2', device_id: 'dev2' },
    ]
    expect(filterLogsClient(logs, { categories: ['system'] })).toHaveLength(1)
    expect(filterLogsClient(logs, { categories: ['edge_compute', 'system'] })).toHaveLength(2)
    expect(filterLogsClient(logs, { channelId: 'ch1' })).toHaveLength(2)
    expect(filterLogsClient(logs, { deviceId: 'dev2' })).toHaveLength(1)
  })

  it('describes log scope filter chips', () => {
    const chips = describeFilterChips(
      {
        categories: ['edge_compute', 'system'],
        channelId: 'ch1',
        deviceId: 'dev1',
      },
      'logs'
    )
    expect(chips.map((item) => item.key)).toEqual(['categories', 'channelId', 'deviceId'])
    expect(chips[0].label).toContain('边缘计算')
  })

  it('excludes logs without error_message', () => {
    const logs = [
      { error_type: 'other', error_message: '' },
      { error_type: 'formula_error', error_message: 'bad expr' },
    ]
    expect(filterLogsClient(logs, { status: '' })).toHaveLength(1)
  })

  it('excludes events without error_message', () => {
    const events = [
      { id: '1', status: 'error', error_message: '' },
      { id: '2', status: 'error', error_message: 'boom' },
    ]
    expect(filterEventsClient(events, {})).toEqual([events[1]])
  })
})
