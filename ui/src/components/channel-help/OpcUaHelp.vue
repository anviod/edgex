<template>
  <article class="help-doc">
    <header class="help-doc__hero">
      <span class="protocol-tag protocol-tag--accent">OPC UA</span>
      <p class="help-doc__lead">
        跨平台工业互操作标准，支持安全认证、订阅与 rich 类型系统，适合现代 PLC、SCADA 与 MES 对接。
      </p>
    </header>
    <div class="help-doc__sections">
      <ChannelHelpBlock title="适用场景" text="西门子/倍福等 OPC UA Server、边缘网关统一北向、需要证书与安全策略的场景。" />
      <ChannelHelpBlock title="通道连接参数">
        <ChannelHelpParamList :items="connectionParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="点位寻址" text="使用 NodeId，如 ns=2;s=Temperature 或 ns=3;i=1001。可通过 OPC UA 客户端或内置扫描获取。" />
      <ChannelHelpBlock title="配置步骤">
        <ol class="help-doc-steps">
          <li>Endpoint URL 格式：<code>opc.tcp://host:4840</code>（路径按服务器配置）。</li>
          <li>若服务器启用安全策略，需在服务端信任客户端证书或使用匿名/用户名模式（按设备支持）。</li>
          <li>创建设备后扫描或手动添加 Variable 类型节点。</li>
        </ol>
      </ChannelHelpBlock>
      <ChannelHelpBlock title="常见问题">
        <ChannelHelpFaq :items="faqItems" />
      </ChannelHelpBlock>
    </div>
  </article>
</template>

<script setup>
import ChannelHelpBlock from './ChannelHelpBlock.vue'
import ChannelHelpParamList from './ChannelHelpParamList.vue'
import ChannelHelpFaq from './ChannelHelpFaq.vue'

const connectionParams = [
  { label: 'Endpoint URL', example: 'opc.tcp://192.168.1.30:4840' },
]

const faqItems = [
  { question: 'BadCertificate 或安全错误？', answer: '检查安全模式/策略是否与服务器一致，必要时在服务器侧信任客户端。' },
  { question: 'NodeId 如何获取？', answer: '使用 UaExpert 等客户端浏览地址空间并复制 NodeId。' },
  { question: '连接慢或超时？', answer: 'OPC UA 握手与证书验证耗时较长，首次连接可耐心等待或检查网络延迟。' },
]
</script>
