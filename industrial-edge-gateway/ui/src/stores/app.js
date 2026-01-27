import { defineStore } from 'pinia'
import { ref } from 'vue'

export const configStore = defineStore('config', () => {
  const configInfo = ref({})

  function setConfigInfo(info) {
    configInfo.value = info
  }

  return { configInfo, setConfigInfo }
})
