import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import PointList from './PointList.vue'
import ModbusSlavePointView from '../components/ModbusSlavePointView.vue'

const { mockGet, mockPost, mockPut, mockDelete, showMessage } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
  mockPut: vi.fn(),
  mockDelete: vi.fn(),
  showMessage: vi.fn(),
}))

vi.mock('@/utils/request', () => ({
  default: {
    get: (...args) => mockGet(...args),
    post: (...args) => mockPost(...args),
    put: (...args) => mockPut(...args),
    delete: (...args) => mockDelete(...args),
  },
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { channelId: 'ch1', deviceId: 'dev1' },
  }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: { value: 'zh' },
  }),
}))

vi.mock('../composables/useGlobalState', () => ({
  globalState: {
    navTitle: '',
    wsStatus: { connected: false },
  },
  showMessage,
}))

class MockWebSocket {
  constructor() {
    this.onopen = null
    this.onmessage = null
    this.onclose = null
  }

  close() {}
}

const mixedPoints = [
  {
    id: 'coil-1',
    name: 'coil-1',
    register_type: 'coil',
    address: 0,
    datatype: 'BOOL',
    readwrite: 'RW',
    quality: 'Good',
    value: 1,
  },
  {
    id: 'holding-1',
    name: 'holding-1',
    register_type: 'holding',
    address: 0,
    datatype: 'UINT16',
    readwrite: 'R',
    quality: 'Bad',
    value: 2,
  },
]

function mockHappyPath() {
  mockGet.mockImplementation((url) => {
    if (url === '/api/channels/ch1') {
      return Promise.resolve({ id: 'ch1', protocol: 'modbus-tcp', name: 'modbus' })
    }
    if (url === '/api/channels/ch1/devices/dev1') {
      return Promise.resolve({
        id: 'dev1',
        name: 'device-1',
        points: mixedPoints,
      })
    }
    if (url.startsWith('/api/values/realtime')) {
      return Promise.resolve({})
    }
    if (url === '/api/channels/ch1/devices/dev1/points') {
      return Promise.resolve(mixedPoints)
    }
    if (url === '/api/channels/ch1/metrics') {
      return Promise.resolve({})
    }
    return Promise.resolve({})
  })
}

async function mountPointList() {
  const wrapper = shallowMount(PointList, {
    global: {
      stubs: {
        'a-button': {
          emits: ['click'],
          template: '<button type="button" v-bind="$attrs" @click="$emit(\'click\', $event)"><slot /><slot name="icon" /></button>',
        },
        'a-input': {
          props: ['modelValue'],
          emits: ['update:modelValue'],
          template: '<input data-stub="a-input" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
        },
        'a-select': {
          props: ['modelValue', 'placeholder', 'options'],
          emits: ['update:modelValue'],
          template: '<div data-stub="a-select" :data-placeholder="placeholder"></div>',
        },
        'a-space': true,
        'a-spin': { template: '<div><slot /></div>' },
        'a-table': true,
        'a-modal': true,
        'a-card': true,
        'a-tooltip': true,
        'a-drawer': true,
        HelpDrawer: true,
        OpcuaScanner: true,
        BACnetScanner: true,
        ModbusPointConfig: true,
        OpcuaPointConfig: true,
        BacnetPointConfig: true,
      },
    },
  })
  await flushPromises()
  await nextTick()
  return wrapper
}

