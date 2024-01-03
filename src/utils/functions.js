import { getAccessToken } from '@/utils/auth'

/**
 * 通过图片url获取图片大小
 *
 * @param {String} imgsrc 例如图片名： D8x5f13a53dbc4b9_350x345.png
 */
export function getImageInfo(imgsrc) {
  let data = {
    width: 0,
    height: 0
  }

  let arr = imgsrc.split('_')
  if (arr.length == 1) return data

  let info = arr[arr.length - 1].match(/\d+x\d+/g)
  if (info == null) return data

  info = info[0].split('x')

  return {
    width: parseInt(info[0]),
    height: parseInt(info[1])
  }
}

/**
 * 文件下载方法
 *
 * @param {Number} msgid
 */
export function download(msg_id) {
  let token = getAccessToken()
  try {
    let link = document.createElement('a')
    // link.target = '_blank'
    link.href = `${
      import.meta.env.VITE_BASE_API
    }/api/v1/talk/records/file/download?msg_id=${msg_id}&token=${token}`
    link.click()
  } catch (e) {
    console.warn(e)
  }
}

export function insertText(obj, str) {
  if (document.selection) {
    let sel = document.selection.createRange()
    sel.text = str
  } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
    let startPos = obj.selectionStart,
      endPos = obj.selectionEnd,
      cursorPos = startPos,
      tmpStr = obj.value
    obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length)
    cursorPos += str.length
    obj.selectionStart = obj.selectionEnd = cursorPos

    obj.focus()
  } else {
    obj.value += str
  }
}

export function countDownTime(second = 0) {
  // 小于10 加0 处理
  function formate0to9(arg) {
    return arg < 10 ? `0${arg}` : arg
  }

  const hours = parseInt((second / 60 / 60) % 24, 10) //剩余的小时
  const minutes = parseInt((second / 60) % 60, 10) //剩余的分钟
  const seconds = parseInt(second % 60, 10) //剩余的秒数

  return `${formate0to9(hours)}:${formate0to9(minutes)}:${formate0to9(seconds)}`
}

export function removeTags(str) {
  return str.replace(/<\/?[^>]+>/gi, '')
}

export function downloadImage(src, name) {
  let image = new Image()
  image.setAttribute('crossOrigin', 'anonymous')
  image.onload = function () {
    let canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    let context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    let url = canvas.toDataURL('image/png')
    let a = document.createElement('a')
    let event = new MouseEvent('click')
    a.download = name || 'image.png'
    a.href = url
    a.dispatchEvent(event)
  }
  image.src = src
}

// 获取文件名后缀
export const getFileNameSuffix = (name) => {
  const arr = name.split('.')
  return arr[arr.length - 1]
}
