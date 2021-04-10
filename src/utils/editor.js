/**
 * 遍历对象
 *
 * @param {Object} obj
 * @param {Object} fn
 */
export function objForEach(obj, fn) {
  let key = void 0,
    result = void 0
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      result = fn.call(obj, key, obj[key])
      if (result === false) {
        break
      }
    }
  }
}

/**
 * 遍历类数组
 *
 * @param {Object} fakeArr
 * @param {Object} fn
 */
export function arrForEach(fakeArr, fn) {
  let i = void 0,
    item = void 0,
    result = void 0
  let length = fakeArr.length || 0
  for (i = 0; i < length; i++) {
    item = fakeArr[i]
    result = fn.call(fakeArr, item, i)
    if (result === false) {
      break
    }
  }
}

/**
 * 替换 html 特殊字符
 *
 * @param {Object} html
 */
export function replaceHtmlSymbol(html) {
  if (html == null) {
    return ''
  }
  return html
    .replace(/</gm, '&lt;')
    .replace(/>/gm, '&gt;')
    .replace(/"/gm, '&quot;')
    .replace(/(\r\n|\r|\n)/g, '<br/>')
}

/**
 * 获取粘贴的纯文本
 *
 * @param {Object} e
 */
export function getPasteText(e) {
  let clipboardData =
    e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData)
  let pasteText = void 0
  if (clipboardData == null) {
    pasteText = window.clipboardData && window.clipboardData.getData('text')
  } else {
    pasteText = clipboardData.getData('text/plain')
  }

  return replaceHtmlSymbol(pasteText)
}

/**
 * 获取粘贴的html
 *
 * @param {Object} e
 * @param {Object} filterStyle
 * @param {Object} ignoreImg
 */
export function getPasteHtml(e, filterStyle, ignoreImg) {
  let clipboardData =
    e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData)
  let pasteText = void 0,
    pasteHtml = void 0
  if (clipboardData == null) {
    pasteText = window.clipboardData && window.clipboardData.getData('text')
  } else {
    pasteText = clipboardData.getData('text/plain')
    pasteHtml = clipboardData.getData('text/html')
  }
  if (!pasteHtml && pasteText) {
    pasteHtml = '<p>' + replaceHtmlSymbol(pasteText) + '</p>'
  }
  if (!pasteHtml) {
    return
  }

  // 过滤word中状态过来的无用字符
  let docSplitHtml = pasteHtml.split('</html>')
  if (docSplitHtml.length === 2) {
    pasteHtml = docSplitHtml[0]
  }

  // 过滤无用标签
  pasteHtml = pasteHtml.replace(/<(meta|script|link).+?>/gim, '')
  // 去掉注释
  pasteHtml = pasteHtml.replace(/<!--.*?-->/gm, '')
  // 过滤 data-xxx 属性
  pasteHtml = pasteHtml.replace(/\s?data-.+?=('|").+?('|")/gim, '')

  if (ignoreImg) {
    // 忽略图片
    pasteHtml = pasteHtml.replace(/<img.+?>/gim, '')
  }

  if (filterStyle) {
    // 过滤样式
    pasteHtml = pasteHtml.replace(/\s?(class|style)=('|").*?('|")/gim, '')
  } else {
    // 保留样式
    pasteHtml = pasteHtml.replace(/\s?class=('|").*?('|")/gim, '')
  }

  return pasteHtml
}

/**
 * 获取粘贴的图片文件
 *
 * @param {Object} e
 */
export function getPasteImgs(e) {
  let result = []
  let txt = getPasteText(e)
  if (txt) {
    // 有文字，就忽略图片
    return result
  }

  let clipboardData =
    e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData) || {}
  let items = clipboardData.items
  if (!items) {
    return result
  }

  objForEach(items, function(key, value) {
    let type = value.type
    if (/image/i.test(type)) {
      result.push(value.getAsFile())
    }
  })

  return result
}

/**
 * 获取拖拽的图片
 *
 * @param {Object} e
 */
export function getDragPasteImg(e) {
  let result = []
  let dataTransfer =
    e.dataTransfer || (e.originalEvent && e.originalEvent.dataTransfer) || {}
  let items = dataTransfer.items
  if (!items) {
    return result
  }

  objForEach(items, function(key, value) {
    let type = value.type
    if (/image/i.test(type)) {
      result.push(value.getAsFile())
    }
  })

  return result
}
