<template>
    <div>
        <div class="d-flex justify-end align-center mb-6">
            <v-btn-toggle
                v-model="viewMode"
                mandatory
                density="compact"
                class="mr-4"
                color="primary"
                variant="outlined"
                divided
            >
                <v-btn value="card" icon="mdi-view-grid" size="small"></v-btn>
                <v-btn value="list" icon="mdi-view-list" size="small"></v-btn>
            </v-btn-toggle>

            <v-btn 
                v-if="selectionMode && selectedChannels.length > 0"
                color="warning" 
                prepend-icon="mdi-cog" 
                variant="outlined" 
                class="mr-2"
                @click="openBatchConfig"
            >
                批量配置
            </v-btn>
            <v-btn 
                :color="selectionMode ? 'grey' : 'secondary'" 
                :prepend-icon="selectionMode ? 'mdi-close' : 'mdi-checkbox-multiple-marked'" 
                variant="outlined" 
                class="mr-2"
                @click="toggleSelectionMode"
            >
                {{ selectionMode ? '取消选择' : '批量操作' }}
            </v-btn>
            <v-btn 
                color="primary" 
                prepend-icon="mdi-refresh" 
                variant="outlined" 
                @click="fetchChannels"
                :loading="loading"
                class="mr-2"
            >
                刷新
            </v-btn>
            <v-btn 
                color="secondary" 
                prepend-icon="mdi-plus" 
                variant="outlined" 
                @click="openAddDialog"
            >
                添加通道
            </v-btn>
        </div>
        
        <div v-if="loading && channels.length === 0" class="d-flex justify-center mt-12">
            <v-progress-circular indeterminate color="white" size="64"></v-progress-circular>
        </div>

        <div v-else-if="channels.length > 0">
            <v-row v-if="viewMode === 'card'">
                <v-col 
                    v-for="channel in channels" 
                    :key="channel.id" 
                    cols="12" sm="6" md="6" lg="6"
                >
                    <v-card class="glass-card pa-4 h-100" :class="{'selected-border': isSelected(channel.id)}" v-ripple>
                        <!-- <div v-if="selectionMode" class="selection-overlay" @click="toggleChannelSelection(channel.id)">
                            <v-checkbox-btn
                                :model-value="isSelected(channel.id)"
                                color="primary"
                                class="ma-0"
                            ></v-checkbox-btn>
                        </div> -->
                        <div class="d-flex flex-column h-100 justify-space-between">
                            <div @click="handleCardClick(channel)" style="cursor: pointer">
                                <div class="d-flex justify-space-between align-start">
                                    <div class="channel-icon text-primary">
                                        <v-icon icon="mdi-lan-connect" size="large"></v-icon>
                                    </div>
                                    <div>
                                        <v-chip size="small" :color="channel.enable ? 'success' : 'grey'">
                                            {{ channel.enable ? '启用' : '禁用' }}
                                        </v-chip>
                                        <v-chip v-if="channel.runtime" size="small" class="ml-1" :color="getRuntimeColor(channel.runtime.state)">
                                            {{ getRuntimeText(channel.runtime.state) }}
                                        </v-chip>
                                    </div>
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
                                    <v-btn size="small" icon="mdi-chart-line" variant="text" color="success" @click.stop="openMetricsDialog(channel)" title="监控指标"></v-btn>
                                    <v-btn size="small" icon="mdi-pencil" variant="text" color="primary" @click.stop="openEditDialog(channel)" title="编辑"></v-btn>
                                    <v-btn size="small" icon="mdi-radar" variant="text" color="info" v-if="channel.protocol === 'bacnet-ip'" @click.stop="scanChannel(channel)" title="扫描设备"></v-btn>
                                    <v-btn size="small" icon="mdi-delete" variant="text" color="error" @click.stop="deleteChannel(channel)" title="删除"></v-btn>
                                </div>
                            </div>
                        </div>
                    </v-card>
                </v-col>
            </v-row>

            <v-data-table
                v-else
                v-model="selectedChannels"
                :headers="listHeaders"
                :items="channels"
                item-value="id"
                :show-select="selectionMode"
                hover
            >
                <template v-slot:item.name="{ item }">
                    <div class="font-weight-medium cursor-pointer text-primary" @click="goToDevices(item)">
                        {{ item.name }}
                    </div>
                </template>
                <template v-slot:item.enable="{ item }">
                     <v-chip size="small" :color="item.enable ? 'success' : 'grey'">
                        {{ item.enable ? '启用' : '禁用' }}
                    </v-chip>
                </template>
                <template v-slot:item.runtime.state="{ item }">
                    <v-chip v-if="item.runtime" size="small" :color="getRuntimeColor(item.runtime.state)">
                        {{ getRuntimeText(item.runtime.state) }}
                    </v-chip>
                    <span v-else class="text-grey text-caption">未知</span>
                </template>
                <template v-slot:item.actions="{ item }">
                    <div class="d-flex justify-end">
                        <v-btn size="small" icon="mdi-chart-line" variant="text" color="success" @click.stop="openMetricsDialog(item)" title="监控指标"></v-btn>
                        <v-btn size="small" icon="mdi-pencil" variant="text" color="primary" @click.stop="openEditDialog(item)" title="编辑"></v-btn>
                        <v-btn size="small" icon="mdi-radar" variant="text" color="info" v-if="item.protocol === 'bacnet-ip'" @click.stop="scanChannel(item)" title="扫描设备"></v-btn>
                        <v-btn size="small" icon="mdi-delete" variant="text" color="error" @click.stop="deleteChannel(item)" title="删除"></v-btn>
                    </div>
                </template>
            </v-data-table>
        </div>
        <div v-else class="text-center mt-12">
            <v-icon icon="mdi-lan-disconnect" size="100" color="white" style="opacity: 0.5"></v-icon>
            <div class="text-h5 text-white mt-4">没有采集通道</div>
        </div>

        <!-- Add/Edit Dialog -->
        <v-dialog v-model="dialog.show" max-width="900px">
            <v-card>
                <v-card-title class="d-flex align-center">
                    <span class="text-h5">{{ dialog.isEdit ? '编辑通道' : '添加通道' }}</span>
                    <v-btn icon="mdi-help-circle-outline" variant="text" color="info" size="small" class="ml-2" @click="showHelp = true" v-if="!dialog.isEdit">
                        <v-tooltip activator="parent" location="right">查看帮助说明</v-tooltip>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field 
                                    v-model="dialog.form.id" 
                                    label="ID" 
                                    :disabled="dialog.isEdit" 
                                    required
                                    :rules="idRules"
                                    :append-inner-icon="!dialog.isEdit ? 'mdi-refresh' : undefined"
                                    @click:append-inner="generateId"
                                    title="点击自动生成随机ID"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field 
                                    v-model="dialog.form.name" 
                                    label="名称" 
                                    required
                                    hint="给通道起一个易于识别的名称"
                                    persistent-hint
                                ></v-text-field>
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

                                <v-divider class="my-4"></v-divider>
                                <div class="text-subtitle-2 mb-2 text-grey-darken-1">高级配置</div>
                                <v-row dense>
                                    <v-col cols="6">
                                        <v-text-field
                                            v-model.number="dialog.form.config.max_retries"
                                            label="最大重试次数"
                                            type="number"
                                            placeholder="3"
                                            hint="默认 3 次"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            v-model.number="dialog.form.config.retry_interval"
                                            label="重试间隔 (ms)"
                                            type="number"
                                            placeholder="100"
                                            hint="默认 100ms"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            v-model.number="dialog.form.config.instruction_interval"
                                            label="指令间隔 (ms)"
                                            type="number"
                                            placeholder="10"
                                            hint="默认 10ms"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                         <v-select
                                            v-model.number="dialog.form.config.start_address"
                                            :items="[{title:'0 (40000)', value: 0}, {title:'1 (40001)', value: 1}]"
                                            label="起始地址"
                                            hint="默认 1 (40001)"
                                            persistent-hint
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-select
                                            v-model="dialog.form.config.byte_order_4"
                                            :items="['ABCD', 'CDAB', 'BADC', 'DCBA']"
                                            label="4字节字节序"
                                            hint="默认 ABCD (Big Endian)"
                                            persistent-hint
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12">
                                        <div class="d-flex align-center justify-space-between">
                                            <v-switch
                                                v-model="dialog.form.config.enableSmartProbe"
                                                label="启用智能地址探测"
                                                color="primary"
                                                hide-details
                                            ></v-switch>
                                            <div class="d-flex gap-2">
                                                <v-btn
                                                    icon="mdi-help-circle"
                                                    size="small"
                                                    variant="text"
                                                    color="primary"
                                                    @click="openSmartProbeHelp"
                                                ></v-btn>
                                            </div>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" v-if="dialog.form.config.enableSmartProbe">
                                        <v-divider class="my-2"></v-divider>
                                        <div class="text-subtitle-2 mb-2 text-grey-darken-1">智能探测配置</div>
                                        <v-row dense>
                                            <v-col cols="6">
                                                <v-text-field
                                                    v-model.number="dialog.form.config.probeMaxDepth"
                                                    label="探测深度"
                                                    type="number"
                                                    placeholder="6"
                                                    hint="默认 6 层"
                                                    persistent-hint
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-text-field
                                                    v-model.number="dialog.form.config.probeTimeout"
                                                    label="探测超时 (ms)"
                                                    type="number"
                                                    placeholder="3000"
                                                    hint="默认 3000ms"
                                                    persistent-hint
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-text-field
                                                    v-model.number="dialog.form.config.probeMaxConsecutive"
                                                    label="最大连续失败"
                                                    type="number"
                                                    placeholder="20"
                                                    hint="默认 20 次"
                                                    persistent-hint
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-switch
                                                    v-model="dialog.form.config.probeEnableMTU"
                                                    label="启用MTU探测"
                                                    color="primary"
                                                    hide-details
                                                ></v-switch>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" v-if="dialog.form.protocol === 'dlt645'">
                                <v-select
                                    v-model="dialog.form.config.connectionType"
                                    :items="[{title:'串口 (Serial)', value:'serial'}, {title:'网络 (TCP)', value:'tcp'}]"
                                    label="连接方式"
                                    item-title="title"
                                    item-value="value"
                                ></v-select>
                            </v-col>
                            <v-col cols="12" v-if="dialog.form.protocol === 'dlt645' && dialog.form.config.connectionType === 'tcp'">
                                <v-text-field v-model="dialog.form.config.ip" label="设备 IP 地址" placeholder="192.168.1.100"></v-text-field>
                                <v-text-field v-model.number="dialog.form.config.port" label="端口" placeholder="8001" type="number"></v-text-field>
                                <v-text-field 
                                    v-model.number="dialog.form.config.timeout" 
                                    label="超时时间 (ms)" 
                                    type="number" 
                                    placeholder="2000"
                                    hint="默认为 2000ms"
                                    persistent-hint
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" v-if="dialog.form.protocol === 'modbus-rtu' || (dialog.form.protocol === 'dlt645' && dialog.form.config.connectionType === 'serial')">
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

                                <template v-if="dialog.form.protocol === 'modbus-rtu'">
                                    <v-divider class="my-4"></v-divider>
                                    <div class="text-subtitle-2 mb-2 text-grey-darken-1">高级配置</div>
                                    <v-row dense>
                                        <v-col cols="6">
                                            <v-text-field
                                                v-model.number="dialog.form.config.max_retries"
                                                label="最大重试次数"
                                                type="number"
                                                placeholder="3"
                                                hint="默认 3 次"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                v-model.number="dialog.form.config.retry_interval"
                                                label="重试间隔 (ms)"
                                                type="number"
                                                placeholder="100"
                                                hint="默认 100ms"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                v-model.number="dialog.form.config.instruction_interval"
                                                label="指令间隔 (ms)"
                                                type="number"
                                                placeholder="10"
                                                hint="默认 10ms"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-select
                                                v-model.number="dialog.form.config.start_address"
                                                :items="[{title:'0 (40000)', value: 0}, {title:'1 (40001)', value: 1}]"
                                                label="起始地址"
                                                hint="默认 1 (40001)"
                                                persistent-hint
                                            ></v-select>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-select
                                                v-model="dialog.form.config.byte_order_4"
                                                :items="['ABCD', 'CDAB', 'BADC', 'DCBA']"
                                                label="4字节字节序"
                                                hint="默认 ABCD (Big Endian)"
                                                persistent-hint
                                            ></v-select>
                                        </v-col>
                                    </v-row>
                                </template>
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
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" variant="outlined" @click="dialog.show = false">取消</v-btn>
                    <v-btn color="primary" variant="outlined" @click="saveChannel">保存</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Batch Config Dialog -->
        <v-dialog v-model="batchConfigDialog.show" max-width="900px">
            <v-card>
                <v-card-title>批量配置 (已选 {{ selectedChannels.length }} 个)</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" class="d-flex align-center">
                            <v-checkbox v-model="batchConfigDialog.fields.enable" hide-details class="mr-2"></v-checkbox>
                            <v-switch v-model="batchConfigDialog.values.enable" label="启用/禁用" hide-details color="primary" :disabled="!batchConfigDialog.fields.enable"></v-switch>
                        </v-col>
                        <v-col cols="12" class="d-flex align-center">
                            <v-checkbox v-model="batchConfigDialog.fields.timeout" hide-details class="mr-2"></v-checkbox>
                            <v-text-field v-model.number="batchConfigDialog.values.timeout" label="超时时间 (ms)" type="number" hide-details :disabled="!batchConfigDialog.fields.timeout"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="d-flex align-center">
                            <v-checkbox v-model="batchConfigDialog.fields.baudRate" hide-details class="mr-2"></v-checkbox>
                            <v-select 
                                v-model.number="batchConfigDialog.values.baudRate" 
                                :items="[1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200]" 
                                label="波特率 (仅串口)" 
                                hide-details 
                                :disabled="!batchConfigDialog.fields.baudRate"
                            ></v-select>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" variant="outlined" @click="batchConfigDialog.show = false">取消</v-btn>
                    <v-btn color="primary" variant="outlined" @click="performBatchConfig">应用</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Scan Dialog -->
        <v-dialog v-model="scanDialog.show" max-width="1200px">
            <v-card>
                <v-card-title class="d-flex justify-space-between align-center">
                    <span>BACnet 设备扫描 - {{ scanDialog.channelName }}</span>
                    <v-btn color="primary" size="small" variant="text" @click="openManualAdd">手动添加</v-btn>
                </v-card-title>
                <v-card-text>
                    <div v-if="scanDialog.loading" class="d-flex justify-center my-4">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </div>
                    <div v-else>
                        <v-data-table
                            v-model="scanDialog.selected"
                            :headers="[
                                { title: '设备名称', key: 'name', width: '20%' },
                                { title: '设备 ID', key: 'device_id', width: '10%' },
                                { title: 'IP 地址', key: 'ip', width: '15%' },
                                { title: '网络号', key: 'network_number', width: '10%' },
                                { title: 'MAC', key: 'mac_address', width: '15%' },
                                { title: '包含对象数', key: 'object_count', value: item => item.objects ? item.objects.length : 0, width: '10%' },
                                { title: '厂商', key: 'vendor_name', width: '20%' }
                            ]"
                            :items="scanDialog.results"
                            show-select
                            return-object
                            item-value="device_id"
                            density="compact"
                        >
                            <template v-slot:item.name="{ item }">
                                <div class="text-truncate" style="max-width: 200px;" :title="item.name">
                                    {{ item.name }}
                                </div>
                            </template>
                            <template v-slot:item.vendor_name="{ item }">
                                <div class="text-truncate" style="max-width: 200px;" :title="item.vendor_name">
                                    {{ item.vendor_name }}
                                </div>
                            </template>
                            <template v-slot:no-data>
                                <div class="text-center">未扫描到设备</div>
                            </template>
                        </v-data-table>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" variant="outlined" @click="scanDialog.show = false">取消</v-btn>
                    <v-btn color="primary" variant="outlined" @click="saveScannedDevices" :disabled="scanDialog.selected.length === 0">导入所选设备</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Help Dialog -->
        <v-dialog v-model="showHelp" max-width="900px">
            <v-card>
                <v-card-title>采集通道帮助说明</v-card-title>
                <v-card-text>
                    <p class="mb-2">采集通道用于定义与物理设备或子系统的连接方式。配置时请注意以下几点：</p>
                    <ul class="ml-4 mb-2">
                        <li><strong>ID:</strong> 通道的唯一标识符。系统支持自动生成16位随机字符，您也可以手动输入（仅限字母、数字、下划线和横杠）。ID一旦创建不可修改。</li>
                        <li><strong>名称:</strong> 为通道起一个易于识别的名称，方便在列表中查看。</li>
                        <li><strong>协议:</strong> 选择设备支持的通信协议（如 Modbus, BACnet, OPC UA 等）。不同协议会有不同的配置项。</li>
                        <li><strong>启用:</strong> 只有启用的通道才会进行数据采集。</li>
                    </ul>
                    <p>如果遇到连接问题，请检查 IP、端口以及防火墙设置。</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="outlined" @click="showHelp = false">关闭</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Metrics Dialog -->
        <v-dialog v-model="metricsDialog.show" max-width="1080px">
            <v-card>
                <v-card-title class="d-flex align-center">
                    <v-icon color="primary" class="mr-2">mdi-chart-line</v-icon>
                    通道监控指标 - {{ metricsDialog.channel?.name }}
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-close" variant="text" @click="metricsDialog.show = false"></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <!-- 左侧：质量评分 -->
                        <v-col cols="12" md="4">
                            <div class="text-center mb-4">
                                <v-progress-circular
                                    :model-value="metricsDialog.qualityScore"
                                    :color="getQualityColor(metricsDialog.qualityScore)"
                                    :size="180"
                                    :width="12"
                                >
                                    <div class="text-center">
                                        <div class="text-h2 font-weight-bold">{{ metricsDialog.qualityScore }}</div>
                                        <div class="text-subtitle-2 mb-1">质量评分</div>
                                        <v-chip 
                                            :color="getQualityColor(metricsDialog.qualityScore)" 
                                            variant="flat" 
                                            size="small"
                                        >
                                            {{ getQualityLabel(metricsDialog.qualityScore) }}
                                        </v-chip>
                                    </div>
                                </v-progress-circular>
                            </div>
                            
                            <!-- 连接信息 -->
                            <v-list density="compact" class="bg-transparent">
                                <v-list-item>
                                    <template v-slot:prepend>
                                        <v-icon size="small">mdi-protocol</v-icon>
                                    </template>
                                    <v-list-item-title>协议</v-list-item-title>
                                    <v-list-item-subtitle>{{ metricsDialog.metrics?.protocol || metricsDialog.channel?.protocol }}</v-list-item-subtitle>
                                </v-list-item>
                                
                                <!-- 连接详情 (优先使用监控指标中的地址) -->
                                <v-list-item v-if="metricsDialog.metrics?.remoteAddr || getConnectionUrl(metricsDialog.channel)">
                                    <template v-slot:prepend>
                                        <v-icon size="small">mdi-lan-connect</v-icon>
                                    </template>
                                    <v-list-item-title>连接地址</v-list-item-title>
                                    <v-list-item-subtitle>{{ metricsDialog.metrics?.remoteAddr || getConnectionUrl(metricsDialog.channel) }}</v-list-item-subtitle>
                                </v-list-item>
                                
                                <v-list-item v-if="metricsDialog.channel?.config?.slave_id !== undefined">
                                    <template v-slot:prepend>
                                        <v-icon size="small">mdi-numeric</v-icon>
                                    </template>
                                    <v-list-item-title>从机 ID</v-list-item-title>
                                    <v-list-item-subtitle>{{ metricsDialog.channel.config.slave_id }}</v-list-item-subtitle>
                                </v-list-item>

                                <!-- 串口参数 (RTU) -->
                                <template v-if="isSerialProtocol(metricsDialog.channel)">
                                    <v-list-item>
                                        <template v-slot:prepend>
                                            <v-icon size="small">mdi-serial-port</v-icon>
                                        </template>
                                        <v-list-item-title>串口</v-list-item-title>
                                        <v-list-item-subtitle>{{ metricsDialog.channel?.config?.port || '-' }}</v-list-item-subtitle>
                                    </v-list-item>
                                    <v-list-item>
                                        <template v-slot:prepend>
                                            <v-icon size="small">mdi-speedometer</v-icon>
                                        </template>
                                        <v-list-item-title>波特率</v-list-item-title>
                                        <v-list-item-subtitle>{{ metricsDialog.channel?.config?.baudRate || 9600 }}</v-list-item-subtitle>
                                    </v-list-item>
                                </template>
                                
                                <!-- TCP/Network metrics -->
            <template>
                <v-divider class="my-2"></v-divider>
                
                <v-list-item v-if="metricsDialog.metrics?.localAddr || metricsDialog.metrics?.remoteAddr">
                      <template v-slot:prepend>
                          <v-icon size="small">mdi-ethernet</v-icon>
                      </template>
                      <v-list-item-title>链接信息</v-list-item-title>
                      <v-list-item-subtitle>
                          {{ metricsDialog.metrics.localAddr || '未知' }} 
                          <v-icon size="x-small" class="mx-1">mdi-arrow-right</v-icon>
                          {{ (metricsDialog.metrics.remoteAddr || '').replace('tcp://', '') || '未知' }}
                      </v-list-item-subtitle>
                  </v-list-item>
                
                <v-list-item>
                    <template v-slot:prepend>
                        <v-icon size="small">mdi-clock-outline</v-icon>
                    </template>
                    <v-list-item-title>连接时长</v-list-item-title>
                    <v-list-item-subtitle>{{ formatDuration(metricsDialog.metrics?.connectionSeconds) }}</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item v-if="metricsDialog.metrics?.lastDisconnectTime && metricsDialog.metrics.lastDisconnectTime !== '0001-01-01T00:00:00Z'">
                    <template v-slot:prepend>
                        <v-icon size="small" color="error">mdi-lan-disconnect</v-icon>
                    </template>
                    <v-list-item-title>最后断开</v-list-item-title>
                    <v-list-item-subtitle class="text-error">{{ formatLastDisconnect(metricsDialog.metrics.lastDisconnectTime) }}</v-list-item-subtitle>
                </v-list-item>
            </template>
                                
                                <v-list-item v-if="metricsDialog.metrics?.reconnectCount > 0">
                                    <template v-slot:prepend>
                                        <v-icon size="small" color="warning">mdi-refresh-alert</v-icon>
                                    </template>
                                    <v-list-item-title>重连次数</v-list-item-title>
                                    <v-list-item-subtitle class="text-warning">{{ metricsDialog.metrics?.reconnectCount }}</v-list-item-subtitle>
                                </v-list-item>
                            </v-list>
                        </v-col>
                        
                        <!-- 右侧：详细指标 -->
                        <v-col cols="12" md="8">
                            <v-row>
                                <v-col cols="4" md="4" v-for="stat in metricsDialog.stats" :key="stat.label">
                                    <v-card class="metric-stat-card pa-3 text-center" :color="stat.color" variant="tonal">
                                        <div class="text-caption text-grey-darken-1">{{ stat.label }}</div>
                                        <div class="text-h5 font-weight-bold mt-1">{{ stat.value }}</div>
                                    </v-card>
                                </v-col>
                            </v-row>
                            
                            <!-- 成功率趋势 -->
                            <div class="mt-4">
                                <div class="text-subtitle-2 mb-2 d-flex align-center">
                                    <v-icon size="small" class="mr-1">mdi-trending-up</v-icon>
                                    成功率趋势 (最近1小时)
                                </div>
                                <div class="success-rate-chart" v-if="metricsDialog.trend?.length > 0">
                                    <div 
                                        v-for="(point, idx) in metricsDialog.trend" 
                                        :key="idx"
                                        class="chart-bar"
                                        :style="{ 
                                            height: `${point.rate * 100}%`,
                                            backgroundColor: getTrendColor(point.rate)
                                        }"
                                        :title="`${formatTime(point.time)}: ${(point.rate * 100).toFixed(1)}%`"
                                    ></div>
                                </div>
                                <v-alert v-else type="info" variant="tonal" density="compact">
                                    暂无趋势数据
                                </v-alert>
                            </div>
                            
                            <!-- 最近异常 -->
                            <div class="mt-4" v-if="metricsDialog.recentErrors?.length > 0">
                                <div class="text-subtitle-2 mb-2 d-flex align-center">
                                    <v-icon size="small" color="error" class="mr-1">mdi-alert-circle-outline</v-icon>
                                    最近异常
                                </div>
                                <v-timeline density="compact" side="end">
                                    <v-timeline-item
                                        v-for="(error, idx) in metricsDialog.recentErrors.slice(0, 5)"
                                        :key="idx"
                                        :dot-color="getErrorColor(error.type)"
                                        size="small"
                                    >
                                        <div class="d-flex justify-space-between">
                                            <span class="text-body-2">{{ error.message }}</span>
                                            <span class="text-caption text-grey">{{ formatTime(error.time) }}</span>
                                        </div>
                                        <div class="text-caption text-grey-darken-1">{{ error.type }}</div>
                                    </v-timeline-item>
                                </v-timeline>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Manual Add Dialog -->
        <v-dialog v-model="manualAddDialog.show" max-width="900px">
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
                    <v-btn color="grey" variant="outlined" @click="manualAddDialog.show = false">取消</v-btn>
                    <v-btn color="primary" variant="outlined" @click="performManualScan">扫描</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Smart Probe Help Dialog -->
        <v-dialog v-model="smartProbeHelpDialog.show" max-width="1000px">
            <v-card>
                <v-card-title class="d-flex align-center">
                    <v-icon color="primary" class="mr-2">mdi-magnify-scan</v-icon>
                    智能地址探测帮助
                </v-card-title>
                <v-card-text>
                    <div class="mb-4">
                        <h3 class="text-h6 font-weight-bold mb-2">什么是智能地址探测？</h3>
                        <p>智能地址探测是一种自动扫描和识别Modbus设备有效寄存器地址的功能，它能够：</p>
                        <ul class="ml-4 mb-2">
                            <li>自动扫描设备的有效寄存器地址范围</li>
                            <li>检测设备的MTU（最大传输单元）大小</li>
                            <li>优化寄存器分组策略，提高读取效率</li>
                            <li>减少手动配置错误，提高系统稳定性</li>
                        </ul>
                    </div>

                    <div class="mb-4">
                        <h3 class="text-h6 font-weight-bold mb-2">工作原理</h3>
                        <div class="ml-4">
                            <h4 class="text-subtitle-2 font-weight-bold mb-1">1. 分层扫描策略</h4>
                            <p class="mb-2">系统采用分层扫描算法，从粗到细逐步定位有效地址：</p>
                            <ul class="ml-4 mb-2">
                                <li><strong>第一层：</strong>按1000地址为间隔进行快速扫描</li>
                                <li><strong>第二层：</strong>对包含有效地址的区间按100地址间隔扫描</li>
                                <li><strong>第三层：</strong>对包含有效地址的区间按10地址间隔扫描</li>
                                <li><strong>第四层：</strong>对包含有效地址的区间进行逐地址扫描</li>
                            </ul>

                            <h4 class="text-subtitle-2 font-weight-bold mb-1">2. MTU检测</h4>
                            <p class="mb-2">系统会自动检测设备的最大传输单元大小，以确定单次可读取的最大寄存器数量，从而优化读取效率。</p>

                            <h4 class="text-subtitle-2 font-weight-bold mb-1">3. 分组优化</h4>
                            <p class="mb-2">扫描完成后，系统会对连续的有效寄存器地址进行分组，生成最优的读取指令序列，减少通信次数。</p>
                        </div>
                    </div>

                    <div class="mb-4">
                        <h3 class="text-h6 font-weight-bold mb-2">配置参数说明</h3>
                        <div class="ml-4">
                            <ul class="ml-4 mb-2">
                                <li><strong>探测深度：</strong>控制扫描的精细程度，默认6层。值越大扫描越精细，但耗时也越长。</li>
                                <li><strong>探测超时：</strong>单次探测的超时时间（毫秒），默认3000ms。</li>
                                <li><strong>最大连续失败：</strong>连续探测失败的最大次数，默认20次。超过此值会停止当前区间的扫描。</li>
                                <li><strong>启用MTU探测：</strong>是否启用MTU自动检测功能，默认开启。</li>
                            </ul>
                        </div>
                    </div>

                    <div class="mb-4">
                        <h3 class="text-h6 font-weight-bold mb-2">最佳实践</h3>
                        <div class="ml-4">
                            <h4 class="text-subtitle-2 font-weight-bold mb-1">使用建议</h4>
                            <ul class="ml-4 mb-2">
                                <li>对于新设备，建议启用智能探测以快速了解设备的寄存器布局</li>
                                <li>对于已知设备，可以禁用智能探测以提高启动速度</li>
                                <li>在网络环境不稳定时，建议适当增加探测超时时间</li>
                                <li>对于大型设备（寄存器数量多），建议使用默认的探测深度</li>
                            </ul>

                            <h4 class="text-subtitle-2 font-weight-bold mb-1">性能优化</h4>
                            <ul class="ml-4 mb-2">
                                <li>合理设置探测深度，平衡扫描精度和耗时</li>
                                <li>启用MTU探测以获得最佳的读取性能</li>
                                <li>对于频繁重启的场景，可以考虑禁用智能探测</li>
                            </ul>

                            <h4 class="text-subtitle-2 font-weight-bold mb-1">常见问题</h4>
                            <ul class="ml-4 mb-2">
                                <li><strong>扫描速度慢：</strong>可能是网络延迟高或设备响应慢，建议增加探测超时时间</li>
                                <li><strong>扫描不完整：</strong>可能是探测深度不足，建议增加探测深度值</li>
                                <li><strong>误报有效地址：</strong>可能是设备对无效地址返回了异常响应，建议调整设备配置</li>
                            </ul>
                        </div>
                    </div>

                    <div class="mb-4">
                        <h3 class="text-h6 font-weight-bold mb-2">技术细节</h3>
                        <div class="ml-4">
                            <p class="mb-2">智能探测功能使用以下技术原理：</p>
                            <ul class="ml-4 mb-2">
                                <li><strong>超时检测：</strong>通过设置合理的超时时间，区分有效地址和无效地址</li>
                                <li><strong>异常处理：</strong>分析设备返回的异常码，判断地址是否有效</li>
                                <li><strong>缓存机制：</strong>将扫描结果缓存到本地文件，避免重复扫描</li>
                                <li><strong>并发控制：</strong>合理控制并发扫描数量，避免设备过载</li>
                            </ul>
                        </div>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="outlined" @click="smartProbeHelpDialog.show = false">关闭</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showMessage } from '../composables/useGlobalState'
