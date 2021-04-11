import {
  getToken,
  getUserSettingCache,
  setUserSettingCache,
} from '@/utils/auth'

let state = {
  // 主题模式 true:全屏模式 false:居中模式
  themeMode: true,

  // 主题模式为居中模式下，body 的背景图片
  themeBagImg: 'bag003',

  // 主题颜色
  themeColor: '',

  // 消息提示音
  notifyCueTone: true,

  // 键盘输入事件消息推送开关
  keyboardEventNotify: true,
}

if (getToken()) {
  Object.assign(state, getUserSettingCache())
}

/**
 * 用户相关设置
 */
const Settings = {
  state,
  mutations: {
    // 设置主题模式
    SET_THEME_MODE(state, mode) {
      state.themeMode = mode
      setUserSettingCache(state)
    },

    // 设置主题的背景图片
    SET_THEME_BAGIMG(state, bagName) {
      state.themeBagImg = bagName
      setUserSettingCache(state)
    },

    // 主题颜色
    SET_THEME_COLOR(state, color) {
      state.themeColor = color
      setUserSettingCache(state)
    },

    // 设置消息提示音状态
    SET_NOTIFY_CUE_TONE(state, isTrue) {
      state.notifyCueTone = isTrue
      setUserSettingCache(state)
    },

    // 设置键盘输入事件消息推送状态
    SET_KEYBOARD_EVENT_NOTIFY(state, isTrue) {
      state.keyboardEventNotify = isTrue
      setUserSettingCache(state)
    },
  },
}

export default Settings
