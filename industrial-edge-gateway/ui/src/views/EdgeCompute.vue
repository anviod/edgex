<template>
    <div class="edge-compute-container">
        <v-tabs v-model="tab" class="mb-4">
            <v-tab value="metrics">监控面板</v-tab>
            <v-tab value="rules">规则管理</v-tab>
            <v-tab value="status">运行记录</v-tab>
            <v-tab value="logs">日志查询</v-tab>
        </v-tabs>

        <v-window v-model="tab">
            <v-window-item value="metrics">
                <EdgeComputeMetrics />
            </v-window-item>

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
                                    <th>触发模式</th>
                                    <th>启用状态</th>
                                    <th>优先级</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="rule in rules" :key="rule.id">
                                    <td>{{ rule.name }}</td>
                                    <td>{{ formatRuleType(rule.type) }}</td>
                                    <td>{{ formatTriggerMode(rule.trigger_mode) }}</td>
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
                                    <td colspan="6" class="text-center text-grey">暂无规则</td>
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

            <v-window-item value="logs">
                <v-card>
                    <v-card-title>
                        历史日志查询
                        <v-spacer></v-spacer>
                        <v-btn color="success" prepend-icon="mdi-download" @click="exportLogs" :disabled="logs.length === 0">导出 CSV</v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" md="3">
                                <v-text-field type="datetime-local" v-model="query.start" label="开始时间" density="compact" hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field type="datetime-local" v-model="query.end" label="结束时间" density="compact" hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field v-model="query.ruleId" label="规则ID (可选)" density="compact" hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-btn color="primary" block @click="queryLogs">查询</v-btn>
                            </v-col>
                        </v-row>
                        <v-table class="mt-4">
                            <thead>
                                <tr>
                                    <th>时间</th>
                                    <th>规则ID</th>
                                    <th>规则名称</th>
                                    <th>状态</th>
                                    <th>触发次数</th>
                                    <th>值</th>
                                    <th>错误信息</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="log in logs" :key="log.minute + log.rule_id">
                                    <td>{{ log.minute }}</td>
                                    <td>{{ log.rule_id }}</td>
                                    <td>{{ log.rule_name }}</td>
                                    <td>
                                        <v-chip :color="getStatusColor(log.status)" size="small">
                                            {{ log.status }}
                                        </v-chip>
                                    </td>
                                    <td>{{ log.trigger_count }}</td>
                                    <td>{{ log.last_value }}</td>
                                    <td class="text-error">{{ log.error_message }}</td>
                                </tr>
                                <tr v-if="logs.length === 0">
                                    <td colspan="7" class="text-center text-grey">暂无历史日志</td>
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
        <v-dialog v-model="dialog" max-width="80%">
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
                                    :items="[
                                        {title: 'Threshold (阈值触发)', value: 'threshold'},
                                        {title: 'Calculation (计算公式)', value: 'calculation'},
                                        {title: 'Window (时间/计数窗口)', value: 'window'},
                                        {title: 'State (状态持续)', value: 'state'}
                                    ]" 
                                    label="规则类型"
                                    :hint="getRuleTypeExplanation(currentRule.type)"
                                    persistent-hint
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

                            <!-- Trigger Logic (Removed as per refactoring) -->
                            <!-- <v-col cols="12" md="6">
                                <v-select
                                    v-model="currentRule.trigger_logic"
                                    :items="['AND', 'OR', 'EXPR']"
                                    label="触发逻辑"
                                    hint="AND: 所有源满足条件; OR: 任意源满足; EXPR: 自定义表达式"
                                    persistent-hint
                                ></v-select>
                            </v-col> -->

                            <!-- Source Configuration -->
                            <v-col cols="12">
                                <div class="d-flex align-center mb-2">
                                    <div class="text-subtitle-1">数据源列表</div>
                                    <v-spacer></v-spacer>
                                    <v-btn size="small" prepend-icon="mdi-plus" variant="text" @click="addSource">添加数据源</v-btn>
                                </div>
                                <div class="text-caption text-grey mb-2">
                                    请为每个数据源设置别名（如 t1, t2），然后在触发条件中使用别名编写逻辑公式（例如：t1 > 20 || t2 > 30）。
                                </div>
                                <template v-for="(src, index) in currentRule.sources" :key="index">
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
                                    hint="例如: t1 > 50 || t2 > 80 (使用数据源别名)"
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
                                                :items="[
                                                    {title: 'Log (日志记录)', value: 'log'},
                                                    {title: 'MQTT (消息推送)', value: 'mqtt'},
                                                    {title: 'HTTP (Web请求)', value: 'http'},
                                                    {title: 'Device Control (设备控制)', value: 'device_control'},
                                                    {title: 'Database (数据存储)', value: 'database'}
                                                ]"
                                                label="动作类型"
                                                density="compact"
                                                hide-details
                                            ></v-select>
                                        </v-col>
                                        <v-col cols="12" md="8">
                                            <!-- MQTT Config -->
                                            <div
                                                v-if="action.type === 'mqtt'"
                                                class="d-flex gap-2 align-center"
                                                style="max-width: 1024px"
                                            >
                                                <v-text-field
                                                    v-model="action.config.topic"
                                                    label="Topic (主题)"
                                                    density="compact"
                                                    hide-details
                                                    class="mr-2"
                                                    style="white-space: nowrap"
                                                ></v-text-field>
                                                <v-select
                                                    v-model="action.config.send_strategy"
                                                    :items="[
                                                        { title: '单条发送 Single', value: 'single' },
                                                        { title: '批量发送 Batch', value: 'batch' }
                                                    ]"
                                                    label="发送策略 (Send Strategy)"
                                                    density="compact"
                                                    hide-details
                                                    style="max-width: 150px; white-space: nowrap"
                                                ></v-select>
                                                <v-text-field
                                                    v-model="action.config.message"
                                                    label="Message 消息内容 (可选)"
                                                    density="compact"
                                                    hide-details
                                                    style="white-space: nowrap"
                                                ></v-text-field>
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
                                                <div
                                                    v-if="!action._batchMode"
                                                    class="d-flex gap-2 align-center"
                                                    style="max-width: 1024px"
                                                >
                                                    <v-select
                                                        v-model="action.config.channel_id"
                                                        :items="channels"
                                                        item-title="name"
                                                        item-value="id"
                                                        label="Channel (通道)"
                                                        density="compact"
                                                        hide-details
                                                        class="mr-2"
                                                        style="width: 150px; white-space: nowrap"
                                                        @update:model-value="() => onActionChannelChange(action.config)"
                                                    ></v-select>
                                                    <v-select
                                                        v-model="action.config.device_id"
                                                        :items="action.config._deviceList || []"
                                                        item-title="name"
                                                        item-value="id"
                                                        label="Device (设备)"
                                                        density="compact"
                                                        hide-details
                                                        class="mr-2"
                                                        style="width: 150px; white-space: nowrap"
                                                        :disabled="!action.config.channel_id"
                                                        @update:model-value="() => onActionDeviceChange(action.config)"
                                                        @click="() => loadActionDevices(action.config)"
                                                    ></v-select>
                                                    <v-combobox
                                                        v-model="action.config.point_id"
                                                        :items="action.config._pointList || []"
                                                        item-title="name"
                                                        item-value="id"
                                                        label="Point (点位)"
                                                        density="compact"
                                                        hide-details
                                                        class="mr-2"
                                                        style="width: 150px; white-space: nowrap"
                                                        :disabled="!action.config.device_id"
                                                        @click="() => loadActionPoints(action.config)"
                                                        :return-object="false"
                                                    ></v-combobox>
                                                    <v-text-field
                                                        v-model="action.config.value"
                                                        label="Value 值 (可选)"
                                                        density="compact"
                                                        hide-details
                                                        style="width: 120px; white-space: nowrap"
                                                    ></v-text-field>
                                                </div>
                                                
                                                <!-- Batch Mode -->
                                                <div v-else>
                                                    <div
                                                        v-for="(target, tIdx) in action.config.targets"
                                                        :key="tIdx"
                                                        class="d-flex gap-2 mb-2 align-center pa-2 border rounded"
                                                        style="max-width: 1024px"
                                                    >
                                                        <v-select
                                                            v-model="target.channel_id"
                                                            :items="channels"
                                                            item-title="name"
                                                            item-value="id"
                                                            label="Channel (通道)"
                                                            density="compact"
                                                            hide-details
                                                            class="mr-2"
                                                            style="width: 150px; white-space: nowrap"
                                                            @update:model-value="() => onActionChannelChange(target)"
                                                        ></v-select>
                                                        <v-select
                                                            v-model="target.device_id"
                                                            :items="target._deviceList || []"
                                                            item-title="name"
                                                            item-value="id"
                                                            label="Device (设备)"
                                                            density="compact"
                                                            hide-details
                                                            class="mr-2"
                                                            style="width: 150px; white-space: nowrap"
                                                            :disabled="!target.channel_id"
                                                            @update:model-value="() => onActionDeviceChange(target)"
                                                            @click="() => loadActionDevices(target)"
                                                        ></v-select>
                                                        <v-combobox
                                                            v-model="target.point_id"
                                                            :items="target._pointList || []"
                                                            item-title="name"
                                                            item-value="id"
                                                            label="Point (点位)"
                                                            density="compact"
                                                            hide-details
                                                            class="mr-2"
                                                            style="width: 150px; white-space: nowrap"
                                                            :disabled="!target.device_id"
                                                            @click="() => loadActionPoints(target)"
                                                            :return-object="false"
                                                        ></v-combobox>
                                                        <v-text-field
                                                            v-model="target.value"
                                                            label="Value 值"
                                                            density="compact"
                                                            hide-details
                                                            style="width: 120px; white-space: nowrap"
                                                        ></v-text-field>
                                                        <v-btn
                                                            icon="mdi-delete"
                                                            size="x-small"
                                                            color="error"
                                                            variant="text"
                                                            @click="removeTarget(action, tIdx)"
                                                        ></v-btn>
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import request from '@/utils/request'
import EdgeComputeMetrics from './EdgeComputeMetrics.vue'

