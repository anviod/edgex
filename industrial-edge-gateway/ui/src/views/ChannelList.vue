<template>
    <div>
        <div class="d-flex justify-end align-center mb-6">
            <v-btn 
                color="white" 
                prepend-icon="mdi-refresh" 
                variant="flat" 
                @click="fetchChannels"
                :loading="loading"
                class="text-primary mr-2"
            >
                刷新
            </v-btn>
            <v-btn 
                color="secondary" 
                prepend-icon="mdi-plus" 
                variant="flat" 
                @click="openAddDialog"
            >
                添加通道
            </v-btn>
        </div>
        
        <div v-if="loading && channels.length === 0" class="d-flex justify-center mt-12">
            <v-progress-circular indeterminate color="white" size="64"></v-progress-circular>
        </div>

        <div v-else-if="channels.length > 0">
            <v-row>
                <v-col 
                    v-for="channel in channels" 
                    :key="channel.id" 
                    cols="12" sm="6" md="4" lg="3"
                >
                    <v-card class="glass-card pa-4 h-100" v-ripple>
                        <div class="d-flex flex-column h-100 justify-space-between">
                            <div @click="goToDevices(channel)" style="cursor: pointer">
                                <div class="d-flex justify-space-between align-start">
                                    <div class="channel-icon text-primary">
                                        <v-icon icon="mdi-lan-connect" size="large"></v-icon>
                                    </div>
                                    <v-chip size="small" :color="channel.enable ? 'success' : 'grey'">
                                        {{ channel.enable ? '启用' : '禁用' }}
                                    </v-chip>
                                </div>
                                <div class="text-h6 font-weight-bold mt-2 text-truncate">{{ channel.name }}</div>
                                <div class="text-caption text-grey-darken-1">ID: {{ channel.id }}</div>
                            </div>
                            <div class="mt-4 pt-3 border-t">
                                <div class="d-flex align-center text-body-2 text-grey-darken-2 mb-2">
                                    <v-icon icon="mdi-protocol" size="small" class="mr-2"></v-icon>
                                    {{ channel.protocol }}
                                </div>
                                <div class="d-flex justify-end">
                                    <v-btn size="x-small" icon="mdi-pencil" variant="text" color="primary" @click.stop="openEditDialog(channel)"></v-btn>
                                    <v-btn size="x-small" icon="mdi-radar" variant="text" color="info" v-if="channel.protocol === 'bacnet-ip'" @click.stop="scanChannel(channel)"></v-btn>
                                    <v-btn size="x-small" icon="mdi-delete" variant="text" color="error" @click.stop="deleteChannel(channel)"></v-btn>
                                </div>
                            </div>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </div>
        <div v-else class="text-center mt-12">
            <v-icon icon="mdi-lan-disconnect" size="100" color="white" style="opacity: 0.5"></v-icon>
            <div class="text-h5 text-white mt-4">没有采集通道</div>
        </div>

        <!-- Add/Edit Dialog -->
        <v-dialog v-model="dialog.show" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="text-h5">{{ dialog.isEdit ? '编辑通道' : '添加通道' }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="dialog.form.id" label="ID" :disabled="dialog.isEdit" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field v-model="dialog.form.name" label="名称" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-select
                                    v-model="dialog.form.protocol"
                                    :items="protocols"
                                    item-title="title"
                                    item-value="value"
                                    label="协议"
                                    required
                                ></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-switch v-model="dialog.form.enable" label="启用" color="primary"></v-switch>
                            </v-col>
                            <!-- Protocol specific config -->
                            <v-col cols="12" v-if="dialog.form.protocol === 'modbus-tcp' || dialog.form.protocol === 'modbus-rtu-over-tcp'">
                                <v-text-field 
                                    v-model="dialog.form.config.url" 
                                    :label="dialog.form.protocol === 'modbus-rtu-over-tcp' ? 'URL (tcp+rtu://ip:port)' : 'URL (tcp://ip:port)'"
                                ></v-text-field>
                                <v-text-field 
                                    v-model.number="dialog.form.config.timeout" 
                                    label="超时时间 (ms)" 
                                    type="number" 
                                    placeholder="2000"
                                    hint="默认为 2000ms"
                                    persistent-hint
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" v-if="dialog.form.protocol === 'dlt645' || dialog.form.protocol === 'modbus-rtu'">
                                <v-text-field 
                                    v-model="dialog.form.config.port" 
                                    label="串口设备 (如 /dev/ttyS1)" 
                                    placeholder="/dev/ttyS1"
                                ></v-text-field>
                                <v-row>
                                    <v-col cols="6">
                                        <v-select
                                            v-model.number="dialog.form.config.baudRate"
                                            :items="[1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200]"
                                            label="波特率"
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-select
                                            v-model.number="dialog.form.config.dataBits"
                                            :items="[5, 6, 7, 8]"
                                            label="数据位"
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-select
                                            v-model.number="dialog.form.config.stopBits"
                                            :items="[1, 2]"
                                            label="停止位"
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-select
                                            v-model="dialog.form.config.parity"
                                            :items="[{title:'无校验 (None)', value:'N'}, {title:'偶校验 (Even)', value:'E'}, {title:'奇校验 (Odd)', value:'O'}]"
                                            item-title="title"
                                            item-value="value"
                                            label="校验位"
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field 
                                            v-model.number="dialog.form.config.timeout" 
                                            label="超时时间 (ms)" 
                                            type="number" 
                                            placeholder="2000"
                                            hint="默认为 2000ms"
                                            persistent-hint
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                             <v-col cols="12" v-if="dialog.form.protocol === 'bacnet-ip'">
                                <v-text-field v-model="dialog.form.config.ip" label="IP地址 (默认0.0.0.0)" placeholder="0.0.0.0"></v-text-field>
                                <v-text-field v-model.number="dialog.form.config.port" label="端口 (默认47808)" placeholder="47808" type="number"></v-text-field>
                                <v-divider class="my-4"></v-divider>
                                <div class="text-subtitle-2 mb-2">加密参数 (可选)</div>
                                <v-text-field v-model="dialog.form.config.key" label="密钥" type="password"></v-text-field>
                                <v-text-field v-model="dialog.form.config.cert" label="证书路径"></v-text-field>
                                <v-text-field v-model="dialog.form.config.ca" label="CA证书路径"></v-text-field>
                            </v-col>
                            <v-col cols="12" v-if="dialog.form.protocol === 'opc-ua'">
                                <v-text-field v-model="dialog.form.config.url" label="Endpoint URL" placeholder="opc.tcp://localhost:4840"></v-text-field>
                            </v-col>
                            <v-col cols="12" v-if="dialog.form.protocol === 's7'">
                                <v-text-field v-model="dialog.form.config.ip" label="PLC IP 地址" required></v-text-field>
                                <v-text-field 
                                    v-model.number="dialog.form.config.port" 
                                    label="PLC 端口" 
                                    type="number" 
                                    placeholder="102"
                                    hint="默认为 102"
                                    persistent-hint
                                ></v-text-field>
                                <v-row>
                                    <v-col cols="6">
                                        <v-text-field 
                                            v-model.number="dialog.form.config.rack" 
                                            label="CPU 机架号 (Rack)" 
                                            type="number" 
                                            placeholder="0"
                                            hint="默认为 0"
                                            persistent-hint
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field 
                                            v-model.number="dialog.form.config.slot" 
                                            label="CPU 槽号 (Slot)" 
                                            type="number" 
                                            placeholder="1"
                                            hint="默认为 1"
                                            persistent-hint
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-select
                                            v-model="dialog.form.config.plcType"
                                            :items="['S7-200Smart', 'S7-1200', 'S7-1500', 'S7-300', 'S7-400']"
                                            label="PLC 型号"
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-select
                                            v-model="dialog.form.config.startup"
                                            :items="[{title:'冷启动', value:'cold'}, {title:'热启动', value:'warm'}]"
                                            label="CPU 停机启动策略"
                                        ></v-select>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" v-if="dialog.form.protocol === 'ethernet-ip'">
                                <v-text-field v-model="dialog.form.config.ip" label="PLC IP 地址" required></v-text-field>
                                <v-text-field 
                                    v-model.number="dialog.form.config.port" 
                                    label="PLC 端口" 
                                    type="number" 
                                    placeholder="44818"
                                    hint="默认为 44818"
                                    persistent-hint
                                ></v-text-field>
                                <v-text-field 
                                    v-model.number="dialog.form.config.slot" 
                                    label="CPU 槽号 (Slot)" 
                                    type="number" 
                                    placeholder="0"
                                    hint="默认为 0"
                                    persistent-hint
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" v-if="dialog.form.protocol === 'mitsubishi-slmp'">
                                <v-select
                                    v-model="dialog.form.config.mode"
                                    :items="['TCP', 'UDP']"
                                    label="传输模式"
                                    hint="采用 TCP 模式或 UDP 模式"
                                    persistent-hint
                                ></v-select>
                                <v-text-field v-model="dialog.form.config.ip" label="PLC IP 地址" required></v-text-field>
                                <v-text-field 
                                    v-model.number="dialog.form.config.port" 
                                    label="PLC 端口" 
                                    type="number" 
                                    placeholder="2000"
                                    hint="默认为 2000"
                                    persistent-hint
                                ></v-text-field>
                                <v-text-field 
                                    v-model.number="dialog.form.config.timeout" 
                                    label="PLC 响应超时 (ms)" 
                                    type="number" 
                                    placeholder="15000"
                                    hint="默认为 15000ms"
                                    persistent-hint
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" v-if="dialog.form.protocol === 'omron-fins'">
                                <v-select
                                    v-model="dialog.form.config.mode"
                                    :items="['TCP', 'UDP']"
                                    label="连接方式"
                                    hint="默认为 TCP"
                                    persistent-hint
                                ></v-select>
                                <v-text-field v-model="dialog.form.config.model" label="设备型号" placeholder="CP1H/CJ2M等"></v-text-field>
                                <v-text-field v-model="dialog.form.config.ip" label="PLC IP 地址" required></v-text-field>
                                <v-text-field 
                                    v-model.number="dialog.form.config.port" 
                                    label="PLC 端口" 
                                    type="number" 
                                    placeholder="9600"
                                    hint="默认为 9600"
                                    persistent-hint
                                ></v-text-field>
                                <v-text-field 
                                    v-model.number="dialog.form.config.max_packet_size" 
                                    label="包最大字节长度" 
                                    type="number" 
                                    placeholder="64"
                                    hint="默认为 64"
                                    persistent-hint
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="dialog.show = false">取消</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="saveChannel">保存</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Scan Result Dialog -->
        <v-dialog v-model="scanDialog.show" max-width="800px">
            <v-card>
                <v-card-title>
                    <span class="text-h5">扫描结果 - {{ scanDialog.channelName }}</span>
                </v-card-title>
                <v-card-text>
                    <div v-if="scanDialog.loading" class="text-center pa-4">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                        <div class="mt-2">正在扫描设备...</div>
                    </div>
                    <div v-else>
                        <v-expansion-panels>
                            <v-expansion-panel v-for="(device, index) in scanDialog.results" :key="index">
                                <v-expansion-panel-title>
                                    <div class="d-flex align-center w-100">
                                        <v-checkbox-btn
                                            v-model="scanDialog.selected"
                                            :value="device"
                                            color="primary"
                                            class="mr-2"
                                            @click.stop
                                        ></v-checkbox-btn>
                                        {{ device.name }} (ID: {{ device.device_id }}) - {{ device.ip }}
                                    </div>
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-table density="compact">
                                        <thead>
                                            <tr>
                                                <th>名称</th>
                                                <th>类型</th>
                                                <th>实例</th>
                                                <th>当前值</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(obj, i) in device.objects" :key="i">
                                                <td>{{ obj.name }}</td>
                                                <td>{{ obj.type }}</td>
                                                <td>{{ obj.instance }}</td>
                                                <td>{{ obj.value }} {{ obj.unit }}</td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                        <div v-if="!scanDialog.loading && (!scanDialog.results || scanDialog.results.length === 0)" class="text-center pa-4 text-grey">
                            <div class="mb-4">未发现设备</div>
                            <v-btn color="primary" variant="outlined" prepend-icon="mdi-plus" @click="openManualAdd">
                                手动添加设备
                            </v-btn>
                        </div>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" variant="text" @click="openManualAdd" v-if="scanDialog.results.length > 0">
                        手动添加
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" variant="text" @click="scanDialog.show = false">取消</v-btn>
                    <v-btn color="primary" variant="flat" @click="saveScannedDevices" :disabled="scanDialog.selected.length === 0">
                        导入选中的设备 ({{ scanDialog.selected.length }})
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Manual Add Dialog -->
        <v-dialog v-model="manualAddDialog.show" max-width="400px">
            <v-card>
                <v-card-title>手动扫描设备</v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field 
                                    v-model="manualAddDialog.deviceId" 
                                    label="设备 ID" 
                                    hint="BACnet Device Instance Number"
                                    persistent-hint
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field 
                                    v-model="manualAddDialog.ip" 
                                    label="IP 地址" 
                                    placeholder="127.0.0.1" 
                                    hint="如果不填则默认为 127.0.0.1"
                                    persistent-hint
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field 
                                    v-model="manualAddDialog.port" 
                                    label="端口" 
                                    placeholder="47808" 
                                    type="number"
                                    hint="如果不填则默认为 47808"
                                    persistent-hint
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" variant="text" @click="manualAddDialog.show = false">取消</v-btn>
                    <v-btn color="primary" variant="flat" @click="performManualScan">扫描</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showMessage } from '../composables/useGlobalState'

