import { channelDeviceApiPath } from '@/utils/deviceRoute'

export function unwrapListResponse(data) {
  return Array.isArray(data) ? data : (data?.data || [])
}

export function toOptionLabel(item, fallbackText) {
  if (typeof item === 'string' || typeof item === 'number') return String(item)

  const candidates = [
    item?.name,
    item?.device_name,
    item?.point_name,
    item?.label,
    item?.id,
    item?.value
  ]

  const candidate = candidates.find((value) => value != null && String(value).trim() !== '')
  return candidate == null ? fallbackText : String(candidate)
}

/** Writable for edge rule control actions (legacy: only explicit R is excluded). */
export function isWritablePoint(point) {
  return point?.readwrite !== 'R'
}

export function normalizeDeviceOptions(data) {
  return unwrapListResponse(data).map((d) => ({
    label: toOptionLabel(d, 'Unnamed Device'),
    value: typeof d === 'string' || typeof d === 'number'
      ? String(d)
      : String(d?.id ?? d?.value ?? toOptionLabel(d, 'Unnamed Device')),
    raw: d
  }))
}

function mapPointOption(p) {
  return {
    label: toOptionLabel(p, 'Unnamed Point'),
    value: typeof p === 'string' || typeof p === 'number'
      ? String(p)
      : String(p?.id ?? p?.value ?? toOptionLabel(p, 'Unnamed Point')),
    raw: p
  }
}

/** All configured points (matches EdgeCompute Sources dropdown). */
export function normalizePointOptions(points) {
  return (Array.isArray(points) ? points : []).map(mapPointOption)
}

export function normalizeWritablePointOptions(points) {
  return (Array.isArray(points) ? points : [])
    .filter(isWritablePoint)
    .map(mapPointOption)
}

async function fetchPointOptionsFromApi(request, channelId, deviceId, normalize) {
  const response = await request.get(
    channelDeviceApiPath(channelId, deviceId, 'points'),
    { timeout: 8000, silent: true }
  )
  return normalize(unwrapListResponse(response))
}

/** Load point dropdown options the same way as EdgeCompute Sources (no readwrite filter). */
export async function fetchPointOptions(request, channelId, deviceId, embeddedPoints) {
  const embedded = Array.isArray(embeddedPoints) ? embeddedPoints : []
  const embeddedOptions = normalizePointOptions(embedded)

  // /devices payload may embed an incomplete points snapshot; prefer /points API
  // (same as CloneDialog / PointList) and fall back to embedded when the API fails.
  if (channelId && deviceId) {
    try {
      const fetched = await fetchPointOptionsFromApi(
        request,
        channelId,
        deviceId,
        normalizePointOptions
      )
      if (fetched.length > 0) {
        return fetched
      }
    } catch (error) {
      console.error('Failed to load device points', error)
    }
  }

  return embeddedOptions
}

export async function fetchWritablePointOptions(request, channelId, deviceId, embeddedPoints) {
  const embedded = Array.isArray(embeddedPoints) ? embeddedPoints : []
  const embeddedOptions = normalizeWritablePointOptions(embedded)

  if (channelId && deviceId) {
    try {
      const fetched = await fetchPointOptionsFromApi(
        request,
        channelId,
        deviceId,
        normalizeWritablePointOptions
      )
      if (fetched.length > 0) {
        return fetched
      }
    } catch (error) {
      console.error('Failed to load device points', error)
    }
  }

  return embeddedOptions
}
