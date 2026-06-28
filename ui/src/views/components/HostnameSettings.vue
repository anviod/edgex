<template>
  <a-card class="settings-panel">
    <a-card-header>
      <div class="card-title">主机设置</div>
    </a-card-header>
    <a-card-body>
      <a-form :model="modelValue" layout="vertical" class="industrial-form">
        <a-form-item field="name" label="设备名称">
          <a-input v-model="modelValue.name" placeholder="输入设备名称" class="rect-input" />
          <div class="form-hint">裸主机名需客户端 DNS 指向本机 IP（macOS 上通常不可用）；推荐使用 mDNS 或直接 IP 访问</div>
        </a-form-item>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item field="http_port" label="HTTP 端口">
              <a-input-number v-model="modelValue.http_port" :min="1" :max="65535" class="rect-input" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="https_port" label="HTTPS 端口">
              <a-input-number v-model="modelValue.https_port" :min="1" :max="65535" class="rect-input" disabled />
              <div class="form-hint">HTTPS 尚未启用，当前仅 HTTP 可用</div>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item field="interfaces" label="绑定接口">
          <a-select
            v-model="modelValue.interfaces"
            :options="networkInterfaces.map(i => ({ label: i.name, value: i.name }))"
            mode="multiple"
            placeholder="留空则绑定所有可用接口"
            class="rect-input"
          />
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item field="enable_mdns" label="mDNS 服务">
              <a-switch v-model="modelValue.enable_mdns" type="round" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="enable_bare" label="裸主机名">
              <a-switch v-model="modelValue.enable_bare" type="round" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <div class="form-footer">
          <a-button type="primary" @click="$emit('save')">应用设置</a-button>
        </div>
      </a-form>

      <a-divider />

      <div class="card-title">访问状态</div>
      <div class="mb-4">
        <a-tag :color="mdnsActive ? 'green' : 'gray'" size="small" class="mr-2">
          mDNS：{{ mdnsActive ? '广播中' : '未广播' }}
        </a-tag>
        <a-tag :color="dnsProxyActive ? 'green' : 'gray'" size="small">
          DNS 代理：{{ dnsProxyActive ? '运行中' : '未运行' }}
        </a-tag>
      </div>
      <div v-if="mdnsError" class="form-hint mb-4">{{ mdnsError }}</div>
      <div v-if="dnsProxyError || dnsProxyNote" class="form-hint mb-4">{{ dnsProxyError || dnsProxyNote }}</div>

      <div class="access-list">
        <div v-if="directUrls.length" class="access-item">
          <div class="access-title">直接 IP 访问（最可靠）</div>
          <div v-for="url in directUrls" :key="url" class="access-subtitle mono-text">{{ url }}</div>
        </div>
        <div class="access-item">
          <div class="access-title">mDNS 访问（推荐）</div>
          <div class="access-subtitle mono-text">{{ mdnsUrl }}</div>
        </div>
        <div class="access-item">
          <div class="access-title">HTTP 访问（裸主机名，需 DNS 代理）</div>
          <div class="access-subtitle mono-text">{{ bareHttpUrl }}</div>
        </div>
      </div>
    </a-card-body>
  </a-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  networkInterfaces: {
    type: Array,
    default: () => []
  },
  accessStatus: {
    type: Object,
    default: null
  }
})

defineEmits(['update:modelValue', 'save'])

const mdnsActive = computed(() => props.accessStatus?.mdns?.active ?? props.modelValue.enable_mdns)
const dnsProxyActive = computed(() => props.accessStatus?.dns_proxy?.active ?? false)
const mdnsError = computed(() => props.accessStatus?.mdns?.error || '')
const dnsProxyError = computed(() => props.accessStatus?.dns_proxy?.error || '')
const dnsProxyNote = computed(() => props.accessStatus?.dns_proxy?.note || '')
const directUrls = computed(() => props.accessStatus?.direct_urls || [])
const mdnsUrl = computed(() => {
  if (props.accessStatus?.mdns_urls?.length) {
    return props.accessStatus.mdns_urls[0]
  }
  return `http://${props.modelValue.name || 'device-name'}.local:${props.modelValue.http_port}`
})
const bareHttpUrl = computed(() => `http://${props.modelValue.name || 'device-name'}:${props.modelValue.http_port}`)
</script>

<style scoped>
/* v3.0 — styles in src/styles/ */
</style>
