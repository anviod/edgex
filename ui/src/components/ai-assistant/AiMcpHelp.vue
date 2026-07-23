<template>
  <div class="ai-mcp-help">
    <!-- MCP Server 状态 -->
    <div class="ai-workbench-section">
      <h3 class="ai-workbench-section__title">MCP Server 状态</h3>
      <div class="ai-mcp-status">
        <span class="ai-mcp-status__dot" :class="mcpStatus ? 'ai-mcp-status__dot--online' : 'ai-mcp-status__dot--offline'"></span>
        <span class="ai-mcp-status__label">{{ mcpStatus ? '运行中' : '检查中...' }}</span>
        <span v-if="mcpInfo" class="ai-mcp-status__version">MCP {{ mcpInfo.protocol }}</span>
      </div>
      <div v-if="mcpInfo" class="ai-mcp-info-grid">
        <div class="ai-mcp-info-item">
          <span class="ai-mcp-info-item__label">传输协议</span>
          <code>{{ mcpInfo.transport }}</code>
        </div>
        <div class="ai-mcp-info-item">
          <span class="ai-mcp-info-item__label">端点</span>
          <code>{{ mcpInfo.endpoint }}</code>
        </div>
        <div class="ai-mcp-info-item">
          <span class="ai-mcp-info-item__label">工具数</span>
          <code>{{ mcpInfo.tools || 0 }}</code>
        </div>
        <div class="ai-mcp-info-item">
          <span class="ai-mcp-info-item__label">认证方式</span>
          <code>{{ mcpInfo.auth_mode || 'api_key' }}</code>
        </div>
      </div>
    </div>

    <!-- 全功能激活 -->
    <div class="ai-workbench-section">
      <h3 class="ai-workbench-section__title">全功能激活</h3>
      <p class="ai-workbench-section__hint">
        MCP 默认仅提供只读查询能力。开启全功能后，外部 LLM 可通过 MCP 协议执行创建通道、设备、点位、边缘规则、虚拟设备、读写测试等操作。
      </p>

      <div class="ai-mcp-activation">
        <div class="ai-mcp-activation__row">
          <div class="ai-mcp-activation__info">
            <span class="ai-mcp-activation__label">全功能读写</span>
            <span class="ai-mcp-activation__desc" :class="mcpFullAccess ? 'ai-mcp-activation__desc--on' : 'ai-mcp-activation__desc--off'">
              {{ mcpFullAccess ? '已激活 — 所有 CRUD 操作可用' : '未激活 — 仅支持只读查询' }}
            </span>
          </div>
          <a-switch
            :model-value="mcpFullAccess"
            :loading="activating"
            @change="toggleFullAccess"
          />
        </div>

        <div class="ai-mcp-activation__row">
          <div class="ai-mcp-activation__info">
            <span class="ai-mcp-activation__label">MCP API Key</span>
            <span class="ai-mcp-activation__desc">
              {{ mcpApiKeySet ? '已设置（' + (mcpApiKeyMasked || '****') + '）' : '未设置 — 需要设置后才能连接' }}
            </span>
          </div>
          <a-button type="outline" size="mini" @click="showApiKeyInput = !showApiKeyInput">
            {{ showApiKeyInput ? '取消' : '设置' }}
          </a-button>
        </div>

        <div v-if="showApiKeyInput" class="ai-mcp-api-key-input">
          <a-input-password
            v-model="newApiKey"
            placeholder="输入 MCP API Key（至少 8 位）"
            allow-clear
            style="flex: 1"
          />
          <a-button size="small" :loading="generating" @click="generateKey">
            生成密钥
          </a-button>
          <a-button type="primary" size="small" :loading="savingKey" @click="saveApiKey">
            保存
          </a-button>
        </div>
      </div>
    </div>

    <!-- 接入方式 -->
    <div class="ai-workbench-section">
      <h3 class="ai-workbench-section__title">接入方式</h3>
      <p class="ai-workbench-section__hint">
        外部 LLM 应用通过 MCP 协议安全操作 EdgeX 工业网关。使用 MCP API Key 简化认证（无需 JWT）。
      </p>

      <div class="ai-mcp-client-tabs">
        <button
          v-for="c in clients"
          :key="c.name"
          type="button"
          class="ai-mcp-client-tab"
          :class="{ 'ai-mcp-client-tab--active': activeClient === c.name }"
          @click="activeClient = c.name"
        >
          {{ c.name }}
        </button>
      </div>

      <div class="ai-mcp-config-wrap">
        <div class="ai-mcp-config-head">
          <span class="ai-mcp-config-head__label">配置示例</span>
          <button
            type="button"
            class="ai-mcp-config-copy"
            @click="copyConfig"
            :title="copied ? '已复制' : '复制配置'"
          >
            <svg v-if="copied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>{{ copied ? '已复制' : '复制' }}</span>
          </button>
        </div>
        <pre class="ai-mcp-config-code"><code>{{ currentConfig }}</code></pre>
      </div>
    </div>

    <!-- MCP 工具清单 -->
    <div class="ai-workbench-section">
      <h3 class="ai-workbench-section__title">MCP 工具清单 ({{ toolList.length }} 个)</h3>

      <!-- 只读工具 -->
      <div class="ai-mcp-tool-category">
        <span class="ai-mcp-tool-category__label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          只读查询（无需全功能激活）
        </span>
      </div>
      <div class="ai-mcp-tools-list">
        <div
          v-for="tool in readTools"
          :key="tool.name"
          class="ai-mcp-tool-card"
        >
          <div class="ai-mcp-tool-card__head">
            <code class="ai-mcp-tool-card__name">{{ tool.name }}</code>
          </div>
          <p class="ai-mcp-tool-card__desc">{{ tool.desc }}</p>
        </div>
      </div>

      <!-- 全功能工具 -->
      <div class="ai-mcp-tool-category">
        <span class="ai-mcp-tool-category__label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          全功能 CRUD（需激活全功能）
        </span>
      </div>
      <div class="ai-mcp-tools-list">
        <div
          v-for="tool in writeTools"
          :key="tool.name"
          class="ai-mcp-tool-card"
          :class="{ 'ai-mcp-tool-card--locked': !mcpFullAccess }"
        >
          <div class="ai-mcp-tool-card__head">
            <code class="ai-mcp-tool-card__name">{{ tool.name }}</code>
            <span v-if="!mcpFullAccess" class="ai-mcp-tool-card__badge ai-mcp-tool-card__badge--locked">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
          </div>
          <p class="ai-mcp-tool-card__desc">{{ tool.desc }}</p>
        </div>
      </div>
    </div>

    <!-- 安全说明 -->
    <div class="ai-workbench-section">
      <h3 class="ai-workbench-section__title">安全说明</h3>
      <ul class="ai-mcp-security">
        <li>全功能 CRUD 操作（创建/删除/写入）需要用户在 UI 中确认激活</li>
        <li>所有操作通过 MCP API Key 认证（<code>Authorization: Bearer &lt;key&gt;</code> 或 <code>X-MCP-API-Key</code>）</li>
        <li>MCP API Key 独立于系统 JWT，可随时更换</li>
        <li>敏感配置信息（API Key、密码）已脱敏处理</li>
        <li>MCP 端点仅在内网暴露，建议配合防火墙规则使用</li>
      </ul>
    </div>

    <div class="ai-mcp-footer">
      <a-button type="primary" size="small" @click="refreshStatus">
        {{ loading ? '检查中...' : '刷新状态' }}
      </a-button>
      <a-button size="small" @click="openMCPDocs">
        查看完整文档
      </a-button>
    </div>

    <!-- MCP 完整文档抽屉 -->
    <a-drawer
      v-model:visible="docsVisible"
      title="MCP 接入完整文档"
      :width="560"
      :footer="false"
      unmount-on-close
      render-to-body
    >
      <div class="ai-mcp-docs-content" v-html="docsHtml"></div>
    </a-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'

