import { h } from 'vue'
import { NIcon } from 'naive-ui'
import { useThrottleFn, useDebounceFn } from '@vueuse/core'

/**
 * 防抖函数
 *
 * @param {*} func 回调方法
 * @param {*} wait 延迟时间
 * @returns
 */
export const debounce = useDebounceFn

/**
 * 节流函数
 *
 * @param {*} func 回调方法
 * @param {*} wait 延迟时间
 * @returns
 */
export const throttle = useThrottleFn

/**
 * 剪贴板复制功能
 *
 * @param {String} text 复制内容
 * @param {Function} callback 复制成功回调方法
 */
export function clipboard(text: string, callback: Function): void {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      callback && callback()
    })
    .catch(() => {
      alert('Oops, unable to copy')
    })
}

export async function clipboardImage(src: string, callback: Function): Promise<void> {
  try {
    const data = await fetch(src)
    const blob = await data.blob()

    // navigator.clipboard.write 仅支持 png 图片
    if (blob.type == 'image/png') {
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])

      return callback()
    }

    const objectURL = URL.createObjectURL(blob)

    const img = new Image()
    img.src = objectURL
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        async (blob) => {
          URL.revokeObjectURL(objectURL)

          if (!blob) return

          await navigator.clipboard.write([
            new ClipboardItem({
              [blob.type]: blob
            })
          ])

          callback()
        },
        'image/png',
        1
      )
    }
  } catch (err) {
    console.error(err)
  }
}

export function htmlDecode(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#34;/g, '"')
}

export const renderIcon = (icon: any) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}

/**
 * 获取浏览器信息
 * @param userAgent
 * @returns
 */
export function getExploreName(userAgent = '') {
  if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
    return 'Opera'
  } else if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1) {
    return 'IE'
  } else if (userAgent.indexOf('Edge') > -1) {
    return 'Edge'
  } else if (userAgent.indexOf('Firefox') > -1) {
    return 'Firefox'
  } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') == -1) {
    return 'Safari'
  } else if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1) {
    return 'Chrome'
  } else {
    return 'Unkonwn'
  }
}

/**
 * 获取系统信息
 * @param userAgent
 * @returns
 */
export function getExploreOs(userAgent = '') {
  if (userAgent.indexOf('Mac OS') > -1) {
    return 'Mac OS'
  } else {
    return 'Windows'
  }
}
