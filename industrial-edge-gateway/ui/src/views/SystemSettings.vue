<template>
  <v-container fluid>
    <v-card class="glass-card">
      <v-toolbar color="transparent" density="compact">
        <v-toolbar-title class="text-h6 font-weight-bold text-primary">系统设置</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tabs v-model="activeTab" color="primary" align-tabs="end">
          <v-tab value="time">时间设置</v-tab>
          <v-tab value="network">网络配置</v-tab>
          <v-tab value="routes">静态路由</v-tab>
          <v-tab value="ha">双机热备</v-tab>
          <v-tab value="hostname">主机名</v-tab>
          <v-tab value="ldap">LDAP 设置</v-tab>
          <v-tab value="status">系统状态</v-tab>
        </v-tabs>
      </v-toolbar>

      <v-card-text>
        <v-window v-model="activeTab">
          <!-- 1. Time Settings -->
          <v-window-item value="time">
            <v-row>
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4">
                  <v-card-title>时间模式</v-card-title>
                  <v-radio-group v-model="timeConfig.mode" color="primary">
                    <v-radio label="手动设置" value="manual"></v-radio>
                    <v-radio label="NTP 自动同步" value="ntp"></v-radio>
                  </v-radio-group>
                </v-card>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4" v-if="timeConfig.mode === 'manual'">
                  <v-card-title>手动设置</v-card-title>
                  <v-card-text>
                    <v-text-field label="日期时间" v-model="timeConfig.manual.datetime" type="datetime-local"></v-text-field>
                    <v-select label="时区" v-model="timeConfig.manual.timezone" :items="['Asia/Shanghai', 'UTC']"></v-select>
                    <v-switch label="写入硬件时间 (RTC)" v-model="timeConfig.manual.sync_rtc" color="primary"></v-switch>
                    <v-btn color="primary" block @click="saveTimeConfig">应用设置</v-btn>
                  </v-card-text>
                </v-card>

                <v-card variant="outlined" class="pa-4" v-if="timeConfig.mode === 'ntp'">
                  <v-card-title>NTP 配置</v-card-title>
                  <v-card-text>
                    <v-combobox label="NTP 服务器" v-model="timeConfig.ntp.servers" multiple chips closable-chips hint="输入服务器地址按回车添加"></v-combobox>
                    <v-text-field label="同步周期 (小时)" v-model="timeConfig.ntp.interval" type="number"></v-text-field>
                    <v-switch label="启用 NTP 服务" v-model="timeConfig.ntp.enabled" color="primary"></v-switch>
                    <v-btn color="primary" block @click="saveTimeConfig">应用设置</v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- 2. Network Configuration -->
          <v-window-item value="network">
            <v-table>
              <thead>
                <tr>
                  <th>接口名</th>
                  <th>MAC 地址</th>
                  <th>链路状态</th>
                  <th>IP 地址</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="iface in networkInterfaces" :key="iface.name">
                  <td>{{ iface.name }}</td>
                  <td>{{ iface.mac }}</td>
                  <td>
                    <v-chip size="small" :color="iface.status === 'UP' ? 'success' : 'error'">{{ iface.status }}</v-chip>
                  </td>
                  <td>
                    <div v-for="(ipConf, idx) in iface.ip_configs" :key="idx">
                      <v-chip size="x-small" v-if="ipConf.enabled">{{ ipConf.address }}/{{ ipConf.prefix }} ({{ ipConf.version }})</v-chip>
                    </div>
                  </td>
                  <td>
                    <v-btn size="small" variant="text" color="primary" @click="editInterface(iface)">配置</v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>

            <v-divider class="my-4"></v-divider>

            <v-card variant="outlined">
              <v-toolbar density="compact" color="transparent">
                <v-toolbar-title class="text-subtitle-1">连通性验证 (配置变更时自动检查)</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn prepend-icon="mdi-plus" size="small" variant="text" @click="addConnectivityTarget">添加检查目标</v-btn>
              </v-toolbar>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th>类型</th>
                    <th>目标 (IP/URL)</th>
                    <th>超时 (秒)</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(target, i) in connectivityTargets" :key="i">
                    <td style="width: 150px">
                      <v-select v-model="target.type" :items="['gateway', 'ip', 'http']" density="compact" hide-details variant="underlined"></v-select>
                    </td>
                    <td>
                      <v-text-field v-model="target.target" density="compact" hide-details variant="underlined" placeholder="例如: 8.8.8.8 或 http://baidu.com"></v-text-field>
                    </td>
                    <td style="width: 100px">
                      <v-text-field v-model.number="target.timeout" type="number" density="compact" hide-details variant="underlined"></v-text-field>
                    </td>
                    <td style="width: 50px">
                      <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="removeConnectivityTarget(i)"></v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-window-item>

          <!-- 3. Static Routes -->
          <v-window-item value="routes">
            <v-toolbar density="compact" color="transparent">
              <v-spacer></v-spacer>
              <v-btn prepend-icon="mdi-plus" color="primary" @click="openRouteDialog()">添加路由</v-btn>
            </v-toolbar>
            <v-table>
              <thead>
                <tr>
                  <th>目标网段</th>
                  <th>网关</th>
                  <th>出接口</th>
                  <th>优先级</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(route, idx) in staticRoutes" :key="idx">
                  <td>{{ route.destination }}/{{ route.prefix }}</td>
                  <td>{{ route.gateway }}</td>
                  <td>{{ route.interface }}</td>
                  <td>{{ route.metric }}</td>
                  <td>
                    <v-switch v-model="route.enabled" color="success" hide-details density="compact" @update:modelValue="saveConfig"></v-switch>
                  </td>
                  <td>
                    <v-btn icon="mdi-pencil" size="small" variant="text" color="primary" @click="openRouteDialog(route, idx)"></v-btn>
                    <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="deleteRoute(idx)"></v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-window-item>

          <!-- 4. HA (Dual Host Backup) -->
          <v-window-item value="ha">
             <v-row>
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4">
                  <v-card-title>角色配置</v-card-title>
                  <v-radio-group v-model="haConfig.role" color="primary">
                    <v-radio label="主机 (Master)" value="master"></v-radio>
                    <v-radio label="备机 (Backup)" value="backup"></v-radio>
                  </v-radio-group>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4">
                  <v-card-title>心跳检测</v-card-title>
                  <v-select label="心跳方式" v-model="haConfig.heartbeat_type" :items="['TCP', 'UDP', 'HTTP']"></v-select>
                  <v-text-field label="心跳周期 (秒)" v-model.number="haConfig.interval" type="number"></v-text-field>
                  <v-text-field label="超时阈值 (秒)" v-model.number="haConfig.timeout" type="number"></v-text-field>
                  <v-btn color="primary" block class="mt-4">保存配置</v-btn>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- 5. Hostname -->
          <v-window-item value="hostname">
            <v-row>
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4">
                  <v-card-title>主机名设置</v-card-title>
                  <v-text-field label="设备名称" v-model="hostnameConfig.name" hint="访问地址: http://device-name"></v-text-field>
                  
                  <v-row>
                    <v-col cols="6">
                       <v-text-field label="HTTP 端口" v-model.number="hostnameConfig.http_port" type="number"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                       <v-text-field label="HTTPS 端口" v-model.number="hostnameConfig.https_port" type="number"></v-text-field>
                    </v-col>
                  </v-row>

                  <v-select
                    label="绑定网口"
                    v-model="hostnameConfig.interfaces"
                    :items="networkInterfaces.map(i => i.name)"
                    multiple
                    chips
                    hint="留空则绑定所有可用接口"
                    persistent-hint
                  ></v-select>

                  <v-switch label="启用 mDNS (Avahi 兼容)" v-model="hostnameConfig.enable_mdns" color="primary"></v-switch>
                  <v-switch label="启用裸主机名访问 (内置 DNS)" v-model="hostnameConfig.enable_bare" color="primary"></v-switch>
                  
                  <v-btn color="primary" block class="mt-4" @click="saveConfig">应用设置</v-btn>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card variant="tonal" class="pa-4">
                  <v-card-title>访问状态</v-card-title>
                  <v-chip color="success" size="small" class="mb-2">广播状态: 正常</v-chip>
                  <v-list density="compact">
                    <v-list-item title="HTTP 访问" :subtitle="`http://${hostnameConfig.name}:${hostnameConfig.http_port}`"></v-list-item>
                    <v-list-item title="HTTPS 访问" :subtitle="`https://${hostnameConfig.name}:${hostnameConfig.https_port}`"></v-list-item>
                    <v-list-item title="mDNS 访问" :subtitle="`http://${hostnameConfig.name}.local:${hostnameConfig.http_port}`"></v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- 6. LDAP Settings -->
          <v-window-item value="ldap">
            <v-row>
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4">
                  <v-card-title>LDAP 连接配置</v-card-title>
                  <v-switch label="启用 LDAP 登录" v-model="ldapConfig.enabled" color="primary"></v-switch>
                  <v-text-field label="服务器地址" v-model="ldapConfig.server" placeholder="ldap.example.com"></v-text-field>
                  <v-text-field label="端口" v-model.number="ldapConfig.port" type="number" placeholder="389"></v-text-field>
                  <v-text-field label="Base DN" v-model="ldapConfig.base_dn" placeholder="dc=example,dc=com"></v-text-field>
                  <v-row>
                    <v-col cols="6">
                      <v-switch label="使用 SSL (LDAPS)" v-model="ldapConfig.use_ssl" color="primary"></v-switch>
                    </v-col>
                    <v-col cols="6">
                      <v-switch label="跳过证书验证" v-model="ldapConfig.skip_verify" color="warning" :disabled="!ldapConfig.use_ssl"></v-switch>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4">
                  <v-card-title>认证与搜索配置</v-card-title>
                  <v-text-field label="Bind DN (留空则匿名)" v-model="ldapConfig.bind_dn" placeholder="cn=admin,dc=example,dc=com"></v-text-field>
                  <v-text-field label="Bind Password" v-model="ldapConfig.bind_password" type="password"></v-text-field>
                  <v-text-field label="用户过滤器" v-model="ldapConfig.user_filter" placeholder="(uid=%s)" hint="%s 将被替换为用户名"></v-text-field>
                  <v-text-field label="属性映射" v-model="ldapConfig.attributes" placeholder="uid,cn,mail"></v-text-field>
                  <v-btn color="primary" block class="mt-4" @click="saveConfig">应用 LDAP 设置</v-btn>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- 7. System Status -->
          <v-window-item value="status">
            <v-alert type="success" variant="tonal" class="mb-4">系统运行正常</v-alert>
            <v-btn color="warning" class="mr-2">重启系统</v-btn>
            <v-btn color="error">恢复出厂设置</v-btn>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>

    <!-- Interface Edit Dialog -->
    <v-dialog v-model="interfaceDialog.visible" max-width="80%">
      <v-card>
        <v-toolbar density="compact" color="primary">
          <v-toolbar-title>配置接口 {{ interfaceDialog.form.name }}</v-toolbar-title>
          <v-tabs v-model="interfaceDialog.activeTab" align-tabs="end">
            <v-tab value="ip">IP 地址</v-tab>
            <v-tab value="gateway">网关</v-tab>
            <v-tab value="advanced">高级</v-tab>
          </v-tabs>
        </v-toolbar>
        
        <v-card-text>
          <v-window v-model="interfaceDialog.activeTab">
            <!-- IP Config Tab -->
            <v-window-item value="ip">
              <v-toolbar density="compact" variant="flat">
                <v-spacer></v-spacer>
                <v-btn prepend-icon="mdi-plus" size="small" variant="text" @click="addIpConfig">添加 IP</v-btn>
              </v-toolbar>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th>地址</th>
                    <th>掩码长度</th>
                    <th>版本</th>
                    <th>来源</th>
                    <th>启用</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(ip, i) in interfaceDialog.form.ip_configs" :key="i">
                    <td><v-text-field v-model="ip.address" density="compact" hide-details variant="underlined"></v-text-field></td>
                    <td style="width: 80px"><v-text-field v-model.number="ip.prefix" type="number" density="compact" hide-details variant="underlined"></v-text-field></td>
                    <td style="width: 100px"><v-select v-model="ip.version" :items="['IPv4', 'IPv6']" density="compact" hide-details variant="underlined"></v-select></td>
                    <td style="width: 100px"><v-select v-model="ip.source" :items="['Static', 'DHCP']" density="compact" hide-details variant="underlined"></v-select></td>
                    <td style="width: 60px"><v-switch v-model="ip.enabled" color="success" density="compact" hide-details></v-switch></td>
                    <td style="width: 50px"><v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="removeIpConfig(i)"></v-btn></td>
                  </tr>
                </tbody>
              </v-table>
            </v-window-item>

            <!-- Gateway Config Tab -->
            <v-window-item value="gateway">
              <v-toolbar density="compact" variant="flat">
                <v-spacer></v-spacer>
                <v-btn prepend-icon="mdi-plus" size="small" variant="text" @click="addGatewayConfig">添加网关</v-btn>
              </v-toolbar>
               <v-table density="compact">
                <thead>
                  <tr>
                    <th>网关地址</th>
                    <th>Metric</th>
                    <th>范围</th>
                    <th>启用</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(gw, i) in interfaceDialog.form.gateways" :key="i">
                    <td><v-text-field v-model="gw.gateway" density="compact" hide-details variant="underlined"></v-text-field></td>
                    <td style="width: 80px"><v-text-field v-model.number="gw.metric" type="number" density="compact" hide-details variant="underlined"></v-text-field></td>
                    <td style="width: 100px"><v-select v-model="gw.scope" :items="['Global', 'Link']" density="compact" hide-details variant="underlined"></v-select></td>
                    <td style="width: 60px"><v-switch v-model="gw.enabled" color="success" density="compact" hide-details></v-switch></td>
                    <td style="width: 50px"><v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="removeGatewayConfig(i)"></v-btn></td>
                  </tr>
                </tbody>
              </v-table>
            </v-window-item>

            <!-- Advanced Tab -->
            <v-window-item value="advanced">
              <v-row class="mt-2">
                <v-col cols="6">
                  <v-text-field label="接口 Metric" v-model.number="interfaceDialog.form.interface_metric" type="number"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field label="MTU" v-model.number="interfaceDialog.form.mtu" type="number"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="MAC 地址" v-model="interfaceDialog.form.mac" readonly variant="filled"></v-text-field>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="interfaceDialog.visible = false">取消</v-btn>
          <v-btn color="primary" @click="saveInterface">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Route Edit Dialog -->
    <v-dialog v-model="routeDialog.visible" max-width="80%">
      <v-card>
        <v-card-title>{{ routeDialog.index === -1 ? '添加路由' : '编辑路由' }}</v-card-title>
        <v-card-text>
          <v-text-field label="目标网段 (CIDR)" v-model="routeDialog.form.destination" hint="例如: 192.168.2.0"></v-text-field>
          <v-text-field label="前缀长度" v-model.number="routeDialog.form.prefix" type="number"></v-text-field>
          <v-text-field label="下一跳网关" v-model="routeDialog.form.gateway"></v-text-field>
          <v-select label="出接口" v-model="routeDialog.form.interface" :items="networkInterfaces.map(i => i.name)"></v-select>
          <v-text-field label="优先级 (Metric)" v-model.number="routeDialog.form.metric" type="number"></v-text-field>
          <v-switch label="启用" v-model="routeDialog.form.enabled" color="primary"></v-switch>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="routeDialog.visible = false">取消</v-btn>
          <v-btn color="primary" @click="saveRoute">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import request from '@/utils/request'

