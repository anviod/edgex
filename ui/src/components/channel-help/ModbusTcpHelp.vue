<template>
  <article class="help-doc">
    <header class="help-doc__hero">
      <span class="protocol-tag protocol-tag--accent">Modbus TCP</span>
      <p class="help-doc__lead">
        基于 TCP/IP 的 Modbus 协议，适用于以太网连接的 PLC、仪表与网关。单通道对应一台设备或一组从站（通过设备级站号区分）。
      </p>
    </header>
    <div class="help-doc__sections">
      <ChannelHelpBlock title="适用场景" text="工厂以太网采集、远程 I/O、支持 Modbus TCP 的变频器/温控器/能源表等。" />
      <ChannelHelpBlock title="通道连接参数">
        <ChannelHelpParamList :items="connectionParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="高级参数">
        <ChannelHelpParamList :items="advancedParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="配置步骤">
        <ol class="help-doc-steps">
          <li>填写通道 ID 与名称，协议选择 Modbus TCP。</li>
          <li>URL 填写 <code>tcp://设备IP:502</code>（端口按现场修改）。</li>
          <li>在通道下创建设备，配置从站站号（Slave ID）。</li>
          <li>添加点位，使用 40001/30001 等标准地址格式。</li>
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
  { label: 'URL', hint: '设备地址', example: 'tcp://192.168.1.10:502' },
  { label: '超时时间', desc: '单次请求超时，建议 2000–5000 ms' },
]

const advancedParams = [
  { label: '最大重试 / 重试间隔', desc: '通信失败后的重试策略' },
  { label: '指令间隔', desc: '连续读写之间的最小间隔，避免设备过载' },
  { label: '起始地址', desc: '0=0-based（默认，地址0对应寄存器0）；1=1-based（地址1对应寄存器0）。需与点位地址格式保持一致，批量生成点位时默认使用0-based地址。' },
  { label: '4 字节字节序', desc: 'Float32/Int32 的字节排列：ABCD / CDAB 等' },
  { label: '智能地址探测', desc: '自动扫描有效寄存器区间并优化批量读取' },
]

const faqItems = [
  { question: '连接超时怎么办？', answer: '检查 IP/端口、防火墙与设备 Modbus TCP 服务是否开启；适当增大超时时间。' },
  { question: '读数全为 0？', answer: '确认从站站号、寄存器类型（线圈/保持寄存器）与地址偏移是否正确。' },
  { question: '浮点数乱码？', answer: '调整 4 字节字节序，并与设备手册中的字序定义对齐。' },
  { question: '点位数据整体错位（如 hr_0 与 hr_1 值相同）？', answer: '检查通道高级参数中的"起始地址"是否与点位地址格式一致。批量生成的点位默认使用 0-based 地址（0,1,2...），此时起始地址应设为 0；若设备使用 1-based 地址（1,2,3...），则起始地址应设为 1，且批量生成时起始寄存器也应从 1 开始。' },
]
</script>