const router = useRouter()
const channels = ref([])
const loading = ref(false)

const protocols = [
    { title: 'Modbus TCP', value: 'modbus-tcp' },
    { title: 'Modbus RTU', value: 'modbus-rtu' },
    { title: 'Modbus RTU Over TCP', value: 'modbus-rtu-over-tcp' },
    { title: 'EtherNet/IP (ODVA)', value: 'ethernet-ip' },
    { title: 'Mitsubishi 4E (SLMP)', value: 'mitsubishi-slmp' },
    { title: 'Omron FINS (TCP/UDP)', value: 'omron-fins' },
    { title: 'Siemens S7 ISO TCP', value: 's7' },
    { title: 'DL/T645-2007', value: 'dlt645' },
    { title: 'BACnet IP', value: 'bacnet-ip' },
    { title: 'OPC UA', value: 'opc-ua' }
]

const dialog = reactive({
    show: false,
    isEdit: false,
    form: {
        id: '',
        name: '',
        protocol: 'modbus-tcp',
        enable: true,
        config: {},
        devices: []
    }
})

const scanDialog = reactive({
    show: false,
    loading: false,
    channelName: '',
    channelId: '', // Store channel ID
    results: [],
    selected: [] // Store selected devices
})

const manualAddDialog = reactive({
    show: false,
    deviceId: '',
    ip: '',
    port: ''
})

