import { watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifyStore, useTalkStore } from '@/store'
import { applyNotificationAuth } from '@/utils/notification'
import { isElectronMode, electron } from '@/utils/common'
import { isLoggedIn } from '@/utils/auth'
import socket from '@/socket'

function registerOnceExpireNotice() {
  let once = false
  let paths = ['/auth/login', '/auth/register', '/auth/forget']

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      return
    }

    if (isLoggedIn() || once) {
      return
    }

    const pathname = useRouter().currentRoute.value.path
    if (paths.includes(pathname)) {
      return
    }

    once = true

    window['$dialog'].info({
      title: '友情提示',
      content: '当前登录已失效，请重新登录？',
      positiveText: '立即登录?',
      maskClosable: false,
      onPositiveClick: () => {
        once = false
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

      if (isElectronMode() && el.getAttribute('alt') === 'link') {
        return electron().openLink(href)
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

function registerUnreadListener() {
  const useTalk = useTalkStore()
  const el = document.getElementsByTagName('title')[0]
  const title = el.innerText

  watchEffect(() => {
    if (isElectronMode()) {
      electron().setBadge(useTalk.talkUnreadNum)
    } else {
      setInterval(() => {
        if (useTalk.talkUnreadNum > 0) {
          el.innerText = el.innerText == title ? '您有新的消息未读' : title
        } else {
          el.innerText = title
        }
      }, 1000)
    }
  })
}

function registerConnectListener() {
  const notifyStore = useNotifyStore()
  const router = useRouter()

  watchEffect(() => {
    if (notifyStore.isLeaveWeb) {
      return
    }

    const pathname = router.currentRoute.value.path

    const paths = ['/auth/login', '/auth/register', '/auth/forget']

    if (!paths.includes(pathname) && isLoggedIn()) {
      !socket.isConnect() && socket.connect()
    }
  })
}

export function listener() {
  registerNotificationAuth()
  // registerVisitorNotice()
  registerOnceExpireNotice()
  registerLeaveWebListener()
  registerClickListener()
  registerUnreadListener()
  registerConnectListener()
}
