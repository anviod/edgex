import { ref, watch } from 'vue'

const STORAGE_KEY = 'edgex-ai-assistant'

const defaultState = () => ({
  expanded: false,
  miniMode: false,
  workspace: 'protocol',
  workspaceCollapsed: false,
  chatOpen: true,
  position: { x: null, y: null },
  size: { width: 860, height: 620 }
})

const clampPosition = (position, size) => {
  if (position?.x == null || position?.y == null) return { x: null, y: null }
  const w = size?.width || 860
  const h = size?.height || 620
  const maxX = Math.max(8, (typeof window !== 'undefined' ? window.innerWidth : 1200) - Math.min(w, 200))
  const maxY = Math.max(8, (typeof window !== 'undefined' ? window.innerHeight : 800) - Math.min(h, 80))
  return {
    x: Math.max(8, Math.min(position.x, maxX)),
    y: Math.max(8, Math.min(position.y, maxY))
  }
}

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const merged = { ...defaultState(), ...parsed, mode: undefined }
      // Never restore open/collapsed UI flags — always start with FAB visible
      merged.expanded = false
      merged.miniMode = false
      merged.position = clampPosition(merged.position, merged.size)
      return merged
    }
  } catch (e) {
    console.warn('AI assistant state restore failed', e)
  }
  return defaultState()
}

const state = ref(loadState())

watch(
  state,
  (val) => {
    try {
      // Persist layout prefs only — not expanded/miniMode (avoids invisible FAB on reload)
      const toSave = {
        workspace: val.workspace,
        workspaceCollapsed: val.workspaceCollapsed,
        chatOpen: val.chatOpen,
        position: val.position,
        size: val.size
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch (e) {
      console.warn('AI assistant state persist failed', e)
    }
  },
  { deep: true }
)

export const AI_WORKSPACES = [
  {
    id: 'protocol',
    label: '协议工作台',
    goal: 'G0/G1',
    description: 'PCAP / 文档 / 监控表 → 四类生产配置',
    icon: 'protocol'
  },
  {
    id: 'validation',
    label: 'Schema 校验',
    goal: 'G2',
    description: '导入前 Protocol / Point / Driver 规范校验',
    icon: 'validate'
  },
  {
    id: 'cases',
    label: '验证用例',
    goal: 'G3',
    description: '可回放 Validation Case 与证据链',
    icon: 'cases'
  },
  {
    id: 'edge',
    label: '边缘场景',
    goal: 'G4',
    description: '场景描述 → EdgeRule / 模版 JSON 草案',
    icon: 'edge'
  },
  {
    id: 'diagnostics',
    label: '联调诊断',
    goal: 'G5',
    description: 'diagnostics + 日志 → 排查步骤',
    icon: 'diagnostics'
  }
]

export const DELIVERABLE_TYPES = [
  { id: 'protocol_model', label: 'Protocol Model', desc: '协议帧特征与地址模型' },
  { id: 'point_definition', label: 'Point Definition', desc: '可导入点位 JSON' },
  { id: 'driver_parameter', label: 'Driver Parameter', desc: 'Channel 连接参数' },
  { id: 'validation_case', label: 'Validation Case', desc: '期望读数与帧证据' }
]

export const PIPELINE_STAGES = [
  { id: 'capture', label: 'Capture', sub: '抓包解帧' },
  { id: 'decode', label: 'Decode', sub: '报文结构' },
  { id: 'semantic', label: 'Semantic', sub: '物理量推理' },
  { id: 'output', label: 'Output', sub: '生产配置' }
]

export function useAiAssistant() {
  const setExpanded = (value) => {
    state.value.expanded = value
    if (value) state.value.miniMode = false
  }

  const setMiniMode = (value) => {
    state.value.miniMode = value
    if (value) state.value.expanded = true
  }

  const setWorkspace = (id) => {
    state.value.workspace = id
  }

  const setChatOpen = (value) => {
    state.value.chatOpen = value
  }

  const setWorkspaceCollapsed = (value) => {
    state.value.workspaceCollapsed = value
    // When workspace collapses, ensure chat is visible so the panel is never empty
    if (value && !state.value.chatOpen) {
      state.value.chatOpen = true
    }
  }

  const toggleWorkspaceCollapsed = () => {
    state.value.workspaceCollapsed = !state.value.workspaceCollapsed
  }

  const setPosition = (x, y) => {
    state.value.position = clampPosition({ x, y }, state.value.size)
  }

  const setSize = (width, height) => {
    state.value.size = { width, height }
  }

  const collapseToFab = () => {
    state.value.expanded = false
    state.value.miniMode = false
  }

  const getWorkspaceConfig = (id) => {
    return AI_WORKSPACES.find((w) => w.id === id) || AI_WORKSPACES[0]
  }

  return {
    state,
    setExpanded,
    setMiniMode,
    setWorkspace,
    setChatOpen,
    setWorkspaceCollapsed,
    toggleWorkspaceCollapsed,
    setPosition,
    setSize,
    collapseToFab,
    getWorkspaceConfig,
    AI_WORKSPACES,
    DELIVERABLE_TYPES,
    PIPELINE_STAGES
  }
}
