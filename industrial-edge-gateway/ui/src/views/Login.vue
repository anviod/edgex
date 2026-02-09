<template>
  <div class="login-container">
    <!-- 蓝色光斑背景 -->
    <div class="background-animation">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
      <div class="blob blob-4"></div>
      <div class="blob blob-5"></div>
    </div>

    <!-- 登录卡片 -->
    <v-card 
      class="login-card glass-card pa-8" 
      :class="{'shake-animation': isShaking, 'login-card-exit': isLoginSuccess}"
      elevation="10" 
      width="420" 
      theme="light"
    >
      <div class="text-center mb-6 position-relative">
        <div class="logo-icon mx-auto mb-4">
           <span>EDGE</span>
        </div>
        <h1 class="text-h5 font-weight-bold text-white">{{ ctxData.configInfo.name || '系统登录' }}</h1>
        <v-progress-linear
          :model-value="(ctxData.countdown / 60) * 100"
          :color="ctxData.countdown <= 10 ? 'error' : 'primary'"
          height="1"
          rounded
          reverse
          class="mx-auto mt-4"
          style="width: 96%"
        ></v-progress-linear>
      </div>

      <v-form ref="loginFormRef" @submit.prevent="handleLogin">
        <!-- Login Method Toggle -->
        <div class="d-flex justify-center mb-4">
            <v-btn-toggle
                v-model="ctxData.loginMethod"
                mandatory
                rounded="xl"
                color="primary"
                density="compact"
                class="login-method-toggle"
            >
                <v-btn value="local" size="small" prepend-icon="mdi-account-circle">本地登录</v-btn>
                <v-btn value="ldap" size="small" prepend-icon="mdi-domain">LDAP 登录</v-btn>
            </v-btn-toggle>
        </div>

        <!-- HTML5 Username Input -->
        <div class="custom-input-group mb-4">
            <div class="input-icon">
                <v-icon icon="mdi-account" size="small" color="primary"></v-icon>
            </div>
            <input 
                type="text" 
                v-model.trim="ctxData.loginForm.userName"
                placeholder="请输入用户名"
                class="html5-input"
                required
            />
        </div>

        <!-- HTML5 Password Input -->
        <div class="custom-input-group mb-4">
            <div class="input-icon">
                <v-icon icon="mdi-lock" size="small" color="primary"></v-icon>
            </div>
            <input 
                :type="showPassword ? 'text' : 'password'"
                v-model.trim="ctxData.loginForm.password"
                placeholder="请输入密码"
                class="html5-input"
                required
                @keyup.enter="handleLogin"
            />
            <div class="password-toggle" @click="showPassword = !showPassword">
                <v-icon :icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" size="small" color="grey"></v-icon>
            </div>
        </div>

        <div class="d-flex justify-space-between align-center mb-6">
            <v-checkbox
                v-model="ctxData.rememberMe"
                label="记住密码"
                hide-details
                density="compact"
                color="primary"
                class="remember-checkbox"
            ></v-checkbox>
            <a href="#" class="forgot-link text-body-2" @click.prevent="handleForgotPassword">忘记密码？</a>
        </div>

        <v-btn
            block
            :color="isLoginSuccess ? 'success' : 'primary'"
            size="large"
            type="submit"
            :loading="ctxData.loading"
            :disabled="isLoginSuccess"
            class="login-button text-capitalize font-weight-bold"
            elevation="4"
        >
            <v-slide-y-transition mode="out-in">
                <div v-if="isLoginSuccess" class="d-flex align-center justify-center">
                    <v-icon start>mdi-check-circle</v-icon>
                    登录成功
                </div>
                <span v-else>立即登录</span>
            </v-slide-y-transition>
        </v-btn>

        <v-expand-transition>
            <div v-if="ctxData.errorMessage" class="error-message mt-4">
                <v-icon icon="mdi-alert-circle" color="error" size="small" start></v-icon>
                {{ ctxData.errorMessage }}
            </div>
        </v-expand-transition>
      </v-form>

      <div class="footer-info mt-8 text-center text-caption text-grey">
        <div class="version mb-1">{{ ctxData.configInfo.softVer || '边缘网关开源社区版' }}</div>
        <div class="copyright">© {{ new Date().getFullYear() }} {{ ctxData.configInfo.name || '系统' }} 版权所有</div>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import LoginApi from 'api/login.js'
