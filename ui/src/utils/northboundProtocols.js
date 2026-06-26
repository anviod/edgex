/** 北向协议元数据：模式分类与展示配置 */

export const NORTHBOUND_MODES = {
  push: {
    key: 'push',
    label: '主动上报',
    desc: '网关主动连接上游并推送采集数据',
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd'
  },
  passive: {
    key: 'passive',
    label: '被动读取',
    desc: '网关暴露服务，等待 SCADA / MES 主动连接读取',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe'
  }
}

export const NORTHBOUND_PROTOCOLS = {
  mqtt: {
    key: 'mqtt',
    apiType: 'mqtt',
    label: 'MQTT 客户端',
    shortLabel: 'MQTT',
    mode: 'push',
    color: '#0ea5e9',
    desc: '通用 MQTT 协议，支持自定义主题与 Payload',
    icon: 'cloud',
    infoFields: (item) => [
      { label: 'Broker', value: item.broker, copy: true },
      { label: 'Client ID', value: item.client_id },
      { label: '上报主题', value: item.topic }
    ],
    hasConnection: true,
    hasHelp: true,
    hasStats: true
  },
  sparkplug_b: {
    key: 'sparkplug_b',
    apiType: 'sparkplug_b',
    label: 'Sparkplug B',
    shortLabel: 'SPB',
    mode: 'push',
    color: '#00b42a',
    desc: '基于 MQTT 的工业物联网标准协议 (Eclipse Tahu)',
    icon: 'swap',
    infoFields: (item) => [
      { label: 'Broker', value: `${item.broker}:${item.port || 1883}`, copy: true },
      { label: 'Group ID', value: item.group_id },
      { label: 'Node ID', value: item.node_id }
    ],
    hasConnection: true,
    hasHelp: true,
    hasStats: true
  },
  http: {
    key: 'http',
    apiType: 'http',
    label: 'HTTP 推送',
    shortLabel: 'HTTP',
    mode: 'push',
    color: '#165dff',
    desc: '通过 HTTP POST/PUT 定时推送数据到 REST 接口',
    icon: 'upload',
    infoFields: (item) => [
      { label: '服务器', value: item.url, copy: true },
      { label: '方法', value: item.method || 'POST' },
      { label: '数据端点', value: item.data_endpoint }
    ],
    hasConnection: false,
    hasHelp: false,
    hasStats: true
  },
  edgeos_mqtt: {
    key: 'edgeos_mqtt',
    apiType: 'edgeos-mqtt',
    label: 'edgeOS (MQTT)',
    shortLabel: 'edgeOS',
    mode: 'push',
    color: '#f53f3f',
    desc: 'edgeOS 平台 MQTT 3.1.1，节点注册与双向通信',
    icon: 'thunderbolt',
    infoFields: (item) => [
      { label: 'Broker', value: item.broker, copy: true },
      { label: 'Client ID', value: item.client_id },
      { label: '节点 ID', value: item.node_id }
    ],
    hasConnection: true,
    hasHelp: true,
    hasStats: true
  },
  edgeos_nats: {
    key: 'edgeos_nats',
    apiType: 'edgeos-nats',
    label: 'edgeOS (NATS)',
    shortLabel: 'NATS',
    mode: 'push',
    color: '#ff7d00',
    desc: 'edgeOS 平台 NATS 2.x，JetStream 持久化',
    icon: 'thunderbolt',
    infoFields: (item) => [
      { label: 'NATS 地址', value: item.url, copy: true },
      { label: 'Client ID', value: item.client_id },
      { label: '节点 ID', value: item.node_id }
    ],
    hasConnection: true,
    hasHelp: true,
    hasStats: true
  },
  opcua: {
    key: 'opcua',
    apiType: 'opcua',
    label: 'OPC UA 服务端',
    shortLabel: 'OPC UA',
    mode: 'passive',
    color: '#722ed1',
    desc: '暴露 OPC UA Server，供 SCADA / MES 订阅读取',
    icon: 'storage',
    infoFields: (item) => [
      { label: '监听端口', value: String(item.port || 4840) },
      { label: 'Endpoint', value: item.endpoint },
      {
        label: '连接地址',
        value: `opc.tcp://localhost:${item.port || 4840}${item.endpoint || ''}`,
        copy: true
      }
    ],
    hasConnection: false,
    hasHelp: true,
    hasStats: true,
    hasSync: true
  }
}

/** 按模式分组的协议列表（用于添加通道弹窗） */
export function getProtocolsByMode(mode) {
  return Object.values(NORTHBOUND_PROTOCOLS).filter(p => p.mode === mode)
}

/** 从配置对象构建扁平通道列表 */
export function flattenChannels(config) {
  const result = { push: [], passive: [] }
  for (const meta of Object.values(NORTHBOUND_PROTOCOLS)) {
    const items = config[meta.key] || []
    for (const item of items) {
      const entry = { meta, item }
      if (meta.mode === 'push') result.push.push(entry)
      else result.passive.push(entry)
    }
  }
  return result
}

export function getProtocolMeta(key) {
  return NORTHBOUND_PROTOCOLS[key] || null
}