const mcpStatus = ref(false)
const mcpInfo = ref(null)
const loading = ref(false)
const activeClient = ref('Claude Desktop')
const copied = ref(false)
const activating = ref(false)
const savingKey = ref(false)
const generating = ref(false)
const showApiKeyInput = ref(false)
const newApiKey = ref('')

// MCP 激活状态
const mcpFullAccess = ref(false)
const mcpApiKeySet = ref(false)
const mcpApiKeyMasked = ref('')

// 文档抽屉
const docsVisible = ref(false)
const docsHtml = ref('')

// 客户端列表
const clients = [
  { name: 'Claude Desktop', config: '{"mcpServers":{"edgex":{"url":"<host>/api/mcp","headers":{"Authorization":"Bearer <mcp_api_key>"}}}}' },
  { name: 'Cursor', config: '{"mcpServers":{"edgex":{"url":"<host>/api/mcp","headers":{"Authorization":"Bearer <mcp_api_key>"}}}}' },
  { name: 'Windsurf', config: '{"mcpServers":{"edgex":{"url":"<host>/api/mcp","headers":{"Authorization":"Bearer <mcp_api_key>"}}}}' },
  { name: 'Continue.dev', config: '{"mcpServers":{"edgex":{"transport":{"type":"http","url":"<host>/api/mcp"},"auth":{"type":"bearer","token":"<mcp_api_key>"}}}}' }
]

