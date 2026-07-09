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

/** 主分类 Tab 对应的细粒度场景类型（用于 category 与 sceneType 交叉筛选） */
export const EDGE_SCENE_FILTER_SCENE_TYPES = {
  告警联动: ['边缘实时决策', '环境温湿度监控', '冷链物流监控', '网络设备监控', '预测性维护'],
  群控策略: ['多设备联动控制', '电力自动化'],
  数据聚合: ['跨设备数据聚合', '设备联合抄表', '光伏逆变器聚合', '楼宇能耗分项计量', '产线节拍统计'],
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
    id: 'aggregate-multi-pump-flow',
    category: '数据聚合',
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
    id: 'multi-device-sequence',
    category: '群控策略',
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
    category: '告警联动',
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
    category: '告警联动',
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
    category: '告警联动',
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
    category: '数据聚合',
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
  {
    id: 'cold-chain-temp-alarm',
    category: '告警联动',
    sceneType: '冷链物流监控',
    name: '冷链脱冷事件检测',
    description: '监测车载或冷库温度超温并记录 GPS 轨迹，本地缓存时序数据并在网络恢复后 MQTT 补传，满足 GSP 合规追溯。',
    ruleTypes: ['threshold'],
    actions: ['database', 'mqtt', 'log'],
    rule: {
      name: '冷链脱冷事件检测',
      type: 'threshold',
      priority: 25,
      enable: false,
      trigger_mode: 'on_change',
      check_interval: '10s',
      sources: [
        baseSource('cargo_temp', '货物温度'),
        baseSource('setpoint', '设定温度阈值'),
        baseSource('gps_valid', 'GPS 定位有效'),
      ],
      trigger_logic: 'EXPR',
      condition: 'cargo_temp > setpoint + 2 && gps_valid == 1',
      state: { duration: '60s', count: 0 },
      actions: [
        {
          type: 'database',
          config: { bucket: 'cold_chain_events', _hint: '本地缓存脱冷记录' },
        },
        {
          type: 'mqtt',
          config: {
            mqtt_id: '',
            topic: 'edge/coldchain/alarm',
            message: '{"temp":${cargo_temp},"setpoint":${setpoint},"gps_valid":${gps_valid}}',
          },
        },
        { type: 'log', config: { level: 'error', message: '冷链脱冷: 温度 ${cargo_temp}°C 超设定 ${setpoint}°C' } },
      ],
    },
  },
  {
    id: 'network-snmp-health',
    category: '告警联动',
    sceneType: '网络设备监控',
    name: 'SNMP 网络设备健康预警',
    description: '通过 SNMP 采集交换机端口流量、设备温度与电源状态，异常时本地告警并北向上报工业网络健康度。',
    ruleTypes: ['threshold'],
    actions: ['mqtt', 'log'],
    rule: {
      name: 'SNMP 网络设备健康预警',
      type: 'threshold',
      priority: 7,
      enable: false,
      trigger_mode: 'on_change',
      check_interval: '30s',
      sources: [
        baseSource('port_util', '端口利用率 %'),
        baseSource('device_temp', '设备温度'),
        baseSource('psu_status', '电源状态'),
      ],
      trigger_logic: 'EXPR',
      condition: 'port_util > 85 || device_temp > 65 || psu_status == 0',
      state: { duration: '2m', count: 0 },
      actions: [
        {
          type: 'mqtt',
          config: {
            mqtt_id: '',
            topic: 'edge/network/health',
            message: '{"port_util":${port_util},"device_temp":${device_temp},"psu_ok":${psu_status}}',
          },
        },
        { type: 'log', config: { level: 'warn', message: '网络设备异常: 端口=${port_util}% 温度=${device_temp}°C' } },
      ],
    },
  },
  {
    id: 'power-iec104-remote',
    category: '群控策略',
    sceneType: '电力自动化',
    name: 'IEC104 遥控合闸操作',
    description: '通过 IEC 60870-5-104 接入电力系统，总召唤确认就绪后执行单点遥控合闸，满足调度自动化基础需求。',
    ruleTypes: ['threshold'],
    actions: ['sequence', 'device_control', 'log'],
    rule: {
      name: 'IEC104 遥控合闸操作',
      type: 'threshold',
      priority: 50,
      enable: false,
      trigger_mode: 'on_change',
      check_interval: '1s',
      sources: [
        baseSource('remote_cmd', '遥控合闸命令'),
        baseSource('breaker_status', '断路器分位反馈'),
        baseSource('interlock_ok', '五防联锁就绪'),
      ],
      trigger_logic: 'EXPR',
      condition: 'remote_cmd == 1 && breaker_status == 0 && interlock_ok == 1',
      state: { duration: '0s', count: 0 },
      actions: [
        {
          type: 'sequence',
          config: {
            steps: [
              baseControl('遥控预置', '1'),
              { type: 'delay', config: { duration: '500ms' } },
              baseControl('遥控执行合闸', '1'),
              { type: 'log', config: { level: 'info', message: 'IEC104 遥控合闸命令已下发' } },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'meter-batch-reading',
    category: '数据聚合',
    sceneType: '设备联合抄表',
    name: '多表定时联合抄表',
    description: '批量读取 DL/T645 或 Modbus 电表、水表读数，校验异常跳变并汇总至虚拟点位供能耗报表使用。',
    ruleTypes: ['calculation'],
    actions: ['device_control', 'log', 'mqtt'],
    rule: {
      name: '多表定时联合抄表',
      type: 'calculation',
      priority: 4,
      enable: false,
      trigger_mode: 'always',
      check_interval: '15m',
      sources: [
        baseSource('meter_a', '1# 电表读数'),
        baseSource('meter_b', '2# 电表读数'),
        baseSource('meter_c', '3# 水表读数'),
      ],
      trigger_logic: 'EXPR',
      expression: 'meter_a + meter_b + meter_c',
      actions: [
        baseControl('联合抄表汇总虚拟点', '${value}'),
        {
          type: 'mqtt',
          config: {
            mqtt_id: '',
            topic: 'edge/meter/batch_read',
            message: '{"total":${value},"meters":3,"ts":"${now}"}',
          },
        },
        { type: 'log', config: { level: 'info', message: '联合抄表完成，合计: ${value}' } },
      ],
    },
  },
  {
    id: 'pv-inverter-total',
    category: '数据聚合',
    sceneType: '光伏逆变器聚合',
    name: '分布式逆变器总功率',
    description: '批量采集多台 Modbus 逆变器有功功率，计算总功率与日发电量并 MQTT 上报能源管理平台。',
    ruleTypes: ['calculation'],
    actions: ['device_control', 'mqtt', 'log'],
    rule: {
      name: '分布式逆变器总功率',
      type: 'calculation',
      priority: 5,
      enable: false,
      trigger_mode: 'always',
      check_interval: '5s',
      sources: [
        baseSource('inv1_pwr', '逆变器 1 有功功率'),
        baseSource('inv2_pwr', '逆变器 2 有功功率'),
        baseSource('inv3_pwr', '逆变器 3 有功功率'),
      ],
      trigger_logic: 'EXPR',
      expression: 'inv1_pwr + inv2_pwr + inv3_pwr',
      actions: [
        baseControl('电站总功率虚拟点', '${value}'),
        {
          type: 'mqtt',
          config: {
            mqtt_id: '',
            topic: 'edge/pv/total_power',
            message: '{"total_kw":${value},"inverters":3}',
          },
        },
        { type: 'log', config: { level: 'info', message: '光伏电站总功率: ${value} kW' } },
      ],
    },
  },
  {
    id: 'building-energy-submeter',
    category: '数据聚合',
    sceneType: '楼宇能耗分项计量',
    name: '楼宇照明空调分项汇总',
    description: '整合 DL/T645 电表、BACnet 能耗点与 KNX 传感器，分项汇总照明、空调、电梯能耗并生成看板指标。',
    ruleTypes: ['calculation'],
    actions: ['device_control', 'mqtt', 'log'],
    rule: {
      name: '楼宇照明空调分项汇总',
      type: 'calculation',
      priority: 5,
      enable: false,
      trigger_mode: 'always',
      check_interval: '5m',
      sources: [
        baseSource('lighting_kwh', '照明分项电耗'),
        baseSource('hvac_kwh', '空调分项电耗'),
        baseSource('elevator_kwh', '电梯分项电耗'),
      ],
      trigger_logic: 'EXPR',
      expression: 'lighting_kwh + hvac_kwh + elevator_kwh',
      actions: [
        baseControl('楼宇总能耗虚拟点', '${value}'),
        {
          type: 'mqtt',
          config: {
            mqtt_id: '',
            topic: 'edge/building/energy',
            message: '{"lighting":${lighting_kwh},"hvac":${hvac_kwh},"elevator":${elevator_kwh},"total":${value}}',
          },
        },
        { type: 'log', config: { level: 'info', message: '楼宇分项汇总: 照明+空调+电梯 = ${value} kWh' } },
      ],
    },
  },
  {
    id: 'modbus-passthrough-bridge',
    category: '其他',
    sceneType: 'Modbus 设备透传',
    name: 'Modbus TCP-RTU 透传桥接',
    description: 'Modbus TCP 请求映射至 RS485 RTU 从站地址，实现上位机无改造访问 legacy 设备，转发延迟低于 5ms。',
    ruleTypes: ['threshold'],
    actions: ['device_control', 'log'],
    rule: {
      name: 'Modbus TCP-RTU 透传桥接',
      type: 'threshold',
      priority: 2,
      enable: false,
      trigger_mode: 'on_change',
      check_interval: '100ms',
      sources: [
        baseSource('tcp_request', 'TCP 侧读请求触发'),
        baseSource('rtu_online', 'RTU 从站在线状态'),
      ],
      trigger_logic: 'EXPR',
      condition: 'tcp_request == 1 && rtu_online == 1',
      state: { duration: '0s', count: 0 },
      actions: [
        baseControl('RTU 映射寄存器回写', '${tcp_request}'),
        { type: 'log', config: { level: 'info', message: 'Modbus 透传: TCP→RTU 地址映射完成' } },
      ],
    },
  },
  {
    id: 'data-buffer-resume',
    category: '其他',
    sceneType: '数据断点续传',
    name: '弱网离线缓存补传',
    description: '网络中断时持续采集并写入本地队列，恢复后按时间戳顺序批量 MQTT 补传，保障数据零丢失。',
    ruleTypes: ['threshold'],
    actions: ['database', 'mqtt', 'log'],
    rule: {
      name: '弱网离线缓存补传',
      type: 'threshold',
      priority: 3,
      enable: false,
      trigger_mode: 'on_change',
      check_interval: '1s',
      sources: [
        baseSource('network_up', '北向网络连通状态'),
        baseSource('pending_count', '待补传队列深度'),
      ],
      trigger_logic: 'EXPR',
      condition: 'network_up == 1 && pending_count > 0',
      state: { duration: '0s', count: 0 },
      actions: [
        {
          type: 'mqtt',
          config: {
            mqtt_id: '',
            topic: 'edge/resume/batch',
            message: '{"pending":${pending_count},"resume":true}',
          },
        },
        {
          type: 'database',
          config: { bucket: 'resume_queue', _hint: '标记已补传批次' },
        },
        { type: 'log', config: { level: 'info', message: '网络恢复，补传 ${pending_count} 条缓存数据' } },
      ],
    },
  },
  {
    id: 'multi-protocol-gateway',
    category: '其他',
    sceneType: '多协议网关转换',
    name: '南向多协议统一北向',
    description: '南向 Modbus、BACnet、KNX 等协议点位映射至统一数据模型，变化时通过 MQTT 北向输出，实现异构设备互通。',
    ruleTypes: ['threshold'],
    actions: ['mqtt', 'log'],
    rule: {
      name: '南向多协议统一北向',
      type: 'threshold',
      priority: 3,
      enable: false,
      trigger_mode: 'on_change',
      check_interval: '1s',
      sources: [
        baseSource('modbus_val', 'Modbus 映射点位'),
        baseSource('bacnet_val', 'BACnet 映射点位'),
        baseSource('knx_val', 'KNX 映射点位'),
      ],
      trigger_logic: 'EXPR',
      condition: 'modbus_val != 0 || bacnet_val != 0 || knx_val != 0',
      state: { duration: '0s', count: 0 },
      actions: [
        {
          type: 'mqtt',
          config: {
            mqtt_id: '',
            topic: 'edge/gateway/unified',
            message: '{"modbus":${modbus_val},"bacnet":${bacnet_val},"knx":${knx_val}}',
          },
        },
        { type: 'log', config: { level: 'info', message: '多协议网关北向推送完成' } },
      ],
    },
  },
  {
    id: 'tsdb-local-store',
    category: '其他',
    sceneType: '时序数据本地存储',
    name: '采集数据本地 TSDB 持久化',
    description: '将采集数据与计算指标写入本地 TSDB，支持 REST 历史检索；弱网环境下保障边缘端可查。',
    ruleTypes: ['threshold'],
    actions: ['database', 'log'],
    rule: {
      name: '采集数据本地 TSDB 持久化',
      type: 'threshold',
      priority: 2,
      enable: false,
      trigger_mode: 'always',
      check_interval: '1s',
      sources: [
        baseSource('metric', '采集指标值'),
        baseSource('quality_ok', '数据质量有效'),
      ],
      trigger_logic: 'EXPR',
      condition: 'quality_ok == 1',
      state: { duration: '0s', count: 0 },
      actions: [
        {
          type: 'database',
          config: { bucket: 'tsdb_metrics', _hint: '本地时序库 bucket' },
        },
        { type: 'log', config: { level: 'info', message: 'TSDB 写入: ${metric}' } },
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
    case 'database':
      return cfg.bucket ? `bucket: ${cfg.bucket}` : (cfg._hint || '')
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
