<template>
    <div class="h-100 d-flex flex-column pa-4">
        <!-- Toolbar -->
        <v-toolbar class="glass-toolbar mb-4 rounded-lg border elevation-1" density="comfortable">
            <v-toolbar-title class="text-subtitle-1 font-weight-bold ml-4 d-flex align-center">
                <v-icon icon="mdi-console-line" size="small" start color="primary" class="mr-2"></v-icon>
                实时日志
            </v-toolbar-title>
            
            <v-spacer></v-spacer>

            <v-select
                v-model="selectedLevel"
                :items="logLevels"
                label="日志级别"
                density="compact"
                hide-details
                variant="outlined"
                class="mr-4 my-auto"
                style="max-width: 150px"
            ></v-select>

            <v-switch
                v-model="isStreaming"
                color="success"
                label="实时打印"
                hide-details
                inset
                class="mr-4"
                density="compact"
            ></v-switch>

            <v-btn
                variant="tonal"
                color="warning"
                prepend-icon="mdi-delete-sweep"
                size="small"
                @click="clearLogs"
                class="mr-2 rounded"
            >
                清空屏幕
            </v-btn>

            <v-btn
                variant="tonal"
                color="primary"
                prepend-icon="mdi-download"
                size="small"
                @click="downloadLogs"
                class="mr-4 rounded"
            >
                导出 CSV
            </v-btn>
        </v-toolbar>

        <!-- Log Terminal -->
        <div class="log-terminal flex-grow-1 rounded-lg pa-4 mb-2 border elevation-0" ref="terminalRef">
            <div v-if="displayLogs.length === 0" class="text-grey text-center mt-10">
                暂无日志...
            </div>
            <div v-for="(log, index) in displayLogs" :key="index" class="log-line">
                <span class="text-grey-darken-1 mr-2">[{{ formatTime(log.ts) }}]</span>
                <span :class="getLevelClass(log.level)" class="font-weight-bold mr-2">{{ (log.level || 'INFO').toUpperCase() }}</span>
                <span class="text-black">{{ log.msg }}</span>
                <!-- Render extra fields -->
                <span v-for="(val, key) in getExtraFields(log)" :key="key" class="text-grey-darken-2 ml-2 text-caption">
                    {{ key }}={{ val }}
                </span>
            </div>
        </div>

        <!-- Pagination -->
        <v-pagination
            v-if="logs.length > 0"
            v-model="page"
            :length="pageCount"
            :total-visible="7"
            density="compact"
            class="mb-2"
        ></v-pagination>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const logs = ref([])
const isStreaming = ref(true)
const terminalRef = ref(null)
let ws = null
const maxLogs = 1000
const perPage = 30
const page = ref(1)

const selectedLevel = ref('ALL')
const logLevels = ['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG']

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
    if (l === 'ERROR' || l === 'FATAL') return 'text-error'
    if (l === 'WARN') return 'text-warning'
    if (l === 'DEBUG') return 'text-grey'
    return 'text-success'
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
.glass-toolbar {
    background: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(10px);
}
.log-terminal {
    background-color: #ffffff;
    overflow-y: auto;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 13px;
    line-height: 1.4;
    border: 1px solid rgba(0,0,0,0.1);
    color: #333;
}
.log-line {
    word-break: break-all;
    white-space: pre-wrap;
    border-bottom: 1px solid #f5f5f5;
    padding: 2px 0;
}
.text-error { color: #d32f2f !important; }
.text-warning { color: #f57c00 !important; }
.text-success { color: #388e3c !important; }
.text-grey { color: #757575 !important; }
.text-black { color: #212121 !important; }
</style>
