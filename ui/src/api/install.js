import request from '../utils/request'

export default {
  checkInstallStatus() {
    return request({
      url: '/api/install/status',
      method: 'get'
    })
  },

  checkPort(port) {
    return request({
      url: '/api/install/check-port',
      method: 'get',
      params: { port }
    })
  },

  checkPath(path) {
    return request({
      url: '/api/install/check-path',
      method: 'post',
      data: { path }
    })
  },

  validateConfig(config) {
    return request({
      url: '/api/install/validate',
      method: 'post',
      data: config
    })
  },

  startInstall(config) {
    return request({
      url: '/api/install/start',
      method: 'post',
      data: config
    })
  },

  getInstallStatus() {
    return request({
      url: '/api/install/install-status',
      method: 'get'
    })
  }
}