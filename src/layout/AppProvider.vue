<script lang="ts" setup>
import {
  useAccessPrompt,
  useClickEvent,
  useConnectStatus,
  useThemeMode,
  useUnreadMessage,
  useVisibilityChange
} from '@/hooks'
import { DialogApi, MessageApi, ModalApi, NotificationApi } from '@/layout/common'
import { DEFAULT_ICON_CONFIGS, IconProvider } from '@icon-park/vue-next'
import '@icon-park/vue-next/styles/index.css'
import hljs from 'highlight.js/lib/core'
import { dateZhCN, zhCN } from 'naive-ui'
import { onMounted } from 'vue'

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
  useAccessPrompt()
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
