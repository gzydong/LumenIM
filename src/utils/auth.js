import Cookies from 'js-cookie'

const authorize = 'LOGIN_AUTHORIAE'
const sid       = 'SID_WEBSOCKET';
const userInfo  = 'LOGIN_USER_INFO';

export default {
  checkLogin(){
    return this.getToken() ? true:false;
  },

  setToken(data){
    let time = parseInt(new Date().getTime() / 1000);
    data.expires_in = time + data.expires_in - 60*10;
    return Cookies.set(authorize, JSON.stringify(data));
  },
  getToken(){
    let auth =  Cookies.get(authorize);

    if(auth === undefined){return '';}

    auth = JSON.parse(auth);
    return auth.access_token;
  },

  setSid(str){
    return Cookies.set(sid, str)
  },
  getSid(){
    return Cookies.get(sid)
  },

  setUserInfo(data){
    return Cookies.set(userInfo,JSON.stringify(data))
  },
  getUserInfo(){
    let str =  Cookies.get(userInfo);
    return str === undefined ? {} : JSON.parse(str);
  },

  removeUserInfo(){
    Cookies.remove(sid);
    Cookies.remove(authorize)
    Cookies.remove(userInfo);
  }
}
