<template>
    <div>
        <div v-if="loading" class="d-flex justify-center mt-12">
            <v-progress-circular indeterminate color="white" size="64"></v-progress-circular>
        </div>

        <v-row v-else>
            <!-- MQTT Card -->
            <v-col cols="12" md="6">
                <v-card class="glass-card h-100">
                    <v-card-title class="d-flex align-center border-b py-4">
                        <v-icon icon="mdi-access-point-network" color="primary" class="mr-3"></v-icon>
                        MQTT 客户端
                        <v-spacer></v-spacer>
                        <v-btn icon="mdi-cog" variant="text" size="small" color="primary" @click="openMqttSettings"></v-btn>
                        
                        <template v-if="!config.mqtt.enable">
                            <v-chip color="grey" size="small" class="ml-2">未启用</v-chip>
                        </template>
                        <template v-else>
                            <v-chip v-if="config.status?.mqtt === 1" color="success" size="small" class="ml-2">已连接</v-chip>
                            <v-chip v-else-if="config.status?.mqtt === 2" color="warning" size="small" class="ml-2 blink">重连中</v-chip>
                            <v-chip v-else color="error" size="small" class="ml-2">连接断开</v-chip>
                        </template>
                    </v-card-title>
                    <v-card-text class="pt-4">
                        <v-list density="compact" bg-color="transparent">
                            <v-list-item title="Broker地址" :subtitle="config.mqtt.broker">
                                <template v-slot:prepend><v-icon icon="mdi-server" color="grey"></v-icon></template>
                            </v-list-item>
                            <v-list-item title="Client ID" :subtitle="config.mqtt.client_id">
                                <template v-slot:prepend><v-icon icon="mdi-identifier" color="grey"></v-icon></template>
                            </v-list-item>
                            <v-list-item title="发布主题" :subtitle="config.mqtt.topic">
                                <template v-slot:prepend><v-icon icon="mdi-post" color="grey"></v-icon></template>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- OPC UA Server Card -->
            <v-col cols="12" md="6">
                <v-card class="glass-card h-100">
                    <v-card-title class="d-flex align-center border-b py-4">
                        <v-icon icon="mdi-server" color="primary" class="mr-3"></v-icon>
                        OPC UA 服务端
                        <v-spacer></v-spacer>
                        <v-btn icon="mdi-cog" variant="text" size="small" color="primary" @click="openOpcuaSettings"></v-btn>
                        <v-chip :color="config.opcua.enable ? 'success' : 'grey'" size="small" class="ml-2">
                            {{ config.opcua.enable ? '启用' : '禁用' }}
                        </v-chip>
                    </v-card-title>
                    <v-card-text class="pt-4">
                        <v-list density="compact" bg-color="transparent">
                            <v-list-item title="监听端口" :subtitle="config.opcua.port">
                                <template v-slot:prepend><v-icon icon="mdi-lan-pending" color="grey"></v-icon></template>
                            </v-list-item>
                            <v-list-item title="Endpoint" :subtitle="config.opcua.endpoint">
                                <template v-slot:prepend><v-icon icon="mdi-link" color="grey"></v-icon></template>
                            </v-list-item>
                            <v-list-item title="完整地址" :subtitle="'opc.tcp://localhost:' + config.opcua.port + config.opcua.endpoint">
                                <template v-slot:prepend><v-icon icon="mdi-web" color="grey"></v-icon></template>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- MQTT Settings Dialog -->
        <v-dialog v-model="mqttDialog.visible" max-width="1024px">
            <v-card>
                <v-card-title class="text-h5 pa-4">MQTT 配置</v-card-title>
                <v-card-text>
                    <v-form>
                        <v-switch v-model="mqttDialog.config.enable" label="启用 MQTT 客户端" color="primary" inset></v-switch>
                        <v-text-field v-model="mqttDialog.config.broker" label="Broker 地址" hint="tcp://127.0.0.1:1883" persistent-hint variant="outlined" density="compact" class="mb-2"></v-text-field>
                        <v-text-field v-model="mqttDialog.config.client_id" label="Client ID" variant="outlined" density="compact" class="mb-2"></v-text-field>
                        <v-text-field v-model="mqttDialog.config.topic" label="发布主题" variant="outlined" density="compact" class="mb-2"></v-text-field>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="mqttDialog.config.username" label="用户名" variant="outlined" density="compact"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="mqttDialog.config.password" label="密码" type="password" variant="outlined" density="compact"></v-text-field>
                            </v-col>
                        </v-row>

                        <v-divider class="my-4"></v-divider>
                        <div class="text-subtitle-1 mb-2 font-weight-bold">设备上报策略</div>
                        <v-table density="compact" class="border rounded" style="max-height: 400px; overflow-y: auto;">
                            <thead>
                                <tr>
                                    <th>设备名称</th>
                                    <th style="width: 80px;">启用</th>
                                    <th style="width: 250px;">策略</th>
                                    <th style="width: 150px;">上报周期</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="dev in allDevices" :key="dev.id">
                                    <td>
                                        <div>{{ dev.name }}</div>
                                        <div class="text-caption text-grey">{{ dev.channelName }}</div>
                                    </td>
                                    <td>
                                        <v-checkbox-btn 
                                            v-if="mqttDialog.config.devices[dev.id]"
                                            v-model="mqttDialog.config.devices[dev.id].enable" 
                                            color="primary"
                                        ></v-checkbox-btn>
                                    </td>
                                    <td>
                                        <v-select
                                            v-if="mqttDialog.config.devices[dev.id]"
                                            v-model="mqttDialog.config.devices[dev.id].strategy"
                                            :items="[{title:'周期上报',value:'periodic'}, {title:'变化上报',value:'change'}]"
                                            variant="outlined"
                                            density="compact"
                                            hide-details
                                            :disabled="!mqttDialog.config.devices[dev.id].enable"
                                        ></v-select>
                                    </td>
                                    <td>
                                        <v-text-field
                                            v-if="mqttDialog.config.devices[dev.id] && mqttDialog.config.devices[dev.id].strategy === 'periodic'"
                                            v-model="mqttDialog.config.devices[dev.id].interval"
                                            variant="outlined"
                                            density="compact"
                                            hide-details
                                            placeholder="10s"
                                            :disabled="!mqttDialog.config.devices[dev.id].enable"
                                        ></v-text-field>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-form>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="mqttDialog.visible = false">取消</v-btn>
                    <v-btn color="primary" variant="elevated" @click="saveMqttSettings" :loading="mqttDialog.loading">保存配置</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- OPC UA Settings Dialog -->
        <v-dialog v-model="opcuaDialog.visible" max-width="800px">
            <v-card>
                <v-card-title class="text-h5 pa-4">OPC UA 配置</v-card-title>
                <v-card-text>
                    <v-form>
                        <v-switch v-model="opcuaDialog.config.enable" label="启用 OPC UA 服务" color="primary" inset></v-switch>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model.number="opcuaDialog.config.port" label="监听端口" type="number" variant="outlined" density="compact"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="opcuaDialog.config.endpoint" label="Endpoint" hint="/ipp/opcua/server" persistent-hint variant="outlined" density="compact"></v-text-field>
                            </v-col>
                        </v-row>
                        
                        <v-divider class="my-4"></v-divider>
                        <div class="text-subtitle-1 mb-2 font-weight-bold">设备映射设置</div>
                        <v-table density="compact" class="border rounded">
                            <thead>
                                <tr>
                                    <th>设备名称</th>
                                    <th style="width: 100px;">启用映射</th>
                                    <th>通道</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="dev in allDevices" :key="dev.id">
                                    <td>{{ dev.name }} ({{ dev.id }})</td>
                                    <td>
                                        <v-checkbox-btn 
                                            v-model="opcuaDialog.config.devices[dev.id]" 
                                            color="primary"
                                        ></v-checkbox-btn>
                                    </td>
                                    <td>{{ dev.channelName }}</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-form>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="opcuaDialog.visible = false">取消</v-btn>
                    <v-btn color="primary" variant="elevated" @click="saveOpcuaSettings" :loading="opcuaDialog.loading">保存配置</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { showMessage } from '../composables/useGlobalState'

