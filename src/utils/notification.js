/**
 * 申请获取浏览器权限
 *
 * @param {*} fn
 * @returns
 */
export function applyNotificationAuth(fn) {
  if (!('Notification' in window)) {
    console.info('此浏览器不支持桌面通知')
    return fn(false)
  } else if (Notification.permission === 'granted') {
    return fn(true)
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      return fn(permission === 'granted')
    })
  }
}

/**
 * 显示浏览器通知
 * @param {*} title
 * @param {*} options
 */
export function WebNotify(title = '', options = {}) {
  const notification = new Notification(title, options)

  notification.onclick = function (event) {
    notification.close()
    console.log(event)
  }
}
