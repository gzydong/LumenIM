<script lang="ts" setup>
import '@icon-park/vue-next/styles/index.css'
import { onMounted } from 'vue'
import { IconProvider, DEFAULT_ICON_CONFIGS } from '@icon-park/vue-next'
import { zhCN, dateZhCN } from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import { NotificationApi, MessageApi, DialogApi, ModalApi } from '@/layout/common'
import {
  useThemeMode,
  useVisibilityChange,
  useUnreadMessage,
  useConnectStatus,
  useClickEvent,
  useAccessPrompt
} from '@/hooks'

IconProvider({
  ...DEFAULT_ICON_CONFIGS,
  theme: 'outline',
  size: 24,
  strokeWidth: 3,
  strokeLinejoin: 'bevel'
})

const { getDarkTheme, getThemeOverride } = useThemeMode()

onMounted(() => {
  useVisibilityChange()

  if (import.meta.env.ENV == 'production') {
    useAccessPrompt()
  }

  useUnreadMessage()
  useConnectStatus()
  useClickEvent()
})
</script>

<template>
  <n-config-provider
    :theme="getDarkTheme"
    :theme-overrides="getThemeOverride"
    :locale="zhCN"
    :date-locale="dateZhCN"
    :hljs="hljs"
  >
    <n-message-provider :max="3">
      <message-api />
    </n-message-provider>

    <n-notification-provider :max="3">
      <notification-api />
    </n-notification-provider>

    <n-dialog-provider>
      <dialog-api />
    </n-dialog-provider>

    <n-modal-provider>
      <modal-api />
    </n-modal-provider>

    <n-layout-content>
      <slot></slot>
    </n-layout-content>
  </n-config-provider>
</template>
