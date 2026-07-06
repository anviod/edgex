import { describe, it, expect } from 'vitest'
import {
  formatListDetailMetaText,
  getListDetailMetaDotClass,
} from '@/utils/channelMetrics'

describe('formatListDetailMetaText', () => {
  it('shows channel and device count when metrics are unavailable', () => {
    expect(formatListDetailMetaText({
      channelId: 'ch1',
      deviceCount: 8,
      metrics: null,
    })).toBe('通道 ch1 · 8 台设备')
  })

  it('shows offline state when link is down', () => {
    expect(formatListDetailMetaText({
      channelId: 'ch1',
      deviceCount: 3,
      metrics: { linkUp: false },
    })).toBe('通道 ch1 · 3 台设备 · 未连接')
  })

  it('shows link duration and traffic stats when connected', () => {
    expect(formatListDetailMetaText({
      channelId: 'mzp8f02lusxvk0da',
      deviceCount: 8,
      metrics: {
        linkUp: true,
        connectionSeconds: 150,
        totalRequests: 100,
        successCount: 98,
        failureCount: 2,
        successRate: 0.98,
      },
    })).toBe('通道 mzp8f02lusxvk0da · 8 台设备 · 链接 2m 30s · 成功 98 · 失败 2 · 成功率 98.0%')
  })

  it('shows idle sampling hint when connected without traffic', () => {
    expect(formatListDetailMetaText({
      channelId: 'ch1',
      deviceCount: 1,
      metrics: {
        linkUp: true,
        connectionSeconds: 5,
        totalRequests: 0,
      },
    })).toBe('通道 ch1 · 1 台设备 · 链接 5s · 待采样')
  })
})

describe('getListDetailMetaDotClass', () => {
  it('returns empty class when metrics are missing', () => {
    expect(getListDetailMetaDotClass(null)).toBe('')
  })

  it('reflects link and traffic state', () => {
    expect(getListDetailMetaDotClass({ linkUp: false })).toBe('is-offline')
    expect(getListDetailMetaDotClass({ linkUp: true, totalRequests: 0 })).toBe('is-idle')
    expect(getListDetailMetaDotClass({ linkUp: true, totalRequests: 10 })).toBe('is-online')
  })
})
