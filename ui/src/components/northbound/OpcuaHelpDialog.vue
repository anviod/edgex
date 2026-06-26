<template>
  <a-modal v-model:visible="visible" title="OPC UA 接入文档" :width="900" :footer="false" unmount-on-close>
    <a-tabs v-model:active-key="activeTab" type="line">
      <a-tab-pane key="connection" title="连接配置">
        <div style="margin-bottom: 16px">
          <h4 style="margin: 0 0 8px">连接配置 (Connection)</h4>
          <p style="color: #6b7280; margin: 0 0 16px">使用 OPC UA 客户端（如 Prosys OPC UA Browser、UaExpert、SCADA）连接到本网关。</p>
        </div>

        <a-card :bordered="true" style="margin-bottom: 16px; border-color: #0ea5e9">
          <div style="font-size: 12px; font-weight: 600; color: #0ea5e9; margin-bottom: 8px">Endpoint URL (服务地址)</div>
          <div style="display: flex; align-items: center; background: var(--edgex-surface-inset); padding: 8px; font-size: 13px; font-weight: 500">
            <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">opc.tcp://{{ host }}:{{ port }}{{ endpoint }}</span>
            <a-button type="text" size="mini" @click="copyToClipboard('opc.tcp://' + host + ':' + port + endpoint)">
              <template #icon><icon-copy :size="12" /></template>
            </a-button>
          </div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 4px">提示：如果从外部访问，请将 localhost 替换为网关的实际 IP 地址。</div>
        </a-card>

        <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px">最佳实践 (Best Practices)</div>
        <a-alert type="success" style="margin-bottom: 16px">
          <div style="font-weight: 600; margin-bottom: 4px">生产环境推荐连接方式：</div>
          <ol style="margin: 0; padding-left: 20px">
            <li>Security Mode：<strong>SignAndEncrypt</strong>（签名并加密）</li>
            <li>Security Policy：<strong>Basic256Sha256</strong>（兼容性最好，Prosys / UaExpert 默认支持）</li>
            <li>证书信任：首次连接时客户端提示服务端证书不可信，请选择 <strong>Trust / Accept Permanently</strong></li>
            <li>身份认证：生产环境建议启用 <strong>用户名/密码</strong> 并禁用匿名访问</li>
          </ol>
        </a-alert>

        <a-alert type="info" style="margin-bottom: 16px">
          <strong>自动兼容模式（默认）：</strong>当服务端安全策略设为 <strong>Auto</strong> 时，网关会同时发布多种常用 Security Policy 与 Security Mode 组合，客户端可按自身能力自动协商连接。
        </a-alert>

        <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px">客户端指南</div>
        <a-collapse :default-active-key="['prosys']" style="margin-bottom: 16px">
          <a-collapse-item header="Prosys OPC UA Browser (推荐)" key="prosys">
            <p style="margin: 0 0 8px">功能强大的跨平台 OPC UA 客户端工具。</p>
            <div style="margin-bottom: 8px">
              <a href="https://downloads.prosysopc.com/opc-ua-browser-downloads.php" target="_blank">下载地址 (Download)</a>
            </div>
            <div style="background: var(--edgex-surface-inset); padding: 8px; border-radius: 0">
              <strong>连接步骤：</strong>
              <ol style="margin: 4px 0 0; padding-left: 20px">
                <li>输入 Endpoint URL (上文复制)。</li>
                <li>Security Mode 选择 <strong>SignAndEncrypt</strong>。</li>
                <li>Security Policy 选择 <strong>Basic256Sha256</strong>。</li>
                <li>点击 Connect，在弹出的证书警告中勾选 "Accept Permanently" 并确认。</li>
                <li>Identity 选择 Anonymous（若已启用）或 Username 并输入网关配置的用户名/密码。</li>
              </ol>
            </div>
          </a-collapse-item>
          <a-collapse-item header="Unified Automation UaExpert" key="uaexpert">
            <p style="margin: 0 0 8px">专业的 OPC UA 客户端。</p>
            <div style="background: var(--edgex-surface-inset); padding: 8px; border-radius: 0">
              <strong>连接步骤：</strong>
              <ol style="margin: 4px 0 0; padding-left: 20px">
                <li>添加 Server，双击 Custom Discovery 下的 URL。</li>
                <li>在 Endpoint 列表中选择 <strong>Basic256Sha256 - SignAndEncrypt</strong>（或客户端支持的其它已发布策略）。</li>
                <li>连接时点击 "Trust Server Certificate"。</li>
                <li>选择 Anonymous 或 Username 身份认证方式。</li>
              </ol>
            </div>
          </a-collapse-item>
        </a-collapse>

        <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px">服务端支持的 Security Policy</div>
        <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px">
          每种加密策略均提供 <strong>Sign</strong>（仅签名）与 <strong>SignAndEncrypt</strong>（签名并加密）两种 Security Mode。
        </p>
        <a-table :columns="securityColumns" :data="securityPolicies" size="small" :bordered="{ cell: true }" :pagination="false" style="margin-bottom: 16px" />

        <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px">Security Mode 说明</div>
        <a-table :columns="modeColumns" :data="securityModes" size="small" :bordered="{ cell: true }" :pagination="false" />
      </a-tab-pane>

      <a-tab-pane key="auth" title="身份认证">
        <div style="margin-bottom: 16px">
          <h4 style="margin: 0 0 8px">身份认证 (Authentication)</h4>
          <p style="color: #6b7280; margin: 0 0 16px">配置客户端连接时的身份验证方式。可在「北向 → OPC UA 服务端 → 安全与认证」中勾选启用。</p>
        </div>

        <a-collapse :default-active-key="['anonymous', 'username', 'certificate']">
          <a-collapse-item header="匿名登录 (Anonymous)" key="anonymous">
            <p style="margin: 0">如果配置中启用了匿名访问，客户端可以选择 <strong>Anonymous</strong> 方式登录，无需用户名和密码。</p>
            <a-alert type="warning" style="margin-top: 8px">注意：生产环境建议禁用匿名访问。</a-alert>
          </a-collapse-item>
          <a-collapse-item header="用户名/密码 (Username/Password)" key="username">
            <p style="margin: 0 0 8px">客户端选择 <strong>Username</strong> 方式，并输入在北向 OPC UA 通道配置中预设的用户名和密码。</p>
            <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 13px">
              <li>须在服务端配置中勾选「用户名/密码」并添加用户列表</li>
              <li>用户名/密码区分大小写</li>
              <li>可与任意已发布的 Security Policy 组合使用</li>
            </ul>
          </a-collapse-item>
          <a-collapse-item header="证书认证 (Certificate / X509)" key="certificate">
            <p style="margin: 0 0 8px">客户端使用 X509 用户证书登录。需在服务端勾选「证书」认证方式。</p>
            <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 13px">
              <li>客户端需提供有效的用户证书与私钥</li>
              <li>未配置受信任客户端证书时，默认信任自签名客户端证书（便于 Prosys / UaExpert 调试连接）</li>
              <li>上传「受信任客户端证书」后启用严格 PKI，仅接受列表中的证书</li>
              <li>服务端证书/私钥可在 OPC UA 通道配置中上传，持久化保存在数据库，启动时自动物化到本地目录</li>
            </ul>
          </a-collapse-item>
        </a-collapse>

        <a-alert type="info" style="margin-top: 16px">
          <strong>配置提示：</strong>安全策略设为 <strong>Auto</strong> 时自动发布全部常用加密组合；设为具体策略（如 Basic256Sha256）时仅发布该策略的加密端点，并关闭 None 明文端点。
        </a-alert>
      </a-tab-pane>

      <a-tab-pane key="subscription" title="数据订阅">
        <div style="margin-bottom: 16px">
          <h4 style="margin: 0 0 8px">数据订阅 (Subscription)</h4>
          <p style="color: #6b7280; margin: 0 0 16px">浏览地址空间并订阅点位数据。</p>
        </div>

        <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px">地址空间结构</div>
        <pre style="background: var(--edgex-surface-inset); padding: 12px; border-radius: 0; font-size: 13px; line-height: 1.5; border: 1px solid #e5e7eb; margin-bottom: 16px">Root