import request from '@/utils/request'

const router = useRouter()
const channels = ref([])
const loading = ref(false)
const selectionMode = ref(false)
const selectedChannels = ref([])
const viewMode = ref('list')

const listHeaders = [
    { title: '名称', key: 'name' },
    { title: 'ID', key: 'id' },
    { title: '协议', key: 'protocol' },
    { title: '启用状态', key: 'enable' },
    { title: '运行状态', key: 'runtime.state' },
    { title: '设备数', key: 'devices', value: item => item.devices ? item.devices.length : 0 },
    { title: '操作', key: 'actions', sortable: false, align: 'end' }
]

const batchConfigDialog = reactive({
    show: false,
    fields: {
        enable: false,
        timeout: false,
        baudRate: false
    },
    values: {
        enable: true,
        timeout: 2000,
        baudRate: 9600
    }
})

const toggleSelectionMode = () => {
    selectionMode.value = !selectionMode.value
    selectedChannels.value = []
}

const isSelected = (id) => selectedChannels.value.includes(id)

const toggleChannelSelection = (id) => {
    const idx = selectedChannels.value.indexOf(id)
    if (idx === -1) {
        selectedChannels.value.push(id)
    } else {
        selectedChannels.value.splice(idx, 1)
    }
}

const handleCardClick = (channel) => {
    if (selectionMode.value) {
        toggleChannelSelection(channel.id)
    } else {
        goToDevices(channel)
    }
}

