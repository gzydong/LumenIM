import { getCurrentInstance } from 'vue'
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import type { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider'
import type { NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider'

export function useUtil() {
  const ctx = getCurrentInstance()

  if (!ctx) {
    throw new Error('useUtil must be called in setup function')
  }

  const useMessage: MessageApiInjection = ctx.appContext.config.globalProperties.$message
  const useDialog: DialogApiInjection = ctx.appContext.config.globalProperties.$dialog
  const useNotification: NotificationApiInjection =
    ctx.appContext.config.globalProperties.$notification

  return { useMessage, useDialog, useNotification }
}
