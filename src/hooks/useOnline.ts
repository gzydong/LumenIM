import { ref, onMounted, onUnmounted } from 'vue'

export function useOnline() {
  const online = ref(true)

  const setOnlineStatus = (val: any) => {
    online.value = typeof val == 'boolean' ? val : val.target.online
  }

  navigator.onLine ? setOnlineStatus(true) : setOnlineStatus(false)

  onMounted(() => {
    window.addEventListener('online', setOnlineStatus)
    window.addEventListener('offline', setOnlineStatus)
  })
  onUnmounted(() => {
    window.removeEventListener('online', setOnlineStatus)
    window.removeEventListener('offline', setOnlineStatus)
  })

  return { online }
}
