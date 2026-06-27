<template>
  <article class="help-doc">
    <header class="help-doc__hero">
      <span class="protocol-tag protocol-tag--accent">IEC 60870-5-104</span>
      <p class="help-doc__lead">
        电力自动化 IEC 60870-5-104 协议 Client，通过 TCP（默认端口 2404）采集遥信、遥测、遥脉，并支持单点遥控。
      </p>
    </header>
    <div class="help-doc__sections">
      <ChannelHelpBlock title="适用场景" text="变电站 RTU、保护装置、电力 SCADA 南向采集；支持总召唤与自发上报两种采集模式。" />
      <ChannelHelpBlock title="基础连接">
        <ChannelHelpParamList :items="connectionParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="协议定时器">
        <ChannelHelpParamList :items="timerParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="点位配置">
        <ChannelHelpParamList :items="pointParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="配置步骤">
        <ol class="help-doc-steps">
          <li>填写设备 IP 与公共地址 CA（commonAddress），端口默认 2404。</li>
          <li>启动通道后驱动自动完成 TESTFR / STARTDT 链路激活。</li>
          <li>点位地址填写 IOA（0–65535）；在 group 字段填写 TypeID 名称，如 M_ME_NC_1。</li>
          <li>Read 模式周期采集会触发总召唤；Subscribe 模式依赖设备自发上报。</li>
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
  { label: '设备 IP', example: '192.168.1.100' },
  { label: '端口', example: '2404', desc: '104 协议默认端口' },
  { label: '公共地址 CA', example: '1', desc: 'commonAddress，需与 RTU 配置一致' },
  { label: '总召唤间隔', example: '300', desc: 'generalCallInterval（秒），0 表示禁用' },
]

const timerParams = [
  { label: 'T0 / T1 / T2 / T3', desc: '连接、应答、S 帧、测试帧超时（秒）' },
  { label: 'W', desc: '未确认 I 帧最大数量，默认 7' },
  { label: '重试', desc: 'maxRetries / retryInterval 控制连接重试' },
]

const pointParams = [
  { label: 'address', example: '400', desc: 'IOA 信息对象地址' },
  { label: 'group (TypeID)', example: 'M_ME_NC_1', desc: '监控/控制类型标识' },
  { label: 'datatype', example: 'FLOAT / BOOL / INT16', desc: '未指定 group 时按类型推断' },
  { label: 'readwrite', example: 'R / Subscribe / W', desc: '读、订阅或写（遥控）' },
]

const faqItems = [
  { question: '连接成功但无数据？', answer: '确认 CA 与 IOA 正确；Read 模式需等待总召唤响应，或改用 Subscribe 模式。' },
  { question: 'TypeID 如何填写？', answer: '在点位 group 字段填写 M_SP_NA_1、M_ME_NC_1 等名称，与 RTU 点表一致。' },
  { question: '品质 Bad？', answer: '检查链路是否 STARTDT 激活、IOA 是否存在、TypeID 与数据类型是否匹配。' },
]
</script>