const openBatchConfig = () => {
    batchConfigDialog.show = true
}

const performBatchConfig = async () => {
    if (selectedChannels.value.length === 0) return
    if (!confirm(`确定要批量更新 ${selectedChannels.value.length} 个通道吗？`)) return

    try {
        const promises = selectedChannels.value.map(async (id) => {
            // Fetch current to merge
            // Or we can just patch if API supported it.
            // Assuming we need to PUT full object.
            const channel = channels.value.find(c => c.id === id)
            if (!channel) return
            
            const updated = JSON.parse(JSON.stringify(channel))
            
            if (batchConfigDialog.fields.enable) {
                updated.enable = batchConfigDialog.values.enable
            }
            if (batchConfigDialog.fields.timeout) {
                if (!updated.config) updated.config = {}
                updated.config.timeout = batchConfigDialog.values.timeout
            }
            if (batchConfigDialog.fields.baudRate) {
                if (!updated.config) updated.config = {}
                updated.config.baudRate = batchConfigDialog.values.baudRate
            }
            
            const res = await request({
                url: `/api/channels/${id}`,
                method: 'put',
                data: updated
            })
        })
        
        await Promise.all(promises)
        showMessage('批量配置成功', 'success')
        batchConfigDialog.show = false
        toggleSelectionMode()
        fetchChannels()
    } catch (e) {
        showMessage('批量配置部分或全部失败: ' + e.message, 'error')
    }
}

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

