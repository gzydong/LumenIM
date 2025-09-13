<script lang="ts" setup>
import { fetchUserPasswordUpdate } from '@/apis/api'
import { fetchApi } from '@/apis/request'
import { rsaEncrypt } from '@/utils/rsa'

const model = defineModel({ default: false })

const formRef = ref()

const state = reactive({
  old_password: '',
  new_password: '',
  new_password2: ''
})

const rules = {
  old_password: {
    required: true,
    trigger: ['blur', 'input'],
    message: '登录密码不能为空！'
  },
  new_password: {
    required: true,
    trigger: ['blur', 'input'],
    message: '新密码不能为空！'
  },
  new_password2: {
    required: true,
    trigger: ['blur', 'change'],
    // @ts-expect-error
    validator(rule: any, value: string) {
      if (!value) {
        return new Error('确认密码不能为空！')
      } else if (state.new_password != state.new_password2) {
        return new Error('两次密码填写不一致！')
      }

      return true
    }
  }
}

const loading = ref(false)

const onSubmit = async () => {
  await fetchApi(
    fetchUserPasswordUpdate,
    {
      old_password: rsaEncrypt(state.old_password),
      new_password: rsaEncrypt(state.new_password)
    },
    {
      loading,
      successText: '密码修改成功',
      onSuccess: () => {
        model.value = false
      }
    }
  )
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
    title="修改密码？"
    class="modal-radius"
    style="max-width: 400px"
    :on-update:show="(value) => (model = value)"
  >
    <n-form ref="formRef" :model="state" :rules="rules">
      <n-form-item label="登录密码" path="old_password">
        <n-input placeholder="请填写登录密码" type="password" v-model:value="state.old_password" />
      </n-form-item>

      <n-form-item label="设置新密码" path="new_password">
        <n-input placeholder="请填写新密码" type="password" v-model:value="state.new_password" />
      </n-form-item>

      <n-form-item label="确认新密码" path="new_password2">
        <n-input
          placeholder="请再次填写新密码"
          type="password"
          v-model:value="state.new_password2"
        />
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
