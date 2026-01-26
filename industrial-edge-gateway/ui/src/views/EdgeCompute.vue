<template>
    <div class="edge-compute-container">
        <v-tabs v-model="tab" class="mb-4">
            <v-tab value="rules">规则管理</v-tab>
            <v-tab value="status">运行状态</v-tab>
        </v-tabs>

        <v-window v-model="tab">
            <v-window-item value="rules">
                <v-card class="mb-4">
                    <v-card-title class="d-flex align-center">
                        边缘计算规则
                        <v-spacer></v-spacer>
                        <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog">添加规则</v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-table>
                            <thead>
                                <tr>
                                    <th>规则名称</th>
                                    <th>类型</th>
                                    <th>触发逻辑</th>
                                    <th>状态</th>
                                    <th>优先级</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="rule in rules" :key="rule.id">
                                    <td>{{ rule.name }}</td>
                                    <td>{{ rule.type }}</td>
                                    <td>
                                        <v-chip :color="rule.enable ? 'success' : 'grey'" size="small">
                                            {{ rule.enable ? '启用' : '禁用' }}
                                        </v-chip>
                                    </td>
                                    <td>{{ rule.priority }}</td>
                                    <td>
                                        <v-btn icon="mdi-pencil" size="small" variant="text" color="primary" @click="editRule(rule)"></v-btn>
                                        <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="deleteRule(rule)"></v-btn>
                                    </td>
                                </tr>
                                <tr v-if="rules.length === 0">
                                    <td colspan="5" class="text-center text-grey">暂无规则</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
            </v-window-item>

            <v-window-item value="status">
                <v-card>
                    <v-card-title>
                        规则运行状态监控
                        <v-spacer></v-spacer>
                        <v-btn icon="mdi-refresh" variant="text" @click="fetchRuleStates"></v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-table>
                            <thead>
                                <tr>
                                    <th>规则名称</th>
                                    <th>当前状态</th>
                                    <th>最近触发时间</th>
                                    <th>触发次数</th>
                                    <th>最新值</th>
                                    <th>操作</th>
                                    <th>错误信息</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="state in ruleStates" :key="state.rule_id">
                                    <td>{{ state.rule_name }}</td>
                                    <td>
                                        <v-chip :color="getStatusColor(state.current_status)" size="small">
                                            {{ state.current_status }}
                                        </v-chip>
                                    </td>
                                    <td>{{ formatDate(state.last_trigger) }}</td>
                                    <td>{{ state.trigger_count }}</td>
                                    <td>{{ state.last_value }}</td>
                                    <td>
                                        <v-btn size="small" variant="text" color="primary" @click="viewWindowData(state.rule_id, state.rule_name)">
                                            查看窗口数据
                                        </v-btn>
                                    </td>
                                    <td class="text-error">{{ state.error_message }}</td>
                                </tr>
                                <tr v-if="ruleStates.length === 0">
                                    <td colspan="6" class="text-center text-grey">暂无运行状态数据</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
            </v-window-item>
        </v-window>

        <!-- Window Data Dialog -->
        <v-dialog v-model="windowDialog" max-width="600px">
            <v-card>
                <v-card-title>窗口数据预览 ({{ currentWindowRuleName }})</v-card-title>
                <v-card-text>
                    <v-table density="compact">
                        <thead>
                            <tr>
                                <th>时间</th>
                                <th>值</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in windowData" :key="index">
                                <td>{{ formatDate(item.ts) }}</td>
                                <td>{{ item.value }}</td>
                            </tr>
                            <tr v-if="windowData.length === 0">
                                <td colspan="2" class="text-center text-grey">窗口暂无数据</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="text" @click="windowDialog = false">关闭</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Rule Dialog -->
        <v-dialog v-model="dialog" max-width="800px">
            <v-card>
                <v-card-title>{{ editingRule ? '编辑规则' : '添加规则' }}</v-card-title>
                <v-card-text>
                    <v-form ref="form">
                        <v-row>
                            <!-- Basic Info -->
                            <v-col cols="12" md="6">
                                <v-text-field v-model="currentRule.name" label="规则名称" required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select 
                                    v-model="currentRule.type" 
                                    :items="['threshold', 'calculation', 'window', 'state']" 
                                    label="规则类型"
                                ></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model.number="currentRule.priority" type="number" label="优先级"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-switch v-model="currentRule.enable" label="启用" color="primary"></v-switch>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select
                                    v-model="currentRule.trigger_mode"
                                    :items="[{title: '始终触发', value: 'always'}, {title: '仅状态改变时触发', value: 'on_change'}]"
                                    label="触发模式"
                                    hint="状态改变模式仅在状态从正常变为告警时触发动作"
                                    persistent-hint
                                ></v-select>
                            </v-col>

                            <!-- Trigger Logic -->
                            <v-col cols="12" md="6">
                                <v-select
                                    v-model="currentRule.trigger_logic"
                                    :items="['AND', 'OR', 'EXPR']"
                                    label="触发逻辑"
                                    hint="AND: 所有源满足条件; OR: 任意源满足; EXPR: 自定义表达式"
                                    persistent-hint
                                ></v-select>
                            </v-col>

                            <!-- Source Configuration -->
                            <v-col cols="12">
                                <div class="d-flex align-center mb-2">
                                    <div class="text-subtitle-1">数据源列表</div>
                                    <v-spacer></v-spacer>
                                    <v-btn size="small" prepend-icon="mdi-plus" variant="text" @click="addSource">添加数据源</v-btn>
                                </div>
                                <template v-for="(src, index) in currentRule.sources" :key="index">
                                    <div v-if="index > 0" class="d-flex justify-center my-2">
                                        <v-chip size="x-small" :color="currentRule.trigger_logic === 'AND' ? 'info' : (currentRule.trigger_logic === 'OR' ? 'warning' : 'grey')" variant="flat">
                                            {{ currentRule.trigger_logic === 'AND' ? 'AND (且)' : (currentRule.trigger_logic === 'OR' ? 'OR (或)' : '-') }}
                                        </v-chip>
                                    </div>
                                    <v-card variant="outlined" class="mb-2 pa-2">
                                        <v-row density="compact" align="center">
                                            <v-col cols="12" md="3">
                                                <v-select
                                                    v-model="src.channel_id"
                                                    :items="channels"
                                                    item-title="name"
                                                    item-value="id"
                                                    label="通道"
                                                    density="compact"
                                                    hide-details
                                                    @update:model-value="() => onSourceChannelChange(src)"
                                                ></v-select>
                                            </v-col>
                                            <v-col cols="12" md="3">
                                                <v-select
                                                    v-model="src.device_id"
                                                    :items="src._deviceList || []"
                                                    item-title="name"
                                                    item-value="id"
                                                    label="设备"
                                                    density="compact"
                                                    hide-details
                                                    :disabled="!src.channel_id"
                                                    @update:model-value="() => onSourceDeviceChange(src)"
                                                    @click="() => loadSourceDevices(src)"
                                                ></v-select>
                                            </v-col>
                                            <v-col cols="12" md="3">
                                                <v-combobox
                                                    v-model="src.point_id"
                                                    :items="src._pointList || []"
                                                    item-title="name"
                                                    item-value="id"
                                                    label="点位ID"
                                                    density="compact"
                                                    hide-details
                                                    :disabled="!src.device_id"
                                                    @click="() => loadSourcePoints(src)"
                                                    :return-object="false"
                                                ></v-combobox>
                                            </v-col>
                                            <v-col cols="12" md="2">
                                                <v-text-field 
                                                    v-model="src.alias" 
                                                    label="别名 (如 t1)"
                                                    density="compact"
                                                    hide-details
                                                    placeholder="用于表达式引用"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="1" class="d-flex justify-end">
                                                <v-btn icon="mdi-delete" size="x-small" color="error" variant="text" @click="removeSource(index)"></v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                </template>
                            </v-col>

                            <!-- Window Config -->
                            <v-col cols="12" v-if="currentRule.type === 'window'">
                                <div class="text-subtitle-1 mb-2">窗口配置</div>
                                <v-row>
                                    <v-col cols="4">
                                        <v-select v-model="currentRule.window.type" :items="['sliding', 'tumbling']" label="窗口类型"></v-select>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-text-field v-model="currentRule.window.size" label="窗口大小" hint="例如: 10s 或 100"></v-text-field>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-select v-model="currentRule.window.aggr_func" :items="['avg', 'min', 'max', 'sum', 'count', 'rate']" label="聚合函数"></v-select>
                                    </v-col>
                                </v-row>
                            </v-col>

                            <!-- State Config -->
                            <v-col cols="12" v-if="currentRule.type === 'state'">
                                <div class="text-subtitle-1 mb-2">状态配置</div>
                                <v-row>
                                    <v-col cols="6">
                                        <v-text-field v-model="currentRule.state.duration" label="持续时间" hint="例如: 10s"></v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field v-model.number="currentRule.state.count" type="number" label="连续次数"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>

                            <!-- Condition -->
                            <v-col cols="12" v-if="currentRule.type !== 'calculation'">
                                <v-textarea
                                    v-model="currentRule.condition"
                                    label="触发条件 (Expression)"
                                    hint="例如: value > 50 && value < 100"
                                    rows="2"
                                ></v-textarea>
                            </v-col>
                            <!-- Calculation Expression -->
                            <v-col cols="12" v-if="currentRule.type === 'calculation'">
                                <v-textarea
                                    v-model="currentRule.expression"
                                    label="计算公式 (Expression)"
                                    hint="例如: value * 1.5 + 32"
                                    rows="2"
                                ></v-textarea>
                            </v-col>

                            <!-- Actions -->
                            <v-col cols="12">
                                <div class="d-flex align-center mb-2">
                                    <div class="text-subtitle-1">动作列表</div>
                                    <v-spacer></v-spacer>
                                    <v-btn size="small" prepend-icon="mdi-plus" variant="text" @click="addAction">添加动作</v-btn>
                                </div>
                                <v-card v-for="(action, index) in currentRule.actions" :key="index" variant="outlined" class="mb-2 pa-2">
                                    <v-row density="compact">
                                        <v-col cols="12" md="3">
                                            <v-select
                                                v-model="action.type"
                                                :items="['log', 'mqtt', 'http', 'device_control', 'database']"
                                                label="动作类型"
                                                density="compact"
                                                hide-details
                                            ></v-select>
                                        </v-col>
                                        <v-col cols="12" md="8">
                                            <!-- MQTT Config -->
                                            <div v-if="action.type === 'mqtt'" class="d-flex flex-column gap-2">
                                                <div class="d-flex gap-2">
                                                    <v-text-field v-model="action.config.topic" label="Topic" density="compact" hide-details class="mr-2"></v-text-field>
                                                    <v-select v-model="action.config.send_strategy" :items="[{title:'单条发送', value:'single'}, {title:'批量发送', value:'batch'}]" label="发送策略" density="compact" hide-details style="max-width: 120px"></v-select>
                                                </div>
                                                <v-text-field v-model="action.config.message" label="Message (Optional)" density="compact" hide-details></v-text-field>
                                            </div>
                                            <!-- HTTP Config -->
                                            <div v-if="action.type === 'http'" class="d-flex flex-column gap-2">
                                                <div class="d-flex gap-2">
                                                    <v-text-field v-model="action.config.url" label="URL" density="compact" hide-details class="mr-2"></v-text-field>
                                                    <v-select v-model="action.config.method" :items="['POST', 'GET', 'PUT']" label="Method" density="compact" hide-details style="max-width: 100px"></v-select>
                                                    <v-select v-model="action.config.send_strategy" :items="[{title:'单条发送', value:'single'}, {title:'批量发送', value:'batch'}]" label="发送策略" density="compact" hide-details style="max-width: 120px"></v-select>
                                                </div>
                                            </div>
                                            <!-- Device Control Config -->
                                            <div v-if="action.type === 'device_control'" class="d-flex flex-column gap-2">
                                                <div class="d-flex align-center">
                                                    <v-checkbox v-model="action._batchMode" label="批量控制" density="compact" hide-details class="flex-grow-0 mr-4" @update:model-value="toggleBatchMode(action)"></v-checkbox>
                                                    <v-btn v-if="action._batchMode" size="small" variant="text" prepend-icon="mdi-plus" @click="addTarget(action)">添加目标</v-btn>
                                                </div>
                                                
                                                <!-- Single Mode -->
                                                <div v-if="!action._batchMode" class="d-flex flex-wrap gap-2">
                                                    <v-select v-model="action.config.channel_id" :items="channels" item-title="name" item-value="id" label="Channel" density="compact" hide-details class="mr-2" style="width: 150px" @update:model-value="() => onActionChannelChange(action.config)"></v-select>
                                                    <v-select v-model="action.config.device_id" :items="action.config._deviceList || []" item-title="name" item-value="id" label="Device" density="compact" hide-details class="mr-2" style="width: 150px" :disabled="!action.config.channel_id" @update:model-value="() => onActionDeviceChange(action.config)" @click="() => loadActionDevices(action.config)"></v-select>
                                                    <v-combobox v-model="action.config.point_id" :items="action.config._pointList || []" item-title="name" item-value="id" label="Point" density="compact" hide-details class="mr-2" style="width: 150px" :disabled="!action.config.device_id" @click="() => loadActionPoints(action.config)" :return-object="false"></v-combobox>
                                                    <v-text-field v-model="action.config.value" label="Value (Optional)" density="compact" hide-details style="width: 120px"></v-text-field>
                                                </div>
                                                
                                                <!-- Batch Mode -->
                                                <div v-else>
                                                    <div v-for="(target, tIdx) in action.config.targets" :key="tIdx" class="d-flex flex-wrap gap-2 mb-2 align-center pa-2 border rounded">
                                                        <v-select v-model="target.channel_id" :items="channels" item-title="name" item-value="id" label="Channel" density="compact" hide-details class="mr-2" style="width: 150px" @update:model-value="() => onActionChannelChange(target)"></v-select>
                                                        <v-select v-model="target.device_id" :items="target._deviceList || []" item-title="name" item-value="id" label="Device" density="compact" hide-details class="mr-2" style="width: 150px" :disabled="!target.channel_id" @update:model-value="() => onActionDeviceChange(target)" @click="() => loadActionDevices(target)"></v-select>
                                                        <v-combobox v-model="target.point_id" :items="target._pointList || []" item-title="name" item-value="id" label="Point" density="compact" hide-details class="mr-2" style="width: 150px" :disabled="!target.device_id" @click="() => loadActionPoints(target)" :return-object="false"></v-combobox>
                                                        <v-text-field v-model="target.value" label="Value" density="compact" hide-details style="width: 120px"></v-text-field>
                                                        <v-btn icon="mdi-delete" size="x-small" color="error" variant="text" @click="removeTarget(action, tIdx)"></v-btn>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- Database Config -->
                                            <div v-if="action.type === 'database'" class="d-flex gap-2">
                                                <v-text-field v-model="action.config.bucket" label="Bucket Name" placeholder="rule_events" density="compact" hide-details></v-text-field>
                                            </div>
                                        </v-col>
                                        <v-col cols="12" md="1" class="d-flex justify-end">
                                            <v-btn icon="mdi-delete" size="x-small" color="error" variant="text" @click="removeAction(index)"></v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" variant="text" @click="dialog = false">取消</v-btn>
                    <v-btn color="primary" @click="saveRule">保存</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const tab = ref('rules')
