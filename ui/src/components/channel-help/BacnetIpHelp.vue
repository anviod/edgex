<template>
  <article class="help-doc">
    <header class="help-doc__hero">
      <span class="protocol-tag protocol-tag--accent">BACnet IP</span>
      <p class="help-doc__lead">
        楼宇自动化与控制网络协议（BACnet/IP），用于 HVAC、照明、门禁等 BMS 设备的数据采集与控制。
      </p>
    </header>
    <div class="help-doc__sections">
      <ChannelHelpBlock title="适用场景" text="暖通空调、冷机、风机盘管、BACnet 控制器及支持 BACnet/IP 的网关。" />
      <ChannelHelpBlock title="通道连接参数">
        <ChannelHelpParamList :items="connectionParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="点位寻址" text="对象类型 + 实例号，例如 AnalogInput:1、AnalogValue:10。支持 Who-Is 发现与点位扫描。" />
      <ChannelHelpBlock title="加密参数（可选）">
        <ChannelHelpParamList :items="securityParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="配置步骤">
        <ol class="help-doc-steps">
          <li>填写目标设备 IP；端口默认 47808（BACnet/IP 标准端口）。</li>
          <li>创建设备后可使用「扫描点位」自动发现对象。</li>
          <li>写入操作注意对象类型是否可写（AI 通常只读，AV/AO 可写）。</li>
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
  { label: 'IP 地址', example: '192.168.1.20', desc: '0.0.0.0 表示监听/广播场景按现场配置' },
  { label: '端口', example: '47808', desc: 'BACnet/IP 默认 UDP 端口' },
]

const securityParams = [
  { label: '密钥 / 证书 / CA', desc: '启用 BACnet Secure Connect 或设备要求 TLS 时配置' },
]

const faqItems = [
  { question: '扫描不到对象？', answer: '确认设备 BACnet 实例号、网段与 UDP 47808 未被防火墙拦截。' },
  { question: '写入失败？', answer: '检查对象是否可写，以及优先级（Priority）是否被更高优先级占用。' },
]
</script>
