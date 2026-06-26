<template>
  <div class="opcua-point-config batch-form-fields batch-form-fields--nested">
    <div class="batch-form-row">
      <div class="form-field">
        <div class="field-label">NodeId</div>
        <a-input
          v-model="form.node_id"
          placeholder="例如: ns=2;s=Demo.Static.Scalar.Double"
        />
      </div>
      <div class="form-field">
        <div class="field-label">命名空间索引</div>
        <a-input-number
          v-model="form.namespace_index"
          :min="0"
          placeholder="0"
        />
      </div>
    </div>

    <div class="batch-form-row">
      <div class="form-field">
        <div class="field-label">数据类型</div>
        <a-select
          v-model="form.datatype"
          :options="dataTypes"
          placeholder="选择数据类型"
          allow-search
        />
      </div>
      <div class="form-field">
        <div class="field-label">访问权限</div>
        <a-select
          v-model="form.access_level"
          :options="accessLevels"
          placeholder="选择访问权限"
        />
      </div>
    </div>

    <div class="modal-section__title modal-section__title--sub">高级选项</div>
    <div class="advanced-block point-advanced-block">
      <div class="batch-form-row">
        <div class="form-field">
          <div class="field-label">采样间隔 (ms)</div>
          <a-input-number
            v-model="form.sampling_interval"
            :min="0"
            placeholder="1000"
          />
        </div>
        <div class="form-field">
          <div class="field-label">队列大小</div>
          <a-input-number
            v-model="form.queue_size"
            :min="1"
            placeholder="1"
          />
        </div>
      </div>

      <div class="batch-form-row">
        <div class="form-field">
          <div class="field-label">死区</div>
          <a-input-number
            v-model="form.deadband"
            :min="0"
            placeholder="可选"
          />
        </div>
        <div class="form-field">
          <div class="field-label">索引范围</div>
          <a-input
            v-model="form.index_range"
            placeholder="例如: 0:9"
          />
        </div>
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

const dataTypes = [
  { label: 'Boolean (布尔)', value: 'bool' },
  { label: 'SByte (有符号字节)', value: 'sbyte' },
  { label: 'Byte (无符号字节)', value: 'byte' },
  { label: 'Int16 (16位整数)', value: 'int16' },
  { label: 'UInt16 (16位无符号)', value: 'uint16' },
  { label: 'Int32 (32位整数)', value: 'int32' },
  { label: 'UInt32 (32位无符号)', value: 'uint32' },
  { label: 'Int64 (64位整数)', value: 'int64' },
  { label: 'UInt64 (64位无符号)', value: 'uint64' },
  { label: 'Float (32位浮点)', value: 'float32' },
  { label: 'Double (64位浮点)', value: 'float64' },
  { label: 'String (字符串)', value: 'string' },
  { label: 'XmlElement (XML)', value: 'xmlliteral' },
  { label: 'DateTime (日期时间)', value: 'datetime' },
  { label: 'ByteString (字节串)', value: 'bytestring' },
  { label: 'Guid (全局唯一标识符)', value: 'guid' },
  { label: 'NodeId (节点标识符)', value: 'nodeid' },
  { label: 'StatusCode (状态码)', value: 'statuscode' },
  { label: 'QualifiedName (限定名)', value: 'qualifiedname' },
  { label: 'LocalizedText (本地化文本)', value: 'localizedtext' },
  { label: 'ExtensionObject (扩展对象)', value: 'extensionobject' },
  { label: 'Array:Int32 (整数数组)', value: 'array:int32' },
  { label: 'Array:Float (浮点数组)', value: 'array:float32' },
  { label: 'Array:Double (双精度数组)', value: 'array:float64' },
  { label: 'Array:String (字符串数组)', value: 'array:string' },
]

const accessLevels = [
  { label: 'Read Only (只读)', value: 'R' },
  { label: 'Write Only (只写)', value: 'W' },
  { label: 'Read/Write (读写)', value: 'RW' },
  { label: 'Read + History (读+历史)', value: 'R_H' },
  { label: 'Read/Write + History (读写+历史)', value: 'RW_H' },
]
</script>

<style scoped>
/* v3.0 — styles in src/styles/config-modal.css */
</style>
