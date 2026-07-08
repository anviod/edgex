/**
 * 边缘计算场景模版 — 基于产品说明中的典型工业应用场景。
 * 模版提供可复用的闭合流程骨架（输入源 → 判断条件 → 执行周期 → 执行动作），
 * 用户套用后绑定通道/设备/点位即可保存。
 */

const baseSource = (alias, hint = '') => ({
  channel_id: '',
  device_id: '',
  point_id: '',
  alias,
  ...(hint ? { _hint: hint } : {}),
})

const baseControl = (hint = '', value = '1') => ({
  type: 'device_control',
  config: {
    channel_id: '',
    device_id: '',
    point_id: '',
    value,
    ...(hint ? { _hint: hint } : {}),
  },
})

export const EDGE_SCENE_CATEGORIES = [
  { value: 'all', label: '全部场景' },
  { value: '告警联动', label: '告警联动' },
  { value: '群控策略', label: '群控策略' },
  { value: '数据聚合', label: '数据聚合' },
  { value: '其他', label: '其他' },
]

/** 主分类 Tab 对应的细粒度场景类型（用于 category=其他 时的交叉筛选） */
export const EDGE_SCENE_FILTER_SCENE_TYPES = {
  群控策略: ['多设备联动控制'],
  数据聚合: ['跨设备数据聚合'],
}

