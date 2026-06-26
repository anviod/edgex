import { defineStore } from 'pinia'
import { ref } from 'vue'
import InstallApi from 'api/install.js'

export const configStore = defineStore('config', () => {
  const configInfo = ref({})
  const installChecked = ref(false)
  const isInstalled = ref(false)
  const installChecking = ref(false)

  function setConfigInfo(info) {
    configInfo.value = info
  }

  async function checkInstallStatus() {
    if (installChecking.value) {
      return isInstalled.value
    }
    if (installChecked.value) {
      return isInstalled.value
    }
    installChecking.value = true
    try {
      const res = await InstallApi.checkInstallStatus()
      if (res.code === '0' && res.data) {
        isInstalled.value = res.data.isInstalled
      }
    } catch (error) {
      console.error('检查安装状态失败:', error)
    } finally {
      installChecked.value = true
      installChecking.value = false
    }
    return isInstalled.value
  }

  function resetInstallStatus() {
    installChecked.value = false
    isInstalled.value = false
  }

  function markInstalled() {
    isInstalled.value = true
    installChecked.value = true
  }

  return { configInfo, setConfigInfo, installChecked, isInstalled, installChecking, checkInstallStatus, resetInstallStatus, markInstalled }
})
