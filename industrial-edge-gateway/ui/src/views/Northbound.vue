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

        <div v-else-if="(!config.mqtt || config.mqtt.length === 0) && (!config.http || config.http.length === 0) && (!config.opcua || config.opcua.length === 0) && (!config.sparkplug_b || config.sparkplug_b.length === 0)" class="text-center pa-12 text-grey">
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
                                <template v-slot:append>
                                    <v-btn icon="mdi-content-copy" size="x-small" variant="text" color="grey" @click="copyToClipboard(item.broker)" title="复制"></v-btn>
                                </template>
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

            <!-- HTTP Push Cards -->
            <v-col cols="12" md="6" v-for="item in config.http" :key="item.id">
                <v-card class="glass-card h-100">
                    <v-card-title class="d-flex align-center border-b py-4">
                        <v-icon icon="mdi-cloud-upload" color="primary" class="mr-3"></v-icon>
                        HTTP: {{ item.name || item.id }}
                        <v-spacer></v-spacer>
                        <v-btn icon="mdi-cog" variant="text" size="small" color="primary" @click="openHttpSettings(item)"></v-btn>
                        <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="deleteProtocol('http', item.id)"></v-btn>
                        <v-chip :color="item.enable ? 'success' : 'grey'" size="small" class="ml-2">
                            {{ item.enable ? '启用' : '禁用' }}
                        </v-chip>
                    </v-card-title>
                    <v-card-text class="pt-4">
                        <v-list density="compact" bg-color="transparent">
                            <v-list-item title="服务器地址" :subtitle="item.url">
                                <template v-slot:prepend><v-icon icon="mdi-server-network" color="grey"></v-icon></template>
                                <template v-slot:append>
                                    <v-btn icon="mdi-content-copy" size="x-small" variant="text" color="grey" @click="copyToClipboard(item.url)" title="复制"></v-btn>
                                </template>
                            </v-list-item>
                            <v-list-item title="请求方法" :subtitle="item.method || 'POST'">
                                <template v-slot:prepend><v-icon icon="mdi-file-send" color="grey"></v-icon></template>
                            </v-list-item>
                            <v-list-item v-if="item.data_endpoint" title="数据端点" :subtitle="item.data_endpoint">
                                <template v-slot:prepend><v-icon icon="mdi-api" color="grey"></v-icon></template>
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
                        <v-btn icon="mdi-help-circle" variant="text" size="small" color="secondary" @click="openOpcuaHelp(item)" title="帮助文档"></v-btn>
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
                                <template v-slot:append>
                                    <v-btn icon="mdi-content-copy" size="x-small" variant="text" color="grey" @click="copyToClipboard('opc.tcp://localhost:' + item.port + item.endpoint)" title="复制"></v-btn>
                                </template>
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
                                <template v-slot:append>
                                    <v-btn icon="mdi-content-copy" size="x-small" variant="text" color="grey" @click="copyToClipboard(item.broker)" title="复制"></v-btn>
                                </template>
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
                        @click="addProtocol('http')" 
                        title="HTTP 推送" 
                        subtitle="通过 HTTP POST/PUT 推送数据到服务器"
                        prepend-icon="mdi-cloud-upload"
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

        <!-- OPC UA Help Dialog -->
        <v-dialog v-model="opcuaHelpDialog.visible" max-width="900">
            <v-card>
                <v-toolbar color="primary" density="compact">
                    <v-toolbar-title class="text-white">
                        <v-icon icon="mdi-help-circle-outline" class="mr-2"></v-icon>
                        OPC UA 接入文档
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-close" variant="text" color="white" @click="opcuaHelpDialog.visible = false"></v-btn>
                </v-toolbar>

                <div class="d-flex flex-row">
                    <v-tabs v-model="opcuaHelpDialog.activeTab" direction="vertical" color="primary" style="min-width: 160px; height: 500px" class="border-e">
                        <v-tab value="connection">
                            <v-icon start>mdi-lan-connect</v-icon>
                            连接配置
                        </v-tab>
                        <v-tab value="auth">
                            <v-icon start>mdi-account-key</v-icon>
                            身份认证
                        </v-tab>
                        <v-tab value="subscription">
                            <v-icon start>mdi-rss</v-icon>
                            数据订阅
                        </v-tab>
                    </v-tabs>

                    <v-window v-model="opcuaHelpDialog.activeTab" class="flex-grow-1" style="height: 500px; overflow-y: auto;">
                        <!-- Connection -->
                        <v-window-item value="connection" class="pa-4">
                            <div class="text-h6 mb-1">连接配置 (Connection)</div>
                            <p class="text-body-2 text-grey mb-4">使用 OPC UA 客户端（如 UaExpert, SCADA）连接到本网关。</p>

                            <v-card variant="outlined" class="mb-4 border-primary">
                                <v-card-text class="pa-3">
                                    <div class="text-caption font-weight-bold text-primary mb-1">Endpoint URL (服务地址)</div>
                                    <div class="d-flex align-center bg-grey-lighten-4 pa-2 rounded font-weight-medium text-body-2">
                                        <span class="text-truncate">opc.tcp://{{ location_host ? location_host.split(':')[0] : 'localhost' }}:{{ opcuaHelpDialog.port }}{{ opcuaHelpDialog.endpoint }}</span>
                                        <v-spacer></v-spacer>
                                        <v-btn size="x-small" variant="text" icon="mdi-content-copy" color="grey" @click="copyToClipboard('opc.tcp://' + (location_host ? location_host.split(':')[0] : 'localhost') + ':' + opcuaHelpDialog.port + opcuaHelpDialog.endpoint)"></v-btn>
                                    </div>
                                    <div class="text-caption text-grey mt-1">提示：如果从外部访问，请将 localhost 替换为网关的实际 IP 地址。</div>
                                </v-card-text>
                            </v-card>

                            <div class="text-subtitle-2 mb-2 font-weight-bold">最佳实践 (Best Practices)</div>
                            <v-alert density="compact" type="success" variant="tonal" class="mb-4 text-caption border-start border-success border-opacity-100" style="border-left-width: 4px !important;">
                                <div class="font-weight-bold mb-1">推荐连接方式：</div>
                                <ol class="pl-4">
                                    <li>安全策略选择：<strong>Basic256Sha256 - SignAndEncrypt</strong></li>
                                    <li>证书信任：首次连接时，如果客户端提示服务端证书不可信，请选择 <strong>"Trust" (信任)</strong>。</li>
                                </ol>
                            </v-alert>

                            <div class="text-subtitle-2 mb-2 font-weight-bold">客户端指南 (Client Guides)</div>
                            
                            <v-expansion-panels variant="accordion" class="mb-4">
                                <v-expansion-panel title="Prosys OPC UA Browser (推荐)">
                                    <v-expansion-panel-text class="text-caption">
                                        <p class="mb-2">功能强大的跨平台 OPC UA 客户端工具。</p>
                                        <div class="d-flex align-center mb-2">
                                            <v-icon icon="mdi-download" size="small" class="mr-1" color="primary"></v-icon>
                                            <a href="https://downloads.prosysopc.com/opc-ua-browser-downloads.php" target="_blank" class="text-decoration-none text-primary">下载地址 (Download)</a>
                                        </div>
                                        <div class="bg-grey-lighten-4 pa-2 rounded mb-2">
                                            <strong>连接步骤：</strong>
                                            <ol class="pl-4 mt-1">
                                                <li>输入 Endpoint URL (上文复制)。</li>
                                                <li>Security Mode 选择 <strong>SignAndEncrypt</strong>。</li>
                                                <li>Security Policy 选择 <strong>Basic256Sha256</strong>。</li>
                                                <li>点击 Connect，在弹出的证书警告中勾选 "Accept Permanently" 并确认。</li>
                                            </ol>
                                        </div>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>

                                <v-expansion-panel title="Unified Automation UaExpert">
                                    <v-expansion-panel-text class="text-caption">
                                        <p class="mb-2">专业的 OPC UA 客户端。</p>
                                        <div class="bg-grey-lighten-4 pa-2 rounded">
                                            <strong>连接步骤：</strong>
                                            <ol class="pl-4 mt-1">
                                                <li>添加 Server，双击 Custom Discovery 下的 URL。</li>
                                                <li>选择 <strong>Basic256Sha256 - SignAndEncrypt</strong> 策略。</li>
                                                <li>连接时点击 "Trust Server Certificate"。</li>
                                            </ol>
                                        </div>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>

                            <div class="text-subtitle-2 mb-2 font-weight-bold">安全策略 (Security Policies)</div>
                            <v-list density="compact" class="bg-grey-lighten-4 rounded border">
                                <v-list-item title="None" subtitle="不加密 (仅用于调试)"></v-list-item>
                                <v-list-item title="Basic256Sha256" subtitle="签名并加密 (推荐)"></v-list-item>
                                <v-list-item title="Aes128_Sha256_RsaOaep" subtitle="签名并加密"></v-list-item>
                            </v-list>
                        </v-window-item>

                        <!-- Authentication -->
                        <v-window-item value="auth" class="pa-4">
                            <div class="text-h6 mb-1">身份认证 (Authentication)</div>
                            <p class="text-body-2 text-grey mb-4">配置客户端连接时的身份验证方式。</p>

                            <div class="text-subtitle-2 mb-2 font-weight-bold">支持的认证模式</div>
                            <v-expansion-panels variant="accordion" class="mb-4">
                                <v-expansion-panel title="匿名登录 (Anonymous)">
                                    <v-expansion-panel-text class="text-body-2">
                                        如果配置中启用了匿名访问，客户端可以选择 <strong>Anonymous</strong> 方式登录，无需用户名和密码。<br>
                                        <span class="text-warning">注意：生产环境建议禁用匿名访问。</span>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                                <v-expansion-panel title="用户名/密码 (Username/Password)">
                                    <v-expansion-panel-text class="text-body-2">
                                        客户端选择 <strong>Username</strong> 方式，并输入配置中预设的用户名和密码。<br>
                                        可以在 "配置" -> "用户管理" 中添加或修改用户。
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-window-item>

                        <!-- Subscription -->
                        <v-window-item value="subscription" class="pa-4">
                            <div class="text-h6 mb-1">数据订阅 (Subscription)</div>
                            <p class="text-body-2 text-grey mb-4">浏览地址空间并订阅点位数据。</p>

                            <div class="text-subtitle-2 mb-2 font-weight-bold">地址空间结构 (Address Space)</div>
                            <v-sheet class="bg-grey-lighten-4 text-grey-darken-4 pa-3 rounded code-block mb-4 border" style="font-family: monospace; font-size: 13px;">
                                <div class="mb-1">Root</div>
                                <div class="pl-4 mb-1">└── Objects</div>
                                <div class="pl-8 mb-1">└── <span class="text-primary">DeviceName</span> (设备名称)</div>
                                <div class="pl-12">└── <span class="text-success">PointName</span> (点位名称)</div>
                            </v-sheet>

                            <div class="text-subtitle-2 mb-2 font-weight-bold">NodeID 格式</div>
                            <p class="text-caption text-grey mb-2">
                                点位 NodeID 通常采用 String 类型，格式为 <code>ns=2;s=DeviceName/PointName</code>。
                            </p>
                            <v-table density="compact" class="border rounded mb-4">
                                <thead>
                                    <tr>
                                        <th>属性</th>
                                        <th>值</th>
                                        <th>说明</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Namespace Index (ns)</td>
                                        <td>2</td>
                                        <td>默认命名空间索引</td>
                                    </tr>
                                    <tr>
                                        <td>Identifier Type</td>
                                        <td>String (s)</td>
                                        <td>字符串标识符</td>
                                    </tr>
                                    <tr>
                                        <td>Identifier</td>
                                        <td>Device/Point</td>
                                        <td>设备名/点位名组合</td>
                                    </tr>
                                </tbody>
                            </v-table>

                            <div class="text-subtitle-2 mb-2 font-weight-bold">常见问题</div>
                            <ul class="text-caption text-grey pl-4">
                                <li class="mb-1">如果无法浏览到设备节点，请检查设备是否已在"设备管理"中添加并启用。</li>
                                <li class="mb-1">如果读取值为 BadWaitingForInitialData，表示设备尚未采集到有效数据。</li>
                                <li>客户端订阅间隔建议不低于设备采集周期的 1/2。</li>
                            </ul>
                        </v-window-item>
                    </v-window>
                </div>
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
                        <v-row>
                            <v-col cols="12" md="8">
                                <v-text-field v-model="mqttDialog.config.client_id" label="Client ID" variant="outlined" density="compact" class="mb-2"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-btn color="secondary" variant="outlined" block class="mb-2" @click="autoFillTopics" height="40">
                                    <v-icon start icon="mdi-auto-fix"></v-icon>
                                    一键生成推荐主题
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-text-field v-model="mqttDialog.config.topic" label="发布主题" variant="outlined" density="compact" class="mb-2"></v-text-field>
                        <v-text-field v-model="mqttDialog.config.subscribe_topic" label="订阅主题 (用于写入)" placeholder="/things/{client_id}/write/req" persistent-placeholder variant="outlined" density="compact" class="mb-2"></v-text-field>
                        <v-text-field v-model="mqttDialog.config.write_response_topic" label="写入响应主题" placeholder="默认: 订阅主题/resp" persistent-placeholder variant="outlined" density="compact" class="mb-2"></v-text-field>
                        <v-switch v-model="mqttDialog.config.ignore_offline_data" label="设备离线时不主动上报数据" color="primary" hide-details class="mb-2" hint="当设备离线（所有点位采集失败）时，停止上报周期数据" persistent-hint></v-switch>
                        
                        <v-divider class="my-4"></v-divider>
                        <div class="text-subtitle-1 mb-2 font-weight-bold">子设备事件上报 (Device Events)</div>
                        <v-text-field v-model="mqttDialog.config.device_lifecycle_topic" label="子设备生命周期主题 (Add/Remove)" placeholder="默认: things/{client_id}/lifecycle" persistent-placeholder variant="outlined" density="compact" class="mb-2" hint="子设备添加、删除事件将发布到此主题"></v-text-field>
                        
                        <v-divider class="my-4"></v-divider>
                        <div class="text-subtitle-1 mb-2 font-weight-bold">子设备状态上报 (Device Status)</div>
                        <v-text-field v-model="mqttDialog.config.status_topic" label="状态主题 (在线/离线)" placeholder="默认: things/{client_id}/{device_id}/status" persistent-placeholder variant="outlined" density="compact" class="mb-2" hint="支持 {client_id} 和 {device_id} 变量"></v-text-field>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-textarea v-model="mqttDialog.config.online_payload" label="上线消息内容 (JSON)" placeholder='{"status":"online"}' rows="3" variant="outlined" density="compact"></v-textarea>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-textarea v-model="mqttDialog.config.offline_payload" label="离线消息内容 (JSON)" placeholder='{"status":"offline"}' rows="3" variant="outlined" density="compact"></v-textarea>
                            </v-col>
                        </v-row>
                        
                        <v-divider class="my-4"></v-divider>
                        <div class="text-subtitle-1 mb-2 font-weight-bold">遗嘱配置 (LWT)</div>
                        <v-text-field v-model="mqttDialog.config.lwt_topic" label="遗嘱主题 (LWT)" placeholder="可选: 默认为状态主题" persistent-placeholder variant="outlined" density="compact" class="mb-2" hint="客户端意外断开时，Broker 将向此主题发布遗嘱消息"></v-text-field>
                        <v-textarea v-model="mqttDialog.config.lwt_payload" label="遗嘱消息内容 (LWT)" placeholder='{"status":"lwt"}' rows="3" variant="outlined" density="compact"></v-textarea>
                        
                        <div class="text-caption text-grey mb-2">
                            支持变量: %device_id% (设备ID/ClientID), %timestamp% (时间戳)
                        </div>
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

        <!-- HTTP Settings Dialog -->
        <v-dialog v-model="httpDialog.visible" max-width="1024px">
            <v-card>
                <v-card-title class="text-h5 pa-4">HTTP 推送配置</v-card-title>
                <v-tabs v-model="httpDialog.activeTab" bg-color="primary">
                    <v-tab value="basic">基本配置</v-tab>
                    <v-tab value="auth">认证配置</v-tab>
                    <v-tab value="endpoints">端点配置</v-tab>
                    <v-tab value="devices">设备映射</v-tab>
                </v-tabs>
                <v-card-text style="height: 500px; overflow-y: auto;">
                    <v-form>
                        <!-- Basic Configuration -->
                        <v-window v-model="httpDialog.activeTab">
                            <v-window-item value="basic">
                                <v-row class="mt-2">
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="httpDialog.config.id" label="配置ID" variant="outlined" density="compact" readonly></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="httpDialog.config.name" label="配置名称" variant="outlined" density="compact"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <v-switch v-model="httpDialog.config.enable" label="启用 HTTP 推送" color="primary" inset hide-details></v-switch>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field v-model="httpDialog.config.url" label="服务器地址 (Base URL)" hint="例: http://192.168.1.100:8080/api" persistent-hint variant="outlined" density="compact"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-select v-model="httpDialog.config.method" label="请求方法" :items="['POST', 'PUT']" variant="outlined" density="compact"></v-select>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field v-model="httpDialog.config.headers" label="自定义 Headers (JSON)" variant="outlined" density="compact" hint='例: {"Content-Type": "application/json"}'></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-window-item>

                            <!-- Authentication Configuration -->
                            <v-window-item value="auth">
                                <v-row class="mt-2">
                                    <v-col cols="12">
                                        <v-select v-model="httpDialog.config.auth_type" label="认证方式" :items="['None', 'Basic', 'Bearer', 'APIKey']" variant="outlined" density="compact"></v-select>
                                    </v-col>
                                </v-row>
                                <v-row v-if="httpDialog.config.auth_type === 'Basic'">
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="httpDialog.config.username" label="用户名" variant="outlined" density="compact"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="httpDialog.config.password" label="密码" type="password" variant="outlined" density="compact"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row v-if="httpDialog.config.auth_type === 'Bearer'">
                                    <v-col cols="12">
                                        <v-text-field v-model="httpDialog.config.token" label="Bearer Token" variant="outlined" density="compact"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row v-if="httpDialog.config.auth_type === 'APIKey'">
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="httpDialog.config.api_key_name" label="API Key 名称" hint="例: X-API-Key" persistent-hint variant="outlined" density="compact"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="httpDialog.config.api_key_value" label="API Key 值" type="password" variant="outlined" density="compact"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-window-item>

                            <!-- Endpoints Configuration -->
                            <v-window-item value="endpoints">
                                <v-row class="mt-2">
                                    <v-col cols="12">
                                        <v-text-field v-model="httpDialog.config.data_endpoint" label="数据端点" hint="相对路径，例: /data 会组合为 http://server/data" persistent-hint variant="outlined" density="compact"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field v-model="httpDialog.config.device_event_endpoint" label="设备事件端点" hint="设备上下线和生命周期事件，例: /events" persistent-hint variant="outlined" density="compact"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <v-divider class="my-2"></v-divider>
                                        <div class="text-caption text-grey">缓存配置</div>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-switch v-model="httpDialog.config.cache.enable" label="启用离线缓存" color="primary" inset hide-details></v-switch>
                                    </v-col>
                                </v-row>
                                <v-row v-if="httpDialog.config.cache.enable">
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model.number="httpDialog.config.cache.max_count" label="最大缓存消息数" type="number" hint="默认 1000" persistent-hint variant="outlined" density="compact"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="httpDialog.config.cache.flush_interval" label="重试间隔" hint="例: 1m, 30s" persistent-hint variant="outlined" density="compact"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-window-item>

                            <!-- Device Mapping -->
                            <v-window-item value="devices">
                                <v-row class="mt-2">
                                    <v-col cols="12">
                                        <div class="text-subtitle-1 mb-2 font-weight-bold">设备映射设置</div>
                                        <div v-if="allDevices.length === 0" class="text-grey text-caption">暂无设备</div>
                                        <v-table density="compact" class="border rounded" v-else>
                                            <thead>
                                                <tr>
                                                    <th>设备名称</th>
                                                    <th style="width: 120px;">启用</th>
                                                    <th style="width: 160px;">上报策略</th>
                                                    <th style="width: 120px;">间隔</th>
                                                    <th>通道</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="dev in allDevices" :key="dev.id">
                                                    <td>{{ dev.name }} ({{ dev.id }})</td>
                                                    <td>
                                                        <v-checkbox-btn v-model="httpDialog.config.devices[dev.id].enable" color="primary"></v-checkbox-btn>
                                                    </td>
                                                    <td>
                                                        <v-select
                                                            v-model="httpDialog.config.devices[dev.id].strategy"
                                                            :items="[{ title: '实时', value: 'realtime' }, { title: '定期', value: 'periodic' }]"
                                                            item-title="title"
                                                            item-value="value"
                                                            density="compact"
                                                            variant="outlined"
                                                        ></v-select>
                                                    </td>
                                                    <td>
                                                        <v-text-field v-model="httpDialog.config.devices[dev.id].interval" density="compact" variant="outlined" placeholder="10s"></v-text-field>
                                                    </td>
                                                    <td>{{ dev.channelName }}</td>
                                                </tr>
                                            </tbody>
                                        </v-table>
                                    </v-col>
                                </v-row>
                            </v-window-item>
                        </v-window>
                    </v-form>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="httpDialog.visible = false">取消</v-btn>
                    <v-btn color="primary" variant="elevated" @click="saveHttpSettings" :loading="httpDialog.loading">保存配置</v-btn>
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
                        <div class="text-subtitle-1 mb-2 font-weight-bold">安全策略 (Security Policy)</div>
                        <v-select
                            v-model="opcuaDialog.config.security_policy"
                            :items="[
                                { title: '自动 (Auto - Allow All)', value: 'Auto' },
                                { title: '允许不加密 (None)', value: 'None' },
                                { title: 'Basic256 (Sign & Encrypt)', value: 'Basic256' },
                                { title: 'Basic256Sha256 (Sign & Encrypt)', value: 'Basic256Sha256' }
                            ]"
                            label="安全策略"
                            variant="outlined"
                            density="compact"
                            hint="指定允许的连接安全策略。'Auto' 允许所有。"
                            persistent-hint
                        ></v-select>
                        
                        <v-text-field 
                            v-model="opcuaDialog.config.trusted_cert_path" 
                            label="受信任证书目录" 
                            placeholder="/path/to/trusted/certs" 
                            variant="outlined" 
                            density="compact"
                            class="mt-2"
                            hint="存放客户端可信证书的目录 (可选)"
                            persistent-hint
                        ></v-text-field>

                        <v-divider class="my-4"></v-divider>
                        <div class="text-subtitle-1 mb-2 font-weight-bold">身份认证 (Authentication)</div>
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
        <v-dialog v-model="opcuaStatsDialog.visible" max-width="900px" content-class="glass-dialog-wrapper">
            <v-card class="glass-dialog">
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

                    <v-divider class="my-4"></v-divider>

                    <!-- Log Viewer Control Bar -->
                    <div class="d-flex align-center mb-2">
                        <v-icon icon="mdi-console-line" size="small" color="grey" class="mr-2"></v-icon>
                        <span class="text-subtitle-2 font-weight-bold">实时日志 (OPC UA)</span>
                        <v-spacer></v-spacer>
                        
                        <v-switch
                            v-model="opcuaStatsDialog.isStreaming"
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
                            @click="downloadOpcuaLogs"
                            class="mr-2"
                        >
                            下载日志
                        </v-btn>
                    </div>

                    <!-- Log Viewer Area -->
                    <v-card variant="outlined" class="log-viewer-container rounded bg-white">
                        <div class="log-content pa-2" style="height: 300px; overflow-y: auto; font-family: monospace; font-size: 12px;">
                            <div v-if="opcuaPaginatedLogs.length === 0" class="text-center text-grey mt-12">暂无日志...</div>
                            <div v-for="(log, idx) in opcuaPaginatedLogs" :key="idx" class="log-line border-b">
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
                                v-if="opcuaStatsDialog.logs.length > 0"
                                v-model="opcuaStatsDialog.page"
                                :length="opcuaPageCount"
                                :total-visible="5"
                                density="compact"
                                size="small"
                            ></v-pagination>
                        </div>
                    </v-card>
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

