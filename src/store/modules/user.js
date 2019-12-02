import auth from '@/utils/auth'
import {logoutApi} from '@/services/api'

const user = {
  state: {
    sid:0,
    uid:0,
    avatar:'/static/image/detault-avatar.jpg',//用户头像
    nickname:'' ,

    //头像加载失败后的默认头像
    detaultAvatar: "this.src='/static/image/detault-avatar.jpg'", //用户默认头像
    detaultGroupAvatar: "this.src='/static/image/detault-group-avatar.jpg'", //群默认头像
  },

  mutations: {
    setAvatar(state,avatar){
      state.avatar = avatar
    },
    setUserName(state,username){
      state.nickname = username
    },
    logout(state){
      state.sid = 0;
      state.uid = 0;
      state.avatar = '';
      state.nickname = '';
    },

    login(state,user){
      state.sid = user.sid;
      state.uid = user.uid;
      state.avatar = user.avatar;
      state.nickname = user.nickname;
    },
  },
  actions: {
    //设置头像信息
    setAvatar({ commit,state }, avatar) {
      let userInfo = auth.getUserInfo();
      userInfo.avatar = avatar;
      auth.setUserInfo(userInfo);
      commit('setAvatar', avatar)
    },

    //用户登录处理
    login({ commit,state },user){
      auth.setToken(user.authInfo);
      auth.setUserInfo(user.userInfo);
      commit('login', user.userInfo);
    },

    //退出登录处理操作
    logout({ commit,state },$router){
      logoutApi().then((res) =>{
        auth.remove();
        location.reload();
      }).catch(res =>{
        auth.remove();
        location.reload();
      })
    },
    //同步登录用户信息
    syncUserInfo({ commit,state }){
       let userInfo = auth.getUserInfo();
       if(userInfo){
         commit('login', userInfo);
       }
    }
  }
}

export default user
