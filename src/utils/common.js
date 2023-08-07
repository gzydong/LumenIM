import { createApp, h } from 'vue'

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
  navigator.clipboard
    .writeText(text)
    .then(() => {
      callback && callback()
    })
    .catch(() => {
      alert('Oops, unable to copy')
    })
}

export async function clipboardImage(src, callback) {
  const { state } = await navigator.permissions.query({
    name: 'clipboard-write',
  })

  if (state != 'granted') return

  let image = new Image()
  image.src = src
  image.onload = () => {
    let canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    let context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)

    canvas.toBlob(async blob => {
      try {
        let item = new ClipboardItem({
          [blob.type]: blob,
        })

        await navigator.clipboard.write([item])

        callback()
      } catch (err) {
        console.error('图片复制失败: ', err)
      }
    }, 'image/png')
  }
}

export function hashStrToHexColor(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += value.toString(16).padStart(2, '0')
  }
  return color
}

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
      mountNode.remove()
      app.unmount(mountNode)
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

export function htmlDecode(input) {
  // 匹配 HTML 实体的正则表达式
  var htmlEntities = /&(?:[a-z]+|#\d+);/gi
  // 匹配已知 HTML 实体的映射
  var htmlEntityMap = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&#39;': "'",
    '&quot;': '"',
    '&nbsp;': ' ',
    '&copy;': '\u00A9', // 版权符号
    '&reg;': '\u00AE', // 注册商标符号
    // ... 添加其他实体的映射
  }
  // 使用正则表达式和映射替换输入中的实体
  return input.replace(htmlEntities, function (match) {
    return htmlEntityMap[match] || match
  })
}

// 文件转 图片 关键函数  异步
export function getVideoImage(file) {
  return new Promise((resolve, reject) => {
    let video = document.createElement('video')

    video.src = URL.createObjectURL(file)

    video.addEventListener('loadeddata', function () {
      this.currentTime = 1
    })

    video.addEventListener('seeked', function () {
      this.width = this.videoWidth
      this.height = this.videoHeight
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      canvas.width = this.width
      canvas.height = this.height
      ctx?.drawImage(this, 0, 0, canvas.width, canvas.height)

      let image = {
        url: canvas.toDataURL('image/jpeg', 1),
        width: this.width,
        height: this.height,
        duration: this.duration,
      }

      canvas.toBlob(function (blob) {
        image.file = new File([blob], 'video_image.jpeg', {
          type: blob.type,
          lastModified: Date.now(),
        })

        resolve(image)
      }, 'image/jpeg')
    })
  })
}
