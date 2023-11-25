import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { isLoggedIn } from '@/utils/auth'
import { useSettingsStore } from '@/store'

let once = false
const paths = ['/auth/login', '/auth/register', '/auth/forget']

export function useVisibilityChange() {
  onMounted(() => {
    document.addEventListener('visibilitychange', handle)
  })

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handle)
  })

  return {}
}

function handle() {
  useSettingsStore().isLeaveWeb = document.visibilityState === 'hidden'

  if (document.visibilityState === 'hidden') {
    return
  }

  if (isLoggedIn() || once) return

  if (paths.includes(useRouter().currentRoute.value.path)) return

  once = true

  window['$dialog'].info({
    title: '友情提示',
    content: '当前登录已失效，请重新登录？',
    positiveText: '立即登录?',
    maskClosable: false,
    onPositiveClick: () => {
      once = false
      useRouter().push('/auth/login')
    }
  })
}
