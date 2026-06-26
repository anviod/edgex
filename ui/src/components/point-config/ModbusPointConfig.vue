<template>
  <div class="modbus-point-config batch-form-fields batch-form-fields--nested">
    <div class="batch-form-row">
      <div class="form-field">
        <div class="field-label">寄存器类型</div>
        <a-select
          v-model="registerType"
          :options="registerTypes"
          placeholder="选择寄存器类型"
          @update:value="updateAddress"
        />
      </div>
      <div class="form-field">
        <div class="field-label">寄存器索引</div>
        <a-input
          v-model.number="registerIndex"
          type="number"
          :min="getRegisterIndexMin()"
          :max="getRegisterIndexMax()"
          placeholder="例如: 40001"
          @input="validateRegisterIndex; updateAddress"
        />
        <div v-if="registerIndexError" class="field-error">{{ registerIndexError }}</div>
      </div>
    </div>

    <div class="batch-form-row">
      <div class="form-field">
        <div class="field-label">功能码</div>
        <a-input-number
          v-model="functionCode"
          :min="1"
          :max="255"
          placeholder="自动"
        />
      </div>
      <div class="form-field">
        <div class="field-label">起始偏移量</div>
        <a-input
          v-model.number="registerOffset"
          type="number"
          min="0"
          max="9999"
          placeholder="0"
          @input="validateRegisterOffset"
        />
        <div v-if="registerOffsetError" class="field-error">{{ registerOffsetError }}</div>
      </div>
    </div>

    <div class="form-field">
      <div class="field-label">Modbus 地址</div>
      <a-input
        v-model="form.address"
        disabled
        placeholder="自动计算 PDU 地址"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  },
  deviceInfo: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:form'])

const registerType = ref(props.form.register_type || 'holding')
const registerIndex = ref(parseInt(props.form.address) || 0)
const registerOffset = ref(0)
const functionCode = ref(props.form.function_code || 3)
const registerIndexError = ref('')
const registerOffsetError = ref('')

const registerTypes = [
  { label: 'HOLDING_REGISTER (保持寄存器)', value: 'holding' },
  { label: 'INPUT_REGISTER (输入寄存器)', value: 'input' },
  { label: 'COIL (输出线圈)', value: 'coil' },
  { label: 'DISCRETE_INPUT (离散输入)', value: 'discrete' },
]

const getRegisterIndexMin = () => {
  const startAddress = props.deviceInfo?.config?.start_address || props.deviceInfo?.config?.address_base || 0
  return startAddress
}

const getRegisterIndexMax = () => {
  const startAddress = props.deviceInfo?.config?.start_address || props.deviceInfo?.config?.address_base || 0
  return startAddress + 65535
}

const validateRegisterIndex = () => {
  const idx = parseInt(registerIndex.value) || 0
  const min = getRegisterIndexMin()
  const max = getRegisterIndexMax()

  if (idx < min || idx > max) {
    registerIndexError.value = `寄存器索引必须在 ${min} 到 ${max} 之间`
  } else {
    registerIndexError.value = ''
  }
}

const validateRegisterOffset = () => {
  const offset = parseInt(registerOffset.value) || 0
  if (offset < 0 || offset > 9999) {
    registerOffsetError.value = '起始偏移量必须在 0 到 9999 之间'
  } else {
    registerOffsetError.value = ''
  }
}

const updateAddress = () => {
  const idx = parseInt(registerIndex.value) || 0
  const offset = parseInt(registerOffset.value) || 0
  let address = 0

  const startAddress = props.deviceInfo?.config?.start_address || props.deviceInfo?.config?.address_base || 0

  if (idx < startAddress) {
    registerIndexError.value = `地址不能小于基准地址 ${startAddress}`
    return
  }

  address = idx - startAddress + offset

  if (address < 0 || address > 65535) {
    registerIndexError.value = 'PDU地址必须在 0 到 65535 之间'
    return
  }

  registerIndexError.value = ''

  const functionCodeMap = {
    coil: 1,
    discrete: 2,
    input: 4,
    holding: 3,
  }

  if (functionCodeMap[registerType.value]) {
    functionCode.value = functionCodeMap[registerType.value]
  }

  const updatedForm = {
    ...props.form,
    register_type: registerType.value,
    address: address.toString(),
    function_code: functionCode.value,
  }

  emit('update:form', updatedForm)
}

watch(registerType, () => {
  updateAddress()
})

watch(registerOffset, () => {
  validateRegisterOffset()
  updateAddress()
})
</script>

<style scoped>
/* v3.0 — styles in src/styles/config-modal.css */
</style>
