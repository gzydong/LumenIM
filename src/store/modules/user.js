import {
  setUserInfo,
  getUserInfo,
  removeAll,
  getToken
} from '@/utils/auth';

import {
  ServeLogout
} from '@/api/user';

let state = {
  // 用户ID
  uid: 0,
  // 用户昵称
  nickname: '',
  // 性别
  sex: 0,
  // 个性签名
  signature: '',
  // 个性头像
  avatar: require("@/assets/image/detault-avatar.jpg"),
  // 名片背景
  visitCardBag: require("@/assets/image/default-user-banner.png"),
  // 当前登录状态
  loginStatus: false,
};

// 判断用户是否登录
if (getToken()) {
  let userInfo = getUserInfo();
  state.uid = userInfo.uid;
  state.nickname = userInfo.nickname;
  state.signature = userInfo.signature;
  state.avatar = userInfo.avatar ? userInfo.avatar : state.avatar;
  state.loginStatus = true;
}

const user = {
  state,
  mutations: {
    // 用户退出登录
    USER_LOGOUT(state) {
      state.uid = 0;
      state.avatar = '';
      state.nickname = '';
      state.loginStatus = false;
    },

    // 设置用户登录状态
    UPDATE_LOGIN_STATUS(state) {
      state.loginStatus = true;
    },

    // 更新用户信息
    UPDATE_USER_INFO(state, data) {
      for (const key in data) {
        if (!state.hasOwnProperty(key)) continue;

        state[key] = data[key];
      }

      // 保存用户信息到缓存
      setUserInfo({
        uid: state.uid,
        nickname: state.nickname,
        signature: state.signature,
        avatar: state.avatar
      });
    }
  },
  actions: {
    // 退出登录处理操作
    ACT_USER_LOGOUT({
      commit
    }) {
      commit('USER_LOGOUT');
      ServeLogout().finally(() => {
        removeAll();
        location.href = '/login'
      });
    }
  }
}

export default user;