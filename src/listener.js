import { isLoggedIn } from '@/utils/auth'
import { useNotifyStore } from '@/store'
import { applyNotificationAuth } from '@/utils/notification'
import { isElectronMode } from '@/utils/common'
import { useRouter } from 'vue-router'

function registerOnceExpireNotice() {
  let onceExpireNotice = false
  let paths = ['/auth/login', '/auth/register', '/auth/forget']

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      return
    }

    if (isLoggedIn() || onceExpireNotice) {
      return
    }

    const pathname = useRouter().currentRoute.value.path
    if (paths.includes(pathname)) {
      return
    }

    onceExpireNotice = true

    window['$dialog'].info({
      title: '友情提示',
      content: '当前登录已失效，请重新登录？',
      positiveText: '立即登录?',
      maskClosable: false,
      onPositiveClick: () => {
        onceExpireNotice = false
        useRouter().push('/auth/login')
      },
    })
  })
}

function registerVisitorNotice() {
  // 3秒后获取用户浏览器权限
  setTimeout(() => {
    window['$notification'].create({
      title: '友情提示',
      content:
        '此站点仅供演示、学习所用，请勿进行非法操作、上传或发布违法资讯。',
      duration: 30000,
    })
  }, 3000)
}

function registerLeaveWebListener() {
  document.addEventListener('visibilitychange', () => {
    useNotifyStore().isLeaveWeb = document.visibilityState === 'hidden'
  })
}

function registerNotificationAuth() {
  applyNotificationAuth(value => {
    useNotifyStore().isWebNotify = value
  })
}

function registerClickListener() {
  const push = el => {
    const href = el.getAttribute('href')

    if (href) {
      if (isElectronMode() || el.getAttribute('alt') === 'link') {
        return window.open(href)
      }

      window.location.href = href
    }
  }

  document.body.addEventListener('click', event => {
    let target = event.target

    if (target.nodeName.toLocaleLowerCase() === 'a') {
      // 判断是否匹配目标元素
      if (event.preventDefault) {
        // 对捕获到的 a 标签进行处理
        event.preventDefault()
      } else {
        window.event.returnValue = false
      }

      // 处理完 a 标签的内容，重新触发跳转，根据原来 a 标签页 target 来判断是否需要新窗口打开
      push(target)
    }
  })
}

export function listener() {
  registerNotificationAuth()
  registerVisitorNotice()
  registerOnceExpireNotice()
  registerLeaveWebListener()
  registerClickListener()
}
