<script setup>
import { reactive, computed, inject } from 'vue'
import { NDrawer } from 'naive-ui'
import { useUserStore } from '@/store/user'
import { useDialogueStore } from '@/store/dialogue'
import { useUploadsStore } from '@/store/uploads'
import PanelHeader from './panel/PanelHeader.vue'
import PanelContent from './panel/PanelContent.vue'
import PanelFooter from './panel/PanelFooter.vue'
import GroupPanel from '@/components/group/GroupPanel.vue'
import GroupNotice from '@/components/group/GroupNotice.vue'
import UploadsModal from '@/components/base/UploadsModal.vue'
import GroupList from './GroupList.vue'

const user = inject('$user')
const userStore = useUserStore()
const dialogueStore = useDialogueStore()
const uploadsStore = useUploadsStore()

const members = computed(() => dialogueStore.members)

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
    <main id="drawer-target" class="el-main bdr-r height100">
      <section class="el-container is-vertical">
        <header class="el-header">
          <!-- 头部区域 -->
          <PanelHeader
            @evnet="onPanelHeaderEvent"
            :type="talkParams.type"
            :username="talkParams.username"
            :online="talkParams.online"
            :keyboard="talkParams.keyboard"
            :num="talkParams.num"
          />
        </header>
        <main class="el-main">
          <section class="el-container">
            <main class="el-main">
              <section class="el-container is-vertical">
                <main class="el-main">
                  <!-- 聊天区域 -->
                  <PanelContent
                    :uid="talkParams.uid"
                    :talk_type="talkParams.type"
                    :receiver_id="talkParams.receiver_id"
                    :index_name="talkParams.index_name"
                  />
                </main>
                <footer
                  v-if="dialogueStore.isShowEditor"
                  class="el-footer footer-editor"
                >
                  <!-- 编辑器区域 -->
                  <PanelFooter
                    v-if="dialogueStore.isShowEditor"
                    :uid="talkParams.uid"
                    :index_name="talkParams.index_name"
                    :talk_type="talkParams.type"
                    :receiver_id="talkParams.receiver_id"
                    :online="talkParams.online"
                    :members="members"
                  />
                </footer>
              </section>
            </main>
            <aside
              class="el-aside bdr-l me-scrollbar"
              style="width: 350px"
              v-if="uploadsStore.isShow"
            >
              <UploadsModal />
            </aside>
          </section>
        </main>
      </section>
    </main>
  </section>

  <GroupNotice
    v-if="state.isShowGroupNotice"
    :group-id="talkParams.receiver_id"
    @close="state.isShowGroupNotice = false"
  />

  <n-drawer
    v-model:show="state.isShowGroupAside"
    :width="400"
    placement="right"
    :trap-focus="false"
    :block-scroll="false"
    show-mask="transparent"
    to="#drawer-target"
  >
    <GroupPanel
      :gid="talkParams.receiver_id"
      @close="state.isShowGroupAside = false"
    />
  </n-drawer>
</template>

<style lang="less" scoped>
.drawer-target {
  overflow: hidden;
}

.footer-editor {
  height: 200px;
}
</style>
