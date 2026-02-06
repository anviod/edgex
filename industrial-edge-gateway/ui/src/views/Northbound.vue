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
                        <v-btn icon="mdi-help-circle" variant="text" size="small" color="secondary" @click="openMqttHelp(item)" title="帮助文档"></v-btn>
                        <v-btn icon="mdi-cog" variant="text" size="small" color="primary" @click="openMqttSettings(item)"></v-btn>
                        <v-btn icon="mdi-monitor-dashboard" variant="text" size="small" color="info" @click="openMqttStats(item)" title="运行监控"></v-btn>
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
                            <v-list-item v-if="item.subscribe_topic" title="订阅主题" :subtitle="item.subscribe_topic">
                                <template v-slot:prepend><v-icon icon="mdi-download-network" color="grey"></v-icon></template>
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
                        <v-btn icon="mdi-monitor-dashboard" variant="text" size="small" color="info" @click="openOpcuaStats(item)" title="运行监控"></v-btn>
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
                        <v-text-field v-model="mqttDialog.config.subscribe_topic" label="订阅主题 (用于写入)" placeholder="/things/{client_id}/write/req" persistent-placeholder variant="outlined" density="compact" class="mb-2"></v-text-field>
                        <v-text-field v-model="mqttDialog.config.write_response_topic" label="写入响应主题" placeholder="默认: 订阅主题/resp" persistent-placeholder variant="outlined" density="compact" class="mb-2"></v-text-field>
                        
                        <v-divider class="my-4"></v-divider>
                        <div class="text-subtitle-1 mb-2 font-weight-bold">状态上报配置 (LWT)</div>
                        <v-text-field v-model="mqttDialog.config.status_topic" label="状态主题" placeholder="默认: 发布主题/status" persistent-placeholder variant="outlined" density="compact" class="mb-2"></v-text-field>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-textarea v-model="mqttDialog.config.online_payload" label="上线消息内容 (JSON)" placeholder='{"status":"online"}' rows="3" variant="outlined" density="compact"></v-textarea>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-textarea v-model="mqttDialog.config.offline_payload" label="离线消息内容 (LWT)" placeholder='{"status":"offline"}' rows="3" variant="outlined" density="compact"></v-textarea>
                            </v-col>
                        </v-row>
                        <v-divider class="my-4"></v-divider>

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
                                    <th style="width: 100px;">在线状态</th>
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
                                        <v-chip v-if="dev.state === 0" color="success" size="small" variant="flat">在线</v-chip>
                                        <v-chip v-else-if="dev.state === 1" color="warning" size="small" variant="flat">不稳定</v-chip>
                                        <v-chip v-else color="error" size="small" variant="flat">离线</v-chip>
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

        <!-- MQTT Help Dialog -->
        <v-dialog v-model="mqttHelpDialog.visible" max-width="900">
            <v-card>
                <v-toolbar color="primary" density="compact">
                    <v-toolbar-title class="text-white">
                        <v-icon icon="mdi-help-circle-outline" class="mr-2"></v-icon>
                        MQTT 接入文档
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-close" variant="text" color="white" @click="mqttHelpDialog.visible = false"></v-btn>
                </v-toolbar>

                <div class="d-flex flex-row">
                    <v-tabs v-model="mqttHelpDialog.activeTab" direction="vertical" color="primary" style="min-width: 160px; height: 500px" class="border-e">
                        <v-tab value="reporting">
                            <v-icon start>mdi-upload-network</v-icon>
                            数据上报
                        </v-tab>
                        <v-tab value="control">
                            <v-icon start>mdi-remote</v-icon>
                            设备控制
                        </v-tab>
                        <v-tab value="status">
                            <v-icon start>mdi-access-point-check</v-icon>
                            在线状态
                        </v-tab>
                    </v-tabs>

                    <v-window v-model="mqttHelpDialog.activeTab" class="flex-grow-1" style="height: 500px; overflow-y: auto;">
                        <!-- Data Reporting -->
                        <v-window-item value="reporting" class="pa-4">
                            <div class="text-h6 mb-1">数据上报 (Data Reporting)</div>
                            <p class="text-body-2 text-grey mb-4">设备采集的数据将按照以下格式自动上报到 Broker。</p>

                            <v-card variant="outlined" class="mb-4 border-primary">
                                <v-card-text class="pa-3">
                                    <div class="text-caption font-weight-bold text-primary mb-1">Topic (发布主题)</div>
                                    <div class="d-flex align-center bg-grey-lighten-4 pa-2 rounded font-weight-medium text-body-2">
                                        <span class="text-truncate">{{ mqttHelpDialog.topic }}</span>
                                        <v-spacer></v-spacer>
                                        <v-btn size="x-small" variant="text" icon="mdi-content-copy" color="grey" @click="copyToClipboard(mqttHelpDialog.topic)"></v-btn>
                                    </div>
                                </v-card-text>
                            </v-card>

                            <div class="text-subtitle-2 mb-2 font-weight-bold">Payload 格式 (JSON)</div>
                            <v-sheet class="bg-grey-lighten-4 text-grey-darken-4 pa-3 rounded code-block border" style="font-family: monospace; font-size: 13px; line-height: 1.5;">
