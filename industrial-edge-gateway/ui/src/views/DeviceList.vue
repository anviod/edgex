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
                <v-spacer></v-spacer>
                <v-btn
                    v-if="selected.length > 0"
                    color="error"
                    prepend-icon="mdi-delete"
                    class="mr-2"
                    @click="confirmBatchDelete"
                >
                    批量删除 ({{ selected.length }})
                </v-btn>
                <v-btn
                    color="primary"
                    prepend-icon="mdi-plus"
                    @click="openDialog()"
                >
                    新增设备
                </v-btn>
            </v-card-title>
            
            <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

            <v-card-text class="pa-0">
                <v-table hover>
                    <thead>
                        <tr>
                            <th style="width: 50px">
                                <v-checkbox-btn
                                    v-model="selectAll"
                                    @update:model-value="toggleSelectAll"
                                ></v-checkbox-btn>
                            </th>
                            <th class="text-left">设备ID</th>
                            <th class="text-left">设备名称</th>
                            <th class="text-left">启用状态</th>
                            <th class="text-left">通信状态</th>
                            <th class="text-left">采集间隔</th>
                            <th class="text-left">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="device in devices" :key="device.id">
                            <td>
                                <v-checkbox-btn
                                    v-model="selected"
                                    :value="device.id"
                                ></v-checkbox-btn>
                            </td>
                            <td class="font-weight-medium">{{ device.id }}</td>
                            <td>{{ device.name }}</td>
                            <td>
                                <v-chip size="small" :color="device.enable ? 'success' : 'grey'" variant="flat">
                                    {{ device.enable ? '启用' : '禁用' }}
                                </v-chip>
                            </td>
                            <td>
                                <v-chip size="small" :color="getDeviceStateColor(device.state)" variant="flat">
                                    {{ getDeviceStateText(device.state) }}
                                </v-chip>
                            </td>
                            <td>{{ device.interval }}</td>
                            <td>
                                <v-btn 
                                    color="primary" 
                                    size="small" 
                                    variant="tonal"
                                    prepend-icon="mdi-eye"
                                    class="mr-2"
                                    @click="goToPoints(device)"
                                >
                                    查看点位
                                </v-btn>
                                <v-btn 
                                    color="secondary" 
                                    size="small" 
                                    variant="tonal"
                                    icon="mdi-link-variant"
                                    class="mr-2"
                                    @click="showRuleUsage(device)"
                                    title="查看关联规则"
                                ></v-btn>
                                <v-btn
                                    color="info"
                                    size="small"
                                    variant="tonal"
                                    icon="mdi-pencil"
                                    class="mr-2"
                                    @click="openDialog(device)"
                                ></v-btn>
                                <v-btn
                                    color="error"
                                    size="small"
                                    variant="tonal"
                                    icon="mdi-delete"
                                    @click="confirmDelete(device)"
                                ></v-btn>
                            </td>
                        </tr>
                        <tr v-if="!loading && devices.length === 0">
                            <td colspan="7" class="text-center pa-8 text-grey">暂无设备</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>

        <!-- Add/Edit Dialog -->
        <v-dialog v-model="dialog" max-width="80%">
            <v-card>
                <v-card-title>
                    <span class="text-h5">{{ form.id && isEdit ? '编辑设备' : '新增设备' }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-text-field
                                    v-model="form.id"
                                    label="设备ID"
                                    required
                                    :disabled="isEdit"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field
                                    v-model="form.name"
                                    label="设备名称"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field
                                    v-model="form.interval"
                                    label="采集间隔 (如 1s, 500ms)"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-switch
                                    v-model="form.enable"
                                    label="是否启用"
                                    color="primary"
                                ></v-switch>
                            </v-col>
                            
                            <!-- Protocol Specific Config -->
                            <v-col cols="12" v-if="channelProtocol === 'dlt645'">
                                <v-text-field
                                    v-model="form.dlt645Address"
                                    label="设备地址 (Station Address)"
                                    placeholder="210220003011"
                                    hint="输入 DL/T645 设备地址 (例如: 210220003011)"
                                    persistent-hint
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" v-else-if="channelProtocol === 'modbus-tcp' || channelProtocol === 'modbus-rtu'">
                                <v-text-field
                                    v-model.number="form.modbusSlaveId"
                                    label="从机 ID (Slave ID)"
                                    type="number"
                                    placeholder="1"
                                    required
                                ></v-text-field>
                            </v-col>
                            
                            <!-- General Config JSON (Fallback or Advanced) -->
                            <v-col cols="12">
                                <v-expansion-panels>
                                    <v-expansion-panel title="高级配置 (JSON)">
                                        <v-expansion-panel-text>
                                            <v-textarea
                                                v-model="form.configStr"
                                                label="配置参数 (JSON)"
                                                hint="请输入JSON格式的配置参数"
                                                persistent-hint
                                                rows="5"
                                            ></v-textarea>
                                        </v-expansion-panel-text>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="closeDialog">取消</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="saveDevice">保存</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="deleteDialog" max-width="500px">
            <v-card>
                <v-card-title class="text-h5">确认删除</v-card-title>
                <v-card-text>确定要删除选中的设备吗？此操作无法撤销。</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="deleteDialog = false">取消</v-btn>
                    <v-btn color="error" variant="text" @click="executeDelete">确认删除</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Rule Usage Dialog -->
        <v-dialog v-model="ruleUsageDialog.show" max-width="80%">
            <v-card>
                <v-card-title>关联规则 - {{ ruleUsageDialog.deviceName }}</v-card-title>
                <v-card-text>
                    <v-list v-if="ruleUsageDialog.rules.length > 0">
                        <v-list-item
                            v-for="rule in ruleUsageDialog.rules"
                            :key="rule.id"
                            :title="rule.name"
                            :subtitle="rule.id"
                            prepend-icon="mdi-flash"
                        >
                            <template v-slot:append>
                                <v-btn 
                                    size="small" 
                                    variant="text" 
                                    color="primary" 
                                    @click="goToRule(rule.id)"
                                >
                                    查看配置
                                </v-btn>
                            </template>
                        </v-list-item>
                    </v-list>
                    <div v-else class="text-center pa-4 text-grey">
                        该设备未被任何规则引用
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="text" @click="ruleUsageDialog.show = false">关闭</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { globalState, showMessage } from '../composables/useGlobalState'
import request from '@/utils/request'

const route = useRoute()
const router = useRouter()
const devices = ref([])
const channelInfo = ref(null)
const loading = ref(false)
const channelId = route.params.channelId

const selected = ref([])
const selectAll = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const itemToDelete = ref(null) // null means batch delete

const ruleUsageDialog = reactive({
    show: false,
    deviceName: '',
    rules: []
})
const allRules = ref([])

const fetchRules = async () => {
    try {
        const data = await request.get('/api/edge/rules')
        allRules.value = data
    } catch (e) {
        console.error('Failed to fetch rules', e)
    }
}

const showRuleUsage = (device) => {
    ruleUsageDialog.deviceName = device.name
    ruleUsageDialog.rules = allRules.value.filter(rule => {
        // Check source
        if (rule.source && rule.source.device_id === device.id) return true
        if (rule.sources && rule.sources.some(s => s.device_id === device.id)) return true
        
        // Check actions
        if (rule.actions) {
            return rule.actions.some(a => {
                if (a.config && a.config.device_id === device.id) return true
                if (a.config && a.config.targets && a.config.targets.some(t => t.device_id === device.id)) return true
                return false
            })
        }
        return false
    })
    ruleUsageDialog.show = true
}

const goToRule = (ruleId) => {
    router.push({ path: '/edge-compute', query: { rule: ruleId } })
}

const getDeviceStateColor = (state) => {
    switch (state) {
        case 0: return 'success'       // Online
        case 1: return 'warning'       // Unstable
        case 2: return 'error'         // Offline
        case 3: return 'grey-darken-1' // Quarantine
        default: return 'grey'
    }
}

const getDeviceStateText = (state) => {
    switch (state) {
        case 0: return '在线'
        case 1: return '不稳定'
        case 2: return '离线'
        case 3: return '隔离'
        default: return '未知'
    }
}

const defaultForm = {
    id: '',
    name: '',
    interval: '1s',
    enable: true,
    configStr: '{}',
    dlt645Address: '',
    modbusSlaveId: 1
}
const form = ref({ ...defaultForm })

const fetchDevices = async () => {
    loading.value = true
    try {
        // 先获取通道信息，确保页面标题正确
        const chanData = await request.get(`/api/channels/${channelId}`)
        channelInfo.value = chanData
        globalState.navTitle = channelInfo.value.name

        const devData = await request.get(`/api/channels/${channelId}/devices`)
        devices.value = devData
        
        // Reset selection
        selected.value = []
        selectAll.value = false
    } catch (e) {
        showMessage('获取设备失败: ' + e.message, 'error')
    } finally {
        loading.value = false
    }
}

const toggleSelectAll = (val) => {
    if (val) {
        selected.value = devices.value.map(d => d.id)
    } else {
        selected.value = []
    }
}

const openDialog = (item = null) => {
    if (item) {
        isEdit.value = true
        const config = item.config || {}
        form.value = {
            ...item,
            configStr: JSON.stringify(config, null, 2),
            dlt645Address: config.station_address || config.address || '',
            modbusSlaveId: config.slave_id || 1
        }
    } else {
        isEdit.value = false
        form.value = { ...defaultForm }
    }
    dialog.value = true
}

const closeDialog = () => {
    dialog.value = false
    form.value = { ...defaultForm }
}

const saveDevice = async () => {
    let config = {}
    try {
        config = JSON.parse(form.value.configStr)
    } catch (e) {
        showMessage('配置参数必须是有效的JSON格式', 'error')
        return
    }

    // Sync protocol specific fields to config
    if (channelProtocol.value === 'dlt645') {
        config.station_address = form.value.dlt645Address
        // Also set 'address' as alias if needed, but station_address is preferred
        config.address = form.value.dlt645Address 
    } else if (channelProtocol.value === 'modbus-tcp' || channelProtocol.value === 'modbus-rtu' || channelProtocol.value === 'modbus-rtu-over-tcp') {
        config.slave_id = form.value.modbusSlaveId
    }

    const payload = {
        id: form.value.id,
        name: form.value.name,
        interval: form.value.interval,
        enable: form.value.enable,
        config: config,
        // Points are not edited here, keep existing if editing, or empty if new
        points: isEdit.value ? undefined : [] 
    }
    
    // If editing, we might need to preserve points if the backend overwrites the whole object
    // The backend Go struct has Points []Point. If we send a payload without Points, it might clear them?
    // Let's check backend AddDevice/UpdateDevice. 
    // AddDevice: ch.Devices = append(ch.Devices, *dev). If points is empty, it's empty.
    // UpdateDevice: ch.Devices[idx] = *dev. Yes, it replaces the whole object.
    // So for Update, we need to make sure we don't lose Points.
    // Strategy: For Edit, we should probably fetch the latest device object or use the one we have (if it has points).
    // The 'devices' list from 'fetchDevices' (getChannelDevices) likely returns the full device struct including points.
    // Let's verify 'getChannelDevices' in server.go (it returns c.JSON(devices)).
    // So 'item' passed to openDialog has 'points'.
    
    if (isEdit.value) {
        // Find original device to keep points
        const original = devices.value.find(d => d.id === form.value.id)
        if (original) {
            payload.points = original.points
        }
    }

    try {
        const url = `/api/channels/${channelId}/devices` + (isEdit.value ? `/${form.value.id}` : '')
        const method = isEdit.value ? 'put' : 'post'
        
        await request({
            url: url,
            method: method,
            data: payload
        })

        showMessage(isEdit.value ? '更新成功' : '创建成功', 'success')
        closeDialog()
        fetchDevices()
    } catch (e) {
        showMessage(e.message, 'error')
    }
}

const confirmDelete = (item) => {
    itemToDelete.value = item
    deleteDialog.value = true
}

const confirmBatchDelete = () => {
    itemToDelete.value = null
    deleteDialog.value = true
}

const executeDelete = async () => {
    try {
        if (itemToDelete.value) {
            // Single delete
            await request.delete(`/api/channels/${channelId}/devices/${itemToDelete.value.id}`)
        } else {
            // Batch delete
            await request({
                url: `/api/channels/${channelId}/devices`,
                method: 'delete',
                data: selected.value
            })
        }
        
        showMessage('删除成功', 'success')
        deleteDialog.value = false
        fetchDevices()
    } catch (e) {
        showMessage(e.message, 'error')
    }
}

const goToPoints = (device) => {
    router.push(`/channels/${channelId}/devices/${device.id}/points`)
}

onMounted(() => {
    fetchDevices()
    fetchRules()
})
</script>
