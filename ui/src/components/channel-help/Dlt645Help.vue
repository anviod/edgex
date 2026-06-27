<template>
  <article class="help-doc">
    <header class="help-doc__hero">
      <span class="protocol-tag protocol-tag--accent">DLT645</span>
      <p class="help-doc__lead">
        国标电能表通信协议 DL/T 645，广泛用于电力抄表。支持 RS-485 串口与 TCP 透传两种连接方式。
      </p>
    </header>
    <div class="help-doc__sections">
      <ChannelHelpBlock title="适用场景" text="多功能电表、导轨表、能源管理系统中的 645 协议表计采集。" />
      <ChannelHelpBlock title="连接方式">
        <ChannelHelpParamList :items="connectionModes" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="串口模式参数" text="与 Modbus RTU 类似，需配置波特率（常见 2400/9600）、数据位、校验位等。" />
      <ChannelHelpBlock title="TCP 模式参数">
        <ChannelHelpParamList :items="tcpParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="配置步骤">
        <ol class="help-doc-steps">
          <li>选择串口或 TCP，参数与表计/采集器说明书一致。</li>
          <li>设备级配置 12 位表地址（BCD 编码，不足前补 0）。</li>
          <li>点位使用数据标识 DI（如 02010100 正向有功总电能）。</li>
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

const connectionModes = [
  { label: '串口 (Serial)', desc: '直连 RS-485，填写 /dev/ttySx' },
  { label: '网络 (TCP)', desc: '经串口服务器或 645 网关透传' },
]

const tcpParams = [
  { label: '设备 IP', example: '192.168.1.100' },
  { label: '端口', example: '8001', desc: '以网关/表计文档为准' },
  { label: '超时时间', desc: '建议 2000–5000 ms' },
  { label: '发送间隔', desc: '多表轮询间隔 sendInterval，默认 200 ms' },
  { label: '前导字节', desc: '串口模式唤醒 0xFE 个数，默认 4' },
]

const faqItems = [
  { question: '无应答？', answer: '核对表地址、波特率与 645-2007/1997 版本是否匹配。' },
  { question: '读数为 0 或异常？', answer: '检查数据标识 DI 是否正确，注意小数位与倍率。' },
]
</script>
