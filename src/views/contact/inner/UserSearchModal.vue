<script setup>
import { computed, ref } from 'vue'
import { NModal, NForm, NFormItem, NInput } from 'naive-ui'
import { ServeSearchContact } from '@/api/contacts'
import UserCardModal from '@/components/user/UserCardModal.vue'
import { modal } from '@/utils/common'

const emit = defineEmits(['update:show'])

const isShow = ref(true)
const keyword = ref('')
const isShowError = ref(false)

const onShowError = isBool => {
  isShowError.value = isBool

  if (isBool) {
    setTimeout(() => {
      isShowError.value = false
    }, 2000)
  }
}

const onSubmit = () => {
  if (!keyword.value.length) {
    return
  }

  ServeSearchContact({
    mobile: keyword.value,
  }).then(res => {
    onShowError(res.code != 200)

    if (res.code == 200) {
      modal(UserCardModal, {
        uid: res.data.id,
      })
    }
  })
}

// 是否可提交
const isCanSubmit = computed(() => {
  return keyword.value.trim().length == 0
})

const onShowUpdate = () => {
  emit('update:show', false)
}
</script>

<template>
  <n-modal
    v-model:show="isShow"
    preset="card"
    title="好友搜索"
    size="huge"
    :bordered="false"
    style="max-width: 450px; border-radius: 10px"
    :mask-closable="false"
    :on-after-leave="onShowUpdate"
    :on-update:show="onShowUpdate"
    transform-origin="center"
  >
    <n-form>
      <n-form-item label="请输入查询手机号" :required="true">
        <n-input
          placeholder="手机号(必填)"
          :maxlength="30"
          v-model:value="keyword"
          @keydown.enter.native="onSubmit"
        />
      </n-form-item>
      <p v-show="isShowError" style="color: red">
        无法找到该用户，请检查搜索内容并重试!
      </p>
    </n-form>

    <template #footer>
      <div style="width: 100%; text-align: right">
        <n-button type="tertiary" @click="onShowUpdate"> 取消 </n-button>
        <n-button
          type="primary"
          @click="onSubmit"
          class="mt-l15"
          :disabled="isCanSubmit"
        >
          查询
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<style lang="less" scoped>
.options {
  width: 100%;

  .option {
    margin: 8px 0;
    display: flex;
    align-items: center;

    .btn {
      width: 30px;
      height: 30px;
      margin-left: 3px;
      &:hover {
        color: red;
      }
    }
  }
}
</style>
