<script lang="ts" setup>
import { useUserStore, useUploadsStore, useTalkStore } from '@/store/index.ts'
import { ServContactOnlineStatus } from '@/api/contact.ts'
import { ChatPlus } from '@/components/chat'
import PanelHeader from './Header.vue'
import ChatLayout from '@/components/chat/ChatLayout.vue'
import Editor from './Editor.vue'
import GroupMember from './GroupMember.vue'
import GroupPanel from '@/components/group/GroupPanel.vue'
import GroupLaunch from '@/components/group/GroupLaunch.vue'
import GroupNoticeDrawer from '@/components/group/GroupNoticeDrawer.vue'
import UploadsModal from '@/components/basic/UploadsModal.vue'
import { useTalkRecord } from './useTalkRecord.ts'
import { useContextMenu } from './useContextMenu.ts'
import { useChatAside } from './useChatAside.ts'
import { bus } from '@/utils/index.ts'
import { EditorConst, SessionConst } from '@/constant/event-bus.ts'
import { TalkModeEnum } from '@/constant/chat.ts'
import { useInject, useEventBus } from '@/hooks/index.ts'
import { formatChatMessage } from '@/components/mechat/render.tsx'

const chat = useTemplateRef('chat')
const chatAside = useChatAside()
const userStore = useUserStore()
const uploadsStore = useUploadsStore()
const talkStore = useTalkStore()
const router = useRouter()
const { records, loadChatRecord, dialogueStore, resetTalkRecord } = useTalkRecord()
const { toShowUserInfo } = useInject()
const members = computed(() => dialogueStore.members)

const isShowEditor = computed(() => dialogueStore.isShowEditor)
const {
  isShowMultiSelect,
  contextMenuOptions,
  onContextMenuEvent,
  onChatElementSelect,
  MultiSelectComponent
} = useContextMenu(chat)

// 当前对话参数
const talkParams = reactive({
  uid: computed(() => userStore.uid),
  indexName: computed(() => dialogueStore.index_name),
  talkMode: computed(() => dialogueStore.target.talk_mode),
  toFromId: computed(() => dialogueStore.target.to_from_id),
  username: computed(() => dialogueStore.target.username),
  description: computed(() => dialogueStore.target.description),
  keyboard: computed(() => dialogueStore.keyboard),
  num: computed(() => dialogueStore.members.length),
  online: false
})

/**
 * 自定义消息渲染器
 * @param item
 */
const customMessageRender = (item: any) => formatChatMessage(talkParams.uid, item)

function onElementClickUser(key: string, item: any) {
  if (key === 'nickname') {
    return (
      talkParams.talkMode == TalkModeEnum.Group &&
      bus.emit(EditorConst.Mention, {
        id: item.from_id,
        value: item.nickname
      })
    )
  } else {
    toShowUserInfo(item.from_id)
  }
}

// 是否显示群面板
const isShowGroupAside = ref(false)
const isShowGroupNoticeAside = ref(false)

const showGroupLaunch = ref({
  groupId: 0,
  isShowGroupLaunch: false
})

const events = {
  group: () => {
    isShowGroupAside.value = !isShowGroupAside.value
  },
  addGroup: () => {
    showGroupLaunch.value.groupId = 0

    if (talkParams.talkMode === TalkModeEnum.Group) {
      showGroupLaunch.value.groupId = talkParams.toFromId
    }

    showGroupLaunch.value.isShowGroupLaunch = true
  },
  announcement: () => {
    isShowGroupNoticeAside.value = !isShowGroupNoticeAside.value
  }
}

// Header 工具栏事件
const onPanelHeaderEvent = (eventType: string) => {
  events[eventType]?.()
}

useEventBus([
  {
    name: SessionConst.Switch,
    event: () => {
      isShowGroupAside.value = false
    }
  }
])