const location_host = ref('')
onMounted(() => {
    location_host.value = window.location.host
})
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

const autoFillTopics = () => {
    if (!mqttDialog.config.client_id) {
        mqttDialog.config.client_id = 'edge-gateway'
    }
    
    // Use {client_id} variable supported by backend
    const root = `things/{client_id}`
    
    mqttDialog.config.topic = `${root}/up`
    mqttDialog.config.subscribe_topic = `${root}/down/req`
    mqttDialog.config.write_response_topic = `${root}/down/resp`
    
    mqttDialog.config.status_topic = `${root}/{device_id}/status`
    mqttDialog.config.device_lifecycle_topic = `${root}/lifecycle`
    mqttDialog.config.lwt_topic = `${root}/lwt`
    
    mqttDialog.config.online_payload = JSON.stringify({
        status: "online",
        device_id: "%device_id%",
        timestamp: "%timestamp%"
    })
    mqttDialog.config.offline_payload = JSON.stringify({
        status: "offline",
        device_id: "%device_id%",
        timestamp: "%timestamp%"
    })
    mqttDialog.config.lwt_payload = JSON.stringify({
        status: "lwt",
        device_id: "%device_id%",
        timestamp: "%timestamp%"
    })
    
    showMessage('已自动生成推荐的主题配置', 'success')
}

