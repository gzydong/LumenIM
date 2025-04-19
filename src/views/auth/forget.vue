<script lang="ts" setup>
import { ServAuthForget } from '@/api/auth'
import { ServCommonSendSmsCode } from '@/api/common'
import { isMobile } from '@/utils/validate'
import { useSmsLock } from '@/hooks'
import { rsaEncrypt } from '@/utils/rsa'

// 初始化短信按钮锁
const { lockTime, start } = useSmsLock('FORGET_PSW_SMS', 120)

const router = useRouter()
const formRef = ref()
const rules = {
  sms_code: {
    required: true,
    trigger: ['blur', 'input'],
    message: '验证码不能为空！'
  },
  username: {
    required: true,
    trigger: ['blur', 'input'],
    // @ts-ignore
    validator(rule: any, value: string) {
      if (!value) {
        return new Error('手机号不能为空！')
      } else if (!isMobile(value)) {
        return new Error('请正确填写手机号！')
      }

      return true
    }
  },
  password: {
    required: true,
    trigger: ['blur', 'input'],
    message: '密码不能为空！'
  }
}

const loading = ref(false)
const model = reactive({
  username: '',
  password: '',
  sms_code: ''
})

const onForget = async () => {
  const { code } = await ServAuthForget(
    {
      mobile: model.username,
      password: rsaEncrypt(model.password),
      sms_code: model.sms_code
    },
    { loading, successText: '密码修改成功' }
  )

  if (code != 200) return

  setTimeout(() => {
    router.push('/auth/login')
  }, 500)
}

const onValidate = (e: Event) => {
  e.preventDefault()

  formRef.value.validate((errors) => {
    !errors && onForget()
  })
}

// 发送短信
const onSendSms = async () => {
  if (!isMobile(model.username)) {
    return window['$message'].warning('请正确填写手机号')
  }

  await ServCommonSendSmsCode(
    {
      mobile: model.username,
      channel: 'forget_account'
    },
    { loading, successText: '短信发送成功', onSuccess: start }
  )
}
</script>

<template>
  <section class="el-container is-vertical login-box forget">
    <header class="el-header box-header">找回密码</header>

    <main class="el-main" style="padding: 3px">
      <n-form ref="formRef" size="large" :model="model" :rules="rules">
        <n-form-item path="username" :show-label="false">
          <n-input
            placeholder="登录账号/手机号"
            v-model:value="model.username"
            :maxlength="11"
            @keydown.enter="onValidate"
          />
        </n-form-item>

        <n-form-item path="sms_code" :show-label="false">
          <n-input
            placeholder="验证码"
            :maxlength="6"
            v-model:value="model.sms_code"
            @keydown.enter="onValidate"
          />
          <n-button class="mt-l5" @click="onSendSms" :disabled="lockTime > 0">
            获取验证码 <span v-show="lockTime > 0">({{ lockTime }}s)</span>
          </n-button>
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
          立即找回
        </n-button>
      </n-form>

      <div class="helper">
        <n-button text color="#409eff" @click="router.push('/auth/register')"> 注册账号 </n-button>
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
