import { describe, it, expect } from 'vitest'
import {
  encodePathSegment,
  decodePathSegment,
  devicePointsRoutePath,
  channelDeviceApiPath,
  deviceApiPath,
} from '@/utils/deviceRoute'

const OPC_DEVICE_ID = 'opc.tcp://LAPTOP-5E3D21EG:53530/OPCUA/SimulationServer'

describe('deviceRoute helpers', () => {
  it('encodes OPC UA device IDs without raw slashes in paths', () => {
    const encoded = encodePathSegment(OPC_DEVICE_ID)
    expect(encoded).not.toContain('/')
    expect(encoded).toContain('%2F')
    expect(decodePathSegment(encoded)).toBe(OPC_DEVICE_ID)
  })

  it('builds a safe points route path', () => {
    const path = devicePointsRoutePath('ch1', OPC_DEVICE_ID)
    expect(path).toBe(
      '/channels/ch1/devices/opc.tcp%3A%2F%2FLAPTOP-5E3D21EG%3A53530%2FOPCUA%2FSimulationServer/points'
    )
  })

  it('builds encoded channel device API paths', () => {
    expect(channelDeviceApiPath('ch1', OPC_DEVICE_ID, 'points')).toBe(
      '/api/channels/ch1/devices/opc.tcp%3A%2F%2FLAPTOP-5E3D21EG%3A53530%2FOPCUA%2FSimulationServer/points'
    )
    expect(channelDeviceApiPath('ch1', OPC_DEVICE_ID, 'points', 'node-1')).toBe(
      '/api/channels/ch1/devices/opc.tcp%3A%2F%2FLAPTOP-5E3D21EG%3A53530%2FOPCUA%2FSimulationServer/points/node-1'
    )
  })

  it('builds encoded device-only API paths', () => {
    expect(deviceApiPath(OPC_DEVICE_ID, 'history')).toBe(
      '/api/devices/opc.tcp%3A%2F%2FLAPTOP-5E3D21EG%3A53530%2FOPCUA%2FSimulationServer/history'
    )
  })

  it('returns legacy values when decode fails', () => {
    expect(decodePathSegment('plain-device-id')).toBe('plain-device-id')
  })
})