watch(
  () => talkParams.indexName,
  () => {
    // 关闭侧边栏
    chatAside.closeAside()

    // 查询好友的在线状态
    loopGetOnlineStatus()

    // 清空会话信息
    resetTalkRecord()
    chat.value?.reload()
  },
  { immediate: true }
)

async function loopGetOnlineStatus() {
  if (talkParams.talkMode != TalkModeEnum.Single) {
    return
  }

  const { code, data } = await ServContactOnlineStatus({
    user_id: talkParams.toFromId
  })

  if (code === 200 && data) {
    talkParams.online = data.online_status == 'Y'
  }
}

let timer: NodeJS.Timeout
onMounted(() => {
  dialogueStore.container = chat.value?.getContainerId() || ''

  // 120后刷新一次在线状态
  timer = setInterval(loopGetOnlineStatus, 2 * 60 * 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <ChatLayout
    :aside="chatAside.aside.show"
    :aside-width="chatAside.aside.width"
    :editor="isShowEditor"
    id="drawer-container"
  >
    <template #header>
      <PanelHeader
        :talk-mode="talkParams.talkMode"
        :username="talkParams.username"
        :online="talkParams.online"
        :keyboard="talkParams.keyboard"
        :num="talkParams.num"
        :menu="talkStore.isShowSessionMenu"
        :description="talkParams.description"
        @evnet="onPanelHeaderEvent"
        @change-session-menu="
          (value: boolean) => {
            talkStore.isShowSessionMenu = value
          }
        "
      />
    </template>

    <template #main>
      <ChatPlus
        ref="chat"
        :items="records"
        :custom-render="customMessageRender"
        data-source-mode="pulldown"
        :onScrollLoadMore="loadChatRecord"
        :unread="dialogueStore.unreadBubble"
        :multi-select-mode="true"
        :context-menu="true"
        :context-menu-option="contextMenuOptions"
        @context-menu-event="onContextMenuEvent"
        @element-select="onChatElementSelect"
        @element-event="onContextMenuEvent"
        @user-click-event="onElementClickUser"
        @on-scroll-to-bottom="
          () => {
            dialogueStore.unreadBubble = 0
          }
        "
      />
    </template>

    <template #aside>
      <component
        :is="chatAside.aside.component"
        v-bind="chatAside.aside.props"
        v-on="chatAside.aside.listeners"
      />
    </template>

    <template #editor>
      <MultiSelectComponent v-if="isShowMultiSelect" />

      <Editor
        v-else
        :uid="talkParams.uid"
        :index-name="talkParams.indexName"
        :talk-mode="talkParams.talkMode"
        :to-from-id="talkParams.toFromId"
        :online="talkParams.online"
        :members="members"
        :aside="chatAside.aside.show"
        @trigger-aside="
          () => {
            chatAside.aside.show = !chatAside.aside.show
            if (chatAside.aside.show) {
              chatAside.setAsideComponent(
                GroupMember,
                160,
                {
                  groupId: talkParams.toFromId,
                  members: members
                },
                {
                  addContact: () => {
                    events.addGroup()
                  }
                }
              )
            }
          }
        "
      />
    </template>
  </ChatLayout>

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

  <GroupNoticeDrawer v-model="isShowGroupNoticeAside" :group-id="talkParams.toFromId" />

  <n-drawer
    v-model:show="isShowGroupAside"
    :width="400"
    placement="right"
    show-mask="transparent"
    to="#drawer-container"
  >
    <GroupPanel :group-id="talkParams.toFromId" @close="isShowGroupAside = false" />
  </n-drawer>

  <GroupLaunch
    v-if="showGroupLaunch.isShowGroupLaunch"
    :group-id="showGroupLaunch.groupId"
    @close="showGroupLaunch.isShowGroupLaunch = false"
    @on-submit="
      (groupId: number) => {
        talkStore.toTalk(TalkModeEnum.Group, groupId, router)
      }
    "
  />
</template>

<style lang="less" scoped></style>
