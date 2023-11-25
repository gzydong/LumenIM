import { useSettingsStore } from '@/store'
import { applyNotificationAuth } from '@/utils/notification'

export const useNotifyAuth = () => {
  applyNotificationAuth((value: boolean) => {
    useSettingsStore().isWebNotify = value
  })

  return {}
}
