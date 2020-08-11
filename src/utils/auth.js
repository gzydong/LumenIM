import Cookies from 'js-cookie';
import JsBase64 from 'js-base64';

const USER_TOKEN_KEY = 'LUMNEIM-TOKEN';
const USER_INFO_KEY = 'LUMNEIM-USERINFO';
const USER_SETTING_KEY = 'LUMENIM_USER_SETTING';

/**
 * 设置用户授权token
 * 
 * @param {string} token 
 * @param {number} expires 
 */
export function setToken(token, expires) {
  return Cookies.set(USER_TOKEN_KEY, token, {
    expires: new Date(new Date().getTime() + expires * 1000)
  });
}

/**
 * 获取授权token
 */
export function getToken() {
  return Cookies.get(USER_TOKEN_KEY) || '';
}

/**
 * 设置用户信息
 * 
 * @param {object} data 
 */
export function setUserInfo(data) {
  localStorage.setItem(USER_INFO_KEY, JsBase64.Base64.encode(JSON.stringify(data)));
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  let obj = {};
  try {
    obj = JSON.parse(JsBase64.Base64.decode(localStorage.getItem(USER_INFO_KEY)));
  } catch (e) {}

  return obj;
}

/**
 * 获取用户本地缓存的设置信息
 */
export function getUserSettingCache() {
  let data = localStorage.getItem(USER_SETTING_KEY);
  return data ? JSON.parse(data) : {};
}

/**
 * 用户设置保存到浏览器缓存中
 * 
 * @param {Object} state 用户设置相关信息 
 */
export function setUserSettingCache(state) {
  localStorage.setItem(USER_SETTING_KEY, JSON.stringify(state));
}

/**
 * 删除用户相关缓存信息
 */
export function removeAll() {
  Cookies.remove(USER_TOKEN_KEY)
  localStorage.removeItem(USER_INFO_KEY);
  localStorage.removeItem(USER_SETTING_KEY);
}