<pre class="ma-0">{
  <span class="text-primary">"timestamp"</span>: <span class="text-warning">1678888888888</span>,
  <span class="text-primary">"node"</span>: <span class="text-success">"device_name"</span>,   <span class="text-grey">// 设备名称</span>
  <span class="text-primary">"group"</span>: <span class="text-success">"channel_name"</span>, <span class="text-grey">// 通道名称</span>
  <span class="text-primary">"values"</span>: {
    <span class="text-primary">"point_name"</span>: <span class="text-warning">123.45</span>   <span class="text-grey">// 点位名: 值</span>
  },
  <span class="text-primary">"errors"</span>: {},            <span class="text-grey">// 错误信息 (可选)</span>
  <span class="text-primary">"metas"</span>: {}              <span class="text-grey">// 元数据 (可选)</span>
}</pre>
                            </v-sheet>
                        </v-window-item>

                        <!-- Device Control -->
                        <v-window-item value="control" class="pa-4">
                            <div class="text-h6 mb-1">设备控制 (Device Control)</div>
                            <p class="text-body-2 text-grey mb-4">向设备写入数据，支持多点位同时写入。</p>

                            <v-card variant="outlined" class="mb-4 border-info">
                                <v-card-text class="pa-3">
                                    <div class="text-caption font-weight-bold text-info mb-1">Topic (订阅主题 - 发送请求)</div>
                                    <div class="d-flex align-center bg-grey-lighten-4 pa-2 rounded font-weight-medium text-body-2">
                                        <span class="text-truncate">{{ mqttHelpDialog.subscribe_topic || '未配置' }}</span>
                                        <v-spacer></v-spacer>
                                        <v-btn size="x-small" variant="text" icon="mdi-content-copy" color="grey" @click="copyToClipboard(mqttHelpDialog.subscribe_topic)"></v-btn>
                                    </div>
                                </v-card-text>
                            </v-card>

                            <div class="text-subtitle-2 mb-2 font-weight-bold">请求 Payload (JSON)</div>
                            <v-sheet class="bg-grey-lighten-4 text-grey-darken-4 pa-3 rounded code-block mb-4 border" style="font-family: monospace; font-size: 13px;">
