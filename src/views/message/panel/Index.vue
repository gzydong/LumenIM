<script lang="ts" setup>
import { reactive, computed, ref } from 'vue'
import { NDrawer } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useUserStore, useDialogueStore, useUploadsStore, useTalkStore } from '@/store'
import PanelHeader from './Header.vue'
import PanelContent from './Content.vue'
import PanelFooter from './Footer.vue'
// import VoiceCall from './VoiceCall.vue'
import GroupPanel from '@/components/group/GroupPanel.vue'
import GroupLaunch from '@/components/group/GroupLaunch.vue'
import UploadsModal from '@/components/base/UploadsModal.vue'
import { useEventBus } from '@/hooks'
import { SessionConst } from '@/constant/event-bus'

const router = useRouter()
const userStore = useUserStore()
const dialogueStore = useDialogueStore()
const uploadsStore = useUploadsStore()
const talkStore = useTalkStore()

const members = computed(() => dialogueStore.members)
const isShowEditor = computed(() => dialogueStore.isShowEditor)

// 当前对话参数
const talkParams = reactive({
  uid: computed(() => userStore.uid),
  indexName: computed(() => dialogueStore.index_name),
  talkMode: computed(() => dialogueStore.talk.talk_type),
  toFromId: computed(() => dialogueStore.talk.receiver_id),
  username: computed(() => dialogueStore.talk.username),
  online: computed(() => dialogueStore.online),
  keyboard: computed(() => dialogueStore.keyboard),
  num: computed(() => dialogueStore.members.length)
})

// 是否显示群面板
const isShowGroupAside = ref(false)

const showGroupLaunch = ref({
  groupId: 0,
  isShowGroupLaunch: false
})

const events = {
  group: () => {
    isShowGroupAside.value = !isShowGroupAside.value
  },
  'add-group': () => {
    showGroupLaunch.value.groupId = 0

    if (talkParams.talkMode === 2) {
      showGroupLaunch.value.groupId = talkParams.toFromId
    }

    showGroupLaunch.value.isShowGroupLaunch = true
  }
}

// Header 工具栏事件
const onPanelHeaderEvent = (eventType: string) => {
  events[eventType]?.()
}

const onGroupLaunchSuccess = (groupId: number) => {
  talkStore.toTalk(2, groupId, router)
}

useEventBus([
  {
    name: SessionConst.Switch,
    event: () => {
      isShowGroupAside.value = false
    }
  }
])
</script>

<template>
  <!-- <VoiceCall /> -->

  <section class="el-container is-vertical" id="drawer-container2" style="position: relative">
    <!-- 头部区域 -->
    <header class="el-header border-bottom">
      <PanelHeader
        :talk-mode="talkParams.talkMode"
        :username="talkParams.username"
        :online="talkParams.online"
        :keyboard="talkParams.keyboard"
        :num="talkParams.num"
        :show-session-menu="dialogueStore.isShowSessionMenu"
        @evnet="onPanelHeaderEvent"
        @change-session-menu="
          (value: boolean) => {
            dialogueStore.isShowSessionMenu = value
          }
        "
      />
    </header>

    <!-- 聊天区域 -->
    <main class="el-main">
      <PanelContent
        :uid="talkParams.uid"
        :talk-mode="talkParams.talkMode"
        :to-from-id="talkParams.toFromId"
        :index-name="talkParams.indexName"
      />
    </main>

    <!-- 编辑器区域 -->
    <footer
      v-show="isShowEditor"
      class="el-footer"
      :style="{ height: 200 + 'px' }"
      v-dropsize="{ min: 100, max: 600, direction: 'top', key: 'editor' }"
    >
      <PanelFooter
        :uid="talkParams.uid"
        :index-name="talkParams.indexName"
        :talk-mode="talkParams.talkMode"
        :to-from-id="talkParams.toFromId"
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
    to="#drawer-container2"
  >
    <UploadsModal />
  </n-drawer>

  <n-drawer
    v-model:show="isShowGroupAside"
    :width="400"
    placement="right"
    show-mask="transparent"
    to="#drawer-container2"
  >
    <GroupPanel :group-id="talkParams.toFromId" @close="isShowGroupAside = false" />
  </n-drawer>

  <GroupLaunch
    v-if="showGroupLaunch.isShowGroupLaunch"
    :group-id="showGroupLaunch.groupId"
    @close="showGroupLaunch.isShowGroupLaunch = false"
    @on-submit="onGroupLaunchSuccess"
  />
</template>

<style lang="less" scoped></style>
