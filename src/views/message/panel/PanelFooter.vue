<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import {
  useTalkStore,
  useDialogueStore,
  useSettingsStore,
  useUploadsStore,
  useEditorStore
} from '@/store'
import ws from '@/connect'
import { ServePublishMessage } from '@/api/chat'
import { ServeGroupVoteCreate } from '@/api/group'
import { throttle } from '@/utils/common'
import { getVideoImage } from '@/utils/file'
import Editor from '@/components/editor/Editor.vue'
import MultiSelectFooter from './MultiSelectFooter.vue'
import HistoryRecord from '@/components/talk/HistoryRecord.vue'
import { ServeUploadImage } from '@/api/upload'
import { toApi } from '@/api'
import { bus } from '@/utils/event-bus'

const talkStore = useTalkStore()
const editorStore = useEditorStore()
const settingsStore = useSettingsStore()
const uploadsStore = useUploadsStore()
const dialogueStore = useDialogueStore()
const props = defineProps({
  uid: {
    type: Number,
    default: 0
  },
  talkMode: {
    type: Number,
    default: 0
  },
  toFromId: {
    type: Number,
    default: 0
  },
  indexName: {
    type: String,
    default: ''
  },
  online: {
    type: Boolean,
    default: false
  },
  members: {
    default: () => []
  }
})

const isShowHistory = ref(false)

const onSendMessage = async (data = {}, callBack: any) => {
  const params = {
    ...data,
    talk_mode: props.talkMode,
    to_from_id: props.toFromId
  }

  const { code } = await toApi(ServePublishMessage, params)
  callBack(code == 200)
}

// 发送文本消息
const onSendTextEvent = throttle((value: any) => {
  const { data, callBack } = value

  const message = {
    type: 'text',
    quote_id: data.quoteId,
    body: {
      text: data.items[0].content,
      mentions: data.mentionUids
    }
  }

  onSendMessage(message, (ok: boolean) => {
    if (!ok) return

    callBack(true)
  })
}, 1000)

// 发送图片消息
const onSendImageEvent = ({ data, callBack }) => {
  const message = {
    type: 'image',
    body: { ...data }
  }

  onSendMessage(message, callBack)
}

// 发送图片消息
const onSendVideoEvent = async ({ data }) => {
  let resp = await getVideoImage(data)

  const coverForm = new FormData()
  coverForm.append('file', resp.file)

  const cover = await toApi(ServeUploadImage, coverForm)
  if (cover.code != 200) return

  const form = new FormData()
  form.append('file', data)

  const video = await toApi(ServeUploadImage, form)
  if (video.code != 200) return

  const message = {
    type: 'video',
    body: {
      url: video.data.src,
      cover: cover.data.src,
      duration: parseInt(resp.duration),
      size: data.size
    }
  }

  onSendMessage(message, () => {})
}

// 发送代码消息
const onSendCodeEvent = ({ data, callBack }) => {
  const message = {
    type: 'code',
    body: {
      code: data.code,
      lang: data.lang
    }
  }

  onSendMessage(message, callBack)
}

// 发送文件消息
const onSendFileEvent = ({ data }) => {
  let maxsize = 200 * 1024 * 1024
  if (data.size > maxsize) {
    return window['$message'].warning('上传文件不能超过100M!')
  }

  uploadsStore.initUploadFile(data, props.talkMode, props.toFromId, dialogueStore.talk.username)
}

// 发送投票消息
const onSendVoteEvent = ({ data, callBack }) => {
  let response = ServeGroupVoteCreate({
    group_id: props.toFromId,
    mode: data.mode,
    is_anonymous: data.is_anonymous,
    title: data.title,
    options: data.options
  })

  response.then(({ code, message }) => {
    if (code == 200) {
      callBack(true)
    } else {
      window['$message'].warning(message)
    }
  })

  response.catch(() => callBack(false))
}

// 发送表情消息
const onSendEmoticonEvent = ({ data, callBack }) => {
  const message = {
    type: 'emoticon',
    body: {
      emoticon_id: data
    }
  }

  onSendMessage(message, callBack)
}

const onSendMixedEvent = ({ data, callBack }) => {
  const message = {
    type: 'mixed',
    quote_id: data.quoteId,
    body: {
      items: data.items
    }
  }

  onSendMessage(message, callBack)
}

const onKeyboardPush = throttle(() => {
  ws.emit('im.message.keyboard', {
    to_from_id: props.toFromId
  })
}, 3000)

// 编辑器输入事件
const onInputEvent = ({ data }) => {
  talkStore.updateItem({
    index_name: props.indexName,
    draft_text: data
  })

  // 判断对方是否在线和是否需要推送
  // 3秒时间内推送一次
  if (settingsStore.isKeyboard && props.online) {
    onKeyboardPush()
  }
}

// 注册事件
const evnets = {
  text_event: onSendTextEvent,
  image_event: onSendImageEvent,
  video_event: onSendVideoEvent,
  code_event: onSendCodeEvent,
  file_event: onSendFileEvent,
  input_event: onInputEvent,
  vote_event: onSendVoteEvent,
  emoticon_event: onSendEmoticonEvent,
  history_event: () => {
    isShowHistory.value = true
  },
  mixed_event: onSendMixedEvent
}

// 编辑器事件
const onEditorEvent = (msg: any) => {
  evnets[msg.event] && evnets[msg.event](msg)

  !['history_event', 'input_event'].includes(msg.event) &&
    bus.emit('talk-session-scroll', { top: 0 })
}

onMounted(() => {
  editorStore.loadUserEmoticon()
})
</script>

<template>
  <footer class="el-footer">
    <MultiSelectFooter v-if="dialogueStore.isOpenMultiSelect" />
    <Editor v-else @editor-event="onEditorEvent" :vote="talkMode == 2" :members="members" />
  </footer>

  <HistoryRecord
    v-if="isShowHistory"
    :talk-mode="talkMode"
    :to-from-id="toFromId"
    @close="isShowHistory = false"
  />
</template>

<style lang="less">
.el-footer {
  height: inherit;
}
</style>