const activeTab = ref('time')

// Time Settings Data
const timeConfig = reactive({
  mode: 'manual',
  manual: {
    datetime: '',
    timezone: 'Asia/Shanghai',
    sync_rtc: true
  },
  ntp: {
    servers: ['pool.ntp.org'],
    interval: 1,
    enabled: true
  }
})

// Network Settings Data
const networkInterfaces = ref([])
const connectivityTargets = ref([])

const interfaceDialog = reactive({
  visible: false,
  activeTab: 'ip',
  form: { 
    name: '', 
    mac: '',
    mtu: 1500,
    interface_metric: 100,
    ip_configs: [],
    gateways: []
  }
})

const routeDialog = reactive({
  visible: false,
  index: -1, // -1 for new
  form: {
    destination: '',
    prefix: 24,
    gateway: '',
    interface: '',
    metric: 100,
    enabled: true
  }
})

// Routes Data
const staticRoutes = ref([])

// HA Config
const haConfig = reactive({
  role: 'master',
  heartbeat_type: 'UDP',
  interval: 2,
  timeout: 5,
  retries: 3
})

// Hostname Config
const hostnameConfig = reactive({
  name: 'edge-gateway',
  enable_mdns: true,
  enable_bare: true,
  http_port: 8082,
  https_port: 443,
  interfaces: []
})

