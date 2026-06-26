<template>
  <a-drawer
    :visible="visible"
    :width="400"
    :footer="false"
    unmount-on-close
    class="help-drawer"
    render-to-body
    @update:visible="(v) => emit('update:visible', v)"
    @cancel="onCancel"
  >
    <template #title>
      <span class="help-drawer__title">帮助文档</span>
    </template>

    <article class="help-doc">
      <header class="help-doc__hero">
        <span class="protocol-tag protocol-tag--accent">{{ formatProtocolTag(channelProtocol) }}</span>
        <p class="help-doc__lead">点位配置规范与常见问题说明。</p>
      </header>

      <div class="help-doc__sections">
        <!-- Modbus -->
        <template v-if="channelProtocol.includes('modbus')">
          <section class="help-doc-section">
            <h2 class="help-doc-section__title">协议介绍</h2>
            <p class="help-doc-section__text">
              Modbus 是工业自动化领域常用的串行通信协议，支持 RS-232、RS-485 与 TCP/IP 等传输方式。
            </p>
          </section>

          <section class="help-doc-section">
            <h2 class="help-doc-section__title">寄存器地址规范</h2>
            <div class="help-doc-card">
              <div v-for="item in modbusRegisterSpecs" :key="item.meta" class="help-doc-row">
                <div class="help-doc-row__label">
                  <strong>{{ item.name }}</strong>
                  <span>{{ item.meta }}</span>
                </div>
                <code class="help-doc-row__value">{{ item.range }}</code>
              </div>
            </div>
          </section>

          <section class="help-doc-section">
            <h2 class="help-doc-section__title">数据格式</h2>
            <div class="help-doc-card">
              <div v-for="item in modbusDatatypeSpecs" :key="item.name" class="help-doc-row">
                <div class="help-doc-row__label">
                  <strong>{{ item.name }}</strong>
                </div>
                <code class="help-doc-row__value">{{ item.value }}</code>
              </div>
            </div>
          </section>

          <section class="help-doc-section">
            <h2 class="help-doc-section__title">点位转换</h2>
            <p class="help-doc-section__text">
              寄存器地址需映射为 PDU 偏移。例如保持寄存器 40001 对应实际地址 0。
            </p>
          </section>

          <section class="help-doc-section">
            <h2 class="help-doc-section__title">常见问题</h2>
            <a-collapse class="help-doc-faq" :bordered="false" expand-icon-position="right">
              <a-collapse-item header="为什么数值显示为 0?" key="1">
                请检查设备通讯状态及寄存器偏移量（Offset）设置是否正确。
              </a-collapse-item>
              <a-collapse-item header="如何配置浮点数 (Float32)?" key="2">
                需要占用两个连续的 16 位寄存器，并确认字节序（Endianness）。
              </a-collapse-item>
              <a-collapse-item header="如何设置寄存器地址?" key="3">
                对于保持寄存器，输入 40001 表示第一个寄存器，系统会自动转换为实际地址 0。
              </a-collapse-item>
            </a-collapse>
          </section>
        </template>

        <!-- BACnet -->
        <template v-else-if="channelProtocol.includes('bacnet')">
          <section class="help-doc-section">
            <h2 class="help-doc-section__title">协议介绍</h2>
            <p class="help-doc-section__text">
              BACnet 是建筑自动化与控制网络协议，常用于智能建筑与 HVAC 系统。
            </p>
          </section>

          <section class="help-doc-section">
            <h2 class="help-doc-section__title">对象类型</h2>
            <div class="help-doc-card">
              <div v-for="item in bacnetObjectSpecs" :key="item.value" class="help-doc-row">
                <div class="help-doc-row__label">
                  <strong>{{ item.name }}</strong>
                </div>
                <code class="help-doc-row__value">{{ item.value }}</code>
              </div>
            </div>
          </section>

          <section class="help-doc-section">
            <h2 class="help-doc-section__title">数据格式</h2>
            <div class="help-doc-card">
              <div v-for="item in bacnetDatatypeSpecs" :key="item.name" class="help-doc-row">
                <div class="help-doc-row__label">
                  <strong>{{ item.name }}</strong>
                </div>
                <code class="help-doc-row__value">{{ item.value }}</code>
              </div>
            </div>
          </section>

          <section class="help-doc-section">
            <h2 class="help-doc-section__title">点位格式</h2>
            <p class="help-doc-section__text">地址格式：对象类型:实例号，例如 AnalogInput:1。</p>
          </section>

          <section class="help-doc-section">
            <h2 class="help-doc-section__title">常见问题</h2>
            <a-collapse class="help-doc-faq" :bordered="false" expand-icon-position="right">
              <a-collapse-item header="如何确定对象实例号?" key="1">
                实例号是设备中对象的唯一标识符，通常由设备制造商分配或在设备配置中设置。
              </a-collapse-item>
              <a-collapse-item header="如何设置优先级?" key="2">
                BACnet 支持 1–16 级优先级，1 为最高。设置为 NULL 表示释放该点位。
              </a-collapse-item>
              <a-collapse-item header="为什么无法写入值?" key="3">
                请检查对象类型是否支持写入，例如 AnalogInput 通常为只读。
              </a-collapse-item>
            </a-collapse>
          </section>
        </template>

        <!-- OPC UA -->
        <template v-else-if="channelProtocol.includes('opc-ua')">
          <section class="help-doc-section">
            <h2 class="help-doc-section__title">协议介绍</h2>
            <p class="help-doc-section__text">
              OPC UA 提供安全、可靠的工业数据交换，支持 TCP/IP、HTTPS 与 WebSocket。
            </p>
          </section>

          <section class="help-doc-section">
            <h2 class="help-doc-section__title">节点类型</h2>
            <div class="help-doc-card">
              <div v-for="item in opcuaNodeSpecs" :key="item.value" class="help-doc-row">
                <div class="help-doc-row__label">
                  <strong>{{ item.name }}</strong>
                </div>
                <code class="help-doc-row__value">{{ item.value }}</code>
              </div>
            </div>
          </section>

          <section class="help-doc-section">
            <h2 class="help-doc-section__title">数据格式</h2>
            <div class="help-doc-card">
              <div v-for="item in opcuaDatatypeSpecs" :key="item.name" class="help-doc-row">
                <div class="help-doc-row__label">
                  <strong>{{ item.name }}</strong>
                </div>
                <code class="help-doc-row__value">{{ item.value }}</code>
              </div>
            </div>
          </section>

          <section class="help-doc-section">
            <h2 class="help-doc-section__title">点位格式</h2>
            <p class="help-doc-section__text">
              使用 NodeID，格式为 ns=命名空间;s=标识 或 ns=命名空间;i=标识。
            </p>
          </section>

          <section class="help-doc-section">
            <h2 class="help-doc-section__title">常见问题</h2>
            <a-collapse class="help-doc-faq" :bordered="false" expand-icon-position="right">
              <a-collapse-item header="如何找到节点的 NodeID?" key="1">
                使用 OPC UA 客户端浏览设备地址空间，找到目标节点并复制其 NodeID。
              </a-collapse-item>
              <a-collapse-item header="为什么无法连接到服务器?" key="2">
                请检查端点 URL 是否正确，以及服务器是否运行并接受连接。
              </a-collapse-item>
              <a-collapse-item header="如何处理不同的数据类型?" key="3">
                建议选择与设备一致的数据类型，避免不必要的转换误差。
              </a-collapse-item>
            </a-collapse>
          </section>
        </template>

        <!-- Generic -->
        <template v-else>
          <section class="help-doc-section">
            <h2 class="help-doc-section__title">协议介绍</h2>
            <p class="help-doc-section__text">
              当前协议为 {{ formatProtocolTag(channelProtocol) }}，请参考设备手册了解详细配置规范。
            </p>
          </section>

          <section class="help-doc-section">
            <h2 class="help-doc-section__title">数据格式</h2>
            <div class="help-doc-card">
              <div v-for="item in genericDatatypeSpecs" :key="item.name" class="help-doc-row">
                <div class="help-doc-row__label">
                  <strong>{{ item.name }}</strong>
                </div>
                <code class="help-doc-row__value">{{ item.value }}</code>
              </div>
            </div>
          </section>

          <section class="help-doc-section">
            <h2 class="help-doc-section__title">常见问题</h2>
            <a-collapse class="help-doc-faq" :bordered="false" expand-icon-position="right">
              <a-collapse-item header="为什么数值显示为 0?" key="1">
                请检查设备通讯状态及配置参数是否正确。
              </a-collapse-item>
              <a-collapse-item header="如何配置数据类型?" key="2">
                选择与设备端一致的数据类型。
              </a-collapse-item>
              <a-collapse-item header="如何排查通讯问题?" key="3">
                检查网络连接、设备电源、配置参数和设备状态。
              </a-collapse-item>
            </a-collapse>
          </section>
        </template>
      </div>
    </article>
  </a-drawer>