const rules = ref([])
const ruleStates = ref([])
const dialog = ref(false)
const editingRule = ref(false)
const channels = ref([])
const devices = ref([])
const windowDialog = ref(false)
const windowData = ref([])
const currentWindowRuleName = ref('')
let timer = null

const currentRule = reactive({
    id: '',
    name: '',
    type: 'threshold',
    priority: 0,
    enable: true,
    trigger_mode: 'always',
    sources: [], // Multi-source
    trigger_logic: 'OR', // Default OR
    condition: '',
    expression: '',
    window: { type: 'sliding', size: '10s', aggr_func: 'avg' },
    state: { duration: '0s', count: 0 },
    actions: []
})

const getStatusColor = (status) => {
    switch (status) {
        case 'ALARM': return 'error'
        case 'WARNING': return 'warning'
        case 'NORMAL': return 'success'
        default: return 'grey'
    }
}

const fetchChannels = async () => {
    try {
        const res = await fetch('/api/channels')
        if (res.ok) {
            channels.value = await res.json()
        }
    } catch (e) {
        console.error(e)
    }
}

// Source Management
const addSource = () => {
    if (!currentRule.sources) currentRule.sources = []
    currentRule.sources.push({
        channel_id: '',
        device_id: '',
        point_id: '',
        alias: '',
        _deviceList: [], // Local state for dropdown
        _pointList: []
    })
}

