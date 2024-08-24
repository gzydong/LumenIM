<script lang="ts" setup>
import '@icon-park/vue-next/styles/index.css'
import { onMounted } from 'vue'
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
import { bus } from '@/utils'
import { isLogin } from '@/utils/auth'
import { NotificationApi, MessageApi, DialogApi } from '@/components/common'
import UserCardModal from '@/components/user/UserCardModal.vue'
import { ContactConst } from '@/constant/event-bus.ts'
import {
  useProvideUserModal,
  useThemeMode,
  useVisibilityChange,
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

const onChangeRemark = (value: { user_id: number; remark: string }) => {
  bus.emit(ContactConst.UpdateRemark, value)
  talkStore.setRemark(value)
}

const init = () => {
  if (!isLogin()) return

  ws.connect()
  userStore.loadSetting()
}

onMounted(() => {
  init()
  useVisibilityChange()
  // useAccessPrompt()
  useUnreadMessage()
  useConnectStatus()
  useClickEvent()
})

// 监听 document.dispatchEvent(new CustomEvent('full-screen-event', { detail: value }))
document.addEventListener('check-update', (e) => {
  alert('检查软件更新')
  console.log(e)
})
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
        v-model="isShowUser"
        :user-id="showUserId"
        :login-user-id="userStore.uid"
        @update-remark="onChangeRemark"
      />
    </n-layout-content>
  </n-config-provider>
</template>
