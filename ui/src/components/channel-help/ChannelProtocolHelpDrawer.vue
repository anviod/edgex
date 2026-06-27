<template>
  <a-drawer
    :visible="visible"
    :width="880"
    :footer="false"
    unmount-on-close
    class="help-drawer channel-protocol-help-drawer"
    render-to-body
    @update:visible="(v) => emit('update:visible', v)"
    @cancel="onCancel"
  >
    <template #title>
      <span class="help-drawer__title">采集协议帮助</span>
    </template>

    <div class="channel-help-layout">
      <nav class="channel-help-nav" aria-label="协议列表">
        <button
          v-for="item in CHANNEL_HELP_PROTOCOLS"
          :key="item.value"
          type="button"
          class="channel-help-nav__item"
          :class="{ 'is-active': activeProtocol === item.value }"
          @click="activeProtocol = item.value"
        >
          {{ item.label }}
        </button>
      </nav>
      <div class="channel-help-content">
        <component :is="activeComponent" />
      </div>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { CHANNEL_HELP_PROTOCOLS } from './channelHelpProtocols.js'
import ModbusTcpHelp from './ModbusTcpHelp.vue'
import ModbusRtuOverTcpHelp from './ModbusRtuOverTcpHelp.vue'
import ModbusRtuHelp from './ModbusRtuHelp.vue'
import BacnetIpHelp from './BacnetIpHelp.vue'
import OpcUaHelp from './OpcUaHelp.vue'
import S7Help from './S7Help.vue'
import Dlt645Help from './Dlt645Help.vue'
import EthernetIpHelp from './EthernetIpHelp.vue'
import FinsHelp from './FinsHelp.vue'
import MitsubishiHelp from './MitsubishiHelp.vue'
import Ice104Help from './Ice104Help.vue'
import SnmpHelp from './SnmpHelp.vue'

const PROTOCOL_COMPONENTS = {
  'modbus-tcp': ModbusTcpHelp,
  'modbus-rtu-over-tcp': ModbusRtuOverTcpHelp,
  'modbus-rtu': ModbusRtuHelp,
  'bacnet-ip': BacnetIpHelp,
  'opc-ua': OpcUaHelp,
  s7: S7Help,
  dlt645: Dlt645Help,
  'ethernet-ip': EthernetIpHelp,
  'omron-fins': FinsHelp,
  'mitsubishi-slmp': MitsubishiHelp,
  'iec60870-5-104': Ice104Help,
  snmp: SnmpHelp,
}

const props = defineProps({
  visible: { type: Boolean, default: false },
  initialProtocol: { type: String, default: 'modbus-tcp' },
})

const emit = defineEmits(['update:visible', 'cancel'])

const activeProtocol = ref(props.initialProtocol || 'modbus-tcp')

watch(
  () => props.initialProtocol,
  (value) => {
    if (value && PROTOCOL_COMPONENTS[value]) {
      activeProtocol.value = value
    }
  }
)

watch(
  () => props.visible,
  (open) => {
    if (open && props.initialProtocol && PROTOCOL_COMPONENTS[props.initialProtocol]) {
      activeProtocol.value = props.initialProtocol
    }
  }
)

const activeComponent = computed(() => PROTOCOL_COMPONENTS[activeProtocol.value] || ModbusTcpHelp)

const onCancel = () => {
  emit('update:visible', false)
  emit('cancel')
}
</script>

<style scoped>
/* layout styles in help-drawer.css */
</style>
