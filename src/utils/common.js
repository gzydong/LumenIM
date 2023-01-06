import { createApp } from 'vue'

/**
 * 防抖函数
 *
 * @param {*} fn 回调方法
 * @param {*} delay 延迟时间
 * @returns
 */
export function debounce(fn, delay) {
  let timer = null

  return function () {
    timer && clearTimeout(timer)

    let content = this
    let args = arguments
    timer = setTimeout(() => {
      fn.apply(content, args)
    }, delay)
  }
}

/**
 * 节流函数
 *
 * @param {*} fn 回调方法
 * @param {*} delay 延迟时间
 * @returns
 */
export function throttle(fn, delay, call = function () {}) {
  let lastTime = 0

  return function () {
    // 获取当前时间戳
    let now = new Date().getTime()

    // 如果当前时间减去上次时间大于限制时间时才执行
    if (now - lastTime > delay) {
      lastTime = now
      fn.apply(this, arguments)
    } else {
      call()
    }
  }
}

/**
 * 剪贴板复制功能
 *
 * @param {String} text 复制内容
 * @param {Function} callback 复制成功回调方法
 */
export function clipboard(text, callback) {
  let textArea = document.createElement('textarea')
  textArea.style.background = 'transparent'
  textArea.value = text

  document.body.appendChild(textArea)

  textArea.select()

  try {
    document.execCommand('copy')
    if (callback) callback()
  } catch (err) {
    alert('Oops, unable to copy')
  }

  document.body.removeChild(textArea)
}

/**
 * 自定义 emit 回调数据
 *
 * @param {String} event
 * @param {Any} data
 * @param {Function} fn
 * @returns
 */
export function emitCall(event, data, fn) {
  return { event: event, data: data, callBack: fn || function () {} }
}

export function modal(Constructor, props = {}) {
  // 创建一个节点，并将组件挂载上去
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)

  const app = createApp(Constructor, {
    ...props,
    remove() {
      app.unmount(mountNode)
      document.body.removeChild(mountNode)
    },
  })

  return app.mount(mountNode, true)
}

// 判断是否是客户端模式
export function isElectronMode() {
  return electron() != undefined
}

export function electron() {
  return window.electron
}