const removeSource = (index) => {
    currentRule.sources.splice(index, 1)
}

const onSourceChannelChange = async (src) => {
    src.device_id = ''
    src.point_id = ''
    src._deviceList = []
    src._pointList = []
    
    if (!src.channel_id) return
    
    try {
        const res = await fetch(`/api/channels/${src.channel_id}/devices`)
        if (res.ok) {
            src._deviceList = await res.json()
        }
    } catch (e) {
        console.error(e)
    }
}

const onSourceDeviceChange = (src) => {
    src.point_id = ''
    src._pointList = []
    updateSourcePointList(src)
}

const updateSourcePointList = (src) => {
    if (!src.device_id || !src._deviceList) return
    const dev = src._deviceList.find(d => d.id === src.device_id)
    if (dev && dev.points) {
        src._pointList = dev.points
    } else {
        src._pointList = []
    }
}

const loadSourceDevices = async (src) => {
    if (!src.channel_id || (src._deviceList && src._deviceList.length > 0)) return
    await onSourceChannelChange(src)
}

const loadSourcePoints = (src) => {
    // No-op or alias for updateSourcePointList, but strictly we don't need to load from network
    // providing we have device list.
    if (!src._pointList || src._pointList.length === 0) {
        updateSourcePointList(src)
    }
}