export const EDGE_SCENE_TEMPLATES = [
  {
    id: 'alarm-temp-cooling',
    category: '告警联动',
    sceneType: '告警联动',
    name: '温度越限联动冷却',
    description: '监测温度超过阈值时写入冷却设备控制点位，实现毫秒级本地告警联动。',
    ruleTypes: ['threshold'],
    actions: ['device_control', 'log'],
    rule: {
      name: '温度越限联动冷却',
      type: 'threshold',
      priority: 10,
      enable: false,
      trigger_mode: 'on_change',
      check_interval: '1s',
      sources: [
        baseSource('temp', '温度传感器'),
        baseSource('cooling_run', '冷却设备运行反馈'),
      ],
      trigger_logic: 'EXPR',
      condition: 'temp > 35 && cooling_run == 0',
      state: { duration: '3s', count: 0 },
      actions: [
        baseControl('冷却设备启停点', '1'),
        { type: 'log', config: { level: 'warn', message: '温度 ${temp}°C 越限，已启动冷却设备' } },
      ],
    },
  },
  {
    id: 'alarm-fault-backup',
    category: '告警联动',
    sceneType: '告警联动',
    name: '设备故障切换备用通道',
    description: '设备故障状态位触发时记录告警并切换备用通道控制，适用于冗余产线。',
    ruleTypes: ['threshold'],
    actions: ['sequence', 'device_control', 'log'],
    rule: {
      name: '设备故障切换备用通道',
      type: 'threshold',
      priority: 20,
      enable: false,
      trigger_mode: 'on_change',
      check_interval: '500ms',
      sources: [
        baseSource('fault', '主设备故障状态位'),
        baseSource('backup_ready', '备用通道就绪信号'),
      ],
      trigger_logic: 'EXPR',
      condition: 'fault == 1 && backup_ready == 1',
      state: { duration: '2s', count: 0 },
      actions: [
        {
          type: 'sequence',
          config: {
            steps: [
              baseControl('主通道停用工', '0'),
              { type: 'delay', config: { duration: '1s' } },
              baseControl('备用通道启用', '1'),
              { type: 'log', config: { level: 'error', message: '主设备故障，已切换备用通道' } },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'aggregate-multi-pump-flow',
    category: '其他',
    sceneType: '跨设备数据聚合',
    name: '多泵流量汇总计算',
    description: '聚合多台泵的流量读数，计算总流量并输出到虚拟或计算点位，供北向上报。',
    ruleTypes: ['calculation'],
    actions: ['device_control', 'mqtt', 'log'],
    rule: {
      name: '多泵流量汇总',
      type: 'calculation',
      priority: 5,
      enable: false,
      trigger_mode: 'always',
      check_interval: '1s',
      sources: [
        baseSource('pump_a', '泵 A 流量'),
        baseSource('pump_b', '泵 B 流量'),
        baseSource('pump_c', '泵 C 流量'),
      ],
      trigger_logic: 'EXPR',
      expression: 'pump_a + pump_b + pump_c',
      actions: [
        baseControl('总流量虚拟点位', '${value}'),
        {
          type: 'mqtt',
          config: {
            mqtt_id: '',
            topic: 'edge/metrics/total_flow',
            message: '{"total_flow":${value},"unit":"m3/h"}',
          },
        },
        { type: 'log', config: { level: 'info', message: '总流量: ${value} m³/h' } },
      ],
    },
  },
  {
    id: 'aggregate-temp-average',
    category: '其他',
    sceneType: '跨设备数据聚合',
    name: '多路温度平均值',
    description: '计算多路温度传感器平均值，常用于洁净室或机房环境综合指标。',
    ruleTypes: ['calculation'],
    actions: ['device_control', 'mqtt', 'log'],
    rule: {
      name: '多路温度平均值',
      type: 'calculation',
      priority: 5,
      enable: false,
      trigger_mode: 'always',
      check_interval: '5s',
      sources: [
        baseSource('t1', '温度点 1'),
        baseSource('t2', '温度点 2'),
        baseSource('t3', '温度点 3'),
      ],
      trigger_logic: 'EXPR',
      expression: '(t1 + t2 + t3) / 3',
      actions: [
        baseControl('平均温度虚拟点位', '${value}'),
        {
          type: 'mqtt',
          config: {
            mqtt_id: '',
            topic: 'edge/metrics/temp_avg',
            message: '{"avg_temp":${value},"samples":3}',
          },
        },
        { type: 'log', config: { level: 'info', message: '平均温度: ${value}°C' } },
      ],
    },
  },
  {
    id: 'multi-device-sequence',
    category: '其他',
    sceneType: '多设备联动控制',
    name: '产线启停顺序控制',
    description: '按顺序延时启动多台设备，适用于 PLC 与楼宇控制器跨协议联动编排。',
    ruleTypes: ['threshold'],
    actions: ['sequence', 'device_control', 'log'],
    rule: {
      name: '产线启停顺序控制',
      type: 'threshold',
      priority: 15,
      enable: false,
      trigger_mode: 'on_change',
      check_interval: '1s',
      sources: [
        baseSource('start_cmd', '启动命令'),
        baseSource('line_ready', '产线就绪信号'),
      ],
      trigger_logic: 'EXPR',
      condition: 'start_cmd == 1 && line_ready == 1',
      state: { duration: '0s', count: 0 },
      actions: [
        {
          type: 'sequence',
          config: {
            steps: [
              baseControl('输送带启停', '1'),
              { type: 'delay', config: { duration: '2s' } },
              baseControl('加工单元启停', '1'),
              { type: 'delay', config: { duration: '2s' } },
              baseControl('包装线启停', '1'),
              { type: 'log', config: { level: 'info', message: '产线顺序启动完成' } },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'edge-safety-interlock',
    category: '其他',
    sceneType: '边缘实时决策',
    name: '安全联锁自动停机',
    description: '危险区域传感器触发且设备仍在运行时自动停机，减少上行延迟的安全联锁。',
    ruleTypes: ['state'],
    actions: ['device_control', 'mqtt', 'log'],
    rule: {
      name: '安全联锁自动停机',
      type: 'state',
      priority: 100,
      enable: false,
      trigger_mode: 'on_change',
      check_interval: '500ms',
      sources: [
        baseSource('intrusion', '入侵/光栅检测'),
        baseSource('running', '设备运行状态'),
        baseSource('estop', '急停回路状态'),
      ],
      trigger_logic: 'EXPR',
      condition: 'intrusion == 1 && running == 1 && estop == 0',
      state: { duration: '1s', count: 2 },
      actions: [
        baseControl('设备停机控制点', '0'),
        {
          type: 'mqtt',
          config: {
            mqtt_id: '',
            topic: 'edge/safety/interlock',
            message: '{"event":"stop","intrusion":${intrusion},"running":${running}}',
          },
        },
        { type: 'log', config: { level: 'error', message: '安全联锁触发，设备已停机' } },
      ],
    },
  },
  {
    id: 'env-temp-humidity-alarm',
    category: '其他',
    sceneType: '环境温湿度监控',
    name: '温湿度越限告警',
    description: '监测机房或洁净室温湿度，越限时北向 MQTT 上报并记录本地日志。',
    ruleTypes: ['threshold'],
    actions: ['device_control', 'mqtt', 'log'],
    rule: {
      name: '温湿度越限告警',
      type: 'threshold',
      priority: 8,
      enable: false,
      trigger_mode: 'on_change',
      check_interval: '5s',
      sources: [
        baseSource('temp', '温度'),
        baseSource('humidity', '湿度'),
      ],
      trigger_logic: 'EXPR',
      condition: 'temp > 28 || temp < 18 || humidity > 70 || humidity < 30',
      state: { duration: '30s', count: 0 },
      actions: [
        baseControl('新风/空调启停', '1'),
        {
          type: 'mqtt',
          config: {
            mqtt_id: '',
            topic: 'edge/alarm/env',
            message: '{"temp":${temp},"humidity":${humidity},"alarm":true}',
          },
        },
        { type: 'log', config: { level: 'warn', message: '环境参数越限: 温度=${temp}°C 湿度=${humidity}%' } },
      ],
    },
  },
  {
    id: 'predictive-vibration-window',
    category: '其他',
    sceneType: '预测性维护',
    name: '振动均值趋势检测',
    description: '滑动窗口计算振动均值，超过阈值时生成维护预警，适用于轴承寿命监测。',
    ruleTypes: ['window'],
    actions: ['log', 'mqtt'],
    rule: {
      name: '振动均值趋势检测',
      type: 'window',
      priority: 12,
      enable: false,
      trigger_mode: 'always',
      check_interval: '1s',
      sources: [
        baseSource('vibration', '振动传感器'),
        baseSource('rpm', '设备转速'),
      ],
      trigger_logic: 'EXPR',
      condition: 'value > 5 && rpm > 100',
      window: { type: 'sliding', size: '60s', aggr_func: 'avg' },
      state: { duration: '10s', count: 0 },
      actions: [
        { type: 'log', config: { level: 'warn', message: '振动均值 ${value} 超阈值，建议安排检修' } },
        {
          type: 'mqtt',
          config: {
            mqtt_id: '',
            topic: 'edge/maintenance/vibration',
            message: '{"avg_vibration":${value},"rpm":${rpm},"alert":true}',
          },
        },
      ],
    },
  },
  {
    id: 'takt-cycle-count',
    category: '其他',
    sceneType: '产线节拍统计',
    name: '产线节拍计数统计',
    description: '采集 PLC 产品到位信号，窗口内统计节拍次数并计算 CT，可联动 MES 上报。',
    ruleTypes: ['window'],
    actions: ['mqtt', 'log'],
    rule: {
      name: '产线节拍计数统计',
      type: 'window',
      priority: 6,
      enable: false,
      trigger_mode: 'always',
      check_interval: '1s',
      sources: [
        baseSource('cycle', '产品到位节拍信号'),
        baseSource('line_run', '产线运行状态'),
      ],
      trigger_logic: 'EXPR',
      condition: 'cycle == 1 && line_run == 1',
      window: { type: 'tumbling', size: '300s', aggr_func: 'count' },
      state: { duration: '0s', count: 0 },
      actions: [
        {
          type: 'mqtt',
          config: {
            mqtt_id: '',
            topic: 'edge/oee/cycle_count',
            message: '{"count":${value},"window_sec":300,"line_run":${line_run}}',
          },
        },
        { type: 'log', config: { level: 'info', message: '5 分钟窗口节拍计数: ${value}' } },
      ],
    },
  },
  {
    id: 'remote-monitor-publish',
    category: '其他',
    sceneType: '设备远程监控',
    name: '关键参数北向上报',
    description: '设备关键参数变化时通过 MQTT 推送至 SCADA 或云平台，实现远程监控集成。',
    ruleTypes: ['threshold'],
    actions: ['mqtt', 'log'],
    rule: {
      name: '关键参数北向上报',
      type: 'threshold',
      priority: 3,
      enable: false,
      trigger_mode: 'on_change',
      check_interval: '1s',
      sources: [
        baseSource('metric', '关键参数'),
        baseSource('device_online', '设备在线状态'),
      ],
      trigger_logic: 'EXPR',
      condition: 'metric != 0 && device_online == 1',
      state: { duration: '0s', count: 0 },
      actions: [
        {
          type: 'mqtt',
          config: {
            mqtt_id: '',
            topic: 'edge/monitor/device',
            message: '{"value":${metric},"online":${device_online}}',
          },
        },
        { type: 'log', config: { level: 'info', message: '北向上报: ${metric}' } },
      ],
    },
  },
]

const ACTION_TYPE_LABELS = {
  log: '日志',
  device_control: '设备控制',
  sequence: '顺序执行',
  check: '校验',
  delay: '延时',
  mqtt: 'MQTT 上报',
  http: 'HTTP 请求',
  database: '数据存储',
}

export function formatSceneRuleType(type) {
  const map = {
    threshold: '阈值触发',
    calculation: '计算公式',
    window: '时间窗口',
    state: '状态持续',
  }
  return map[type] || type
}

export function formatSceneTriggerMode(mode) {
  const map = {
    always: '周期执行（始终评估）',
    on_change: '事件驱动（状态变化时）',
  }
  return map[mode] || mode || '—'
}

export function formatSceneSchedule(rule) {
  if (!rule) return '—'
  const parts = []
  if (rule.check_interval) parts.push(`检查间隔 ${rule.check_interval}`)
  parts.push(formatSceneTriggerMode(rule.trigger_mode))
  parts.push(formatSceneRuleType(rule.type))
  return parts.join(' · ')
}

export function formatSceneCondition(rule) {
  if (!rule) return '—'
  const parts = []

  if (rule.type === 'calculation') {
    if (rule.expression) parts.push(`表达式: ${rule.expression}`)
  } else if (rule.condition) {
    parts.push(rule.condition)
  }

  if (rule.type === 'window' && rule.window) {
    const w = rule.window
    parts.push(`窗口 ${w.type} / ${w.size} / ${w.aggr_func}`)
  }

  if ((rule.type === 'state' || rule.type === 'threshold') && rule.state) {
    const hold = []
    if (rule.state.duration && rule.state.duration !== '0s') {
      hold.push(`持续 ${rule.state.duration}`)
    }
    if (rule.state.count > 0) {
      hold.push(`连续 ${rule.state.count} 次`)
    }
    if (hold.length) parts.push(hold.join('，'))
  }

  return parts.join(' · ') || '—'
}

export function formatSceneSourceLine(src) {
  if (!src) return '—'
  const alias = src.alias || '—'
  const hint = src._hint ? `（${src._hint}）` : ''
  const bound = src.channel_id && src.device_id && src.point_id
  const binding = bound
    ? ` → ${src.channel_id}/${src.device_id}/${src.point_id}`
    : ' → 待绑定通道/设备/点位'
  return `${alias}${hint}${binding}`
}

function formatActionConfigHint(action) {
  const cfg = action?.config || {}
  switch (action?.type) {
    case 'mqtt':
      return cfg.topic ? `topic: ${cfg.topic}` : ''
    case 'device_control':
      return cfg._hint || (cfg.value != null ? `写入 ${cfg.value}` : '')
    case 'log':
      return cfg.message ? String(cfg.message).slice(0, 48) : ''
    case 'delay':
      return cfg.duration ? `等待 ${cfg.duration}` : ''
    case 'sequence':
      return `${(cfg.steps || []).length} 个步骤`
    default:
      return ''
  }
}

export function formatSceneActionLine(action, index = 0) {
  if (!action) return '—'
  const typeLabel = ACTION_TYPE_LABELS[action.type] || action.type
  const detail = formatActionConfigHint(action)
  const prefix = `${index + 1}. ${typeLabel}`
  return detail ? `${prefix} — ${detail}` : prefix
}

export function listSceneActions(actions, depth = 0) {
  if (!actions?.length) return []
  const lines = []
  actions.forEach((action, index) => {
    lines.push({ line: formatSceneActionLine(action, index), depth })
    if (action.type === 'sequence' && action.config?.steps?.length) {
      action.config.steps.forEach((step, stepIndex) => {
        lines.push(...listSceneActions([step], depth + 1).map(item => ({
          ...item,
          line: item.line.replace(/^\d+\./, `${index + 1}.${stepIndex + 1}.`),
        })))
      })
    }
  })
  return lines
}

export function cloneSceneTemplateRule(template) {
  const rule = JSON.parse(JSON.stringify(template.rule))
  rule.id = ''
  if (!rule.sources) rule.sources = []
  if (!rule.actions) rule.actions = []
  if (!rule.trigger_logic) rule.trigger_logic = 'EXPR'
  if (!rule.trigger_mode) rule.trigger_mode = 'always'
  if (!rule.check_interval) rule.check_interval = '1s'

  if (rule.type === 'calculation') {
    rule.condition = ''
    if (!rule.expression) rule.expression = ''
  } else {
    if (!rule.condition && rule.type !== 'calculation') rule.condition = ''
    rule.expression = ''
  }

  if (rule.type === 'window' && !rule.window) {
    rule.window = { type: 'sliding', size: '10s', aggr_func: 'avg' }
  }

  if (rule.type === 'state' || rule.type === 'threshold') {
    if (!rule.state) rule.state = { duration: '0s', count: 0 }
  } else if (rule.type === 'window') {
    if (!rule.state) rule.state = { duration: '0s', count: 0 }
  } else {
    rule.state = { duration: '0s', count: 0 }
  }

  const stripHints = (obj) => {
    if (!obj || typeof obj !== 'object') return
    delete obj._hint
    if (Array.isArray(obj.steps)) {
      obj.steps.forEach(stripHints)
    }
    if (obj.config) stripHints(obj.config)
  }

  for (const src of rule.sources) {
    delete src._hint
    src._deviceList = []
    src._pointList = []
  }

  for (const action of rule.actions) {
    stripHints(action.config)
  }

  return rule
}
