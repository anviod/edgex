<template>
  <article class="help-doc">
    <header class="help-doc__hero">
      <span class="protocol-tag protocol-tag--accent">Modbus RTU Over TCP</span>
      <p class="help-doc__lead">
        在 TCP 连接上传输 Modbus RTU 帧，常见于串口服务器、DTU 或部分网关设备。帧格式为 RTU，传输层为以太网。
      </p>
    </header>
    <div class="help-doc__sections">
      <ChannelHelpBlock title="与 Modbus TCP 的区别" text="Modbus TCP 使用 MBAP 头；本模式在 TCP  socket 上直接封装 RTU PDU（含 CRC），URL  scheme 为 tcp+rtu://。" />
      <ChannelHelpBlock title="通道连接参数">
        <ChannelHelpParamList :items="connectionParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="高级参数">
        <ChannelHelpParamList :items="advancedParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="配置步骤">
        <ol class="help-doc-steps">
          <li>确认对端为 RTU-over-TCP 网关，而非标准 Modbus TCP PLC。</li>
          <li>URL 使用 <code>tcp+rtu://IP:端口</code>。</li>
          <li>设备级配置从站站号；串口参数由网关本地配置，本通道无需重复填写。</li>
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
  { label: 'URL', hint: 'RTU over TCP', example: 'tcp+rtu://192.168.1.50:502' },
  { label: '超时时间', desc: '建议 2000–5000 ms，串口服务器响应较慢时可加大' },
]

const advancedParams = [
  { label: '重试与指令间隔', desc: '与 Modbus TCP 相同，用于稳定串口侧转发' },
  { label: '起始地址 / 字节序', desc: '点位寻址规则与 Modbus 系列一致' },
]

const faqItems = [
  { question: '标准 Modbus TCP 能连上但本模式不行？', answer: '说明设备是 Modbus TCP 而非 RTU-over-TCP，应改用 Modbus TCP 协议。' },
  { question: 'CRC 错误频繁？', answer: '检查网关串口参数（波特率/校验）是否与下挂设备一致。' },
]
</script>
