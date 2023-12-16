<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { NModal, NForm, NFormItem, NInput } from 'naive-ui'
import { ServeUpdateEmail } from '@/api/user'
import SmsLock from '@/plugins/sms-lock'
import { ServeSendEmailCode } from '@/api/common'

defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'success'])

// 短信按钮倒计时
const lockTime = ref(0)

// 初始化短信按钮锁
const lock = new SmsLock('CHANGE_EMAIL_SMS', 120, (time) => (lockTime.value = time))

const formRef = ref()

const model = reactive({
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

const onSendEmail = () => {
  const response = ServeSendEmailCode({
    email: model.email
  })

  response.then(({ code, message }) => {
    if (code == 200) {
      lock.start()
      window['$message'].success('邮件发送成功')
    } else {
      window['$message'].warning(message)
    }
  })
}

const onSubmit = () => {
  loading.value = true

  let response = ServeUpdateEmail(model)

  response.then(({ code, message }) => {
    if (code == 200) {
      window['$message'].success('密码修改成功...')
      emit('success', model.email)
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
    title="修改邮箱？"
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

      <n-form-item label="新邮箱" path="email">
        <n-input placeholder="请填写新邮箱" type="text" v-model:value="model.email" />
      </n-form-item>

      <n-form-item label="邮箱验证码" path="code">
        <n-input placeholder="请填写验证码" type="text" v-model:value="model.code" />
        <n-button tertiary class="mt-l5" @click="onSendEmail" :disabled="lockTime > 0">
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