└── Objects
    └── Gateway
        └── Channels
            └── &lt;Channel&gt;
                └── Devices
                    └── &lt;Device&gt;
                        └── Points
                            └── &lt;Point&gt;</pre>

        <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px">NodeID 格式</div>
        <p style="color: #6b7280; margin: 0 0 16px; font-size: 13px">点位 NodeID 采用 String 类型，格式为 <code>ns=2;s=&lt;DeviceID&gt;.&lt;PointID&gt;</code>。</p>

        <a-table :columns="nodeIdColumns" :data="nodeIdData" size="small" :bordered="{ cell: true }" :pagination="false" style="margin-bottom: 16px" />

        <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px">常见问题</div>
        <ul style="color: #6b7280; font-size: 13px; padding-left: 20px; margin: 0">
          <li style="margin-bottom: 4px">如果无法浏览到设备节点，请检查设备是否已在"设备管理"中添加并启用，且已在 OPC UA 通道中勾选暴露。</li>
          <li style="margin-bottom: 4px">如果连接失败，请确认 Security Policy / Mode 与客户端选择一致，并信任服务端证书。</li>
          <li style="margin-bottom: 4px">如果读取值为 BadWaitingForInitialData，表示设备尚未采集到有效数据。</li>
          <li>客户端订阅间隔建议不低于设备采集周期的 1/2。</li>
        </ul>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { IconCopy } from '@arco-design/web-vue/es/icon'
