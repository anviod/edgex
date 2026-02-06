<template>
    <div>
        <v-card class="glass-card no-hover">
            <v-card-title class="d-flex align-center py-4 px-6 border-b">
                <v-btn 
                    prepend-icon="mdi-arrow-left" 
                    variant="flat" 
                    color="white" 
                    class="mr-4 text-primary font-weight-bold"
                    elevation="2"
                    @click="$router.back()"
                >
                    返回设备
                </v-btn>

                <v-spacer></v-spacer>
                <v-btn 
                    color="success" 
                    variant="tonal" 
                    prepend-icon="mdi-plus" 
                    class="mr-2"
                    @click="openAddDialog"
                >
                    新增点位
                </v-btn>
                <v-btn
                    v-if="channelProtocol === 'bacnet-ip' || channelProtocol === 'opc-ua'"
                    color="info"
                    variant="tonal"
                    prepend-icon="mdi-radar"
                    class="mr-2"
                    @click="openDiscoverDialog"
                >
                    扫描点位
                </v-btn>
                <v-btn 
                    color="primary" 
                    variant="tonal" 
                    prepend-icon="mdi-refresh" 
                    @click="fetchPoints"
                    :loading="loading"
                >
                    刷新
                </v-btn>
            </v-card-title>
            
            <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

            <v-card-text class="pa-0">
                <v-table hover>
                    <thead>
                        <tr>
                            <th class="text-left">点位ID</th>
                            <th class="text-left">点位名称</th>
                            <th class="text-left">读写权限</th>
                            <th class="text-left">数值</th>
                            <th class="text-left">质量</th>
                            <th class="text-left">时间戳</th>
                            <th class="text-left">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="point in points" :key="point.id">
                            <td class="font-weight-medium">{{ point.id }}</td>
                            <td>{{ point.name }}</td>
                            <td>
                                <v-chip
                                    size="x-small"
                                    :color="point.readwrite === 'RW' ? 'success' : 'info'"
                                    variant="outlined"
                                    class="font-weight-medium"
                                >
                                    {{ point.readwrite }}
                                </v-chip>
                            </td>
                            <td style="max-width: 200px;">
                                <div 
                                    class="d-flex align-center cursor-pointer"
                                    @click="showFullValue(point.value)"
                                    title="点击查看完整值"
                                >
                                    <span class="text-h6 font-weight-bold text-primary text-truncate d-block" style="max-width: 100%;">
                                        {{ formatValue(point.value) }}
                                    </span>
                                    <span v-if="point.unit" class="text-caption ml-1 flex-shrink-0">{{ point.unit }}</span>
                                </div>
                            </td>
                            <td>
                                <v-chip 
                                    size="small" 
                                    :color="isQualityGood(point.quality) ? 'success' : 'error'" 
                                    variant="flat"
                                >
                                    {{ point.quality }}
                                </v-chip>
                            </td>
                            <td class="text-body-2">{{ formatDate(point.timestamp) }}</td>
                            <td>
                                <v-btn 
                                    v-if="point.readwrite === 'RW' || point.readwrite === 'W'"
                                    color="secondary" 
                                    size="x-small" 
                                    variant="tonal"
                                    icon="mdi-pencil"
                                    class="mr-1"
                                    @click="openWriteDialog(point)"
                                    title="写入数值"
                                ></v-btn>
                                <v-btn 
                                    icon="mdi-file-edit-outline"
                                    size="x-small"
                                    variant="tonal"
                                    color="primary"
                                    class="mr-1"
                                    @click="openEditDialog(point)"
                                    title="编辑点位配置"
                                ></v-btn>
                                <v-btn 
                                    icon="mdi-delete-outline"
                                    size="x-small"
                                    variant="tonal"
                                    color="error"
                                    @click="confirmDelete(point)"
                                    title="删除点位"
                                ></v-btn>
                            </td>
                        </tr>
                        <tr v-if="!loading && points.length === 0">
                            <td colspan="6" class="text-center pa-8 text-grey">暂无点位数据</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>

        <!-- Point Config Dialog (Add/Edit) -->
        <v-dialog v-model="pointDialog.visible" max-width="80%" persistent>
            <v-card class="rounded-xl">
                <v-card-title class="text-h5 pa-4 bg-primary text-white">
                    <v-icon :icon="pointDialog.isEdit ? 'mdi-file-edit' : 'mdi-plus-circle'" class="mr-2"></v-icon>
                    {{ pointDialog.isEdit ? '编辑点位' : '新增点位' }}
                </v-card-title>
                <v-card-text class="pa-4 pt-6">
                    <v-form ref="pointForm" @submit.prevent="submitPoint">
                        <v-row>
                            <v-col cols="6">
                                <v-text-field
                                    v-model="pointDialog.form.id"
                                    label="点位ID"
                                    variant="outlined"
                                    density="compact"
                                    :readonly="pointDialog.isEdit"
                                    hint="唯一标识符"
                                    persistent-hint
                                ></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field
                                    v-model="pointDialog.form.name"
                                    label="点位名称"
                                    variant="outlined"
                                    density="compact"
                                ></v-text-field>
                            </v-col>

                            <!-- Modbus Specific -->
                            <template v-if="channelProtocol.startsWith('modbus')">
                                <v-col cols="6">
                                    <v-select
                                        v-model="pointDialog.registerType"
                                        label="寄存器类型"
                                        :items="registerTypes"
                                        item-title="title"
                                        item-value="value"
                                        variant="outlined"
                                        density="compact"
                                        @update:model-value="updateAddress"
                                    ></v-select>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field
                                        v-model.number="pointDialog.registerIndex"
                                        label="寄存器索引"
                                        type="number"
                                        min="1"
                                        variant="outlined"
                                        density="compact"
                                        @input="updateAddress"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field
                                        v-model="pointDialog.form.address"
                                        label="Modbus 地址"
                                        variant="outlined"
                                        density="compact"
                                        hint="自动生成 (例如: 40001)"
                                        persistent-hint
                                    ></v-text-field>
                                </v-col>
                            </template>

                            <!-- BACnet Specific -->
                            <template v-else-if="channelProtocol === 'bacnet-ip'">
                                <v-col cols="6">
                                    <v-select
                                        v-model="pointDialog.bacnetType"
                                        label="对象类型"
                                        :items="bacnetObjectTypes"
                                        variant="outlined"
                                        density="compact"
                                        @update:model-value="updateBACnetAddress"
                                    ></v-select>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field
                                        v-model.number="pointDialog.bacnetInstance"
                                        label="实例 ID"
                                        type="number"
                                        min="0"
                                        variant="outlined"
                                        density="compact"
                                        @input="updateBACnetAddress"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="pointDialog.form.address"
                                        label="BACnet 地址"
                                        variant="outlined"
                                        density="compact"
                                        readonly
                                        hint="格式: Type:Instance"
                                        persistent-hint
                                    ></v-text-field>
                                </v-col>
                            </template>

                            <!-- OPC UA Specific -->
                            <template v-else-if="channelProtocol === 'opc-ua'">
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="pointDialog.form.address"
                                        label="Node ID"
                                        placeholder="ns=2;s=Demo.Static.Scalar.Double"
                                        variant="outlined"
                                        density="compact"
                                        hint="例如: ns=2;s=Demo..."
                                        persistent-hint
                                    ></v-text-field>
                                </v-col>
                            </template>

                            <!-- S7 Specific -->
                            <template v-else-if="channelProtocol === 's7'">
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="pointDialog.form.address"
                                        label="S7 地址"
                                        placeholder="DB1.DBD0"
                                        variant="outlined"
                                        density="compact"
                                        hint="例如: DB1.DBD0, M0.0"
                                        persistent-hint
                                    ></v-text-field>
                                </v-col>
                            </template>

                            <!-- EtherNet/IP Specific -->
                            <template v-else-if="channelProtocol === 'ethernet-ip'">
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="pointDialog.form.address"
                                        label="Tag 名称"
                                        placeholder="Program:Main.MyTag"
                                        variant="outlined"
                                        density="compact"
                                        hint="例如: Program:Main.MyTag"
                                        persistent-hint
                                    ></v-text-field>
                                </v-col>
                            </template>

                            <!-- Mitsubishi Specific -->
                            <template v-else-if="channelProtocol === 'mitsubishi-slmp'">
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="pointDialog.form.address"
                                        label="地址"
                                        placeholder="D100"
                                        variant="outlined"
                                        density="compact"
                                        hint="格式: D100, M0, X0, D20.2, D100.16L"
                                        persistent-hint
                                    ></v-text-field>
                                </v-col>
                            </template>

                            <!-- Omron FINS Specific -->
                            <template v-else-if="channelProtocol === 'omron-fins'">
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="pointDialog.form.address"
                                        label="地址"
                                        placeholder="D100"
                                        variant="outlined"
                                        density="compact"
                                        hint="格式: CIO1.2, D100, W3.4, EM10.100"
                                        persistent-hint
                                    ></v-text-field>
                                </v-col>
                            </template>

                            <!-- DL/T645 Specific -->
                            <template v-else-if="channelProtocol === 'dlt645'">
                                <v-col cols="6">
                                    <v-text-field
                                        v-model="pointDialog.dlt645DeviceAddr"
                                        label="设备地址"
                                        variant="outlined"
                                        density="compact"
                                        hint="通常与设备配置一致"
                                        persistent-hint
                                        @input="updateDLT645Address"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field
                                        v-model="pointDialog.dlt645DataID"
                                        label="数据标识 (DI)"
                                        placeholder="02-01-01-00"
                                        variant="outlined"
                                        density="compact"
                                        hint="格式: XX-XX-XX-XX"
                                        persistent-hint
                                        @input="updateDLT645Address"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="pointDialog.form.address"
                                        label="完整地址"
                                        variant="outlined"
                                        density="compact"
                                        readonly
                                        hint="格式: 设备地址#数据标识"
                                        persistent-hint
                                    ></v-text-field>
                                </v-col>
                            </template>

                            <!-- Fallback -->
                            <template v-else>
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="pointDialog.form.address"
                                        label="地址"
                                        variant="outlined"
                                        density="compact"
                                    ></v-text-field>
                                </v-col>
                            </template>
                            <v-col cols="6">
                                <v-select
                                    v-model="pointDialog.form.datatype"
                                    label="数据类型"
                                    :items="[
                                        'int16', 'uint16', 'int32', 'uint32', 'float32', 'bool',
                                        'INT8', 'UINT8', 'INT16', 'UINT16', 'INT32', 'UINT32', 'INT64', 'UINT64',
                                        'FLOAT', 'DOUBLE', 'BOOL', 'BIT', 'STRING', 'WORD', 'DWORD', 'LWORD'
                                    ]"
                                    variant="outlined"
                                    density="compact"
                                ></v-select>
                            </v-col>
                            <v-col cols="6">
                                <v-select
                                    v-model="pointDialog.form.readwrite"
                                    label="读写权限"
                                    :items="['R', 'RW']"
                                    variant="outlined"
                                    density="compact"
                                ></v-select>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field
                                    v-model="pointDialog.form.unit"
                                    label="单位"
                                    variant="outlined"
                                    density="compact"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field
                                    v-model.number="pointDialog.form.scale"
                                    label="缩放比例"
                                    type="number"
                                    step="0.01"
                                    variant="outlined"
                                    density="compact"
                                    hint="默认为 1.0"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field
                                    v-model.number="pointDialog.form.offset"
                                    label="偏移量"
                                    type="number"
                                    step="0.01"
                                    variant="outlined"
                                    density="compact"
                                    hint="默认为 0"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions class="pa-4 pt-0">
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="text" @click="pointDialog.visible = false">取消</v-btn>
                    <v-btn color="primary" variant="elevated" @click="submitPoint" :loading="pointDialog.loading">保存</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Scan Dialog -->
        <v-dialog v-model="scanDialog.visible" max-width="1200px" persistent>
            <v-card>
                <v-card-title class="d-flex align-center bg-info text-white">
                    <v-icon icon="mdi-radar" class="mr-2"></v-icon>
                    扫描点位 (对象发现)
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-close" variant="text" @click="scanDialog.visible = false"></v-btn>
                </v-card-title>
                <v-card-text class="pa-4">
                    <v-row class="mb-2" align="center">
                        <v-col cols="12" sm="8">
                            <div class="text-caption text-grey-darken-1">
                                正在扫描设备 (ID: {{ deviceInfo?.config?.device_id }}) 的对象列表...
                            </div>
                        </v-col>
                        <v-col cols="12" sm="4" class="d-flex align-center justify-end">
                            <v-btn color="primary" :loading="scanDialog.loading" prepend-icon="mdi-radar" @click="scanPoints">
                                开始扫描
                            </v-btn>
                            <v-switch
                                class="ml-4"
                                hide-details
                                color="primary"
                                density="compact"
                                v-model="scanDialog.varsOnly"
                                :label="scanDialog.varsOnly ? '仅显示变量' : '显示全部'"
                            ></v-switch>
                        </v-col>
                    </v-row>
                    
                    <v-divider class="mb-4"></v-divider>
                    
                    <v-table hover density="compact">
                        <thead>
                            <tr>
                                <th style="width: 50px">
                                    <v-checkbox-btn
                                        v-model="scanDialog.selectAll"
                                        @update:model-value="toggleSelectAllScan"
                                        density="compact"
                                        hide-details
                                    ></v-checkbox-btn>
                                </th>
                                <th class="text-left">状态</th>
                                <th class="text-left">对象名称/NodeID</th>
                                <th class="text-left">类型</th>
                                <th class="text-left" v-if="channelProtocol !== 'opc-ua'">实例</th>
                                <th class="text-left" v-if="channelProtocol !== 'opc-ua'">当前值</th>
                                <th class="text-left" v-if="channelProtocol !== 'opc-ua'">单位</th>
                                <th class="text-left">描述/DataType</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="scanDialog.results.length === 0 && !scanDialog.loading">
                                <td colspan="7" class="text-center text-grey py-8">
                                    <v-icon icon="mdi-magnify" size="large" class="mb-2"></v-icon>
                                    <div>点击"开始扫描"获取设备对象列表</div>
                                </td>
                            </tr>
                            <tr v-for="obj in scanFilteredResults" :key="obj.isOpcNode ? obj.node_id : (obj.type + ':' + obj.instance)">
                                <td>
                                    <v-checkbox-btn
                                        v-model="scanDialog.selected"
                                        :value="obj"
                                        :disabled="obj.diff_status === 'existing'"
                                        density="compact"
                                        hide-details
                                    ></v-checkbox-btn>
                                </td>
                                <td>
                                    <v-chip
                                        v-if="obj.diff_status"
                                        size="x-small"
                                        :color="getStatusColor(obj.diff_status)"
                                        class="font-weight-bold"
                                    >
                                        {{ getStatusText(obj.diff_status) }}
                                    </v-chip>
                                    <span v-else>-</span>
                                </td>
                                <!-- Object Name with Indentation for OPC UA -->
                                <td :style="obj.isOpcNode ? { paddingLeft: (obj.level * 20 + 16) + 'px' } : {}">
                                    <v-icon v-if="obj.isOpcNode" :icon="obj.type === 'Variable' ? 'mdi-tag-outline' : 'mdi-folder-outline'" size="small" class="mr-1"></v-icon>
                                    {{ obj.object_name || obj.name || '-' }}
                                    <div v-if="obj.isOpcNode" class="text-caption text-grey">{{ obj.node_id }}</div>
                                </td>
                                <td>{{ obj.type }}</td>
                                <td v-if="channelProtocol !== 'opc-ua'">{{ obj.instance }}</td>
                                <td v-if="channelProtocol !== 'opc-ua'">{{ obj.present_value }}</td>
                                <td v-if="channelProtocol !== 'opc-ua'">{{ obj.units || '-' }}</td>
                                <td>{{ obj.isOpcNode ? (obj.data_type || '-') : (obj.description || '-') }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card-text>
                <v-card-actions class="pa-4 border-t">
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="scanDialog.visible = false">取消</v-btn>
                    <v-btn 
                        color="primary" 
                        variant="elevated"
                        @click="addSelectedPoints" 
                        :disabled="scanDialog.selected.length === 0 || scanDialog.loading"
                        :loading="scanDialog.loading"
                    >
                        添加选定点位 ({{ scanDialog.selected.length }})
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="deleteDialog.visible" max-width="400">
            <v-card>
                <v-card-title class="text-h5">确认删除?</v-card-title>
                <v-card-text>
                    确定要删除点位 "{{ deleteDialog.point?.name }}" ({{ deleteDialog.point?.id }}) 吗? 此操作无法撤销。
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="text" @click="deleteDialog.visible = false">取消</v-btn>
                    <v-btn color="error" variant="elevated" @click="executeDelete" :loading="deleteDialog.loading">删除</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Write Dialog -->
        <v-dialog v-model="writeDialog.visible" max-width="400" persistent>
            <v-card class="rounded-xl bg-white elevation-10">
                <v-card-title class="text-h5 pa-4 bg-primary text-white">
                    <v-icon icon="mdi-pencil" class="mr-2"></v-icon>
                    写入数值
                </v-card-title>
                <v-card-text class="pa-4 pt-6">
                    <v-form @submit.prevent="submitWrite">
                        <v-text-field
                            v-model="writeDialog.deviceID"
                            label="设备ID"
                            variant="outlined"
                            readonly
                            density="compact"
                            prepend-inner-icon="mdi-devices"
                            class="mb-2"
                        ></v-text-field>
                        <v-text-field
                            v-model="writeDialog.pointID"
                            label="点位ID"
                            variant="outlined"
                            readonly
                            density="compact"
                            prepend-inner-icon="mdi-tag"
                            class="mb-2"
                        ></v-text-field>
                        <template v-if="isBoolType(writeDialog.dataType)">
                            <v-switch
                                v-model="writeDialog.valueBool"
                                inset
                                color="primary"
                                class="mt-2"
                                :label="writeDialog.valueBool ? 'TRUE' : 'FALSE'"
                            ></v-switch>
                        </template>
                        <template v-else-if="isStringType(writeDialog.dataType)">
                            <v-text-field
                                v-model="writeDialog.valueStr"
                                label="新数值"
                                variant="outlined"
                                density="comfortable"
                                prepend-inner-icon="mdi-cog"
                                placeholder="请输入要写入的字符串"
                                autofocus
                            ></v-text-field>
                        </template>
                        <template v-else>
                            <v-text-field
                                v-model.number="writeDialog.valueNum"
                                type="number"
                                step="0.01"
                                label="新数值"
                                variant="outlined"
                                density="comfortable"
                                prepend-inner-icon="mdi-cog"
                                placeholder="请输入要写入的数值"
                                autofocus
                            ></v-text-field>
                        </template>
                    </v-form>
                </v-card-text>
                <v-card-actions class="pa-4 pt-0">
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="text" @click="writeDialog.visible = false">取消</v-btn>
                    <v-btn color="primary" variant="elevated" @click="submitWrite" :loading="writeDialog.loading">确认写入</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Value Detail Dialog -->
        <v-dialog v-model="valueDialog.visible" max-width="600">
            <v-card>
                <v-card-title class="text-h5 bg-primary text-white">
                    完整数值
                </v-card-title>
                <v-card-text class="pt-4">
                    <v-textarea
                        label="原始值"
                        v-model="valueDialog.value"
                        readonly
                        auto-grow
                        rows="3"
                        variant="outlined"
                        class="mb-4"
                    ></v-textarea>

                    <div v-if="valueDialog.isBase64">
                        <div class="text-subtitle-1 mb-2 font-weight-bold">Base64 解码</div>
                        <v-btn-toggle v-model="valueDialog.decodeType" color="primary" mandatory class="mb-4" @update:model-value="tryDecode">
                            <v-btn value="text">Text (UTF-8)</v-btn>
                            <v-btn value="hex">Hex</v-btn>
                            <v-btn value="json">JSON</v-btn>
                        </v-btn-toggle>
                        
                        <v-textarea
                            label="解码结果"
                            v-model="valueDialog.decodedValue"
                            readonly
                            auto-grow
                            rows="5"
                            variant="outlined"
                            style="font-family: monospace;"
                        ></v-textarea>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="valueDialog.visible = false">关闭</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { globalState, showMessage } from '../composables/useGlobalState'
import request from '@/utils/request'

const route = useRoute()
const points = ref([])
const deviceInfo = ref(null)
const loading = ref(false)
const channelId = route.params.channelId
const deviceId = route.params.deviceId

// Write Dialog State
const writeDialog = reactive({
    visible: false,
    deviceID: '',
    pointID: '',
    dataType: '',
    valueNum: 0,
    valueStr: '',
    valueBool: false,
    loading: false
})

// Point Dialog State (Add/Edit)
const pointDialog = reactive({
    visible: false,
    isEdit: false,
    loading: false,
    registerType: 'holding',
    registerIndex: 1,
    bacnetType: 'AnalogInput',
    bacnetInstance: 1,
    dlt645DeviceAddr: '',
    dlt645DataID: '',
    form: {
        id: '',
        name: '',
        address: '',
        datatype: 'float32',
        readwrite: 'R',
        unit: '',
        scale: 1.0,
        offset: 0.0
    }
})

const registerTypes = [
    { title: 'Coil (0x)', value: 'coil' },
    { title: 'Discrete Input (1x)', value: 'discrete' },
    { title: 'Input Register (3x)', value: 'input' },
    { title: 'Holding Register (4x)', value: 'holding' }
]

const updateAddress = () => {
    let base = 0
    switch(pointDialog.registerType) {
        case 'coil': base = 0; break;
        case 'discrete': base = 10000; break;
        case 'input': base = 30000; break;
        case 'holding': base = 40000; break;
    }
    const idx = parseInt(pointDialog.registerIndex) || 0
	pointDialog.form.address = (base + idx).toString()
}

const updateBACnetAddress = () => {
	pointDialog.form.address = `${pointDialog.bacnetType}:${pointDialog.bacnetInstance}`
}

const updateDLT645Address = () => {
    if (pointDialog.dlt645DeviceAddr && pointDialog.dlt645DataID) {
        pointDialog.form.address = `${pointDialog.dlt645DeviceAddr}#${pointDialog.dlt645DataID}`
    } else {
        pointDialog.form.address = ''
    }
}

const parseAddressToUI = (addrStr) => {
	if (channelProtocol.value.startsWith('modbus')) {
		const addr = parseInt(addrStr)
		if (isNaN(addr)) return

		if (addr >= 40001 && addr <= 49999) {
			pointDialog.registerType = 'holding'
			pointDialog.registerIndex = addr - 40000
		} else if (addr >= 30001 && addr <= 39999) {
			pointDialog.registerType = 'input'
			pointDialog.registerIndex = addr - 30000
		} else if (addr >= 10001 && addr <= 19999) {
			pointDialog.registerType = 'discrete'
			pointDialog.registerIndex = addr - 10000
		} else if (addr >= 1 && addr <= 9999) {
			pointDialog.registerType = 'coil'
			pointDialog.registerIndex = addr
		} else {
			// Fallback
			pointDialog.registerType = 'holding'
			pointDialog.registerIndex = addr
		}
	} else if (channelProtocol.value === 'bacnet-ip') {
		const parts = addrStr.split(':')
		if (parts.length === 2) {
			pointDialog.bacnetType = parts[0]
			pointDialog.bacnetInstance = parseInt(parts[1]) || 0
		}
	} else if (channelProtocol.value === 'dlt645') {
        const parts = addrStr.split('#')
        if (parts.length === 2) {
            pointDialog.dlt645DeviceAddr = parts[0]
            pointDialog.dlt645DataID = parts[1]
        }
    }
}

// Delete Dialog State
const deleteDialog = reactive({
	visible: false,
	point: null,
	loading: false
})

const openAddDialog = () => {
	pointDialog.isEdit = false
	pointDialog.form = {
		id: '',
		name: '',
		address: '',
		datatype: 'float32',
		readwrite: 'R',
		unit: '',
		scale: 1.0,
		offset: 0.0
	}
	
	// Defaults
	pointDialog.registerType = 'holding'
	pointDialog.registerIndex = 1
	pointDialog.bacnetType = 'AnalogInput'
	pointDialog.bacnetInstance = 1
    pointDialog.dlt645DeviceAddr = ''
    pointDialog.dlt645DataID = ''
	
	if (channelProtocol.value.startsWith('modbus')) {
		pointDialog.form.address = '40001'
	} else if (channelProtocol.value === 'bacnet-ip') {
		pointDialog.form.address = 'AnalogInput:1'
	} else if (channelProtocol.value === 'dlt645') {
        if (deviceInfo.value && deviceInfo.value.config) {
            const addr = deviceInfo.value.config.station_address || deviceInfo.value.config.address || ''
            if (addr) {
                pointDialog.dlt645DeviceAddr = addr
                // Pre-fill a common data ID or leave empty
                pointDialog.dlt645DataID = '02-01-01-00' // Voltage A
                updateDLT645Address()
            }
        }
    }
	
	pointDialog.visible = true
}

const openEditDialog = (point) => {
    pointDialog.isEdit = true
    
    // Try to find full config from deviceInfo if available
    if (deviceInfo.value && deviceInfo.value.points) {
        const fullPoint = deviceInfo.value.points.find(p => p.id === point.id)
        if (fullPoint) {
            pointDialog.form = { ...fullPoint }
            if (pointDialog.form.scale === undefined) pointDialog.form.scale = 1.0
            if (pointDialog.form.offset === undefined) pointDialog.form.offset = 0.0
        } else {
            pointDialog.form = { ...point, scale: 1.0, offset: 0.0 }
        }
    } else {
        pointDialog.form = { ...point, scale: 1.0, offset: 0.0 }
    }
    
    if (pointDialog.form.address) {
        parseAddressToUI(pointDialog.form.address)
    }
    
    pointDialog.visible = true
}

const submitPoint = async () => {
    pointDialog.loading = true
    try {
        const url = pointDialog.isEdit 
            ? `/api/channels/${channelId}/devices/${deviceId}/points/${pointDialog.form.id}`
            : `/api/channels/${channelId}/devices/${deviceId}/points`

        if (pointDialog.isEdit) {
            await request.put(url, pointDialog.form)
        } else {
            await request.post(url, pointDialog.form)
        }

        showMessage(pointDialog.isEdit ? '点位更新成功' : '点位添加成功', 'success')
        pointDialog.visible = false
        fetchPoints() // Refresh list
    } catch (e) {
        showMessage(e.message, 'error')
    } finally {
        pointDialog.loading = false
    }
}

const confirmDelete = (point) => {
    deleteDialog.point = point
    deleteDialog.visible = true
}

const executeDelete = async () => {
    if (!deleteDialog.point) return
    
    deleteDialog.loading = true
    try {
        await request.delete(`/api/channels/${channelId}/devices/${deviceId}/points/${deleteDialog.point.id}`)

        showMessage('点位删除成功', 'success')
        deleteDialog.visible = false
        fetchPoints() // Refresh list
    } catch (e) {
        showMessage(e.message, 'error')
    } finally {
        deleteDialog.loading = false
    }
}

const fetchPoints = async () => {
    loading.value = true
    try {
        // Fetch device info first
        if (!deviceInfo.value) {
            try {
                const dev = await request.get(`/api/channels/${channelId}/devices/${deviceId}`)
                if (dev) {
                    deviceInfo.value = dev
                    globalState.navTitle = deviceInfo.value.name
                }
            } catch (e) {
                console.error('Failed to fetch device info', e)
            }
        }

        const pts = await request.get(`/api/channels/${channelId}/devices/${deviceId}/points`)
        points.value = pts || []
    } catch (e) {
        showMessage('获取点位失败: ' + e.message, 'error')
    } finally {
        loading.value = false
    }
}

const scanDialog = reactive({
    visible: false,
    loading: false,
    results: [],
    selected: [],
    selectAll: false,
    varsOnly: true
})

const existingAddresses = computed(() => {
    const set = new Set()
    for (const p of points.value || []) {
        if (p && p.address) set.add(p.address)
    }
    return set
})

const scanFilteredResults = computed(() => {
    if (!scanDialog.varsOnly) return scanDialog.results
    return scanDialog.results.filter(r => !r.isOpcNode || r.type === 'Variable')
})

const getStatusColor = (status) => {
    switch (status) {
        case 'new': return 'success'
        case 'existing': return 'grey'
        case 'removed': return 'error'
        default: return 'grey'
    }
}

const getStatusText = (status) => {
    switch (status) {
        case 'new': return '新增'
        case 'existing': return '存量'
        case 'removed': return '已删除'
        default: return status
    }
}

const openDiscoverDialog = () => {
    scanDialog.visible = true
    scanDialog.results = []
    scanDialog.selected = []
    scanDialog.selectAll = false
    scanDialog.varsOnly = true
    // 自动开始扫描，减少多余操作
    scanPoints()
}

// Value Detail Dialog Logic
const valueDialog = reactive({
    visible: false,
    value: '',
    decodedValue: '',
    decodeType: 'text',
    isBase64: false
})

const isBase64 = (str) => {
    if (typeof str !== 'string' || str.length === 0) return false;
    try {
        return btoa(atob(str)) === str;
    } catch (err) {
        return false;
    }
}

const showFullValue = (val) => {
    // If val is object/array, convert to string
    if (typeof val === 'object' && val !== null) {
        val = JSON.stringify(val)
    }
    valueDialog.value = String(val)
    valueDialog.decodedValue = ''
    valueDialog.decodeType = 'text'
    
    // Check Base64
    valueDialog.isBase64 = isBase64(valueDialog.value)
    if (valueDialog.isBase64) {
        tryDecode('text')
    }
    valueDialog.visible = true
}

const tryDecode = (type) => {
    valueDialog.decodeType = type
    if (!valueDialog.value) return
    
    try {
        const raw = atob(valueDialog.value)
        if (type === 'text') {
            const bytes = Uint8Array.from(raw, c => c.charCodeAt(0))
            valueDialog.decodedValue = new TextDecoder().decode(bytes)
        } else if (type === 'hex') {
            let result = ''
            for (let i = 0; i < raw.length; i++) {
                const hex = raw.charCodeAt(i).toString(16)
                result += (hex.length === 2 ? hex : '0' + hex) + ' '
            }
            valueDialog.decodedValue = result.toUpperCase().trim()
        } else if (type === 'json') {
            const bytes = Uint8Array.from(raw, c => c.charCodeAt(0))
            const str = new TextDecoder().decode(bytes)
            valueDialog.decodedValue = JSON.stringify(JSON.parse(str), null, 2)
        }
    } catch (e) {
        valueDialog.decodedValue = 'Decode failed: ' + e.message
    }
}

const scanPoints = async () => {
    scanDialog.loading = true
    scanDialog.results = []
    try {
        // Ensure device info is loaded
        if (!deviceInfo.value) {
             try {
                 const dev = await request.get(`/api/channels/${channelId}/devices/${deviceId}`)
                 if (dev) {
                     deviceInfo.value = dev
                 }
             } catch (e) {
                 console.error('Failed to re-fetch device info', e)
             }
        }

        console.log('Scanning points for device:', deviceInfo.value)
        if (!deviceInfo.value || !deviceInfo.value.config) {
             showMessage('无法获取设备配置 (请检查设备连接或配置)', 'error')
             return
        }
        // OPC UA 设备前置校验：必须存在 endpoint
        if (channelProtocol.value === 'opc-ua') {
            const ep = deviceInfo.value.config.endpoint
            if (!ep || typeof ep !== 'string' || ep.length === 0) {
                showMessage('OPC UA 设备未配置 endpoint，无法扫描', 'error')
                return
            }
        }
        
        // Handle device_id being 0 or string "0" for BACnet
        if (channelProtocol.value === 'bacnet-ip') {
            const configDeviceId = deviceInfo.value.config.device_id
            if (configDeviceId === undefined || configDeviceId === null || configDeviceId === '') {
                showMessage('无法获取设备ID (config.device_id)', 'error')
                return
            }
        }
        
        // Call device-specific scan endpoint
        const res = await request.post(`/api/channels/${channelId}/devices/${deviceId}/scan`, {
            // device_id is injected by backend based on device config
        }, { timeout: 60000 }) // Increase timeout for slow BACnet/OPC UA scans
        
        if (Array.isArray(res)) {
            if (channelProtocol.value === 'opc-ua') {
                // Flatten OPC UA tree for display
                scanDialog.results = flattenOpcNodes(res)
            } else {
                // For BACnet (and others), process diff_status based on existing points in UI
                // This overrides backend's "existing" status (from driver history) if the point was deleted in App
                scanDialog.results = res.map(item => {
                    if (channelProtocol.value === 'bacnet-ip') {
                         const key = `${item.type}:${item.instance}`
                         if (existingAddresses.value.has(key)) {
                             item.diff_status = 'existing'
                         } else {
                             // If not in App, reset 'existing' to 'new' so it can be re-added
                             if (item.diff_status === 'existing') {
                                 item.diff_status = 'new'
                             }
                         }
                    }
                    return item
                })
            }
        } else {
            showMessage('扫描结果格式错误', 'error')
        }
    } catch (e) {
        showMessage('扫描失败: ' + e.message, 'error')
    } finally {
        scanDialog.loading = false
    }
}

const flattenOpcNodes = (nodes, level = 0) => {
    let result = []
    for (const node of nodes) {
        // Add current node
        const item = {
            ...node,
            level: level,
            isOpcNode: true,
            // Map to common fields for display
            device_id: node.node_id, // Use NodeID as ID
            object_name: node.name,
            type: node.type, // "Variable" or "Folder"
            description: node.node_id // Show NodeID in description/extra
        }
        // Mark existing/new for sync status
        if (node.type === 'Variable' && node.node_id) {
            item.diff_status = existingAddresses.value.has(node.node_id) ? 'existing' : 'new'
        }
        result.push(item)
        
        // Process children
        if (node.children && node.children.length > 0) {
            result = result.concat(flattenOpcNodes(node.children, level + 1))
        }
    }
    return result
}

const toggleSelectAllScan = (val) => {
    if (val) {
        // Only select non-disabled rows
        scanDialog.selected = scanFilteredResults.value.filter(r => !(r.diff_status === 'existing'))
    } else {
        scanDialog.selected = []
    }
}

const addSelectedPoints = async () => {
    if (scanDialog.selected.length === 0) return
    
    scanDialog.loading = true
    let successCount = 0
    let failCount = 0
    
    for (const obj of scanDialog.selected) {
        let pointPayload = {}
        
        if (channelProtocol.value === 'opc-ua') {
            // OPC UA Point Mapping
            // Skip non-variable nodes if desired, or let user decide (variables only usually)
            if (obj.type !== 'Variable') continue;
            
            let rw = 'R'
            if (obj.access_level && obj.access_level.includes('CurrentWrite')) {
                rw = 'RW'
            }
            
            // Map OPC UA DataType to System DataType
            let dt = (obj.data_type || 'Float').toLowerCase()
            if (dt.includes('bool')) dt = 'bool'
            else if (dt.includes('int16') || dt.includes('short')) dt = 'int16'
            else if (dt.includes('uint16') || dt.includes('unsignedshort')) dt = 'uint16'
            else if (dt.includes('int32') || dt.includes('int')) dt = 'int32'
            else if (dt.includes('uint32') || dt.includes('unsignedint')) dt = 'uint32'
            else if (dt.includes('float')) dt = 'float32'
            else if (dt.includes('double')) dt = 'float64'
            else if (dt.includes('string')) dt = 'string'
            else dt = 'float32' // Default fallback

            pointPayload = {
                id: obj.node_id, // Use NodeID as ID
                name: obj.display_name || obj.node_id,
                address: obj.node_id,
                datatype: dt,
                readwrite: rw,
                unit: '', // Units not always available in browse
                scale: 1.0,
                offset: 0.0
            }
        } else {
            // BACnet Point Mapping
            // Determine Datatype
            let datatype = 'float32'
            if (obj.type.includes('Binary') || obj.type.includes('Bit')) datatype = 'bool'
            if (obj.type.includes('MultiState')) datatype = 'uint16'
            
            // Determine RW
            let rw = 'R'
            if (obj.type.includes('Output') || obj.type.includes('Value')) rw = 'RW'
            
            pointPayload = {
                id: obj.name || `${obj.type}_${obj.instance}`.replace(/[\s:]+/g, '_'),
                name: obj.description || `${obj.type} ${obj.instance}`,
                address: `${obj.type}:${obj.instance}`,
                datatype: datatype,
                readwrite: rw,
                unit: obj.units || '',
                scale: 1.0,
                offset: 0.0
            }
        }
        
        try {
            await request.post(`/api/channels/${channelId}/devices/${deviceId}/points`, pointPayload)
            successCount++
        } catch (e) {
            console.error(e)
            failCount++
        }
    }
    
    scanDialog.loading = false
    showMessage(`已添加 ${successCount} 个点位${failCount > 0 ? `，${failCount} 个失败` : ''}`, failCount > 0 ? 'warning' : 'success')
    scanDialog.visible = false
    fetchPoints()
}

// WebSocket Logic
let ws = null
const connectWs = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    ws = new WebSocket(`${protocol}//${host}/api/ws/values`)

    ws.onopen = () => {
        globalState.wsStatus.connected = true
    }

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            if (data.channel_id === channelId && data.device_id === deviceId) {
                const idx = points.value.findIndex(p => p.id === data.point_id)
                if (idx !== -1) {
                    points.value[idx].value = data.value
                    points.value[idx].quality = data.quality
                    points.value[idx].timestamp = data.timestamp
                }
            }
        } catch (e) { console.error(e) }
    }

    ws.onclose = () => {
        globalState.wsStatus.connected = false
    }
}

