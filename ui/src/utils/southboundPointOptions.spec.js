import { describe, expect, it, vi } from 'vitest'
import {
  fetchPointOptions,
  fetchWritablePointOptions,
  isWritablePoint,
  normalizePointOptions,
  normalizeWritablePointOptions,
  unwrapListResponse
} from './southboundPointOptions'

describe('southboundPointOptions', () => {
  it('unwrapListResponse accepts array or wrapped data', () => {
    expect(unwrapListResponse([{ id: 'p1' }])).toEqual([{ id: 'p1' }])
    expect(unwrapListResponse({ data: [{ id: 'p2' }] })).toEqual([{ id: 'p2' }])
    expect(unwrapListResponse(null)).toEqual([])
  })

  it('isWritablePoint excludes explicit read-only points', () => {
    expect(isWritablePoint({ readwrite: 'RW' })).toBe(true)
    expect(isWritablePoint({ readwrite: 'W' })).toBe(true)
    expect(isWritablePoint({ readwrite: 'R' })).toBe(false)
    expect(isWritablePoint({ readwrite: 'Subscribe' })).toBe(true)
    expect(isWritablePoint({})).toBe(true)
  })

  it('normalizeWritablePointOptions keeps controllable points with stable ids', () => {
    const options = normalizeWritablePointOptions([
      { id: 'hr_0', name: 'HR 0', readwrite: 'RW' },
      { id: 'hr_1', name: 'HR 1', readwrite: 'R' },
      { id: 'hr_2', name: 'HR 2' }
    ])

    expect(options).toEqual([
      expect.objectContaining({ label: 'HR 0', value: 'hr_0' }),
      expect.objectContaining({ label: 'HR 2', value: 'hr_2' })
    ])
  })

  it('normalizePointOptions keeps all configured points including read-only', () => {
    const options = normalizePointOptions([
      { id: 'hr_0', name: 'HR 0', readwrite: 'RW' },
      { id: 'hr_1', name: 'HR 1', readwrite: 'R' }
    ])

    expect(options).toEqual([
      expect.objectContaining({ label: 'HR 0', value: 'hr_0' }),
      expect.objectContaining({ label: 'HR 1', value: 'hr_1' })
    ])
  })

  it('fetchPointOptions prefers /points API and keeps read-only modbus HR points', async () => {
    const request = {
      get: vi.fn().mockResolvedValue([
        { id: 'hr_0', name: 'HR 0', readwrite: 'RW' },
        { id: 'hr_1', name: 'HR 1', readwrite: 'R' }
      ])
    }

    const options = await fetchPointOptions(
      request,
      'modbus-tcp-1',
      'modbus-slave-2',
      [{ id: 'hr_0', name: 'HR 0', readwrite: 'RW' }]
    )

    expect(request.get).toHaveBeenCalledWith(
      '/api/channels/modbus-tcp-1/devices/modbus-slave-2/points',
      { timeout: 8000, silent: true }
    )
    expect(options).toHaveLength(2)
    expect(options.map((o) => o.value)).toEqual(['hr_0', 'hr_1'])
  })

  it('fetchPointOptions falls back to embedded snapshot when API fails', async () => {
    const request = {
      get: vi.fn().mockRejectedValue(new Error('network error'))
    }

    const embedded = [
      { id: 'hr_1', name: 'HR 1', readwrite: 'R' },
      { id: 'hr_2', name: 'HR 2', readwrite: 'RW' }
    ]

    const options = await fetchPointOptions(
      request,
      'modbus-tcp-1',
      'modbus-slave-2',
      embedded
    )

    expect(options.map((o) => o.value)).toEqual(['hr_1', 'hr_2'])
  })

  it('fetchWritablePointOptions prefers /points API over embedded snapshot', async () => {
    const request = {
      get: vi.fn().mockResolvedValue([
        { id: 'hr_0', name: 'HR 0', readwrite: 'RW' },
        { id: 'hr_1', name: 'HR 1', readwrite: 'RW' },
        { id: 'hr_2', name: 'HR 2', readwrite: 'R' }
      ])
    }

    const embedded = [{ id: 'hr_0', name: 'HR 0', readwrite: 'RW' }]
    const options = await fetchWritablePointOptions(
      request,
      'modbus-tcp-1',
      'modbus-slave-7',
      embedded
    )

    expect(request.get).toHaveBeenCalledWith(
      '/api/channels/modbus-tcp-1/devices/modbus-slave-7/points',
      { timeout: 8000, silent: true }
    )
    expect(options).toHaveLength(2)
    expect(options.map((o) => o.value)).toEqual(['hr_0', 'hr_1'])
  })

  it('fetchWritablePointOptions falls back to embedded when API fails', async () => {
    const request = {
      get: vi.fn().mockRejectedValue(new Error('network error'))
    }

    const embedded = [
      { id: 'coil_0', name: 'Coil 0', readwrite: 'RW' },
      { id: 'coil_1', name: 'Coil 1', readwrite: 'R' }
    ]

    const options = await fetchWritablePointOptions(
      request,
      'modbus-tcp-1',
      'modbus-slave-7',
      embedded
    )

    expect(options).toEqual([
      expect.objectContaining({ label: 'Coil 0', value: 'coil_0' })
    ])
  })
})
