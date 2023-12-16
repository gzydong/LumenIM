<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { NModal, NForm, NFormItem, NInput } from 'naive-ui'
import { ServeEditGroupNotice } from '@/api/group'

const emit = defineEmits(['close', 'success'])
const props = defineProps({
  id: {
    type: Number,
    default: 0
  },
  gid: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  }
})

const titleModal = ref(props.id == 0 ? '发布群公告' : '编辑群公告')

const formRef = ref()
const model = reactive({
  title: props.title,
  content: props.content
})

const rules = {
  title: {
    required: true,
    trigger: ['blur', 'input'],
    message: '标题不能为空！'
  },
  content: {
    required: true,
    trigger: ['blur', 'input'],
    message: '内容不能为空！'
  }
}

const isShow = ref(true)
const loading = ref(false)

const onMaskClick = () => {
  emit('close')
}

const onSubmit = () => {
  loading.value = true

  let response = ServeEditGroupNotice({
    notice_id: props.id,
    group_id: props.gid,
    title: model.title,
    content: model.content,
    is_top: 0,
    is_confirm: 0
  })

  response.then((res) => {
    if (res.code == 200) {
      window['$message'].success(res.message)
      emit('success')
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
    v-model:show="isShow"
    preset="card"
    :title="titleModal"
    size="huge"
    style="max-width: 450px; border-radius: 10px"
    :on-after-leave="onMaskClick"
  >
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item label="标题" path="title">
        <n-input placeholder="必填" type="text" v-model:value="model.title" />
      </n-form-item>

      <n-form-item label="内容" path="content">
        <n-input
          placeholder="必填"
          type="textarea"
          v-model:value="model.content"
          :autosize="{
            minRows: 5,
            maxRows: 10
          }"
        />
      </n-form-item>
    </n-form>

    <template #footer>
      <div style="width: 100%; text-align: right">
        <n-button type="tertiary" @click="onMaskClick"> 取消 </n-button>
        <n-button type="primary" class="mt-l15" :loading="loading" @click="onValidate">
          确定
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<style lang="less" scoped></style>
