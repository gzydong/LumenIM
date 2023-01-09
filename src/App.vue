<script setup>
import { watchEffect } from 'vue'
import { useUserStore } from '@/store/user'
import { useNotifyStore } from '@/store/notify'
import { useTalkStore } from '@/store/talk'
import socket from '@/socket'
import { overrides } from '@/constant/theme'
import {
  NNotificationProvider,
  NMessageProvider,
  NDialogProvider,
  zhCN,
  dateZhCN,
} from 'naive-ui'
import NotificationApi from '@/components/common/NotificationApi.vue'
import MessageApi from '@/components/common/MessageApi.vue'
import DialogApi from '@/components/common/DialogApi.vue'
import { isLoggedIn } from '@/utils/auth'
import { applyNotificationAuth } from '@/utils/notification'

const notifyStore = useNotifyStore()
const userStore = useUserStore()
const useTalk = useTalkStore()

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

let ss = '在吗@朋友 你在干嘛 @wjenkj 哈哈哈'

console.log(
  ss.replace(new RegExp(/@\S+/,'g'), ($0, $1) => {
    return `<a>${$0}</a>`
  })
)

// 监听用户是否离开页面
document.addEventListener('visibilitychange', () => {
  // 设置用户是否离开页面  visible,hidden
  notifyStore.isLeaveWeb = document.visibilityState === 'hidden'

  // 用户回到页面时判断哪连接是否正常，不正常则重连
  if (!notifyStore.isLeaveWeb) {
    console.info('已回到页面...')

    let paths = ['/auth/login', '/auth/register', '/auth/forget']
    if (!paths.includes(window.location.pathname)) {
      !socket.isConnect() && socket.connect()
    }
  }
})

if (window.electron) {
  watchEffect(() => {
    window.electron.setBadge(useTalk.talkUnreadNum)
  })
}
</script>

<template>
  <!--接收信息提示音-->
  <audio id="audio" preload muted>
    <source src="@/assets/music.mp3" type="audio/mp3" />
  </audio>

  <!-- 调整 naive-ui 的字重配置 -->
  <n-config-provider
    :theme-overrides="overrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
    inline-theme-disabled
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
