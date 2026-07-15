import request from '@/utils/request'

export default {
  getStatus() {
    return request({ url: '/api/ai/status', method: 'get' })
  },

  chat(data) {
    return request({ url: '/api/ai/chat', method: 'post', data })
  },

  getQuota() {
    return request({ url: '/api/ai/quota', method: 'get' })
  },

  listTasks() {
    return request({ url: '/api/ai/tasks', method: 'get' })
  },

  createTask(data) {
    return request({ url: '/api/ai/tasks', method: 'post', data })
  },

  uploadTaskFile(formData, onUploadProgress) {
    return request({
      url: '/api/ai/tasks/upload',
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress
    })
  },

  getTask(id) {
    return request({ url: `/api/ai/tasks/${id}`, method: 'get' })
  },

  confirmTask(id, data) {
    return request({ url: `/api/ai/tasks/${id}/confirm`, method: 'post', data })
  },

  validateDeliverables(deliverables) {
    return request({ url: '/api/ai/validate', method: 'post', data: { deliverables } })
  },

  generateEdgeRuleDraft(description) {
    return request({ url: '/api/ai/edge-rule/draft', method: 'post', data: { description } })
  },

  getDiagnosticsSummary() {
    return request({ url: '/api/ai/diagnostics/summary', method: 'get' })
  },

  getSettings() {
    return request({ url: '/api/ai/settings', method: 'get' })
  },

  updateSettings(data) {
    return request({ url: '/api/ai/settings', method: 'put', data })
  }
}