const loading = ref(false)
const config = ref({
    mqtt: { enable: false },
    opcua: { enable: false, devices: {} },
    status: { mqtt: 0 }
})
const allDevices = ref([])

const mqttDialog = reactive({
    visible: false,
    loading: false,
    config: {}
})

const opcuaDialog = reactive({
    visible: false,
    loading: false,
    config: { devices: {} }
})

const fetchConfig = async () => {
    loading.value = true
    try {
        const res = await fetch('/api/northbound/config')
        if (!res.ok) throw new Error('Failed to fetch config')
        config.value = await res.json()
    } catch (e) {
        showMessage('获取配置失败: ' + e.message, 'error')
    } finally {
        loading.value = false
    }
}

// Helpers to fetch all devices for mapping
const fetchAllDevices = async () => {
    try {
        const res = await fetch('/api/channels')
        const channels = await res.json()
        const devices = []
        for (const ch of channels) {
            const devRes = await fetch(`/api/channels/${ch.id}/devices`)
            const devs = await devRes.json()
            devs.forEach(d => {
                d.channelName = ch.name
                devices.push(d)
            })
        }
        allDevices.value = devices
    } catch (e) {
        console.error('Failed to fetch devices for mapping', e)
    }
}

// MQTT Logic
const openMqttSettings = async () => {
    await fetchAllDevices()
    mqttDialog.config = JSON.parse(JSON.stringify(config.value.mqtt))
    if (!mqttDialog.config.devices) mqttDialog.config.devices = {}
    
    // Initialize defaults for all devices
    allDevices.value.forEach(dev => {
        if (!mqttDialog.config.devices[dev.id]) {
            mqttDialog.config.devices[dev.id] = {
                enable: false,
                strategy: 'periodic',
                interval: '10s'
            }
        }
    })

    mqttDialog.visible = true
}