const route = useRoute()
const tab = ref('metrics')
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

const query = reactive({
    start: '',
    end: '',
    ruleId: ''
})
const logs = ref([])

const currentRule = reactive({
    id: '',
    name: '',
    type: 'threshold',
    priority: 0,
    enable: true,
    trigger_mode: 'always',
    sources: [], // Multi-source
    trigger_logic: 'EXPR', // Default to EXPR for custom logic
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

const formatRuleType = (type) => {
    const map = {
        'threshold': 'Threshold (阈值触发)',
        'calculation': 'Calculation (计算公式)',
        'window': 'Window (时间/计数窗口)',
        'state': 'State (状态持续)'
    }
    return map[type] || type
}

const formatTriggerMode = (mode) => {
    const map = {
        'always': 'Always (始终触发)',
        'on_change': 'On Change (仅状态改变时触发)'
    }
    return map[mode] || mode
}

const getRuleTypeExplanation = (type) => {
    const map = {
        'threshold': '当数值满足条件表达式时触发。适用于简单的越限报警。',
        'calculation': '计算新值并输出，始终触发。适用于数据预处理或单位转换。',
        'window': '在指定时间或次数窗口内聚合数据（如求平均值）',
        'state': '当条件持续满足指定时间后触发。适用于防抖动报警。'
    }
    return map[type] || ''
}

const fetchChannels = async () => {
    try {
        const data = await request.get('/api/channels')
        if (data) {
            channels.value = data
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
        const data = await request.get(`/api/channels/${src.channel_id}/devices`)
        if (data) {
            src._deviceList = data
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
        const data = await request.get('/api/edge/rules')
        if (data) {
            rules.value = data
        }
    } catch (e) {
        console.error(e)
    }
}

const fetchRuleStates = async () => {
    try {
        const data = await request.get('/api/edge/states')
        if (data) {
            ruleStates.value = Object.values(data)
        }
    } catch (e) {
        console.error(e)
    }
}

const queryLogs = async () => {
    try {
        const params = new URLSearchParams()
        if (query.start) params.append('start_date', query.start.replace('T', ' '))
        if (query.end) params.append('end_date', query.end.replace('T', ' '))
        if (query.ruleId) params.append('rule_id', query.ruleId)
        
        const data = await request.get(`/api/edge/logs?${params.toString()}`)
        logs.value = data || []
    } catch (e) {
        console.error("Failed to query logs", e)
    }
}

const exportLogs = async () => {
    if (!logs.value || logs.value.length === 0) return

    const headers = ['Time', 'Rule ID', 'Rule Name', 'Status', 'Trigger Count', 'Value', 'Error']
    const csvContent = [
        headers.join(','),
        ...logs.value.map(log => [
            log.minute,
            log.rule_id,
            log.rule_name,
            log.status,
            log.trigger_count,
            log.last_value,
            `"${(log.error_message || '').replace(/"/g, '""')}"`
        ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `edge_logs_${new Date().toISOString().slice(0,19).replace(/[:T]/g, '-')}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}

const viewWindowData = async (ruleId, ruleName) => {
    currentWindowRuleName.value = ruleName
    windowData.value = []
    windowDialog.value = true
    try {
        const data = await request.get(`/api/edge/rules/${ruleId}/window`)
        if (data) {
            windowData.value = data
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
        if (!action.config) action.config = {}
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
            if (action._batchMode && action.config && action.config.targets) {
                for (const target of action.config.targets) {
                    if (target.channel_id) {
                        target._deviceList = await fetchDevices(target.channel_id)
                        if (target.device_id) {
                            updateActionPointList(target)
                        }
                    }
                }
            } else if (action.config) {
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
        await request.delete(`/api/edge/rules/${rule.id}`)
        fetchRules()
    } catch (e) {
        alert('删除失败')
    }
}

const saveRule = async () => {
    try {
        await request.post('/api/edge/rules', currentRule)
        dialog.value = false
        fetchRules()
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

// Helper to fetch devices
const fetchDevices = async (channelId) => {
    if (!channelId) return []
    try {
        const data = await request.get(`/api/channels/${channelId}/devices`)
        if (data) {
            return data
        }
    } catch (e) {
        console.error(e)
    }
    return []
}

// Action Helper Functions
const onActionChannelChange = async (target) => {
    target.device_id = ''
    target.point_id = ''
    target._deviceList = []
    target._pointList = []
    
    if (target.channel_id) {
        target._deviceList = await fetchDevices(target.channel_id)
    }
}

const onActionDeviceChange = (target) => {
    target.point_id = ''
    target._pointList = []
    updateActionPointList(target)
}

const updateActionPointList = (target) => {
    if (!target.device_id || !target._deviceList) return
    const dev = target._deviceList.find(d => d.id === target.device_id)
    if (dev && dev.points) {
        // Filter points: keep only ReadWrite (RW) or WriteOnly (W)
        // 'R' is ReadOnly
        target._pointList = dev.points.filter(p => p.readwrite !== 'R')
    } else {
        target._pointList = []
    }
}

const loadActionDevices = async (target) => {
    if (!target.channel_id || (target._deviceList && target._deviceList.length > 0)) return
    await onActionChannelChange(target)
}

const loadActionPoints = (target) => {
    if (!target._pointList || target._pointList.length === 0) {
        updateActionPointList(target)
    }
}

const toggleBatchMode = (action) => {
    if (action._batchMode) {
        // Init targets if needed
        if (!action.config.targets) action.config.targets = []
        // If single mode had values, migrate them to first target
        if (action.config.channel_id) {
            action.config.targets.push({
                channel_id: action.config.channel_id,
                device_id: action.config.device_id,
                point_id: action.config.point_id,
                value: action.config.value,
                _deviceList: action.config._deviceList,
                _pointList: action.config._pointList
            })
            // Clear single config
            action.config.channel_id = ''
            action.config.device_id = ''
            action.config.point_id = ''
            action.config.value = ''
        }
    }
}

const addTarget = (action) => {
    if (!action.config.targets) action.config.targets = []
    action.config.targets.push({
        channel_id: '',
        device_id: '',
        point_id: '',
        value: ''
    })
}

const removeTarget = (action, index) => {
    if (action.config.targets) {
        action.config.targets.splice(index, 1)
    }
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