const httpDialog = reactive({
    visible: false,
    loading: false,
    activeTab: 'basic',
    config: {
        id: '',
        name: '',
        enable: true,
        url: '',
        method: 'POST',
        headers: {},
        auth_type: 'None',
        username: '',
        password: '',
        token: '',
        api_key_name: '',
        api_key_value: '',
        data_endpoint: '',
        device_event_endpoint: '',
        cache: {
            enable: true,
            max_count: 1000,
            flush_interval: '1m'
        },
        devices: {}
    }
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
    } else if (type === 'http') {
        openHttpSettings(null)
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
            http: data.http || [],
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
            device_lifecycle_topic: '',
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

// HTTP Logic
const openHttpSettings = async (item) => {
    await fetchAllDevices()
    if (item) {
        httpDialog.config = JSON.parse(JSON.stringify(item))
    } else {
        // New config
        httpDialog.config = {
            id: 'http_' + Date.now(),
            enable: true,
            name: 'New HTTP',
            url: 'http://localhost:8080',
            method: 'POST',
            headers: {},
            auth_type: 'None',
            username: '',
            password: '',
            token: '',
            api_key_name: '',
            api_key_value: '',
            data_endpoint: '/api/data',
            device_event_endpoint: '/api/events',
            cache: {
                enable: true,
                max_count: 1000,
                flush_interval: '1m'
            },
            devices: {}
        }
    }
    
    if (!httpDialog.config.devices) httpDialog.config.devices = {}
    
    // Initialize defaults for all devices (use object like MQTT to show more details in UI)
    allDevices.value.forEach(dev => {
        const current = httpDialog.config.devices[dev.id]
        if (current === undefined || current === null) {
            httpDialog.config.devices[dev.id] = {
                enable: false,
                strategy: 'periodic',
                interval: '10s'
            }
        } else if (typeof current === 'boolean') {
            httpDialog.config.devices[dev.id] = {
                enable: current,
                strategy: 'periodic',
                interval: '10s'
            }
        } else if (typeof current === 'object') {
            if (current.enable === undefined) current.enable = !!current
            if (!current.strategy) current.strategy = 'periodic'
            if (!current.interval) current.interval = '10s'
        }
    })
    
    httpDialog.visible = true
}

const saveHttpSettings = async () => {
    httpDialog.loading = true
    try {
        // Prepare payload: convert device objects back to booleans (enable) for backward compatibility
        const payload = JSON.parse(JSON.stringify(httpDialog.config))
        if (payload.devices && typeof payload.devices === 'object') {
            for (const k of Object.keys(payload.devices)) {
                const v = payload.devices[k]
                if (v && typeof v === 'object') {
                    payload.devices[k] = !!v.enable
                } else {
                    payload.devices[k] = !!v
                }
            }
        }

        await request.post('/api/northbound/http', payload)
        showMessage('HTTP 配置已保存', 'success')
        httpDialog.visible = false
        fetchConfig()
    } catch (e) {
        showMessage('保存失败: ' + e.message, 'error')
    } finally {
        httpDialog.loading = false
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
            security_policy: 'Auto',
            trusted_cert_path: '',
            devices: {},
            auth_methods: ['Anonymous'],
            users: {},
            cert_file: '',
            key_file: ''
        }
    }
    
    // Ensure devices map exists
    if (!opcuaDialog.config.devices) opcuaDialog.config.devices = {}
    
    // Ensure security fields exist
    if (!opcuaDialog.config.security_policy) opcuaDialog.config.security_policy = 'Auto'
    if (!opcuaDialog.config.trusted_cert_path) opcuaDialog.config.trusted_cert_path = ''

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

const opcuaHelpDialog = reactive({
    visible: false,
    activeTab: 'connection',
    endpoint: '',
    port: 4840
})

const openOpcuaHelp = (item) => {
    opcuaHelpDialog.endpoint = item.endpoint || ''
    opcuaHelpDialog.port = item.port || 4840
    opcuaHelpDialog.visible = true
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
    },
    logs: [],
    page: 1,
    isStreaming: true
})

