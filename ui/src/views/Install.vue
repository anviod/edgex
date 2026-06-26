<template>
  <div class="install-container">
    <div class="install-wrapper">
      <div class="install-header">
        <div class="logo-section">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#0ea5e9" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div class="logo-text">
            <div class="brand-name">Industrial Edge Gateway</div>
            <div class="brand-version">系统初始化配置</div>
          </div>
        </div>
      </div>

      <div v-if="installState === 'config'" class="install-content">
        <div class="step-indicator">
          <div class="step active">
            <span class="step-number">1</span>
            <span class="step-label">配置信息</span>
          </div>
          <div class="step-divider"></div>
          <div class="step">
            <span class="step-number">2</span>
            <span class="step-label">初始化</span>
          </div>
          <div class="step-divider"></div>
          <div class="step">
            <span class="step-number">3</span>
            <span class="step-label">完成</span>
          </div>
        </div>

        <div class="config-form">
          <div class="form-group">
            <label class="form-label">
              <IconSettings class="label-icon" />
              Web服务端口
            </label>
            <div class="input-group">
              <a-input 
                v-model="formData.port" 
                type="number" 
                :placeholder="'请输入端口号 (80-65535)'" 
                size="large"
                :status="portStatus"
                @blur="validatePort"
              >
                <template #suffix>
                  <span v-if="portChecking" class="checking">
                    <IconLoading class="loading" />
                  </span>
                  <span v-else-if="portAvailable !== null" :class="['status', portAvailable ? 'success' : 'error']">
                    <IconCheckCircle v-if="portAvailable" />
                    <IconCloseCircle v-else />
                  </span>
                </template>
              </a-input>
            </div>
            <div v-if="portMessage" :class="['form-hint', portAvailable === false ? 'error' : 'success']">
              {{ portMessage }}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <IconUser class="label-icon" />
              管理员用户名
            </label>
            <div class="input-group">
              <a-input 
                v-model="formData.username" 
                :placeholder="'请输入用户名'" 
                size="large"
                :status="usernameStatus"
              >
                <template #prefix>
                  <IconUser />
                </template>
              </a-input>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <IconLock class="label-icon" />
              管理员密码
            </label>
            <div class="input-group">
              <a-input-password 
                v-model="formData.password" 
                :placeholder="'请输入密码'" 
                size="large"
                :status="passwordStatus"
                @blur="validatePassword"
              >
                <template #prefix>
                  <IconLock />
                </template>
              </a-input-password>
            </div>
            <div v-if="passwordMessage" class="form-hint error">
              {{ passwordMessage }}
            </div>
            <div class="password-rules">
              <div class="rule" :class="{ pass: formData.password.length >= 8 }">
                <IconCheckCircle v-if="formData.password.length >= 8" />
                <IconCloseCircle v-else />
                <span>至少8位</span>
              </div>
              <div class="rule" :class="{ pass: /[A-Z]/.test(formData.password) }">
                <IconCheckCircle v-if="/[A-Z]/.test(formData.password)" />
                <IconCloseCircle v-else />
                <span>包含大写字母</span>
              </div>
              <div class="rule" :class="{ pass: /[a-z]/.test(formData.password) }">
                <IconCheckCircle v-if="/[a-z]/.test(formData.password)" />
                <IconCloseCircle v-else />
                <span>包含小写字母</span>
              </div>
              <div class="rule" :class="{ pass: /[0-9]/.test(formData.password) }">
                <IconCheckCircle v-if="/[0-9]/.test(formData.password)" />
                <IconCloseCircle v-else />
                <span>包含数字</span>
              </div>
              <div class="rule" :class="{ pass: hasSpecialChar }">
                <IconCheckCircle v-if="hasSpecialChar" />
                <IconCloseCircle v-else />
                <span>包含特殊符号</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <IconLock class="label-icon" />
              确认密码
            </label>
            <div class="input-group">
              <a-input-password 
                v-model="formData.confirmPassword" 
                :placeholder="'请再次输入密码'" 
                size="large"
                :status="confirmPasswordStatus"
                @blur="validateConfirmPassword"
              >
                <template #prefix>
                  <IconLock />
                </template>
              </a-input-password>
            </div>
            <div v-if="confirmPasswordMessage" class="form-hint error">
              {{ confirmPasswordMessage }}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <IconNav class="label-icon" />
              网关名称
            </label>
            <div class="input-group">
              <a-input 
                v-model="formData.gatewayName" 
                :placeholder="'请输入网关名称'" 
                size="large"
                :status="gatewayNameStatus"
              >
                <template #prefix>
                  <IconNav />
                </template>
              </a-input>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <IconLocation class="label-icon" />
              网关位置
            </label>
            <div class="input-group">
              <a-input 
                v-model="formData.gatewayLocation" 
                :placeholder="'例如：IDC-1栋-4楼-201机房'" 
                size="large"
                :status="gatewayLocationStatus"
              >
                <template #prefix>
                  <IconLocation />
                </template>
              </a-input>
            </div>
            <div class="form-hint">填写网关所在物理位置，便于运维管理</div>
          </div>

          <div class="form-group info-group">
            <label class="form-label">
              <IconFolder class="label-icon" />
              数据存储目录
            </label>
            <div class="info-value">
              <IconFolder />
              <span>data (配置文件: data/config.db)</span>
            </div>
            <div class="form-hint">系统将自动在此目录下创建数据库文件，无需手动选择</div>
          </div>

          <div v-if="generalErrors.length > 0" class="error-list">
            <div v-for="(error, index) in generalErrors" :key="index" class="error-item">
              <IconCloseCircleFill />
              <span>{{ error }}</span>
            </div>
          </div>

          <div class="form-actions">
            <a-button 
              type="primary" 
              size="large" 
              long 
              :loading="startingInstall"
              @click="handleStartInstall"
              class="btn-install"
            >
              <template #icon>
                <IconPlayCircle />
              </template>
              开始初始化安装
            </a-button>
          </div>
        </div>
      </div>

      <div v-else-if="installState === 'installing'" class="install-progress">
        <div class="progress-icon">
          <IconLoading class="spinner" />
        </div>
        <div class="progress-title">正在初始化系统</div>
        <div class="progress-subtitle">{{ statusText }}</div>
        
        <div class="progress-bar-wrapper">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <div class="progress-info">{{ currentStep }} / {{ totalSteps }} · {{ progress }}%</div>
        </div>

        <div class="progress-log">
          <div v-for="(log, index) in logMessages" :key="index" class="log-item">
            {{ log }}
          </div>
        </div>
      </div>

      <div v-else-if="installState === 'completed'" class="install-complete">
        <div class="complete-icon">
          <IconCheckCircleFill />
        </div>
        <div class="complete-title">初始化完成</div>
        <div class="complete-subtitle">
          系统配置已完成，即将跳转到登录页面
          <span v-if="configPort">
            <br />服务端口: {{ configPort }}
          </span>
        </div>
        <div class="complete-countdown">
          自动跳转: <span class="countdown">{{ redirectCountdown }}s</span>
        </div>
      </div>

      <div class="install-footer">
        © {{ new Date().getFullYear() }} Industrial Edge Gateway
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import {
  IconSettings, IconUser, IconLock, IconFolder,
  IconNav, IconLocation, IconCheckCircle, IconCloseCircle,
  IconCheckCircleFill, IconCloseCircleFill, IconPlayCircle,
  IconLoading
} from '@arco-design/web-vue/es/icon'
import InstallApi from '../api/install'
import { configStore } from '../stores/app.js'

