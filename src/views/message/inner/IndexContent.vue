<script lang="ts" setup>
import { reactive, computed } from 'vue'
import { NDrawer } from 'naive-ui'
import { useUserStore, useDialogueStore, useUploadsStore } from '@/store'
import PanelHeader from './panel/PanelHeader.vue'
import PanelContent from './panel/PanelContent.vue'
import PanelFooter from './panel/PanelFooter.vue'
import GroupPanel from '@/components/group/GroupPanel.vue'
import GroupNotice from '@/components/group/GroupNotice.vue'
import UploadsModal from '@/components/base/UploadsModal.vue'

const userStore = useUserStore()
const dialogueStore = useDialogueStore()
const uploadsStore = useUploadsStore()

const members = computed(() => dialogueStore.members)
const isShowEditor = computed(() => dialogueStore.isShowEditor)

// 当前对话参数
const talkParams = reactive({
  uid: computed(() => userStore.uid),
  index_name: computed(() => dialogueStore.index_name),
  type: computed(() => dialogueStore.talk.talk_type),
  receiver_id: computed(() => dialogueStore.talk.receiver_id),
  username: computed(() => dialogueStore.talk.username),
  online: computed(() => dialogueStore.online),
  keyboard: computed(() => dialogueStore.keyboard),
  num: computed(() => dialogueStore.members.length)
})

const state = reactive({
  // 是否显示群面板
  isShowGroupAside: false,

  isShowGroupNotice: false
})

const events = {
  notice: () => {
    state.isShowGroupNotice = !state.isShowGroupNotice
  },
  group: () => {
    state.isShowGroupAside = !state.isShowGroupAside
  }
}

// Header 工具栏事件
const onPanelHeaderEvent = (eventType: string) => {
  events[eventType] && events[eventType]()
}
</script>

<template>
  <section id="drawer-container" class="el-container is-vertical">
    <!-- 头部区域 -->
    <header class="el-header bdr-b">
      <PanelHeader
        :type="talkParams.type"
        :username="talkParams.username"
        :online="talkParams.online"
        :keyboard="talkParams.keyboard"
        :num="talkParams.num"
        @evnet="onPanelHeaderEvent"
      />
    </header>

    <!-- 聊天区域 -->
    <main class="el-main">
      <PanelContent
        :uid="talkParams.uid"
        :talk_type="talkParams.type"
        :receiver_id="talkParams.receiver_id"
        :index_name="talkParams.index_name"
      />
    </main>

    <!-- 编辑器区域 -->
    <footer
      v-show="isShowEditor"
      class="el-footer"
      :style="{ height: 200 + 'px' }"
      v-dropsize="{ min: 200, max: 600, direction: 'top', key: 'editor' }"
    >
      <PanelFooter
        :uid="talkParams.uid"
        :index_name="talkParams.index_name"
        :talk_type="talkParams.type"
        :receiver_id="talkParams.receiver_id"
        :online="talkParams.online"
        :members="members"
      />
    </footer>
  </section>

  <n-drawer
    v-model:show="uploadsStore.isShow"
    :width="400"
    placement="right"
    :trap-focus="false"
    :block-scroll="false"
    show-mask="transparent"
    to="#drawer-container"
  >
    <UploadsModal />
  </n-drawer>

  <n-drawer
    v-model:show="state.isShowGroupNotice"
    :width="400"
    placement="right"
    :trap-focus="false"
    :block-scroll="false"
    show-mask="transparent"
    to="#drawer-container"
  >
    <GroupNotice :group-id="talkParams.receiver_id" @close="state.isShowGroupNotice = false" />
  </n-drawer>

  <n-drawer
    v-model:show="state.isShowGroupAside"
    :width="400"
    placement="right"
    :trap-focus="false"
    :block-scroll="false"
    show-mask="transparent"
    to="#drawer-container"
  >
    <GroupPanel :gid="talkParams.receiver_id" @close="state.isShowGroupAside = false" />
  </n-drawer>
</template>

<style lang="less" scoped>
.drawer-target {
  overflow: hidden;
}
</style>
