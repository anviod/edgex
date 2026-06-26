<template>
  <a-card class="settings-panel">
    <a-card-header>
      <div class="card-title">高可用集群</div>
    </a-card-header>
    <a-card-body>
      <a-form :model="haConfig" layout="vertical" class="industrial-form">
        <a-form-item field="role" label="节点角色">
          <a-radio-group v-model="haConfig.role" type="button" size="small">
            <a-radio value="master">主节点</a-radio>
            <a-radio value="backup">备份节点</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="heartbeat_type" label="心跳类型">
              <a-select v-model="haConfig.heartbeat_type" :options="[{ label: 'TCP', value: 'TCP' }, { label: 'UDP', value: 'UDP' }, { label: 'HTTP', value: 'HTTP' }]" class="rect-input" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="interval" label="间隔 (秒)">
              <a-input-number v-model="haConfig.interval" :min="1" :max="60" class="rect-input" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="timeout" label="超时 (秒)">
              <a-input-number v-model="haConfig.timeout" :min="1" :max="120" class="rect-input" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item field="retries" label="重试次数">
          <a-input-number v-model="haConfig.retries" :min="1" :max="10" class="rect-input" />
        </a-form-item>
        
        <div class="form-footer">
          <a-button type="primary" @click="$emit('save')">保存配置</a-button>
        </div>
      </a-form>
    </a-card-body>
  </a-card>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      role: 'master',
      heartbeat_type: 'UDP',
      interval: 2,
      timeout: 5,
      retries: 3
    })
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

const haConfig = reactive({
  ...props.modelValue
})
</script>

<style scoped>
/* v3.0 — styles in src/styles/ */
</style>