<pre class="ma-0">{
  <span class="text-primary">"uuid"</span>: <span class="text-success">"req_123456"</span>,    <span class="text-grey">// 请求ID (可选，用于匹配响应)</span>
  <span class="text-primary">"group"</span>: <span class="text-success">"channel_name"</span>, <span class="text-grey">// 通道名称</span>
  <span class="text-primary">"node"</span>: <span class="text-success">"device_name"</span>,   <span class="text-grey">// 设备名称</span>
  <span class="text-primary">"values"</span>: {
    <span class="text-primary">"point_name"</span>: <span class="text-warning">1</span>        <span class="text-grey">// 要写入的点位和值</span>
  }
}</pre>
                            </v-sheet>

                            <v-divider class="mb-4"></v-divider>

                            <v-card variant="outlined" class="mb-4 border-success">
                                <v-card-text class="pa-3">
                                    <div class="text-caption font-weight-bold text-success mb-1">Topic (响应主题 - 接收结果)</div>
                                    <div class="d-flex align-center bg-grey-lighten-4 pa-2 rounded font-weight-medium text-body-2">
                                        <span class="text-truncate">{{ mqttHelpDialog.write_response_topic || (mqttHelpDialog.subscribe_topic ? mqttHelpDialog.subscribe_topic + '/resp' : '未配置') }}</span>
                                        <v-spacer></v-spacer>
                                        <v-btn size="x-small" variant="text" icon="mdi-content-copy" color="grey" @click="copyToClipboard(mqttHelpDialog.write_response_topic || (mqttHelpDialog.subscribe_topic ? mqttHelpDialog.subscribe_topic + '/resp' : ''))"></v-btn>
                                    </div>
                                </v-card-text>
                            </v-card>

                            <div class="text-subtitle-2 mb-2 font-weight-bold">响应 Payload (JSON)</div>
                            <v-sheet class="bg-grey-lighten-4 text-grey-darken-4 pa-3 rounded code-block border" style="font-family: monospace; font-size: 13px;">
