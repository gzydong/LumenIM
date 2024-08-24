import { storage } from './'

const AccessToken = 'AUTH_TOKEN'

/**
 * 验证是否登录
 *
 * @returns boolean
 */
export function isLogin(): boolean {
  return getToken() != ''
}

/**
 * 获取登录授权 Token
 *
 * @returns token
 */
export function getToken(): string {
  return storage.get(AccessToken) || ''
}

/**
 * 设置登录授权 Token
 *
 * @returns token
 */
export function setToken(token: string, expire: number) {
  storage.set(AccessToken, token, expire)
}

/**
 * 删除登录授权 Token
 */
export function deleteToken() {
  storage.remove(AccessToken)
}