import router from '@/router'
import { userStore } from 'stores/user.js'
import { configStore } from '@/stores/app.js'
import { useI18n } from 'vue-i18n'
import sha256 from 'crypto-js/sha256'
import encHex from 'crypto-js/enc-hex'
import { showMessage } from '@/composables/useGlobalState'

const { t } = useI18n()
const config = configStore()
const users = userStore()

const loginFormRef = ref(null)
const showPassword = ref(false)
const isShaking = ref(false)
const isLoginSuccess = ref(false)

const ctxData = reactive({
  loginForm: {
    userName: '',
    password: '',
  },
  loginMethod: 'local',
  loading: false,
  rememberMe: false,
  configInfo: config.configInfo || {},
  nonce: '',
  errorMessage: '',
  countdown: 60,
  countdownTimer: null
})

const clearCountdown = () => {
  if (ctxData.countdownTimer) {
    clearInterval(ctxData.countdownTimer)
    ctxData.countdownTimer = null
  }
}

// 格式化倒计时显示
const formatCountdown = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

// 启动倒计时
const startCountdown = () => {
  if (ctxData.countdownTimer) {
    clearInterval(ctxData.countdownTimer)
  }

  ctxData.countdown = 60
  // 使用高频更新（20ms）实现平滑线性效果
  const interval = 20
  const step = 60 / (60 * 1000 / interval) // 每次减少的时间量

  ctxData.countdownTimer = setInterval(() => {
    ctxData.countdown -= step

    if (ctxData.countdown <= 0) {
      clearInterval(ctxData.countdownTimer)
      ctxData.countdownTimer = null
      showMessage('登录页面已过期，请刷新页面重新登录', 'warning')
      // 3 秒后自动刷新页面
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    }
  }, interval)
}

onBeforeUnmount(() => {
  if (ctxData.countdownTimer) {
    clearInterval(ctxData.countdownTimer)
    ctxData.countdownTimer = null
  }
})

onMounted(() => {
  // 检查是否有登出信息
  const logout = localStorage.getItem('logout')
  if (logout && logout !== '') {
    try {
      const lo = JSON.parse(logout)
      showMessage(lo.message || '您已成功退出登录', lo.type || 'info')
    } catch (error) {
      console.error('解析登出信息失败:', error)
    }
    localStorage.setItem('logout', '')
  }

  // 加载记住的账号
  loadRememberedAccount()
  // 获取系统信息（版本等）
  getSystemInfo()
  // 获取nonce
  getNonce()
  // 启动倒计时
  startCountdown()
})

const loadRememberedAccount = () => {
  try {
    const saved = localStorage.getItem('rememberedAccount')
    if (saved) {
      const account = JSON.parse(saved)
      ctxData.loginForm.userName = account.userName || ''
      ctxData.rememberMe = true
    }
  } catch (e) {
    console.error('加载保存的账号失败:', e)
  }
}

const getSystemInfo = async () => {
  try {
    const res = await LoginApi.getSystemInfo()
    if (res.code === '0' && res.data) {
      const newConfigInfo = {
        ...ctxData.configInfo,
        ...res.data
      }
      ctxData.configInfo = newConfigInfo
      config.setConfigInfo(newConfigInfo)
    }
  } catch (error) {
    console.error('获取系统信息失败:', error)
  }
}

