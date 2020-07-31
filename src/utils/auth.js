import Cookies from 'js-cookie';
import JsBase64 from 'js-base64';

const TokenKey = 'LUMNEIM-TOKEN';
const UserKey = 'LUMNEIM-USERINFO';

// 设置授权token
export function setToken(token, expires) {
  return Cookies.set(TokenKey, token, {
    expires: new Date(new Date().getTime() + expires * 1000)
  });
}

// 获取授权token
export function getToken() {
  return Cookies.get(TokenKey) || '';
}

// 删除授权token
export function removeToken() {
  return Cookies.remove(TokenKey);
}

// 设置用户信息
export function setUserInfo(data) {
  localStorage.setItem(UserKey, JsBase64.Base64.encode(JSON.stringify(data)));
}

// 获取用户信息
export function getUserInfo() {
  let obj = {};
  try {
    obj = JSON.parse(JsBase64.Base64.decode(localStorage.getItem(UserKey)));
  } catch (e) {}

  return obj;
}

// 获取用户信息
export function removeUserInfo() {
  localStorage.removeItem(UserKey);
}

// 删除授权token和登录信息
export function removeAll() {
  removeToken();
  removeUserInfo();
}
