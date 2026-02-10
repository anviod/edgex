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

            <v-window-item value="logs" class="h-100">
                <v-card class="h-100 d-flex flex-column">
                    <v-card-title class="flex-shrink-0">
 
                    </v-card-title>
                    <v-card-text class="flex-grow-1 d-flex flex-column overflow-hidden">
                        <v-row class="flex-shrink-0 mb-2">
                            <v-col cols="12" md="3">
                                <v-text-field type="datetime-local" v-model="query.start" label="开始时间" density="compact" hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field type="datetime-local" v-model="query.end" label="结束时间" density="compact" hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-text-field v-model="query.ruleId" label="规则ID (可选)" density="compact" hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-btn color="primary" block @click="queryLogs">查询</v-btn>
                            </v-col>
                            <v-col cols="12" md="2">
                               <v-btn color="success" prepend-icon="mdi-download" @click="exportLogs" :disabled="logs.length === 0">导出 CSV</v-btn>
                            </v-col>
                        </v-row>
                        
                        <div class="flex-grow-1 overflow-auto border rounded">
                            <v-table density="compact" fixed-header height="100%">
                                <thead>
                                    <tr>
                                        <th style="white-space: nowrap">时间</th>
                                        <th style="white-space: nowrap">规则ID</th>
                                        <th style="white-space: nowrap">规则名称</th>
                                        <th style="white-space: nowrap">状态</th>
                                        <th style="white-space: nowrap">触发次数</th>
                                        <th style="white-space: nowrap">值</th>
                                        <th style="white-space: nowrap">错误信息</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="log in logs" :key="log.minute + log.rule_id">
                                        <td style="white-space: nowrap">{{ log.minute }}</td>
                                        <td style="white-space: nowrap">{{ log.rule_id }}</td>
                                        <td style="white-space: nowrap">{{ log.rule_name }}</td>
                                        <td>
                                            <v-chip :color="getStatusColor(log.status)" size="x-small">
                                                {{ log.status }}
                                            </v-chip>
                                        </td>
                                        <td>{{ log.trigger_count }}</td>
                                        <td class="truncate-cell" @click="showDetails('完整值', log.last_value)" title="点击查看详情">
                                            {{ log.last_value }}
                                        </td>
                                        <td class="truncate-cell text-error" @click="showDetails('错误详情', log.error_message)" title="点击查看详情">
                                            {{ log.error_message }}
                                        </td>
                                    </tr>
                                    <tr v-if="logs.length === 0">
                                        <td colspan="7" class="text-center text-grey">暂无历史日志</td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </div>
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

        <!-- Details Dialog -->
        <v-dialog v-model="detailsDialog" max-width="800px">
            <v-card>
                <v-card-title>
                    {{ detailTitle }}
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-close" variant="text" @click="detailsDialog = false"></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-tabs v-model="detailsTab" density="compact" class="mb-2">
                        <v-tab value="text">文本/原始内容</v-tab>
                        <v-tab value="hex" :disabled="!decodedHex">Hex 视图</v-tab>
                    </v-tabs>
                    
                    <v-window v-model="detailsTab">
                        <v-window-item value="text">
                            <div class="text-body-2 mb-2 text-grey">内容长度: {{ detailContent.length }}</div>
                            <v-textarea
                                v-model="detailContent"
                                readonly
                                auto-grow
                                rows="5"
                                max-rows="15"
                                variant="outlined"
                                style="font-family: monospace;"
                            ></v-textarea>
                        </v-window-item>
                        
                        <v-window-item value="hex">
                            <div class="text-body-2 mb-2 text-grey">Hex 视图 ({{ decodedBytes ? decodedBytes.length : 0 }} bytes)</div>
                            <v-textarea
                                v-model="decodedHex"
                                readonly
                                auto-grow
                                rows="5"
                                max-rows="15"
                                variant="outlined"
                                style="font-family: monospace;"
                            ></v-textarea>
                        </v-window-item>
                    </v-window>

                    <v-alert v-if="detectedFile" type="info" variant="tonal" class="mt-2" density="compact">
                        <div class="d-flex align-center">
                            <span>检测到文件格式: <strong>{{ detectedFile.name }} ({{ detectedFile.ext }})</strong></span>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" size="small" prepend-icon="mdi-download" @click="downloadDetectedFile">
                                下载文件
                            </v-btn>
                        </div>
                    </v-alert>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" variant="text" prepend-icon="mdi-code-tags" @click="tryDecode" v-if="!decodedHex">
                        尝试 Base64 解码
                    </v-btn>
                    <v-btn color="primary" variant="text" @click="detailsDialog = false">关闭</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Rule Dialog -->
        <v-dialog v-model="dialog" max-width="80%">
            <v-card>
                <v-card-title class="d-flex align-center">
                    {{ editingRule ? '编辑规则' : '添加规则' }}
                    <v-spacer></v-spacer>
                    <v-btn
                        color="info"
                        variant="text"
                        prepend-icon="mdi-help-circle-outline"
                        @click="openHelpDialog"
                    >
                        帮助文档
                    </v-btn>
                </v-card-title>
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
                            <v-col cols="12" md="6">
                                <v-combobox
                                    v-model="currentRule.check_interval"
                                    :items="['1s', '5s', '10s', '30s', '1m']"
                                    label="检查频率 (Check Frequency)"
                                    hint="如果不设置，则按数据到达频率实时检查"
                                    persistent-hint
                                ></v-combobox>
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
                            <v-col cols="12" v-if="currentRule.type === 'state' || currentRule.type === 'threshold'">
                                <div class="text-subtitle-1 mb-2">状态维持 (Duration & Count)</div>
                                <v-row>
                                    <v-col cols="6">
                                        <v-text-field v-model="currentRule.state.duration" label="持续时间 (Duration)" hint="例如: 10s"></v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field v-model.number="currentRule.state.count" type="number" label="连续次数 (Count)"></v-text-field>
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
                                >
                                    <template v-slot:append-inner>
                                        <v-btn color="primary" variant="tonal" class="rounded-0 h-100" style="margin-top: -8px; margin-bottom: -8px; margin-right: -12px; min-width: 90px;" @click="openHelper(currentRule.condition, (v) => currentRule.condition = v)">
                                            <v-icon start icon="mdi-calculator"></v-icon>
                                            公式助手
                                        </v-btn>
                                    </template>
                                </v-textarea>
                            </v-col>
                            <!-- Calculation Expression -->
                            <v-col cols="12" v-if="currentRule.type === 'calculation'">
                                <v-textarea
                                    v-model="currentRule.expression"
                                    label="计算公式 (Expression)"
                                    hint="例如: value * 1.5 + 32"
                                    rows="2"
                                >
                                    <template v-slot:append-inner>
                                        <v-btn color="primary" variant="tonal" class="rounded-0 h-100" style="margin-top: -8px; margin-bottom: -8px; margin-right: -12px; min-width: 90px;" @click="openHelper(currentRule.expression, (v) => currentRule.expression = v)">
                                            <v-icon start icon="mdi-calculator"></v-icon>
                                            公式助手
                                        </v-btn>
                                    </template>
                                </v-textarea>
                            </v-col>

                            <!-- Actions -->
                            <v-col cols="12">
                                <div class="d-flex align-center mb-2">
                                    <div class="text-subtitle-1">动作列表 (Actions)</div>
                                    <v-spacer></v-spacer>
                                    <v-btn size="small" prepend-icon="mdi-plus" variant="text" @click="addAction">添加动作</v-btn>
                                </div>
                                <div v-if="!currentRule.actions || currentRule.actions.length === 0" class="text-center text-grey py-4 border-dashed rounded mb-2" style="border: 1px dashed #ccc;">
                                    暂无动作 (No Actions)
                                </div>
                                <div v-else>
                                    <div v-for="(action, index) in currentRule.actions" :key="index">
                                        <ActionEditor 
                                            v-model="currentRule.actions[index]" 
                                            :channels="channels" 
                                            @remove="removeAction(index)" 
                                        />
                                    </div>
                                </div>
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

        <!-- Help Dialog -->
        <v-dialog v-model="helpDialog" max-width="800px" scrollable>
            <v-card>
                <v-card-title class="bg-primary text-white">
                    <v-icon start>mdi-school</v-icon>
                    边缘计算规则配置指南
                </v-card-title>
                <v-card-text class="pa-4" style="max-height: 600px; overflow-y: auto;">
                    
                    <div class="text-h6 mb-2">1. 基础概念</div>
                    <v-alert type="info" variant="tonal" class="mb-4" density="compact">
                        <ul>
                            <li><strong>数据源 (Sources)</strong>: 规则的输入变量。请为每个源设置简短的 <code>别名 (Alias)</code> (如 t1, p1)，以便在表达式中引用。</li>
                            <li><strong>触发条件 (Condition)</strong>: 返回 true/false 的布尔表达式。仅当条件满足时触发动作。</li>
                            <li><strong>动作 (Actions)</strong>: 规则触发后执行的一系列操作。</li>
                        </ul>
                    </v-alert>

                    <div class="text-h6 mb-2">2. 常见场景最佳实践</div>
                    
                    <v-expansion-panels variant="accordion" class="mb-4">
                        <v-expansion-panel>
                            <v-expansion-panel-title>场景 A: 简单越限报警 (Threshold)</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <p><strong>目标</strong>: 当温度 (t1) 超过 50 度时，记录日志并发送 MQTT 告警。</p>
                                <ul class="pl-4 mt-2">
                                    <li><strong>类型</strong>: Threshold</li>
                                    <li><strong>数据源</strong>: 添加温度点位，别名设为 <code>t1</code></li>
                                    <li><strong>触发条件</strong>: <code>t1 > 50</code></li>
                                    <li><strong>动作</strong>: 
                                        <ol class="pl-4">
                                            <li>Log: 级别 Warn, 内容 "温度过高: ${t1}"</li>
                                            <li>MQTT: Topic "alarm/temp", 内容 "温度异常: ${t1}"</li>
                                        </ol>
                                    </li>
                                </ul>
                            </v-expansion-panel-text>
                        </v-expansion-panel>

                        <v-expansion-panel>
                            <v-expansion-panel-title>场景 B: 顺序联动控制 (Sequence Workflow)</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <p><strong>目标</strong>: 启动设备 A，等待 30秒，确认 A 已启动后再启动设备 B。如果 A 启动失败，则回退关闭 A。</p>
                                <ul class="pl-4 mt-2">
                                    <li><strong>类型</strong>: Threshold (或 State)</li>
                                    <li><strong>触发条件</strong>: <code>start_signal == 1</code> (启动信号)</li>
                                    <li><strong>动作</strong>: 选择 <strong>Sequence</strong> 类型，添加以下步骤：
                                        <ol class="pl-4 mt-1">
                                            <li><strong>Device Control</strong>: 开启设备 A (Value: 1)</li>
                                            <li><strong>Delay</strong>: 30s</li>
                                            <li><strong>Check</strong>: 
                                                <ul class="pl-4">
                                                    <li>选择设备 A 的状态点位</li>
                                                    <li>表达式: <code>v == 1</code> (确认运行中)</li>
                                                    <li>重试: 3次, 间隔: 2s</li>
                                                    <li><strong>On Fail (失败回退)</strong>: 添加 Device Control 动作 -> 关闭设备 A (Value: 0)</li>
                                                </ul>
                                            </li>
                                            <li><strong>Device Control</strong>: 开启设备 B (Value: 1)</li>
                                        </ol>
                                    </li>
                                </ul>
                                <v-alert type="warning" variant="tonal" density="compact" class="mt-2">
                                    <strong>注意:</strong> Sequence 中的 Check 动作如果失败且未在 On Fail 中成功处理异常（通常用于记录日志或回退），整个 Sequence 将会终止，后续步骤（如开启设备 B）不会执行。这是实现安全联动逻辑的关键。
                                </v-alert>
                            </v-expansion-panel-text>
                        </v-expansion-panel>

                        <v-expansion-panel>
                            <v-expansion-panel-title>场景 C: 批量设备控制 (Batch Control)</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <p><strong>目标</strong>: 一键关闭所有相关设备 (A, B, C)。</p>
                                <ul class="pl-4 mt-2">
                                    <li><strong>动作</strong>: 选择 <strong>Device Control</strong> 类型</li>
                                    <li><strong>配置</strong>: 开启 <strong>Batch Control (批量控制)</strong> 开关</li>
                                    <li><strong>目标列表</strong>:
                                        <ul class="pl-4">
                                            <li>目标 1: 设备 A, 开关点位, 值 0</li>
                                            <li>目标 2: 设备 B, 开关点位, 值 0</li>
                                            <li>目标 3: 设备 C, 开关点位, 值 0</li>
                                        </ul>
                                    </li>
                                </ul>
                                <p class="mt-2 text-caption">优势: 批量控制会并行发送写入请求，相比连续的单点控制动作，响应速度更快。</p>
                            </v-expansion-panel-text>
                        </v-expansion-panel>

                        <v-expansion-panel>
                            <v-expansion-panel-title>场景 D: 位运算与状态字控制 (Bitwise)</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <p><strong>目标</strong>: 仅修改状态字的第 4 位 (置 1)，保持其他位不变。</p>
                                <ul class="pl-4 mt-2">
                                    <li><strong>动作</strong>: Device Control</li>
                                    <li><strong>Expr (公式)</strong>: <code>bitset(v, 4)</code> 或 <code>v | 8</code> (0-based index)</li>
                                    <li><strong>说明</strong>: 系统会自动读取当前值 -> 计算新值 -> 写入 (Read-Modify-Write 机制)。</li>
                                </ul>
                                <v-alert type="success" variant="tonal" density="compact" class="mt-2">
                                    <strong>RMW 机制:</strong> 网关会自动处理并发冲突，确保在修改某一位时，不会覆盖其他位在同一时刻发生的变化（仅针对支持原子操作或网关级锁定的场景）。
                                </v-alert>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>

                    <div class="text-h6 mb-2">3. 表达式语法参考</div>
                    <v-table density="compact" class="border">
                        <thead>
                            <tr>
                                <th>语法</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><code>v</code> / <code>value</code></td><td>当前点位的实时值</td></tr>
                            <tr><td><code>t1</code>, <code>p1</code></td><td>数据源别名引用</td></tr>
                            <tr><td><code>bitget(v, n)</code></td><td>获取第 n 位 (0/1)</td></tr>
                            <tr><td><code>bitset(v, n)</code></td><td>将第 n 位置 1</td></tr>
                            <tr><td><code>bitclr(v, n)</code></td><td>将第 n 位置 0</td></tr>
                        </tbody>
                    </v-table>
                    
                    <div class="text-h6 mb-2 mt-4">4. 动作类型详解</div>
                    <v-expansion-panels variant="accordion">
                        <v-expansion-panel>
                            <v-expansion-panel-title>Log (日志)</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                记录规则触发信息到系统日志。
                                <ul>
                                    <li><strong>Level</strong>: 日志级别 (Info/Warn/Error)。</li>
                                    <li><strong>Message</strong>: 支持 <code>${v}</code> 或 <code>${alias}</code> 模板变量。</li>
                                </ul>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                        <v-expansion-panel>
                            <v-expansion-panel-title>Device Control (设备控制)</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                向设备写入值。
                                <ul>
                                    <li><strong>单点模式</strong>: 直接控制一个点位。</li>
                                    <li><strong>批量模式</strong>: 同时控制多个点位。</li>
                                    <li><strong>Expression</strong>: 可选。用于计算写入值（支持位操作）。</li>
                                </ul>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                        <v-expansion-panel>
                            <v-expansion-panel-title>Sequence (顺序执行)</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                严格按顺序执行子动作。如果任一步骤失败（如 Check 失败且未处理），整个序列终止。
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                        <v-expansion-panel>
                            <v-expansion-panel-title>Check (校验)</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                读取点位并校验条件。
                                <ul>
                                    <li><strong>Expression</strong>: 校验公式 (如 <code>v == 1</code>)。</li>
                                    <li><strong>Retry</strong>: 失败重试次数。</li>
                                    <li><strong>On Fail</strong>: 校验最终失败后执行的回退动作序列。</li>
                                </ul>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                        <v-expansion-panel>
                            <v-expansion-panel-title>Delay (延时)</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                暂停执行指定时长 (如 <code>30s</code>, <code>1m</code>)。阻塞当前序列。
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>

                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="helpDialog = false">关闭</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Expression Helper Dialog -->
        <v-dialog v-model="helperDialog" max-width="600px">
            <v-card>
                <v-card-title class="bg-primary text-white">
                    <v-icon start>mdi-calculator</v-icon>
                    表达式转换助手
                </v-card-title>
                <v-card-text class="pt-4">
                    <div class="text-body-2 mb-2">输入标准表达式 (例如: v & 64, v | 1, ~v):</div>
                    <div class="text-caption text-grey mb-2">提示: 系统已直接支持 v.N 语法 (如 v.4) 及 v.bit.N 语法 (如 v.bit.4) 读取第N位，无需转换。</div>
                    <v-textarea 
                        v-model="helperInput" 
                        label="标准表达式 (Standard Syntax)" 
                        variant="outlined"
                        rows="3"
                        auto-grow
                    ></v-textarea>
                    
                    <div class="d-flex justify-center my-2 gap-2">
                        <v-btn color="info" variant="text" prepend-icon="mdi-book-open-variant" @click="docsDialog = true">
                            查看函数文档 (View Docs)
                        </v-btn>
                        <v-btn color="secondary" prepend-icon="mdi-arrow-down-bold" @click="convertHelper">
                            转换 (Convert)
                        </v-btn>
                    </div>
                    
                    <div class="text-body-2 mb-2">转换结果 (Function Syntax):</div>
                    <v-textarea 
                        v-model="helperOutput" 
                        label="函数表达式 (Result)" 
                        variant="outlined"
                        bg-color="grey-lighten-4"
                        rows="3"
                        auto-grow
                        readonly
                    ></v-textarea>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" variant="text" @click="helperDialog = false">关闭</v-btn>
                    <v-btn color="primary" @click="applyHelper" :disabled="!helperOutput">应用并填入</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- Expression Docs Dialog -->
        <v-dialog v-model="docsDialog" max-width="900px" scrollable>
            <v-card>
                <v-card-title class="bg-info text-white">
                    <v-icon start>mdi-book-open-variant</v-icon>
                    表达式函数参考文档 (Expression Reference)
                </v-card-title>
                <v-card-text class="pa-4" style="max-height: 600px; overflow-y: auto;">
                    
                    <v-alert type="info" variant="tonal" class="mb-4" density="compact">
                        <div class="text-subtitle-2 font-weight-bold">基本变量</div>
                        <div><code>value</code> 或 <code>v</code> : 当前触发点位的值 (The current point value).</div>
                        <div><code>t1</code>, <code>t2</code> ... : 数据源别名 (Source aliases defined in rule).</div>
                    </v-alert>

                    <div class="text-h6 mb-2">1. 位操作函数 (Bitwise Operations)</div>
                    <v-table density="compact" class="mb-4 border">
                        <thead>
                            <tr>
                                <th style="width: 200px">函数 (Function)</th>
                                <th>说明 (Description)</th>
                                <th>示例 (Example)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>bitand(a, b)</code></td>
                                <td>按位与 (Bitwise AND). 对应 <code>a & b</code></td>
                                <td><code>bitand(v, 1)</code> (判断最低位是否为1)</td>
                            </tr>
                            <tr>
                                <td><code>bitor(a, b)</code></td>
                                <td>按位或 (Bitwise OR). 对应 <code>a | b</code></td>
                                <td><code>bitor(v, 4)</code> (将第3位置1)</td>
                            </tr>
                            <tr>
                                <td><code>bitxor(a, b)</code></td>
                                <td>按位异或 (Bitwise XOR). 对应 <code>a ^ b</code></td>
                                <td><code>bitxor(v, 255)</code> (低8位取反)</td>
                            </tr>
                            <tr>
                                <td><code>bitnot(a)</code></td>
                                <td>按位取反 (Bitwise NOT). 对应 <code>~a</code></td>
                                <td><code>bitnot(v)</code></td>
                            </tr>
                            <tr>
                                <td><code>bitshl(a, n)</code></td>
                                <td>左移 (Left Shift). 对应 <code>a &lt;&lt; n</code></td>
                                <td><code>bitshl(1, 4)</code> (结果 16)</td>
                            </tr>
                            <tr>
                                <td><code>bitshr(a, n)</code></td>
                                <td>右移 (Right Shift). 对应 <code>a &gt;&gt; n</code></td>
                                <td><code>bitshr(v, 8)</code> (取高8位)</td>
                            </tr>
                        </tbody>
                    </v-table>

                    <div class="text-h6 mb-2">2. 位读取简写 (Bit Access Shortcuts)</div>
                    <v-table density="compact" class="mb-4 border">
                        <thead>
                            <tr>
                                <th style="width: 200px">语法 (Syntax)</th>
                                <th>说明 (Description)</th>
                                <th>等价公式 (Equivalent)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>v.N</code></td>
                                <td>读取第N位 (1-based index). 返回 0 或 1.</td>
                                <td><code>bitget(v, N-1)</code></td>
                            </tr>
                            <tr>
                                <td><code>v.bit.N</code></td>
                                <td>同上，读取第N位 (1-based index).</td>
                                <td><code>bitget(v, N-1)</code></td>
                            </tr>
                            <tr>
                                <td><code>bitget(v, n)</code></td>
                                <td>读取第n位 (0-based index). 返回 0 或 1.</td>
                                <td>-</td>
                            </tr>
                        </tbody>
                    </v-table>
                    <v-alert density="compact" variant="outlined" class="mb-4" color="warning">
                        <strong>注意:</strong> <code>v.1</code> 代表第1位 (Bit 0), <code>v.4</code> 代表第4位 (Bit 3).
                    </v-alert>

                    <div class="text-h6 mb-2">3. 写入控制函数 (Target Write Only)</div>
                    <p class="text-caption text-grey mb-2">仅在"动作列表 (Actions)" -> "Device Control" 的 "Expr" 字段有效。</p>
                    <v-table density="compact" class="mb-4 border">
                        <thead>
                            <tr>
                                <th style="width: 250px">语法 (Syntax)</th>
                                <th>说明 (Description)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>bitset(N, value)</code></td>
                                <td>
                                    将目标点位的第N位 (1-based) 修改为 <code>value</code> 的值 (0或1)。
                                    <br>保留其他位不变 (Read-Modify-Write)。
                                </td>
                            </tr>
                            <tr>
                                <td><code>bitset(N, 1)</code></td>
                                <td>将目标点位的第N位 (1-based) 置为 1。</td>
                            </tr>
                            <tr>
                                <td><code>bitset(N, 0)</code></td>
                                <td>将目标点位的第N位 (1-based) 置为 0。</td>
                            </tr>
                        </tbody>
                    </v-table>
                    <v-alert density="compact" variant="outlined" class="mb-4" color="success">
                        <strong>示例:</strong> 如果目标是 Slave Device 2 的 v.4 (第4位)，使用 <code>bitset(4, value)</code>。
                        <br>这会自动读取设备当前值，修改第4位，然后写回。
                    </v-alert>

                    <div class="text-h6 mb-2">4. 通用运算符 (General Operators)</div>
                    <v-chip-group class="mb-4">
                        <v-chip size="small">Math: +, -, *, /, %, ^</v-chip>
                        <v-chip size="small">Compare: ==, !=, &lt;, &gt;, &lt;=, &gt;=</v-chip>
                        <v-chip size="small">Logic: &&, ||, !</v-chip>
                        <v-chip size="small">Ternary: cond ? a : b</v-chip>
                    </v-chip-group>

                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="docsDialog = false">关闭 (Close)</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import request from '@/utils/request'
