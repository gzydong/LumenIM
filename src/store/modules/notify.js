const notify = {
  state: {
    //聊天消息未读数
    unreadNum: 0,

    //好友申请未读数
    applyNum: 0,

    //好友键盘事件监听
    inputEvent: 0,

    //好友登录状态监听
    friendStatus: '',

    //用户入群通知
    enterGroup: 0,
  },
  mutations: {
    //消息未读数自增
    incrUnreadNum(state) {
      state.unreadNum++;
    },
    //设置消息未读数
    setUnreadNum(state, num) {
      state.unreadNum = num;
    },
    //自增好友键盘输入事件
    incrInputEvent(state) {
      state.inputEvent++;
    },
    //监听好友登录状态
    monitorFriendStatus(state, value) {
      state.friendStatus = value;
    },
    //用户入群通知
    incrEnterGroup(state, value = null) {
      if (value === null) {
        state.enterGroup++;
      } else {
        state.enterGroup = value;
      }
    },
    //好友申请事件监听
    incrApplyNum(state) {
      state.applyNum++;
    },
  },
  actions: {
    updateFriendStatus({
      commit
    }, value) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('monitorFriendStatus', value);
          resolve();
        }, 0);
      })
    },
  }
}

export default notify;
