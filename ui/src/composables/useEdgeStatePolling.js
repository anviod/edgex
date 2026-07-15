import { ref, watch, onMounted, onUnmounted } from 'vue'

/** Poll intervals (ms) for edge rule runtime state */
export const EDGE_STATE_POLL = {
  STATUS: 1000,
  RULES_FLOW: 2000,
  RULES_TABLE: 5000,
  HIDDEN: 30000,
}

/**
 * Resolve poll interval for current UI context.
 * Returns null when polling should be paused.
 */
export function resolveEdgeStatePollInterval({ tab, rulesViewMode, pageVisible }) {
  if (!pageVisible) return EDGE_STATE_POLL.HIDDEN

  switch (tab) {
    case 'status':
      return EDGE_STATE_POLL.STATUS
    case 'rules':
      return rulesViewMode === 'flow' ? EDGE_STATE_POLL.RULES_FLOW : EDGE_STATE_POLL.RULES_TABLE
    default:
      return null
  }
}

/**
 * Adaptive polling for /api/edge/states — fast when flow UI is visible, slow when hidden.
 */
export function useEdgeStatePolling({ tab, rulesViewMode, fetchRuleStates }) {
  const pageVisible = ref(typeof document !== 'undefined' ? !document.hidden : true)
  let timer = null
  let fetching = false

  const fetchSafe = async () => {
    if (fetching) return
    fetching = true
    try {
      await fetchRuleStates()
    } finally {
      fetching = false
    }
  }

  const clearTimer = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  const restart = () => {
    clearTimer()
    const intervalMs = resolveEdgeStatePollInterval({
      tab: tab.value,
      rulesViewMode: rulesViewMode.value,
      pageVisible: pageVisible.value,
    })
    if (intervalMs == null) return
    timer = setInterval(fetchSafe, intervalMs)
  }

  const onVisibilityChange = () => {
    const visible = !document.hidden
    if (visible === pageVisible.value) return
    pageVisible.value = visible
    if (visible) {
      fetchSafe()
    }
    restart()
  }

  watch([tab, rulesViewMode, pageVisible], ([newTab, newMode], [oldTab, oldMode]) => {
    if (newTab !== oldTab || (newTab === 'rules' && newMode !== oldMode)) {
      fetchSafe()
    }
    restart()
  })

  onMounted(() => {
    document.addEventListener('visibilitychange', onVisibilityChange)
    fetchSafe()
    restart()
  })

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', onVisibilityChange)
    clearTimer()
  })

  return { refresh: fetchSafe, restart }
}
