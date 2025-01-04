<script lang="ts" setup>
import { onMounted } from 'vue'
import { useUserStore, useTalkStore } from '@/store'
import ws from '@/connect'
import { bus } from '@/utils'
import { isLogin } from '@/utils/auth'
import UserCardModal from '@/components/user/UserCardModal.vue'
import { ContactConst } from '@/constant/event-bus.ts'

import AppProvider from '@/layout/AppProvider.vue'
import { useProvideUserModal } from '@/hooks'

const { uid: showUserId, isShow: isShowUser } = useProvideUserModal()

const userStore = useUserStore()
const talkStore = useTalkStore()

const onChangeRemark = (value: { user_id: number; remark: string }) => {
  bus.emit(ContactConst.UpdateRemark, value)
  talkStore.setRemark(value)
}

onMounted(() => {
  if (isLogin()) {
    ws.connect()
    userStore.loadSetting()
  }
})
</script>

<template>
  <AppProvider>
    <router-view />
    <UserCardModal
      v-model="isShowUser"
      :user-id="showUserId"
      :login-user-id="userStore.uid"
      @update-remark="onChangeRemark"
    />
  </AppProvider>
</template>
