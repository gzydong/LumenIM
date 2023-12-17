<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NDivider, NForm, NFormItem } from 'naive-ui'
import { ServeLogin } from '@/api/auth'
import { setAccessToken } from '@/utils/auth'
import { palyMusic } from '@/utils/talk'
import ws from '@/connect'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const formRef = ref()
const rules = {
  username: {
    required: true,
    trigger: ['blur', 'input'],
    message: '账号不能为空'
  },
  password: {
    required: true,
    trigger: ['blur', 'input'],
    message: '密码不能为空'
  }
}

const model = reactive({
  username: '',
  password: '',
  loading: false
})

const onLogin = () => {
  const redirect: any = route.params?.redirect || '/'

  model.loading = true

  const response = ServeLogin({
    mobile: model.username,
    password: model.password,
    platform: 'web'
  })

  response.then(async (res) => {
    if (res.code == 200) {
      window['$message'].success('登录成功')
      setAccessToken(res.data.access_token, res.data.expires_in)
      ws.connect()
      userStore.loadSetting()
      router.push(redirect)
    } else {
      window['$message'].warning(res.message)
    }
  })

  response.finally(() => {
    model.loading = false
  })
}

const onValidate = (e: Event) => {
  e.preventDefault()

  // 谷歌浏览器提示音需要用户主动交互才能播放，登录入口主动交互一次，后面消息提示音就能正常播放了
  palyMusic(true)

  formRef.value.validate((errors: any) => {
    !errors && onLogin()
  })
}

const onClickAccount = (type: number) => {
  if (type == 1) {
    model.username = '18798272054'
    model.password = 'admin123'
  } else {
    model.username = '18798272055'
    model.password = 'admin123'
  }

  onLogin()
}
</script>

<template>
  <section class="el-container is-vertical login-box login">
    <header class="el-header box-header">快捷登录</header>

    <main class="el-main" style="padding: 3px">
      <n-form ref="formRef" size="large" :model="model" :rules="rules">
        <n-form-item path="username" :show-label="false">
          <n-input
            placeholder="请输入手机号"
            v-model:value="model.username"
            :maxlength="11"
            @keydown.enter="onValidate"
          />
        </n-form-item>

        <n-form-item path="password" :show-label="false">
          <n-input
            placeholder="请输入密码"
            type="password"
            show-password-on="click"
            v-model:value="model.password"
            @keydown.enter="onValidate"
          />
        </n-form-item>

        <n-button
          type="primary"
          size="large"
          block
          class="mt-t20"
          @click="onValidate"
          :loading="model.loading"
        >
          立即登录
        </n-button>
      </n-form>

      <div class="helper">
        <n-button text color="#409eff" @click="router.push('/auth/forget')"> 找回密码 </n-button>
        <n-button text color="#409eff" @click="router.push('/auth/register')">
          还没有账号？立即注册
        </n-button>
      </div>
    </main>

    <footer class="el-footer" style="height: 90px">
      <n-divider style="height: 30px; margin: 0">
        <span style="color: #ccc; font-weight: 300"> 预览账号</span>
      </n-divider>
      <div class="preview-account">
        <p @click="onClickAccount(1)">预览账号:18798272054 / 密码: admin123</p>
        <p @click="onClickAccount(2)">预览账号:18798272055 / 密码: admin123</p>
      </div>
    </footer>
  </section>
</template>

<style lang="less" scoped>
@import '@/assets/css/login.less';
</style>