<pre class="ma-0">{
  <span class="text-primary">"uuid"</span>: <span class="text-success">"req_123456"</span>,
  <span class="text-primary">"success"</span>: <span class="text-warning">true</span>,         <span class="text-grey">// 是否成功</span>
  <span class="text-primary">"message"</span>: <span class="text-success">"error msg"</span>   <span class="text-grey">// 错误信息 (如果失败)</span>
}</pre>
                            </v-sheet>
                        </v-window-item>

                        <!-- Online/Offline Status -->
                        <v-window-item value="status" class="pa-4">
                            <div class="text-h6 mb-1">上下线状态 (Status)</div>
                            <p class="text-body-2 text-grey mb-4">网关/通道以及<strong class="text-primary">南向设备</strong>的连接状态变更时发布。</p>

                            <v-alert density="compact" type="info" variant="tonal" class="mb-4 text-caption">
                                支持变量替换: <code>{status}</code>, <code>{timestamp}</code>, <code>{device_id}</code>, <code>{device_name}</code>。
                                <br>如果配置了 Status Topic，南向设备状态也会发布到该主题（建议在 Payload 中包含 device_id 以区分）。
                            </v-alert>

                            <v-card variant="outlined" class="mb-4 border-warning">
                                <v-card-text class="pa-3">
                                    <div class="text-caption font-weight-bold text-warning mb-1">Topic (状态主题)</div>
                                    <div class="d-flex align-center bg-grey-lighten-4 pa-2 rounded font-weight-medium text-body-2">
                                        <span class="text-truncate">{{ mqttHelpDialog.status_topic || mqttHelpDialog.topic + '/status' }}</span>
                                        <v-spacer></v-spacer>
                                        <v-btn size="x-small" variant="text" icon="mdi-content-copy" color="grey" @click="copyToClipboard(mqttHelpDialog.status_topic || mqttHelpDialog.topic + '/status')"></v-btn>
                                    </div>
                                </v-card-text>
                            </v-card>

                            <div class="text-subtitle-2 mb-2 font-weight-bold">Payload (上线 - Online)</div>
                            <v-sheet class="bg-grey-lighten-4 text-grey-darken-4 pa-3 rounded code-block mb-4 border" style="font-family: monospace; font-size: 13px;">
                                <pre class="ma-0">{{ mqttHelpDialog.online_payload || '{\n  "status": "online",\n  "timestamp": 1678888888888\n}' }}</pre>
                            </v-sheet>

                            <div class="text-subtitle-2 mb-2 font-weight-bold">Payload (离线/遗嘱 - Offline/LWT)</div>
                            <v-sheet class="bg-grey-lighten-4 text-grey-darken-4 pa-3 rounded code-block border" style="font-family: monospace; font-size: 13px;">
                                <pre class="ma-0">{{ mqttHelpDialog.offline_payload || '{\n  "status": "offline",\n  "timestamp": 1678888888888\n}' }}</pre>
                            </v-sheet>
                        </v-window-item>
                    </v-window>
                </div>
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
                <v-card-title class="text-h5 pa-4">OPC UA 配置 (安全增强)</v-card-title>
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
                        <div class="text-subtitle-1 mb-2 font-weight-bold">安全认证设置</div>
                        <v-select
                            v-model="opcuaDialog.config.auth_methods"
                            :items="['Anonymous', 'UserName', 'Certificate']"
                            label="认证方式"
                            multiple
                            chips
                            variant="outlined"
                            density="compact"
                        ></v-select>

                        <div v-if="opcuaDialog.config.auth_methods && opcuaDialog.config.auth_methods.includes('UserName')" class="my-2">
                             <div class="d-flex align-center justify-space-between mb-2">
                                <div class="text-subtitle-2">用户列表 (用户名:密码)</div>
                                <v-btn icon="mdi-plus" size="small" color="primary" variant="flat" @click="addOpcuaUser"></v-btn>
                             </div>
                             <div v-for="(item, index) in opcuaDialog.userList" :key="index" class="d-flex align-center mb-2">
                                 <v-text-field v-model="item.username" label="用户名" density="compact" variant="outlined" hide-details class="mr-2"></v-text-field>
                                 <v-text-field 
                                    v-model="item.password" 
                                    :type="item.visible ? 'text' : 'password'" 
                                    label="密码" 
                                    density="compact" 
                                    variant="outlined" 
                                    hide-details 
                                    class="mr-2"
                                    :append-inner-icon="item.visible ? 'mdi-eye-off' : 'mdi-eye'"
                                    @click:append-inner="item.visible = !item.visible"
                                 ></v-text-field>
                                 <v-btn icon="mdi-delete" size="small" color="error" variant="text" @click="opcuaDialog.userList.splice(index, 1)"></v-btn>
                             </div>
                        </div>

                        <div v-if="opcuaDialog.config.auth_methods && opcuaDialog.config.auth_methods.includes('Certificate')" class="ml-4 border-l-4 pl-4 my-2">
                             <div class="text-subtitle-2 mb-2">证书配置</div>
                             <v-text-field v-model="opcuaDialog.config.cert_file" label="服务器证书路径" placeholder="server.crt" variant="outlined" density="compact"></v-text-field>
                             <v-text-field v-model="opcuaDialog.config.key_file" label="服务器私钥路径" placeholder="server.key" variant="outlined" density="compact"></v-text-field>
                        </div>

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

        <!-- OPC UA Stats Dialog -->
        <v-dialog v-model="opcuaStatsDialog.visible" max-width="500px">
            <v-card>
                <v-card-title class="d-flex align-center pa-4">
                    <span class="text-h5">OPC UA 运行监控</span>
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-refresh" variant="text" size="small" @click="refreshOpcuaStats" :loading="opcuaStatsDialog.loading"></v-btn>
                </v-card-title>
                <v-card-text class="pa-4">
                    <v-row>
                        <v-col cols="6">
                            <v-card class="pa-2 text-center" variant="outlined">
                                <div class="text-caption text-grey">当前连接客户端</div>
                                <div class="text-h4 text-primary mt-1">{{ opcuaStatsDialog.data.client_count || 0 }}</div>
                            </v-card>
                        </v-col>
                        <v-col cols="6">
                            <v-card class="pa-2 text-center" variant="outlined">
                                <div class="text-caption text-grey">当前订阅数量</div>
                                <div class="text-h4 text-info mt-1">{{ opcuaStatsDialog.data.subscription_count || 0 }}</div>
                            </v-card>
                        </v-col>
                        <v-col cols="6">
                            <v-card class="pa-2 text-center" variant="outlined">
                                <div class="text-caption text-grey">最近写操作统计</div>
                                <div class="text-h4 text-success mt-1">{{ opcuaStatsDialog.data.write_count || 0 }}</div>
                            </v-card>
                        </v-col>
                        <v-col cols="6">
                            <v-card class="pa-2 text-center" variant="outlined">
                                <div class="text-caption text-grey">运行时长</div>
                                <div class="text-h4 text-grey mt-1">{{ formatUptime(opcuaStatsDialog.data.uptime || 0) }}</div>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="opcuaStatsDialog.visible = false">关闭</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- MQTT Stats Dialog -->
        <v-dialog v-model="mqttStatsDialog.visible" max-width="900px" content-class="glass-dialog-wrapper">
            <v-card class="glass-dialog">
                <v-card-title class="d-flex align-center pa-4 text-white bg-primary">
                    <v-icon icon="mdi-monitor-dashboard" start></v-icon>
                    <span class="text-h6">MQTT 运行监控</span>
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-refresh" variant="text" size="small" @click="refreshMqttStats" :loading="mqttStatsDialog.loading"></v-btn>
                    <v-btn icon="mdi-close" variant="text" size="small" @click="mqttStatsDialog.visible = false"></v-btn>
                </v-card-title>
                
                <v-card-text class="pa-4">
                    <!-- Top Stats Cards -->
                    <v-row class="mb-4">
                        <v-col cols="12" sm="6" md="3">
                            <v-card class="pa-3 text-center" elevation="2">
                                <div class="text-caption text-grey">发送成功</div>
                                <div class="text-h4 text-success mt-1">{{ mqttStatsDialog.data.success_count || 0 }}</div>
                            </v-card>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-card class="pa-3 text-center" elevation="2">
                                <div class="text-caption text-grey">发送失败</div>
                                <div class="text-h4 text-error mt-1">{{ mqttStatsDialog.data.fail_count || 0 }}</div>
                            </v-card>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-card class="pa-3 text-center" elevation="2">
                                <div class="text-caption text-grey">重连次数</div>
                                <div class="text-h4 text-warning mt-1">{{ mqttStatsDialog.data.reconnect_count || 0 }}</div>
                            </v-card>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-card class="pa-3 text-center" elevation="2">
                                <div class="text-caption text-grey">断线时长</div>
                                <div class="text-h4 text-grey-darken-1 mt-1">{{ formatDisconnectDuration(mqttStatsDialog.data.last_offline_time, mqttStatsDialog.data.last_online_time) }}</div>
                            </v-card>
                        </v-col>
                    </v-row>

                    <v-divider class="mb-4"></v-divider>

                    <!-- Log Viewer Control Bar -->
                    <div class="d-flex align-center mb-2">
                        <v-icon icon="mdi-console-line" size="small" color="grey" class="mr-2"></v-icon>
                        <span class="text-subtitle-2 font-weight-bold">实时日志 (MQTT)</span>
                        <v-spacer></v-spacer>
                        
                        <v-switch
                            v-model="mqttStatsDialog.isStreaming"
                            color="success"
                            label="实时滚动"
                            hide-details
                            density="compact"
                            class="mr-4"
                            inset
                        ></v-switch>

                        <v-btn
                            variant="outlined"
                            size="small"
                            prepend-icon="mdi-download"
                            @click="downloadMqttLogs"
                            class="mr-2"
                        >
                            下载日志
                        </v-btn>
                    </div>

                    <!-- Log Viewer Area -->
                    <v-card variant="outlined" class="log-viewer-container rounded bg-white">
                        <div class="log-content pa-2" style="height: 300px; overflow-y: auto; font-family: monospace; font-size: 12px;">
                            <div v-if="mqttPaginatedLogs.length === 0" class="text-center text-grey mt-12">暂无日志...</div>
                            <div v-for="(log, idx) in mqttPaginatedLogs" :key="idx" class="log-line border-b">
                                <span class="text-grey mr-2">[{{ formatTime(log.ts) }}]</span>
                                <span :class="getLevelClass(log.level)" class="font-weight-bold mr-2">{{ (log.level || 'INFO').toUpperCase() }}</span>
                                <span class="text-black">{{ log.msg }}</span>
                                <span v-for="(val, key) in getExtraFields(log)" :key="key" class="text-grey ml-2 text-caption">
                                    {{ key }}={{ val }}
                                </span>
                            </div>
                        </div>
                        <v-divider></v-divider>
                        <div class="d-flex align-center justify-center pa-1">
                             <v-pagination
                                v-if="mqttStatsDialog.logs.length > 0"
                                v-model="mqttStatsDialog.page"
                                :length="mqttPageCount"
                                :total-visible="5"
                                density="compact"
                                size="small"
                            ></v-pagination>
                        </div>
                    </v-card>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<style>
