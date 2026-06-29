/**
 * Helpers for device IDs in frontend routes and API paths.
 * OPC UA and other protocols may use IDs containing / : and other reserved characters.
 */

export function encodePathSegment(value) {
  if (value == null) return ''
  return encodeURIComponent(String(value))
}

export function decodePathSegment(value) {
  if (value == null || value === '') return value ?? ''
  try {
    return decodeURIComponent(String(value))
  } catch {
    return String(value)
  }
}

export function devicePointsRoutePath(channelId, deviceId) {
  return `/channels/${encodePathSegment(channelId)}/devices/${encodePathSegment(deviceId)}/points`
}

export function channelDeviceApiPath(channelId, deviceId, ...segments) {
  const parts = [
    '/api/channels',
    encodePathSegment(channelId),
    'devices',
    encodePathSegment(deviceId),
    ...segments.flat().filter((s) => s != null && s !== '').map((s) => encodePathSegment(String(s))),
  ]
  return parts.join('/')
}

export function deviceApiPath(deviceId, ...segments) {
  const parts = [
    '/api/devices',
    encodePathSegment(deviceId),
    ...segments.flat().filter((s) => s != null && s !== '').map((s) => encodePathSegment(String(s))),
  ]
  return parts.join('/')
}