const opcuaPaginatedLogs = computed(() => {
    const start = (opcuaStatsDialog.page - 1) * 20
    const end = start + 20
    return opcuaStatsDialog.logs.slice(start, end)
})

const opcuaPageCount = computed(() => {
    return Math.ceil(opcuaStatsDialog.logs.length / 20) || 1
})

const downloadOpcuaLogs = () => {
    const rows = opcuaStatsDialog.logs.map(log => {
        const ts = log.ts ? new Date(log.ts).toLocaleString() : ''
        const level = (log.level || 'INFO').toUpperCase()
        const msg = log.msg || ''
        return `[${ts}] [${level}] ${msg}`
    })
    
    const content = rows.join('\n')
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `opcua_logs_${new Date().toISOString().slice(0,19).replace(/[:T]/g, '-')}.log`
    link.click()
    URL.revokeObjectURL(link.href)
}

let statsTimer = null
let opcuaWs = null

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
    opcuaStatsDialog.logs = []
}

watch(() => opcuaStatsDialog.visible, (val) => {
    if (val) {
        refreshOpcuaStats(false)
        statsTimer = setInterval(() => refreshOpcuaStats(true), 3000)

        // WebSocket for logs
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
        
        opcuaWs = new WebSocket(`${protocol}//${host}/api/ws/logs?token=${token}`)
        opcuaWs.onmessage = (event) => {
            if (!opcuaStatsDialog.isStreaming) return
            try {
                const log = JSON.parse(event.data)
                // Filter for opcua-server component
                if (log.component === 'opcua-server') {
                    opcuaStatsDialog.logs.unshift(log)
                    if (opcuaStatsDialog.logs.length > 500) opcuaStatsDialog.logs.pop()
                }
            } catch(e) {}
        }

    } else {
        if (statsTimer) {
            clearInterval(statsTimer)
            statsTimer = null
        }
        if (opcuaWs) {
            opcuaWs.close()
            opcuaWs = null
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
    if (opcuaWs) opcuaWs.close()
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
