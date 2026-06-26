<template>
  <a-modal
    :visible="visible"
    title="添加北向通道"
    :width="640"
    :footer="false"
    modal-class="northbound-add-modal"
    unmount-on-close
    @update:visible="$emit('update:visible', $event)"
  >
    <div v-for="modeKey in ['push', 'passive']" :key="modeKey" class="add-section">
      <div class="add-section__header" :class="`add-section__header--${modeKey}`">
        <div class="add-section__title">{{ modes[modeKey].label }}</div>
        <div class="add-section__desc">{{ modes[modeKey].desc }}</div>
      </div>
      <div class="add-section__grid">
        <div
          v-for="proto in protocolsByMode(modeKey)"
          :key="proto.key"
          class="proto-option"
          @click="$emit('select', proto.key)"
        >
          <div class="proto-option__icon" :style="{ '--proto-accent': proto.color }">
            <component :is="iconMap[proto.icon]" :size="22" />
          </div>
          <div class="proto-option__info">
            <div class="proto-option__name">{{ proto.label }}</div>
            <div class="proto-option__desc">{{ proto.desc }}</div>
          </div>
          <icon-right class="proto-option__arrow" />
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import {
  IconCloud, IconUpload, IconSwap, IconStorage, IconThunderbolt, IconRight
} from '@arco-design/web-vue/es/icon'
import { NORTHBOUND_MODES, getProtocolsByMode } from '@/utils/northboundProtocols'

defineProps({
  visible: { type: Boolean, default: false }
})

defineEmits(['update:visible', 'select'])

const modes = NORTHBOUND_MODES
const iconMap = { cloud: IconCloud, upload: IconUpload, swap: IconSwap, storage: IconStorage, thunderbolt: IconThunderbolt }
const protocolsByMode = getProtocolsByMode
</script>
