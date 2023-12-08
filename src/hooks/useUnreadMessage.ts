import { watchEffect } from 'vue'
import { useTalkStore } from '@/store'
import { isElectronMode, electron } from '@/utils/common'

export const useUnreadMessage = () => {
  const useTalk = useTalkStore()
  const el = document.getElementsByTagName('title')[0]
  const title = el.innerText

  watchEffect(() => {
    if (isElectronMode()) {
      electron().setBadge(useTalk.talkUnreadNum)
    } else {
      setInterval(() => {
        if (useTalk.talkUnreadNum > 0) {
          el.innerText =
            el.innerText == title ? `您有新的消息未读(${useTalk.talkUnreadNum})` : title
        } else {
          el.innerText = title
        }
      }, 1000)
    }
  })

  return {}
}
