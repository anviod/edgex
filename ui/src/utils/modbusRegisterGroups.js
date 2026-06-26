/** Modbus Slave 风格寄存器分组定义（顺序与 Modbus Slave 一致） */
export const MODBUS_REGISTER_GROUPS = [
  {
    key: 'coil',
    label: 'Coils (0x)',
    title: 'Coils (outputs)',
    fc: '01 / 05 / 15',
    plcBase: 1,
    order: 0
  },
  {
    key: 'discrete_input',
    label: 'Discrete Inputs (1x)',
    title: 'Discrete Inputs',
    fc: '02',
    plcBase: 10001,
    order: 1
  },
  {
    key: 'input',
    label: 'Input Registers (3x)',
    title: 'Input Registers',
    fc: '04',
    plcBase: 30001,
    order: 2
  },
  {
    key: 'holding',
    label: 'Holding Registers (4x)',
    title: 'Holding Registers',
    fc: '03 / 06 / 16',
    plcBase: 40001,
    order: 3
  }
]

const GROUP_BY_KEY = Object.fromEntries(MODBUS_REGISTER_GROUPS.map(g => [g.key, g]))

/** 将后端/表单多种写法归一化为分组 key */
export function normalizeRegisterType(raw, point = {}) {
  if (raw != null && raw !== '') {
    const s = String(raw).toLowerCase().replace(/[\s_-]+/g, ' ')
    if (s.includes('coil') && !s.includes('discrete')) return 'coil'
    if (s.includes('discrete')) return 'discrete_input'
    if (s.includes('input') && !s.includes('holding')) return 'input'
    if (s.includes('holding')) return 'holding'
    if (s === '0' || s === 'holding registers') return 'holding'
  }

  const fc = Number(point.function_code)
  if (fc === 1 || fc === 5 || fc === 15) return 'coil'
  if (fc === 2) return 'discrete_input'
  if (fc === 3 || fc === 6 || fc === 16) return 'holding'
  if (fc === 4) return 'input'

  const id = (point.id || '').toLowerCase()
  if (id.startsWith('coil_')) return 'coil'
  if (id.startsWith('di_')) return 'discrete_input'
  if (id.startsWith('ir_')) return 'input'
  if (id.startsWith('hr_')) return 'holding'

  return 'holding'
}

export function enrichModbusPoint(point) {
  if (!point || typeof point !== 'object') return point
  const registerKey = normalizeRegisterType(point.register_type, point)
  const group = GROUP_BY_KEY[registerKey] || GROUP_BY_KEY.holding
  const offset = Number(point.address)
  const plcAddress = Number.isFinite(offset) ? group.plcBase + offset : null
  return {
    ...point,
    register_key: registerKey,
    register_group: group.title,
    plc_address: plcAddress
  }
}

export function groupPointsByRegisterType(points) {
  const grouped = Object.fromEntries(MODBUS_REGISTER_GROUPS.map(g => [g.key, []]))
  for (const p of points || []) {
    const enriched = enrichModbusPoint(p)
    const key = enriched.register_key || 'holding'
    grouped[key].push(enriched)
  }
  for (const g of MODBUS_REGISTER_GROUPS) {
    grouped[g.key].sort((a, b) => {
      const aa = Number(a.address)
      const bb = Number(b.address)
      if (Number.isFinite(aa) && Number.isFinite(bb)) return aa - bb
      return String(a.address).localeCompare(String(b.address), undefined, { numeric: true })
    })
  }
  return grouped
}

export function formatPlcAddress(registerKey, offset) {
  const group = GROUP_BY_KEY[registerKey] || GROUP_BY_KEY.holding
  const off = Number(offset)
  if (!Number.isFinite(off)) return '—'
  return String(group.plcBase + off)
}

export function formatOffsetAddress(offset) {
  const off = Number(offset)
  if (!Number.isFinite(off)) return String(offset ?? '—')
  return String(off)
}

export const modbusRegisterFilterOptions = [
  { label: '全部类型', value: '' },
  ...MODBUS_REGISTER_GROUPS.map(g => ({ label: g.label, value: g.key }))
]