const appConfig = configStore()

const installState = ref('config')
const formData = reactive({
  port: 8080,
  username: 'admin',
  password: '',
  confirmPassword: '',
  gatewayName: '',
  gatewayLocation: ''
})

const portAvailable = ref(null)
const portChecking = ref(false)
const portMessage = ref('')
const portStatus = computed(() => {
  if (portAvailable.value === true) return 'success'
  if (portAvailable.value === false) return 'error'
  return ''
})

const passwordStatus = ref('')
const passwordMessage = ref('')
const confirmPasswordStatus = ref('')
const confirmPasswordMessage = ref('')
const usernameStatus = ref('')
const gatewayNameStatus = ref('')
const gatewayLocationStatus = ref('')

const hasSpecialChar = computed(() => {
  const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?~`]/
  return specialChars.test(formData.password)
})

const generalErrors = ref([])
const startingInstall = ref(false)

const currentStep = ref(0)
const totalSteps = ref(4)
const progress = ref(0)
const statusText = ref('')
const logMessages = ref([])

const redirectCountdown = ref(5)
let redirectTimer = null
let statusPollTimer = null
let configPort = ref(0)

const validatePort = async () => {
  if (!formData.port) {
    portAvailable.value = false
    portMessage.value = '端口号不能为空'
    return
  }
  if (formData.port < 80 || formData.port > 65535) {
    portAvailable.value = false
    portMessage.value = '端口号必须在80-65535范围内'
    return
  }

  portChecking.value = true
  try {
    const res = await InstallApi.checkPort(formData.port)
    if (res.code === '0') {
      portAvailable.value = res.data.available
      portMessage.value = res.data.error || (res.data.available ? '端口可用' : '端口已被占用')
    }
  } catch (error) {
    portAvailable.value = false
    portMessage.value = '端口检查失败: ' + error.message
  }
  portChecking.value = false
}

const validatePassword = () => {
  if (!formData.password) {
    passwordStatus.value = 'error'
    passwordMessage.value = '密码不能为空'
    return
  }
  if (formData.password.length < 8) {
    passwordStatus.value = 'error'
    passwordMessage.value = '密码长度至少8位'
    return
  }

  const hasUpperCase = /[A-Z]/.test(formData.password)
  const hasLowerCase = /[a-z]/.test(formData.password)
  const hasNumber = /[0-9]/.test(formData.password)
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?~`]/.test(formData.password)

  const typesCount = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length

  if (typesCount < 3) {
    passwordStatus.value = 'error'
    passwordMessage.value = '密码需包含大写字母、小写字母、数字、特殊符号中的至少三种组合'
    return
  }

  passwordStatus.value = 'success'
  passwordMessage.value = ''
}

