import axios from 'axios'
import { showMessage } from '@/composables/useGlobalState'

const service = axios.create({
  baseURL: '',
  timeout: 30000 // Increased timeout for slow protocol operations (BACnet scan)
})

service.interceptors.request.use(
  config => {
    try {
      const raw = localStorage.getItem('loginInfo')
      // console.log('[Request] loginInfo raw:', raw)
      if (raw) {
        const parsed = JSON.parse(raw)
        const token = parsed.token || (parsed.data && parsed.data.token) || ''
        
        // console.log('[Request] token:', token)
        if (token) {
          if (!config.headers) {
            config.headers = {}
          }
          // 兼容 AxiosHeaders 和普通对象
          if (typeof config.headers.set === 'function') {
             config.headers.set('token', token)
             config.headers.set('Authorization', `Bearer ${token}`)
          } else {
             config.headers['token'] = token
             config.headers['Authorization'] = `Bearer ${token}`
          }
        }
      }
    } catch (e) {
      console.error('Failed to get token', e)
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    const status = error.response && error.response.status
    if (status === 401) {
      try {
        localStorage.removeItem('loginInfo')
      } catch (e) {}
      if (!window.location.hash.includes('#/login')) {
        window.location.href = '/#/login'
      }
      showMessage('登录已过期，请重新登录', 'error')
    } else {
      const msg =
        (error.response && (error.response.data?.message || error.response.data?.msg)) ||
        error.message ||
        'Error'
      showMessage(msg, 'error')
    }
    return Promise.reject(error)
  }
)

export default service
