<template>
  <div class="page-shell system-settings-page">
    <div class="page-header">
      <div>
        <h2 class="page-title">系统设置</h2>
        <p class="page-subtitle">时间、网络、高可用、认证与数据维护</p>
      </div>
    </div>

    <a-tabs v-model:active-key="activeTab" type="rounded" size="small" class="main-tabs">
      <a-tab-pane key="time" title="时间同步" />
      <a-tab-pane key="network" title="网络接口" />
      <a-tab-pane key="routes" title="静态路由" />
      <a-tab-pane key="ha" title="高可用集群" />
      <a-tab-pane key="hostname" title="主机设置" />
      <a-tab-pane key="ldap" title="LDAP 认证" />
      <a-tab-pane key="status" title="系统维护" />
      <a-tab-pane key="data" title="数据管理" />
    </a-tabs>

    <div class="settings-body">
      <TimeSettings
        v-if="activeTab === 'time'"
        v-model="timeConfig"
        @save="saveConfig"
      />

      <NetworkSettings
        v-if="activeTab === 'network' || activeTab === 'routes'"
        :active-tab="activeTab"
        :network-interfaces="networkInterfaces"
        :connectivity-targets="connectivityTargets"
        :static-routes="staticRoutes"
        @update:network-interfaces="(value) => networkInterfaces = value"
        @update:connectivity-targets="(value) => connectivityTargets = value"
        @update:static-routes="(value) => staticRoutes = value"
        @save="saveConfig"
      />

      <HASettings
        v-if="activeTab === 'ha'"
        v-model="haConfig"
        @save="saveConfig"
      />

      <HostnameSettings
        v-if="activeTab === 'hostname'"
        v-model="hostnameConfig"
        :network-interfaces="networkInterfaces"
        @save="saveConfig"
      />

      <LDAPSettings
        v-if="activeTab === 'ldap'"
        v-model="ldapConfig"
        @save="saveConfig"
      />

      <SystemMaintenance v-if="activeTab === 'status'" />

      <DatabaseManagement v-if="activeTab === 'data'" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import request from '@/utils/request'

import TimeSettings from './components/TimeSettings.vue'
import NetworkSettings from './components/NetworkSettings.vue'
import HASettings from './components/HASettings.vue'
import HostnameSettings from './components/HostnameSettings.vue'
import LDAPSettings from './components/LDAPSettings.vue'
import SystemMaintenance from './components/SystemMaintenance.vue'
import DatabaseManagement from './components/DatabaseManagement.vue'

const activeTab = ref('time')

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

const networkInterfaces = ref([])
const connectivityTargets = ref([])
const staticRoutes = ref([])

const haConfig = reactive({
  role: 'master',
  heartbeat_type: 'UDP',
  interval: 2,
  timeout: 5,
  retries: 3
})

const hostnameConfig = reactive({
  name: 'edgex',
  enable_mdns: true,
  enable_bare: true,
  http_port: 8080,
  https_port: 443,
  interfaces: []
})

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

const safeArray = (arr) => Array.isArray(arr) ? arr : []

const loadConfig = async () => {
  try {
    const [sysRes, netRes] = await Promise.all([
      request.get(API_BASE),
      request.get(API_BASE + '/network/interfaces')
    ])

    const configData = sysRes || {}
    if (configData.time) Object.assign(timeConfig, configData.time)
    if (Array.isArray(configData.routes)) staticRoutes.value = configData.routes
    if (configData.ha) Object.assign(haConfig, configData.ha)
    if (configData.hostname) Object.assign(hostnameConfig, configData.hostname)
    if (configData.ldap) Object.assign(ldapConfig, configData.ldap)

    if (Array.isArray(netRes)) {
      const liveInterfaces = netRes
      if (Array.isArray(configData.network)) {
        liveInterfaces.forEach(live => {
          const cfg = configData.network.find(c => c.name === live.name)
          if (cfg) {
            live.enabled = cfg.enabled
          }
        })
      }
      networkInterfaces.value = (liveInterfaces || []).map(iface => {
        const cleanedIface = {
          ...iface,
          ip_configs: [],
          gateways: []
        }
        cleanedIface.ip_configs = safeArray(iface.ip_configs)
          .filter(ip => ip && ip.address && typeof ip.address === 'string')
        cleanedIface.gateways = safeArray(iface.gateways)
          .filter(g => g && g.gateway)
        return cleanedIface
      })
    } else if (Array.isArray(configData.network)) {
      networkInterfaces.value = (configData.network || []).map(iface => {
        const cleanedIface = {
          ...iface,
          ip_configs: [],
          gateways: []
        }
        cleanedIface.ip_configs = safeArray(iface.ip_configs)
          .filter(ip => ip && ip.address && typeof ip.address === 'string')
        cleanedIface.gateways = safeArray(iface.gateways)
          .filter(g => g && g.gateway)
        return cleanedIface
      })
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
  } catch (e) {
    console.error('Failed to save config', e)
  }
}

onMounted(loadConfig)
</script>

<style scoped>
/* v3.0 — styles in src/styles/system-settings.css */
</style>
