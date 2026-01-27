import request from '@/utils/request'

export default {
  // 获取系统信息
  getSystemInfo() {
    return request({
      url: '/api/auth/system-info',
      method: 'get'
    })
  },

  // 获取nonce
  getNonce() {
    return request({
      url: '/api/auth/nonce',
      method: 'get'
    })
  },

  // 登录
  login(data) {
    return request({
      url: '/api/auth/login',
      method: 'post',
      data
    })
  },

  // 登出
  logout() {
    return request({
      url: '/api/auth/logout',
      method: 'post'
    })
  },

  // 修改密码
  changePassword(data) {
    return request({
      url: '/api/auth/change-password',
      method: 'post',
      data
    })
  },

  // 重启系统
  restartSystem() {
    return request({
      url: '/api/system/restart',
      method: 'post'
    })
  }
}
