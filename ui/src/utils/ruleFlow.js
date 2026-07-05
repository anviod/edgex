/** Edge compute rule pipeline — step labels & runtime status inference */

export const ACTION_TYPE_LABELS = {
  log: 'Log',
  device_control: '设备控制',
  sequence: '顺序执行',
  check: '校验',
  delay: '延时',
  mqtt: 'MQTT',
  http: 'HTTP',
  database: '存储',
}

export const RULE_TYPE_LABELS = {
  threshold: '阈值触发',
  calculation: '计算公式',
  window: '时间窗口',
  state: '状态持续',
}

export const STEP_STATUS = {
  idle: { label: '待执行', shortLabel: '待', color: 'gray', className: 'rule-flow-node--idle' },
  pending: { label: '进行中', shortLabel: '中', color: 'arcoblue', className: 'rule-flow-node--pending' },
  active: { label: '当前步骤', shortLabel: '当前', color: 'orange', className: 'rule-flow-node--active' },
  completed: { label: '已完成', shortLabel: '完', color: 'green', className: 'rule-flow-node--completed' },
  stopped: { label: '已停止', shortLabel: '停', color: 'red', className: 'rule-flow-node--stopped' },
  skipped: { label: '已跳过', shortLabel: '跳', color: 'gray', className: 'rule-flow-node--skipped' },
}

function truncate(text, max = 18) {
  if (!text) return ''
  const s = String(text)
  return s.length > max ? `${s.slice(0, max)}…` : s
}

function formatActionLabel(action, index) {
  const typeLabel = ACTION_TYPE_LABELS[action?.type] || action?.type || '动作'
  let detail = ''
  const cfg = action?.config || {}
  switch (action?.type) {
    case 'mqtt':
      detail = cfg.topic || cfg.mqtt_id || ''
      break
    case 'http':
      detail = cfg.url || cfg.http_id || ''
      break
    case 'device_control':
      detail = cfg.point_id || cfg.device_id || ''
      break
    case 'delay':
      detail = cfg.duration || ''
      break
    case 'check':
      detail = truncate(cfg.condition, 14)
      break
    case 'sequence':
      detail = `${(cfg.steps || []).length} 步`
      break
    case 'log':
      detail = truncate(cfg.message, 14)
      break
    default:
      break
  }
  return detail ? `${index + 1}.${typeLabel}·${truncate(detail, 14)}` : `${index + 1}.${typeLabel}`
}

function isRecent(ts, windowMs = 30000) {
  if (!ts) return false
  const t = new Date(ts).getTime()
  if (Number.isNaN(t) || t <= 0) return false
  return Date.now() - t < windowMs
}

function ruleNeedsStateHold(rule) {
  return (
    (rule.type === 'state' || rule.type === 'threshold') &&
    rule.state &&
    ((rule.state.duration && rule.state.duration !== '0s') || rule.state.count > 0)
  )
}

function getActionLastRun(lastRuns, index) {
  return lastRuns?.[index] ?? lastRuns?.[String(index)]
}

function inferActionStatuses(actions, state, enabled, status, hasError) {
  const lastRuns = state?.action_last_runs || {}
  const recentTrigger = isRecent(state?.last_trigger)
  const actionPhase = state?.execution_phase
  const actionIndex = state?.execution_action_index ?? 0

  return actions.map((action, index) => {
    let actionStatus = 'idle'

    if (!enabled) {
      return { action, index, actionStatus }
    }

    if (hasError) {
      actionStatus = 'stopped'
      return { action, index, actionStatus }
    }

    if (status === 'WARNING') {
      actionStatus = 'idle'
      return { action, index, actionStatus }
    }

    if (status !== 'ALARM') {
      actionStatus = 'idle'
      return { action, index, actionStatus }
    }

    const lastRun = getActionLastRun(lastRuns, index)

    if (actionPhase === 'action') {
      if (index < actionIndex) {
        actionStatus = 'completed'
      } else if (index === actionIndex) {
        actionStatus = 'active'
      } else if (lastRun) {
        actionStatus = 'completed'
      } else {
        actionStatus = 'idle'
      }
      return { action, index, actionStatus }
    }

    if (actionPhase === 'completed') {
      actionStatus = lastRun ? 'completed' : 'skipped'
      return { action, index, actionStatus }
    }

    if (lastRun && (!state?.last_trigger || new Date(lastRun) >= new Date(state.last_trigger))) {
      actionStatus = 'completed'
    } else if (recentTrigger) {
      actionStatus = index === 0 ? 'active' : 'idle'
    } else if (lastRun) {
      actionStatus = 'completed'
    } else {
      actionStatus = 'skipped'
    }

    return { action, index, actionStatus }
  })
}

/**
 * Apply backend execution_phase when available — authoritative over heuristics.
 */
