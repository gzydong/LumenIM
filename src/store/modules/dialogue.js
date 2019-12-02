import {
  friendApplyNumApi
} from '@/services/api';

const dialogue = {
  state: {
    activeModule: 0,

    // 聊天模块
    chatModule: {
      idx: null, //当前正在聊天的列表
      minRecordId: 0, //这里用户拉取以前的聊天记录 null 为已加载全部
      cahtRecords: [],
      loadStatus: 0, //历史消息加载状态 0:未加载|已加载完成  1:正在加载..
      scrollHeight: 0, //加载历史记录前滚动条的高度

      chatList: [], //用户聊天记录列表
    },

    //弹出窗口管理器
    subgroup: {
      pwdIsOpen: false,
      userSetupIsOpen: false,
      seekFriendIsOpen: false,
    },

    //好友申请未读数
    applyUnreadNum: 0,
  },

  mutations: {
    //修改当前选中栏目
    updateNavModule(state, value = 0) {
      state.activeModule = value
    },

    //更新用户申请列表状态管理器
    updateApply(state, data) {
      state.friendsApplyModule.friendsApplyList = data;
    },

    //更新好友聊天列表管理器
    updateChatList(state, data) {
      if (data.type == 1) {
        state.chatModule.chatList = data.list;
      } else if (data.type == 2) {
        let message = data.message;
        state.chatModule.chatList[message.idx].msg_text = message.text;
        state.chatModule.chatList[message.idx].unread_num++;
      } else if (data.type == 3) {
        state.chatModule.chatList[data.idx].unread_num = 0;
      } else if (data.type == 4) {
        state.chatModule.chatList.unshift(data.message);
      }
    },

    showUserSetupBox(state, value) {
      state.subgroup.userSetupIsOpen = value;
    },

    showPasswordBox(state, value) {
      state.subgroup.pwdIsOpen = value;
    },

    // 显示查询好友弹出框
    showSeekFriendBox(state, value) {
      if (value == true || value == false) {
        state.subgroup.seekFriendIsOpen = value;
      } else {
        state.subgroup.seekFriendIsOpen = true;
        sessionStorage.setItem("query_mobile", `${value.text},${value.type}`);
      }
    },

    func(state, data) {
      state.chatModule = Object.assign(state.chatModule, data)
    },

    //设置为处理好友申请数
    setFriendApplyNum(state, value = 0) {
      if (value === 'incr') { //代表自增+1
        state.applyUnreadNum++;
      } else {
        state.applyUnreadNum = value;
      }
    },

    // 追加好友聊天信息
    pushCahtRecords(state, message) {
      state.chatModule.cahtRecords.push(message);
    },
  },
  actions: {
    //同步用户提示信息
    asyncServer({
      commit
    }) {
      //获取用户未处理的好友申请数量
      setTimeout(function() {
        friendApplyNumApi().then((res) => {
          if (res.code == 200) {
            commit('setFriendApplyNum', res.data.unread_num);
          }
        });
      }, 1000);

      //... 可处理其它业务逻辑
    },

    //同步朋友信息
    asyncFriendInfo({
      commit,
      state
    }, info) {

      state.chatModule.chatList = [];

      console.log(state, info)
    }
  }
}

export default dialogue
