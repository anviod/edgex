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
                    v-if="channelProtocol === 'bacnet-ip'"
                    color="info"
                    prepend-icon="mdi-radar"
                    class="mr-2"
                    @click="openScanDialog()"
                >
                    扫描设备
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
                            <th class="text-left" v-if="channelProtocol && (channelProtocol.includes('modbus') || channelProtocol === 'dlt645')">
                                {{ channelProtocol === 'dlt645' ? '设备地址' : '从机ID' }}
                            </th>
                            <th class="text-left" v-if="channelProtocol === 'bacnet-ip'">Instance ID</th>
                            <th class="text-left" v-if="channelProtocol === 'bacnet-ip'">IP地址</th>
                            <th class="text-left" v-if="channelProtocol === 'opc-ua'">Endpoint</th>
                            <th class="text-left" v-if="channelProtocol === 'bacnet-ip'">厂商/型号</th>
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
                            <td v-if="channelProtocol && (channelProtocol.includes('modbus') || channelProtocol === 'dlt645')">
                                <v-chip size="small" variant="outlined" class="font-weight-medium">
                                    {{ channelProtocol === 'dlt645' ? (device.config?.station_address || device.config?.address || '-') : (device.config?.slave_id || '-') }}
                                </v-chip>
                            </td>
                            <td v-if="channelProtocol === 'bacnet-ip'">
                                <v-chip size="small" variant="outlined" class="font-weight-medium">
                                    {{ device.config?.device_id || '-' }}
                                </v-chip>
                            </td>
                            <td v-if="channelProtocol === 'bacnet-ip'">
                                {{ device.config?.ip || '-' }}
                            </td>
                            <td v-if="channelProtocol === 'opc-ua'" style="max-width: 200px;">
                                <div class="text-caption text-truncate" :title="device.config?.endpoint || '-'">
                                    {{ device.config?.endpoint || '-' }}
                                </div>
                            </td>
                            <td v-if="channelProtocol === 'bacnet-ip'" style="max-width: 200px;">
                                <div class="text-caption text-truncate" :title="`${device.config?.vendor_name || '-'} / ${device.config?.model_name || '-'}`">
                                    {{ device.config?.vendor_name || '-' }} / {{ device.config?.model_name || '-' }}
                                </div>
                            </td>
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
                                    size="x-small" 
                                    variant="tonal"
                                    icon="mdi-eye"
                                    class="mr-1"
                                    @click="goToPoints(device)"
                                    title="查看点位"
                                ></v-btn>
                                <v-btn 
                                    color="secondary" 
                                    size="x-small" 
                                    variant="tonal"
                                    icon="mdi-link-variant"
                                    class="mr-1"
                                    @click="showRuleUsage(device)"
                                    title="查看关联规则"
                                ></v-btn>
                                <v-btn
                                    color="primary"
                                    size="x-small" 
                                    variant="tonal"
                                    icon="mdi-history"
                                    class="mr-1"
                                    @click="openHistoryDialog(device)"
                                    title="查看历史数据"
                                ></v-btn>
                                <v-btn
                                    color="info"
                                    size="x-small" 
                                    variant="tonal"
                                    icon="mdi-pencil"
                                    class="mr-1"
                                    @click="openDialog(device)"
                                    title="编辑设备"
                                ></v-btn>
                                <v-btn
                                    color="error"
                                    size="x-small" 
                                    variant="tonal"
                                    icon="mdi-delete"
                                    @click="confirmDelete(device)"
                                    title="删除设备"
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
                            <v-col cols="12" v-else-if="channelProtocol && channelProtocol.includes('modbus')">
                                <v-text-field
                                    v-model.number="form.modbusSlaveId"
                                    label="从机 ID (Slave ID)"
                                    type="number"
                                    placeholder="1"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" v-else-if="channelProtocol === 'bacnet-ip'">
                                <v-row>
                                    <v-col cols="12" sm="4">
                                        <v-text-field
                                            v-model.number="form.bacnetDeviceInstance"
                                            label="设备实例 ID (Instance ID)"
                                            type="number"
                                            placeholder="1001"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="5">
                                        <v-text-field
                                            v-model="form.bacnetIp"
                                            label="IP 地址"
                                            placeholder="192.168.1.100"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="3">
                                        <v-text-field
                                            v-model.number="form.bacnetPort"
                                            label="端口"
                                            type="number"
                                            placeholder="47808"
                                            default="47808"
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                            
                            <!-- OPC UA Config -->
                            <v-col cols="12" v-if="channelProtocol === 'opc-ua'">
                                <v-card variant="outlined" class="pa-2">
                                    <v-card-title class="text-subtitle-1 pb-0">OPC UA 连接配置</v-card-title>
                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="12">
                                                <v-text-field
                                                    v-model="form.config.endpoint"
                                                    label="Endpoint URL"
                                                    placeholder="opc.tcp://192.168.1.10:4840"
                                                    hide-details="auto"
                                                    density="compact"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6">
                                                <v-select
                                                    v-model="form.config.security_policy"
                                                    :items="['None', 'Basic128Rsa15', 'Basic256', 'Basic256Sha256']"
                                                    label="安全策略"
                                                    hide-details
                                                    density="compact"
                                                ></v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6">
                                                <v-select
                                                    v-model="form.config.security_mode"
                                                    :items="['None', 'Sign', 'SignAndEncrypt']"
                                                    label="安全模式"
                                                    hide-details
                                                    density="compact"
                                                ></v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6">
                                                <v-select
                                                    v-model="form.config.auth_method"
                                                    :items="['Anonymous', 'UserName', 'Certificate']"
                                                    label="认证方式"
                                                    hide-details
                                                    density="compact"
                                                ></v-select>
                                            </v-col>
                                            
                                            <!-- UserName Auth -->
                                            <template v-if="form.config.auth_method === 'UserName'">
                                                <v-col cols="12" sm="6">
                                                    <v-text-field
                                                        v-model="form.config.username"
                                                        label="用户名"
                                                        hide-details="auto"
                                                        density="compact"
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6">
                                                    <v-text-field
                                                        v-model="form.config.password"
                                                        label="密码"
                                                        type="password"
                                                        hide-details="auto"
                                                        density="compact"
                                                    ></v-text-field>
                                                </v-col>
                                            </template>
                                            
                                            <!-- Certificate Auth -->
                                            <template v-if="form.config.auth_method === 'Certificate'">
                                                <v-col cols="12">
                                                    <v-text-field
                                                        v-model="form.config.certificate_file"
                                                        label="客户端证书路径"
                                                        hide-details="auto"
                                                        density="compact"
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-text-field
                                                        v-model="form.config.private_key_file"
                                                        label="私钥路径"
                                                        hide-details="auto"
                                                        density="compact"
                                                    ></v-text-field>
                                                </v-col>
                                            </template>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-col>

                            <!-- Storage Config -->
                            <v-col cols="12">
                                <v-card variant="outlined" class="pa-2">
                                    <v-card-title class="text-subtitle-1 pb-0">数据存储策略</v-card-title>
                                    <v-card-text>
                                        <v-row align="center">
                                            <v-col cols="12">
                                                <v-switch
                                                    v-model="form.storageEnable"
                                                    label="启用存储"
                                                    color="primary"
                                                    hide-details
                                                ></v-switch>
                                            </v-col>
                                        </v-row>
                                        <v-row align="center" v-if="form.storageEnable">
                                            <v-col cols="12" sm="4">
                                                <v-select
                                                    v-model="form.storageStrategy"
                                                    :items="[
                                                        { title: '实时 (每条)', value: 'realtime' },
                                                        { title: '定时间隔', value: 'interval' }
                                                    ]"
                                                    label="存储策略"
                                                    hide-details
                                                    density="compact"
                                                ></v-select>
                                            </v-col>
                                            <v-col cols="12" sm="4" v-if="form.storageStrategy === 'interval'">
                                                <v-text-field
                                                    v-model.number="form.storageInterval"
                                                    label="存储间隔 (分钟)"
                                                    type="number"
                                                    min="1"
                                                    placeholder="1"
                                                    hide-details
                                                    density="compact"
                                                    suffix="分钟"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="4">
                                                 <v-text-field
                                                    v-model.number="form.storageMaxRecords"
                                                    label="最大保留记录数"
                                                    type="number"
                                                    min="1"
                                                    placeholder="1000"
                                                    hide-details
                                                    density="compact"
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <div class="text-caption text-grey mt-2" v-if="form.storageEnable">
                                            <div v-if="form.storageStrategy === 'realtime'">* 实时模式：每当点位数据更新时，将触发一次数据存储（所有点位最新值合并）。</div>
                                            <div v-if="form.storageStrategy === 'interval'">* 间隔模式：每隔 {{ form.storageInterval || 1 }} 分钟，自动保存一次当前所有点位的快照数据。</div>
                                        </div>
                                    </v-card-text>
                                </v-card>
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

        <!-- History Dialog -->
        <v-dialog v-model="historyDialog" max-width="900px" persistent>
            <v-card>
                <v-card-title class="d-flex align-center">
                    历史数据 - {{ historyDevice?.name }}
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-close" variant="text" @click="historyDialog = false"></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-row align="center" class="mb-2">
                        <v-col cols="12" sm="3">
                             <v-select
                                v-model="historyMode"
                                :items="[{title: '最近记录', value: 'limit'}, {title: '时间范围', value: 'range'}]"
                                label="查询模式"
                                density="compact"
                                hide-details
                             ></v-select>
                        </v-col>
                        <v-col cols="12" sm="3" v-if="historyMode === 'limit'">
                             <v-text-field
                                v-model.number="historyLimit"
                                label="记录数量"
                                type="number"
                                density="compact"
                                hide-details
                             ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" v-if="historyMode === 'range'">
                            <div class="d-flex align-center">
                                <input 
                                    type="datetime-local" 
                                    v-model="historyDateRange[0]"
                                    class="border rounded px-2 py-1 mr-2"
                                    style="width: 100%"
                                />
                                <span class="mx-2">-</span>
                                <input 
                                    type="datetime-local" 
                                    v-model="historyDateRange[1]"
                                    class="border rounded px-2 py-1"
                                    style="width: 100%"
                                />
                            </div>
                        </v-col>
                        <v-col cols="12" sm="3" class="d-flex">
                            <v-btn color="primary" @click="fetchHistory" :loading="historyLoading" class="mr-2">查询</v-btn>
                            <v-btn color="secondary" prepend-icon="mdi-download" @click="downloadHistoryCSV" :disabled="historyData.length === 0">导出 CSV</v-btn>
                        </v-col>
                    </v-row>
                    
                    <v-data-table
                        :headers="historyHeaders"
                        :items="historyData"
                        :loading="historyLoading"
                        density="compact"
                        class="elevation-1"
                    >
                        <template v-slot:item="{ item }">
                            <tr>
                                <td>{{ formatHistoryTime(item.ts) }}</td>
                                <td 
                                    v-for="header in historyHeaders.slice(1)" 
                                    :key="header.key"
                                    class="truncate-cell"
                                    @click="showDetails(header.title, getHistoryValue(item, header.key))"
                                    :title="getHistoryValue(item, header.key)"
                                >
                                    {{ getHistoryValue(item, header.key) }}
                                </td>
                            </tr>
                        </template>
                        <template v-slot:no-data>
                            <div class="text-center pa-4">暂无数据</div>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Details Dialog -->
        <v-dialog v-model="detailsDialog" max-width="800px">
            <v-card>
                <v-card-title>
                    {{ detailsTitle }}
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
                            <div class="text-body-2 mb-2 text-grey">内容长度: {{ detailsContent.length }}</div>
                            <v-textarea
                                v-model="detailsContent"
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
                    <v-btn color="secondary" variant="text" prepend-icon="mdi-code-tags" @click="tryBase64Decode">
                        尝试 Base64 解码
                    </v-btn>
                    <v-btn color="primary" variant="text" @click="detailsDialog = false">关闭</v-btn>
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

        <!-- Scan Dialog -->
        <v-dialog v-model="scanDialog" max-width="900px" persistent>
            <v-card>
                <v-card-title class="d-flex align-center">
                    扫描设备
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-close" variant="text" @click="scanDialog = false"></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-row class="mb-2" align="center">
                        <v-col cols="12" sm="8">
                            <div class="text-caption text-grey">
                                点击“开始扫描”以发现网络中的设备。扫描可能需要几秒钟。
                            </div>
                        </v-col>
                        <v-col cols="12" sm="4" class="text-right">
                            <v-btn color="primary" :loading="isScanning" prepend-icon="mdi-radar" @click="scanDevices">
                                开始扫描
                            </v-btn>
                        </v-col>
                    </v-row>
                    
                    <v-divider class="mb-4"></v-divider>
                    
                    <v-table hover>
                        <thead>
                            <tr>
                                <th style="width: 50px">
                                    <v-checkbox-btn
                                        v-model="selectAllScan"
                                        @update:model-value="toggleSelectAllScan"
                                    ></v-checkbox-btn>
                                </th>
                                <th class="text-left">Device ID</th>
                                <th class="text-left">IP 地址</th>
                                <th class="text-left">端口</th>
                                <th class="text-left">厂商</th>
                                <th class="text-left">型号</th>
                                <th class="text-left">对象名称</th>
                                <th class="text-left">标记</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="scanResults.length === 0 && !isScanning">
                                <td colspan="8" class="text-center text-grey py-4">暂无扫描结果</td>
                            </tr>
                            <tr v-for="dev in scanResults" :key="dev.device_id">
                                <td>
                                    <v-checkbox-btn
                                        v-model="selectedScanDevices"
                                        :value="dev"
                                        :disabled="dev.diff_status === 'existing'"
                                    ></v-checkbox-btn>
                                </td>
                                <td>{{ dev.device_id }}</td>
                                <td>{{ dev.ip }}</td>
                                <td>{{ dev.port }}</td>
                                <td>{{ dev.vendor_name }}</td>
                                <td>{{ dev.model_name }}</td>
                                <td>{{ dev.object_name }}</td>
                                <td>
                                    <v-chip v-if="dev.diff_status === 'new'" size="small" color="success" variant="flat" class="mr-1">New</v-chip>
                                    <v-chip v-else-if="dev.diff_status === 'existing'" size="small" color="warning" variant="flat" class="mr-1">Existing</v-chip>
                                    <v-chip v-else-if="dev.diff_status === 'removed'" size="small" color="error" variant="flat" class="mr-1">Removed</v-chip>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="scanDialog = false">取消</v-btn>
                    <v-btn 
                        color="primary" 
                        @click="addSelectedDevices" 
                        :disabled="selectedScanDevices.length === 0 || isAddingDevices"
                        :loading="isAddingDevices"
                    >
                        添加选定设备 ({{ selectedScanDevices.length }})
                    </v-btn>
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
import { base64ToUint8Array, uint8ArrayToHex, detectFileType, downloadBytes } from '@/utils/decode'

