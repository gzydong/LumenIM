const notify = {
  state: {
    //聊天消息未读数
    unreadNum: 0,

    //好友申请未读数
    applyNum: 0,

    //好友键盘事件监听
    inputEvent: 0,

    //好友登录状态监听
    friendStatus: {
      status: 0, // 登录状态 0:下线 1:在线
      friendId: 0 // 好友ID
    },
  },
  mutations: {
    //消息未读数自增
    INCR_UNREAD_NUM(state) {
      state.unreadNum++;
    },

    //好友申请事件监听
    INCR_APPLY_NUM(state) {
      state.applyNum++;
    },

    //设置消息未读数
    SET_UNREAD_NUM(state, num) {
      state.unreadNum = num;
    },

    //自增好友键盘输入事件
    UPDATE_KEYBOARD_EVENT(state) {
      state.inputEvent++;
    },
    
    //更新好友登录状态
    UPDATE_FRIEND_STATUS(state, value) {
      state.friendStatus = value;
    },
  },
  actions: {
    ACT_UPDATE_FRIEND_STATUS({
      commit
    }, value) {
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('UPDATE_FRIEND_STATUS', value);
          resolve();
        }, 0);
      })
    },
  }
}

export default notify;