import { base64ToUint8Array, uint8ArrayToHex, detectFileType, downloadBytes } from '@/utils/decode'
import EdgeComputeMetrics from './EdgeComputeMetrics.vue'

// Expression Helper
const helperDialog = ref(false)
const docsDialog = ref(false)
const helperInput = ref('')
const helperOutput = ref('')
let helperCallback = null

const openHelper = (initialValue, callback) => {
    helperInput.value = initialValue || ''
    helperOutput.value = ''
    helperCallback = callback
    helperDialog.value = true
}

const convertHelper = () => {
    let res = helperInput.value
    if (!res) return

    // Handle ~ (Unary NOT)
    res = res.replace(/~\s*([a-zA-Z0-9_.]+|\([^)]+\))/g, 'bitnot($1)')

    let prev = ''
    let limit = 10
    while (prev !== res && limit > 0) {
        prev = res
        limit--
        
        // << and >>
        res = res.replace(/([a-zA-Z0-9_.]+|\([^)]+\))\s*(<<|>>)\s*([a-zA-Z0-9_.]+|\([^)]+\))/g, (m, a, op, b) => {
             return op === '<<' ? `bitshl(${a}, ${b})` : `bitshr(${a}, ${b})`
        })
        
        // &
        res = res.replace(/([a-zA-Z0-9_.]+|\([^)]+\))\s*&\s*([a-zA-Z0-9_.]+|\([^)]+\))/g, 'bitand($1, $2)')
        
        // ^
        res = res.replace(/([a-zA-Z0-9_.]+|\([^)]+\))\s*\^\s*([a-zA-Z0-9_.]+|\([^)]+\))/g, 'bitxor($1, $2)')
        
        // |
        res = res.replace(/([a-zA-Z0-9_.]+|\([^)]+\))\s*\|\s*([a-zA-Z0-9_.]+|\([^)]+\))/g, 'bitor($1, $2)')
    }
    helperOutput.value = res
}

