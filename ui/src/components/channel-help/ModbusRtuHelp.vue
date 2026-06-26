<template>
  <article class="help-doc">
    <header class="help-doc__hero">
      <span class="protocol-tag protocol-tag--accent">Modbus RTU</span>
      <p class="help-doc__lead">
        经典 RS-485/RS-232 串行 Modbus，适用于直连串口或 USB 转串口设备。需正确配置串口物理参数。
      </p>
    </header>
    <div class="help-doc__sections">
      <ChannelHelpBlock title="适用场景" text="RS-485 总线仪表、老型 PLC 串口口、电表/传感器等 Modbus RTU 从站。" />
      <ChannelHelpBlock title="串口参数">
        <ChannelHelpParamList :items="serialParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="高级参数">
        <ChannelHelpParamList :items="advancedParams" />
      </ChannelHelpBlock>
      <ChannelHelpBlock title="配置步骤">
        <ol class="help-doc-steps">
          <li>串口设备填写 Linux 路径，如 <code>/dev/ttyS1</code> 或 <code>/dev/ttyUSB0</code>。</li>
          <li>波特率、数据位、停止位、校验位必须与总线上所有设备约定一致。</li>
          <li>每个从站站号对应一个设备；同一条 RS-485 总线可挂多个设备。</li>
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

const serialParams = [
  { label: '串口设备', example: '/dev/ttyS1' },
  { label: '波特率', desc: '常用 9600 / 19200 / 115200' },
  { label: '数据位 / 停止位 / 校验', desc: '典型 8N1；校验错误会导致整帧失败' },
  { label: '超时时间', desc: '串口响应慢时建议 ≥ 2000 ms' },
]

const advancedParams = [
  { label: '重试与指令间隔', desc: '避免 RS-485 总线冲突，适当加大指令间隔' },
  { label: '起始地址 / 字节序', desc: '与 Modbus TCP 点位规则相同' },
]

const faqItems = [
  { question: '无响应或间歇性失败？', answer: '检查 A/B 线、终端电阻、站号冲突及串口权限（用户是否在 dialout 组）。' },
  { question: '多设备如何接入？', answer: '同一通道一条总线，不同设备使用不同从站站号。' },
]
</script>