const validateConfirmPassword = () => {
  if (!formData.confirmPassword) {
    confirmPasswordStatus.value = 'error'
    confirmPasswordMessage.value = '请确认密码'
    return
  }
  if (formData.confirmPassword !== formData.password) {
    confirmPasswordStatus.value = 'error'
    confirmPasswordMessage.value = '两次输入的密码不一致'
    return
  }
  confirmPasswordStatus.value = 'success'
  confirmPasswordMessage.value = ''
}

const validateForm = () => {
  generalErrors.value = []

  validatePort()
  validatePassword()
  validateConfirmPassword()

  if (!formData.username) {
    usernameStatus.value = 'error'
    generalErrors.value.push('用户名不能为空')
  } else {
    usernameStatus.value = 'success'
  }

  if (!formData.gatewayName) {
    gatewayNameStatus.value = 'error'
    generalErrors.value.push('网关名称不能为空')
  } else {
    gatewayNameStatus.value = 'success'
  }

  return generalErrors.value.length === 0 && 
         portAvailable.value === true && 
         passwordStatus.value === 'success' && 
         confirmPasswordStatus.value === 'success'
}

const handleStartInstall = async () => {
  if (!validateForm()) return

  startingInstall.value = true
  try {
    const config = {
      port: parseInt(formData.port) || 8080,
      username: formData.username,
      password: formData.password,
      storagePath: 'data',
      gatewayName: formData.gatewayName,
      gatewayLocation: formData.gatewayLocation,
      deviceSerial: ''
    }

    const res = await InstallApi.startInstall(config)
    if (res.code === '0') {
      installState.value = 'installing'
      startStatusPolling()
    } else {
      generalErrors.value.push(res.message || '启动初始化失败')
    }
  } catch (error) {
    if (error.response?.status === 409) {
      generalErrors.value.push('系统正在初始化中，请稍后再试')
    } else {
      generalErrors.value.push('启动初始化失败: ' + error.message)
    }
  } finally {
    startingInstall.value = false
  }
}

const startStatusPolling = () => {
  statusPollTimer = setInterval(async () => {
    try {
      const res = await InstallApi.getInstallStatus()
      if (res.code === '0') {
        const data = res.data
        currentStep.value = data.currentStep
        totalSteps.value = data.totalSteps
        progress.value = data.progress
        statusText.value = data.status
        logMessages.value = data.logMessages
        if (data.configPort) {
          configPort.value = data.configPort
        }

        nextTick(() => {
          const logContainer = document.querySelector('.progress-log')
          if (logContainer) {
            logContainer.scrollTop = logContainer.scrollHeight
          }
        })

        if (data.status === 'completed') {
          appConfig.markInstalled()
          installState.value = 'completed'
          stopStatusPolling()
          startRedirectCountdown()
        } else if (data.status === 'failed') {
          stopStatusPolling()
        }
      }
    } catch (error) {
      console.error('获取安装状态失败:', error)
    }
  }, 1000)
}

const stopStatusPolling = () => {
  if (statusPollTimer) {
    clearInterval(statusPollTimer)
    statusPollTimer = null
  }
}

const startRedirectCountdown = () => {
  redirectCountdown.value = 5
  redirectTimer = setInterval(() => {
    redirectCountdown.value--
    if (redirectCountdown.value <= 0) {
      clearInterval(redirectTimer)
      const currentPort = window.location.port
      const targetPort = configPort.value || formData.port
      if (targetPort && String(targetPort) !== currentPort) {
        const newUrl = `${window.location.protocol}//${window.location.hostname}:${targetPort}/#/login`
        window.location.href = newUrl
      } else {
        location.href = '/#/login'
      }
    }
  }, 1000)
}

onMounted(async () => {
  try {
    const res = await InstallApi.checkInstallStatus()
    if (res.code === '0') {
      if (res.data.isInstalled) {
        location.href = '/#/login'
      }
    }
  } catch (error) {
    console.error('检查安装状态失败:', error)
  }
})

