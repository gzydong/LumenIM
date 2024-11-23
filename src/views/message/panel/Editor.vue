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
import { toApi } from '@/api'
import { ServeGroupVoteCreate } from '@/api/group'
import { throttle } from '@/utils/common'
import { getVideoImage } from '@/utils/file'
import Editor from '@/components/editor/Editor.vue'
import HistoryRecord from '@/components/mechat/HistoryRecord.vue'
import { ServeUploadImage } from '@/api/upload'
import { bus } from '@/utils'
import { useInject } from '@/hooks'

const { message } = useInject()
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

const onSendMessage = async (data = {}): Promise<boolean> => {
  const params = {
    ...data,
    talk_mode: props.talkMode,
    to_from_id: props.toFromId
  }

  const { code } = await toApi(ServePublishMessage, params)
  return code == 200
}

// 发送文本消息
const onSendTextEvent = (data: any): Promise<boolean> => {
  return onSendMessage({
    type: 'text',
    quote_id: data.quoteId,
    body: {
      text: data.items[0].content,
      mentions: data.mentionUids
    }
  })
}

// 发送图片消息
const onSendImageEvent = (data: any): Promise<boolean> => {
  return onSendMessage({
    type: 'image',
    body: { ...data }
  })
}

// 发送图片消息
const onSendVideoEvent = async (data: any) => {
  const resp = await getVideoImage(data)

  const coverForm = new FormData()
  coverForm.append('file', resp.file)

  const cover = await toApi(ServeUploadImage, coverForm)
  if (cover.code != 200) return false

  const form = new FormData()
  form.append('file', data)

  const video = await toApi(ServeUploadImage, form)
  if (video.code != 200) return false

  return await onSendMessage({
    type: 'video',
    body: {
      url: video.data.src,
      cover: cover.data.src,
      duration: parseInt(`${resp.duration}`),
      size: data.size
    }
  })
}

// 发送代码消息
const onSendCodeEvent = (data: any): Promise<boolean> => {
  return onSendMessage({
    type: 'code',
    body: {
      code: data.code,
      lang: data.lang
    }
  })
}

// 发送文件消息
const onSendFileEvent = async (data: any) => {
  let maxsize = 500 * 1024 * 1024
  if (data.size > maxsize) {
    message.warning('上传文件不能超过500M!')
    return true
  }

  uploadsStore.initUploadFile(data, props.talkMode, props.toFromId, dialogueStore.talk.username)
  return true
}

// 发送投票消息
const onSendVoteEvent = async (data: any) => {
  const { code } = await toApi(ServeGroupVoteCreate, {
    group_id: props.toFromId,
    mode: data.mode,
    is_anonymous: data.is_anonymous,
    title: data.title,
    options: data.options
  })

  return code == 200
}

// 发送表情消息
const onSendEmoticonEvent = (data: any): Promise<boolean> => {
  return onSendMessage({
    type: 'emoticon',
    body: {
      emoticon_id: data
    }
  })
}

const onSendMixedEvent = (data: any): Promise<boolean> => {
  return onSendMessage({
    type: 'mixed',
    quote_id: data.quoteId,
    body: {
      items: data.items
    }
  })
}

const onKeyboardPush = throttle(() => {
  ws.emit('im.message.keyboard', {
    to_from_id: props.toFromId
  })
}, 3000)

// 编辑器输入事件
const onInputEvent = async (data: any) => {
  talkStore.updateItem({
    index_name: props.indexName,
    draft_text: data
  })

  // 判断对方是否在线和是否需要推送
  // 3秒时间内推送一次
  if (settingsStore.isKeyboard && props.online) {
    onKeyboardPush()
  }

  return true
}

interface IEvent {
  [key: string]: (data: any) => Promise<boolean>
}

// 注册事件
const evnets: IEvent = {
  text_event: onSendTextEvent,
  image_event: onSendImageEvent,
  video_event: onSendVideoEvent,
  code_event: onSendCodeEvent,
  file_event: onSendFileEvent,
  input_event: onInputEvent,
  vote_event: onSendVoteEvent,
  emoticon_event: onSendEmoticonEvent,
  history_event: async () => {
    isShowHistory.value = true
    return false
  },
  mixed_event: onSendMixedEvent
}

onMounted(() => {
  editorStore.loadUserEmoticon()
})

const onNewEditorEvent = async (event: string, data: any) => {
  if (!evnets[event]) return false

  let ok = await evnets[event](data)
  if (ok) {
    !['history_event', 'input_event'].includes(event) && bus.emit('talk-session-scroll', { top: 0 })
  }

  return ok
}
</script>

<template>
  <footer class="el-footer height100">
    <Editor
      :index-name="indexName"
      :show-vote="talkMode == 2"
      :members="members"
      :callback="onNewEditorEvent"
    />
  </footer>

  <HistoryRecord
    v-if="isShowHistory"
    :talk-mode="talkMode"
    :to-from-id="toFromId"
    @close="isShowHistory = false"
  />
</template>

<style lang="less" scoped></style>
