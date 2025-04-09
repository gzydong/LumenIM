<script lang="ts" setup>
import { ServeUpdateEmail } from '@/api/user'
import { toApi } from '@/api'
import SmsLock from '@/plugins/sms-lock'
import { ServeSendEmailCode } from '@/api/common'
import { rsaEncrypt } from '@/utils/rsa'

const model = defineModel({ default: false })
const emit = defineEmits(['success'])

// 短信按钮倒计时
const lockTime = ref(0)

// 初始化短信按钮锁
const lock = new SmsLock('CHANGE_EMAIL_SMS', 120, (time) => (lockTime.value = time))

const formRef = ref()

const state = reactive({
  password: '',
  email: '',
  code: ''
})

const rules = {
  password: {
    required: true,
    trigger: ['input'],
    message: '账号密码不能为空！'
  },
  email: {
    required: true,
    trigger: ['input'],
    message: '邮箱不能为空！'
  },
  code: {
    required: true,
    trigger: ['change'],
    message: '验证码不能为空！'
  }
}

const loading = ref(false)

const onSendEmail = async () => {
  await toApi(
    ServeSendEmailCode,
    {
      email: state.email
    },
    {
      showMessageText: '邮件发送成功',
      onSuccess: lock.start
    }
  )
}

const onSubmit = async () => {
  const params = {
    email: state.email,
    code: state.code,
    password: rsaEncrypt(state.password)
  }

  await toApi(ServeUpdateEmail, params, {
    loading,
    showMessageText: '邮箱修改成功',
    onSuccess: () => {
      emit('success', state.email)
    }
  })
}

const onValidate = (e: any) => {
  e.preventDefault()

  formRef.value.validate((errors: any) => {
    !errors && onSubmit()
  })
}
</script>

<template>
  <n-modal
    :show="model"
    preset="card"
    title="修改邮箱？"
    class="modal-radius"
    style="max-width: 400px"
    :on-update:show="(value) => (model = value)"
  >
    <n-form ref="formRef" :model="state" :rules="rules">
      <n-form-item label="登录密码" path="password">
        <n-input placeholder="请填写登录密码" type="password" v-model:value="state.password" />
      </n-form-item>

      <n-form-item label="新邮箱" path="email">
        <n-input placeholder="请填写新邮箱" type="text" v-model:value="state.email" />
      </n-form-item>

      <n-form-item label="邮箱验证码" path="code">
        <n-input placeholder="请填写验证码" type="text" v-model:value="state.code" />
        <n-button class="mt-l5" @click="onSendEmail" :disabled="lockTime > 0">
          获取验证码 <span v-show="lockTime > 0">({{ lockTime }}s)</span>
        </n-button>
      </n-form-item>
    </n-form>

    <template #footer>
      <div style="width: 100%; text-align: right">
        <n-button type="tertiary" @click="model = false"> 取消 </n-button>
        <n-button
          type="primary"
          text-color="#ffffff"
          class="mt-l15"
          :loading="loading"
          @click="onValidate"
        >
          保存修改
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<style lang="less" scoped></style>
