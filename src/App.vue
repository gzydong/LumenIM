<script lang="ts" setup>
import '@icon-park/vue-next/styles/index.css'
import { IconProvider, DEFAULT_ICON_CONFIGS } from '@icon-park/vue-next'
import {
  NNotificationProvider,
  NMessageProvider,
  NDialogProvider,
  NConfigProvider,
  zhCN,
  dateZhCN,
  NLayoutContent
} from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import { useUserStore, useTalkStore } from '@/store'
import ws from '@/connect'
import { bus } from '@/utils/event-bus'
import { isLoggedIn } from '@/utils/auth'
import { NotificationApi, MessageApi, DialogApi } from '@/components/common'
import UserCardModal from '@/components/user/UserCardModal.vue'
import { ContactConst } from '@/constant/event-bus'
import {
  useProvideUserModal,
  useThemeMode,
  useVisibilityChange,
  useAccessPrompt,
  useUnreadMessage,
  useConnectStatus,
  useClickEvent
} from '@/hooks'

IconProvider({
  ...DEFAULT_ICON_CONFIGS,
  theme: 'outline',
  size: 24,
  strokeWidth: 3,
  strokeLinejoin: 'bevel'
})

const { uid: showUserId, isShow: isShowUser } = useProvideUserModal()
const { getDarkTheme, getThemeOverride } = useThemeMode()

const userStore = useUserStore()
const talkStore = useTalkStore()

const onChangeRemark = (value: string) => {
  bus.emit(ContactConst.UpdateRemark, value)
  talkStore.setRemark(value)
}

const init = () => {
  if (!isLoggedIn()) return

  ws.connect()
  userStore.loadSetting()
}

init()
useVisibilityChange()
useAccessPrompt()
useUnreadMessage()
useConnectStatus()
useClickEvent()
</script>

<template>
  <!--接收信息提示音-->
  <audio id="audio" preload="preload" muted>
    <source src="@/assets/music.mp3" type="audio/mp3" />
  </audio>

  <!-- 调整 naive-ui 的字重配置 -->
  <n-config-provider
    :theme="getDarkTheme"
    :theme-overrides="getThemeOverride"
    :locale="zhCN"
    :date-locale="dateZhCN"
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

    <n-layout-content>
      <router-view />

      <UserCardModal
        v-model:show="isShowUser"
        v-model:uid="showUserId"
        @update-remark="onChangeRemark"
      />
    </n-layout-content>
  </n-config-provider>
</template>
