import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'

export const useSettingsStore = defineStore('settings', {
  state: () => {
    return {
      isPromptTone: storage.get('isPromptTone', false), // 新消息提示音
      isKeyboard: storage.get('isKeyboard', false), // 是否推送键盘输入事件
      isLeaveWeb: false, // 是否离开网页
      isNotify: storage.get('isNotify', true), // 是否同意浏览器通知
      isFullScreen: storage.get('isFullScreen', true), // 是否客户端全屏
      darkTheme: storage.get('darkTheme', false)
    }
  },
  actions: {
    setPromptTone(value: boolean) {
      this.isPromptTone = value
      storage.set('isPromptTone', value, null)
    },
    setKeyboard(value: boolean) {
      this.isKeyboard = value
      storage.set('isKeyboard', value, null)
    },
    setFullScreen(value: boolean) {
      this.isFullScreen = value
      storage.set('isFullScreen', value, null)
    },
    setDarkTheme(value: boolean) {
      this.darkTheme = value
      storage.set('darkTheme', value, null)
    },
    setNotify(value: boolean) {
      this.isNotify = value
      storage.set('isNotify', value, null)
    }
  }
})
