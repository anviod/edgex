<template>
  <article class="help-doc">
    <header class="help-doc__hero">
      <span class="protocol-tag protocol-tag--accent">S7</span>
      <p class="help-doc__lead">
        西门子 S7 系列 PLC 通信协议，通过 ISO-on-TCP（端口 102）读写 DB、M、I/Q 等区域。
      </p>
    </header>
    <div class="help-doc__sections">
      <ChannelHelpBlock title="适用场景" text="S7-200 Smart、S7-300/400、S7-1200/1500 等西门子 PLC 数据采集。" />
      <ChannelHelpBlock title="基础连接">
        <ChannelHelpParamList :items="connectionParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="通信参数">
        <ChannelHelpParamList :items="commParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="点位寻址示例">
        <ChannelHelpParamList :items="addressExamples" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="配置步骤">
        <ol class="help-doc-steps">
          <li>填写 PLC IP，端口默认 102；选择与实际一致的 PLC 型号。</li>
          <li>机架号/槽号：1200/1500 常见 Rack=0 Slot=1；300/400 按硬件配置。</li>
          <li>在 TIA Portal 中允许 PUT/GET 或相应访问权限（视型号而定）。</li>
          <li>点位地址使用 DB 块、偏移与数据类型，如 DB1.DBD0 (Real)。</li>
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
  { label: '端口', example: '102', desc: 'ISO-on-TCP 默认端口' },
  { label: 'PLC 型号', desc: 'S7-1200 / 1500 / 300 / 400 / 200Smart' },
  { label: '机架号 / 槽号', desc: '与 CPU 物理槽位一致，不确定时可留空自动探测' },
  { label: '连接类型', desc: 'PG / OP / S7Basic，一般采集使用 OP 或默认' },
]

const commParams = [
  { label: '超时 / 重试 / 心跳', desc: '保障长连接稳定，心跳间隔建议 30000 ms' },
  { label: 'PDU 缓冲区', desc: '影响单次批量读取字节数' },
  { label: '批量读取上限', desc: '合并相邻地址以提高采集效率' },
  { label: 'CPU 停机保护', desc: 'PLC STOP 时是否停止写入以保护现场' },
]

const addressExamples = [
  { label: 'DB 区', example: 'DB1.DBD0' },
  { label: 'M 区', example: 'M0.0 / MB0' },
  { label: 'I/Q 区', example: 'I0.0 / Q0.0' },
]

const faqItems = [
  { question: '连接被拒绝？', answer: '检查 PLC 在线、IP 可达、端口 102 开放及访问权限（PUT/GET）。' },
  { question: 'Rack/Slot 错误？', answer: '1200/1500 多为 Slot=1；300 CPU 在机架 0 槽 2 等，查阅硬件配置。' },
  { question: '读取 DB 失败？', answer: '确认 DB 块未优化或已知偏移；优化 DB 需使用符号或精确偏移。' },
]
</script>