.glass-dialog {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.95) !important;
}
.log-line {
    white-space: pre-wrap;
    word-break: break-all;
    padding: 2px 0;
}
</style>

<script setup>
import { ref, reactive, onMounted, watch, onUnmounted } from 'vue'
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
    config: { devices: {} },
    userList: []
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

const addOpcuaUser = () => {
    opcuaDialog.userList.push({ username: '', password: '', visible: false })
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
            subscribe_topic: '/neuron/+/write/req',
            write_response_topic: '',
            status_topic: '',
            online_payload: '',
            offline_payload: '',
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
            devices: {},
            auth_methods: ['Anonymous'],
            users: {},
            cert_file: '',
            key_file: ''
        }
    }
    
    // Ensure devices map exists
    if (!opcuaDialog.config.devices) opcuaDialog.config.devices = {}
    
    // Ensure auth fields exist
    if (!opcuaDialog.config.auth_methods) opcuaDialog.config.auth_methods = ['Anonymous']
    if (!opcuaDialog.config.users) opcuaDialog.config.users = {}
    if (!opcuaDialog.config.cert_file) opcuaDialog.config.cert_file = ''
    if (!opcuaDialog.config.key_file) opcuaDialog.config.key_file = ''

    opcuaDialog.userList = []
    if (opcuaDialog.config.users) {
        for (const [u, p] of Object.entries(opcuaDialog.config.users)) {
            opcuaDialog.userList.push({ username: u, password: p, visible: false })
        }
    }
    
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
    
    // Sync userList back to config.users
    opcuaDialog.config.users = {}
    if (opcuaDialog.userList) {
        opcuaDialog.userList.forEach(u => {
            if (u.username) {
                opcuaDialog.config.users[u.username] = u.password
            }
        })
    }

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