const fetchRules = async () => {
    try {
        const res = await fetch('/api/edge/rules')
        if (res.ok) {
            rules.value = await res.json()
        }
    } catch (e) {
        console.error(e)
    }
}

const fetchRuleStates = async () => {
    try {
        const res = await fetch('/api/edge/states')
        if (res.ok) {
            const data = await res.json()
            ruleStates.value = Object.values(data)
        }
    } catch (e) {
        console.error(e)
    }
}

const viewWindowData = async (ruleId, ruleName) => {
    currentWindowRuleName.value = ruleName
    windowData.value = []
    windowDialog.value = true
    try {
        const res = await fetch(`/api/edge/rules/${ruleId}/window`)
        if (res.ok) {
            windowData.value = await res.json()
        }
    } catch (e) {
        console.error(e)
    }
}

const addAction = () => {
    if (!currentRule.actions) currentRule.actions = []
    currentRule.actions.push({
        type: 'log',
        config: {}
    })
}

const removeAction = (index) => {
    currentRule.actions.splice(index, 1)
}

const openDialog = () => {
    editingRule.value = false
    // Reset
    currentRule.id = ''
    currentRule.name = ''
    currentRule.type = 'threshold'
    currentRule.priority = 0
    currentRule.enable = true
    currentRule.trigger_mode = 'always'
    currentRule.sources = [] // Reset sources
    currentRule.trigger_logic = 'OR'
    currentRule.condition = ''
    currentRule.expression = ''
    currentRule.window = { type: 'sliding', size: '10s', aggr_func: 'avg' }
    currentRule.state = { duration: '0s', count: 0 }
    currentRule.actions = []
    
    // Add one empty source by default
    addSource()
    
    dialog.value = true
}

