export default {
  state: {
    // 好友申请未读数
    applyNum: 0,

    // 好友键盘事件监听
    inputEvent: 0,
  },
  mutations: {
    // 好友申请事件监听
    INCR_APPLY_NUM(state) {
      state.applyNum++
    },

    // 好友申请事件监听
    SET_APPLY_NUM(state, value) {
      state.applyNum = value
    },

    // 自增好友键盘输入事件
    UPDATE_KEYBOARD_EVENT(state) {
      state.inputEvent++
    },
  },
}