const channelProtocol = ref('')
const bacnetObjectTypes = [
    'AnalogInput', 'AnalogOutput', 'AnalogValue',
    'BinaryInput', 'BinaryOutput', 'BinaryValue',
    'MultiStateInput', 'MultiStateOutput', 'MultiStateValue'
]

const fetchChannel = async () => {
    try {
        const data = await request.get(`/api/channels/${channelId}`)
        if (data && data.protocol) {
            channelProtocol.value = data.protocol
        }
    } catch (e) {
        console.error('Failed to fetch channel info', e)
    }
}

onMounted(() => {
    fetchPoints()
    fetchChannel()
    connectWs()
})

onUnmounted(() => {
    if (ws) ws.close()
})

// Helpers
const formatValue = (val) => {
    if (typeof val === 'number') return val.toFixed(2)
    return val
}
const formatDate = (ts) => new Date(ts).toLocaleString()
const isQualityGood = (q) => q === 'Good' || q === 'good'

// Write Logic
const openWriteDialog = (point) => {
    writeDialog.deviceID = deviceId
    writeDialog.pointID = point.id
    writeDialog.dataType = (point.datatype || '').toLowerCase()
    // 初始化不同类型的输入
    if (isBoolType(writeDialog.dataType)) {
        writeDialog.valueBool = false
    } else if (isStringType(writeDialog.dataType)) {
        writeDialog.valueStr = ''
    } else {
        writeDialog.valueNum = 0
    }
    writeDialog.visible = true
}