const route = useRoute()
const router = useRouter()
const devices = ref([])
const channelInfo = ref(null)
const loading = ref(false)
const channelId = route.params.channelId
const channelProtocol = computed(() => channelInfo.value?.protocol || '')

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
    modbusSlaveId: 1,
    bacnetDeviceInstance: 0,
    bacnetIp: '',
    bacnetPort: 47808,
    // Config object for direct binding (OPC UA etc)
    config: {},
    // Storage
    storageEnable: false,
    storageStrategy: 'interval',
    storageInterval: 1,
    storageMaxRecords: 1000
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
        const storage = item.storage || {}
        form.value = {
            ...item,
            config: config, // Ensure config is referenceable
            configStr: JSON.stringify(config, null, 2),
            dlt645Address: config.station_address || config.address || '',
            modbusSlaveId: config.slave_id || 1,
            bacnetDeviceInstance: config.device_id || 0,
            bacnetIp: config.ip || '',
            bacnetPort: config.port || 47808,
            // Storage
            storageEnable: storage.enable || false,
            storageStrategy: storage.strategy || 'interval',
            storageInterval: storage.interval || 1,
            storageMaxRecords: storage.max_records || 1000
        }
    } else {
        isEdit.value = false
        form.value = { ...defaultForm }
        // Set defaults for OPC UA
        if (channelProtocol.value === 'opc-ua') {
             form.value.config = {
                 endpoint: 'opc.tcp://127.0.0.1:4840',
                 security_policy: 'None',
                 security_mode: 'None',
                 auth_method: 'Anonymous'
             }
        }
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
    } else if (channelProtocol.value && channelProtocol.value.includes('modbus')) {
        config.slave_id = form.value.modbusSlaveId
    } else if (channelProtocol.value === 'bacnet-ip') {
        config.device_id = form.value.bacnetDeviceInstance
        if (form.value.bacnetIp) config.ip = form.value.bacnetIp
        if (form.value.bacnetPort) config.port = form.value.bacnetPort
    } else if (channelProtocol.value === 'opc-ua') {
        // Merge OPC UA specific fields from form.config
        Object.assign(config, form.value.config)
    }

    const payload = {
        id: form.value.id,
        name: form.value.name,
        interval: form.value.interval,
        enable: form.value.enable,
        config: config,
        storage: {
            enable: form.value.storageEnable,
            strategy: form.value.storageStrategy,
            interval: form.value.storageInterval,
            max_records: form.value.storageMaxRecords
        },
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

// History Logic
const historyDialog = ref(false)
const historyDevice = ref(null)
const historyLoading = ref(false)
const historyData = ref([])
const historyHeaders = ref([])
const historyDateRange = ref([]) // [start, end]
const historyLimit = ref(100)
const historyMode = ref('limit') // 'limit' or 'range'

const openHistoryDialog = (device) => {
    historyDevice.value = device
    historyDialog.value = true
    historyData.value = []
    historyHeaders.value = []
    historyMode.value = 'limit'
    historyLimit.value = 100
    // Default date range: last 24 hours
    const end = new Date()
    const start = new Date(end.getTime() - 24 * 60 * 60 * 1000)
    // Format to YYYY-MM-DD HH:mm:ss for input type="datetime-local" needs YYYY-MM-DDTHH:mm
    // But simple strings are easier for now if using custom picker or text fields
    // Let's use simple text inputs or Date constructor for now.
    // For simplicity in this iteration, we use YYYY-MM-DD HH:mm:ss strings
    
    // Using Vuetify or standard inputs? Let's use standard inputs for datetime
    // Format to ISO string for datetime-local: YYYY-MM-DDTHH:mm
    const toLocalISO = (d) => {
        const offset = d.getTimezoneOffset() * 60000
        return new Date(d.getTime() - offset).toISOString().slice(0, 16)
    }
    
    historyDateRange.value = [toLocalISO(start), toLocalISO(end)]
    
    fetchHistory()
}

const fetchHistory = async () => {
    historyLoading.value = true
    historyData.value = []
    historyHeaders.value = []
    try {
        let url = `/api/devices/${historyDevice.value.id}/history`
        if (historyMode.value === 'range') {
            // Append :ss to match RFC3339 or our backend parser
            const start = historyDateRange.value[0] + ':00'
            const end = historyDateRange.value[1] + ':00'
            url += `?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
        } else {
            url += `?limit=${historyLimit.value}`
        }
        
        const res = await request.get(url, { timeout: 60000 })
        historyData.value = res || []
        
        // Dynamic Headers
        if (historyData.value.length > 0) {
            const keys = new Set()
            historyData.value.forEach(row => {
                if (row.data) {
                    Object.keys(row.data).forEach(k => keys.add(k))
                }
            })
            
            const headers = [
                { title: '时间', key: 'ts', width: '180px' },
                ...Array.from(keys).sort().map(k => ({ title: k, key: `data.${k}` }))
            ]
            historyHeaders.value = headers
        }
    } catch (e) {
        showMessage('获取历史数据失败: ' + e.message, 'error')
    } finally {
        historyLoading.value = false
    }
}

const formatHistoryTime = (ts) => {
    return new Date(ts * 1000).toLocaleString()
}

const downloadHistoryCSV = () => {
    if (historyData.value.length === 0) {
        showMessage('无数据可导出', 'warning')
        return
    }
    
    const headers = historyHeaders.value.map(h => h.title)
    const keys = historyHeaders.value.map(h => h.key)
    
    const rows = historyData.value.map(row => {
        return keys.map(key => {
            if (key === 'ts') return formatHistoryTime(row.ts)
            // Handle nested data.key
            const prop = key.split('.')[1]
            return row.data ? (row.data[prop] ?? '') : ''
        })
    })
    
    const csvContent = [
        headers.join(','),
        ...rows.map(r => r.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${historyDevice.value.name}_history_${new Date().toISOString().slice(0,10)}.csv`
    link.click()
}

const goToPoints = (device) => {
    router.push(`/channels/${channelId}/devices/${device.id}/points`)
}

// Details Logic
const detailsDialog = ref(false)
const detailsTitle = ref('')
const detailsContent = ref('')
const detailsTab = ref('text')
const decodedHex = ref('')
const detectedFile = ref(null)
const decodedBytes = ref(null)

const showDetails = (title, content) => {
    detailsTitle.value = title
    detailsContent.value = String(content)
    detailsDialog.value = true
    
    // Reset state
    detailsTab.value = 'text'
    decodedHex.value = ''
    detectedFile.value = null
    decodedBytes.value = null
}

const tryBase64Decode = () => {
    try {
        const bytes = base64ToUint8Array(detailsContent.value)
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

const getHistoryValue = (item, key) => {
    // key is 'data.prop'
    if (key.startsWith('data.')) {
        const prop = key.split('.')[1]
        return item.data ? (item.data[prop] ?? '') : ''
    }
    return ''
}

// Scan Logic
const scanDialog = ref(false)
const isScanning = ref(false)
const scanResults = ref([])
const selectedScanDevices = ref([])
const selectAllScan = ref(false)
const isAddingDevices = ref(false)
const interfaces = ref([])
const scanInterface = ref(null)

const fetchInterfaces = async () => {
    try {
        const res = await request.get('/api/system/network/interfaces')
        interfaces.value = res || []
    } catch (e) {
        console.error('Failed to fetch interfaces', e)
    }
}

const openScanDialog = () => {
    scanDialog.value = true
    scanResults.value = []
    selectedScanDevices.value = []
    selectAllScan.value = false
    
    // Default to channel configured IP if available
    const configuredIP = channelInfo.value?.config?.ip
    if (configuredIP && configuredIP !== '0.0.0.0') {
        scanInterface.value = configuredIP
    } else {
        scanInterface.value = null
    }
    
    fetchInterfaces()
}

const scanDevices = async () => {
    isScanning.value = true
    scanResults.value = []
    selectedScanDevices.value = []
    try {
        const payload = {}
        if (scanInterface.value) {
            payload.interface_ip = scanInterface.value
        }
        
        const res = await request.post(`/api/channels/${channelId}/scan`, payload, { timeout: 30000 })
        if (Array.isArray(res)) {
            scanResults.value = res
        } else {
            scanResults.value = []
            showMessage('扫描结果格式错误', 'error')
        }
    } catch (e) {
        showMessage('扫描失败: ' + e.message, 'error')
    } finally {
        isScanning.value = false
    }
}

const toggleSelectAllScan = (val) => {
    if (val) {
        selectedScanDevices.value = [...scanResults.value]
    } else {
        selectedScanDevices.value = []
    }
}

const addSelectedDevices = async () => {
    if (selectedScanDevices.value.length === 0) return
    
    isAddingDevices.value = true
    let successCount = 0
    let failCount = 0
    
    for (const dev of selectedScanDevices.value) {
        const payload = {
            name: (dev.model_name || 'Device') + '_' + dev.device_id,
            enable: true,
            interval: '5s',
            config: {
                device_id: dev.device_id,
                ip: dev.ip,
                port: dev.port,
                vendor_name: dev.vendor_name,
                model_name: dev.model_name,
                object_name: dev.object_name,
                network_number: dev.network_number,
                vendor_id: dev.vendor_id
            },
            points: []
        }
        
        try {
            await request.post(`/api/channels/${channelId}/devices`, payload)
            successCount++
        } catch (e) {
            console.error(e)
            failCount++
        }
    }
    
    isAddingDevices.value = false
    showMessage(`已添加 ${successCount} 个设备${failCount > 0 ? `，${failCount} 个失败` : ''}`, failCount > 0 ? 'warning' : 'success')
    scanDialog.value = false
    fetchDevices()
}

onMounted(() => {
    fetchDevices()
    fetchRules()
})
</script>

<style scoped>
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
