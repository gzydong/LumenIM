<script setup>
import { reactive, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { useDialogueStore } from '@/store/dialogue'
import { useUploadsStore } from '@/store/uploads'
import PanelHeader from './panel/PanelHeader.vue'
import PanelContent from './panel/PanelContent.vue'
import PanelFooter from './panel/PanelFooter.vue'
import GroupPanel from '@/components/group/GroupPanel.vue'
import GroupNotice from '@/components/group/GroupNotice.vue'
import UploadsModal from '@/components/base/UploadsModal.vue'

const userStore = useUserStore()
const dialogueStore = useDialogueStore()
const uploadsStore = useUploadsStore()

// 当前对话参数
const talkParams = reactive({
  uid: computed(() => userStore.uid),
  index_name: computed(() => dialogueStore.index_name),
  type: computed(() => dialogueStore.talk.talk_type),
  receiver_id: computed(() => dialogueStore.talk.receiver_id),
  username: computed(() => dialogueStore.talk.username),
  online: computed(() => dialogueStore.online),
  keyboard: computed(() => dialogueStore.keyboard),
  num: 0,
})

const state = reactive({
  // 是否显示群面板
  isShowGroupAside: false,

  isShowGroupNotice: false,
})

// Header 工具栏事件
const onPanelHeaderEvent = eventType => {
  const events = {
    notice: () => {
      state.isShowGroupNotice = !state.isShowGroupNotice
    },
    group: () => {
      state.isShowGroupAside = !state.isShowGroupAside
    },
  }

  events[eventType] && events[eventType]()
}
</script>

<template>
  <section class="el-container height100">
    <main class="el-main bdr-r">
      <section class="el-container is-vertical height100">
        <!-- 头部区域 -->
        <PanelHeader
          @evnet="onPanelHeaderEvent"
          :type="talkParams.type"
          :username="talkParams.username"
          :online="talkParams.online"
          :keyboard="talkParams.keyboard"
          :num="talkParams.num"
        />

        <section class="el-main">
          <section class="el-container height100">
            <main class="el-main">
              <!-- 聊天区域 -->
              <PanelContent
                :uid="talkParams.uid"
                :talk_type="talkParams.type"
                :receiver_id="talkParams.receiver_id"
              />
            </main>
            <aside
              class="el-aside bdr-l me-scrollbar"
              style="width: 350px"
              v-if="uploadsStore.isShow"
            >
              <UploadsModal />
            </aside>
          </section>
        </section>

        <!-- 编辑器区域 -->
        <PanelFooter
          v-if="dialogueStore.isShowEditor"
          :uid="talkParams.uid"
          :index_name="talkParams.index_name"
          :talk_type="talkParams.type"
          :receiver_id="talkParams.receiver_id"
          :online="talkParams.online"
        />
      </section>
    </main>

    <!-- 侧边栏 -->
    <aside
      class="el-aside aside"
      v-if="state.isShowGroupAside && talkParams.type == 2"
    >
      <GroupPanel
        :gid="talkParams.receiver_id"
        @close="state.isShowGroupAside = false"
      />
    </aside>
  </section>

  <GroupNotice
    v-if="state.isShowGroupNotice"
    :group-id="talkParams.receiver_id"
    @close="state.isShowGroupNotice = false"
  />
</template>

<style lang="less" scoped>
.aside {
  width: 380px;
}
</style>
