<script setup>
import '@icon-park/vue-next/styles/index.css'
import { watchEffect, provide } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore, useNotifyStore, useTalkStore } from '@/store'
import socket from '@/socket'
import { listener } from './listener'
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

listener()

watchEffect(() => {
  if (notifyStore.isLeaveWeb) {
    return
  }

  const pathname = router.currentRoute.value.path

  let paths = ['/auth/login', '/auth/register', '/auth/forget']
  if (!paths.includes(pathname) && isLoggedIn()) {
    !socket.isConnect() && socket.connect()
  }
})

if (isElectronMode()) {
  watchEffect(() => electron.setBadge(useTalk.talkUnreadNum))
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
