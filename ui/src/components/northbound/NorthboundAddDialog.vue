<template>
  <a-modal
    :visible="visible"
    title="添加北向通道"
    :width="640"
    :footer="false"
    unmount-on-close
    @update:visible="$emit('update:visible', $event)"
  >
    <div v-for="modeKey in ['push', 'passive']" :key="modeKey" class="add-section">
      <div class="add-section__header" :style="sectionStyle(modeKey)">
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
          <div class="proto-option__icon" :style="{ background: proto.color + '18', color: proto.color }">
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

const sectionStyle = (modeKey) => {
  const m = modes[modeKey]
  return { background: m.bg, borderColor: m.border }
}
</script>

<style scoped>
.add-section { margin-bottom: 20px; }
.add-section:last-child { margin-bottom: 0; }

.add-section__header {
  padding: 10px 14px;
  border: 1px solid;
  border-radius: 8px 8px 0 0;
}

.add-section__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--edgex-text-primary);
}

.add-section__desc {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.add-section__grid {
  border: 1px solid #e2e8f0;
  border-top: none;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
}

.proto-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.15s;
}

.proto-option:last-child { border-bottom: none; }
.proto-option:hover { background: var(--edgex-surface-inset); }

.proto-option__icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.proto-option__info { flex: 1; min-width: 0; }

.proto-option__name {
  font-size: 14px;
  font-weight: 500;
  color: var(--edgex-text-primary);
}

.proto-option__desc {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
}

.proto-option__arrow {
  color: #cbd5e1;
  flex-shrink: 0;
}
</style>
