<script setup>
import { reactive, watch, computed, nextTick, onMounted } from 'vue'
import socket from '@/socket'
import { useDialogueStore } from '@/store/dialogue'
import { NDropdown } from 'naive-ui'
import { formatTime, parseTime } from '@/utils/datetime'
import { clipboard } from '@/utils/common'
import { formatTalkRecord } from '@/utils/talk'
import { defAvatar } from '@/constant/default'
import {
  CheckmarkCircleSharp,
  CaretDownSharp,
  NotificationsOutline,
  CheckmarkCircleOutline,
} from '@vicons/ionicons5'
import { ServeTalkRecords } from '@/api/chat'
import UserCardModal from '@/components/user/UserCardModal.vue'
import { modal } from '@/utils/common'

const dialogueStore = useDialogueStore()
const props = defineProps({
  uid: {
    type: Number,
    default: 0,
  },
  talk_type: {
    type: Number,
    default: 0,
  },
  receiver_id: {
    type: Number,
    default: 0,
  },
})

// 对话记录
const records = computed(() => dialogueStore.records)

// 加载配置
const loadConfig = reactive({
  status: 0,
  minRecord: 0,
})

const state = reactive({
  dropdown: {
    options: [],
    show: false,
    dropdownX: 0,
    dropdownY: 0,
    item: {},
  },

  skipBottom: false,
})

// 加载会话记录
const onLoadTalk = () => {
  const data = {
    record_id: loadConfig.minRecord,
    receiver_id: props.receiver_id,
    talk_type: props.talk_type,
    limit: 30,
  }

  let el = document.getElementById('lumenChatPanel')
  let scrollHeight = el.scrollHeight

  loadConfig.status = 0

  const response = ServeTalkRecords(data)
  response.then(res => {
    // 防止对话切换过快，数据渲染错误
    if (
      data.talk_type != props.talk_type ||
      data.receiver_id != props.receiver_id
    ) {
      return
    }

    const records = res.data.rows || []

    records.map(item => formatTalkRecord(props.uid, item))

    // 判断是否是初次加载
    if (data.record_id == 0) {
      dialogueStore.clearDialogueRecord()
    }

    if (props.talk_type == 1) {
      let msgIds = []
      for (const record of records) {
        if (props.receiver_id === record.user_id && record.is_read === 0) {
          msgIds.push(record.id)
        }
      }

      socket.emit('event_talk_read', {
        receiver_id: props.receiver_id,
        msg_id: msgIds,
      })
    }

    dialogueStore.unshiftDialogueRecord(records.reverse())

    loadConfig.status = records.length >= res.data.limit ? 1 : 2
    loadConfig.minRecord = res.data.record_id

    nextTick(() => {
      if (data.record_id == 0) {
        el.scrollTop = el.scrollHeight
      } else {
        el.scrollTop = el.scrollHeight - scrollHeight
      }
    })
  })

  response.catch(() => {
    loadConfig.status = 1
  })
}

// 是否显示消息时间
const isShowTalkTime = (index, datetime) => {
  if (datetime == undefined) {
    return false
  }

  if (records.value[index].is_revoke == 1) {
    return false
  }

  datetime = datetime.replace(/-/g, '/')
  let time = Math.floor(Date.parse(datetime) / 1000)
  let currTime = Math.floor(new Date().getTime() / 1000)

  // 当前时间5分钟内时间不显示
  if (currTime - time < 300) return false

  // 判断是否是最后一条消息,最后一条消息默认显示时间
  if (index == records.value.length - 1) {
    return true
  }

  let nextDate = records.value[index + 1].created_at.replace(/-/g, '/')

  return !(
    parseTime(new Date(datetime), '{y}-{m}-{d} {h}:{i}') ==
    parseTime(new Date(nextDate), '{y}-{m}-{d} {h}:{i}')
  )
}

// 窗口滚动事件
const onPanelScroll = e => {
  if (e.target.scrollTop == 0 && loadConfig.status == 1) {
    onLoadTalk()
  }

  const height = e.target.scrollTop + e.target.clientHeight

  state.skipBottom = height < e.target.scrollHeight

  if (!state.skipBottom && dialogueStore.unreadBubble) {
    dialogueStore.setUnreadBubble(0)
  }
}

