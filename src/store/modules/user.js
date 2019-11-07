import auth from '@/utils/auth'

let userInfo = auth.getUserInfo();

const user = {
  state: {
    token: '',
    uid:userInfo.uid,
    avatar: userInfo.avatar,//用户头像
    nickname:userInfo.nickname
  },

  mutations: {
    setAvatar(state,avatar){
      state.avatar = avatar
    },
    setUserName(state,username){
      state.nickname = username
    },
    setUserID(state,uid){
      state.uid = uid
    },
  },
  actions: {
    //设置头像信息
    setAvatar({ commit,state }, avatar) {
      userInfo.avatar = avatar;
      auth.setUserInfo(userInfo);
      commit('setAvatar', avatar)
    },

    //用户登录处理
    login({ commit,state }){
      let userData = auth.getUserInfo();
      commit('setAvatar', userData.avatar);
      commit('setUserName', userData.nickname);
      commit('setUserID', userData.uid);
    },

    //退出登录处理操作
    logout({ commit,state },userData){
      commit('setAvatar', '');
      commit('setUserName', '');
      commit('setUserID', 0);
    },
  }
}

export default user
