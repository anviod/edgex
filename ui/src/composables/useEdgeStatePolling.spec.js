import { describe, it, expect } from 'vitest'
import { resolveEdgeStatePollInterval, EDGE_STATE_POLL } from './useEdgeStatePolling'

describe('resolveEdgeStatePollInterval', () => {
  it('uses 1s on status tab when page visible', () => {
    expect(resolveEdgeStatePollInterval({ tab: 'status', rulesViewMode: 'flow', pageVisible: true }))
      .toBe(EDGE_STATE_POLL.STATUS)
  })

  it('uses 2s on rules flow view when visible', () => {
    expect(resolveEdgeStatePollInterval({ tab: 'rules', rulesViewMode: 'flow', pageVisible: true }))
      .toBe(EDGE_STATE_POLL.RULES_FLOW)
  })

  it('uses slower interval on rules table view when visible', () => {
    expect(resolveEdgeStatePollInterval({ tab: 'rules', rulesViewMode: 'table', pageVisible: true }))
      .toBe(EDGE_STATE_POLL.RULES_TABLE)
  })

  it('slows down when page is hidden', () => {
    expect(resolveEdgeStatePollInterval({ tab: 'status', rulesViewMode: 'flow', pageVisible: false }))
      .toBe(EDGE_STATE_POLL.HIDDEN)
  })

  it('does not poll on metrics tab', () => {
    expect(resolveEdgeStatePollInterval({ tab: 'metrics', rulesViewMode: 'flow', pageVisible: true }))
      .toBeNull()
  })
})
