<template>
  <a-modal
    v-model:visible="visible"
    title="AI 助手设置"
    :width="720"
    modal-class="ai-settings-modal"
    unmount-on-close
    :mask-closable="false"
    render-to-body
    @cancel="handleCancel"
  >
    <div class="ai-settings-banner">
      <span class="ai-settings-banner__tag">Copilot</span>
      <span>
        配置 AI 部署模式、平台接入与认证方式。设置保存至网关
        <code>config.db</code>（<code>ai_copilot</code>），立即影响配额栏与状态显示。
      </span>
    </div>

    <a-form :model="form" layout="vertical" class="ai-settings-form">
      <a-form-item label="部署模式" required>
        <a-radio-group v-model="form.deployment_mode" type="button" size="small" @change="onDeploymentChange">
          <a-radio
            v-for="m in AI_DEPLOYMENT_MODES"
            :key="m.value"
            :value="m.value"
          >
            {{ m.label }}
          </a-radio>
        </a-radio-group>
        <div class="ai-settings-hint">{{ deploymentHint }}</div>
      </a-form-item>

      <a-form-item label="平台 / 提供商" required>
        <a-select
          v-model="form.provider"
          placeholder="选择 AI 平台"
          allow-search
          popup-container=".ai-settings-modal"
          @change="onProviderChange"
        >
          <a-option
            v-for="p in availableProviders"
            :key="p.value"
            :value="p.value"
            :label="p.label"
          />
        </a-select>
      </a-form-item>

      <template v-if="form.deployment_mode === 'remote'">
        <a-form-item label="gRPC 端点" required>
          <a-input
            v-model="form.grpc_endpoint"
            placeholder="192.168.1.10:50051"
            class="mono-text"
          />
        </a-form-item>
      </template>

      <template v-if="form.deployment_mode === 'cloud'">
        <a-form-item>
          <template #label>
            <span>启用云端调用</span>
            <a-tooltip
              content="对应规划文档 enable_cloud；未启用时不允许保存 cloud 模式"
              popup-container=".ai-settings-modal"
            >
              <icon-question-circle class="ai-settings-label-icon" />
            </a-tooltip>
          </template>
          <a-switch v-model="form.enable_cloud" />
        </a-form-item>

        <a-form-item label="API Base URL" required>
          <a-input
            v-model="form.base_url"
            placeholder="https://api.openai.com/v1"
            class="mono-text"
          />
        </a-form-item>

        <a-form-item label="认证方式">
          <a-select v-model="form.auth_type" popup-container=".ai-settings-modal">
            <a-option
              v-for="a in AI_AUTH_TYPES"
              :key="a.value"
              :value="a.value"
              :label="a.label"
            />
          </a-select>
          <div v-if="authHint" class="ai-settings-hint">{{ authHint }}</div>
        </a-form-item>

        <template v-if="form.auth_type === 'bearer' || form.auth_type === 'azure_key'">
          <a-form-item :label="form.auth_type === 'azure_key' ? 'API Key（Azure）' : 'API Key / Token'">
            <a-input-password
              v-model="form.api_key"
              :placeholder="form.api_key_set ? '已设置，留空保持不变' : '输入 API Key'"
              allow-clear
            />
          </a-form-item>
        </template>

        <template v-if="form.auth_type === 'api_key'">
          <a-row :gutter="12">
            <a-col :span="10">
              <a-form-item label="Header 名称">
                <a-input v-model="form.api_key_header" placeholder="X-API-Key" class="mono-text" />
              </a-form-item>
            </a-col>
            <a-col :span="14">
              <a-form-item label="Header 值">
                <a-input-password
                  v-model="form.api_key"
                  :placeholder="form.api_key_set ? '已设置，留空保持不变' : '输入密钥'"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
        </template>

        <template v-if="form.auth_type === 'basic'">
          <a-row :gutter="12">
            <a-col :span="12">
              <a-form-item label="用户名">
                <a-input v-model="form.username" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="密码">
                <a-input-password
                  v-model="form.password"
                  :placeholder="form.password_set ? '已设置，留空保持不变' : '输入密码'"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
        </template>

        <a-form-item v-if="form.auth_type === 'azure_key'" label="Azure API Version">
          <a-input v-model="form.azure_api_version" placeholder="2024-02-15-preview" class="mono-text" />
        </a-form-item>

        <a-form-item v-if="form.provider === 'azure-openai'" label="部署名称（Model）">
          <a-input v-model="form.model" placeholder="gpt-4o-deployment" class="mono-text" />
        </a-form-item>
        <a-form-item v-else label="模型">
          <a-select
            v-model="form.model"
            allow-create
            allow-search
            placeholder="选择或输入模型 ID"
            popup-container=".ai-settings-modal"
          >
            <a-option v-for="m in modelOptions" :key="m" :value="m" :label="m" />
          </a-select>
        </a-form-item>
      </template>

      <a-collapse :bordered="false" class="ai-settings-collapse">
        <a-collapse-item header="配额限制" key="quota">
          <a-row :gutter="12">
            <a-col :span="12">
              <a-form-item label="每日 Token 上限">
                <a-input-number v-model="form.tokens_limit" :min="1000" :max="10000000" :step="1000" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="每日任务上限">
                <a-input-number v-model="form.tasks_limit" :min="1" :max="10000" :step="10" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-collapse-item>
      </a-collapse>
    </a-form>

    <template #footer>
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" :loading="saving" @click="handleSave">保存</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconQuestionCircle } from '@arco-design/web-vue/es/icon'
import {
  AI_DEPLOYMENT_MODES,
  AI_AUTH_TYPES,
  AI_PROVIDERS,
  defaultAiSettings,
  findProvider,
  applyProviderPreset
} from '@/constants/aiProviders'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  settings: { type: Object, default: null },
  saving: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'save'])

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const form = ref(defaultAiSettings())

