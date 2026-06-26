<template>
  <div class="bacnet-point-config batch-form-fields batch-form-fields--nested">
    <div class="batch-form-row">
      <div class="form-field">
        <div class="field-label">对象类型</div>
        <a-select
          v-model="form.object_type"
          :options="objectTypes"
          placeholder="选择对象类型"
        />
      </div>
      <div class="form-field">
        <div class="field-label">实例号</div>
        <a-input
          v-model.number="form.instance"
          type="number"
          min="0"
          placeholder="例如: 1"
        />
      </div>
    </div>

    <div class="batch-form-row">
      <div class="form-field">
        <div class="field-label">属性 ID</div>
        <a-input
          v-model.number="form.property_id"
          type="number"
          min="0"
          placeholder="例如: 85"
        />
      </div>
      <div class="form-field">
        <div class="field-label">写入优先级</div>
        <a-select
          v-model.number="form.priority"
          :options="priorities"
          placeholder="选择优先级"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  form: {
    type: Object,
    required: true,
  },
  deviceInfo: {
    type: Object,
    default: null,
  },
})

defineEmits(['update:form'])

const objectTypes = [
  { label: 'Analog Input', value: 'analog-input' },
  { label: 'Analog Output', value: 'analog-output' },
  { label: 'Analog Value', value: 'analog-value' },
  { label: 'Binary Input', value: 'binary-input' },
  { label: 'Binary Output', value: 'binary-output' },
  { label: 'Binary Value', value: 'binary-value' },
  { label: 'Multi-state Input', value: 'multi-state-input' },
  { label: 'Multi-state Output', value: 'multi-state-output' },
  { label: 'Multi-state Value', value: 'multi-state-value' },
]

const priorities = [
  { label: '1 (最高)', value: 1 },
  { label: '8 (默认)', value: 8 },
  { label: '16 (最低)', value: 16 },
]
</script>

<style scoped>
/* v3.0 — styles in src/styles/config-modal.css */
</style>