const getNonce = async () => {
  try {
    const res = await LoginApi.getNonce()
    if (res.code === '0' && res.data?.nonce) {
      ctxData.nonce = res.data.nonce
    } else {
      console.warn('获取nonce失败，使用本地生成')
      ctxData.nonce = Date.now().toString(36) + Math.random().toString(36).substr(2)
    }
  } catch (error) {
    console.error('获取nonce异常:', error)
    ctxData.nonce = Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
}

const handleLogin = async () => {
  // 手动验证
  if (!ctxData.loginForm.userName) {
    ctxData.errorMessage = '请输入用户名'
    triggerShake()
    return
  }
  if (!ctxData.loginForm.password) {
    ctxData.errorMessage = '请输入密码'
    triggerShake()
    return
  }
  if (ctxData.loginForm.password.length < 8) {
    ctxData.errorMessage = '密码长度至少8位'
    triggerShake()
    return
  }

  ctxData.loading = true
  ctxData.errorMessage = ''

  try {
    if (!ctxData.nonce) {
      await getNonce()
    }

    let passwordToSend = ''
    if (ctxData.loginMethod === 'ldap') {
      // LDAP 模式：发送原始密码
      passwordToSend = ctxData.loginForm.password
    } else {
      // 本地模式：发送 Hash 密码
      passwordToSend = sha256(ctxData.loginForm.password + ctxData.nonce).toString(encHex)
    }

    const loginData = {
      loginFlag: true,
      loginType: ctxData.loginMethod,
      data: {
        username: ctxData.loginForm.userName,
        password: passwordToSend,
        nonce: ctxData.nonce,
      },
      token: '',
    }

    const res = await LoginApi.login(loginData)

    if (res.code === '0') {
      await handleLoginSuccess(res)
    } else {
      handleLoginFailure(res)
      triggerShake()
      ctxData.loading = false
    }
  } catch (error) {
    handleLoginError(error)
    triggerShake()
    ctxData.loading = false
  }
}

const triggerShake = () => {
  isShaking.value = true
  setTimeout(() => {
    isShaking.value = false
  }, 500)
}

const handleLoginSuccess = async (res) => {
  clearCountdown()
  try {
    ctxData.errorMessage = ''
    isLoginSuccess.value = true // 触发成功状态
    
    const processedPermissions = processPermissions(res.data.permissions)

    users.setLoginInfo(
      {userName: res.data.username},
      processedPermissions,
      res.data.token
    )

    const storeData = {
      ...res.data,
      permissions: processedPermissions,
      loginTime: Date.now()
    }
    localStorage.setItem('loginInfo', JSON.stringify(storeData))

    if (ctxData.rememberMe) {
      localStorage.setItem('rememberedAccount', JSON.stringify({
        userName: ctxData.loginForm.userName,
        timestamp: Date.now()
      }))
    } else {
      localStorage.removeItem('rememberedAccount')
    }

    showMessage('登录成功')

    ctxData.loading = false
    await new Promise(resolve => setTimeout(resolve, 1000))
    await router.push('/')

  } catch (error) {
    console.error('处理登录成功数据失败:', error)
    ctxData.errorMessage = '处理用户数据失败，请稍后重试'
    ctxData.loading = false
  }
}

const processPermissions = (permissions) => {
  const perms = Array.isArray(permissions) ? [...permissions] : []

  const ensureTerminalGroup = (list) => {
    const edge = list.find(p =>
      p && (p.path === '/ruleEngine' || p.meta?.title === '边缘计算')
    )

    if (edge) {
      edge.children = edge.children || []
      const hasTerminalGroup = edge.children.some(c =>
        c && (c.path === '/terminalGroup' || c.meta?.title === '末端群控')
      )

      if (!hasTerminalGroup) {
        const terminalGroup = {
          path: '/terminalGroup',
          name: 'TerminalGroup',
          meta: {title: '末端群控', icon: 'terminal'}
        }

        const scriptIndex = edge.children.findIndex(c =>
          c && c.meta?.title === '规则脚本'
        )

        if (scriptIndex >= 0) {
          edge.children.splice(scriptIndex + 1, 0, terminalGroup)
        } else {
          edge.children.push(terminalGroup)
        }
      }
    } else {
      list.push({
        name: 'RuleEngine',
        path: '/ruleEngine',
        meta: {title: '边缘计算', icon: 'ruleEngine'},
        children: [{
          path: '/terminalGroup',
          name: 'TerminalGroup',
          meta: {title: '末端群控', icon: 'terminal'}
        }]
      })
    }

    return list
  }

  return ensureTerminalGroup(perms)
}

const handleLoginFailure = (res) => {
  ctxData.errorMessage = res.message || '登录失败，请检查用户名和密码'
  getNonce() // 失败后重新获取nonce
}

const handleLoginError = (error) => {
  console.error('登录错误:', error)

  if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
    ctxData.errorMessage = '网络连接失败，请检查网络后重试'
  } else {
    ctxData.errorMessage = '登录异常，请稍后重试'
  }

  getNonce() // 错误后重新获取nonce
}

const handleForgotPassword = () => {
  showMessage('请联系系统管理员重置密码', 'info')
}
</script>