export function applyExecutionPhase(steps, state) {
  const phase = state?.execution_phase
  if (!phase) return steps

  const actionIndex = state?.execution_action_index ?? 0
  const hasError = !!state?.error_message
  const status = state?.current_status || 'NORMAL'

  const phaseToStepId = {
    window: 'window',
    evaluate: 'evaluate',
    state_hold: 'state-hold',
    trigger: 'trigger',
    error: hasError ? findErrorStepId(steps, state) : 'evaluate',
  }

  let activeStepId = phaseToStepId[phase]

  if (phase === 'action') {
    activeStepId = `action-${actionIndex}`
  }

  if (phase === 'completed') {
    return steps.map(step => ({
      ...step,
      status: step.kind === 'action' && step.status === 'skipped' ? 'skipped' : markCompletedOrSkipped(step, status),
    }))
  }

  if (phase === 'idle') {
    return steps.map(step => ({
      ...step,
      status: inferIdleStepStatus(step, status, hasError),
    }))
  }

  if (!activeStepId) return steps

  let passedActive = false
  return steps.map(step => {
    if (step.id === activeStepId) {
      passedActive = true
      if (hasError && phase === 'error') return { ...step, status: 'stopped' }
      if (phase === 'state_hold' || (phase === 'trigger' && status === 'WARNING')) {
        return { ...step, status: step.id === 'trigger' ? 'pending' : 'active' }
      }
      return { ...step, status: 'active' }
    }
    if (!passedActive) {
      return { ...step, status: step.status === 'stopped' ? 'stopped' : 'completed' }
    }
    return { ...step, status: step.kind === 'action' ? 'idle' : 'idle' }
  })
}

function findErrorStepId(steps, state) {
  const phase = state?.execution_phase
  if (phase === 'window') return 'window'
  if (phase === 'state_hold') return 'state-hold'
  if (phase === 'trigger' || phase === 'action') return 'trigger'
  return 'evaluate'
}

function markCompletedOrSkipped(step, status) {
  if (step.kind === 'source') return 'completed'
  if (step.kind === 'action') {
    return step.status === 'skipped' ? 'skipped' : 'completed'
  }
  if (status === 'NORMAL' && (step.id === 'trigger' || step.kind === 'action')) {
    return step.id === 'trigger' ? 'idle' : 'idle'
  }
  if (step.status === 'idle' || step.status === 'skipped') {
    return step.status
  }
  return 'completed'
}

function inferIdleStepStatus(step, status, hasError) {
  if (hasError) {
    if (step.id === 'evaluate' || step.id === 'window') return 'stopped'
    return step.status === 'completed' ? 'completed' : 'idle'
  }
  if (status === 'NORMAL') {
    if (step.kind === 'source' || step.id === 'evaluate' || step.id === 'window') return 'completed'
    if (step.id === 'state-hold') return 'skipped'
    if (step.id === 'trigger') return 'idle'
    return 'idle'
  }
  if (status === 'WARNING') {
    if (step.id === 'state-hold') return 'active'
    if (step.id === 'trigger') return 'pending'
    if (step.kind === 'source' || step.id === 'evaluate' || step.id === 'window') return 'completed'
    return 'idle'
  }
  if (status === 'ALARM') {
    if (step.id === 'trigger' || step.kind === 'source' || step.id === 'evaluate' || step.id === 'window' || step.id === 'state-hold') {
      return step.id === 'state-hold' || step.id === 'window' ? 'completed' : 'completed'
    }
    return step.status
  }
  return step.status
}

/**
 * Build ordered pipeline steps for visualization.
 * Uses execution_phase from backend when present; otherwise infers from RuleRuntimeState.
 */
