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
                variant="flat" 
                class="mr-2"
                @click="openBatchConfig"
            >
                批量配置
            </v-btn>
            <v-btn 
                :color="selectionMode ? 'grey' : 'secondary'" 
                :prepend-icon="selectionMode ? 'mdi-close' : 'mdi-checkbox-multiple-marked'" 
                variant="text" 
                class="mr-2"
                @click="toggleSelectionMode"
            >
                {{ selectionMode ? '取消选择' : '批量操作' }}
            </v-btn>
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
                                    <v-btn size="x-small" icon="mdi-pencil" variant="text" color="primary" @click.stop="openEditDialog(channel)"></v-btn>
                                    <v-btn size="x-small" icon="mdi-radar" variant="text" color="info" v-if="channel.protocol === 'bacnet-ip'" @click.stop="scanChannel(channel)"></v-btn>
                                    <v-btn size="x-small" icon="mdi-delete" variant="text" color="error" @click.stop="deleteChannel(channel)"></v-btn>
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
                        <v-btn size="small" icon="mdi-pencil" variant="text" color="primary" @click.stop="openEditDialog(item)"></v-btn>
                        <v-btn size="small" icon="mdi-radar" variant="text" color="info" v-if="item.protocol === 'bacnet-ip'" @click.stop="scanChannel(item)"></v-btn>
                        <v-btn size="small" icon="mdi-delete" variant="text" color="error" @click.stop="deleteChannel(item)"></v-btn>
                    </div>
                </template>
            </v-data-table>
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
                    <v-btn color="grey" variant="text" @click="dialog.show = false">取消</v-btn>
                    <v-btn color="primary" @click="saveChannel">保存</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Batch Config Dialog -->
        <v-dialog v-model="batchConfigDialog.show" max-width="500px">
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
                    <v-btn color="grey" variant="text" @click="batchConfigDialog.show = false">取消</v-btn>
                    <v-btn color="primary" @click="performBatchConfig">应用</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Scan Dialog -->
        <v-dialog v-model="scanDialog.show" max-width="800px">
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
                                { title: '设备名称', key: 'name' },
                                { title: '设备 ID', key: 'device_id' },
                                { title: 'IP 地址', key: 'ip' },
                                { title: '网络号', key: 'network_number' },
                                { title: 'MAC', key: 'mac_address' },
                                { title: '包含对象数', key: 'object_count', value: item => item.objects ? item.objects.length : 0 }
                            ]"
                            :items="scanDialog.results"
                            show-select
                            return-object
                            item-value="device_id"
                        >
                            <template v-slot:no-data>
                                <div class="text-center">未扫描到设备</div>
                            </template>
                        </v-data-table>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" variant="text" @click="scanDialog.show = false">取消</v-btn>
                    <v-btn color="primary" @click="saveScannedDevices" :disabled="scanDialog.selected.length === 0">导入所选设备</v-btn>
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
            start_address: 1
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
</style>
