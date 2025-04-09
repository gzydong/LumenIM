<script lang="ts" setup>
import { useUserStore } from '@/store'
import ws from '@/connect'
import { isLogin } from '@/utils/auth'
import AppProvider from '@/layout/AppProvider.vue'

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
