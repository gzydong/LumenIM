<script lang="ts" setup>
import { fetchAuthRegister, fetchCommonSendSms } from '@/apis/api'
import { sync } from '@/apis/request'
import ws from '@/connect'
import { useInject, useSmsLock } from '@/hooks'
import { useUserStore } from '@/store'
import { setToken } from '@/utils/auth'
import { rsaEncrypt } from '@/utils/rsa'
import { isMobile } from '@/utils/validate'

const { message } = useInject()
const userStore = useUserStore()

// 初始化短信按钮锁
const { startCountdown, Countdown } = useSmsLock('REGISTER_SMS', 60)

const router = useRouter()
const formRef = ref()
const rules = {
  nickname: {
    required: true,
    trigger: ['blur', 'input'],
    message: '昵称不能为空！'
  },
  username: {
    required: true,
    // @ts-expect-error
    validator(rule: any, value: string) {
      if (!value) {
        return new Error('手机号不能为空！')
      } else if (!isMobile(value)) {
        return new Error('请正确填写手机号！')
      }

      return true
    },
    trigger: ['blur', 'input']
  },
  password: {
    required: true,
    trigger: ['blur', 'input'],
    message: '密码不能为空！'
  },
  sms_code: {
    required: true,
    trigger: ['blur', 'input'],
    message: '验证码不能为空！'
  }
}

const loading = ref(false)
const model = reactive({
  nickname: '',
  username: '',
  password: '',
  sms_code: ''
})

const onRegister = async () => {
  const options = { loading }
  sync(async () => {
    const data = await fetchAuthRegister({
      nickname: model.nickname,
      mobile: model.username,
      password: rsaEncrypt(model.password),
      sms_code: model.sms_code,
      platform: 'web'
    })

    setToken(data.access_token, data.expires_in)
    ws.connect()
    message.success('注册成功，即将进入系统')
    userStore.loadSetting()
    router.push('/')
  }, options)
}

const onValidate = (e) => {
  e.preventDefault()

  formRef.value.validate((errors) => {
    !errors && onRegister()
  })
}

// 发送短信
const onSendSms = async () => {
  if (!isMobile(model.username)) {
    return window['$message'].warning('请正确填写手机号')
  }

  const options = { loading, successText: '短信发送成功' }

  sync(async () => {
    const data = await fetchCommonSendSms({
      mobile: model.username,
      channel: 'register'
    })

    startCountdown()

    if (data?.sms_code) {
      model.sms_code = data.sms_code
      window['$message'].success('已开启验证码自动填充')
    }
  }, options)
}
</script>

<template>
  <section class="el-container is-vertical login-box reister">
    <header class="el-header box-header">账号注册</header>

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

        <n-form-item path="sms_code" :show-label="false">
          <n-input
            placeholder="验证码"
            v-model:value="model.sms_code"
            :maxlength="6"
            @keydown.enter="onValidate"
          />
          <Countdown class="mt-l5" @click="onSendSms" />
        </n-form-item>

        <n-form-item path="nickname" :show-label="false">
          <n-input
            placeholder="设置昵称"
            v-model:value="model.nickname"
            @keydown.enter="onValidate"
          />
        </n-form-item>

        <n-form-item path="password" :show-label="false">
          <n-input
            placeholder="设置密码"
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
          text-color="#ffffff"
          class="mt-t20"
          @click="onValidate"
          :loading="loading"
        >
          立即注册
        </n-button>
      </n-form>

      <div class="helper">
        <n-button text color="#409eff" @click="router.push('/auth/forget')"> 找回密码 </n-button>
        <n-button text color="#409eff" @click="router.push('/auth/login')">
          已有账号，立即登录?
        </n-button>
      </div>
    </main>
  </section>
</template>

<style lang="less" scoped>
@import '@/assets/css/login.less';
</style>