</template>

<script setup>
import { formatProtocolTag } from '@/utils/protocolLabel'

defineProps({
  visible: { type: Boolean, default: false },
  channelProtocol: { type: String, default: '' },
})

const emit = defineEmits(['update:visible', 'cancel'])

const modbusRegisterSpecs = [
  { name: '保持寄存器', meta: 'Holding Register', range: '40001 – 49999' },
  { name: '输入寄存器', meta: 'Input Register', range: '30001 – 39999' },
  { name: '线圈', meta: 'Coil', range: '00001 – 09999' },
  { name: '离散输入', meta: 'Discrete Input', range: '10001 – 19999' },
]

const modbusDatatypeSpecs = [
  { name: '16 位整数', value: 'int16, uint16' },
  { name: '32 位整数', value: 'int32, uint32' },
  { name: '浮点数', value: 'float32, float64' },
  { name: '字符串', value: 'string' },
]

const bacnetObjectSpecs = [
  { name: '模拟输入', value: 'AnalogInput' },
  { name: '模拟输出', value: 'AnalogOutput' },
  { name: '模拟值', value: 'AnalogValue' },
  { name: '二进制输入', value: 'BinaryInput' },
  { name: '二进制输出', value: 'BinaryOutput' },
  { name: '二进制值', value: 'BinaryValue' },
]

const bacnetDatatypeSpecs = [
  { name: '整数', value: 'int' },
  { name: '浮点数', value: 'real' },
  { name: '字符串', value: 'characterstring' },
  { name: '布尔值', value: 'boolean' },
]

const opcuaNodeSpecs = [
  { name: '变量', value: 'Variable' },
  { name: '对象', value: 'Object' },
  { name: '方法', value: 'Method' },
  { name: '引用', value: 'Reference' },
]

const opcuaDatatypeSpecs = [
  { name: '布尔值', value: 'Boolean' },
  { name: '整数', value: 'Int16, Int32, Int64' },
  { name: '浮点数', value: 'Float, Double' },
  { name: '字符串', value: 'String' },
]

const genericDatatypeSpecs = [
  { name: '整数', value: 'int, uint' },
  { name: '浮点数', value: 'float, double' },
  { name: '字符串', value: 'string' },
  { name: '布尔值', value: 'bool' },
]

const onCancel = () => {
  emit('update:visible', false)
  emit('cancel')
}
</script>

<style scoped>
/* v3.0 — src/styles/help-drawer.css */
</style>
