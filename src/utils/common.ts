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

export function emitCall(
  event: string,
  data: any,
  fn: Function = function () {}
): { event: string; data: any; callBack: Function } {
  return { event: event, data: data, callBack: fn }
}

export function htmlDecode(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#34;/g, '"')
}
