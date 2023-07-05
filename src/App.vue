<script setup>
import '@icon-park/vue-next/styles/index.css'
import { IconProvider, DEFAULT_ICON_CONFIGS } from '@icon-park/vue-next'
import {
  NNotificationProvider,
  NMessageProvider,
  NDialogProvider,
  zhCN,
  dateZhCN,
  darkTheme
} from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import { useUserStore } from '@/store'
import socket from '@/socket'
import { listener } from '@/listener'
import { overrides } from '@/constant/theme'
import { isLoggedIn } from '@/utils/auth'
import { NotificationApi, MessageApi, DialogApi } from '@/components/common'

IconProvider({
  ...DEFAULT_ICON_CONFIGS,
  theme: 'outline',
  size: 24,
  strokeWidth: 3,
  strokeLinejoin: 'bevel',
})

const userStore = useUserStore()

if (isLoggedIn()) {
  socket.connect()
  userStore.loadSetting()
}

listener()
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
    :hljs="hljs"
    :theme="darkTheme"
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