// LDAP Config
const ldapConfig = reactive({
  enabled: false,
  server: '',
  port: 389,
  base_dn: '',
  bind_dn: '',
  bind_password: '',
  user_filter: '(uid=%s)',
  attributes: '',
  use_ssl: false,
  skip_verify: false
})

const API_BASE = '/api/system'

const loadConfig = async () => {
  try {
    const [sysRes, netRes] = await Promise.all([
      request.get(API_BASE),
      request.get(API_BASE + '/network/interfaces')
    ])
    
    const configData = sysRes || {}
    if (configData.time) Object.assign(timeConfig, configData.time)
    if (configData.routes) staticRoutes.value = configData.routes
    if (configData.ha) Object.assign(haConfig, configData.ha)
    if (configData.hostname) Object.assign(hostnameConfig, configData.hostname)
    if (configData.ldap) Object.assign(ldapConfig, configData.ldap)

    if (Array.isArray(netRes)) {
      const liveInterfaces = netRes
      // Merge config state (e.g. enabled status) into live interfaces
      if (configData.network) {
        liveInterfaces.forEach(live => {
          const cfg = configData.network.find(c => c.name === live.name)
          if (cfg) {
            live.enabled = cfg.enabled
            // If live has no IPs (e.g. disconnected), but config has static, maybe we should show config's IPs?
            // For now, trust live for IPs, but trust config for administrative state.
          }
        })
      }
      networkInterfaces.value = liveInterfaces
    } else if (configData.network) {
      networkInterfaces.value = configData.network
    }
  } catch (e) {
    console.error('Failed to load system config', e)
  }
}

