<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import Loading from '@/components/base/Loading.vue'
import { ServeFindTalkRecords } from '@/api/chat'
import { Down, Calendar } from '@icon-park/vue-next'
import * as message from '@/constant/message'
import { ITalkRecord } from '@/types/chat'
import { useInject } from '@/hooks'

const emit = defineEmits(['close'])
const props = defineProps({
  talkType: {
    type: Number,
    default: 0
  },
  receiverId: {
    type: Number,
    default: 0
  }
})
const { showUserInfoModal } = useInject()
const model = reactive({
  cursor: 0,
  limit: 30,
  msgType: 0,
  loading: false,
  loadMore: false,
  isLoadMore: true
})

const isShow = ref(true)
const items = ref<ITalkRecord[]>([])

const tabs = [
  { name: '全部', type: 0, show: true },
  { name: '图片', type: message.ChatMsgTypeImage, show: true },
  { name: '音频', type: message.ChatMsgTypeAudio, show: true },
  { name: '视频', type: message.ChatMsgTypeVideo, show: true },
  { name: '文件', type: message.ChatMsgTypeFile, show: true },
  { name: '会话', type: message.ChatMsgTypeForward, show: true },
  { name: '代码', type: message.ChatMsgTypeCode, show: true },
  { name: '位置', type: message.ChatMsgTypeLocation, show: true },
  { name: '群投票', type: message.ChatMsgTypeVote, show: props.talkType == 2 }
]

const onMaskClick = () => {
  emit('close')
}

const loadChatRecord = () => {
  let data = {
    talk_type: props.talkType,
    receiver_id: props.receiverId,
    msg_type: model.msgType,
    cursor: model.cursor,
    limit: model.limit
  }

  if (model.cursor === 0) {
    model.loading = true
  } else {
    model.loadMore = true
  }

  ServeFindTalkRecords(data).then((res) => {
    if (res.code != 200) return

    if (data.cursor === 0) {
      items.value = []
    }

    let list = res.data.items || []
    if (list.length) {
      model.cursor = res.data.cursor
    }

    model.loading = false
    model.loadMore = false
    model.isLoadMore = list.length >= model.limit
    items.value.push(...list)
  })
}

const triggerType = (type: number) => {
  model.msgType = type
  model.cursor = 0
  loadChatRecord()
}

onMounted(() => {
  loadChatRecord()
})
</script>

<template>
  <n-modal
    v-model:show="isShow"
    preset="card"
    title="消息管理"
    style="max-width: 750px"
    class="modal-radius"
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
      <header class="el-header bdr-b search" style="height: 50px">
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
          <!-- <n-popover placement="bottom-end" trigger="click" :show-arrow="false">
            <template #trigger>
              <n-icon
                :size="20"
                class="pointer"
                :component="Calendar"
              />
            </template>
            <n-date-picker
              panel
              type="date"
              :is-date-disabled="disablePreviousDate"
              :on-update:value="datefunc"
            />
          </n-popover> -->

          <n-icon :size="20" class="pointer" :component="Calendar" />
        </div>
      </header>

      <main v-if="model.loading" class="el-main flex-center">
        <Loading />
      </main>

      <main v-else-if="items.length === 0" class="el-main flex-center">
        <n-empty size="200" description="暂无相关数据">
          <template #icon>
            <img src="@/assets/image/no-data.svg" alt="" />
          </template>
        </n-empty>
      </main>

      <main v-else class="el-main me-scrollbar me-scrollbar-thumb">
        <div v-for="item in items" :key="item.id" class="message-item">
          <div class="left-box">
            <im-avatar
              :src="item.avatar"
              :size="30"
              :username="item.nickname"
              @click="showUserInfoModal(item.user_id)"
            />
          </div>

          <div class="right-box me-scrollbar">
            <div class="msg-header">
              <span class="name">{{ item.nickname }}</span>
              <span class="time"> {{ item.created_at }}</span>
            </div>

            <template v-if="item.is_revoke == 1">
              <div class="msg-content">此消息已被撤回</div>
            </template>

            <component
              v-if="item.is_revoke == 0"
              :is="message.MessageComponents[item.msg_type] || 'unknown-message'"
              :extra="item.extra"
              :data="item"
            />
          </div>
        </div>

        <div class="more pointer flex-center" @click="loadChatRecord" v-show="model.isLoadMore">
          <n-icon v-show="!model.loadMore" :size="20" class="icon" :component="Down" />
          <span> &nbsp;{{ model.loadMore ? '数据加载中...' : '加载更多' }} </span>
        </div>
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
        font-size: 13px;
        font-weight: 400;
      }
    }
  }
}

.message-item {
  min-height: 30px;
  display: flex;
  margin-bottom: 5px;
  flex-direction: row;
  padding: 5px 15px;

  &:first-child {
    margin-top: 10px;
  }

  .left-box {
    width: 30px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    user-select: none;
    padding-top: 8px;
    margin-right: 10px;

    img {
      height: 30px;
      width: 30px;
      border-radius: 3px;
    }
  }

  .right-box {
    width: 100%;
    overflow-x: auto;
    padding: 0px 5px 15px 5px;
    box-sizing: border-box;
    height: fit-content;

    .msg-header {
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      position: relative;
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}

.more {
  margin: 10px auto 20px;
  width: 150px;
  height: 30px;
}
</style>
