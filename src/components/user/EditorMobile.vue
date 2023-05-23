<script setup>
import { reactive, ref } from 'vue'
import { NModal, NForm, NFormItem, NInput } from 'naive-ui'
import { ServeUpdatePassword } from '@/api/user'

const formRef = ref()

const model = reactive({
  oldPassword: '',
  newPassword: '',
  newPassword2: '',
})

const rules = {
  oldPassword: {
    required: true,
    trigger: ['blur', 'input'],
    message: '登录密码不能为空！',
  },
  newPassword: {
    required: true,
    trigger: ['blur', 'input'],
    message: '新密码不能为空！',
  },
  newPassword2: {
    required: true,
    trigger: ['blur', 'change'],
    validator(rule, value) {
      if (!value) {
        return new Error('确认密码不能为空！')
      } else if (model.newPassword != model.newPassword2) {
        return new Error('两次密码输入不一致！')
      }

      return true
    },
  },
}

const emit = defineEmits(['close'])

const isShow = ref(true)
const loading = ref(false)

const onMaskClick = () => {
  emit('close')
}

const onSubmit = () => {
  loading.value = true

  let response = ServeUpdatePassword({
    old_password: model.oldPassword,
    new_password: model.newPassword,
  })

  response.then(res => {
    if (res.code == 200) {
      window.$message.success('密码修改成功...')
    } else {
      window.$message.warning(res.message)
    }
  })

  response.finally(() => {
    loading.value = false
  })
}

const onValidate = e => {
  e.preventDefault()

  formRef.value.validate(errors => {
    !errors && onSubmit()
  })
}
</script>

<template>
  <n-modal
    v-model:show="isShow"
    preset="card"
    title="绑定手机号"
    size="huge"
    style="max-width: 450px; border-radius: 10px"
    :on-after-leave="onMaskClick"
  >
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item label="登录密码" path="oldPassword">
        <n-input
          placeholder="请填写当前账号密码"
          type="password"
          v-model:value="model.oldPassword"
        />
      </n-form-item>

      <n-form-item label="设置新密码" path="newPassword">
        <n-input
          placeholder="请设置新密码"
          type="password"
          v-model:value="model.newPassword"
        />
      </n-form-item>

      <n-form-item label="确认新密码" path="newPassword2">
        <n-input
          placeholder="请重复输入新密码"
          type="password"
          v-model:value="model.newPassword2"
        />
      </n-form-item>
    </n-form>

    <template #footer>
      <div style="width: 100%; text-align: right">
        <n-button type="tertiary" @click="onMaskClick"> 取消 </n-button>
        <n-button
          type="primary"
          class="mt-l15"
          :loading="loading"
          @click="onValidate"
        >
          立即修改
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<style lang="less" scoped></style>
