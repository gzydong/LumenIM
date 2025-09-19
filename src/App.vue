<script lang="ts" setup>
import ws from '@/connect.ts'
import AppProvider from '@/layout/AppProvider.vue'
import { useUserStore } from '@/store'
import { isLogin } from '@/utils/auth.ts'

const { loadSetting } = useUserStore()

const init = () => {
  ws.connect()
  loadSetting()
}

onMounted(() => {
  isLogin() && init()
})
</script>

<template>
  <AppProvider>
    <router-view />
  </AppProvider>
</template>
