import auth from '@/utils/auth'
import {logoutApi} from '@/services/api.js'

let userInfo = auth.getUserInfo();

const user = {
  state: {
    uid:userInfo.uid,
    avatar: userInfo.avatar,//用户头像
    nickname:userInfo.nickname,
    
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
      commit('setAvatar', userInfo.avatar);
      commit('setUserName', userInfo.nickname);
      commit('setUserID', userInfo.uid);
    },

    //退出登录处理操作
    logout({ commit,state },$router){
      commit('setAvatar', '');
      commit('setUserName', '');
      commit('setUserID', 0);
      logoutApi().then((res) =>{
        auth.removeUserInfo();
        $router.push({path: '/login'});
      }).catch(res =>{
        auth.removeUserInfo();
        $router.push({path: '/login'});
      })
    }
  }
}

export default user
