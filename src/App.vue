<script lang="ts" setup>
import ws from '@/connect.ts'
import AppProvider from '@/layout/AppProvider.vue'
import { useUserStore } from '@/store'
import { isLogin } from '@/utils/auth.ts'
import { JsUpdateDetector } from './plugins/update-detector'
const { loadSetting } = useUserStore()

const init = () => {
  ws.connect()
  loadSetting()
}

onMounted(() => {
  isLogin() && init()

  new JsUpdateDetector({
    checkInterval: 5 * 60 * 1000
  })
})
</script>

<template>
  <AppProvider>
    <router-view />
  </AppProvider>
</template>