const saveConfig = async () => {
  const fullConfig = {
    time: timeConfig,
    network: networkInterfaces.value,
    routes: staticRoutes.value,
    ha: haConfig,
    hostname: hostnameConfig,
    ldap: ldapConfig
  }
  
  try {
    await request.put(API_BASE, fullConfig)
    // alert('配置保存成功') 
  } catch (e) {
    console.error('Failed to save config', e)
    // alert('配置保存失败')
  }
}

const saveTimeConfig = saveConfig

const editInterface = (iface) => {
  interfaceDialog.form = JSON.parse(JSON.stringify({
    name: iface.name,
    mac: iface.mac,
    mtu: iface.mtu || 1500,
    interface_metric: iface.interface_metric || 100,
    ip_configs: iface.ip_configs || [],
    gateways: iface.gateways || []
  }))
  interfaceDialog.activeTab = 'ip'
  interfaceDialog.visible = true
}

const saveInterface = () => {
  const idx = networkInterfaces.value.findIndex(i => i.name === interfaceDialog.form.name)
  if (idx !== -1) {
    Object.assign(networkInterfaces.value[idx], interfaceDialog.form)
    saveConfig()
  }
  interfaceDialog.visible = false
}

const addIpConfig = () => {
  interfaceDialog.form.ip_configs.push({
    address: '', prefix: 24, version: 'IPv4', source: 'Static', enabled: true
  })
}

