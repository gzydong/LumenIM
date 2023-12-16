import { getCurrentInstance } from 'vue'
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import type { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider'
import type { NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider'

export function useUtil() {
  const ctx = getCurrentInstance()

  if (!ctx) {
    throw new Error('useUtil must be called in setup function')
  }

  const message: MessageApiInjection = ctx.appContext.config.globalProperties.$message
  const dialog: DialogApiInjection = ctx.appContext.config.globalProperties.$dialog
  const notification: NotificationApiInjection =
    ctx.appContext.config.globalProperties.$notification

  return { message, dialog, notification }
}
