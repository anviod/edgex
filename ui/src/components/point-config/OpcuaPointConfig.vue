<template>
  <div class="opcua-point-config">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item field="nodeId" label="NodeId">
          <a-input
            v-model="form.node_id"
            placeholder="例如: ns=2;s=Demo.Static.Scalar.Double"
            :tooltip="{ title: 'OPC-UA节点标识符', placement: 'top' }"
          ></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="namespaceIndex" label="命名空间索引">
          <a-input
            v-model.number="form.namespace_index"
            type="number"
            min="0"
            placeholder="默认: 0"
            :tooltip="{ title: 'NodeId的命名空间索引', placement: 'top' }"
          ></a-input>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item field="dataType" label="数据类型">
          <a-select
            v-model="form.datatype"
            :options="dataTypes"
            placeholder="选择数据类型"
            allow-search
          ></a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="accessLevel" label="访问权限">
          <a-select
            v-model="form.access_level"
            :options="accessLevels"
            placeholder="选择访问权限"
          ></a-select>
        </a-form-item>
      </a-col>
    </a-row>

    <!-- 高级选项 -->
    <a-divider orientation="left" size="small">
      <span class="text-xs text-slate-500">高级选项</span>
    </a-divider>

    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item field="samplingInterval" label="采样间隔 (ms)">
          <a-input-number
            v-model.number="form.sampling_interval"
            :min="0"
            placeholder="默认: 1000"
            :tooltip="{ title: '数据采样的时间间隔（毫秒）', placement: 'top' }"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="queueSize" label="队列大小">
          <a-input-number
            v-model.number="form.queue_size"
            :min="1"
            placeholder="默认: 1"
            :tooltip="{ title: '数据变化通知的队列大小', placement: 'top' }"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item field="deadband" label="死区">
          <a-input-number
            v-model.number="form.deadband"
            :min="0"
            placeholder="可选"
            :tooltip="{ title: '数据变化死区（用于模拟量）', placement: 'top' }"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="indexRange" label="索引范围">
          <a-input
            v-model="form.index_range"
            placeholder="例如: 0:9"
            :tooltip="{ title: '数组索引范围，如 0:9 表示前10个元素', placement: 'top' }"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
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

// OPC-UA 所有标准数据类型
const dataTypes = [
  // 布尔和字节类型
  { label: 'Boolean (布尔)', value: 'bool' },
  { label: 'SByte (有符号字节)', value: 'sbyte' },
  { label: 'Byte (无符号字节)', value: 'byte' },

  // 整数类型
  { label: 'Int16 (16位整数)', value: 'int16' },
  { label: 'UInt16 (16位无符号)', value: 'uint16' },
  { label: 'Int32 (32位整数)', value: 'int32' },
  { label: 'UInt32 (32位无符号)', value: 'uint32' },
  { label: 'Int64 (64位整数)', value: 'int64' },
  { label: 'UInt64 (64位无符号)', value: 'uint64' },

  // 浮点类型
  { label: 'Float (32位浮点)', value: 'float32' },
  { label: 'Double (64位浮点)', value: 'float64' },

  // 字符串类型
  { label: 'String (字符串)', value: 'string' },
  { label: 'XmlElement (XML)', value: 'xmlliteral' },

  // 日期时间类型
  { label: 'DateTime (日期时间)', value: 'datetime' },

  // 二进制类型
  { label: 'ByteString (字节串)', value: 'bytestring' },
  { label: 'Guid (全局唯一标识符)', value: 'guid' },

  // 复杂类型
  { label: 'NodeId (节点标识符)', value: 'nodeid' },
  { label: 'StatusCode (状态码)', value: 'statuscode' },
  { label: 'QualifiedName (限定名)', value: 'qualifiedname' },
  { label: 'LocalizedText (本地化文本)', value: 'localizedtext' },
  { label: 'ExtensionObject (扩展对象)', value: 'extensionobject' },

  // 数组类型
  { label: 'Array:Int32 (整数数组)', value: 'array:int32' },
  { label: 'Array:Float (浮点数组)', value: 'array:float32' },
  { label: 'Array:Double (双精度数组)', value: 'array:float64' },
  { label: 'Array:String (字符串数组)', value: 'array:string' },
]

// 访问权限选项
const accessLevels = [
  { label: 'Read Only (只读)', value: 'R' },
  { label: 'Write Only (只写)', value: 'W' },
  { label: 'Read/Write (读写)', value: 'RW' },
  { label: 'Read + History (读+历史)', value: 'R_H' },
  { label: 'Read/Write + History (读写+历史)', value: 'RW_H' },
]
</script>

<style scoped>
.opcua-point-config {
  padding: 8px 0;
}

.opcua-point-config :deep(.arco-select-view-single) {
  width: 100%;
}
</style>