describe('PointList Modbus wiring', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.WebSocket = MockWebSocket
    mockHappyPath()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('wires Modbus props, filters, selection, and loadError lifecycle', async () => {
    const wrapper = await mountPointList()

    expect(wrapper.html()).not.toContain('寄存器类型')
    expect(wrapper.findAll('[data-stub="a-select"]').every((node) => {
      return node.attributes('data-placeholder') !== '寄存器类型'
    })).toBe(true)

    const modbusView = wrapper.findComponent(ModbusSlavePointView)
    expect(modbusView.exists()).toBe(true)
    expect(modbusView.props('allPoints').map((p) => p.id)).toEqual(['coil-1', 'holding-1'])
    expect(modbusView.props('points').map((p) => p.id)).toEqual(['coil-1', 'holding-1'])
    expect(modbusView.props('filterKey')).toBe('["",[]]')
    expect(modbusView.props('loadError')).toBe('')

    wrapper.vm.filters.search = 'Coil'
    wrapper.vm.filters.quality = ['Good', 'Bad']
    await nextTick()
    const keyWithOrderA = modbusView.props('filterKey')
    expect(keyWithOrderA).toBe(JSON.stringify(['coil', ['Bad', 'Good']]))

    wrapper.vm.filters.quality = ['Bad', 'Good']
    await nextTick()
    expect(modbusView.props('filterKey')).toBe(keyWithOrderA)

    await modbusView.vm.$emit('clear-filters')
    await nextTick()
    expect(wrapper.vm.filters.search).toBe('')
    expect(wrapper.vm.filters.quality).toEqual([])

    const getCallsBeforeRetry = mockGet.mock.calls.length
    await modbusView.vm.$emit('retry')
    await flushPromises()
    expect(mockGet.mock.calls.length).toBeGreaterThan(getCallsBeforeRetry)

    await modbusView.vm.$emit('selection-change', ['coil-1', 'holding-1'])
    await nextTick()
    expect(wrapper.text()).toContain('已选 2 项')
    expect(wrapper.text()).toContain('拼虚拟设备 (2)')
    expect(wrapper.text()).toContain('批量删除 (2)')

    wrapper.vm.filters.search = 'holding'
    await nextTick()
    expect(modbusView.props('points').map((p) => p.id)).toEqual(['holding-1'])
    expect(wrapper.vm.selection.selectedIds).toEqual(['coil-1', 'holding-1'])

    wrapper.vm.points = [wrapper.vm.points.find((p) => p.id === 'holding-1')]
    await nextTick()
    expect(wrapper.vm.selection.selectedIds).toEqual(['holding-1'])

    const clearBtn = wrapper.findAll('button').find((node) => node.text().includes('清除选择'))
    expect(clearBtn).toBeTruthy()
    await clearBtn.trigger('click')
    expect(wrapper.vm.selection.selectedIds).toEqual([])

    wrapper.unmount()
  })

  it('keeps cached points and exposes loadError across fetch failures', async () => {
    const wrapper = await mountPointList()
    const modbusView = wrapper.findComponent(ModbusSlavePointView)
    expect(modbusView.props('allPoints')).toHaveLength(2)
    expect(modbusView.props('loadError')).toBe('')

    mockGet.mockImplementation((url) => {
      if (url === '/api/channels/ch1') {
        return Promise.resolve({ id: 'ch1', protocol: 'modbus-tcp', name: 'modbus' })
      }
      if (url === '/api/channels/ch1/devices/dev1') {
        return Promise.reject(new Error('device down'))
      }
      if (url.startsWith('/api/values/realtime')) {
        return Promise.reject(new Error('realtime down'))
      }
      if (url === '/api/channels/ch1/devices/dev1/points') {
        return Promise.reject(new Error('points down'))
      }
      if (url === '/api/channels/ch1/metrics') {
        return Promise.resolve({})
      }
      return Promise.resolve({})
    })

    await wrapper.vm.fetchPoints({ force: true })
    await flushPromises()
    await nextTick()

    expect(wrapper.vm.points.map((p) => p.id)).toEqual(['coil-1', 'holding-1'])
    expect(modbusView.props('loadError')).toContain('获取点位失败')
    expect(modbusView.props('loadError')).toContain('points down')

    mockHappyPath()
    await wrapper.vm.fetchPoints({ force: true })
    await flushPromises()
    await nextTick()
    expect(modbusView.props('loadError')).toBe('')
    expect(modbusView.props('allPoints')).toHaveLength(2)

    wrapper.unmount()
  })

  it('sets blocking loadError when initial load has no points', async () => {
    mockGet.mockImplementation((url) => {
      if (url === '/api/channels/ch1') {
        return Promise.resolve({ id: 'ch1', protocol: 'modbus-tcp', name: 'modbus' })
      }
      if (url === '/api/channels/ch1/devices/dev1') {
        return Promise.reject(new Error('device missing'))
      }
      if (url.startsWith('/api/values/realtime')) {
        return Promise.reject(new Error('realtime missing'))
      }
      if (url === '/api/channels/ch1/devices/dev1/points') {
        return Promise.reject(new Error('points missing'))
      }
      if (url === '/api/channels/ch1/metrics') {
        return Promise.resolve({})
      }
      return Promise.resolve({})
    })

    const wrapper = await mountPointList()
    await flushPromises()
    await nextTick()

    const modbusView = wrapper.findComponent(ModbusSlavePointView)
    expect(modbusView.exists()).toBe(true)
    expect(modbusView.props('allPoints')).toHaveLength(0)
    expect(modbusView.props('loadError')).toContain('获取点位失败')
    expect(modbusView.props('loadError')).toContain('points missing')

    wrapper.unmount()
  })
})