const editRule = async (rule) => {
    editingRule.value = true
    // Deep copy
    const r = JSON.parse(JSON.stringify(rule))
    Object.assign(currentRule, r)
    
    // Ensure nested objects
    if (!currentRule.sources) currentRule.sources = []
    // Backward compatibility: If source exists but sources is empty
    if (currentRule.sources.length === 0 && r.source && r.source.channel_id) {
        currentRule.sources.push({
            channel_id: r.source.channel_id,
            device_id: r.source.device_id,
            point_id: r.source.point_id,
            alias: r.source.alias || 'val'
        })
    }
    
    if (!currentRule.actions) currentRule.actions = []
    // Initialize batch mode for actions
    currentRule.actions.forEach(action => {
        if (action.type === 'device_control' && action.config && action.config.targets && action.config.targets.length > 0) {
            action._batchMode = true
        }
    })

    if (!currentRule.window) currentRule.window = { type: 'sliding', size: '10s', aggr_func: 'avg' }
    if (!currentRule.state) currentRule.state = { duration: '0s', count: 0 }
    
    // Load metadata for sources (devices/points list)
    for (const src of currentRule.sources) {
        if (src.channel_id) {
            src._deviceList = await fetchDevices(src.channel_id)
            if (src.device_id) {
                updateSourcePointList(src)
            }
        }
    }

    // Load metadata for actions (device_control)
    for (const action of currentRule.actions) {
        if (action.type === 'device_control') {
            // Check batch mode
            if (action._batchMode && action.config.targets) {
                for (const target of action.config.targets) {
                    if (target.channel_id) {
                        target._deviceList = await fetchDevices(target.channel_id)
                        if (target.device_id) {
                            updateActionPointList(target)
                        }
                    }
                }
            } else {
                // Single mode
                if (action.config.channel_id) {
                    action.config._deviceList = await fetchDevices(action.config.channel_id)
                    if (action.config.device_id) {
                        updateActionPointList(action.config)
                    }
                }
            }
        }
    }
    
    dialog.value = true
}

