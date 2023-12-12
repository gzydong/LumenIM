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
import { ServePublishMessage, ServeSendVote } from '@/api/chat'
import { throttle, getVideoImage } from '@/utils/common'
import Editor from '@/components/editor/Editor.vue'
import MultiSelectFooter from './MultiSelectFooter.vue'
import HistoryRecord from '@/components/talk/HistoryRecord.vue'
import { ServeUploadImage } from '@/api/upload'

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
  talk_type: {
    type: Number,
    default: 0
  },
  receiver_id: {
    type: Number,
    default: 0
  },
  index_name: {
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

const onSendMessage = (data = {}, callBack: any) => {
  let message = {
    ...data,
    receiver: {
      receiver_id: props.receiver_id,
      talk_type: props.talk_type
    }
  }

  ServePublishMessage(message)
    .then(({ code, message }) => {
      if (code == 200) {
        callBack(true)
      } else {
        window['$message'].warning(message)
      }
    })
    .catch(() => {
      window['$message'].warning('网络繁忙,请稍后重试!')
    })
}

// 发送文本消息
const onSendTextEvent = throttle((value: any) => {
  let { data, callBack } = value

  let message = {
    type: 'text',
    content: data.items[0].content,
    quote_id: data.quoteId,
    mentions: data.mentionUids
  }

  onSendMessage(message, (ok: boolean) => {
    if (!ok) return

    let el = document.getElementById('talk-session-list')
    el?.scrollTo({ top: 0, behavior: 'smooth' })

    callBack(true)
  })
}, 1000)

// 发送图片消息
const onSendImageEvent = ({ data, callBack }) => {
  onSendMessage({ type: 'image', ...data }, callBack)
}

// 发送图片消息
const onSendVideoEvent = async ({ data }) => {
  let resp = await getVideoImage(data)

  const coverForm = new FormData()
  coverForm.append('file', resp.file)

  let cover = await ServeUploadImage(coverForm)
  if (cover.code != 200) return

  const form = new FormData()
  form.append('file', data)

  let video = await ServeUploadImage(form)
  if (video.code != 200) return

  let message = {
    type: 'video',
    url: video.data.src,
    cover: cover.data.src,
    duration: parseInt(resp.duration),
    size: data.size
  }

  onSendMessage(message, () => {})
}

// 发送代码消息
const onSendCodeEvent = ({ data, callBack }) => {
  onSendMessage({ type: 'code', code: data.code, lang: data.lang }, callBack)
}

// 发送文件消息
const onSendFileEvent = ({ data }) => {
  let maxsize = 200 * 1024 * 1024
  if (data.size > maxsize) {
    return window['$message'].warning('上传文件不能超过100M!')
  }

  uploadsStore.initUploadFile(data, props.talk_type, props.receiver_id, dialogueStore.talk.username)
}

// 发送投票消息
const onSendVoteEvent = ({ data, callBack }) => {
  let response = ServeSendVote({
    receiver_id: props.receiver_id,
    mode: data.mode,
    anonymous: data.anonymous,
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
  onSendMessage({ type: 'emoticon', emoticon_id: data }, callBack)
}

const onSendMixedEvent = ({ data, callBack }) => {
  let message = {
    type: 'mixed',
    quote_id: data.quoteId,
    items: data.items
  }

  onSendMessage(message, callBack)
}

const onKeyboardPush = throttle(() => {
  ws.emit('im.message.keyboard', {
    sender_id: props.uid,
    receiver_id: props.receiver_id
  })
}, 3000)

// 编辑器输入事件
const onInputEvent = ({ data }) => {
  talkStore.updateItem({
    index_name: props.index_name,
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
}

onMounted(() => {
  editorStore.loadUserEmoticon()
})
</script>

<template>
  <footer class="el-footer">
    <MultiSelectFooter v-if="dialogueStore.isOpenMultiSelect" />
    <Editor v-else @editor-event="onEditorEvent" :vote="talk_type == 2" :members="members" />
  </footer>

  <HistoryRecord
    v-if="isShowHistory"
    :talk-type="talk_type"
    :receiver-id="receiver_id"
    @close="isShowHistory = false"
  />
</template>

<style lang="less">
.el-footer {
  height: inherit;
}
</style>
