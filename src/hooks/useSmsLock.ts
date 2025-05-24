import { ref, onUnmounted } from 'vue'
import SmsLock from '@/plugins/sms-lock'
import { NButton } from 'naive-ui'

export function useSmsLock(key: string, time = 60) {
  const lockTime = ref(0)

  // 初始化短信按钮锁
  const lock = new SmsLock(key, time, (time) => {
    lockTime.value = time
  })

  const startCountdown = () => {
    return lock.start()
  }

  onUnmounted(() => {
    lock.clear()
  })

  const Countdown = defineComponent((props) => {
    return () => {
      return h(
        NButton,
        {
          ...props.$attrs,
          disabled: lockTime.value > 0,
          bordered: true
        },
        () => {
          return lockTime.value > 0 ? `发送验证码(${lockTime.value}s)` : '发送验证码'
        }
      )
    }
  })

  return {
    lockTime,
    startCountdown,
    Countdown
  }
}
