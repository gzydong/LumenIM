<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { NModal, NForm, NFormItem, NInput, NButton } from 'naive-ui'
import { ServeUpdatePassword } from '@/api/user'

defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'close'])

const formRef = ref()

const model = reactive({
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
    validator(rule, value) {
      console.log(rule)
      if (!value) {
        return new Error('确认密码不能为空！')
      } else if (model.new_password != model.new_password2) {
        return new Error('两次密码填写不一致！')
      }

      return true
    }
  }
}

const loading = ref(false)

const onSubmit = () => {
  loading.value = true

  let response = ServeUpdatePassword({
    old_password: model.old_password,
    new_password: model.new_password
  })

  response.then((res) => {
    if (res.code == 200) {
      window['$message'].success('密码修改成功')
      emit('update:modelValue', false)
    } else {
      window['$message'].warning(res.message)
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
    title="修改密码？"
    class="modal-radius"
    style="max-width: 400px"
    :on-update:show="
      (value) => {
        $emit('update:modelValue', value)
      }
    "
  >
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item label="登录密码" path="old_password">
        <n-input placeholder="请填写登录密码" type="password" v-model:value="model.old_password" />
      </n-form-item>

      <n-form-item label="设置新密码" path="new_password">
        <n-input placeholder="请填写新密码" type="password" v-model:value="model.new_password" />
      </n-form-item>

      <n-form-item label="确认新密码" path="new_password2">
        <n-input
          placeholder="请再次填写新密码"
          type="password"
          v-model:value="model.new_password2"
        />
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
