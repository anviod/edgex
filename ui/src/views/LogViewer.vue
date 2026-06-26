<template>
    <div class="log-viewer-container page-shell page-shell--compact">
        <!-- Toolbar -->
        <div class="log-toolbar toolbar--standalone">
            <div class="toolbar-left">
                <icon-cloud class="toolbar-icon" />
                <span class="toolbar-title">实时日志</span>
            </div>
            <div class="toolbar-right">
                <a-select v-model="selectedLevel" :options="logLevelOptions" placeholder="日志级别" size="small" class="mr-4">
                    <template #option="option">
                        <span>{{ option.label }}</span>
                    </template>
                </a-select>
                <div class="switch-container">
                    <span class="switch-label">实时打印</span>
                    <a-switch v-model="isStreaming" size="small" />
                </div>
                <a-button type="outline" size="small" @click="clearLogs" class="mr-2">
                    <template #icon><icon-delete /></template>
                    清空屏幕
                </a-button>
                <a-button type="primary" size="small" @click="downloadLogs">
                    <template #icon><icon-download /></template>
                    导出 CSV
                </a-button>
            </div>
        </div>

        <!-- Log Terminal -->
        <div class="log-terminal" ref="terminalRef">
            <div v-if="displayLogs.length === 0" class="no-logs">
                暂无日志...
            </div>
            <div v-for="(log, index) in displayLogs" :key="index" class="log-line">
                <span class="log-time">{{ formatTime(log.ts) }}</span>
                <span :class="['log-level', getLevelClass(log.level)]">{{ (log.level || 'INFO').toUpperCase() }}</span>
                <span class="log-message">{{ log.msg }}</span>
                <!-- Render extra fields -->
                <span v-for="(val, key) in getExtraFields(log)" :key="key" class="log-extra">
                    {{ key }}={{ val }}
                </span>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="logs.length > 0" class="log-pagination">
            <a-pagination v-model:current="page" :page-size="perPage" :total="filteredLogs.length" size="small" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { IconCloud, IconDelete, IconDownload } from '@arco-design/web-vue/es/icon'

const logs = ref([])
const isStreaming = ref(true)
const terminalRef = ref(null)
let ws = null
const maxLogs = 1000
const perPage = 30
const page = ref(1)

const selectedLevel = ref('ALL')
const logLevelOptions = [
  { label: 'ALL', value: 'ALL' },
  { label: 'INFO', value: 'INFO' },
  { label: 'WARN', value: 'WARN' },
  { label: 'ERROR', value: 'ERROR' },
  { label: 'DEBUG', value: 'DEBUG' }
]

const filteredLogs = computed(() => {
    if (selectedLevel.value === 'ALL') return logs.value
    return logs.value.filter(log => {
        const lvl = (log.level || 'INFO').toUpperCase()
        return lvl === selectedLevel.value
    })
})

const pageCount = computed(() => {
    return Math.ceil(filteredLogs.value.length / perPage) || 1
})

const displayLogs = computed(() => {
    const start = (page.value - 1) * perPage
    const end = start + perPage
    return filteredLogs.value.slice(start, end)
})

// Auto-switch to first page when streaming
watch(() => logs.value.length, () => {
    if (isStreaming.value && page.value !== 1) {
        page.value = 1
    }
})

// Reset page when filter changes
watch(selectedLevel, () => {
    page.value = 1
})

// Pause streaming when user changes page manually (unless it's the first page)
watch(page, (newVal) => {
    if (newVal !== 1) {
        isStreaming.value = false
    }
})

const connectWs = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    
    // Get token from localStorage
    let token = ''
    try {
        const raw = localStorage.getItem('loginInfo')
        if (raw) {
            const parsed = JSON.parse(raw)
            token = parsed.token || (parsed.data && parsed.data.token) || ''
        }
    } catch (e) {
        console.error('Failed to parse loginInfo', e)
    }
    
    ws = new WebSocket(`${protocol}//${host}/api/ws/logs${token ? `?token=${token}` : ''}`)

    ws.onopen = () => {
        console.log('Log WS connected')
    }

    ws.onmessage = (event) => {
        if (!isStreaming.value) return

        try {
            const log = JSON.parse(event.data)
            logs.value.unshift(log)
            if (logs.value.length > maxLogs) {
                logs.value.pop()
            }
            // Stay on first page
            if (page.value !== 1) {
                page.value = 1
            }
        } catch (e) {
            if (!isStreaming.value) return
            
            logs.value.unshift({ ts: new Date().toISOString(), level: 'INFO', msg: event.data })
            if (page.value !== 1) {
                page.value = 1
            }
        }
    }

    ws.onclose = () => {
        console.log('Log WS closed')
    }
}

const scrollToBottom = () => {
    // No longer needed for reverse order
}


const clearLogs = () => {
    logs.value = []
}

const downloadLogs = () => {
    // Export filteredLogs as CSV
    const headers = ['Timestamp', 'Level', 'Message', 'Details']
    const rows = filteredLogs.value.map(log => {
        const ts = log.ts ? new Date(log.ts).toLocaleString() : ''
        const level = (log.level || 'INFO').toUpperCase()
        const msg = (log.msg || '').replace(/"/g, '""') // Escape quotes
        const details = JSON.stringify(getExtraFields(log)).replace(/"/g, '""')
        return `"${ts}","${level}","${msg}","${details}"`
    })
    
    // Add BOM for Excel utf-8 compatibility
    const bom = '\uFEFF'
    const csvContent = bom + [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `edge_logs_${new Date().toISOString().slice(0,19).replace(/[:T]/g, '-')}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
}

const formatTime = (ts) => {
    if (!ts) return ''
    return new Date(ts).toLocaleTimeString() + '.' + new Date(ts).getMilliseconds().toString().padStart(3, '0')
}

const getLevelClass = (level) => {
    const l = (level || '').toUpperCase()
    if (l === 'ERROR' || l === 'FATAL') return 'error'
    if (l === 'WARN') return 'warn'
    if (l === 'DEBUG') return 'debug'
    return 'info'
}

const getExtraFields = (log) => {
    const { ts, level, msg, caller, ...rest } = log
    return rest
}

onMounted(() => {
    connectWs()
})

onUnmounted(() => {
    if (ws) ws.close()
})
</script>

<style scoped>
/* v3.0 — styles in src/styles/ */
</style>

