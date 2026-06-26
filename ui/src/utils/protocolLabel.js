/** 南向采集协议 ID，与后端 Channel.protocol 保持一致 */
export const SOUTH_PROTOCOLS = [
  'modbus-tcp',
  'modbus-rtu-over-tcp',
  'modbus-rtu',
  'bacnet-ip',
  'opc-ua',
  's7',
  'dlt645',
  'ethernet-ip'
]

const ALIAS_MAP = {
  modbus: 'modbus-tcp',
  'modbus tcp': 'modbus-tcp',
  'modbus_tcp': 'modbus-tcp',
  'modbus-rtu over tcp': 'modbus-rtu-over-tcp',
  bacnet: 'bacnet-ip',
  'bacnet ip': 'bacnet-ip',
  opcua: 'opc-ua',
  'opc ua': 'opc-ua',
  'opc_ua': 'opc-ua',
  enip: 'ethernet-ip',
  'ethernet/ip': 'ethernet-ip'
}

/** 页面 protocol-tag 统一显示通道协议 ID（如 modbus-tcp） */
export function formatProtocolTag(protocol) {
  if (protocol == null || protocol === '') return 'unknown'
  const raw = String(protocol).trim().toLowerCase()
  if (ALIAS_MAP[raw]) return ALIAS_MAP[raw]
  if (SOUTH_PROTOCOLS.includes(raw)) return raw
  return raw.replace(/[\s_]+/g, '-')
}

/** 传输层类型（仅用于需要区分 TCP/UDP/Serial 的场景，不用于 protocol-tag） */
export function getProtocolTransport(protocol) {
  const tag = formatProtocolTag(protocol)
  if (tag === 'unknown') return 'Unknown'
  if (tag.includes('bacnet') || tag.includes('snmp')) return 'UDP'
  if (tag.includes('rtu') && !tag.includes('over-tcp')) return 'Serial'
  if (tag.includes('tcp') || tag.includes('opc-ua') || tag === 's7' || tag === 'ethernet-ip') return 'TCP'
  return 'TCP/IP'
}
