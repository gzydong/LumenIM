<script setup>
import { NForm, NFormItem, NSwitch, NPopconfirm } from 'naive-ui'
import { ServeDismissGroup } from '@/api/group'

const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },
})

const onDismiss = () => {
  ServeDismissGroup({
    group_id: props.id,
  }).then(res => {
    if (res.code == 200) {
      window['$message'].success('群组已解散！')
    } else {
      window['$message'].info(res.message)
    }
  })
}
</script>
<template>
  <section class="section el-container is-vertical height100">
    <header class="el-header header bdr-b">
      <p>设置管理</p>
    </header>

    <main class="el-main main">
      <n-form
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="解散群组:">
          <n-popconfirm
            negative-text="取消"
            positive-text="确定"
            @positive-click="onDismiss"
          >
            <template #trigger>
              <n-button type="info" size="small" text> 点击解散 </n-button>
            </template>
            确定要解散群聊吗？ 此操作是不可逆的！
          </n-popconfirm>
        </n-form-item>
        <n-form-item label="公开可见:" feedback="开启后可在公开群组列表展示。">
          <n-switch />
        </n-form-item>

        <n-form-item
          label="全员禁言:"
          feedback="开启后除群主和管理员以外，其它成员禁止发言。"
        >
          <n-switch />
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