const opcuaStatsDialog = reactive({
    visible: false,
    loading: false,
    id: null,
    data: {
        client_count: 0,
        subscription_count: 0,
        write_count: 0,
        uptime: 0
    }
})

let statsTimer = null

const refreshOpcuaStats = async (isAuto = false) => {
    if (!opcuaStatsDialog.id) return
    if (!isAuto) opcuaStatsDialog.loading = true
    try {
        const data = await request.get(`/api/northbound/opcua/${opcuaStatsDialog.id}/stats`)
        opcuaStatsDialog.data = data
    } catch (e) {
        if (!isAuto) showMessage('获取监控信息失败: ' + e.message, 'error')
    } finally {
        if (!isAuto) opcuaStatsDialog.loading = false
    }
}

const openOpcuaStats = (item) => {
    opcuaStatsDialog.id = item.id
    opcuaStatsDialog.visible = true
}

watch(() => opcuaStatsDialog.visible, (val) => {
    if (val) {
        refreshOpcuaStats(false)
        statsTimer = setInterval(() => refreshOpcuaStats(true), 3000)
    } else {
        if (statsTimer) {
            clearInterval(statsTimer)
            statsTimer = null
        }
    }
})

// MQTT Help Logic
const mqttHelpDialog = reactive({
    visible: false,
    activeTab: 'reporting',
    topic: '',
    subscribe_topic: '',
    write_response_topic: '',
    status_topic: '',
    online_payload: '',
    offline_payload: ''
})

const openMqttHelp = (item) => {
    mqttHelpDialog.topic = item.topic || ''
    mqttHelpDialog.subscribe_topic = item.subscribe_topic || ''
    mqttHelpDialog.write_response_topic = item.write_response_topic || ''
    mqttHelpDialog.status_topic = item.status_topic || ''
    mqttHelpDialog.online_payload = item.online_payload || ''
    mqttHelpDialog.offline_payload = item.offline_payload || ''
    mqttHelpDialog.visible = true
}

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        showMessage('已复制到剪贴板', 'success')
    }).catch(() => {
        showMessage('复制失败', 'error')
    })
}

// MQTT Stats & Monitoring Logic
const mqttStatsDialog = reactive({
    visible: false,
    loading: false,
    id: null,
    data: {
        success_count: 0,
        fail_count: 0,
        reconnect_count: 0,
        last_offline_time: 0,
        last_online_time: 0
    },
    logs: [],
    page: 1,
    isStreaming: true
})

import { computed } from 'vue' // Ensure computed is available

