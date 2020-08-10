// 用户相关设置
const Settings = {
  state: {
    // 主题模式 true:全屏模式 false:居中模式
    themeMode: false,

    // 主题模式为居中模式下，body 的背景图片
    themeBagImg: 'bag003',

    // 主题颜色
    themeColor: '',

    // 消息提示音
    notifyCueTone: true,

    // 键盘输入事件消息推送开关
    keyboardEventNotify: true
  },
  mutations: {

    // 设置主题模式
    SET_THEME_MODE(state, mode) {
      state.themeMode = mode;
    },

    // 设置主题的背景图片
    SET_THEME_BAGIMG(state, bagName) {
      state.themeBagImg = bagName;
    },

    // 主题颜色
    SET_THEME_COLOR(state, color) {
      state.themeColor = color;
    },

    // 设置消息提示音状态
    SET_NOTIFY_CUE_TONE(state, isTrue) {
      state.notifyCueTone = isTrue;
    },

    // 设置键盘输入事件消息推送状态
    SET_KEYBOARD_EVENT_NOTIFY(state, isTrue) {
      state.keyboardEventNotify = isTrue;
    }
  }
}

export default Settings;
