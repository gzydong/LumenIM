import Cookies from 'js-cookie'

const TokenKey = 'authorize'
const sid = 'SIDBHJBDAHJBjDSBA';

export default {
  getToken(){
    return Cookies.get(TokenKey)
  },

  setToken(token){
    return Cookies.set(TokenKey, token)
  },
  removeToken(){
    return Cookies.remove(TokenKey)
  },
  checkLogin(){
    return this.getToken() ? true:false;
  },
  getSid(){
    return Cookies.get(sid)
  },
  setSid(str){
    return Cookies.set(sid, str)
  }
}