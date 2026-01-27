<template>
  <v-dialog v-model="visible" max-width="80%">
    <v-card class="glass-card pa-4" theme="dark">
      <v-card-title class="text-h6 font-weight-bold">
        <v-icon start color="primary">mdi-lock-reset</v-icon>
        修改密码
      </v-card-title>
      
      <v-card-text class="pt-4">
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="formData.oldPassword"
            label="旧密码"
            type="password"
            variant="outlined"
            prepend-inner-icon="mdi-lock-outline"
            :rules="[v => !!v || '请输入旧密码']"
            class="mb-2"
          ></v-text-field>
          
          <v-text-field
            v-model="formData.newPassword"
            label="新密码"
            type="password"
            variant="outlined"
            prepend-inner-icon="mdi-lock"
            :rules="newPasswordRules"
            class="mb-2"
          ></v-text-field>
          
          <v-text-field
            v-model="formData.confirmPassword"
            label="确认新密码"
            type="password"
            variant="outlined"
            prepend-inner-icon="mdi-lock-check"
            :rules="confirmPasswordRules"
          ></v-text-field>
        </v-form>
      </v-card-text>
      
      <v-card-actions class="justify-end pt-0">
        <v-btn variant="text" @click="visible = false">取消</v-btn>
        <v-btn 
          color="primary" 
          variant="elevated" 
          @click="handleSubmit"
          :loading="loading"
        >
          确认修改
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import LoginApi from '@/api/login'
import { showMessage } from '@/composables/useGlobalState'
import sha256 from 'crypto-js/sha256'
import encHex from 'crypto-js/enc-hex'
import { userStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const visible = ref(false)
const loading = ref(false)
const formRef = ref(null)
const users = userStore()
const router = useRouter()

const formData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const newPasswordRules = [
  v => !!v || '请输入新密码',
  v => v.length >= 8 || '密码长度至少8位'
]

const confirmPasswordRules = [
  v => !!v || '请确认新密码',
  v => v === formData.newPassword || '两次输入的密码不一致'
]

const open = () => {
  formData.oldPassword = ''
  formData.newPassword = ''
  formData.confirmPassword = ''
  visible.value = true
}

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    // 1. Get Nonce
    const nonceRes = await LoginApi.getNonce()
    let nonce = ''
    if (nonceRes.code === '0' && nonceRes.data?.nonce) {
      nonce = nonceRes.data.nonce
    } else {
      throw new Error('获取安全令牌失败')
    }

    // 2. Hash Old Password
    // Backend expects SHA256(raw_old_pass + nonce)
    // However, if we don't know the raw old password (we do, user typed it), we use it.
    // Wait, the backend verification logic:
    // expected := sha256.Sum256([]byte(user.Password + req.Nonce))
    // This assumes user.Password in DB is PLAIN TEXT.
    // If user.Password in DB is hashed, we can't verify it this way easily unless we know the hash mechanism.
    // Assuming the backend stores plain text for now (based on `handleLogin` logic which also hashes `user.Password + nonce`).
    
    const hashedOld = sha256(formData.oldPassword + nonce).toString(encHex)

    // 3. Send Request
    const res = await LoginApi.changePassword({
      oldPassword: hashedOld,
      newPassword: formData.newPassword, // Sending raw new password (will be stored as is)
      nonce: nonce
    })

    if (res.code === '0') {
      showMessage('密码修改成功，请重新登录', 'success')
      visible.value = false
      // Logout logic
      localStorage.removeItem('loginInfo')
      router.push('/login')
    } else {
      showMessage(res.msg || '修改失败', 'error')
    }
  } catch (error) {
    console.error(error)
    showMessage(error.message || '系统异常', 'error')
  } finally {
    loading.value = false
  }
}

defineExpose({ open })
</script>

<style scoped>
.glass-card {
  background: rgba(30, 41, 59, 0.95) !important; /* Slightly more opaque for dialog */
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}
</style>