const openManualAdd = () => {
    manualAddDialog.deviceId = ''
    manualAddDialog.ip = ''
    manualAddDialog.port = ''
    manualAddDialog.show = true
}

const performManualScan = async () => {
    if (!manualAddDialog.deviceId) {
        showMessage('请输入设备ID', 'error')
        return
    }
    
    manualAddDialog.show = false
    // Trigger scan with params
    scanDialog.loading = true
    scanDialog.results = []
    
    try {
        const payload = {
            device_id: parseInt(manualAddDialog.deviceId),
            ip: manualAddDialog.ip || undefined,
            port: manualAddDialog.port ? parseInt(manualAddDialog.port) : undefined
        }
        
        const res = await fetch(`/api/channels/${scanDialog.channelId}/scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}))
            throw new Error(errData.error || res.statusText)
        }
        const data = await res.json()
        scanDialog.results = data
        
    } catch (e) {
        showMessage('手动扫描失败: ' + e.message, 'error')
    } finally {
        scanDialog.loading = false
    }
}

const fetchChannels = async () => {
    loading.value = true
    try {
        const res = await fetch('/api/channels')
        if (!res.ok) throw new Error(res.statusText)
        channels.value = await res.json()
    } catch (e) {
        showMessage('获取通道失败: ' + e.message, 'error')
    } finally {
        loading.value = false
    }
}

const goToDevices = (channel) => {
    router.push(`/channels/${channel.id}/devices`)
}

const openAddDialog = () => {
    dialog.isEdit = false
    dialog.form = {
        id: '',
        name: '',
        protocol: 'modbus-tcp',
        enable: true,
        config: {
            connectionType: 'serial', // Default for protocols that support it
            baudRate: 9600,
            dataBits: 8,
            stopBits: 1,
            parity: 'E'
        },
        devices: []
    }
    dialog.show = true
}

const openEditDialog = (channel) => {
    dialog.isEdit = true
    // Deep copy to avoid modifying original until saved
    dialog.form = JSON.parse(JSON.stringify(channel))
    if (!dialog.form.config) dialog.form.config = {}
    
    // Set default connectionType if missing for dlt645
    if (channel.protocol === 'dlt645' && !dialog.form.config.connectionType) {
        dialog.form.config.connectionType = 'serial'
    }
    
    dialog.show = true
}

const saveChannel = async () => {
    try {
        const method = dialog.isEdit ? 'PUT' : 'POST'
        const url = dialog.isEdit ? `/api/channels/${dialog.form.id}` : '/api/channels'
        
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dialog.form)
        })

        if (!res.ok) {
            const errData = await res.json()
            throw new Error(errData.error || res.statusText)
        }

        showMessage(dialog.isEdit ? '通道更新成功' : '通道添加成功', 'success')
        dialog.show = false
        fetchChannels()
    } catch (e) {
        showMessage('保存失败: ' + e.message, 'error')
    }
}

const deleteChannel = async (channel) => {
    if (!confirm(`确定要删除通道 "${channel.name}" 吗？`)) return

    try {
        const res = await fetch(`/api/channels/${channel.id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error(res.statusText)
        
        showMessage('通道删除成功', 'success')
        fetchChannels()
    } catch (e) {
        showMessage('删除失败: ' + e.message, 'error')
    }
}

const scanChannel = async (channel) => {
    scanDialog.channelName = channel.name
    scanDialog.channelId = channel.id
    scanDialog.show = true
    scanDialog.loading = true
    scanDialog.results = []
    scanDialog.selected = []

    try {
        const res = await fetch(`/api/channels/${channel.id}/scan`, { method: 'POST' })
        if (!res.ok) throw new Error(res.statusText)
        
        const data = await res.json()
        scanDialog.results = data
    } catch (e) {
        showMessage('扫描失败: ' + e.message, 'error')
    } finally {
        scanDialog.loading = false
    }
}

const saveScannedDevices = async () => {
    if (scanDialog.selected.length === 0) return

    try {
        // 1. Fetch current channel config to get latest device list
        const chRes = await fetch(`/api/channels/${scanDialog.channelId}`)
        if (!chRes.ok) throw new Error('无法获取通道信息')
        const currentChannel = await chRes.json()

        // 2. Map selected scanned devices to Device model
        const newDevices = scanDialog.selected.map(scanDev => {
            const devId = `bacnet-${scanDev.device_id}`
            const points = (scanDev.objects || []).map(obj => ({
                id: `${obj.type}_${obj.instance}`.replace(/[^a-zA-Z0-9_]/g, '_'), // Sanitize ID
                name: obj.name || `${obj.type} ${obj.instance}`,
                address: `${obj.type}:${obj.instance}`,
                dataType: 'float32', // Default assumption for analog
                readWrite: ['AnalogOutput', 'AnalogValue', 'BinaryOutput', 'BinaryValue', 'MultiStateOutput', 'MultiStateValue'].includes(obj.type) ? 'RW' : 'R'
            }))

            return {
                id: devId,
                name: scanDev.name || `Device ${scanDev.device_id}`,
                protocol: 'bacnet-ip',
                enable: true,
                config: {
                    device_id: scanDev.device_id,
                    ip: scanDev.ip,
                    port: scanDev.port,
                    network_number: scanDev.network_number,
                    mac_address: scanDev.mac_address
                },
                points: points,
                interval: '10s' // Default interval
            }
        })

        // 3. Merge devices (avoid duplicates by ID)
        if (!currentChannel.devices) currentChannel.devices = []
        
        // Filter out existing devices with same ID if we want to overwrite, or just append
        // Here we overwrite if exists
        const existingIds = new Set(currentChannel.devices.map(d => d.id))
        
        // Remove existing devices that are being updated
        const devicesToKeep = currentChannel.devices.filter(d => 
            !newDevices.some(nd => nd.id === d.id)
        )
        
        currentChannel.devices = [...devicesToKeep, ...newDevices]

        // 4. Update channel
        const updateRes = await fetch(`/api/channels/${scanDialog.channelId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentChannel)
        })

        if (!updateRes.ok) throw new Error(updateRes.statusText)

        showMessage(`成功导入 ${newDevices.length} 个设备`, 'success')
        scanDialog.show = false
        fetchChannels() // Refresh list

    } catch (e) {
        showMessage('保存设备失败: ' + e.message, 'error')
    }
}


onMounted(fetchChannels)
</script>
