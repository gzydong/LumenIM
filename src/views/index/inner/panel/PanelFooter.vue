<script setup>
import { ref, onMounted } from 'vue'
import { useEditorStore } from '@/store/editor'
import { useTalkStore } from '@/store/talk'
import { useDialogueStore } from '@/store/dialogue'
import { useNotifyStore } from '@/store/notify'
import { useUploadsStore } from '@/store/uploads'
import socket from '@/socket'
import {
  ServeSendTalkText,
  ServeSendTalkImage,
  ServeSendVote,
  ServeSendEmoticon,
  ServeSendTalkCodeBlock,
} from '@/api/chat'
import { throttle } from '@/utils/common'
import Editor from '@/components/editor/Editor.vue'
import MultiSelectFooter from './MultiSelectFooter.vue'
import HistoryRecord from '@/components/talk/HistoryRecord.vue'

const talkStore = useTalkStore()
const editorStore = useEditorStore()
const notifyStore = useNotifyStore()
const uploadsStore = useUploadsStore()
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
  index_name: {
    type: String,
    default: '',
  },
  online: {
    type: Boolean,
    default: false,
  },
})

const isShowHistory = ref(false)

// 发送文本消息
const onSendTextEvent = throttle(value => {
  let { data, callBack } = value

  const res = ServeSendTalkText({
    receiver_id: props.receiver_id,
    talk_type: props.talk_type,
    text: data.text,
  })

  res.then(({ code, message }) => {
    if (code == 200) {
      talkStore.updateItem({
        index_name: props.index_name,
        draft_text: '',
      })

      let el = document.getElementById('talk-session-list')
      if (el) {
        // 对话列表滚动条置顶
        el.scrollTop = 0
      }

      callBack(true)
    } else {
      window['$message'].warning(message)
    }
  })

  res.catch(() => {
    window['$message'].warning('网络繁忙,请稍后重试！！！')
  })
}, 1000)

// 发送图片消息
const onSendImageEvent = ({ data, callBack }) => {
  let fileData = new FormData()

  fileData.append('talk_type', props.talk_type)
  fileData.append('receiver_id', props.receiver_id)
  fileData.append('image', data)

  const resp = ServeSendTalkImage(fileData)

  resp.then(res => {
    if (res.code == 200) {
      callBack(true)
    } else {
      window['$message'].info(res.message)
    }
  })
  resp.finally(() => callBack(false))
}

// 发送代码消息
const onSendCodeEvent = ({ data, callBack }) => {
  ServeSendTalkCodeBlock({
    receiver_id: props.receiver_id,
    talk_type: props.talk_type,
    code: data.code,
    lang: data.lang,
  }).then(({ code, message }) => {
    if (code == 200) {
      callBack(true)
    } else {
      window['$message'].warning(message)
    }
  })
}

// 发送文件消息
const onSendFileEvent = ({ data }) => {
  let maxsize = 100 * 1024 * 1024
  if (data.size > maxsize) {
    return window['$message'].info('上传文件不能超过100M！！！')
  }

  uploadsStore.initUploadFile(
    data,
    props.talk_type,
    props.receiver_id,
    dialogueStore.talk.username
  )
}

// 发送投票消息
const onSendVoteEvent = ({ data, callBack }) => {
  let response = ServeSendVote({
    receiver_id: props.receiver_id,
    mode: data.mode,
    anonymous: data.anonymous,
    title: data.title,
    options: data.options,
  })

  response.then(res => {
    callBack(true)
  })

  response.catch(() => {
    callBack(false)
  })
}

// 发送表情消息
const onSendEmoticonEvent = ({ data, callBack }) => {
  ServeSendEmoticon({
    receiver_id: props.receiver_id,
    talk_type: props.talk_type,
    emoticon_id: data,
  })

  callBack(true)
}

const onKeyboardPush = throttle(() => {
  socket.emit('im.message.keyboard', {
    sender_id: props.uid,
    receiver_id: props.receiver_id,
  })
}, 3000)

// 编辑器输入事件
const onInputEvent = ({ data }) => {
  talkStore.updateItem({
    index_name: props.index_name,
    draft_text: data,
  })

  // 判断对方是否在线和是否需要推送
  // 3秒时间内推送一次
  if (notifyStore.isKeyboard && props.online) {
    onKeyboardPush()
  }
}

// 注册事件
const evnets = {
  text_event: onSendTextEvent,
  image_event: onSendImageEvent,
  code_event: onSendCodeEvent,
  file_event: onSendFileEvent,
  input_event: onInputEvent,
  vote_event: onSendVoteEvent,
  emoticon_event: onSendEmoticonEvent,
  history_event: () => {
    isShowHistory.value = true
  },
}

// 编辑器事件
const onEditorEvent = msg => {
  evnets[msg.event] && evnets[msg.event](msg)
}

onMounted(() => {
  editorStore.loadUserEmoticon()
})
</script>

<template>
  <footer
    v-show="!dialogueStore.isOpenMultiSelect"
    class="el-footer"
    style="height: 200px"
  >
    <Editor @editor-event="onEditorEvent" :show_vote="talk_type == 2" />
  </footer>

  <footer
    v-if="dialogueStore.isOpenMultiSelect"
    class="el-footer"
    style="height: 200px"
  >
    <MultiSelectFooter />
  </footer>

  <HistoryRecord
    v-if="isShowHistory"
    :talk-type="talk_type"
    :receiver-id="receiver_id"
    @close="isShowHistory = false"
  />
</template>
