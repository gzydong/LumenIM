<script lang="ts" setup>
import { reactive } from 'vue'
import { NForm, NFormItem, NSwitch, NPopconfirm } from 'naive-ui'
import { ServeDismissGroup, ServeMuteGroup, ServeGroupDetail, ServeOvertGroup } from '@/api/group'

const emit = defineEmits(['close'])
const props = defineProps({
  id: {
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
  const { data, code } = await ServeGroupDetail({ group_id: props.id })

  if (code === 200) {
    detail.is_mute = data.is_mute === 1
    detail.is_overt = data.is_overt === 1
  }
}

const onDismiss = async () => {
  const { code, message } = await ServeDismissGroup({ group_id: props.id })

  if (code === 200) {
    emit('close')
    window['$message'].success('群聊已解散')
  } else {
    window['$message'].info(message)
  }
}

const onMute = (value: boolean) => {
  detail.mute_loading = true

  ServeMuteGroup({
    group_id: props.id,
    mode: detail.is_mute ? 2 : 1
  })
    .then(({ code, message }) => {
      if (code == 200) {
        detail.is_mute = value
      } else {
        window['$message'].info(message)
      }
    })
    .finally(() => {
      detail.mute_loading = false
    })
}

const onOvert = (value: boolean) => {
  detail.overt_loading = true

  ServeOvertGroup({
    group_id: props.id,
    mode: detail.is_overt ? 2 : 1
  })
    .then(({ code, message }) => {
      if (code == 200) {
        detail.is_overt = value
      } else {
        window['$message'].info(message)
      }
    })
    .finally(() => {
      detail.overt_loading = false
    })
}

onLoadData()
</script>
<template>
  <section class="section el-container is-vertical height100">
    <header class="el-header header bdr-b">
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
