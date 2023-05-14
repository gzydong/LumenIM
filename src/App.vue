<script setup>
import '@icon-park/vue-next/styles/index.css'
import { watchEffect, provide } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore, useNotifyStore, useTalkStore } from '@/store'
import socket from '@/socket'
import hljs from 'highlight.js/lib/core'
import { overrides } from '@/constant/theme'
import {
  NNotificationProvider,
  NMessageProvider,
  NDialogProvider,
  zhCN,
  dateZhCN,
} from 'naive-ui'
import { NotificationApi, MessageApi, DialogApi } from '@/components/common'
import { isLoggedIn } from '@/utils/auth'
import { applyNotificationAuth } from '@/utils/notification'
import { modal, isElectronMode } from '@/utils/common'
import UserCardModal from '@/components/user/UserCardModal.vue'
import { IconProvider, DEFAULT_ICON_CONFIGS } from '@icon-park/vue-next'

IconProvider({
  ...DEFAULT_ICON_CONFIGS,
  theme: 'outline',
  size: 24,
  strokeWidth: 3,
  strokeLinejoin: 'bevel',
})

provide('showUserModal', uid => {
  modal(UserCardModal, { uid })
})

const notifyStore = useNotifyStore()
const userStore = useUserStore()
const useTalk = useTalkStore()
const router = useRouter()

if (isLoggedIn()) {
  socket.connect()
  userStore.loadSetting()
}

applyNotificationAuth(value => {
  notifyStore.isWebNotify = value
})

// 3秒后获取用户浏览器权限
setTimeout(() => {
  window.$notification.create({
    title: '友情提示',
    content: '此站点仅供演示、学习所用，请勿进行非法操作、上传或发布违法资讯。',
    duration: 30000,
  })
}, 3000)

// 监听用户是否离开页面
document.addEventListener('visibilitychange', () => {
  // 设置用户是否离开页面  visible,hidden
  notifyStore.isLeaveWeb = document.visibilityState === 'hidden'

  const pathname = router.currentRoute.value.path

  // 用户回到页面时判断哪连接是否正常，不正常则重连
  if (!notifyStore.isLeaveWeb) {
    console.info('已回到页面...')

    let paths = ['/auth/login', '/auth/register', '/auth/forget']
    if (!paths.includes(pathname) && isLoggedIn()) {
      !socket.isConnect() && socket.connect()
    }

    if (!paths.includes(pathname) && !isLoggedIn()) {
      window['$dialog'].info({
        title: '友情提示',
        content: '当前登录已失效，请重新登录？',
        positiveText: '立即登录?',
        maskClosable: false,
        onPositiveClick: () => {
          router.push('/auth/login')
        },
      })
    }
  }
})

if (isElectronMode()) {
  watchEffect(() => {
    electron.setBadge(useTalk.talkUnreadNum)
  })
}
</script>

<template>
  <!--接收信息提示音-->
  <audio id="audio" preload="preload" muted>
    <source src="@/assets/music.mp3" type="audio/mp3" />
  </audio>

  <!-- 调整 naive-ui 的字重配置 -->
  <n-config-provider
    :theme-overrides="overrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
    inline-theme-disabled
    :hljs="hljs"
  >
    <n-message-provider>
      <message-api />
    </n-message-provider>

    <n-notification-provider>
      <notification-api />
    </n-notification-provider>

    <n-dialog-provider>
      <dialog-api />
    </n-dialog-provider>

    <router-view />
  </n-config-provider>
</template>
