import request from '@/utils/request'

export function listVirtualShadows() {
  return request.get('/api/virtual-shadows')
}

export function getVirtualShadow(id, options = {}) {
  const params = {}
  if (options.refresh) params.refresh = '1'
  return request.get(`/api/virtual-shadows/${encodeURIComponent(id)}`, { params })
}

export function listVirtualShadowSources() {
  return request.get('/api/virtual-shadows/sources')
}

/** 模糊检索源设备（q 必填） */
export function searchVirtualShadowDevices(params) {
  return request.get('/api/virtual-shadows/devices', { params })
}

/** 加载指定设备的可选点位 */
export function listDevicePointSources(channelId, deviceId, q) {
  return request.get(`/api/virtual-shadows/devices/${encodeURIComponent(channelId)}/${encodeURIComponent(deviceId)}/points`, {
    params: q ? { q } : undefined
  })
}

export function createVirtualShadow(payload) {
  return request.post('/api/virtual-shadows', payload)
}

export function updateVirtualShadow(id, payload) {
  const safeId = encodeURIComponent(id)
  // 优先 POST：部分工业网关/反向代理会拦截 PUT 并返回 405
  return request.post(`/api/virtual-shadows/${safeId}/update`, payload)
}

export function deleteVirtualShadow(id) {
  return request.delete(`/api/virtual-shadows/${id}`)
}

export async function fetchSourceValues(sources) {
  const byDevice = new Map()
  for (const src of sources || []) {
    const key = `${src.channel_id}::${src.device_id}`
    if (!byDevice.has(key)) {
      byDevice.set(key, { channelId: src.channel_id, deviceId: src.device_id })
    }
  }
  const valueMap = {}
  await Promise.all(
    [...byDevice.values()].map(async ({ channelId, deviceId }) => {
      try {
        const data = await request.get('/api/values/realtime', {
          params: { channel_id: channelId, device_id: deviceId },
          silent: true
        })
        if (!data || typeof data !== 'object') return
        for (const [pid, info] of Object.entries(data)) {
          valueMap[`${channelId}.${deviceId}.${pid}`] = info
        }
      } catch (_) {
        /* ignore per-device fetch errors */
      }
    })
  )
  return valueMap
}
