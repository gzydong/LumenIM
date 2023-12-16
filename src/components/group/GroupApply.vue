<script lang="ts" setup>
import { ref } from 'vue'
import { NModal, NForm, NFormItem, NInput } from 'naive-ui'
import { ServeCreateGroupApply } from '@/api/group'

const remark = ref('')
const props = defineProps({
  gid: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close'])

const isShow = ref(true)
const loading = ref(false)

const onMaskClick = () => {
  emit('close')
}

const onSubmit = () => {
  loading.value = true

  let resp = ServeCreateGroupApply({
    group_id: props.gid,
    remark: remark.value
  })

  resp.then((res) => {
    if (res.code == 200) {
      window['$message'].success('入群申请提交成功...')
      onMaskClick()
    } else {
      window['$message'].warning(res.message)
    }
  })

  resp.finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <n-modal
    v-model:show="isShow"
    preset="card"
    title="入群申请"
    class="modal-radius"
    style="max-width: 450px"
    :on-after-leave="onMaskClick"
  >
    <n-form>
      <n-form-item label="申请备注" required>
        <n-input placeholder="请填写申请备注" type="textarea" v-model:value="remark" />
      </n-form-item>
    </n-form>

    <template #footer>
      <div style="width: 100%; text-align: right">
        <n-button type="tertiary" @click="onMaskClick"> 取消 </n-button>
        <n-button
          type="primary"
          class="mt-l15"
          :loading="loading"
          :disabled="!remark"
          @click="onSubmit"
        >
          提交
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<style lang="less" scoped></style>
