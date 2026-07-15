import { describe, it, expect, beforeEach } from 'vitest'
import {
  extractCallerInfo,
  findLogEntryIndex,
  formatLogDetailTime,
  formatLogFieldValue,
  formatLogRawJson,
  formatLogScopeLabel,
  formatLogTime,
  getLogCategory,
  getLogChannelId,
  getLogDeviceId,
  getLogEntryKey,
  getLogExtraFields,
  getLogLevelClass,
  getLogMetadataFields,
  isSameLogEntry,
  isLogInList,
  matchesLogViewerFilters,
  normalizeLogEntry,
  resetLogEntryIdSequence,
} from '@/utils/logFormat'

describe('normalizeLogEntry', () => {
  beforeEach(() => {
    resetLogEntryIdSequence()
  })

  it('maps common zap field aliases onto ts, level, and msg', () => {
    const entry = normalizeLogEntry({
      timestamp: '2026-07-06T02:00:26.019Z',
      severity: 'warn',
      message: '[SLA] scan engine threshold exceeded',
      code: 'scan_miss_deadline_exceeded',
    })
    expect(entry).toMatchObject({
      entryId: 1,
      ts: '2026-07-06T02:00:26.019Z',
      level: 'warn',
      msg: '[SLA] scan engine threshold exceeded',
      code: 'scan_miss_deadline_exceeded',
    })
  })

  it('assigns unique entry ids to each normalized log', () => {
    const sharedFields = {
      ts: '2026-07-06T02:00:26.019Z',
      level: 'WARN',
      msg: '[SLA] scan engine threshold exceeded',
      caller: 'internal/core/scan_engine.go:1354',
    }
    const first = normalizeLogEntry(sharedFields)
    const second = normalizeLogEntry(sharedFields)
    expect(first.entryId).not.toBe(second.entryId)
  })

  it('wraps non-object payloads as plain messages', () => {
    expect(normalizeLogEntry('plain text')).toEqual({
      entryId: 1,
      ts: expect.any(String),
      level: 'INFO',
      msg: 'plain text',
    })
  })
})

describe('getLogCategory', () => {
  it('prefers explicit category and normalizes aliases', () => {
    expect(getLogCategory({ category: 'southbound' })).toBe('southbound')
    expect(getLogCategory({ logger: 'core.scan_engine' })).toBe('southbound')
  })
})

describe('getLogChannelId/getLogDeviceId', () => {
  it('reads normalized and legacy field names', () => {
    expect(getLogChannelId({ channelID: 'ch1' })).toBe('ch1')
    expect(getLogDeviceId({ deviceKey: 'dev1' })).toBe('dev1')
  })
})

describe('matchesLogViewerFilters', () => {
  const log = {
    level: 'WARN',
    category: 'southbound',
    channel_id: 'ch1',
    device_id: 'dev1',
  }

  it('matches level, category, channel, and device filters', () => {
    expect(matchesLogViewerFilters(log, {
      level: 'WARN',
      categories: ['southbound'],
      channelId: 'ch1',
      deviceId: 'dev1',
    })).toBe(true)
    expect(matchesLogViewerFilters(log, { categories: ['system'] })).toBe(false)
    expect(matchesLogViewerFilters(log, { channelId: 'ch2' })).toBe(false)
  })
})

describe('getLogExtraFields', () => {
  it('returns sorted metadata fields and skips reserved keys', () => {
    expect(getLogExtraFields({
      ts: '2026-07-06T02:00:26.019Z',
      level: 'warn',
      msg: '[SLA] scan engine threshold exceeded',
      category: 'southbound',
      channel_id: 'ch1',
      device_id: 'dev1',
      caller: 'scan_engine.go:1354',
      logger: 'core.scan_engine',
      metric: 'scan_miss_deadline_total',
      code: 'scan_miss_deadline_exceeded',
      value: 26,
      threshold: 0,
      message: 'scan miss deadline total 26 exceeds 0',
    })).toEqual({
      code: 'scan_miss_deadline_exceeded',
      message: 'scan miss deadline total 26 exceeds 0',
      metric: 'scan_miss_deadline_total',
      threshold: '0',
      value: '26',
    })
  })

  it('stringifies object values', () => {
    expect(getLogExtraFields({ msg: 'x', payload: { ok: true } })).toEqual({
      payload: '{"ok":true}',
    })
  })
})

describe('formatLogScopeLabel', () => {
  it('formats channel and device labels with name maps', () => {
    expect(formatLogScopeLabel(
      { channel_id: 'ch1', device_id: 'dev1' },
      { ch1: 'Modbus 通道' },
      { dev1: '从站 1' }
    )).toBe('Modbus 通道 / 从站 1')
  })
})

describe('formatLogFieldValue', () => {
  it('stringifies objects for display', () => {
    expect(formatLogFieldValue({ ok: true })).toBe('{"ok":true}')
  })
})