export function buildRulePipeline(rule, state) {
  if (!rule) return []

  const steps = []
  const enabled = !!rule.enable
  const status = state?.current_status || 'NORMAL'
  const hasError = !!state?.error_message
  const sourceCount = (rule.sources || []).filter(s => s.channel_id && s.point_id).length
  const needsStateHold = ruleNeedsStateHold(rule)

  // 1. Sources
  steps.push({
    id: 'sources',
    kind: 'source',
    label: '数据源',
    sublabel: sourceCount ? `${sourceCount} 点位` : '未配置',
    status: !enabled ? 'idle' : sourceCount > 0 ? 'completed' : 'stopped',
  })

  // 2. Window aggregation (window rules)
  if (rule.type === 'window' && rule.window) {
    const aggr = rule.window.aggr_func || 'avg'
    const size = rule.window.size || '-'
    let windowStatus = 'idle'
    if (enabled) {
      if (hasError) windowStatus = 'stopped'
      else if (status === 'WARNING') windowStatus = 'completed'
      else if (status === 'ALARM') windowStatus = 'completed'
      else windowStatus = 'completed'
    }
    steps.push({
      id: 'window',
      kind: 'process',
      label: '窗口聚合',
      sublabel: `${aggr.toUpperCase()} · ${size}`,
      status: windowStatus,
    })
  }

  // 3. Evaluation
  let evalLabel = '条件评估'
  let evalSublabel = truncate(rule.condition, 18)
  if (rule.type === 'calculation') {
    evalLabel = '公式计算'
    evalSublabel = truncate(rule.expression, 18)
  }

  let evalStatus = 'idle'
  if (enabled) {
    if (hasError) evalStatus = 'stopped'
    else if (status === 'NORMAL') evalStatus = 'completed'
    else evalStatus = 'completed'
  }
  steps.push({
    id: 'evaluate',
    kind: 'process',
    label: evalLabel,
    sublabel: evalSublabel || '—',
    status: evalStatus,
  })

  // 4. State hold (threshold / state)
  if (needsStateHold) {
    const parts = []
    if (rule.state.duration && rule.state.duration !== '0s') parts.push(rule.state.duration)
    if (rule.state.count > 0) parts.push(`×${rule.state.count}`)
    let holdStatus = 'idle'
    if (enabled) {
      if (hasError) holdStatus = 'stopped'
      else if (status === 'WARNING') holdStatus = 'active'
      else if (status === 'ALARM') holdStatus = 'completed'
      else holdStatus = 'skipped'
    }
    steps.push({
      id: 'state-hold',
      kind: 'process',
      label: '状态维持',
      sublabel: parts.join(' · ') || '—',
      status: holdStatus,
      meta: state?.condition_count ? `满足${state.condition_count}次` : undefined,
    })
  }

  // 5. Trigger gate
  let triggerStatus = 'idle'
  if (enabled) {
    if (hasError) triggerStatus = 'stopped'
    else if (status === 'ALARM') triggerStatus = 'completed'
    else if (status === 'WARNING') triggerStatus = needsStateHold ? 'pending' : 'active'
    else triggerStatus = 'idle'
  }
  steps.push({
    id: 'trigger',
    kind: 'trigger',
    label: '触发决策',
    sublabel: rule.trigger_mode === 'on_change' ? '仅状态变化' : '始终触发',
    status: triggerStatus,
  })

  // 6. Actions
  const actions = rule.actions || []
  if (actions.length === 0) {
    steps.push({
      id: 'action-none',
      kind: 'action',
      label: '执行动作',
      sublabel: '无动作',
      status: status === 'ALARM' && enabled && !hasError ? 'completed' : 'idle',
    })
  } else {
    const actionStatuses = inferActionStatuses(actions, state, enabled, status, hasError)
    actionStatuses.forEach(({ action, index, actionStatus }) => {
      steps.push({
        id: `action-${index}`,
        kind: 'action',
        label: '执行动作',
        sublabel: formatActionLabel(action, index),
        status: actionStatus,
      })
    })
  }

  if (state?.execution_phase) {
    return applyExecutionPhase(steps, state)
  }

  return steps
}

export function getPipelineSummary(steps, state) {
  if (!steps?.length) return { phase: 'idle', label: '无流程' }

  const hasError = !!state?.error_message
  const status = state?.current_status || 'NORMAL'
  const execPhase = state?.execution_phase

  if (execPhase === 'idle' && status === 'NORMAL' && !hasError) {
    return { phase: 'idle', label: '监控中', step: steps.find(s => s.id === 'evaluate') || steps[0] }
  }

  if (execPhase === 'completed' && !hasError) {
    const lastAction = [...steps].reverse().find(s => s.kind === 'action' && s.status === 'completed')
    if (lastAction) return { phase: 'completed', label: lastAction.sublabel || lastAction.label, step: lastAction }
    return { phase: 'completed', label: '流程已完成', step: steps[steps.length - 1] }
  }

  const active = steps.find(s => s.status === 'active')
  if (active) return { phase: 'running', label: active.label, step: active }

  const pending = steps.find(s => s.status === 'pending')
  if (pending) return { phase: 'pending', label: pending.label, step: pending }

  if (hasError) {
    const stopped = steps.find(s => s.status === 'stopped')
    if (stopped) return { phase: 'stopped', label: stopped.label, step: stopped }
  }

  const allCompleted = steps.every(s =>
    s.status === 'completed' || s.status === 'skipped' || s.status === 'idle',
  )
  if (allCompleted && steps.some(s => s.status === 'completed')) {
    const lastCompleted = [...steps].reverse().find(s => s.status === 'completed')
    return {
      phase: status === 'ALARM' ? 'completed' : 'idle',
      label: status === 'ALARM' ? (lastCompleted?.label || '流程已完成') : '监控中',
      step: lastCompleted || steps[steps.length - 1],
    }
  }

  return { phase: 'idle', label: '监控中', step: steps[0] }
}

export function getRuntimeStatusLabel(status) {
  const map = {
    NORMAL: '正常',
    WARNING: '等待中',
    ALARM: '已触发',
  }
  return map[status] || status || '—'
}
