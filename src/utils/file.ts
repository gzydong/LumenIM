import { getToken } from '@/utils/auth'

/**
 * 文件下载方法
 * @param msg_id
 * @param talk_mode
 * @param to_from_id
 */
export function download(msg_id: string, talk_mode: number) {
  const token = getToken()

  try {
    const link = document.createElement('a')
    link.href = `${
      import.meta.env.VITE_BASE_API
    }/api/v1/talk/file-download?msg_id=${msg_id}&talk_mode=${talk_mode}&token=${token}`
    link.click()
  } catch (e) {
    console.warn(e)
  }
}

/**
 * 通过图片url获取图片大小
 *
 * @param {String} uri 例如图片名： D8x5f13a53dbc4b9_350x345.png
 */
export function getImageInfo(uri: string): { width: number; height: number } {
  const regex = /(\d+)x(\d+)\./

  const match = uri.match(regex)
  if (!match) {
    return { width: 0, height: 0 }
  }

  const width = parseInt(match[1], 10)
  const height = parseInt(match[2], 10)

  return { width, height }
}

/**
 * 文件转 图片 关键函数  异步
 * @param file
 * @param time
 * @returns
 */
export async function getVideoImage(
  file: File,
  time: number = 1
): Promise<{ url: string; width: number; height: number; duration: number; file: File }> {
  return new Promise((resolve) => {
    const video = document.createElement('video')

    const objectURL = URL.createObjectURL(file)

    video.src = objectURL
    video.currentTime = time
    video.autoplay = true
    video.muted = true

    video.oncanplay = () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext('2d')
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

      const data: any = {
        url: canvas.toDataURL('image/jpeg', 1),
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration
      }

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(objectURL)

        if (blob == null) return

        data.file = new File([blob], 'image.jpeg', {
          type: blob.type,
          lastModified: Date.now()
        })

        resolve(data)
      }, 'image/jpeg')
    }
  })
}

export function downloadImage(src: string, name: string) {
  const image = new Image()
  image.setAttribute('crossOrigin', 'anonymous')
  image.src = src
  image.onload = function () {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height

    const ctx = canvas.getContext('2d')
    if (ctx == null) return

    ctx.drawImage(image, 0, 0, image.width, image.height)

    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    const event = new MouseEvent('click')

    a.download = name || 'image.png'
    a.href = url
    a.dispatchEvent(event)
  }
}

// 获取文件名后缀
export const getFileNameSuffix = (name: string) => {
  const arr = name.split('.')
  return arr[arr.length - 1]
}

export function getFilenameFromUrl(url: string) {
  const match = url.match(/^.*\/(.*?)$/)
  return match ? match[1] : null
}

export function downloadBlobFile(fileName: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })

  // 创建一个隐藏的可下载链接
  const downloadLink = document.createElement('a')
  downloadLink.href = URL.createObjectURL(blob)
  downloadLink.download = fileName

  // 触发点击事件
  downloadLink.click()

  // 清理URL
  URL.revokeObjectURL(downloadLink.href)
}