onUnmounted(() => {
  stopStatusPolling()
  if (redirectTimer) {
    clearInterval(redirectTimer)
  }
})
</script>

<style scoped>
.install-container {
  min-height: 100vh;
  background: var(--edgex-surface-inset);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: var(--font-sans);
}

.install-wrapper {
  width: 100%;
  max-width: 520px;
  background: var(--edgex-surface-raised);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.install-header {
  background: #0ea5e9;
  padding: 24px 32px;
  border-bottom: 2px solid #0284c7;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text .brand-name {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  font-family: 'JetBrains Mono', monospace;
}

.logo-text .brand-version {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 2px;
}

.install-content {
  padding: 32px;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  gap: 8px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.step-number {
  width: 28px;
  height: 28px;
  background: var(--edgex-surface-muted);
  border: 1px solid #cbd5e1;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.step.active .step-number {
  background: #0ea5e9;
  border-color: #0ea5e9;
  color: #ffffff;
}

.step-label {
  font-size: 12px;
  color: #94a3b8;
}

.step.active .step-label {
  color: #0ea5e9;
  font-weight: 500;
}

.step-divider {
  width: 40px;
  height: 1px;
  background: #e2e8f0;
  margin-top: 14px;
}

.step.active ~ .step-divider {
  background: #0ea5e9;
}

.config-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  white-space: nowrap;
}

.label-icon {
  color: #0ea5e9;
  font-size: 14px;
}

.input-group {
  position: relative;
}

.checking {
  color: #0ea5e9;
}

.loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.status {
  font-size: 16px;
}

.status.success {
  color: #22c55e;
}

.status.error {
  color: #ef4444;
}

.form-hint {
  font-size: 12px;
  padding-left: 4px;
  color: #94a3b8;
}

.form-hint.success {
  color: #22c55e;
}

.form-hint.error {
  color: #ef4444;
}

.password-rules {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.rule {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #94a3b8;
  padding: 4px 10px;
  background: var(--edgex-surface-inset);
  border: 1px solid #e2e8f0;
}

.rule.pass {
  color: #22c55e;
  background: rgba(34, 197, 94, 0.08);
  border-color: rgba(34, 197, 94, 0.2);
}

.info-group {
  background: var(--edgex-surface-inset);
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.info-value {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #475569;
  font-family: monospace;
}

.error-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.error-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(239, 68, 68, 0.08);
  border-left: 3px solid #ef4444;
  color: #dc2626;
  font-size: 13px;
}

.form-actions {
  margin-top: 8px;
}

.btn-install {
  height: 40px !important;
  font-weight: 600;
  font-size: 14px !important;
}

.install-progress {
  padding: 48px 32px;
  text-align: center;
}

.progress-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 32px;
  height: 32px;
  color: #0ea5e9;
  animation: spin 1s linear infinite;
}

.progress-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--edgex-text-primary);
  margin-bottom: 8px;
}

.progress-subtitle {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
}

.progress-bar-wrapper {
  margin-bottom: 24px;
}

.progress-bar {
  height: 6px;
  background: #e2e8f0;
  border: 1px solid #cbd5e1;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #0ea5e9;
  transition: width 0.3s ease;
}

.progress-info {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 8px;
}

.progress-log {
  max-height: 180px;
  overflow-y: auto;
  text-align: left;
  padding: 16px;
  background: var(--edgex-surface-inset);
  border: 1px solid #e2e8f0;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.6;
}

.log-item {
  color: #475569;
  margin-bottom: 4px;
}

.install-complete {
  padding: 48px 32px;
  text-align: center;
}

.complete-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: rgba(34, 197, 94, 0.1);
  border: 2px solid rgba(34, 197, 94, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.complete-icon :deep(.arco-icon) {
  width: 40px;
  height: 40px;
  color: #22c55e;
}

.complete-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--edgex-text-primary);
  margin-bottom: 8px;
}

.complete-subtitle {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 20px;
}

.complete-countdown {
  font-size: 14px;
  color: #64748b;
}

.countdown {
  font-weight: 600;
  color: #0ea5e9;
  font-size: 18px;
}

.install-footer {
  text-align: center;
  padding: 16px 32px;
  background: var(--edgex-surface-inset);
  border-top: 1px solid #e2e8f0;
  font-size: 12px;
  color: #94a3b8;
}

:deep(.arco-input-wrapper),
:deep(.arco-input-password) {
  box-shadow: none !important;
}

:deep(.arco-input-wrapper.arco-input-focus),
:deep(.arco-input-password.arco-input-focus) {
  border-color: #0ea5e9 !important;
  box-shadow: none !important;
}

@media (max-width: 640px) {
  .install-wrapper {
    margin: 10px;
  }
  
  .install-header,
  .install-content {
    padding: 20px;
  }
  
  .step-divider {
    width: 20px;
  }
}
</style>