<template>
    <div>
        <v-card class="glass-card">
            <v-card-title class="d-flex align-center py-4 px-6 border-b">
                <v-btn 
                    prepend-icon="mdi-arrow-left" 
                    variant="flat" 
                    color="white" 
                    class="mr-4 text-primary font-weight-bold"
                    elevation="2"
                    @click="$router.push('/')"
                >
                    返回通道
                </v-btn>
            </v-card-title>
            
            <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

            <v-card-text class="pa-0">
                <v-table hover>
                    <thead>
                        <tr>
                            <th class="text-left">设备ID</th>
                            <th class="text-left">设备名称</th>
                            <th class="text-left">状态</th>
                            <th class="text-left">采集间隔</th>
                            <th class="text-left">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="device in devices" :key="device.id">
                            <td class="font-weight-medium">{{ device.id }}</td>
                            <td>{{ device.name }}</td>
                            <td>
                                <v-chip size="small" :color="device.enable ? 'success' : 'grey'" variant="flat">
                                    {{ device.enable ? '启用' : '禁用' }}
                                </v-chip>
                            </td>
                            <td>{{ device.interval }}</td>
                            <td>
                                <v-btn 
                                    color="primary" 
                                    size="small" 
                                    variant="tonal"
                                    prepend-icon="mdi-eye"
                                    @click="goToPoints(device)"
                                >
                                    查看点位
                                </v-btn>
                            </td>
                        </tr>
                        <tr v-if="!loading && devices.length === 0">
                            <td colspan="5" class="text-center pa-8 text-grey">暂无设备</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { globalState, showMessage } from '../composables/useGlobalState'

const route = useRoute()
const router = useRouter()
const devices = ref([])
const channelInfo = ref(null)
const loading = ref(false)
const channelId = route.params.channelId

const fetchDevices = async () => {
    loading.value = true
    try {
        const [devRes, chanRes] = await Promise.all([
            fetch(`/api/channels/${channelId}/devices`),
            fetch(`/api/channels/${channelId}`)
        ])

        if (!devRes.ok) throw new Error('Failed to fetch devices')
        devices.value = await devRes.json()

        if (chanRes.ok) {
            channelInfo.value = await chanRes.json()
            globalState.navTitle = channelInfo.value.name
        }
    } catch (e) {
        showMessage('获取设备失败: ' + e.message, 'error')
    } finally {
        loading.value = false
    }
}

const goToPoints = (device) => {
    router.push(`/channels/${channelId}/devices/${device.id}/points`)
}

onMounted(fetchDevices)
</script>
