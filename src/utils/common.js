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
    name: 'clipboard-write'
  })

  if (state != 'granted') return

  try {
    const data = await fetch(src)
    const blob = await data.blob()

    if (blob.type != 'image/png') {
      return alert('当前图片类型不支持复制')
    }

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ])

    callback()
  } catch (err) {
    console.error(err.name, err.message)
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

// 判断是否是客户端模式
export function isElectronMode() {
  return electron() != undefined
}

export function electron() {
  return window.electron
}

export function htmlDecode(input) {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#34;/g, '"')
}

// 文件转 图片 关键函数  异步
export function getVideoImage(file, time = 1) {
  return new Promise((resolve) => {
    let video = document.createElement('video')

    video.src = URL.createObjectURL(file)
    video.currentTime = time
    video.autoplay = true
    video.muted = true

    video.oncanplay = () => {
      let canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      let ctx = canvas.getContext('2d')
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

      let data = {
        url: canvas.toDataURL('image/jpeg', 1),
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
        file: null
      }

      canvas.toBlob((blob) => {
        data.file = new File([blob], 'image.jpeg', {
          type: blob.type,
          lastModified: Date.now()
        })

        resolve(data)
      }, 'image/jpeg')
    }
  })
}