describe('formatLogTime', () => {
  it('formats timestamps with millisecond precision', () => {
    expect(formatLogTime('2026-07-06T02:00:26.019Z')).toMatch(/26.*019/)
  })
})

describe('getLogLevelClass', () => {
  it('maps warning aliases to warn styling', () => {
    expect(getLogLevelClass('WARNING')).toBe('warn')
    expect(getLogLevelClass('ERROR')).toBe('error')
  })
})

describe('extractCallerInfo', () => {
  it('uses zap caller path:line directly', () => {
    expect(extractCallerInfo({ caller: 'core/scan_engine.go:1354' })).toEqual({
      location: 'core/scan_engine.go:1354',
    })
    expect(extractCallerInfo({ caller: 'opcua/opcua.go:679' })).toEqual({
      location: 'opcua/opcua.go:679',
    })
    expect(extractCallerInfo({ caller: 'internal/core/scan_engine.go:1354' })).toEqual({
      location: 'internal/core/scan_engine.go:1354',
    })
  })

  it('returns null when caller is missing', () => {
    expect(extractCallerInfo({ msg: 'x' })).toBeNull()
    expect(extractCallerInfo({ function: 'main.run' })).toBeNull()
  })

  it('falls back to raw caller when line suffix is absent', () => {
    expect(extractCallerInfo({ caller: 'unknown-location' })).toEqual({
      location: 'unknown-location',
    })
  })

  it('merges separate file and line fields when caller is absent', () => {
    expect(extractCallerInfo({ file: 'opcua/opcua.go', line: '679' })).toEqual({
      location: 'opcua/opcua.go:679',
    })
    expect(extractCallerInfo({ filePath: 'core/scan_engine.go', line: 1354 })).toEqual({
      location: 'core/scan_engine.go:1354',
    })
  })
})

describe('getLogMetadataFields', () => {
  it('collects category, logger, scope, and stacktrace', () => {
    expect(getLogMetadataFields({
      category: 'southbound',
      logger: 'core.scan_engine',
      channel_id: 'ch1',
      device_id: 'dev1',
      stacktrace: 'panic: boom',
    })).toEqual({
      category: '南向',
      logger: 'core.scan_engine',
      channel_id: 'ch1',
      device_id: 'dev1',
      stacktrace: 'panic: boom',
    })
  })
})

describe('formatLogDetailTime', () => {
  it('formats full locale timestamps', () => {
    expect(formatLogDetailTime('2026-07-06T02:00:26.019Z')).toMatch(/2026/)
  })
})

describe('formatLogRawJson', () => {
  it('pretty prints log objects', () => {
    expect(formatLogRawJson({ msg: 'hello', level: 'info' })).toBe(
      '{\n  "msg": "hello",\n  "level": "info"\n}'
    )
  })
})

describe('isSameLogEntry', () => {
  beforeEach(() => {
    resetLogEntryIdSequence()
  })

  it('matches by reference or stable fields', () => {
    const a = { ts: '1', msg: 'm', caller: 'f.go:1', level: 'INFO' }
    const b = { ts: '1', msg: 'm', caller: 'f.go:1', level: 'INFO' }
    expect(isSameLogEntry(a, a)).toBe(true)
    expect(isSameLogEntry(a, b)).toBe(true)
    expect(isSameLogEntry(a, { ...b, msg: 'other' })).toBe(false)
  })

  it('uses entryId when present so repeated log lines stay distinct', () => {
    const sharedFields = {
      ts: '2026-07-06T02:00:26.019Z',
      level: 'WARN',
      msg: '[SLA] scan engine threshold exceeded',
      caller: 'internal/core/scan_engine.go:1354',
    }
    const first = normalizeLogEntry(sharedFields)
    const second = normalizeLogEntry(sharedFields)
    expect(isSameLogEntry(first, second)).toBe(false)
    expect(isSameLogEntry(first, first)).toBe(true)
  })
})

describe('getLogEntryKey', () => {
  beforeEach(() => {
    resetLogEntryIdSequence()
  })

  it('prefers entryId for stable list keys', () => {
    const entry = normalizeLogEntry({ msg: 'hello' })
    expect(getLogEntryKey(entry)).toBe(String(entry.entryId))
  })
})

describe('findLogEntryIndex/isLogInList', () => {
  const logs = [
    { ts: '1', msg: 'a', caller: 'f.go:1', level: 'INFO' },
    { ts: '2', msg: 'b', caller: 'f.go:2', level: 'WARN' },
  ]

  it('finds matching entries and avoids duplicates', () => {
    expect(findLogEntryIndex(logs, logs[1])).toBe(1)
    expect(findLogEntryIndex(logs, { ts: '2', msg: 'b', caller: 'f.go:2', level: 'WARN' })).toBe(1)
    expect(findLogEntryIndex(logs, { ts: '9', msg: 'x', caller: 'f.go:9', level: 'ERROR' })).toBe(-1)
    expect(isLogInList(logs, logs[0])).toBe(true)
    expect(isLogInList(logs, null)).toBe(false)
  })
})
