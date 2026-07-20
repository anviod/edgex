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
    color: '#1677ff',
    desc: '连接到 MQTT Broker，向指定 Topic 主动推送数据',
    icon: 'cloud',
    infoFields: (item) => [
      { label: 'Broker', value: `${item.broker || ''}${item.port ? ':' + item.port : ''}` },
      { label: 'Topic', value: item.topic || '-' },
      { label: 'Client ID', value: item.client_id || '-' }
    ],
    hasConnection: true,
    hasHelp: true,
    hasStats: true,
    hasSync: false,
  },
  sparkplug_b: {
    key: 'sparkplug_b',
    apiType: 'sparkplugb',
    label: 'Sparkplug B 客户端',
    shortLabel: 'Sparkplug B',
    mode: 'push',
    color: '#f5222d',
    desc: '按 Sparkplug B 规范向 MQTT Broker 上报设备数据',
    icon: 'thunderbolt',
    infoFields: (item) => [
      { label: 'Broker', value: `${item.broker || ''}${item.port ? ':' + item.port : ''}` },
      { label: 'Group ID', value: item.group_id || '-' },
      { label: 'Node ID', value: item.node_id || '-' }
    ],
    hasConnection: true,
    hasHelp: true,
    hasStats: true,
    hasSync: false,
  },
  http: {
    key: 'http',
    apiType: 'http',
    label: 'HTTP 客户端',
    shortLabel: 'HTTP',
    mode: 'push',
    color: '#52c41a',
    desc: '通过 HTTP POST 请求将数据推送到外部服务',
    icon: 'upload',
    infoFields: (item) => [
      { label: 'URL', value: item.url || '-' },
      { label: 'Method', value: item.method || 'POST' },
      { label: 'Auth', value: item.auth_type || 'none' }
    ],
    hasConnection: false,
    hasHelp: false,
    hasStats: true,
    hasSync: false,
  },
  edgeos_mqtt: {
    key: 'edgeos_mqtt',
    apiType: 'edgeos-mqtt',
    label: 'edgeOS(MQTT) 客户端',
    shortLabel: 'edgeOS MQTT',
    mode: 'push',
    color: '#722ed1',
    desc: '以 edgeOS 协议通过 MQTT 向边缘操作系统上报数据',
    icon: 'cloud',
    infoFields: (item) => [
      { label: 'Broker', value: `${item.broker || ''}${item.port ? ':' + item.port : ''}` },
      { label: 'Node ID', value: item.node_id || '-' },
      { label: 'QoS', value: item.qos || '1' }
    ],
    hasConnection: true,
    hasHelp: true,
    hasStats: true,
    hasSync: false,
  },
  edgeos_nats: {
    key: 'edgeos_nats',
    apiType: 'edgeos-nats',
    label: 'edgeOS(NATS) 客户端',
    shortLabel: 'edgeOS NATS',
    mode: 'push',
    color: '#eb2f96',
    desc: '以 edgeOS 协议通过 NATS 向边缘操作系统上报数据',
    icon: 'swap',
    infoFields: (item) => [
      { label: 'URL', value: item.url || '-' },
      { label: 'Node ID', value: item.node_id || '-' },
      { label: 'JetStream', value: item.jetstream_enabled ? 'Enabled' : 'Disabled' }
    ],
    hasConnection: true,
    hasHelp: true,
    hasStats: true,
    hasSync: false,
  },
  opcua: {
    key: 'opcua',
    apiType: 'opcua',
    label: 'OPC UA 服务端',
    shortLabel: 'OPC UA',
    mode: 'passive',
    color: '#fa8c16',
    desc: '以 OPC UA Server 从机模式运行，对外暴露点位数据供主站（如 SCADA）读取和写入',
    icon: 'storage',
    infoFields: (item) => [
      { label: '端口', value: item.port || '4840' },
      { label: 'Endpoint', value: item.endpoint || '/ipp/opcua/server' },
      { label: '安全策略', value: item.security_policy || 'Auto' }
    ],
    hasConnection: false,
    hasHelp: true,
    hasStats: true,
    hasSync: true,
  },
  bacnet_server: {
    key: 'bacnet_server',
    apiType: 'bacnet_server',
    label: 'BACnet 服务端',
    shortLabel: 'BACnet Server',
    mode: 'passive',
    color: '#13c2c2',
    desc: '以 BACnet 从机模式运行，对外暴露点位数据供 BMS/SCADA 主站通过 BACnet/IP 协议读取和写入',
    icon: 'storage',
    infoFields: (item) => [
      { label: '端口', value: item.port || '47808' },
      { label: '设备 ID', value: item.device_id || '自动' },
      { label: '设备名称', value: item.device_name || '-' }
    ],
    hasConnection: false,
    hasHelp: true,
    hasStats: true,
    hasSync: true,
  },
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
