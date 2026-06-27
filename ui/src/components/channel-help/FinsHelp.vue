<template>
  <article class="help-doc">
    <header class="help-doc__hero">
      <span class="protocol-tag protocol-tag--accent">Omron FINS</span>
      <p class="help-doc__lead">
        欧姆龙 FINS（Factory Interface Network Service）协议，通过 TCP 或 UDP（默认端口 9600）读写 CIO、D、W、H 等内存区域。
      </p>
    </header>
    <div class="help-doc__sections">
      <ChannelHelpBlock title="适用场景" text="CP 系列、CJ/CS 系列、NJ/NX 系列等欧姆龙 PLC 数据采集与写入。" />
      <ChannelHelpBlock title="基础连接">
        <ChannelHelpParamList :items="connectionParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="通信参数">
        <ChannelHelpParamList :items="commParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="FINS 地址">
        <ChannelHelpParamList :items="addressExamples" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="配置步骤">
        <ol class="help-doc-steps">
          <li>填写 PLC IP，端口默认 9600；选择 TCP 或 UDP 传输模式。</li>
          <li>配置源/目标网络地址与节点号，需与 PLC 侧 FINS 设置一致（常见目标节点为 PLC IP 末段）。</li>
          <li>在 CX-Programmer / Sysmac Studio 中启用 FINS 以太网通信。</li>
          <li>点位地址使用区域 + 字地址，位点加 .位号，如 D100、CIO1.2、EM10.100。</li>
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
  { label: 'PLC IP', example: '192.168.1.100' },
  { label: '端口', example: '9600', desc: 'FINS 默认端口' },
  { label: '传输模式', desc: 'TCP（推荐）或 UDP' },
  { label: 'PLC 型号', desc: 'CP1E / CP1H / CJ / CS / NJ 等（可选，用于文档参考）' },
  { label: '源/目标节点', desc: 'srcNodeAddr 默认 1；dstNodeAddr 通常为 PLC IP 最后一段' },
]

const commParams = [
  { label: '超时 / 重试', desc: '通信超时建议 2000–3000 ms；max_retries 控制重连次数' },
  { label: '心跳间隔', desc: 'heartbeat_interval 默认 30000 ms，维持 TCP 长连接' },
  { label: '批量读取上限', desc: 'maxFrameLength 控制单次合并读取字数，默认 64' },
  { label: '指令间隔', desc: 'min_interval 限制连续请求最小间隔（ms）' },
]

const addressExamples = [
  { label: 'D 区（数据）', example: 'D100' },
  { label: 'CIO 区（位）', example: 'CIO1.2' },
  { label: 'W 区', example: 'W3.4' },
  { label: 'EM 区', example: 'EM10.100' },
]

const faqItems = [
  { question: '连接超时？', answer: '检查 PLC IP 可达、端口 9600 开放、FINS 以太网单元已启用。' },
  { question: '节点地址错误？', answer: 'dstNodeAddr 需与 PLC 的 FINS 节点号一致，常见为 IP 第四段（如 192.168.1.10 → 10）。' },
  { question: 'UDP 与 TCP 如何选择？', answer: 'TCP 更稳定、支持长连接与心跳；UDP 适用于对延迟敏感且网络稳定的场景。' },
  { question: '读取失败 End Code？', answer: '确认地址区域可访问、数据类型与地址长度匹配，A/F 区为只读。' },
]
</script>