// 只读工具
const readTools = [
  { name: 'edgex_list_channels', desc: '列出所有采集通道及其状态', category: 'read' },
  { name: 'edgex_list_devices', desc: '列出指定通道下的所有设备', category: 'read' },
  { name: 'edgex_list_points', desc: '列出指定设备下的所有点位（含当前值）', category: 'read' },
  { name: 'edgex_read_point', desc: '读取指定点位的当前实时值', category: 'read' },
  { name: 'edgex_get_system_info', desc: '获取 EdgeX 网关系统信息', category: 'read' },
  { name: 'edgex_get_diagnostics', desc: '获取通道或设备的诊断信息', category: 'read' },
  { name: 'edgex_analyze_protocol', desc: '分析工业协议特征（端口/名称匹配）', category: 'read' },
  { name: 'edgex_get_protocol_help', desc: '获取指定工业协议的接入帮助', category: 'read' }
]

// 全功能 CRUD 工具
const writeTools = [
  { name: 'edgex_write_point', desc: '向指定点位写入控制值', category: 'write' },
  { name: 'edgex_read_point_batch', desc: '批量读取多个点位实时值（测试验证）', category: 'write' },
  { name: 'edgex_write_point_batch', desc: '批量写入多个点位值（测试验证）', category: 'write' },
  { name: 'edgex_create_channel', desc: '创建南向采集通道（自动配置协议驱动）', category: 'write' },
  { name: 'edgex_delete_channel', desc: '删除指定通道（含设备/点位）', category: 'write' },
  { name: 'edgex_start_channel', desc: '启动通道采集引擎', category: 'write' },
  { name: 'edgex_stop_channel', desc: '停止通道采集引擎', category: 'write' },
  { name: 'edgex_create_device', desc: '在通道下创建设备（自动配置从站地址）', category: 'write' },
  { name: 'edgex_delete_device', desc: '删除指定设备（含点位）', category: 'write' },
  { name: 'edgex_create_point', desc: '创建设备采集点位（自动配置地址/类型/缩放）', category: 'write' },
  { name: 'edgex_delete_point', desc: '删除指定点位', category: 'write' },
  { name: 'edgex_create_edge_rule', desc: '创建边缘计算规则（阈值/计算/状态/窗口）', category: 'write' },
  { name: 'edgex_delete_edge_rule', desc: '删除边缘计算规则', category: 'write' },
  { name: 'edgex_create_virtual_device', desc: '创建虚拟设备（公式计算，不占用物理连接）', category: 'write' }
]

const toolList = computed(() => [...readTools, ...writeTools])

const currentConfig = computed(() => {
  const client = clients.find(c => c.name === activeClient.value)
  if (!client) return ''

  const host = window.location.origin
  return client.config.replace('<host>', host).replace('<mcp_api_key>', '<your-mcp-api-key>')
})

// 切换全功能
async function toggleFullAccess(val) {
  if (val && !mcpApiKeySet.value) {
    Message.warning('请先设置 MCP API Key')
    return
  }

  activating.value = true
  try {
    const token = getAuthToken()
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    const resp = await fetch('/api/mcp/activate', {
      method: 'POST',
      headers,
      body: JSON.stringify({ full_access: val })
    })
    const data = await resp.json()
    if (data.code === '0') {
      mcpFullAccess.value = data.data.mcp_full_access
      Message.success(val ? '全功能已激活，外部 LLM 可执行所有 CRUD 操作' : '全功能已关闭，仅保留只读查询')
    } else {
      Message.error(data.message || '操作失败')
    }
  } catch {
    Message.error('网络错误')
  } finally {
    activating.value = false
  }
}

// 自动生成 MCP API Key
async function generateKey() {
  generating.value = true
  try {
    const token = getAuthToken()
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    const resp = await fetch('/api/mcp/generate-key', { method: 'POST', headers })
    const data = await resp.json()
    if (data.code === '0') {
      newApiKey.value = data.data.api_key
      Message.success('已生成 64 位随机密钥（256 位安全强度）')
    } else {
      Message.error(data.message || '生成失败')
    }
  } catch {
    Message.error('网络错误')
  } finally {
    generating.value = false
  }
}

// 保存 API Key
async function saveApiKey() {
  const key = newApiKey.value.trim()
  if (!key || key.length < 8) {
    Message.warning('API Key 至少需要 8 位字符')
    return
  }

  savingKey.value = true
  try {
    const token = getAuthToken()
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    const resp = await fetch('/api/mcp/activate', {
      method: 'POST',
      headers,
      body: JSON.stringify({ api_key: key, full_access: mcpFullAccess.value })
    })
    const data = await resp.json()
    if (data.code === '0') {
      mcpApiKeySet.value = true
      mcpApiKeyMasked.value = key.substring(0, 4) + '****'
      showApiKeyInput.value = false
      newApiKey.value = ''
      Message.success('MCP API Key 已保存')
    } else {
      Message.error(data.message || '保存失败')
    }
  } catch {
    Message.error('网络错误')
  } finally {
    savingKey.value = false
  }
}