const deleteRule = async (rule) => {
    if (!confirm('确定删除该规则吗？')) return
    try {
        await fetch(`/api/edge/rules/${rule.id}`, { method: 'DELETE' })
        fetchRules()
    } catch (e) {
        alert('删除失败')
    }
}

const saveRule = async () => {
    try {
        // Prepare payload, maybe remove unused config based on type? 
        // Backend handles omitempty so it should be fine.
        const res = await fetch('/api/edge/rules', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(currentRule)
        })
        if (res.ok) {
            dialog.value = false
            fetchRules()
        } else {
            const data = await res.json()
            alert('保存失败: ' + (data.error || 'Unknown error'))
        }
    } catch (e) {
        alert('保存失败: ' + e.message)
    }
}

const getLogicColor = (logic) => {
    switch(logic) {
        case 'AND': return 'info'
        case 'OR': return 'warning'
        case 'EXPR': return 'purple'
        default: return 'grey'
    }
}

const formatDate = (ts) => {
    if (!ts || ts === '0001-01-01T00:00:00Z') return '-'
    return new Date(ts).toLocaleString()
}

const calculateDuration = (startTs) => {
    if (!startTs || startTs === '0001-01-01T00:00:00Z') return '-'
    const start = new Date(startTs).getTime()
    const now = new Date().getTime()
    const diff = Math.floor((now - start) / 1000)
    
    if (diff < 60) return `${diff}s`
    if (diff < 3600) return `${Math.floor(diff/60)}m ${diff%60}s`
    return `${Math.floor(diff/3600)}h ${Math.floor((diff%3600)/60)}m`
}

onMounted(async () => {
    await fetchRules()
    fetchChannels()
    fetchRuleStates()
    // Poll status every 5 seconds
    timer = setInterval(fetchRuleStates, 5000)

    if (route.query.rule) {
        const rule = rules.value.find(r => r.id === route.query.rule)
        if (rule) {
            editRule(rule)
        }
    }
})

onUnmounted(() => {
    if (timer) clearInterval(timer)
})
</script>