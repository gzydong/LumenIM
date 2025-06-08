<script lang="ts" setup>
import { ServAuthOauthLogin } from '@/api/auth'
import { setToken } from '@/utils/auth.ts'
import { useInject } from '@/hooks'
import ws from '@/connect'
import { useUserStore } from '@/store'
import BindMobile from './BindMobile.vue'

import { useRouter, useRoute } from 'vue-router'

const userStore = useUserStore()
const { message } = useInject()

const router = useRouter()
const route = useRoute()
const authStatus = ref('loading')
const authToken = ref('')
const showBindMobile = ref(false)

async function toOauthLogin(params: {
  oauth_type: 'github' | 'gitee'
  code: string
  state: string
}) {
  const { data } = await ServAuthOauthLogin(params)
  if (!data) return

  if (data.is_authorize == 'N') {
    authStatus.value = 'binding'
    authToken.value = data.bind_token
    return
  }

  message.success('登录成功，即将进入系统')

  authStatus.value = 'success'
  setToken(data.authorize.access_token, data.authorize.expires_in)
  ws.connect()
  userStore.loadSetting()

  router.push('/')
}

function bindSuccess(authorize: any) {
  showBindMobile.value = false
  authStatus.value = 'success'
  setToken(authorize.access_token, authorize.expires_in)
  ws.connect()
  userStore.loadSetting()
  router.push('/')
}

onMounted(() => {
  const { oauth_type = '' } = route.params as { oauth_type?: 'github' | 'gitee' }
  const { code = '', state = '' } = route.query as { code?: string; state?: string }

  if (!oauth_type || !['github', 'gitee'].includes(oauth_type)) {
    console.warn('无效的 oauth_type 登录中断')
    return
  }

  toOauthLogin({ oauth_type, code, state })
})

const descs = {
  loading: '正在为您完成授权登录，请稍候片刻～',
  success: '授权登录成功！请稍候片刻～',
  binding: '授权成功！请绑定手机号以完成登录～'
}
</script>

<template>
  <section class="el-container flex-center">
    <n-result
      style="margin-top: 200px"
      :status="authStatus == 'success' ? 'success' : 'info'"
      size="large"
      :title="authStatus == 'binding' ? '绑定手机号' : '授权登录'"
      :description="descs[authStatus]"
    >
      <template #footer>
        <div class="flex-center" v-if="authStatus == 'binding'">
          <n-space>
            <n-button type="tertiary" @click="router.push('/auth/login')">
              暂不绑定，返回登录页</n-button
            >
            <n-button type="primary" @click="showBindMobile = true"> 立即绑定 </n-button>
          </n-space>
        </div>
      </template>
    </n-result>

    <BindMobile v-model="showBindMobile" :bind_token="authToken" @success="bindSuccess" />
  </section>
</template>

<style lang="less" scoped>
@import '@/assets/css/login.less';
</style>
