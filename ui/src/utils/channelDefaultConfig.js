/** Recommended channel config defaults aligned with driver defaults and help docs. */

const MODBUS_ADVANCED = {
  timeout: 3000,
  max_retries: 3,
  retry_interval: 100,
  instruction_interval: 10,
  start_address: 1,
  byte_order_4: 'ABCD',
  enableSmartProbe: false,
  probeMaxDepth: 6,
  probeTimeout: 3000,
  probeMaxConsecutive: 20,
  probeEnableMTU: false,
}

const MODBUS_RTU_SERIAL = {
  port: '/dev/ttyS1',
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: 'N',
}

/** @type {Record<string, Record<string, unknown>>} */
export const CHANNEL_DEFAULT_CONFIGS = {
  'modbus-tcp': {
    url: 'tcp://127.0.0.1:502',
    ...MODBUS_ADVANCED,
  },
  'modbus-rtu-over-tcp': {
    url: 'tcp+rtu://127.0.0.1:502',
    ...MODBUS_ADVANCED,
  },
  'modbus-rtu': {
    ...MODBUS_RTU_SERIAL,
    ...MODBUS_ADVANCED,
  },
  'bacnet-ip': {
    ip: '0.0.0.0',
    port: 47808,
  },
  'opc-ua': {
    url: 'opc.tcp://localhost:4840',
  },
  s7: {
    port: 102,
    rack: 0,
    slot: 1,
    timeout: 3000,
    max_retries: 1,
    heartbeat_interval: 30000,
    pdu_size: 4096,
    qos: 1,
    connect_timeout: 5000,
    batch_read_max: 100,
    cpu_protection: false,
  },
  'ethernet-ip': {
    port: 44818,
    slot: 0,
    connection_type: 'cip',
    timeout: 2000,
    max_retries: 3,
    retry_interval: 100,
    heartbeat_interval: 30000,
    batch_read_max: 50,
    min_interval: 5,
  },
  'omron-fins': {
    port: 9600,
    mode: 'TCP',
    src_network_addr: 0,
    src_node_addr: 1,
    src_unit_addr: 255,
    dst_network_addr: 0,
    dst_unit_addr: 0,
    timeout: 3000,
    max_retries: 3,
    heartbeat_interval: 30000,
    maxFrameLength: 64,
    min_interval: 0,
  },
  'knxnet-ip': {
    port: 3671,
    mode: 'UDP',
    timeout: 3000,
    max_retries: 3,
    heartbeat_interval: 60000,
    discovery: false,
    discovery_timeout: 3000,
    discovery_multicast: '224.0.23.12:3671',
  },
  'mitsubishi-slmp': {
    port: 5000,
    frame_type: '3E',
    station_no: 0,
    network_no: 0,
    pc_no: 255,
    timeout: 3000,
    max_retries: 2,
    batch_read_max: 64,
  },
  'iec60870-5-104': {
    port: 2404,
    commonAddress: 1,
    generalCallInterval: 300,
    t0: 10,
    t1: 15,
    t2: 10,
    t3: 20,
  },
  snmp: {
    port: 161,
    snmpVersion: 'v2c',
    timeout: 3000,
    retries: 3,
    maxBulkSize: 10,
    sendInterval: 100,
    community: 'public',
    securityLevel: 'authPriv',
    authProtocol: 'SHA256',
    privProtocol: 'AES128',
  },
  dlt645: {
    connectionType: 'serial',
    port: '/dev/ttyS1',
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'N',
    timeout: 2000,
    ip: '192.168.1.100',
  },
}

/**
 * Returns a shallow copy of defaults for the given protocol, or {} if unknown.
 * @param {string} protocol
 */
export function getChannelDefaultConfig(protocol) {
  const defaults = CHANNEL_DEFAULT_CONFIGS[protocol]
  return defaults ? { ...defaults } : {}
}

/**
 * True when a config field has no user value yet.
 * Numeric 0 and boolean false are treated as intentional values.
 * @param {unknown} value
 */
export function isEmptyConfigValue(value) {
  return value === undefined || value === null || value === ''
}

/**
 * Merge protocol defaults into config.
 * By default only fills empty/missing fields so existing user input is preserved.
 * Set fillEmptyOnly=false to reset all config keys to defaults.
 *
 * @param {string} protocol
 * @param {Record<string, unknown>} config
 * @param {{ fillEmptyOnly?: boolean }} [options]
 * @returns {Record<string, unknown>}
 */
export function applyChannelDefaultConfig(protocol, config = {}, options = {}) {
  const { fillEmptyOnly = true } = options
  const defaults = getChannelDefaultConfig(protocol)
  const result = { ...config }

  for (const [key, value] of Object.entries(defaults)) {
    if (fillEmptyOnly) {
      if (isEmptyConfigValue(result[key])) {
        result[key] = value
      }
    } else {
      result[key] = value
    }
  }

  return result
}
