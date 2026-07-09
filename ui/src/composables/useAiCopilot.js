import { ref, computed } from 'vue'
import AiApi from '@/api/ai'

const tasks = ref([])
const activeTask = ref(null)
const quota = ref(null)
const aiStatus = ref(null)
const aiSettings = ref(null)
const loading = ref(false)
const uploadProgress = ref(0)
const polling = ref(null)

const isTerminal = (status) => ['waiting_confirm', 'applied', 'failed', 'cancelled'].includes(status)

export function useAiCopilot() {
  const activeDeliverables = computed(() => activeTask.value?.deliverables || null)
  const validation = computed(() => activeTask.value?.validation || null)
  const stages = computed(() => activeTask.value?.stages || [])

  const fetchStatus = async () => {
    try {
      const res = await AiApi.getStatus()
      if (res.code === '0') aiStatus.value = res.data
    } catch (e) {
      aiStatus.value = { mode: 'local', message: '助手服务暂不可用' }
    }
  }

  const fetchQuota = async () => {
    try {
      const res = await AiApi.getQuota()
      if (res.code === '0') quota.value = res.data
    } catch (e) {
      console.error('quota fetch failed', e)
    }
  }

  const fetchSettings = async () => {
    try {
      const res = await AiApi.getSettings()
      if (res.code === '0') aiSettings.value = res.data
      return aiSettings.value
    } catch (e) {
      console.error('settings fetch failed', e)
      return null
    }
  }

  const saveSettings = async (payload) => {
    const res = await AiApi.updateSettings(payload)
    if (res.code === '0') {
      aiSettings.value = res.data
      return res.data
    }
    throw new Error(res.message || '保存设置失败')
  }

  const fetchTasks = async () => {
    loading.value = true
    try {
      const res = await AiApi.listTasks()
      if (res.code === '0') {
        tasks.value = (res.data || []).sort(
          (a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)
        )
      }
    } catch (e) {
      console.error('tasks list failed', e)
    } finally {
      loading.value = false
    }
  }

  const pollTask = (id) => {
    stopPolling()
    polling.value = setInterval(async () => {
      try {
        const res = await AiApi.getTask(id)
        if (res.code === '0' && res.data) {
          activeTask.value = res.data
          const idx = tasks.value.findIndex((t) => t.id === id)
          if (idx >= 0) tasks.value[idx] = res.data
          else tasks.value.unshift(res.data)
          if (isTerminal(res.data.status)) {
            stopPolling()
            await fetchQuota()
          }
        }
      } catch (e) {
        console.error('task poll failed', e)
      }
    }, 800)
  }

  const stopPolling = () => {
    if (polling.value) {
      clearInterval(polling.value)
      polling.value = null
    }
  }

  const uploadAndCreate = async (file, options = {}) => {
    loading.value = true
    uploadProgress.value = 0
    try {
      const form = new FormData()
      form.append('file', file)
      if (options.skill) form.append('skill', options.skill)
      if (options.protocol_id) form.append('protocol_id', options.protocol_id)
      if (options.observations?.length) {
        form.append('observations', JSON.stringify(options.observations))
      }
      const res = await AiApi.uploadTaskFile(form, (evt) => {
        if (evt.total) {
          uploadProgress.value = Math.round((evt.loaded / evt.total) * 100)
        }
      })
      if (res.code === '0' && res.data) {
        activeTask.value = res.data
        tasks.value.unshift(res.data)
        pollTask(res.data.id)
        uploadProgress.value = 100
        return res.data
      }
      throw new Error(res.message || '上传失败')
    } finally {
      loading.value = false
      setTimeout(() => { uploadProgress.value = 0 }, 600)
    }
  }

  const createTask = async (payload) => {
    loading.value = true
    try {
      const res = await AiApi.createTask(payload)
      if (res.code === '0' && res.data) {
        activeTask.value = res.data
        tasks.value.unshift(res.data)
        pollTask(res.data.id)
        return res.data
      }
      throw new Error(res.message || '创建任务失败')
    } finally {
      loading.value = false
    }
  }

  const selectTask = async (id) => {
    const res = await AiApi.getTask(id)
    if (res.code === '0') {
      activeTask.value = res.data
      if (!isTerminal(res.data?.status)) pollTask(id)
    }
  }

  const confirmTask = async (applyMode = 'preview') => {
    if (!activeTask.value?.id) return null
    loading.value = true
    try {
      const res = await AiApi.confirmTask(activeTask.value.id, { apply_mode: applyMode })
      if (res.code === '0') {
        activeTask.value = res.data
        const idx = tasks.value.findIndex((t) => t.id === res.data.id)
        if (idx >= 0) tasks.value[idx] = res.data
        return res.data
      }
      throw new Error(res.message || '确认失败')
    } finally {
      loading.value = false
    }
  }

  const runValidation = async (deliverables) => {
    loading.value = true
    try {
      const res = await AiApi.validateDeliverables(deliverables)
      if (res.code === '0') {
        if (activeTask.value) activeTask.value = { ...activeTask.value, validation: res.data }
        return res.data
      }
      throw new Error(res.message || '校验失败')
    } finally {
      loading.value = false
    }
  }

  const exportDeliverable = (type) => {
    const d = activeDeliverables.value
    if (!d) return
    const map = {
      protocol_model: d.protocol_model,
      point_definition: d.point_definition,
      driver_parameter: d.driver_parameter,
      validation_case: d.validation_case
    }
    const data = map[type]
    if (!data) return
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${type}-${activeTask.value?.id || 'export'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    tasks,
    activeTask,
    activeDeliverables,
    validation,
    stages,
    quota,
    aiStatus,
    aiSettings,
    loading,
    uploadProgress,
    fetchStatus,
    fetchQuota,
    fetchSettings,
    saveSettings,
    fetchTasks,
    uploadAndCreate,
    createTask,
    selectTask,
    confirmTask,
    runValidation,
    exportDeliverable,
    stopPolling,
    pollTask
  }
}
