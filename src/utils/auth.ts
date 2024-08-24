import { storage } from './storage'

const AccessToken = 'AUTH_TOKEN'

/**
 * 验证是否登录
 *
 * @returns token
 */
export function isLoggedIn(): boolean {
  return getAccessToken() != ''
}

/**
 * 获取登录授权 Token
 *
 * @returns token
 */
export function getAccessToken(): string {
  return storage.get(AccessToken) || ''
}

/**
 * 设置登录授权 Token
 *
 * @returns token
 */
export function setAccessToken(token = '', expire = 60 * 60 * 2) {
  storage.set(AccessToken, token, expire)
}

/**
 * 删除登录授权 Token
 */
export function delAccessToken() {
  storage.remove(AccessToken)
}