const saveMqttSettings = async () => {
    mqttDialog.loading = true
    try {
        const res = await fetch('/api/northbound/mqtt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mqttDialog.config)
        })
        if (!res.ok) throw new Error('Failed to save config')
        showMessage('MQTT 配置已保存', 'success')
        mqttDialog.visible = false
        fetchConfig()
    } catch (e) {
        showMessage('保存失败: ' + e.message, 'error')
    } finally {
        mqttDialog.loading = false
    }
}

// OPC UA Logic
const openOpcuaSettings = async () => {
    await fetchAllDevices()
    opcuaDialog.config = JSON.parse(JSON.stringify(config.value.opcua))
    // Ensure devices map exists
    if (!opcuaDialog.config.devices) opcuaDialog.config.devices = {}
    
    // Initialize unmapped devices to false
    allDevices.value.forEach(dev => {
        if (opcuaDialog.config.devices[dev.id] === undefined) {
            opcuaDialog.config.devices[dev.id] = false
        }
    })
    
    opcuaDialog.visible = true
}

const saveOpcuaSettings = async () => {
    opcuaDialog.loading = true
    try {
        const res = await fetch('/api/northbound/opcua', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(opcuaDialog.config)
        })
        if (!res.ok) throw new Error('Failed to save config')
        showMessage('OPC UA 配置已保存', 'success')
        opcuaDialog.visible = false
        fetchConfig()
    } catch (e) {
        showMessage('保存失败: ' + e.message, 'error')
    } finally {
        opcuaDialog.loading = false
    }
}

onMounted(fetchConfig)
</script>