const submitWrite = async () => {
    writeDialog.loading = true
    try {
        const payloadValue = normalizeWriteValue()
        await request.post('/api/write', {
            channel_id: channelId,
            device_id: deviceId,
            point_id: writeDialog.pointID,
            value: payloadValue
        })
        showMessage('写入命令已发送', 'success')
        writeDialog.visible = false
    } catch (e) {
        showMessage('写入失败: ' + e.message, 'error')
    } finally {
        writeDialog.loading = false
    }
}

// 类型判断与转换
const isBoolType = (dt) => ['bool', 'boolean', 'bit'].includes((dt || '').toLowerCase())
const isStringType = (dt) => ['string'].includes((dt || '').toLowerCase())
const isFloatType = (dt) => ['float', 'float32', 'float64', 'double'].includes((dt || '').toLowerCase())
const isIntType = (dt) => ['int8','int16','int32','int64','uint8','uint16','uint32','uint64','word','dword','lword','int','uint'].includes((dt || '').toLowerCase())

const normalizeWriteValue = () => {
    const dt = (writeDialog.dataType || '').toLowerCase()
    if (isBoolType(dt)) {
        return writeDialog.valueBool
    }
    if (isStringType(dt)) {
        return writeDialog.valueStr
    }
    if (isFloatType(dt)) {
        const n = Number(writeDialog.valueNum)
        return isNaN(n) ? 0 : n
    }
    if (isIntType(dt)) {
        const n = parseInt(writeDialog.valueNum)
        return isNaN(n) ? 0 : n
    }
    // Fallback: 原样字符串
    return writeDialog.valueStr || writeDialog.valueNum
}
</script>
