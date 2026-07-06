import { describe, it, expect } from 'vitest'
import {
  buildRulePipeline,
  getPipelineSummary,
  applyExecutionPhase,
  inferEvalOutcome,
} from './ruleFlow'

describe('buildRulePipeline', () => {
  const baseRule = {
    id: 'r1',
    name: 'e1',
    type: 'threshold',
    enable: true,
    trigger_mode: 'always',
    priority: 0,
    sources: [{ channel_id: 'ch1', device_id: 'd1', point_id: 'p1', alias: 't1' }],
    condition: 't1 > 50',
    state: { duration: '10s', count: 3 },
    actions: [{ type: 'log', config: { message: 'alarm' } }],
  }

  it('marks state hold as active when status is WARNING', () => {
    const steps = buildRulePipeline(baseRule, {
      current_status: 'WARNING',
      condition_count: 2,
      execution_phase: 'state_hold',
    })
    const evaluate = steps.find(s => s.id === 'evaluate')
    expect(evaluate?.evalOutcome).toBe('satisfied')
    const hold = steps.find(s => s.id === 'state-hold')
    expect(hold?.status).toBe('active')
    expect(hold?.meta).toContain('2')
    const summary = getPipelineSummary(steps, { current_status: 'WARNING', execution_phase: 'state_hold' })
    expect(summary.phase).toBe('running')
    expect(summary.label).toBe('状态维持')
  })

  it('shows monitoring idle for NORMAL without error', () => {
    const steps = buildRulePipeline(baseRule, {
      current_status: 'NORMAL',
      execution_phase: 'idle',
    })
    const evaluate = steps.find(s => s.id === 'evaluate')
    const trigger = steps.find(s => s.id === 'trigger')
    expect(evaluate?.status).toBe('completed')
    expect(evaluate?.evalOutcome).toBe('unsatisfied')
    expect(trigger?.status).toBe('idle')
    const summary = getPipelineSummary(steps, { current_status: 'NORMAL', execution_phase: 'idle' })
    expect(summary.phase).toBe('idle')
    expect(summary.label).toBe('监控中')
  })

  it('does not show stopped for NORMAL enabled rules', () => {
    const steps = buildRulePipeline(baseRule, { current_status: 'NORMAL' })
    expect(steps.some(s => s.status === 'stopped')).toBe(false)
  })

  it('marks trigger pending when WARNING without state hold', () => {
    const rule = { ...baseRule, state: { duration: '0s', count: 0 } }
    const steps = buildRulePipeline(rule, {
      current_status: 'WARNING',
      execution_phase: 'trigger',
    })
    const trigger = steps.find(s => s.id === 'trigger')
    expect(trigger?.status).toBe('pending')
    const summary = getPipelineSummary(steps, { current_status: 'WARNING', execution_phase: 'trigger' })
    expect(summary.label).toBe('触发决策')
  })

  it('marks actions from execution_phase action index', () => {
    const steps = buildRulePipeline(
      {
        ...baseRule,
        actions: [
          { type: 'log', config: { message: 'a' } },
          { type: 'log', config: { message: 'b' } },
        ],
      },
      {
        current_status: 'ALARM',
        execution_phase: 'action',
        execution_action_index: 1,
        last_trigger: new Date().toISOString(),
      },
    )
    expect(steps.find(s => s.id === 'action-0')?.status).toBe('completed')
    expect(steps.find(s => s.id === 'action-1')?.status).toBe('active')
    const summary = getPipelineSummary(steps, { current_status: 'ALARM', execution_phase: 'action' })
    expect(summary.phase).toBe('running')
    expect(summary.label).toBe('执行动作')
  })

  it('marks all steps completed when execution_phase is completed', () => {
    const steps = buildRulePipeline(baseRule, {
      current_status: 'ALARM',
      execution_phase: 'completed',
      last_trigger: new Date(Date.now() - 60000).toISOString(),
      action_last_runs: { 0: new Date().toISOString() },
    })
    expect(steps.find(s => s.id === 'trigger')?.status).toBe('completed')
    expect(steps.find(s => s.id === 'action-0')?.status).toBe('completed')
    const summary = getPipelineSummary(steps, { current_status: 'ALARM', execution_phase: 'completed' })
    expect(summary.phase).toBe('completed')
  })

  it('marks trigger and actions when ALARM with recent trigger (legacy heuristic)', () => {
    const steps = buildRulePipeline(baseRule, {
      current_status: 'ALARM',
      last_trigger: new Date().toISOString(),
      trigger_count: 1,
    })
    const trigger = steps.find(s => s.id === 'trigger')
    expect(trigger?.status).toBe('completed')
    const summary = getPipelineSummary(steps, { current_status: 'ALARM' })
    expect(['running', 'completed', 'idle']).toContain(summary.phase)
  })

  it('returns idle pipeline for disabled rules', () => {
    const steps = buildRulePipeline({ ...baseRule, enable: false }, { current_status: 'ALARM' })
    expect(steps.every(s => s.status === 'idle' || s.status === 'skipped')).toBe(true)
  })

  it('marks error step stopped when execution_phase is error', () => {
    const steps = buildRulePipeline(baseRule, {
      current_status: 'NORMAL',
      execution_phase: 'error',
      error_message: 'eval failed',
    })
    const evaluate = steps.find(s => s.id === 'evaluate')
    expect(evaluate?.status).toBe('stopped')
    expect(evaluate?.evalOutcome).toBe('error')
    const summary = getPipelineSummary(steps, { error_message: 'eval failed', execution_phase: 'error' })
    expect(summary.phase).toBe('stopped')
  })
})

describe('inferEvalOutcome', () => {
  it('returns null while evaluate step is active', () => {
    expect(inferEvalOutcome({ current_status: 'NORMAL' }, true, 'active')).toBeNull()
  })

  it('maps NORMAL completed evaluate to unsatisfied', () => {
    expect(inferEvalOutcome({ current_status: 'NORMAL' }, true, 'completed')).toBe('unsatisfied')
  })

  it('maps WARNING/ALARM to satisfied', () => {
    expect(inferEvalOutcome({ current_status: 'WARNING' }, true, 'completed')).toBe('satisfied')
    expect(inferEvalOutcome({ current_status: 'ALARM' }, true, 'completed')).toBe('satisfied')
  })

  it('maps stopped evaluate to error', () => {
    expect(inferEvalOutcome({ error_message: 'bad expr' }, true, 'stopped')).toBe('error')
  })
})

describe('applyExecutionPhase', () => {
  it('highlights window step during window phase', () => {
    const base = [
      { id: 'sources', kind: 'source', label: '数据源', status: 'completed' },
      { id: 'window', kind: 'process', label: '窗口聚合', status: 'completed' },
      { id: 'evaluate', kind: 'process', label: '条件评估', status: 'idle' },
    ]
    const result = applyExecutionPhase(base, { execution_phase: 'window' })
    expect(result.find(s => s.id === 'window')?.status).toBe('active')
    expect(result.find(s => s.id === 'sources')?.status).toBe('completed')
  })
})
