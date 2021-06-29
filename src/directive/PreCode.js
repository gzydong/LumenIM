import { copyTextToClipboard as Clipboard } from '@/utils/functions'

const copyFunc = (pre, text) => {
  let el = document.createElement('p')
  el.className = 'fz-btn'
  el.innerText = '复制'
  el.onclick = () => {
    Clipboard(text.replace(/(^\s*)|(\s*$)/g, ''), function() {
      el.innerText = '复制成功!'
      setTimeout(() => {
        el.innerText = '复制'
      }, 1000)
    })
  }

  pre.appendChild(el)
}

const preNmae = (pre, lang) => {
  let el = document.createElement('p')
  el.className = 'lang-name'
  el.innerText = lang
  pre.appendChild(el)
}

function updateNodes(el, binding, vnode) {
  let preNodes = el.querySelectorAll('pre')
  preNodes.forEach(elPre => {
    let elCode = elPre.querySelector('code')
    let className = elCode.className
    let language = className.split('-')[1]

    copyFunc(elPre, elCode.innerText)

    if (language != undefined) {
      preNmae(elPre, language)
    }
  })
}

/**
 * 代码格式化
 */
export default {
  bind: updateNodes,
  update: updateNodes,
}
