<template>
    <div>
        <v-card class="glass-card no-hover">
            <v-card-title class="d-flex align-center py-4 px-6 border-b">
                <v-btn 
                    prepend-icon="mdi-arrow-left" 
                    variant="flat" 
                    color="white" 
                    class="mr-4 text-primary font-weight-bold"
                    elevation="2"
                    @click="$router.back()"
                >
                    返回设备
                </v-btn>

                <v-spacer></v-spacer>
                <v-btn 
                    color="primary" 
                    variant="tonal" 
                    prepend-icon="mdi-refresh" 
                    @click="fetchPoints"
                    :loading="loading"
                >
                    刷新
                </v-btn>
            </v-card-title>
            
            <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

            <v-card-text class="pa-0">
                <v-table hover>
                    <thead>
                        <tr>
                            <th class="text-left">点位ID</th>
                            <th class="text-left">点位名称</th>
                            <th class="text-left">数值</th>
                            <th class="text-left">质量</th>
                            <th class="text-left">时间戳</th>
                            <th class="text-left">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="point in points" :key="point.id">
                            <td class="font-weight-medium">{{ point.id }}</td>
                            <td>{{ point.name }}</td>
                            <td>
                                <span class="text-h6 font-weight-bold text-primary">{{ formatValue(point.value) }}</span>
                                <span v-if="point.unit" class="text-caption ml-1">{{ point.unit }}</span>
                            </td>
                            <td>
                                <v-chip 
                                    size="small" 
                                    :color="isQualityGood(point.quality) ? 'success' : 'error'" 
                                    variant="flat"
                                >
                                    {{ point.quality }}
                                </v-chip>
                            </td>
                            <td class="text-body-2">{{ formatDate(point.timestamp) }}</td>
                            <td>
                                <v-btn 
                                    v-if="point.readwrite === 'RW' || point.readwrite === 'W'"
                                    color="secondary" 
                                    size="small" 
                                    variant="tonal"
                                    prepend-icon="mdi-pencil"
                                    @click="openWriteDialog(point)"
                                >
                                    写入
                                </v-btn>
                            </td>
                        </tr>
                        <tr v-if="!loading && points.length === 0">
                            <td colspan="6" class="text-center pa-8 text-grey">暂无点位数据</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>

        <!-- Write Dialog -->
        <v-dialog v-model="writeDialog.visible" max-width="400" persistent>
            <v-card class="rounded-xl bg-white elevation-10">
                <v-card-title class="text-h5 pa-4 bg-primary text-white">
                    <v-icon icon="mdi-pencil" class="mr-2"></v-icon>
                    写入数值
                </v-card-title>
                <v-card-text class="pa-4 pt-6">
                    <v-form @submit.prevent="submitWrite">
                        <v-text-field
                            v-model="writeDialog.deviceID"
                            label="设备ID"
                            variant="outlined"
                            readonly
                            density="compact"
                            prepend-inner-icon="mdi-devices"
                            class="mb-2"
                        ></v-text-field>
                        <v-text-field
                            v-model="writeDialog.pointID"
                            label="点位ID"
                            variant="outlined"
                            readonly
                            density="compact"
                            prepend-inner-icon="mdi-tag"
                            class="mb-2"
                        ></v-text-field>
                        <v-text-field
                            v-model="writeDialog.value"
                            label="新数值"
                            variant="outlined"
                            density="comfortable"
                            prepend-inner-icon="mdi-cog"
                            placeholder="请输入要写入的值"
                            autofocus
                        ></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions class="pa-4 pt-0">
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="text" @click="writeDialog.visible = false">取消</v-btn>
                    <v-btn color="primary" variant="elevated" @click="submitWrite" :loading="writeDialog.loading">确认写入</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { globalState, showMessage } from '../composables/useGlobalState'

const route = useRoute()
const points = ref([])
const deviceInfo = ref(null)
const loading = ref(false)
const channelId = route.params.channelId
const deviceId = route.params.deviceId

// Write Dialog State
const writeDialog = reactive({
    visible: false,
    deviceID: '',
    pointID: '',
    value: '',
    loading: false
})

const fetchPoints = async () => {
    loading.value = true
    try {
        const [ptsRes, devRes] = await Promise.all([
            fetch(`/api/channels/${channelId}/devices/${deviceId}/points`),
            fetch(`/api/channels/${channelId}/devices/${deviceId}`)
        ])

        if (!ptsRes.ok) throw new Error('Failed to fetch points')
        points.value = await ptsRes.json()

        if (devRes.ok) {
            deviceInfo.value = await devRes.json()
            globalState.navTitle = deviceInfo.value.name
        }
    } catch (e) {
        showMessage('获取点位失败: ' + e.message, 'error')
    } finally {
        loading.value = false
    }
}

// WebSocket Logic
let ws = null
const connectWs = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    ws = new WebSocket(`${protocol}//${host}/api/ws/values`)

    ws.onopen = () => {
        globalState.wsStatus.connected = true
    }

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            if (data.channel_id === channelId && data.device_id === deviceId) {
                const idx = points.value.findIndex(p => p.id === data.point_id)
                if (idx !== -1) {
                    points.value[idx].value = data.value
                    points.value[idx].quality = data.quality
                    points.value[idx].timestamp = data.timestamp
                }
            }
        } catch (e) { console.error(e) }
    }

    ws.onclose = () => {
        globalState.wsStatus.connected = false
    }
}

onMounted(() => {
    fetchPoints()
    connectWs()
})

onUnmounted(() => {
    if (ws) ws.close()
})

// Helpers
const formatValue = (val) => {
    if (typeof val === 'number') return val.toFixed(2)
    return val
}
const formatDate = (ts) => new Date(ts).toLocaleString()
const isQualityGood = (q) => q === 'Good' || q === 'good'

// Write Logic
const openWriteDialog = (point) => {
    writeDialog.deviceID = deviceId
    writeDialog.pointID = point.id
    writeDialog.value = ''
    writeDialog.visible = true
}

const submitWrite = async () => {
    writeDialog.loading = true
    try {
        const res = await fetch('/api/write', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                channel_id: channelId,
                device_id: deviceId,
                point_id: writeDialog.pointID,
                value: writeDialog.value
            })
        })
        const result = await res.json()
        if (res.ok) {
            showMessage('写入命令已发送', 'success')
            writeDialog.visible = false
        } else {
            showMessage('写入失败: ' + result.error, 'error')
        }
    } catch (e) {
        showMessage('网络错误: ' + e.message, 'error')
    } finally {
        writeDialog.loading = false
    }
}
</script>
