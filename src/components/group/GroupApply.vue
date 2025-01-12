<script lang="ts" setup>
import { ServeCreateGroupApply } from '@/api/group'
import { toApi } from '@/api'

const remark = ref('')
const props = defineProps({
  groupId: {
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

const onSubmit = async () => {
  const { code } = await toApi(
    ServeCreateGroupApply,
    {
      group_id: props.groupId,
      remark: remark.value
    },
    { loading, showMessageText: '入群申请提交成功...' }
  )

  if (code == 200) onMaskClick()
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
