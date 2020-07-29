const talkItems = {
  state: {
    //用户对话列表
    items: [],

    //对话列表重载状态
    heavyLoad: false,
  },
  mutations: {
    //设置对话列表
    setItems(state, payload) {
      state.items = payload.items;
    },

    //更新对话信息
    updateItem(state, payload) {
      if (state.items[payload.key]) {
        state.items[payload.key] = Object.assign(state.items[payload.key], payload.item)
      }
    },

    //移除聊天对话
    removeItem(state, index_name) {
      for (let i in state.items) {
        if (state.items[i].index_name === index_name) {
          state.items.splice(i, 1);
          break;
        }
      }
    },

    //清空消息未读数据
    clearUnreadNum(state, index) {
      state.items[index].unread_num = 0;
    },

    //更新未读信息
    updateUnreadInfo(state, payload) {
      if (!state.items[payload.key]) return false;

      state.items[payload.key].msg_text = payload.item.msg_text.replace(/<\/?.+?>/g,"") || '[表情]';
      state.items[payload.key].unread_num++;
      state.items[payload.key].updated_at = payload.item.updated_at;
    },

    //更新用户在线状态
    updateOnlineStatus(state, data) {
      if (!state.items[data.key]) return false;

      state.items[data.key].online = parseInt(data.status);
    },

    //设置对话列表重载状态
    setHeavyLoad(state, status = false) {
      state.heavyLoad = status;
    }
  },
  actions: {

  }
}

export default talkItems;