// 复制配置
function copyConfig() {
  if (!currentConfig.value) return
  navigator.clipboard.writeText(currentConfig.value).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }).catch(() => {
    Message.warning('复制失败，请手动选择复制')
  })
}

// 刷新状态
async function refreshStatus() {
  loading.value = true
  try {
    const token = getAuthToken()
    const headers = { 'Content-Type': 'application/json' }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const resp = await fetch('/api/mcp', { headers })
    if (resp.ok) {
      mcpInfo.value = await resp.json()
      mcpStatus.value = true
    } else {
      mcpStatus.value = false
    }

    const statusResp = await fetch('/api/mcp/status', { headers })
    if (statusResp.ok) {
      const statusData = await statusResp.json()
      if (statusData.code === '0') {
        mcpFullAccess.value = statusData.data.mcp_full_access
        mcpApiKeySet.value = statusData.data.mcp_api_key_set
      }
    }
  } catch {
    mcpStatus.value = false
  } finally {
    loading.value = false
  }
}

// 获取 JWT token（与 request.js 一致）
function getAuthToken() {
  try {
    const raw = localStorage.getItem('loginInfo')
    if (raw) {
      const parsed = JSON.parse(raw)
      return parsed.token || (parsed.data && parsed.data.token) || ''
    }
  } catch { /* ignore */ }
  return ''
}

// 内联打开 MCP 文档
async function openMCPDocs() {
  docsVisible.value = true
  if (docsHtml.value) return

  try {
    const token = getAuthToken()
    const headers = { 'Content-Type': 'application/json' }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    const resp = await fetch('/api/mcp/help', { headers })
    if (resp.ok) {
      const data = await resp.json()
      docsHtml.value = renderHelpDoc(data)
    } else {
      docsHtml.value = `<p class="ai-mcp-docs-error">请求失败 (${resp.status})：请确认已登录系统</p>`
    }
  } catch {
    docsHtml.value = '<p class="ai-mcp-docs-error">无法加载文档，请检查网络连接</p>'
  }
}

function renderHelpDoc(data) {
  if (!data) return '<p>无数据</p>'

  let html = ''

  // Description
  html += `<div class="ai-mcp-docs-section">
    <h4>概述</h4>
    <p>${esc(data.description || '')}</p>
  </div>`

  // Transport
  html += `<div class="ai-mcp-docs-section">
    <h4>传输协议</h4>
    <table class="ai-mcp-docs-table">
      <tr><td class="ai-mcp-docs-table__k">传输方式</td><td>${esc(data.transport || '')}</td></tr>
      <tr><td class="ai-mcp-docs-table__k">端点</td><td><code>${esc(data.endpoint || '')}</code></td></tr>
      <tr><td class="ai-mcp-docs-table__k">认证方式</td><td>${esc(data.auth_mode || '')}</td></tr>
      <tr><td class="ai-mcp-docs-table__k">认证头</td><td><code>${esc(data.auth_header || '')}</code></td></tr>
    </table>
  </div>`

  // MCP status
  html += `<div class="ai-mcp-docs-section">
    <h4>服务状态</h4>
    <table class="ai-mcp-docs-table">
      <tr><td class="ai-mcp-docs-table__k">MCP 已启用</td><td>${data.mcp_enabled ? '是' : '否'}</td></tr>
      <tr><td class="ai-mcp-docs-table__k">全功能激活</td><td>${data.full_access ? '是' : '否'}</td></tr>
    </table>
  </div>`

  // Client configs
  if (data.clients?.length) {
    html += `<div class="ai-mcp-docs-section">
      <h4>客户端配置</h4>`
    for (const c of data.clients) {
      html += `<h5>${esc(c.name)}</h5>
      <pre class="ai-mcp-docs-code"><code>${esc(c.config)}</code></pre>`
    }
    html += `</div>`
  }

  // Tools
  if (data.tools?.length) {
    html += `<div class="ai-mcp-docs-section">
      <h4>MCP 工具 (${data.tools.length} 个)</h4>
      <ul class="ai-mcp-docs-list">`
    for (const t of data.tools) {
      html += `<li><code>${esc(t)}</code></li>`
    }
    html += `</ul></div>`
  }

  // Resources
  if (data.resources?.length) {
    html += `<div class="ai-mcp-docs-section">
      <h4>资源 (${data.resources.length} 个)</h4>
      <ul class="ai-mcp-docs-list">`
    for (const r of data.resources) {
      html += `<li><code>${esc(r)}</code></li>`
    }
    html += `</ul></div>`
  }

  // Security
  if (data.security) {
    html += `<div class="ai-mcp-docs-section">
      <h4>安全说明</h4>
      <p>${esc(data.security)}</p>
    </div>`
  }

  return html
}

function esc(s) {
  if (!s) return ''
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
</script>