import { showMessage } from '@/composables/useGlobalState'

const props = defineProps({
  visible: { type: Boolean, default: false },
  port: { type: Number, default: 4840 },
  endpoint: { type: String, default: '' }
})

const emit = defineEmits(['update:visible'])

const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})
const activeTab = ref('connection')
const host = ref('localhost')

onMounted(() => {
  host.value = window.location.host ? window.location.host.split(':')[0] : 'localhost'
})

const securityColumns = [
  { title: 'Security Policy', dataIndex: 'policy', width: 200 },
  { title: '说明', dataIndex: 'desc' },
  { title: '推荐', dataIndex: 'tag', width: 80 }
]

const securityPolicies = [
  { policy: 'None', desc: '不加密，仅用于本地调试', tag: '—' },
  { policy: 'Basic128Rsa15', desc: '旧版兼容策略', tag: '—' },
  { policy: 'Basic256', desc: 'SHA1 签名，部分旧客户端支持', tag: '—' },
  { policy: 'Basic256Sha256', desc: 'SHA256 签名并加密，工业客户端广泛支持', tag: '推荐' },
  { policy: 'Aes128_Sha256_RsaOaep', desc: 'AES128 加密，高安全场景', tag: '—' },
  { policy: 'Aes256_Sha256_RsaPss', desc: 'AES256 加密，最高安全等级', tag: '—' }
]

const modeColumns = [
  { title: 'Security Mode', dataIndex: 'mode', width: 160 },
  { title: '说明', dataIndex: 'desc' }
]

const securityModes = [
  { mode: 'None', desc: '无消息安全（仅 None 策略）' },
  { mode: 'Sign', desc: '消息签名，防篡改' },
  { mode: 'SignAndEncrypt', desc: '签名并加密，生产环境推荐' }
]

const nodeIdColumns = [
  { title: '属性', dataIndex: 'attr' },
  { title: '值', dataIndex: 'value' },
  { title: '说明', dataIndex: 'desc' }
]

const nodeIdData = [
  { attr: 'Namespace Index (ns)', value: '2', desc: '自定义节点命名空间' },
  { attr: 'Identifier Type', value: 'String (s)', desc: '字符串标识符' },
  { attr: 'Identifier', value: 'DeviceID.PointID', desc: '设备 ID 与点位 ID 以点号连接' }
]

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    showMessage('已复制到剪贴板', 'success')
  }).catch(() => {
    showMessage('复制失败', 'error')
  })
}
</script>
