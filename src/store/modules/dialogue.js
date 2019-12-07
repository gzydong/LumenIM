import {
  friendApplyNumApi
} from '@/services/api';

const dialogue = {
  state: {
    activeModule: 0,

    //弹出窗口管理器
    subgroup: {
      pwdIsOpen: false,
      userSetupIsOpen: false,
      seekFriendIsOpen: false,
    },

    //好友消息未读数
    unreadNum: 0,

    //好友申请未读数
    applyUnreadNum: 0,
  },

  mutations: {

    //更新好友消息未读数
    updateUnreadNum(state, value = 0) {
      state.unreadNum = value
    },


    //修改当前选中栏目
    updateNavModule(state, value = 0) {
      state.activeModule = value
    },

    //更新用户申请列表状态管理器
    updateApply(state, data) {
      state.friendsApplyModule.friendsApplyList = data;
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

    //设置为处理好友申请数
    setFriendApplyNum(state, value = 0) {
      if (value === 'incr') { //代表自增+1
        state.applyUnreadNum++;
      } else {
        state.applyUnreadNum = value;
      }
    }
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

    }
  }
}

export default dialogue
