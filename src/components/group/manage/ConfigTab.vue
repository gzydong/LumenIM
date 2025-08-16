<script lang="ts" setup>
import { ServGroupDismiss, ServGroupMute, ServGroupDetail, ServGroupOvert } from '@/api/group'

const emit = defineEmits(['close'])
const props = defineProps({
  groupId: {
    type: Number,
    default: 0
  }
})

const detail = reactive({
  is_mute: false,
  mute_loading: false,

  is_overt: false,
  overt_loading: false
})

const onLoadData = async () => {
  const { data, code } = await ServGroupDetail({ group_id: props.groupId })

  if (code != 200) return

  detail.is_mute = data.is_mute === 1
  detail.is_overt = data.is_overt === 1
}

const onDismiss = async () => {
  const { code } = await ServGroupDismiss(
    { group_id: props.groupId },
    {
      successText: '群聊已解散'
    }
  )

  code == 200 && emit('close')
}

const onMute = async (value: boolean) => {
  detail.mute_loading = true

  const { code } = await ServGroupMute({
    group_id: props.groupId,
    action: value ? 1 : 2
  })

  detail.mute_loading = false
  if (code != 200) return

  detail.is_mute = value
}

const onOvert = async (value: boolean) => {
  detail.overt_loading = true

  const { code } = await ServGroupOvert({
    group_id: props.groupId,
    action: value ? 1 : 2
  })

  detail.overt_loading = false
  if (code != 200) return

  detail.is_overt = value
}

onMounted(() => {
  onLoadData()
})
</script>
<template>
  <section class="section el-container is-vertical h-full">
    <header class="el-header header border-bottom">
      <p>设置管理</p>
    </header>

    <main class="el-main main">
      <n-form label-placement="left" label-width="auto" require-mark-placement="right-hanging">
        <n-form-item label="解散群聊:">
          <n-popconfirm negative-text="取消" positive-text="确定" @positive-click="onDismiss">
            <template #trigger>
              <n-button type="primary" size="small" text> 点击解散 </n-button>
            </template>
            确定要解散群聊吗？ 此操作是不可逆的！
          </n-popconfirm>
        </n-form-item>
        <n-form-item label="公开可见:" feedback="开启后可在公开群聊列表展示。">
          <n-switch
            :rubber-band="false"
            :value="detail.is_overt"
            :loading="detail.overt_loading"
            @update:value="onOvert"
          />
        </n-form-item>

        <n-form-item label="全员禁言:" feedback="开启后除群主和管理员以外，其它成员禁止发言。">
          <n-switch
            :rubber-band="false"
            :value="detail.is_mute"
            :loading="detail.mute_loading"
            @update:value="onMute"
          />
        </n-form-item>
      </n-form>
    </main>
  </section>
</template>
<style lang="less" scoped>
.header {
  height: 60px;
  padding: 15px;
  display: flex;
  align-items: center;
}

.main {
  padding: 15px;
  box-sizing: border-box;
}
</style>
