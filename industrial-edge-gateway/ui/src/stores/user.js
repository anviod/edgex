import { defineStore } from 'pinia'
import { ref } from 'vue'

export const userStore = defineStore('user', () => {
  const username = ref('')
  const permissions = ref([])
  const token = ref('')

  function setLoginInfo(user, perms, tok) {
    username.value = user.userName
    permissions.value = perms
    token.value = tok
  }

  return { username, permissions, token, setLoginInfo }
})
