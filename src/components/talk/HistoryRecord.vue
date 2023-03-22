<script setup>
import { ref, reactive } from 'vue'
import { NModal } from 'naive-ui'
import Loading from '@/components/base/Loading.vue'
import { ServeFindTalkRecords } from '@/api/chat'
import { ChevronDownOutline, CalendarNumberOutline } from '@vicons/ionicons5'

const emit = defineEmits(['close'])
const props = defineProps({
  talkType: {
    type: Number,
    default: 0,
  },
  receiverId: {
    type: Number,
    default: 0,
  },
})

const model = reactive({
  recordId: 0,
  limit: 30,
  msgType: 0,
  loading: false,
  loadMore: false,
  isLoadMore: true,
})

const isShow = ref(true)
const records = ref([])

const tabType = [
  { name: '全部', type: 0, show: true },
  { name: '图片/视频/文件', type: 2, show: true },
  { name: '会话记录', type: 3, show: true },
  { name: '代码块', type: 4, show: true },
  { name: '群投票', type: 5, show: props.talkType == 2 },
]

const onMaskClick = () => {
  emit('close')
}

const loadChatRecord = () => {
  let data = {
    talk_type: props.talkType,
    receiver_id: props.receiverId,
    record_id: model.recordId,
    msg_type: model.msgType,
    limit: model.limit,
  }

  if (model.recordId === 0) {
    model.loading = true
  } else {
    model.loadMore = true
  }

  ServeFindTalkRecords(data).then(res => {
    if (res.code != 200) return

    if (data.record_id === 0) {
      records.value = []
    }

    let items = res.data.items || []

    records.value.push(...items)

    if (items.length) {
      model.recordId = res.data.record_id
    }

    model.loading = false
    model.loadMore = false
    model.isLoadMore = items.length >= model.limit
  })
}

const triggerType = type => {
  model.msgType = type
  model.recordId = 0
  loadChatRecord()
}

loadChatRecord()
</script>

<template>
  <n-modal
    v-model:show="isShow"
    preset="card"
    title="消息管理"
    size="huge"
    :bordered="false"
    style="max-width: 750px; border-radius: 10px"
    class="o-hidden"
    :on-after-leave="onMaskClick"
    :segmented="{
      content: true,
    }"
    :header-style="{
      padding: '20px 15px',
    }"
    :content-style="{
      padding: 0,
    }"
    :hoverable="true"
  >
    <section class="main-box el-container is-vertical o-hidden">
      <header class="el-header bdr-b search" style="height: 50px">
        <div class="type-items">
          <span
            v-for="tab in tabType"
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
                :component="CalendarNumberOutline"
              />
            </template>
            <n-date-picker
              panel
              type="date"
              :is-date-disabled="disablePreviousDate"
              :on-update:value="datefunc"
            />
          </n-popover> -->

          <n-icon
            :size="20"
            class="pointer"
            :component="CalendarNumberOutline"
          />
        </div>
      </header>

      <main v-if="model.loading" class="el-main flex-center">
        <Loading />
      </main>

      <main v-else-if="records.length === 0" class="el-main flex-center">
        <n-empty size="200" description="暂无相关数据">
          <template #icon>
            <img src="@/assets/image/no-data.svg" alt="" />
          </template>
        </n-empty>
      </main>

      <main v-else class="el-main me-scrollbar">
        <div v-for="item in records" :key="item.id" class="message-item">
          <div class="left-box">
            <n-avatar :size="30" :src="item.avatar" />
          </div>

          <div class="right-box">
            <div class="msg-header">
              <span class="name">
                {{ item.nickname_remarks || item.nickname }}
              </span>

              <span class="time"> {{ item.created_at }}</span>
            </div>

            <!-- 文本消息 -->
            <text-message
              v-if="item.msg_type == 1"
              :content="item.content"
              float="left"
            />

            <!-- 文件 - 图片消息 -->
            <image-message
              v-else-if="item.msg_type == 2 && item.extra.type == 1"
              :src="item.extra.url"
              float="left"
            />

            <!-- 文件 - 音频消息 -->
            <audio-message
              v-else-if="item.msg_type == 2 && item.extra.type == 2"
              :src="item.extra.url"
            />

            <!-- 文件 - 视频消息 -->
            <video-message
              v-else-if="item.msg_type == 2 && item.extra.type == 3"
              :src="item.extra.url"
            />

            <!-- 文件消息 -->
            <file-message
              v-else-if="
                item.msg_type == 2 && item.extra && item.extra.type == 4
              "
              :file-name="item.extra.original_name"
              :size="item.extra.size"
              :ext="item.extra.suffix"
              :record-id="item.id"
            />

            <!-- 会话记录消息 -->
            <forward-message
              v-else-if="item.msg_type == 3"
              :data="item.extra"
              :record-id="item.id"
              @contextmenu.prevent="onContextMenu($event, item)"
            />

            <!-- 代码块消息 -->
            <code-message
              v-else-if="item.msg_type == 4"
              :code="item.extra.code"
              :lang="item.extra.lang"
            />

            <!-- 投票消息 -->
            <vote-message
              v-else-if="item.msg_type == 5"
              :title="item.extra.detail.title"
              :mode="item.extra.detail.answer_mode"
              :options="item.extra.detail.answer_option"
              :statistics="item.extra.statistics"
              :answer_num="item.extra.detail.answer_num"
              :answered_num="item.extra.detail.answered_num"
              :vote_users="item.extra.vote_users"
              :record_id="item.id"
              :user_id="uid"
            />

            <div v-else class="other-message">未知消息类型</div>
          </div>
        </div>

        <div
          class="more pointer flex-center"
          @click="loadChatRecord"
          v-show="model.isLoadMore"
        >
          <n-icon
            v-show="!model.loadMore"
            :size="20"
            class="icon"
            :component="ChevronDownOutline"
          />
          <span>
            &nbsp;{{ model.loadMore ? '数据加载中...' : '加载更多' }}
          </span>
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
    flex: auto;
    overflow-x: auto;
    padding: 0px 5px 15px 5px;

    .msg-header {
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      color: #a09a9a;
      position: relative;
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .name {
        color: #333;
      }
    }
  }
}

.more {
  margin: 10px auto 20px;
  width: 150px;
  height: 30px;
}
</style>
