import Cookies from 'js-cookie'

const TokenKey = 'loginToken'

export default {
  getToken(){
    return Cookies.get(TokenKey)
  },

  setToken(){
    return Cookies.set(TokenKey, token)
  },
  removeToken(){
    return Cookies.remove(TokenKey)
  },
  checkLogin(){
    return this.getToken() ? true:false;
  }
}