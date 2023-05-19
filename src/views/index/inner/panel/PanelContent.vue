<script setup lang="ts">
import {
  reactive,
  watch,
  computed,
  nextTick,
  onMounted,
  inject,
  ref,
} from 'vue'
import { NDropdown, NCheckbox } from 'naive-ui'
import { ExpandDownOne, Remind } from '@icon-park/vue-next'
import socket from '@/socket'
import { useDialogueStore } from '@/store/dialogue'
import { formatTime, parseTime } from '@/utils/datetime'
import { clipboard, htmlDecode } from '@/utils/common'
import { formatTalkRecord } from '@/utils/talk'
import { defAvatar } from '@/constant/default'
import { MessageComponents, ForwardableMessageType } from '@/constant/message'
import { ServeTalkRecords } from '@/api/chat'
import { useMenu } from './menu'

const { dropdown, showDropdownMenu, closeDropdownMenu } = useMenu()
const user = inject('showUserModal')
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

// 置底按钮
const skipBottom = ref(false)

// 加载会话记录
const onLoadTalk = () => {
  const data = {
    record_id: loadConfig.minRecord,
    receiver_id: props.receiver_id,
    talk_type: props.talk_type,
    limit: 30,
  }

  let scrollHeight = 0
  let el = document.getElementById('lumenChatPanel')
  if (el) {
    scrollHeight = el.scrollHeight
  }

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

    const records = res.data.items || []

    records.map((item: any) => formatTalkRecord(props.uid, item))

    // 判断是否是初次加载
    if (data.record_id == 0) {
      dialogueStore.clearDialogueRecord()
    }

    if (props.talk_type == 1) {
      onAfterRead(records)
    }

    dialogueStore.unshiftDialogueRecord(records.reverse())

    loadConfig.status = records.length >= res.data.limit ? 1 : 2
    loadConfig.minRecord = res.data.record_id

    nextTick(() => {
      if (!el) return

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

function onAfterRead(records: any) {
  let ids: number[] = []

  for (const record of records) {
    if (props.receiver_id === record.user_id && record.is_read === 0) {
      ids.push(record.id)
    }
  }

  if (ids.length) {
    socket.emit('im.message.read', {
      receiver_id: props.receiver_id,
      msg_id: ids,
    })
  }
}

// 是否显示消息时间
const isShowTalkTime = (index: number, datetime: string) => {
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
const onPanelScroll = (e: any) => {
  if (e.target.scrollTop == 0 && loadConfig.status == 1) {
    onLoadTalk()
  }

  const height = e.target.scrollTop + e.target.clientHeight

  skipBottom.value = height < e.target.scrollHeight - 200
  if (!skipBottom.value && dialogueStore.unreadBubble) {
    dialogueStore.setUnreadBubble(0)
  }
}

// 复制文本信息
const onCopyText = (data: any) => {
  if (!data.content) {
    return
  }

  clipboard(htmlDecode(data.content), () =>
    window['$message'].success('复制成功!')
  )
}

// 删除对话消息
const onDeleteTalk = (data: any) => {
  dialogueStore.ApiDeleteRecord([data.id])
}

// 撤销对话消息
const onRevokeTalk = (data: any) => {
  dialogueStore.ApiRevokeRecord(data.id)
}

// 多选事件
const onMultiSelect = (data: any) => {
  dialogueStore.isOpenMultiSelect = true
}

// 会话列表右键显示菜单
const onContextMenu = (e: any, item: any) => {
  if (!dialogueStore.isShowEditor || dialogueStore.isOpenMultiSelect) {
    return e.preventDefault()
  }

  showDropdownMenu(e, props.uid, item)

  e.preventDefault()
}

// 会话列表右键菜单回调事件
const onContextMenuHandle = (key: string) => {
  const evnets = {
    copy: onCopyText,
    revoke: onRevokeTalk,
    delete: onDeleteTalk,
    multiSelect: onMultiSelect,
  }

  // 触发事件
  evnets[key] && evnets[key](dropdown.item)

  closeDropdownMenu()
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

const onRowClick = (item: any) => {
  if (dialogueStore.isOpenMultiSelect) {
    if (ForwardableMessageType.includes(item.msg_type)) {
      item.isCheck = !item.isCheck
    } else {
      window['$message'].info('此类消息不支持转发！！！')
    }
  }
}

watch(props, onReload)

onMounted(onReload)
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

      <div
        class="message-item"
        v-for="(item, index) in records"
        :key="item.msg_id"
      >
        <!-- 系统消息 -->
        <div v-if="item.msg_type >= 1000" class="message-box">
          <component
            :is="MessageComponents[item.msg_type] || 'unknown-message'"
            :extra="item.extra"
            :data="item"
          />
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
            <n-checkbox
              size="small"
              :checked="item.isCheck"
              @update:checked="item.isCheck = !item.isCheck"
            />
          </aside>

          <!-- 头像信息 -->
          <aside class="avatar-column">
            <n-avatar
              round
              size="medium"
              class="pointer"
              :src="item.avatar"
              :fallback-src="defAvatar"
              @click="user(item.user_id)"
            />
          </aside>

          <!-- 主体信息 -->
          <main class="main-column">
            <div class="talk-title">
              <span
                class="nickname"
                v-show="talk_type == 2 && item.float == 'left'"
              >
                {{ item.nickname }}
              </span>
              <span>{{ parseTime(item.created_at, '{m}/{d} {h}:{i}') }}</span>
            </div>

            <div
              class="talk-content"
              :class="{ pointer: dialogueStore.isOpenMultiSelect }"
              @click="onRowClick(item)"
            >
              <component
                :is="MessageComponents[item.msg_type] || 'unknown-message'"
                :extra="item.extra"
                :data="item"
                :max-width="true"
                @contextmenu.prevent="onContextMenu($event, item)"
              />

              <div
                class="read-status"
                v-if="talk_type == 1 && item.float == 'right'"
              >
                {{ item.is_read ? '已读' : '已送达' }}
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
      <n-icon size="18" color="#fff" :component="Remind" />
      <span>{{ dialogueStore.unreadBubble }}条新消息，请注意查看！</span>
    </div>

    <!-- 置底按钮 -->
    <div
      class="skip-bottom pointer"
      :class="{ show: skipBottom }"
      @click="onSkipBottom"
    >
      <n-icon size="14" color="#fff" :component="ExpandDownOne" />
      <span>回</span>
      <span>到</span>
      <span>底</span>
      <span>部</span>
    </div>
  </section>

  <!-- 右键菜单 -->
  <n-dropdown
    :show="dropdown.show"
    :x="dropdown.x"
    :y="dropdown.y"
    :options="dropdown.options"
    @select="onContextMenuHandle"
    @clickoutside="closeDropdownMenu"
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
      padding-top: 15px;
    }

    .avatar-column {
      width: 40px;
      flex-basis: 40px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      order: 2;
      user-select: none;
      // padding-top: 23px;
      padding-top: 7px;
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
        opacity: 1;

        &.show {
          opacity: 1;
        }

        .nickname {
          font-weight: bold;
          color: #9e9e9e;
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