const applyHelper = () => {
    if (helperCallback && helperOutput.value) {
        helperCallback(helperOutput.value)
    }
    helperDialog.value = false
}

const route = useRoute()
const tab = ref('metrics')
const rules = ref([])
const ruleStates = ref([])
const dialog = ref(false)
const helpDialog = ref(false)
const editingRule = ref(false)
import ActionEditor from '@/components/ActionEditor.vue'

const channels = ref([])
const devices = ref([])
const windowDialog = ref(false)
const windowData = ref([])
const currentWindowRuleName = ref('')
let timer = null

// Details Dialog
const detailsDialog = ref(false)
const detailTitle = ref('')
const detailContent = ref('')
const detailsTab = ref('text')
const decodedHex = ref('')
const detectedFile = ref(null)
const decodedBytes = ref(null)

const showDetails = (title, content) => {
    detailTitle.value = title
    detailContent.value = String(content || '')
    detailsDialog.value = true
    
    // Reset state
    detailsTab.value = 'text'
    decodedHex.value = ''
    detectedFile.value = null
    decodedBytes.value = null
}

const tryDecode = () => {
    try {
        const bytes = base64ToUint8Array(detailContent.value)
        decodedBytes.value = bytes
        decodedHex.value = uint8ArrayToHex(bytes)
        detectedFile.value = detectFileType(bytes)
        
        detailsTab.value = 'hex'
        showMessage('解码成功', 'success')
    } catch (e) {
        showMessage('Base64 解码失败: ' + e.message, 'error')
    }
}

const downloadDetectedFile = () => {
    if (decodedBytes.value && detectedFile.value) {
        downloadBytes(decodedBytes.value, `download.${detectedFile.value.ext}`)
    }
}

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
    check_interval: '',
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

const openHelpDialog = () => {
    helpDialog.value = true
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

// Action Helper Functions removed - moved to ActionEditor component

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

<style scoped>
.edge-compute-container {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.truncate-cell {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
}
.truncate-cell:hover {
    color: #1976D2; /* primary color */
    background-color: #f5f5f5;
}
</style>
