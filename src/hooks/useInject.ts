import { inject } from 'vue'
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import type { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider'
import type { NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider'

export function useInject() {
  const user: any = inject('$user')
  const dialog: DialogApiInjection = window['$dialog']
  const message: MessageApiInjection = window['$message']
  const notification: NotificationApiInjection = window['$notification']

  // 显示用户信息
  const toShowUserInfo = (uid: number) => {
    user(uid)
  }

  return { toShowUserInfo, dialog, message, notification }
}
