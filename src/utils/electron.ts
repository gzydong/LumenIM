/**
 * 判断是否是客户端模式
 * @returns boolean 是否是客户端模式
 */
export function isElectronMode(): boolean {
  return electron() != undefined
}

/**
 * 获取 electron
 * @returns electron
 */
export function electron(): any {
  return window.$electron
}
