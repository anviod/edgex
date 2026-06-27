<template>
  <article class="help-doc">
    <header class="help-doc__hero">
      <span class="protocol-tag protocol-tag--accent">SNMP</span>
      <p class="help-doc__lead">
        简单网络管理协议（SNMP v2c / v3），通过 UDP（默认端口 161）采集网络设备 OID 点位，支持 GET/GETBULK/SET 与 MIB 扫描。
      </p>
    </header>
    <div class="help-doc__sections">
      <ChannelHelpBlock title="适用场景" text="路由器、交换机、服务器 SNMP Agent 监控；系统信息、接口流量、性能指标采集。" />
      <ChannelHelpBlock title="SNMP v2c 连接参数">
        <ChannelHelpParamList :items="v2cParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="SNMP v3 安全参数">
        <ChannelHelpParamList :items="v3Params" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="点位地址格式">
        <ChannelHelpParamList :items="pointParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="配置步骤">
        <ol class="help-doc-steps">
          <li>选择 SNMP 版本：v2c 使用 community；v3 填写 securityName 及认证/加密参数。</li>
          <li>填写目标设备 IP 与端口（默认 161）。</li>
          <li>点位地址格式：<code>community|OID</code>（v2c）或 <code>securityName|OID</code>（v3）。</li>
          <li>常用 OID：sysDescr <code>1.3.6.1.2.1.1.1.0</code>，sysUpTime <code>1.3.6.1.2.1.1.3.0</code>。</li>
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

const v2cParams = [
  { label: 'snmpVersion', example: 'v2c', desc: 'SNMP 版本' },
  { label: 'ip / targetIP', example: '192.168.1.1', desc: '目标设备 IP' },
  { label: 'port / targetPort', example: '161', desc: 'SNMP 端口' },
  { label: 'community', example: 'public', desc: '社区字符串（只读/读写）' },
  { label: 'timeout', example: '3000', desc: '超时（毫秒）' },
  { label: 'retries', example: '3', desc: '重试次数' },
  { label: 'maxBulkSize', example: '10', desc: 'GETBULK 最大重复数' },
]

const v3Params = [
  { label: 'snmpVersion', example: 'v3', desc: 'SNMP 版本' },
  { label: 'securityName', example: 'admin', desc: 'USM 用户名（必填）' },
  { label: 'securityLevel', example: 'authPriv', desc: 'noAuthNoPriv / authNoPriv / authPriv' },
  { label: 'authProtocol', example: 'SHA256', desc: 'MD5 / SHA1 / SHA224 / SHA256 / SHA384 / SHA512' },
  { label: 'authPassword', example: '***', desc: '认证密码（authNoPriv/authPriv 必填）' },
  { label: 'privProtocol', example: 'AES128', desc: 'DES / AES128 / AES192 / AES256' },
  { label: 'privPassword', example: '***', desc: '加密密码（authPriv 必填）' },
  { label: 'contextName', example: '', desc: '上下文名称（可选）' },
  { label: 'contextEngineID', example: '', desc: '上下文引擎 ID（可选）' },
]

const pointParams = [
  { label: 'v2c address', example: 'public|1.3.6.1.2.1.1.1.0', desc: 'community|OID' },
  { label: 'v3 address', example: 'admin|1.3.6.1.2.1.1.5.0', desc: 'securityName|OID' },
  { label: 'datatype', example: 'STRING / UINT32 / UINT64', desc: '与 SNMP ASN.1 类型对应' },
  { label: 'readwrite', example: 'R / RW', desc: '读或写（SET）' },
]

const faqItems = [
  { question: '连接失败？', answer: '检查 IP/端口、防火墙 UDP 161、community 或 v3 用户名/密码是否正确。' },
  { question: '读取 Bad？', answer: '确认 OID 存在且实例后缀正确（标量通常以 .0 结尾）。' },
  { question: 'v3 认证失败？', answer: 'securityLevel、authProtocol、privProtocol 须与设备配置完全一致。' },
  { question: '如何扫描 OID？', answer: '使用设备扫描功能，默认遍历 1.3.6.1.2.1 标准 MIB 子树。' },
]
</script>
