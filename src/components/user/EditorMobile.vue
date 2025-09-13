<script lang="ts" setup>
import { fetchCommonSendSms, fetchUserMobileUpdate } from '@/apis/api'
import { fetchApi } from '@/apis/request'
import { useInject, useSmsLock } from '@/hooks'
import { rsaEncrypt } from '@/utils/rsa'
import { isMobile } from '@/utils/validate'

const emit = defineEmits(['success'])

const { message } = useInject()

const model = defineModel({ default: false })

const formRef = ref()

const state = reactive({
  password: '',
  mobile: '',
  sms_code: ''
})

const rules = {
  password: {
    required: true,
    trigger: ['input'],
    message: '账号密码不能为空！'
  },
  mobile: {
    required: true,
    trigger: ['input'],
    message: '手机号不能为空！'
  },
  sms_code: {
    required: true,
    trigger: ['change'],
    message: '验证码不能为空！'
  }
}

const loading = ref(false)

// 初始化短信按钮锁
const { startCountdown, Countdown } = useSmsLock('CHANGE_MOBILE_SMS', 120)

const onSendSms = async () => {
  if (!isMobile(state.mobile)) {
    return message.warning('请正确填写手机号')
  }

  const params = {
    mobile: state.mobile,
    channel: 'change_account'
  }

  const [err, data] = await fetchApi(fetchCommonSendSms, params)
  if (err) return

  startCountdown()
  if (data.sms_code) {
    state.sms_code = data.sms_code
    message.success('已开启验证码自动填充')
  } else {
    message.success('短信发送成功')
  }
}

const onSubmit = async () => {
  const params = {
    mobile: state.mobile,
    sms_code: state.sms_code,
    password: rsaEncrypt(state.password)
  }

  await fetchApi(fetchUserMobileUpdate, params, {
    loading,
    successText: '手机号修改成功',
    onSuccess: () => {
      emit('success', state.mobile)
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
    title="换绑手机？"
    class="modal-radius"
    style="max-width: 400px"
    :on-update:show="(value) => (model = value)"
  >
    <n-form ref="formRef" :model="state" :rules="rules">
      <n-form-item label="登录密码" path="password">
        <n-input placeholder="请填写登录密码" type="password" v-model:value="state.password" />
      </n-form-item>

      <n-form-item label="新手机号码" path="mobile">
        <n-input placeholder="请填写新手机号码" type="text" v-model:value="state.mobile" />
      </n-form-item>

      <n-form-item label="短信验证码" path="sms_code">
        <n-input placeholder="请填写验证码" type="text" v-model:value="state.sms_code" />
        <Countdown class="mt-l5" @click="onSendSms"> </Countdown>
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
