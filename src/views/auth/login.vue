<script lang="ts" setup>
import { fetchAuthLogin, fetchAuthOauth } from '@/apis/api'
import { sync } from '@/apis/request'
import ws from '@/connect'
import { useInject } from '@/hooks'
import { useUserStore } from '@/store'
import { setToken } from '@/utils/auth.ts'
import { rsaEncrypt } from '@/utils/rsa'
import { playMusic } from '@/utils/talk'
import { Github } from '@icon-park/vue-next'

const { message } = useInject()
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

const loading = ref(false)

const model = reactive({
  username: '',
  password: ''
})

const onLogin = async () => {
  sync(
    async () => {
      const data = await fetchAuthLogin({
        mobile: model.username,
        password: rsaEncrypt(model.password),
        platform: 'web'
      })

      setToken(data.access_token, data.expires_in)
      ws.connect()
      message.success('登录成功，即将进入系统')
      userStore.loadSetting()

      router.push(route.params?.redirect || ('/' as any))
    },
    { loading }
  )
}

const onValidate = (e: Event) => {
  e.preventDefault()

  // 谷歌浏览器提示音需要用户主动交互才能播放，登录入口主动交互一次，后面消息提示音就能正常播放了
  playMusic(true)

  formRef.value.validate((errors: any) => !errors && onLogin())
}

const onClickAccount = (type: number) => {
  if (type == 1) {
    model.username = '13800000001'
    model.password = 'admin123'
  } else {
    model.username = '13800000002'
    model.password = 'admin123'
  }

  onLogin()
}

const toOauth = async (oauth_type: 'github' | 'gitee') => {
  sync(async () => {
    message.loading('正在跳转第三方授权登录页面，请稍等...', { duration: 5000 })
    const data = await fetchAuthOauth({ oauth_type })
    location.href = data.uri
  })
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

        <n-space>
          <n-button text color="#409eff" @click="onClickAccount(1)"> 预览账号1 </n-button>
          <n-button text color="#409eff" @click="onClickAccount(2)"> 预览账号2 </n-button>
        </n-space>

        <n-button
          type="primary"
          size="large"
          block
          text-color="#ffffff"
          class="mt-t20"
          @click="onValidate"
          :loading="loading"
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
        <span style="color: #ccc; font-weight: 300"> 其它登录方式</span>
      </n-divider>

      <div style="display: flex; justify-content: center; gap: 20px; margin-top: 10px">
        <github theme="filled" size="30" @click="toOauth('github')" class="pointer" />

        <img
          src="https://files.codelife.cc/icons/gitee.svg"
          width="30"
          style="background-color: red; border-radius: 50%"
          @click="toOauth('gitee')"
          class="pointer"
        />
      </div>
    </footer>
  </section>
</template>

<style lang="less" scoped>
@import '@/assets/css/login.less';
</style>
