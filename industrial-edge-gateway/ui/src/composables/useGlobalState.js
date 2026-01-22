import { reactive } from 'vue'

export const globalState = reactive({
    snackbar: { show: false, text: '', color: 'success' },
    wsStatus: { connected: false },
    navTitle: ''
})

export const showMessage = (text, color = 'success') => {
    globalState.snackbar.text = text
    globalState.snackbar.color = color
    globalState.snackbar.show = true
}
