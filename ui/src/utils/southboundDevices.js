/** 拉取全部南向设备（与 ChannelList 一致，兼容数组 / { data } 响应） */
export async function fetchAllSouthboundDevices(request) {
  const res = await request.get('/api/channels')
  const channels = Array.isArray(res) ? res : (res?.data || [])
  const devices = []

  for (const ch of channels) {
    let devs = []
    if (Array.isArray(ch.devices) && ch.devices.length > 0) {
      devs = ch.devices
    } else if (ch.id) {
      const devRes = await request.get(`/api/channels/${ch.id}/devices`)
      devs = Array.isArray(devRes) ? devRes : (devRes?.data || [])
    }
    devs.forEach((d) => {
      devices.push({ ...d, channelName: ch.name })
    })
  }

  return devices
}

/** 根据北向配置中的 devices 映射，构建上报策略表格行 */
export function buildNorthboundDeviceRows(allDevices, deviceConfig, defaultInterval = '10s') {
  return (allDevices || []).map((dev) => {
    const current = deviceConfig?.[dev.id]
    let _enable = false
    let _strategy = 'periodic'
    let _interval = defaultInterval

    if (current === undefined || current === null) {
      _enable = false
    } else if (typeof current === 'boolean') {
      _enable = current
      if (_enable) {
        _strategy = 'periodic'
        _interval = defaultInterval
      }
    } else if (typeof current === 'object') {
      _enable = !!current.enable
      _strategy = current.strategy || 'periodic'
      _interval = current.interval || defaultInterval
    }

    return { ...dev, _enable, _strategy, _interval }
  })
}

/** 根据 OPC UA 配置中的 virtual_devices 映射，构建虚拟设备暴露表格行 */
export function buildNorthboundVirtualDeviceRows(allVirtualDevices, deviceConfig) {
  const allowAll = !deviceConfig || Object.keys(deviceConfig).length === 0
  return (allVirtualDevices || []).map((dev) => {
    const current = deviceConfig?.[dev.id]
    let _enable = allowAll
    if (current === undefined || current === null) {
      _enable = allowAll
    } else if (typeof current === 'boolean') {
      _enable = current
    } else if (typeof current === 'object') {
      _enable = !!current.enable
    }
    return {
      ...dev,
      pointCount: dev.points?.length || 0,
      _enable
    }
  })
}

/** 根据北向配置中的 virtual_devices 映射，构建虚拟设备上报策略表格行 */
export function buildNorthboundVirtualDeviceStrategyRows(allVirtualDevices, deviceConfig, defaultInterval = '10s') {
  return (allVirtualDevices || []).map((dev) => {
    const current = deviceConfig?.[dev.id]
    let _enable = false
    let _strategy = 'periodic'
    let _interval = defaultInterval

    if (current === undefined || current === null) {
      _enable = false
    } else if (typeof current === 'boolean') {
      _enable = current
      if (_enable) {
        _strategy = 'periodic'
        _interval = defaultInterval
      }
    } else if (typeof current === 'object') {
      _enable = !!current.enable
      _strategy = current.strategy || 'periodic'
      _interval = current.interval || defaultInterval
    }

    return {
      ...dev,
      pointCount: dev.points?.length || 0,
      _enable,
      _strategy,
      _interval
    }
  })
}

/** 将虚拟设备表格行同步回 OPC UA 配置的 virtual_devices 字段（稀疏存储） */
export function syncNorthboundVirtualDevicesFromRows(rows) {
  if (!rows?.length) {
    return {}
  }
  const devices = {}
  let allEnabled = true
  for (const record of rows) {
    if (!record._enable) {
      allEnabled = false
    }
    devices[record.id] = { enable: record._enable }
  }
  // 全部启用时使用空 map，保持默认"全部暴露"语义
  return allEnabled ? {} : devices
}