// 复制文本信息
const onCopyText = data => {
  if (data.content) {
    clipboard(data.content, () => {
      $message.success('复制成功!')
    })
  }
}

// 删除对话消息
const onDeleteTalk = data => {
  dialogueStore.ApiDeleteRecord([data.id])
}

// 撤销对话消息
const onRevokeTalk = data => {
  dialogueStore.ApiRevokeRecord(data.id)
}

// 多选事件
const onMultiSelect = data => {
  dialogueStore.isOpenMultiSelect = true
}

// 会话列表右键显示菜单
const onContextMenu = (e, item) => {
  state.dropdown.show = false
  state.dropdown.item = Object.assign({}, item)
  state.dropdown.options = [
    {
      label: '复制',
      key: 'copy',
      disabled: !item.content,
    },
    {
      label: `撤回`,
      key: 'revoke',
      disabled: (() => {
        if (props.uid != item.user_id) {
          return true
        }

        let datetime = item.created_at.replace(/-/g, '/')

        let time = new Date().getTime() - Date.parse(datetime)

        return Math.floor(time / 1000 / 60) > 2
      })(),
    },
    {
      label: '删除',
      key: 'delete',
      disabled: false,
    },
    {
      label: '多选',
      key: 'multiSelect',
      disabled: false,
    },
  ]

  nextTick(() => {
    state.dropdown.show = true
    state.dropdown.dropdownX = e.clientX
    state.dropdown.dropdownY = e.clientY
  })

  e.preventDefault()
}

// 会话列表右键菜单回调事件
const onContextMenuHandle = key => {
  const evnets = {
    copy: onCopyText,
    revoke: onRevokeTalk,
    delete: onDeleteTalk,
    multiSelect: onMultiSelect,
  }

  state.dropdown.show = false

  // 触发事件
  evnets[key] && evnets[key](state.dropdown.item)
}

// 聊天版本滚动到底部
const onSkipBottom = () => {
  let el = document.getElementById('lumenChatPanel')
  el.scrollTop = el.scrollHeight + 1000
}

const onReload = () => {
  loadConfig.status = 0
  loadConfig.minRecord = 0

  onLoadTalk()
}

const onUserInfo = uid => {
  modal(UserCardModal, { uid })
}

const onRowClick = item => {
  if (dialogueStore.isOpenMultiSelect) {
    // 1:文本消息;2:文件消息;3:会话消息;4:代码消息;5:投票消息;6:群公告;7:好友申请;8:登录通知;9:入群消息/退群消息;
    if ([1, 2, 4].includes(item.msg_type)) {
      // 需要判断消息类型
      item.isCheck = !item.isCheck
    } else {
      $message.info('此类消息不支持转发！！！')
    }
  }
}

watch(props, () => {
  onReload()
})

onMounted(() => {
  onReload()
})
</script>

