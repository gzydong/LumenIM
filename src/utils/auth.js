const authorize = 'LUMEN_WEB_AUTHORIAE'
const userInfo = 'LUMEN_WEB_USER';
import JsBase64 from 'js-base64'
import {testApi} from '@/services/api'

export default {
  setData(keyName, data) {
    localStorage.setItem(keyName, JsBase64.Base64.encode(JSON.stringify(data)));
  },
  getData(keyName) {
    let obj = {};
    try {
      obj = JSON.parse(JsBase64.Base64.decode(localStorage.getItem(keyName)))
    } catch (e) {}

    return obj;
  },

  setUserInfo(data) {
    this.setData(userInfo, data);
  },
  getUserInfo() {
    return this.getData(userInfo);
  },

  setToken(data) {
    let time = parseInt(new Date().getTime() / 1000);
    data.expires_in = time + data.expires_in - 60 * 10;

    this.setData(authorize, data);
  },

  getToken() {
    let data = this.getData(authorize);
    if (!data) {
      return '';
    }

    let time = parseInt(new Date().getTime() / 1000);
    if (time < data.expires_in) {
      return data.access_token;
    }

    return '';
  },

  //获取token 过期时间
  getTokenExpiresin() {
    let data = this.getData(authorize);
    if (!data) {
      return false;
    }

    let t = data.expires_in - parseInt(new Date().getTime() / 1000);
    return t < 0 ? 0 : t;
  },

  remove() {
    localStorage.removeItem(authorize);
    localStorage.removeItem(userInfo);
  },
}
