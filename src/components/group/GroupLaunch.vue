<script lang="ts" setup>
import { fetchGroupCreate, fetchGroupGetInviteFriends, fetchGroupInvite } from '@/apis/api'
import { fetchApi } from '@/apis/request'
import { useInject } from '@/hooks'
import { NAvatar, TransferRenderTargetLabel } from 'naive-ui'

const { message } = useInject()

const props = defineProps<{
  groupId: number
}>()

const emit = defineEmits<{
  close: []
  onInvite: [groupId: number]
  onSubmit: [groupId: number, groupName: string]
}>()

const mapData = new Map()
const items = ref<any[]>([])
const values = ref<any[]>([])
const loading = ref(true)
const isShowBox = ref(true)
const modelGroupName = ref('')

const isCanSubmit = computed(() => {
  return values.value.length === 0
})

const renderLabel: TransferRenderTargetLabel = function ({ option }) {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        margin: '6px 0'
      }
    },
    {
      default: () => [
        h(NAvatar, {
          round: true,
          src: mapData.get(option.value) as string,
          size: 'small'
        }),
        h(
          'div',
          {
            style: {
              display: 'flex',
              marginLeft: '6px',
              alignSelf: 'center'
            }
          },
          { default: () => option.label }
        )
      ]
    }
  )
}

const onLoad = async () => {
  const option = {
    group_id: props.groupId
  }

  const [err, data] = await fetchApi(fetchGroupGetInviteFriends, option, { loading })
  if (err) return

  const list = data?.items || []

  items.value = list.map((item: any) => {
    mapData.set(item.user_id, item.avatar)

    return {
      label: item.nickname + (item.remark ? ` (${item.remark})` : ''),
      value: item.user_id,
      avatar: item.avatar
    }
  })
}

const close = () => {
  emit('close')
}

const onCreateSubmit = async (user_ids: number[]) => {
  if (modelGroupName.value.trim() == '') {
    return message.error('请输入群名称')
  }

  const [err, data] = await fetchApi(fetchGroupCreate, {
    user_ids,
    name: modelGroupName.value.trim()
  })

  if (err) return

  message.success('创建成功')
  emit('onSubmit', data.group_id, modelGroupName.value.trim())
  emit('close')
}

const onInviteSubmit = async (user_ids: number[]) => {
  const [err] = await fetchApi(fetchGroupInvite, {
    user_ids,
    group_id: props.groupId
  })

  if (err) return

  message.success('邀请成功')
  emit('onInvite', props.groupId)
  emit('close')
}

const onSubmit = () => {
  const ids = values.value.map((value) => value)

  if (props.groupId == 0) {
    onCreateSubmit(ids)
  } else {
    onInviteSubmit(ids)
  }
}

onMounted(() => {
  onLoad()
})
</script>

<template>
  <n-modal
    v-model:show="isShowBox"
    preset="card"
    :title="groupId === 0 ? '创建群聊' : '邀请好友'"
    class="modal-radius"
    style="max-width: 650px"
    :on-after-leave="close"
    transform-origin="mouse"
  >
    <section class="launch-box" style="padding: 10px">
      <n-input
        class="group-name"
        v-show="groupId === 0"
        placeholder="请填写群名称(必填)"
        maxlength="20"
        show-count
        v-model:value="modelGroupName"
      />

      <n-transfer
        ref="transfer"
        virtual-scroll
        source-filterable
        v-model:value="values"
        :options="items"
        :render-target-label="renderLabel"
        v-loading="loading"
      />
    </section>

    <template #footer>
      <div class="footer">
        <n-button type="tertiary" @click="isShowBox = false"> 取消 </n-button>
        <n-button
          type="primary"
          class="mt-l15"
          style="color: #ffffff"
          @click="onSubmit"
          :disabled="isCanSubmit"
        >
          提交
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<style lang="less" scoped>
.launch-box {
  width: 100%;
  overflow: hidden;

  .group-name {
    margin-bottom: 10px;
  }
}

.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