const availableProviders = computed(() => {
  const mode = form.value.deployment_mode
  if (mode === 'local') {
    return AI_PROVIDERS.filter((p) => p.deploymentMode === 'local')
  }
  if (mode === 'remote') {
    return AI_PROVIDERS.filter((p) => p.deploymentMode === 'remote')
  }
  return AI_PROVIDERS.filter((p) => p.deploymentMode === 'cloud')
})

const deploymentHint = computed(() => {
  const m = AI_DEPLOYMENT_MODES.find((d) => d.value === form.value.deployment_mode)
  return m?.desc || ''
})

const authHint = computed(() => {
  const a = AI_AUTH_TYPES.find((t) => t.value === form.value.auth_type)
  return a?.desc || ''
})

const modelOptions = computed(() => {
  const preset = findProvider(form.value.provider)
  return preset?.models || []
})

const syncForm = (settings) => {
  form.value = { ...defaultAiSettings(), ...(settings || {}) }
}

watch(
  () => props.settings,
  (val) => { if (val) syncForm(val) },
  { immediate: true, deep: true }
)

watch(visible, (open) => {
  if (open && props.settings) syncForm(props.settings)
})

const onDeploymentChange = (mode) => {
  const match = AI_PROVIDERS.find((p) => p.deploymentMode === mode)
  if (match) applyProviderPreset(form.value, match.value)
}

const onProviderChange = (provider) => {
  applyProviderPreset(form.value, provider)
}

const handleCancel = () => {
  visible.value = false
  if (props.settings) syncForm(props.settings)
}

const handleSave = () => {
  if (form.value.deployment_mode === 'cloud' && !form.value.enable_cloud) {
    Message.warning('云端模式需先启用「启用云端调用」')
    return
  }
  if (form.value.deployment_mode === 'remote' && !form.value.grpc_endpoint?.trim()) {
    Message.warning('请填写 AI Model Center gRPC 端点')
    return
  }
  if (form.value.deployment_mode === 'cloud' && !form.value.base_url?.trim()) {
    Message.warning('请填写 API Base URL')
    return
  }
  emit('save', { ...form.value })
}
</script>