const showHelp = ref(false)

const idRules = [
    v => !!v || 'ID 不能为空',
    v => /^[a-zA-Z0-9_-]+$/.test(v) || 'ID 只能包含字母、数字、下划线和横杠'
]

const generateId = () => {
    if (dialog.isEdit) return
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    dialog.form.id = result
}

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

// Metrics Dialog
const metricsDialog = reactive({
    show: false,
    channel: null,
    metrics: {},
    qualityScore: 100,
    stats: [],
    trend: [],
    recentErrors: []
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

const smartProbeHelpDialog = reactive({
    show: false
})

const openManualAdd = () => {
    manualAddDialog.deviceId = ''
    manualAddDialog.ip = ''
    manualAddDialog.port = ''
    manualAddDialog.show = true
}

const openSmartProbeHelp = () => {
    smartProbeHelpDialog.show = true
}

const getRuntimeColor = (state) => {
    switch (state) {
        case 0: return 'success' // Online
        case 1: return 'warning' // Unstable
        case 2: return 'error'   // Offline
        case 3: return 'grey'    // Quarantine
        default: return 'grey'
    }
}

const getRuntimeText = (state) => {
    switch (state) {
        case 0: return '在线'
        case 1: return '不稳定'
        case 2: return '离线'
        case 3: return '隔离'
        default: return '未知'
    }
}

// 打开监控指标对话框
const openMetricsDialog = async (channel) => {
    metricsDialog.channel = channel
    metricsDialog.show = true
    
    // 尝试获取实时指标
    try {
        const data = await request.get(`/api/channels/${channel.id}/metrics`)
        metricsDialog.metrics = data
        
        // 使用API返回的质量评分
        metricsDialog.qualityScore = data.qualityScore || 100
        
        // 生成统计数据
        metricsDialog.stats = [
            { label: '成功率', value: formatPercent(data.successRate), color: getSuccessRateColor(data.successRate) },
            { label: '平均RTT', value: formatMs(data.avgRtt), color: '' },
            { label: '最大RTT', value: formatMs(data.maxRtt), color: '' },
            { label: '最小RTT', value: formatMs(data.minRtt), color: '' },
            { label: '总请求数', value: data.totalRequests || 0, color: '' },
            { label: '成功次数', value: data.successCount || 0, color: 'success' },
            { label: '失败次数', value: data.failureCount || 0, color: data.failureCount > 0 ? 'error' : '' },
            { label: '超时次数', value: data.timeoutCount || 0, color: data.timeoutCount > 0 ? 'warning' : '' },
            { label: 'CRC错误', value: data.crcError || 0, color: data.crcError > 0 ? 'error' : '' },
            { label: '重试率', value: formatPercent(data.retryRate), color: data.retryRate > 0.1 ? 'warning' : '' },
            { label: '异常次数', value: data.exceptionCode || 0, color: data.exceptionCode > 0 ? 'error' : '' },
            { label: '丢包率', value: formatPercent(data.packetLoss), color: data.packetLoss > 0.01 ? 'warning' : '' }
        ]
        
        // 趋势数据 (如果有)
        metricsDialog.trend = data.trend || []
        
        // 最近错误
        metricsDialog.recentErrors = data.recentErrors || []
    } catch (e) {
        // 如果API不存在，使用默认值
        metricsDialog.metrics = {}
        metricsDialog.qualityScore = 100
        metricsDialog.stats = [
            { label: '成功率', value: '-', color: '' },
            { label: '平均RTT', value: '-', color: '' },
            { label: '超时次数', value: 0, color: '' },
            { label: 'CRC错误', value: 0, color: '' }
        ]
        metricsDialog.trend = []
        metricsDialog.recentErrors = []
    }
}

// 质量等级 (工业标准分级)
const getQualityLabel = (score) => {
    if (score === undefined || score === null) return 'Unknown'
    if (score === 100) return 'Perfect'
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Good'
    if (score >= 60) return 'Average'
    return 'Bad'
}

const getQualityColor = (score) => {
    if (score === undefined || score === null) return 'grey'
    if (score === 100) return 'primary'    // 完美 (蓝色)
    if (score >= 90) return 'success'     // 优秀 (绿色)
    if (score >= 80) return 'light-green-darken-1' // 良好 (浅绿)
    if (score >= 60) return 'warning'     // 一般 (橙色)
    return 'error'                        // 差 (红色)
}

// 成功率颜色
const getSuccessRateColor = (rate) => {
    if (rate >= 0.99) return 'success'
    if (rate >= 0.95) return 'warning'
    return 'error'
}

// 趋势颜色
const getTrendColor = (rate) => {
    if (rate === undefined || rate === null) return 'grey'
    const score = rate * 100
    if (score === 100) return 'rgb(var(--v-theme-primary))' // 100% 蓝色
    if (score >= 90) return 'rgb(var(--v-theme-success))'  // 90% 绿色
    if (score >= 80) return 'rgb(var(--v-theme-warning))'  // 80% 橙色
    if (score > 0) return 'rgb(var(--v-theme-error))'      // 0-80% 红色
    return 'grey'                                         // 0% 灰色
}

// 错误类型颜色
const getErrorColor = (type) => {
    if (type?.includes('timeout')) return 'warning'
    if (type?.includes('CRC') || type?.includes('exception')) return 'error'
    return 'grey'
}

// 获取连接地址
const getConnectionUrl = (channel) => {
    if (!channel || !channel.config) return null
    const cfg = channel.config
    
    // TCP 协议
    if (channel.protocol?.includes('tcp')) {
        if (cfg.url) {
            // 解析 tcp://ip:port
            const match = cfg.url.match(/tcp:\/\/(.+):(\d+)/)
            if (match) return `${match[1]}:${match[2]}`
            return cfg.url
        }
        if (cfg.address) return cfg.address
        if (cfg.ip) return `${cfg.ip}:${cfg.port || 502}`
    }
    
    // RTU Over TCP
    if (channel.protocol === 'modbus-rtu-over-tcp') {
        if (cfg.url) {
            const match = cfg.url.match(/tcp:\/\/(.+):(\d+)/)
            if (match) return `${match[1]}:${match[2]} (RTU)`
        }
    }
    
    // OPC UA
    if (channel.protocol === 'opc-ua') {
        return cfg.url || cfg.endpoint
    }
    
    // BACnet
    if (channel.protocol === 'bacnet-ip') {
        return `${cfg.ip || '0.0.0.0'}:${cfg.port || 47808}`
    }
    
    return null
}

// 是否为串口协议
const isSerialProtocol = (channel) => {
    if (!channel) return false
    const protocol = channel.protocol
    const port = channel.config?.port
    // 增加类型判断，避免非字符串导致的错误
    return protocol === 'modbus-rtu' || 
           protocol === 'dlt645' ||
           (typeof port === 'string' && (port.startsWith('/dev/') || port.startsWith('COM')))
}

// 格式化
const formatPercent = (val) => {
    if (val === undefined || val === null) return '-'
    return (val * 100).toFixed(1) + '%'
}

const formatMs = (ms) => {
    if (ms === undefined || ms === null) return '-'
    if (ms < 1) return '<1ms'
    if (ms < 1000) return ms.toFixed(2) + 'ms'
    return (ms / 1000).toFixed(2) + 's'
}

const formatDuration = (seconds) => {
    if (!seconds) return '-'
    if (seconds < 60) return `${Math.floor(seconds)}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
}

const formatTime = (ts) => {
    if (!ts || ts === '0001-01-01T00:00:00Z') return ''
    const date = new Date(ts)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleString()
}

const formatLastDisconnect = (ts) => {
    if (!ts || ts === '0001-01-01T00:00:00Z') return '-'
    const date = new Date(ts)
    if (isNaN(date.getTime())) return '-'
    
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)
    
    let duration = ''
    if (diff < 60) duration = `${diff}s前`
    else if (diff < 3600) duration = `${Math.floor(diff / 60)}m前`
    else if (diff < 86400) duration = `${Math.floor(diff / 3600)}h前`
    else duration = `${Math.floor(diff / 86400)}d前`
    
    return `${date.toLocaleTimeString()} (${duration})`
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
        
        const data = await request({
            url: `/api/channels/${scanDialog.channelId}/scan`,
            method: 'post',
            data: payload
        })
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
        const data = await request.get('/api/channels')
        channels.value = (data || []).sort((a, b) => a.name.localeCompare(b.name))
    } catch (e) {
        if (e && e.response && e.response.status === 401) {
            return
        }
        showMessage('获取通道失败: ' + (e && e.message ? e.message : ''), 'error')
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
            parity: 'E',
            // Modbus defaults
            max_retries: 3,
            retry_interval: 100,
            instruction_interval: 10,
            byte_order_4: 'ABCD',
            start_address: 1,
            enableSmartProbe: false,
            // Smart probe defaults
            probeMaxDepth: 6,
            probeTimeout: 3000,
            probeMaxConsecutive: 20,
            probeEnableMTU: true
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

    // Set defaults for Modbus protocols if missing
    if (['modbus-tcp', 'modbus-rtu', 'modbus-rtu-over-tcp'].includes(channel.protocol)) {
        if (dialog.form.config.max_retries === undefined) dialog.form.config.max_retries = 3
        if (dialog.form.config.retry_interval === undefined) dialog.form.config.retry_interval = 100
        if (dialog.form.config.instruction_interval === undefined) dialog.form.config.instruction_interval = 10
        if (dialog.form.config.byte_order_4 === undefined) dialog.form.config.byte_order_4 = 'ABCD'
        if (dialog.form.config.start_address === undefined) dialog.form.config.start_address = 1
        if (dialog.form.config.enableSmartProbe === undefined) dialog.form.config.enableSmartProbe = false
        if (dialog.form.config.probeMaxDepth === undefined) dialog.form.config.probeMaxDepth = 6
        if (dialog.form.config.probeTimeout === undefined) dialog.form.config.probeTimeout = 3000
        if (dialog.form.config.probeMaxConsecutive === undefined) dialog.form.config.probeMaxConsecutive = 20
        if (dialog.form.config.probeEnableMTU === undefined) dialog.form.config.probeEnableMTU = true
    }
    
    dialog.show = true
}

const saveChannel = async () => {
    try {
        const method = dialog.isEdit ? 'put' : 'post'
        const url = dialog.isEdit ? `/api/channels/${dialog.form.id}` : '/api/channels'
        
        await request({
            url: url,
            method: method,
            data: dialog.form
        })

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
        await request.delete(`/api/channels/${channel.id}`)
        
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
        const data = await request.post(`/api/channels/${channel.id}/scan`)
        
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
        const currentChannel = await request.get(`/api/channels/${scanDialog.channelId}`)

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
        await request({
            url: `/api/channels/${scanDialog.channelId}`,
            method: 'put',
            data: currentChannel
        })

        showMessage(`成功导入 ${newDevices.length} 个设备`, 'success')
        scanDialog.show = false
        fetchChannels() // Refresh list

    } catch (e) {
        showMessage('保存设备失败: ' + e.message, 'error')
    }
}


onMounted(fetchChannels)
</script>

<style scoped>
.selection-overlay {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 2;
}
.selected-border {
    border: 2px solid rgb(var(--v-theme-primary)) !important;
}

/* Metrics Dialog Styles */
.metric-stat-card {
    border-radius: 8px;
    transition: transform 0.2s;
}

.metric-stat-card:hover {
    transform: translateY(-2px);
}

.success-rate-chart {
    display: flex;
    align-items: flex-end;
    height: 80px;
    gap: 2px;
    padding: 8px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
}

.chart-bar {
    flex: 1;
    min-width: 4px;
    border-radius: 2px;
    transition: opacity 0.2s;
}

.chart-bar:hover {
    opacity: 0.8;
}
</style>