const removeIpConfig = (idx) => {
  interfaceDialog.form.ip_configs.splice(idx, 1)
}

const addGatewayConfig = () => {
  interfaceDialog.form.gateways.push({
    gateway: '', metric: 100, interface: interfaceDialog.form.name, scope: 'Global', enabled: true
  })
}

const addConnectivityTarget = () => {
  connectivityTargets.value.push({
    type: 'ip', target: '', timeout: 2
  })
}

const removeConnectivityTarget = (idx) => {
  connectivityTargets.value.splice(idx, 1)
}

const removeGatewayConfig = (idx) => {
  interfaceDialog.form.gateways.splice(idx, 1)
}

const openRouteDialog = (route = null, index = -1) => {
  routeDialog.index = index
  if (route) {
    routeDialog.form = { ...route }
  } else {
    routeDialog.form = { destination: '', prefix: 24, gateway: '', interface: '', metric: 100, enabled: true }
  }
  routeDialog.visible = true
}

const saveRoute = () => {
  if (routeDialog.index === -1) {
    staticRoutes.value.push({ ...routeDialog.form })
  } else {
    staticRoutes.value[routeDialog.index] = { ...routeDialog.form }
  }
  routeDialog.visible = false
  saveConfig() // Optional: save immediately
}

const deleteRoute = (idx) => {
  staticRoutes.value.splice(idx, 1)
  saveConfig()
}

// Watch for changes/Save manually for routes/HA/Hostname? 
// For now, binding buttons to saveConfig or specific handlers.

onMounted(loadConfig)
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px);
}
</style>
