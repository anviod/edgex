<template>
  <article class="help-doc">
    <header class="help-doc__hero">
      <span class="protocol-tag protocol-tag--accent">Mitsubishi MC</span>
      <p class="help-doc__lead">
        三菱 MC Protocol（SLMP / MELSEC Communication Protocol）3E 帧二进制通信，通过 TCP 读写 Q/L/iQ-R 系列 PLC 的 D、M、X、Y 等设备存储区。
      </p>
    </header>
    <div class="help-doc__sections">
      <ChannelHelpBlock title="适用场景" text="三菱 Q 系列、L 系列、iQ-R 系列等支持 MC Protocol 以太网通信的 PLC 数据采集与写入。" />
      <ChannelHelpBlock title="基础连接">
        <ChannelHelpParamList :items="connectionParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="通信参数">
        <ChannelHelpParamList :items="commParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="设备地址">
        <ChannelHelpParamList :items="addressExamples" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="配置步骤">
        <ol class="help-doc-steps">
          <li>填写 PLC IP，端口默认 5000（Q/L）或 5007（iQ-R SLMP）。</li>
          <li>确认 PLC 侧已启用 MC Protocol / SLMP 以太网通信，网络号与站号与通道配置一致。</li>
          <li>点位地址使用设备区 + 编号，位地址可用 D20.2 表示 D20 字的第 2 位。</li>
          <li>字符串点位使用 D100.16L（16 字符，低字节在前）或 .H（高字节在前）。</li>
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
  { label: 'PLC IP', example: '192.168.1.10' },
  { label: '端口', example: '5000', desc: 'MC Protocol 默认 5000；iQ-R SLMP 常用 5007' },
  { label: '帧类型', desc: '3E（默认，Q/L/iQ-R 二进制帧）' },
  { label: '网络号 / 站号', desc: 'network_no 默认 0；station_no 默认 0' },
]

const commParams = [
  { label: '超时 / 重试', desc: 'timeout 建议 2000–5000 ms；max_retries 控制连接重试' },
  { label: '批量读取上限', desc: 'batch_read_max 控制单次调度分组大小，默认 64' },
  { label: 'PC 编号', desc: 'pc_no 默认 255 (0xFF)，与 GX Works 等编程软件设置一致' },
]

const addressExamples = [
  { label: 'D 区（数据寄存器）', example: 'D100' },
  { label: 'M 区（内部继电器）', example: 'M0' },
  { label: 'X / Y（输入/输出）', example: 'X0, Y10' },
  { label: '字内位', example: 'D20.2' },
  { label: '字符串', example: 'D100.16L' },
]

const faqItems = [
  { question: '连接超时？', answer: '检查 PLC IP 可达、MC Protocol 端口开放、PLC 以太网模块已启用 SLMP/MC 通信。' },
  { question: 'End Code 非 0？', answer: '确认设备地址合法、数据类型与读取长度匹配，部分区域只读或需特定 CPU 型号支持。' },
  { question: 'D20.2 如何理解？', answer: '表示 D20 字的第 2 位（0–15），驱动读取 D20 字后提取对应位。' },
  { question: '与 A 系列 1E 帧的区别？', answer: '当前驱动实现 MC 3E 二进制帧，适用于 Q/L/iQ-R；A 系列 FX 需确认 CPU 是否支持 3E 帧。' },
]
</script>