<style scoped>
/* 基础样式 */
.login-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 科技感背景动画 */
.background-animation {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  background: 
    radial-gradient(circle at 15% 50%, rgba(56, 189, 248, 0.04), transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(99, 102, 241, 0.04), transparent 25%);
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.15;
  animation: float 20s infinite ease-in-out;
}

.blob-1 {
  width: 500px;
  height: 500px;
  background: #3b82f6;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.blob-2 {
  width: 400px;
  height: 400px;
  background: #6366f1;
  bottom: -100px;
  right: -100px;
  animation-delay: -5s;
}

.blob-3 {
  width: 300px;
  height: 300px;
  background: #0ea5e9;
  top: 40%;
  left: 30%;
  animation-delay: -10s;
}

.blob-4 {
  width: 350px;
  height: 350px;
  background: #8b5cf6;
  bottom: -50px;
  left: -50px;
  animation-delay: -15s;
}

.blob-5 {
  width: 250px;
  height: 250px;
  background: #ec4899;
  top: 10%;
  right: -50px;
  animation-delay: -8s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(50px, 50px); }
  50% { transform: translate(0, 100px); }
  75% { transform: translate(-50px, 50px); }
}

/* 登录卡片 */
.login-card {
  z-index: 10;
  /* Glassmorphism handled by .glass-card in global css or here */
  /* Vuetify handles basics, we add specific overrides if needed */
}

.logo-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
}

.logo-icon span {
  font-weight: 800;
  font-size: 14px;
  color: white;
  letter-spacing: 1px;
}

.subtitle-divider {
  height: 4px;
  width: 40px;
  background: #3b82f6;
  border-radius: 2px;
}

.forgot-link {
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #3b82f6;
}

.login-button {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  transition: all 0.2s;
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
}

.error-message {
  padding: 8px 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  color: #f87171;
  font-size: 14px;
  display: flex;
  align-items: center;
}

/* HTML5 Input Styles */
.custom-input-group {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 8px;
    padding: 0 12px;
    height: 48px; /* Fixed height to match password field with toggle */
    transition: all 0.3s ease;
}

/* Linear progress transition override */
:deep(.v-progress-linear__determinate) {
    transition: width 0.05s linear !important;
}

.custom-input-group:focus-within {
    background: rgba(255, 255, 255, 0.8);
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.input-icon {
    margin-right: 10px;
    display: flex;
    align-items: center;
}

.html5-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: #0f172a;
    width: 100%;
}

.html5-input::placeholder {
    color: #94a3b8;
}

.password-toggle {
    cursor: pointer;
    margin-left: 8px;
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 50%;
    transition: background 0.2s;
}

.password-toggle:hover {
    background: rgba(0, 0, 0, 0.05);
}

/* Vuetify Overrides for Transparent/Glass effect */
:deep(.v-field__outline__start),
:deep(.v-field__outline__notch),
:deep(.v-field__outline__end) {
    border-color: transparent !important;
}

/* Removed previous focus border color override to keep it subtle */

:deep(.v-label) {
    color: #334155 !important;
}

:deep(.v-field__input) {
    color: #0f172a !important;
}

:deep(.remember-checkbox .v-label) {
    color: #94a3b8 !important;
    opacity: 1;
}

/* Animations */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  50% { transform: translateX(2px); }
  75% { transform: translateX(-1px); }
}

.shake-animation {
  animation: shake 0.3s ease-out both;
}

.login-card-exit {
    transform: scale(0.95) translateY(-20px);
    opacity: 0;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
}

/* Enhanced Focus Effect */
:deep(.v-field--focused) {
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
    transition: box-shadow 0.3s ease;
}

:deep(.v-field--focused .v-field__outline__start),
:deep(.v-field--focused .v-field__outline__notch),
:deep(.v-field--focused .v-field__outline__end) {
    border-color: rgba(59, 130, 246, 0.6) !important;
    border-width: 1px !important;
}

/* Minimal style: remove loader progress animation inside fields */
:deep(.v-field__loader) {
  display: none;
}

/* Minimal hover effect for the login button */
.login-button:hover {
  transform: none;
  box-shadow: none;
}

:deep(.v-field--error:not(.v-field--disabled) .v-field__outline__start),
:deep(.v-field--error:not(.v-field--disabled) .v-field__outline__notch),
:deep(.v-field--error:not(.v-field--disabled) .v-field__outline__end) {
    border-color: #ef4444 !important;
}
</style>
