import {
  setToken,
  setUserInfo,
  getUserInfo,
  removeAll,
  getToken
} from '@/utils/auth';

import {
  logoutServ
} from '@/api/user';

const authToken = getToken();
const {
  uid,
  avatar,
  nickname
} = authToken ? getUserInfo() : {};

const user = {
  state: {
    uid: uid || 0,
    avatar: avatar || '/static/image/detault-avatar.jpg',
    nickname: nickname || '',

    loginStatus: authToken ? true : false,

    //头像加载失败后的默认头像
    detaultAvatar: "this.src='/static/image/detault-avatar.jpg'",
  },

  mutations: {
    setAvatar(state, avatar) {
      state.avatar = avatar;
    },
    setUserName(state, username) {
      state.nickname = username;
    },
    logout(state) {
      state.uid = 0;
      state.avatar = '';
      state.nickname = '';
      state.loginStatus = false;
    },
    login(state, user) {
      state.uid = user.uid;
      state.avatar = user.avatar;
      state.nickname = user.nickname;
      state.loginStatus = true;
    },
  },
  actions: {
    //设置头像信息
    setAvatar({
      commit,
      state
    }, avatar) {
      let userInfo = getUserInfo();
      userInfo.avatar = avatar;
      setUserInfo(userInfo);
      commit('setAvatar', avatar);
    },

    //用户登录处理
    login({
      commit,
      state
    }, user) {
      setToken(user.authInfo.access_token, user.authInfo.expires_in);

      setUserInfo(user.userInfo);
      commit('login', user.userInfo);
    },

    //退出登录处理操作
    logout({
      commit,
      state
    }, $router) {
      logoutServ().then((res) => {
        removeAll();
        location.reload();
      }).catch(res => {
        removeAll();
        location.reload();
      });
    },
  }
}

export default user;
