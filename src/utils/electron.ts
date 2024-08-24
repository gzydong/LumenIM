// 判断是否是客户端模式
export function isElectronMode(): boolean {
  return electron() != undefined
}

export function electron(): any {
  return window.$electron
}
