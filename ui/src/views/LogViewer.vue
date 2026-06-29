<template>
    <div class="page-shell log-viewer-page">
        <div class="page-header">
            <div>
                <h2 class="page-title">系统日志</h2>
                <p class="page-subtitle">WebSocket 实时日志流 · 支持级别筛选与 CSV 导出</p>
            </div>
        </div>

        <div class="log-viewer-body">
            <div class="log-toolbar form-controls-md">
                <div class="toolbar-left">
                    <div class="log-meta">
                        <span class="log-meta__count">{{ filteredLogs.length }} 条</span>
                        <span class="toolbar-divider" aria-hidden="true"></span>
                        <span
                            class="stream-status"
                            :class="isStreaming ? 'is-live' : 'is-paused'"
                        >
                            <span class="stream-status__dot"></span>
                            {{ isStreaming ? '实时接收中' : '已暂停' }}
                        </span>
                    </div>
                </div>
                <div class="toolbar-right">
                    <a-select
                        v-model="selectedLevel"
                        :options="logLevelOptions"
                        placeholder="日志级别"
                        style="width: 120px"
                    />
                    <div class="switch-group">
                        <span class="switch-label">实时打印</span>
                        <a-switch v-model="isStreaming" />
                    </div>
                    <span class="toolbar-divider" aria-hidden="true"></span>
                    <a-button type="outline" @click="clearLogs">
                        <template #icon><icon-delete /></template>
                        清空屏幕
                    </a-button>
                    <a-button type="primary" @click="downloadLogs">
                        <template #icon><icon-download /></template>
                        导出 CSV
                    </a-button>
                </div>
            </div>

            <div class="log-terminal" ref="terminalRef">
                <div v-if="displayLogs.length === 0" class="log-empty">
                    <icon-file class="log-empty__icon" />
                    <p class="log-empty__title">暂无日志</p>
                    <p class="log-empty__hint">
                        {{ isStreaming ? '等待服务端推送日志…' : '实时打印已关闭，开启后将显示新日志' }}
                    </p>
                </div>
                <div v-for="(log, index) in displayLogs" :key="index" class="log-line">
                    <span class="log-time">{{ formatTime(log.ts) }}</span>
                    <span :class="['log-level', getLevelClass(log.level)]">
                        {{ (log.level || 'INFO').toUpperCase() }}
                    </span>
                    <span class="log-message">{{ log.msg }}</span>
                    <span
                        v-for="(val, key) in getExtraFields(log)"
                        :key="key"
                        class="log-extra"
                    >
                        {{ key }}={{ val }}
                    </span>
                </div>
            </div>

            <div v-if="filteredLogs.length > 0" class="log-pagination">
                <a-pagination
                    v-model:current="page"
                    :page-size="perPage"
                    :total="filteredLogs.length"
                    size="small"
                    show-total
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { IconDelete, IconDownload, IconFile } from '@arco-design/web-vue/es/icon'

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

const displayLogs = computed(() => {
    const start = (page.value - 1) * perPage
    const end = start + perPage
    return filteredLogs.value.slice(start, end)
})

watch(() => logs.value.length, () => {
    if (isStreaming.value && page.value !== 1) {
        page.value = 1
    }
})

watch(selectedLevel, () => {
    page.value = 1
})

watch(page, (newVal) => {
    if (newVal !== 1) {
        isStreaming.value = false
    }
})

const connectWs = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host

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

const clearLogs = () => {
    logs.value = []
}

const downloadLogs = () => {
    const headers = ['Timestamp', 'Level', 'Message', 'Details']
    const rows = filteredLogs.value.map(log => {
        const ts = log.ts ? new Date(log.ts).toLocaleString() : ''
        const level = (log.level || 'INFO').toUpperCase()
        const msg = (log.msg || '').replace(/"/g, '""')
        const details = JSON.stringify(getExtraFields(log)).replace(/"/g, '""')
        return `"${ts}","${level}","${msg}","${details}"`
    })

    const bom = '\uFEFF'
    const csvContent = bom + [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `edge_logs_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`
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
/* v3.0 — styles in src/styles/log-viewer.css */
</style>
