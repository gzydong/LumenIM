<script lang="ts" setup>
import { ref } from 'vue'
import { NModal, NTabPane, NTabs } from 'naive-ui'
import DetailTab from './DetailTab.vue'
import MemberTab from './MemberTab.vue'
import NoticeTab from './NoticeTab.vue'
import ApplyTab from './ApplyTab.vue'
import ConfigTab from './ConfigTab.vue'

const emit = defineEmits(['close'])

defineProps({
  groupId: {
    type: Number,
    default: 0
  }
})

const isShowBox = ref(true)
</script>

<template>
  <n-modal
    v-model:show="isShowBox"
    preset="card"
    title="群管理"
    class="modal-radius"
    style="width: 800px"
    :segmented="{
      content: true
    }"
    :content-style="{
      padding: 0
    }"
  >
    <section class="el-container container-box" :style="{ height: '550px' }">
      <n-tabs
        key="群信息"
        type="line"
        animated
        placement="left"
        :style="{ height: '100%' }"
        :pane-style="{ padding: '0px', boxSizing: 'content-box', overflow: 'auto' }"
      >
        <n-tab-pane name="群信息" tab="群信息"><DetailTab :groupId="groupId" /></n-tab-pane>
        <n-tab-pane name="群成员" tab="群成员"><MemberTab :groupId="groupId" /></n-tab-pane>
        <n-tab-pane name="群公告" tab="群公告"><NoticeTab :groupId="groupId" /></n-tab-pane>
        <n-tab-pane name="群申请" tab="群申请"><ApplyTab :groupId="groupId" /></n-tab-pane>
        <n-tab-pane name="群设置" tab="群设置"><ConfigTab :groupId="groupId" /></n-tab-pane>
        <n-tab-pane name="群邀请" tab="群邀请"><ConfigTab :groupId="groupId" /></n-tab-pane>
      </n-tabs>
    </section>
  </n-modal>
</template>

<style lang="less" scoped></style>
