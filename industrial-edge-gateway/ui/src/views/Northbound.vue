<template>
    <div>
        <v-row class="mb-4">
            <v-col>
                <div class="d-flex align-center">
                    <h2 class="text-h6">北向数据上报</h2>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" prepend-icon="mdi-plus" @click="addDialog.visible = true">添加上行通道</v-btn>
                </div>
            </v-col>
        </v-row>

        <div v-if="loading" class="d-flex justify-center mt-12">
            <v-progress-circular indeterminate color="white" size="64"></v-progress-circular>
        </div>

        <div v-else-if="(!config.mqtt || config.mqtt.length === 0) && (!config.opcua || config.opcua.length === 0) && (!config.sparkplug_b || config.sparkplug_b.length === 0)" class="text-center pa-12 text-grey">
            <v-icon icon="mdi-cloud-upload-off-outline" size="64" class="mb-4"></v-icon>
            <div class="text-h6">暂无已启用的上行通道</div>
            <div class="text-body-2 mt-2">点击右上角"添加上行通道"进行配置</div>
        </div>

        <v-row v-else>
            <!-- MQTT Cards -->
            <v-col cols="12" md="6" v-for="item in config.mqtt" :key="item.id">
                <v-card class="glass-card h-100">
                    <v-card-title class="d-flex align-center border-b py-4">
                        <v-icon icon="mdi-access-point-network" color="primary" class="mr-3"></v-icon>
                        MQTT: {{ item.name || item.id }}
                        <v-spacer></v-spacer>
                        <v-btn icon="mdi-cog" variant="text" size="small" color="primary" @click="openMqttSettings(item)"></v-btn>
                        <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="deleteProtocol('mqtt', item.id)"></v-btn>
                        
                        <template v-if="!item.enable">
                            <v-chip color="grey" size="small" class="ml-2">未启用</v-chip>
                        </template>
                        <template v-else>
                            <v-chip v-if="config.status && config.status[item.id] === 1" color="success" size="small" class="ml-2">已连接</v-chip>
                            <v-chip v-else-if="config.status && config.status[item.id] === 2" color="warning" size="small" class="ml-2 blink">重连中</v-chip>
                            <v-chip v-else color="error" size="small" class="ml-2">连接断开</v-chip>
                        </template>
                    </v-card-title>
                    <v-card-text class="pt-4">
                        <v-list density="compact" bg-color="transparent">
                            <v-list-item title="Broker地址" :subtitle="item.broker">
                                <template v-slot:prepend><v-icon icon="mdi-server" color="grey"></v-icon></template>
                            </v-list-item>
                            <v-list-item title="Client ID" :subtitle="item.client_id">
                                <template v-slot:prepend><v-icon icon="mdi-identifier" color="grey"></v-icon></template>
                            </v-list-item>
                            <v-list-item title="发布主题" :subtitle="item.topic">
                                <template v-slot:prepend><v-icon icon="mdi-post" color="grey"></v-icon></template>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- OPC UA Server Cards -->
            <v-col cols="12" md="6" v-for="item in config.opcua" :key="item.id">
                <v-card class="glass-card h-100">
                    <v-card-title class="d-flex align-center border-b py-4">
                        <v-icon icon="mdi-server" color="primary" class="mr-3"></v-icon>
                        OPC UA: {{ item.name || item.id }}
                        <v-spacer></v-spacer>
                        <v-btn icon="mdi-cog" variant="text" size="small" color="primary" @click="openOpcuaSettings(item)"></v-btn>
                        <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="deleteProtocol('opcua', item.id)"></v-btn>
                        <v-chip :color="item.enable ? 'success' : 'grey'" size="small" class="ml-2">
                            {{ item.enable ? '启用' : '禁用' }}
                        </v-chip>
                    </v-card-title>
                    <v-card-text class="pt-4">
                        <v-list density="compact" bg-color="transparent">
                            <v-list-item title="监听端口" :subtitle="item.port">
                                <template v-slot:prepend><v-icon icon="mdi-lan-pending" color="grey"></v-icon></template>
                            </v-list-item>
                            <v-list-item title="Endpoint" :subtitle="item.endpoint">
                                <template v-slot:prepend><v-icon icon="mdi-link" color="grey"></v-icon></template>
                            </v-list-item>
                            <v-list-item title="完整地址" :subtitle="'opc.tcp://localhost:' + item.port + item.endpoint">
                                <template v-slot:prepend><v-icon icon="mdi-web" color="grey"></v-icon></template>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Sparkplug B Cards -->
            <v-col cols="12" md="6" v-for="item in config.sparkplug_b" :key="item.id">
                <v-card class="glass-card h-100">
                    <v-card-title class="d-flex align-center border-b py-4">
                        <v-icon icon="mdi-lan-connect" color="primary" class="mr-3"></v-icon>
                        Sparkplug B: {{ item.name || item.id }}
                        <v-spacer></v-spacer>
                        <v-btn icon="mdi-cog" variant="text" size="small" color="primary" @click="openSparkplugBSettings(item)"></v-btn>
                        <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="deleteProtocol('sparkplug_b', item.id)"></v-btn>
                        
                        <template v-if="config.status && config.status[item.id] === 1">
                            <v-chip color="success" size="small" class="ml-2">已连接</v-chip>
                        </template>
                        <template v-else-if="config.status && config.status[item.id] === 2">
                            <v-chip color="warning" size="small" class="ml-2 blink">重连中</v-chip>
                        </template>
                        <template v-else>
                            <v-chip color="error" size="small" class="ml-2">连接断开</v-chip>
                        </template>
                    </v-card-title>
                    <v-card-text class="pt-4">
                        <v-list density="compact" bg-color="transparent">
                            <v-list-item title="Broker地址" :subtitle="item.broker">
                                <template v-slot:prepend><v-icon icon="mdi-server" color="grey"></v-icon></template>
                            </v-list-item>
                            <v-list-item title="Group ID" :subtitle="item.group_id">
                                <template v-slot:prepend><v-icon icon="mdi-folder-outline" color="grey"></v-icon></template>
                            </v-list-item>
                            <v-list-item title="Node ID" :subtitle="item.node_id">
                                <template v-slot:prepend><v-icon icon="mdi-identifier" color="grey"></v-icon></template>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Add Protocol Dialog -->
        <v-dialog v-model="addDialog.visible" max-width="500">
            <v-card>
                <v-card-title class="text-h5 pa-4">选择上行协议</v-card-title>
                <v-list lines="two">
                    <v-list-item 
                        @click="addProtocol('mqtt')" 
                        title="MQTT 客户端" 
                        subtitle="通用 MQTT 协议，支持自定义 Payload"
                        prepend-icon="mdi-access-point-network"
                    ></v-list-item>
                    <v-list-item 
                        @click="addProtocol('sparkplug_b')" 
                        title="Sparkplug B 客户端" 
                        subtitle="基于 MQTT 的工业物联网标准协议"
                        prepend-icon="mdi-lan-connect"
                    ></v-list-item>
                    <v-list-item 
                        @click="addProtocol('opcua')" 
                        title="OPC UA 服务端" 
                        subtitle="OPC UA Server，供 SCADA/MES 采集"
                        prepend-icon="mdi-server"
                    ></v-list-item>
                </v-list>
                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="addDialog.visible = false">取消</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- MQTT Settings Dialog -->
        <v-dialog v-model="mqttDialog.visible" max-width="1024px">
            <v-card>
                <v-card-title class="text-h5 pa-4">MQTT 配置</v-card-title>
                <v-card-text>
                    <v-form>
                        <v-row class="mb-2">
                             <v-col cols="12" md="6">
                                <v-text-field v-model="mqttDialog.config.name" label="通道名称" variant="outlined" density="compact"></v-text-field>
                             </v-col>
                             <v-col cols="12" md="6">
                                <v-switch v-model="mqttDialog.config.enable" label="启用 MQTT 客户端" color="primary" inset hide-details></v-switch>
                             </v-col>
                        </v-row>
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

        <!-- Sparkplug B Settings Dialog -->
        <v-dialog v-model="sparkplugbDialog.visible" max-width="80%">
            <v-card>
                <v-card-title class="text-h5 pa-4">Sparkplug B 配置</v-card-title>
                <v-tabs v-model="sparkplugbDialog.activeTab" bg-color="primary">
                    <v-tab value="basic">基本配置</v-tab>
                    <v-tab value="cache">缓存配置</v-tab>
                    <v-tab value="security">安全配置</v-tab>
                    <v-tab value="subscription">数据订阅</v-tab>
                </v-tabs>
                <v-card-text style="height: 500px; overflow-y: auto;">
                    <v-form>
                        <v-window v-model="sparkplugbDialog.activeTab">
                            <v-window-item value="basic">
                                <v-row class="mt-4">
                                     <v-col cols="12" md="6">
                                        <v-text-field v-model="sparkplugbDialog.config.name" label="通道名称" variant="outlined" density="compact"></v-text-field>
                                     </v-col>
                                     <v-col cols="12" md="6">
                                        <v-switch v-model="sparkplugbDialog.config.enable" label="启用 Sparkplug B 客户端" color="primary" inset hide-details></v-switch>
                                     </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="8">
                                        <v-text-field v-model="sparkplugbDialog.config.broker" label="Broker 地址" variant="outlined" density="compact"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field v-model.number="sparkplugbDialog.config.port" label="端口" type="number" variant="outlined" density="compact"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="sparkplugbDialog.config.client_id" label="Client ID" variant="outlined" density="compact"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="sparkplugbDialog.config.group_id" label="Group ID" variant="outlined" density="compact"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="sparkplugbDialog.config.node_id" label="Node ID" variant="outlined" density="compact"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-checkbox v-model="sparkplugbDialog.config.enable_alias" label="启用别名 (Alias)" density="compact" hide-details></v-checkbox>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-checkbox v-model="sparkplugbDialog.config.group_path" label="Group Path" density="compact" hide-details></v-checkbox>
                                    </v-col>
                                </v-row>
                            </v-window-item>

                            <v-window-item value="cache">
                                <v-switch v-model="sparkplugbDialog.config.offline_cache" label="启用离线缓存" color="primary" inset class="mt-4"></v-switch>
                                <v-row>
                                    <v-col cols="12" md="4">
                                        <v-text-field v-model.number="sparkplugbDialog.config.cache_mem_size" label="内存缓存大小 (MB)" type="number" variant="outlined" density="compact"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field v-model.number="sparkplugbDialog.config.cache_disk_size" label="磁盘缓存大小 (MB)" type="number" variant="outlined" density="compact"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field v-model.number="sparkplugbDialog.config.cache_resend_int" label="重发间隔 (ms)" type="number" variant="outlined" density="compact"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-window-item>

                            <v-window-item value="security">
                                <v-row class="mt-4">
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="sparkplugbDialog.config.username" label="用户名" variant="outlined" density="compact"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="sparkplugbDialog.config.password" label="密码" type="password" variant="outlined" density="compact"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-divider class="my-4"></v-divider>
                                <v-switch v-model="sparkplugbDialog.config.ssl" label="启用 SSL/TLS" color="primary" inset></v-switch>
                                <template v-if="sparkplugbDialog.config.ssl">
                                    <v-textarea v-model="sparkplugbDialog.config.ca_cert" label="CA 证书" rows="3" variant="outlined" density="compact"></v-textarea>
                                    <v-textarea v-model="sparkplugbDialog.config.client_cert" label="客户端证书" rows="3" variant="outlined" density="compact"></v-textarea>
                                    <v-textarea v-model="sparkplugbDialog.config.client_key" label="客户端密钥" rows="3" variant="outlined" density="compact"></v-textarea>
                                    <v-text-field v-model="sparkplugbDialog.config.key_password" label="密钥密码" type="password" variant="outlined" density="compact"></v-text-field>
                                </template>
                            </v-window-item>

                            <v-window-item value="subscription">
                                <div class="text-subtitle-1 mb-2 font-weight-bold mt-4">设备数据上报选择</div>
                                <v-table density="compact" class="border rounded">
                                    <thead>
                                        <tr>
                                            <th>设备名称</th>
                                            <th style="width: 100px;">启用上报</th>
                                            <th>通道</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="dev in allDevices" :key="dev.id">
                                            <td>{{ dev.name }}</td>
                                            <td>
                                                <v-checkbox-btn 
                                                    v-model="sparkplugbDialog.config.devices[dev.id]" 
                                                    color="primary"
                                                ></v-checkbox-btn>
                                            </td>
                                            <td>{{ dev.channelName }}</td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </v-window-item>
                        </v-window>
                    </v-form>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="sparkplugbDialog.visible = false">取消</v-btn>
                    <v-btn color="primary" variant="elevated" @click="saveSparkplugBConfig" :loading="loading">保存配置</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- OPC UA Settings Dialog -->
        <v-dialog v-model="opcuaDialog.visible" max-width="800px">
            <v-card>
                <v-card-title class="text-h5 pa-4">OPC UA 配置</v-card-title>
                <v-card-text>
                    <v-form>
                        <v-row class="mb-2">
                             <v-col cols="12" md="6">
                                <v-text-field v-model="opcuaDialog.config.name" label="服务名称" variant="outlined" density="compact"></v-text-field>
                             </v-col>
                             <v-col cols="12" md="6">
                                <v-switch v-model="opcuaDialog.config.enable" label="启用 OPC UA 服务" color="primary" inset hide-details></v-switch>
                             </v-col>
                        </v-row>
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
import request from '@/utils/request'
const loading = ref(false)
const config = ref({
    mqtt: [],
    opcua: [],
    sparkplug_b: [],
    status: {}
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

const sparkplugbDialog = reactive({
    visible: false,
    activeTab: 'basic',
    config: {
        devices: {}
    }
})

const addDialog = reactive({
    visible: false
})

const addProtocol = (type) => {
    addDialog.visible = false
    if (type === 'mqtt') {
        openMqttSettings(null)
    } else if (type === 'sparkplug_b') {
        openSparkplugBSettings(null)
    } else if (type === 'opcua') {
        openOpcuaSettings(null)
    }
}

const fetchConfig = async () => {
    loading.value = true
    try {
        const data = await request.get('/api/northbound/config')
        
        config.value = {
            mqtt: data.mqtt || [],
            opcua: data.opcua || [],
            sparkplug_b: data.sparkplug_b || [],
            status: data.status || {}
        }
    } catch (e) {
        showMessage('获取配置失败: ' + e.message, 'error')
    } finally {
        loading.value = false
    }
}

// Helpers to fetch all devices for mapping
const fetchAllDevices = async () => {
    try {
        const channels = await request.get('/api/channels')
        const devices = []
        for (const ch of channels) {
            const devs = await request.get(`/api/channels/${ch.id}/devices`)
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
const openMqttSettings = async (item) => {
    await fetchAllDevices()
    if (item) {
        mqttDialog.config = JSON.parse(JSON.stringify(item))
    } else {
        // New config
        mqttDialog.config = {
            enable: true,
            name: 'New MQTT',
            broker: 'tcp://127.0.0.1:1883',
            client_id: 'mqtt_client_' + Date.now(),
            topic: 'data',
            devices: {}
        }
    }
    
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
        await request.post('/api/northbound/mqtt', mqttDialog.config)
        showMessage('MQTT 配置已保存', 'success')
        mqttDialog.visible = false
        fetchConfig()
    } catch (e) {
        showMessage('保存失败: ' + e.message, 'error')
    } finally {
        mqttDialog.loading = false
    }
}

const deleteProtocol = async (type, id) => {
    if (!confirm('确定要删除该配置吗？')) return
    
    try {
        await request.delete(`/api/northbound/${type}/${id}`)
        showMessage('删除成功', 'success')
        fetchConfig()
    } catch (e) {
        showMessage('删除失败: ' + e.message, 'error')
    }
}

const openSparkplugBSettings = async (item) => {
    await fetchAllDevices()
    if (item) {
        sparkplugbDialog.config = JSON.parse(JSON.stringify(item))
    } else {
        sparkplugbDialog.config = {
            enable: true,
            name: 'New Sparkplug B',
            broker: '127.0.0.1',
            port: 1883,
            client_id: 'sparkplug_client_' + Date.now(),
            group_id: 'Sparkplug B Devices',
            node_id: 'Edge Gateway',
            devices: {}
        }
    }
    
    if (!sparkplugbDialog.config.devices) {
        sparkplugbDialog.config.devices = {}
    }
    
    // Initialize devices
    allDevices.value.forEach(dev => {
        if (sparkplugbDialog.config.devices[dev.id] === undefined) {
            sparkplugbDialog.config.devices[dev.id] = false
        }
    })
    
    sparkplugbDialog.visible = true
}

const saveSparkplugBConfig = async () => {
    try {
        await request.post('/api/northbound/sparkplugb', sparkplugbDialog.config)
        showMessage('Sparkplug B 配置保存成功', 'success')
        sparkplugbDialog.visible = false
        fetchConfig()
    } catch (error) {
        showMessage('保存失败: ' + error.message, 'error')
    }
}

// OPC UA Logic
const openOpcuaSettings = async (item) => {
    await fetchAllDevices()
    if (item) {
        opcuaDialog.config = JSON.parse(JSON.stringify(item))
    } else {
        opcuaDialog.config = {
            enable: true,
            name: 'New OPC UA Server',
            port: 4840,
            endpoint: '/ipp/opcua/server',
            devices: {}
        }
    }
    
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
        await request.post('/api/northbound/opcua', opcuaDialog.config)
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