<template>
  <section class="section">
    <div
      id="lumenChatPanel"
      class="me-scrollbar talk-container"
      @scroll="onPanelScroll($event)"
    >
      <!-- 数据加载状态栏 -->
      <div class="load-toolbar pointer">
        <span v-if="loadConfig.status == 0"> 正在加载数据中 ... </span>
        <span v-else-if="loadConfig.status == 1" @click="onLoadTalk">
          查看更多消息 ...
        </span>
        <span v-else class="no-more"> 没有更多消息了 </span>
      </div>

      <div class="message-item" v-for="(item, index) in records" :key="item.id">
        <!-- 群消息 -->
        <div v-if="item.msg_type == 9" class="message-box">
          <invite-message :invite="item.invite" @user-info="onUserInfo" />
        </div>

        <!-- 撤回消息 -->
        <div v-else-if="item.is_revoke == 1" class="message-box">
          <revoke-message
            :login_uid="uid"
            :user_id="item.user_id"
            :nickname="item.nickname"
            :talk_type="item.talk_type"
            :datetime="item.created_at"
          />
        </div>

        <!-- 系统消息 -->
        <div v-else-if="item.msg_type == 0" class="message-box">
          <system-text-message :content="item.content" />
        </div>

        <div
          v-else
          class="message-box record-box"
          :class="{
            'direction-rt': item.float == 'right',
            'multi-select': dialogueStore.isOpenMultiSelect,
            'multi-select-check': item.isCheck,
          }"
        >
          <!-- 多选按钮 -->
          <aside v-if="dialogueStore.isOpenMultiSelect" class="checkbox-column">
            <n-icon
              size="18"
              :color="item.isCheck ? 'rgb(80 138 254)' : '#ccc'"
              class="pointer"
              :component="CheckmarkCircleSharp"
              @click="item.isCheck = !item.isCheck"
            />
          </aside>

          <!-- 头像信息 -->
          <aside class="avatar-column">
            <n-avatar
              round
              size="small"
              :src="item.avatar"
              :fallback-src="defAvatar"
            />
          </aside>

          <!-- 主体信息 -->
          <main class="main-column">
            <div
              class="talk-title"
              :class="{ show: talk_type == 2 && item.float == 'left' }"
            >
              <span v-show="talk_type == 2 && item.float == 'left'">{{
                item.friend_remarks || item.nickname
              }}</span>
              <span>
                {{ parseTime(item.created_at, '{m}/{d} {h}:{i}') }}
              </span>
            </div>

            <div
              class="talk-content"
              :class="{ pointer: dialogueStore.isOpenMultiSelect }"
              @click="onRowClick(item)"
            >
              <!-- 文本消息 -->
              <text-message
                v-if="item.msg_type == 1"
                :content="item.content"
                :float="item.float"
                :talk_type="talk_type"
                style="max-width: 600px"
                @contextmenu.prevent="onContextMenu($event, item)"
              />

              <!-- 图片消息 -->
              <image-message
                v-else-if="
                  item.msg_type == 2 && item.file && item.file.type == 1
                "
                :src="item.file.url"
                :float="item.float"
                @contextmenu.prevent="onContextMenu($event, item)"
              />

              <!-- 音频文件预留 -->
              <audio-message
                v-else-if="
                  item.msg_type == 2 && item.file && item.file.type == 2
                "
                :src="item.file.url"
                @contextmenu.prevent="onContextMenu($event, item)"
              />

              <!-- 文件消息 -->
              <file-message
                v-else-if="
                  item.msg_type == 2 && item.file && item.file.type == 4
                "
                :file-name="item.file.original_name"
                :size="item.file.size"
                :ext="item.file.suffix"
                :record-id="item.id"
                @contextmenu.prevent="onContextMenu($event, item)"
              />

              <!-- 会话记录消息 -->
              <forward-message
                v-else-if="item.msg_type == 3"
                :record-id="item.id"
                :records="item.forward.list"
                :num="item.forward.num"
                @contextmenu.prevent="onContextMenu($event, item)"
              />

              <!-- 代码块消息 -->
              <code-message
                v-else-if="item.msg_type == 4"
                :code="item.code_block.code"
                :lang="item.code_block.lang"
                @contextmenu.prevent="onContextMenu($event, item)"
              />

              <!-- 投票消息 -->
              <vote-message
                v-else-if="item.msg_type == 5"
                :title="item.vote.detail.title"
                :mode="item.vote.detail.answer_mode"
                :options="item.vote.detail.answer_option"
                :statistics="item.vote.statistics"
                :answer_num="item.vote.detail.answer_num"
                :answered_num="item.vote.detail.answered_num"
                :vote_users="item.vote.vote_users"
                :record_id="item.id"
                :user_id="uid"
                @contextmenu.prevent="onContextMenu($event, item)"
              />

              <!-- 登录消息 -->
              <login-message
                v-else-if="item.msg_type == 8"
                :ip="item.login.ip || ''"
                :address="item.login.address"
                :datetime="item.login.created_at"
                :reason="item.login.reason"
                :platform="item.login.agent"
                @contextmenu.prevent="onContextMenu($event, item)"
              />

              <p v-else>未知消息</p>

              <!-- 预留 -->
              <div
                v-if="talk_type == 1 && item.float == 'right'"
                class="read-status"
              >
                <n-icon
                  v-if="item.is_read"
                  size="18"
                  color="#65c468"
                  :component="CheckmarkCircleOutline"
                />
                <span v-else>未读</span>

                <!-- {{ item.is_read ? '已读' : '已送达' }} -->
              </div>
            </div>
          </main>
        </div>

        <div class="datetime" v-show="isShowTalkTime(index, item.created_at)">
          {{ formatTime(item.created_at) }}
        </div>
      </div>
    </div>

    <!-- 新消息提示 -->
    <div
      class="unread-bubble pointer"
      :class="{
        show: dialogueStore.unreadBubble,
      }"
      @click="onSkipBottom"
    >
      <n-icon size="18" color="#fff" :component="NotificationsOutline" />
      <span>{{ dialogueStore.unreadBubble }}条新消息，请注意查看！</span>
    </div>

    <!-- 置底按钮 -->
    <div
      class="skip-bottom pointer"
      :class="{ show: state.skipBottom }"
      @click="onSkipBottom"
    >
      <n-icon size="14" color="#fff" :component="CaretDownSharp" />
      <span>回</span>
      <span>到</span>
      <span>底</span>
      <span>部</span>
    </div>
  </section>

  <!-- 右键菜单 -->
  <n-dropdown
    :show="state.dropdown.show"
    :x="state.dropdown.dropdownX"
    :y="state.dropdown.dropdownY"
    :options="state.dropdown.options"
    @select="onContextMenuHandle"
    @clickoutside="
      () => {
        state.dropdown.show = false
        state.dropdown.item = {}
      }
    "
  />
