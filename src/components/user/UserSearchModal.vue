<script lang="ts" setup>
import { ServContactSearch } from '@/api/contact.ts'
import { useInject } from '@/hooks'

const { toShowUserInfo } = useInject()

const emit = defineEmits(['update:show'])

const isShow = ref(true)
const keyword = ref('')
const isShowError = ref(false)

const onShowError = (value: boolean) => {
  isShowError.value = value

  if (value) {
    setTimeout(() => (isShowError.value = false), 3000)
  }
}

const onSubmit = async () => {
  if (!keyword.value.length) return

  const { code, data } = await ServContactSearch(
    { mobile: keyword.value },
    {
      error: false
    }
  )

  if (code !== 200 || !data) {
    return onShowError(true)
  }

  toShowUserInfo(data.user_id)
  onClose()
}

// 是否可提交
const isCanSubmit = computed(() => {
  return keyword.value.trim().length == 0
})

const onClose = () => {
  keyword.value = ''
  emit('update:show', false)
}
</script>

<template>
  <n-modal
    v-model:show="isShow"
    preset="card"
    title="联系人查询"
    class="modal-radius"
    style="max-width: 450px"
    :mask-closable="true"
    :on-update:show="onClose"
    transform-origin="center"
  >
    <n-form>
      <n-form-item
        :validation-status="isShowError ? 'error' : undefined"
        :feedback="isShowError ? '无法找到该用户，请检查搜索内容并重试!' : ''"
      >
        <n-input
          placeholder="请输入手机号"
          :maxlength="30"
          v-model:value="keyword"
          @keydown.enter="onSubmit"
        />
      </n-form-item>
    </n-form>

    <template #footer>
      <div style="width: 100%; text-align: center">
        <n-button type="primary" text-color="#ffffff" @click="onSubmit" :disabled="isCanSubmit">
          查询手机号
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<style lang="less" scoped></style>
