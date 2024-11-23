<script lang="ts" setup>
import { ref, reactive, useTemplateRef } from 'vue'
import { ServeFindTalkRecords } from '@/api/chat'
import { toApi } from '@/api'
import { Calendar } from '@icon-park/vue-next'
import * as components from '@/constant/chat'
import { ITalkRecord } from '@/types/chat'
import { ChatPlus } from '@/components/chat'
import { formatChatMessage } from '@/components/mechat/render.tsx'

const emit = defineEmits(['close'])
const props = defineProps({
  talkMode: {
    type: Number,
    default: 0
  },
  toFromId: {
    type: Number,
    default: 0
  }
})
const chat = useTemplateRef('chat')

const customMessageRender = (item: any) => formatChatMessage(2054, item)

const model = reactive({
  cursor: 0,
  limit: 30,
  msgType: 0,
  loading: false
})

const isShow = ref(true)
const items = ref<ITalkRecord[]>([])

const tabs = [
  { name: '全部', type: 0, show: true },
  { name: '图片', type: components.ChatMsgTypeImage, show: true },
  { name: '音频', type: components.ChatMsgTypeAudio, show: true },
  { name: '视频', type: components.ChatMsgTypeVideo, show: true },
  { name: '文件', type: components.ChatMsgTypeFile, show: true },
  { name: '会话', type: components.ChatMsgTypeForward, show: true },
  { name: '代码', type: components.ChatMsgTypeCode, show: true },
  { name: '位置', type: components.ChatMsgTypeLocation, show: true },
  { name: '群投票', type: components.ChatMsgTypeVote, show: props.talkMode == 2 }
]

const onMaskClick = () => {
  emit('close')
}

const loadChatRecord = async (): Promise<boolean> => {
  if (model.loading) return true

  const params = {
    talk_mode: props.talkMode,
    to_from_id: props.toFromId,
    msg_type: model.msgType,
    cursor: model.cursor,
    limit: model.limit
  }

  if (model.cursor === 0) {
    model.loading = true
  }

  const { code, data } = await toApi(ServeFindTalkRecords, params)
  model.loading = false

  if (code != 200) return true

  if (params.cursor === 0) {
    items.value = []
  }

  let list = data.items || []

  list.map((item: any) => {
    item.extra = JSON.parse(item.extra)
    item.quote = JSON.parse(item.quote)
  })

  if (list.length) {
    model.cursor = data.cursor
  }

  items.value.push(...list)
  return list.length >= model.limit
}

const triggerType = (type: number) => {
  model.msgType = type
  model.cursor = 0
  chat.value?.reload()
}
</script>

<template>
  <n-modal
    v-model:show="isShow"
    preset="card"
    title="消息管理"
    style="max-width: 750px"
    class="modal-radius o-hidden"
    :on-after-leave="onMaskClick"
    :segmented="{
      content: true
    }"
    :header-style="{
      padding: '20px 15px'
    }"
    :content-style="{
      padding: 0
    }"
  >
    <section class="main-box el-container is-vertical o-hidden">
      <header class="el-header border-bottom search" style="height: 50px">
        <div class="type-items">
          <span
            v-for="tab in tabs"
            :key="tab.name"
            class="pointer"
            :class="{ active: model.msgType == tab.type }"
            @click="triggerType(tab.type)"
            v-show="tab.show"
          >
            {{ tab.name }}
          </span>
        </div>
        <div style="display: flex; align-items: center">
          <n-icon :size="20" class="pointer" :component="Calendar" />
        </div>
      </header>

      <main class="el-main" style="padding: 5px; box-sizing: border-box; overflow: hidden">
        <ChatPlus
          ref="chat"
          align-mode="left"
          :items="items"
          :custom-render="customMessageRender"
          :show-avatar="true"
          :context-menu="false"
          :multi-select-mode="false"
          data-source-mode="pullup"
          :onScrollLoadMore="loadChatRecord"
        />
      </main>
    </section>
  </n-modal>
</template>

<style lang="less" scoped>
.main-box {
  height: 550px;

  .search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px 0 5px;

    .type-items {
      line-height: 40px;
      user-select: none;

      .active {
        color: #03a9f4;
        font-weight: 500;
      }

      span {
        height: 40px;
        width: 45px;
        margin: 0 10px;
        font-size: 14px;
      }
    }
  }
}
</style>
