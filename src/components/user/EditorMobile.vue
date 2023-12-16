<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { NModal, NForm, NFormItem, NInput } from 'naive-ui'
import { ServeUpdateMobile } from '@/api/user'
import SmsLock from '@/plugins/sms-lock'
import { isMobile } from '@/utils/validate'
import { ServeSendVerifyCode } from '@/api/common'

defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'success'])

const formRef = ref()

const model = reactive({
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

// 短信按钮倒计时
const lockTime = ref(0)

// 初始化短信按钮锁
const lock = new SmsLock('CHANGE_MOBILE_SMS', 120, (time) => (lockTime.value = time))

const onSendSms = () => {
  if (!isMobile(model.mobile)) {
    window['$message'].warning('请正确填写手机号')
    return
  }

  const response = ServeSendVerifyCode({
    mobile: model.mobile,
    channel: 'change_account'
  })

  response.then(({ code, data, message }) => {
    if (code == 200) {
      lock.start()

      if (data.is_debug) {
        model.sms_code = data.sms_code
        window['$message'].success('已开启验证码自动填充')
      } else {
        window['$message'].success('短信发送成功')
      }
    } else {
      window['$message'].warning(message)
    }
  })
}

const onSubmit = () => {
  loading.value = true

  let response = ServeUpdateMobile(model)

  response.then(({ code, message }) => {
    if (code == 200) {
      window['$message'].success('手机号修改成功...')
      emit('success', model.mobile)
    } else {
      window['$message'].warning(message)
    }
  })

  response.finally(() => {
    loading.value = false
  })
}

const onValidate = (e) => {
  e.preventDefault()

  formRef.value.validate((errors) => {
    !errors && onSubmit()
  })
}
</script>

<template>
  <n-modal
    :show="modelValue"
    preset="card"
    title="换绑手机？"
    class="modal-radius"
    style="max-width: 400px"
    :on-update:show="
      (value) => {
        $emit('update:modelValue', value)
      }
    "
  >
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item label="登录密码" path="password">
        <n-input placeholder="请填写登录密码" type="password" v-model:value="model.password" />
      </n-form-item>

      <n-form-item label="新手机号码" path="mobile">
        <n-input placeholder="请填写新手机号码" type="text" v-model:value="model.mobile" />
      </n-form-item>

      <n-form-item label="短信验证码" path="sms_code">
        <n-input placeholder="请填写验证码" type="text" v-model:value="model.sms_code" />
        <n-button tertiary class="mt-l5" @click="onSendSms" :disabled="lockTime > 0">
          获取验证码 <span v-show="lockTime > 0">({{ lockTime }}s)</span>
        </n-button>
      </n-form-item>
    </n-form>

    <template #footer>
      <div style="width: 100%; text-align: right">
        <n-button type="tertiary" @click="$emit('update:modelValue', false)"> 取消 </n-button>
        <n-button type="primary" class="mt-l15" :loading="loading" @click="onValidate">
          保存修改
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<style lang="less" scoped></style>
