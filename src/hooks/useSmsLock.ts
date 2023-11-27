import { ref, onUnmounted } from 'vue'
import SmsLock from '@/plugins/sms-lock'

export function useSmsLock(key: string, time = 60) {
  const lockTime = ref(0)

  // 初始化短信按钮锁
  const lock = new SmsLock(key, time, (time) => {
    lockTime.value = time
  })

  const start = () => {
    return lock.start()
  }

  onUnmounted(() => {
    lock.clear()
  })

  return {
    lockTime,
    start
  }
}
