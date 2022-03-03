import JsBase64 from 'js-base64'

const USER_TOKEN = 'LUMNEIM-TOKEN'
const USER_INFO = 'LUMNEIM-USERINFO'
const USER_SETTING = 'LUMENIM_SETTING'

/**
 * 设置用户授权token
 *
 * @param {String} token
 * @param {Number} expires
 */
export function setToken(token, expires) {
  expires = new Date().getTime() + expires * 1000 - 100 * 1000

  return localStorage.setItem(
    USER_TOKEN,
    JSON.stringify({
      token,
      expires,
    })
  )
}

/**
 * 获取授权token
 */
export function getToken() {
  const result = JSON.parse(
    localStorage.getItem(USER_TOKEN) ||
      JSON.stringify({
        token: '',
        expires: 0,
      })
  )

  let t = new Date().getTime()

  if (result.expires <= t) {
    localStorage.removeItem(USER_TOKEN)
    return ''
  }

  return result.token
}

/**
 * 设置用户信息
 *
 * @param {Object} data
 */
export function setUserInfo(data) {
  localStorage.setItem(USER_INFO, JsBase64.Base64.encode(JSON.stringify(data)))
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  const data = JsBase64.Base64.decode(localStorage.getItem(USER_INFO) || '')
  return data ? JSON.parse(data) : {}
}

/**
 * 获取用户本地缓存的设置信息
 */
export function getUserSettingCache() {
  const data = localStorage.getItem(USER_SETTING)
  return data ? JSON.parse(data) : {}
}

/**
 * 用户设置保存到浏览器缓存中
 *
 * @param {Object} state 用户设置相关信息
 */
export function setUserSettingCache(state) {
  localStorage.setItem(USER_SETTING, JSON.stringify(state))
}

/**
 * 删除用户相关缓存信息
 */
export function removeAll() {
  localStorage.removeItem(USER_TOKEN)
  localStorage.removeItem(USER_INFO)
  localStorage.removeItem(USER_SETTING)
}
