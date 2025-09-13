<script lang="ts" setup>
import { fetchAuthOauthBind, fetchCommonSendSms } from '@/apis/api'
import { fetchApi } from '@/apis/request'
import { useInject, useSmsLock } from '@/hooks'
import { isMobile } from '@/utils/validate'

const emit = defineEmits(['success'])

const { bind_token } = defineProps<{
  bind_token: string
}>()

const { message } = useInject()
const model = defineModel({ default: false })
const loading = ref(false)
const formRef = ref()

const state = reactive({
  mobile: '',
  sms_code: ''
})

const rules = {
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

const { startCountdown, Countdown } = useSmsLock('OAUTH_BIND_MOBILE_SMS', 120)

const onSendSms = async () => {
  if (!isMobile(state.mobile)) {
    return message.warning('请正确填写手机号')
  }

  const params = {
    mobile: state.mobile,
    channel: 'oauth_bind'
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
    bind_token
  }

  const [err, data] = await fetchApi(fetchAuthOauthBind, params, {
    loading,
    successText: '手机号绑定成功'
  })

  if (err) return

  emit('success', data?.authorize)
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
    title="授权绑定手机号"
    class="modal-radius"
    style="max-width: 400px"
    :on-update:show="(value) => (model = value)"
  >
    <n-form ref="formRef" :model="state" :rules="rules">
      <n-form-item label="手机号" path="mobile">
        <n-input placeholder="请填写手机号" type="text" v-model:value="state.mobile" />
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
          立即绑定
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<style lang="less" scoped></style>
