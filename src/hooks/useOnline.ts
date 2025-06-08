import { ref, onMounted, onUnmounted } from 'vue'

export function useOnline() {
  const online = ref(true)

  const setOnlineStatus = (val: any): void => {
    online.value = typeof val == 'boolean' ? val : val.target.online
  }

  if (navigator.onLine) {
    setOnlineStatus(true)
  } else {
    setOnlineStatus(false)
  }

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
