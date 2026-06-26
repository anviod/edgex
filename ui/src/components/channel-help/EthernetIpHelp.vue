<template>
  <article class="help-doc">
    <header class="help-doc__hero">
      <span class="protocol-tag protocol-tag--accent">EtherNet/IP</span>
      <p class="help-doc__lead">
        基于 CIP 的工业以太网协议，主要用于 Allen-Bradley Logix 系列 PLC 的标签读写与 I/O 采集。
      </p>
    </header>
    <div class="help-doc__sections">
      <ChannelHelpBlock title="适用场景" text="ControlLogix、CompactLogix、Micro800 等罗克韦尔 PLC；标签（Tag）方式寻址。" />
      <ChannelHelpBlock title="基础连接">
        <ChannelHelpParamList :items="connectionParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="连接类型">
        <ChannelHelpParamList :items="connectionTypes" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="通信参数">
        <ChannelHelpParamList :items="commParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="标签地址格式" text="完整路径：Program:MainProgram.TagName 或 Controller 级标签名；支持 INT、DINT、REAL、BOOL 等类型。" />
      <ChannelHelpBlock title="支持的数据类型" text="INT, DINT, UINT, UDINT, REAL, LREAL, BOOL, SINT, USINT, LINT, ULINT, STRING" />
      <ChannelHelpBlock title="配置步骤">
        <ol class="help-doc-steps">
          <li>填写 PLC IP，端口默认 44818（部分设备 47818）。</li>
          <li>槽号通常为 0；Logix 系列可选用 Logix 模式以优化批量读写。</li>
          <li>点位填写标签路径，大小写与 PLC 程序一致。</li>
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
  { label: '端口', example: '44818', desc: 'EtherNet/IP 默认端口' },
  { label: '槽号 (Slot)', example: '0', desc: 'CPU 所在槽位' },
]

const connectionTypes = [
  { label: '标准 CIP 模式', desc: '适用于大多数 Allen-Bradley 设备' },
  { label: 'Logix 模式', desc: '针对 Logix 控制器优化，支持更高效标签访问' },
]

const commParams = [
  { label: '超时 / 重试 / 重试间隔', desc: '建议超时 2000–5000 ms，重试 3 次' },
  { label: '心跳间隔', desc: '维持 CIP 会话，建议 30000 ms' },
  { label: '批量读取上限 / 最小间隔', desc: '控制并发与请求频率' },
]

const faqItems = [
  { question: '连接失败？', answer: '检查 IP、端口、防火墙及 PLC 是否允许外部 EtherNet/IP 连接。' },
  { question: '标签不存在？', answer: '确认标签名、Program 作用域与 PLC 在线运行状态。' },
  { question: '通信超时？', answer: '增大超时时间，检查网络质量与 PLC CPU 负载。' },
]
</script>