const mqttPaginatedLogs = computed(() => {
    const start = (mqttStatsDialog.page - 1) * 20
    const end = start + 20
    return mqttStatsDialog.logs.slice(start, end)
})

const mqttPageCount = computed(() => {
    return Math.ceil(mqttStatsDialog.logs.length / 20) || 1
})

const openMqttStats = (item) => {
    mqttStatsDialog.id = item.id
    mqttStatsDialog.visible = true
    mqttStatsDialog.logs = [] 
    refreshMqttStats(false)
}

const refreshMqttStats = async (isAuto = false) => {
    if (!mqttStatsDialog.id) return
    if (!isAuto) mqttStatsDialog.loading = true
    try {
        const data = await request.get(`/api/northbound/mqtt/${mqttStatsDialog.id}/stats`)
        mqttStatsDialog.data = data
    } catch (e) {
        // Silent fail on auto refresh
        if (!isAuto) showMessage('获取监控信息失败: ' + e.message, 'error')
    } finally {
        if (!isAuto) mqttStatsDialog.loading = false
    }
}

const formatDisconnectDuration = (offlineTime, onlineTime) => {
    if (!offlineTime) return '0s'
    const now = Date.now()
    if (offlineTime > onlineTime) {
        const diff = Math.floor((now - offlineTime) / 1000)
        return formatUptime(diff)
    }
    return '0s'
}

const formatTime = (ts) => {
    if (!ts) return ''
    return new Date(ts).toLocaleTimeString() + '.' + new Date(ts).getMilliseconds().toString().padStart(3, '0')
}

const getLevelClass = (level) => {
    const l = (level || '').toUpperCase()
    if (l === 'ERROR' || l === 'FATAL') return 'text-error'
    if (l === 'WARN') return 'text-warning'
    return 'text-success'
}

const getExtraFields = (log) => {
    const { ts, level, msg, caller, component, ...rest } = log
    return rest
}

const downloadMqttLogs = () => {
    const rows = mqttStatsDialog.logs.map(log => {
        const ts = log.ts ? new Date(log.ts).toLocaleString() : ''
        const level = (log.level || 'INFO').toUpperCase()
        const msg = log.msg || ''
        return `[${ts}] [${level}] ${msg}`
    })
    
    const content = rows.join('\n')
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `mqtt_logs_${new Date().toISOString().slice(0,19).replace(/[:T]/g, '-')}.log`
    link.click()
    URL.revokeObjectURL(link.href)
}

let mqttWs = null
let mqttStatsTimer = null

watch(() => mqttStatsDialog.visible, (val) => {
    if (val) {
        mqttStatsTimer = setInterval(() => refreshMqttStats(true), 1000)
        
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const host = window.location.host
        let token = ''
        try {
             const raw = localStorage.getItem('loginInfo')
             if (raw) {
                 const parsed = JSON.parse(raw)
                 token = parsed.token || (parsed.data && parsed.data.token) || ''
             }
        } catch(e) {}
        
        mqttWs = new WebSocket(`${protocol}//${host}/api/ws/logs?token=${token}`)
        mqttWs.onmessage = (event) => {
            if (!mqttStatsDialog.isStreaming) return
            try {
                const log = JSON.parse(event.data)
                if (log.component === 'mqtt-client') {
                    mqttStatsDialog.logs.unshift(log)
                    if (mqttStatsDialog.logs.length > 500) mqttStatsDialog.logs.pop()
                }
            } catch(e) {}
        }
    } else {
        if (mqttStatsTimer) {
            clearInterval(mqttStatsTimer)
            mqttStatsTimer = null
        }
        if (mqttWs) {
            mqttWs.close()
            mqttWs = null
        }
    }
})

onUnmounted(() => {
    if (statsTimer) clearInterval(statsTimer)
    if (mqttStatsTimer) clearInterval(mqttStatsTimer)
    if (mqttWs) mqttWs.close()
})

const formatUptime = (seconds) => {
    if (seconds < 60) return seconds + '秒'
    if (seconds < 3600) return Math.floor(seconds / 60) + '分' + (seconds % 60) + '秒'
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return hours + '小时' + mins + '分'
}

onMounted(fetchConfig)
</script>
