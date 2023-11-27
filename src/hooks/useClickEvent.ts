import { isElectronMode, electron } from '@/utils/common'

export const useClickEvent = () => {
  const push = (el: any) => {
    const href = el.getAttribute('href')

    if (href) {
      if (isElectronMode() && el.getAttribute('alt') === 'link') {
        return electron().openLink(href)
      }

      return window.open(href)
    }
  }

  document.body.addEventListener('click', (event: any) => {
    const target = event.target

    if (target.nodeName.toLocaleLowerCase() === 'a') {
      // 判断是否匹配目标元素
      if (event.preventDefault) {
        // 对捕获到的 a 标签进行处理
        event.preventDefault()
      } else {
        window.event.returnValue = false
      }

      console.log('====')
      // 处理完 a 标签的内容，重新触发跳转，根据原来 a 标签页 target 来判断是否需要新窗口打开
      push(target)
    }
  })

  return {}
}