</template>

<style lang="less" scoped>
.section {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;

  .unread-bubble {
    position: absolute;
    left: -300px;
    bottom: 20px;
    min-width: 100px;
    height: 35px;
    background-color: #1ebafc;
    border-radius: 0 20px 20px 0;
    display: flex;
    align-items: center;
    padding: 0 15px;
    color: #ffffff;
    transition: left 1s ease-in-out;

    span {
      margin-left: 5px;
    }

    &.show {
      left: 0px;
    }
  }

  .skip-bottom {
    position: absolute;
    right: -30px;
    top: 15%;
    width: 30px;
    height: 100px;
    font-size: 12px;
    background-color: #1ebafc;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    transition: right 1s ease-in-out;

    &.show {
      right: 0px;
    }
  }
}

.me-scrollbar {
  &::-webkit-scrollbar {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #c0bebc;
  }
}

.talk-container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 15px 30px;
  overflow-y: auto;
  overflow-x: hidden;

  .load-toolbar {
    height: 38px;
    color: #409eff;
    text-align: center;
    line-height: 38px;
    font-size: 13px;
    .no-more {
      color: #b9b3b3;
    }
  }

  .message-box {
    width: 100%;
    min-height: 30px;
    margin-bottom: 5px;
  }

  .datetime {
    height: 30px;
    line-height: 30px;
    color: #ccc9c9;
    font-size: 12px;
    text-align: center;
    margin: 5px 0;
  }

  .record-box {
    display: flex;
    flex-direction: row;
    transition: 0.5s ease;

    .checkbox-column {
      display: flex;
      justify-content: center;
      flex-basis: 40px;
      flex-shrink: 0;
      order: 1;
      user-select: none;
      padding-top: 25px;
    }

    .avatar-column {
      width: 40px;
      flex-basis: 40px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      order: 2;
      user-select: none;
      padding-top: 26px;
      flex-direction: column;
    }

    .main-column {
      flex: 1 auto;
      order: 3;
      position: relative;
      box-sizing: border-box;
      padding: 5px;
      overflow: hidden;
      min-height: 30px;

      .talk-title {
        display: flex;
        align-items: center;
        height: 15px;
        margin-bottom: 2px;
        font-size: 12px;
        user-select: none;
        color: #a7a0a0;
        transition: 0.5s ease;
        opacity: 0;
        // margin-left: -5px;

        &.show {
          opacity: 1;
        }

        span {
          transform: scale(0.88);
          transform-origin: left center;
        }
      }

      .talk-content {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        box-sizing: border-box;
        width: 100%;

        .read-status {
          display: flex;
          margin: 0 8px;
          color: #a79e9e;
          font-size: 12px;
        }
      }

      &:hover {
        .talk-title {
          opacity: 1;
        }
      }
    }

    &.direction-rt {
      .avatar-column {
        order: 3;
      }

      .main-column {
        order: 2;

        .talk-title {
          justify-content: flex-end;

          span {
            transform-origin: right center;
          }
        }

        .talk-content {
          flex-direction: row-reverse;
        }
      }
    }

    &.multi-select {
      border-radius: 5px;

      &:hover,
      &.multi-select-check {
        background-color: #ececec;
      }
    }
  }
}
</style>
