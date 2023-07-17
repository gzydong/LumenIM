<script setup lang="ts">
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'quill-image-uploader/dist/quill.imageUploader.min.css'
import 'quill-mention/dist/quill.mention.min.css'
import { reactive, watch, ref, markRaw, computed, onMounted } from 'vue'
import { NPopover } from 'naive-ui'
import {
  Voice as IconVoice,
  SourceCode,
  Local,
  SmilingFace,
  Pic,
  FolderUpload,
  Ranking,
  History,
} from '@icon-park/vue-next'
import { QuillEditor, Quill } from '@vueup/vue-quill'
import ImageUploader from 'quill-image-uploader'
import 'quill-mention'
import { useDialogueStore, useEditorStore, useEditorDraftStore } from '@/store'
import { deltaToMessage, deltaToString } from './util.ts'
import { getImageInfo } from '@/utils/functions'
import { emitCall } from '@/utils/common'
import { defAvatar } from '@/constant/default'
import MeEditorVote from './MeEditorVote.vue'
import MeEditorEmoticon from './MeEditorEmoticon.vue'
import MeEditorCode from './MeEditorCode.vue'
import MeEditorRecorder from './MeEditorRecorder.vue'
import { ServeUploadImage } from '@/api/upload'

import EmojiBlot from './formats/emoji.ts'
import QuoteBlot from './formats/quote.ts'

Quill.register('formats/emoji', EmojiBlot)
Quill.register('formats/quote', QuoteBlot)
Quill.register('modules/imageUploader', ImageUploader)

const emit = defineEmits(['editor-event'])
const dialogueStore = useDialogueStore()
const editorStore = useEditorStore()
const editorDraftStore = useEditorDraftStore()
const props = defineProps({
  vote: {
    type: Boolean,
    default: false,
  },
  members: {
    default: () => [],
  },
})

const editor = ref()

const getQuill = () => {
  return editor.value.getQuill()
}

const indexName = computed(() => dialogueStore.index_name)
const quote = computed(() => editorStore.quote)
const isShowEditorVote = ref(false)
const isShowEditorCode = ref(false)
const isShowEditorRecorder = ref(false)
const fileImageRef = ref()
const uploadFileRef = ref()
const emoticonRef = ref()

const editorOption = {
  debug: false,
  modules: {
    toolbar: false,
    clipboard: {
      // 粘贴版，处理粘贴时候的自带样式
      matchers: [[Node.ELEMENT_NODE, onClipboardMatcher]],
    },

    keyboard: {
      bindings: {
        enter: {
          key: 13,
          handler: onSendMessage,
        },
      },
    },

    imageUploader: {
      upload: (file: File) => {
        const form = new FormData()
        form.append('file', file)

        return new Promise((resolve, reject) => {
          ServeUploadImage(form).then(({ code, data, message }) => {
            if (code == 200) {
              resolve(data.src)
            } else {
              reject(message)
              window['$message'].error(message)
            }
          })
        })
      },
    },

    mention: {
      allowedChars: /^[\u4e00-\u9fa5]*$/,
      mentionDenotationChars: ['@'],
      positioningStrategy: 'fixed',
      renderItem: (data: any) => {
        return `
              <div class="member-item">
                  <image src=${data.avatar} class="member-avator"/>
                  <span class="member-name">${data.nickname}</span>
              </div>
            `
      },
      source: function (searchTerm: string, renderList: any) {
        if (!props.members.length) {
          return renderList([])
        }

        let list = [
          { id: 0, nickname: '所有人', avatar: defAvatar, value: '所有人' },
          ...props.members,
        ]

        const items = list.filter(
          (item: any) => item.nickname.indexOf(searchTerm) !== -1
        )

        renderList(items)
      },
    },
  },
  placeholder: '你想要说点什么呢...',
  theme: 'snow',
}

const navs = reactive([
  {
    title: '图片',
    icon: markRaw(Pic),
    show: true,
    click: () => {
      fileImageRef.value.click()
    },
  },
  {
    title: '附件',
    icon: markRaw(FolderUpload),
    show: true,
    click: () => {
      uploadFileRef.value.click()
    },
  },
  {
    title: '代码',
    icon: markRaw(SourceCode),
    show: true,
    click: () => {
      isShowEditorCode.value = true
    },
  },
  {
    title: '语音消息',
    icon: markRaw(IconVoice),
    show: true,
    click: () => {
      isShowEditorRecorder.value = true
    },
  },
  {
    title: '地理位置',
    icon: markRaw(Local),
    show: true,
    click: () => {},
  },
  {
    title: '群投票',
    icon: markRaw(Ranking),
    show: computed(() => props.vote),
    click: () => {
      isShowEditorVote.value = true
    },
  },
  {
    title: '历史记录',
    icon: markRaw(History),
    show: true,
    click: () => {
      emit('editor-event', emitCall('history_event'))
    },
  },
])

function onVoteEvent(data: any) {
  const msg = emitCall('vote_event', data, (ok: boolean) => {
    if (ok) {
      isShowEditorVote.value = false
    }
  })

  emit('editor-event', msg)
}

function onEmoticonEvent(data: any) {
  emoticonRef.value.setShow(false)

  if (data.type == 1) {
    const quill = getQuill()
    const index = (quill.getSelection() || {}).index || quill.getLength()

    if (data.img) {
      quill.insertEmbed(index, 'emoji', {
        alt: data.value,
        src: data.img,
        width: '24px',
        height: '24px',
      })
    } else {
      quill.insertText(index, data.value)
    }

    quill.setSelection(index + 1, 0, 'user')
  } else {
    let fn = emitCall('emoticon_event', data.value, () => {})
    emit('editor-event', fn)
  }
}

function onCodeEvent(data: any) {
  const msg = emitCall('code_event', data, (ok: boolean) => {
    isShowEditorCode.value = false
  })

  emit('editor-event', msg)
}

function onUploadFile(e: any) {
  let file = e.target.files[0]

  e.target.value = null

  if (/\.(gif|jpg|jpeg|png|webp|GIF|JPG|PNG|WEBP)$/.test(file.name)) {
    const quill = getQuill()
    const index = (quill.getSelection() || {}).index || quill.getLength()

    const form = new FormData()
    form.append('file', file)

    ServeUploadImage(form).then(({ code, data, message }) => {
      if (code == 200) {
        quill.insertEmbed(index, 'image', data.src)
        quill.setSelection(index + 1)
      } else {
        window['$message'].error(message)
      }
    })

    return
  }

  let fn = emitCall('file_event', file, () => {})
  emit('editor-event', fn)
}

function onRecorderEvent(file: any) {
  emit('editor-event', emitCall('file_event', file))
  isShowEditorRecorder.value = false
}

function onClipboardMatcher(node, Delta) {
  const ops: any[] = []

  Delta.ops.forEach(op => {
    // 如果粘贴了图片，这里会是一个对象，所以可以这样处理
    if (op.insert && typeof op.insert === 'string') {
      ops.push({
        insert: op.insert, // 文字内容
        attributes: {}, //文字样式（包括背景色和文字颜色等）
      })
    } else {
      ops.push(op)
    }
  })

  Delta.ops = ops
  return Delta
}

function onSendMessage() {
  var delta = getQuill().getContents()
  let data = deltaToMessage(delta)

  switch (data.msgType) {
    case 1: // 文字消息
      if (data.items[0].content.length > 1024) {
        return window['$message'].info('发送内容超长，请分条发送')
      }

      let event = emitCall(
        'text_event',
        { text: data.items[0].content, uids: data.mentionUids },
        (ok: any) => {
          getQuill().setContents([])
        }
      )

      emit('editor-event', event)
      break
    case 3: // 图片消息
      let detail = getImageInfo(data.items[0].content)

      emit(
        'editor-event',
        emitCall(
          'image_event',
          { ...detail, url: data.items[0].content, size: 10000 },
          (ok: any) => {
            getQuill().setContents([])
          }
        )
      )
      break
    case 12: // 图文消息
      emit(
        'editor-event',
        emitCall('mixed_event', { items: data.items }, (ok: any) => {
          getQuill().setContents([])
        })
      )
      break
  }
}

function onEditorChange() {
  let delta = getQuill().getContents()

  let text = deltaToString(delta)

  editorDraftStore.items[indexName.value || ''] = JSON.stringify({
    text: text,
    ops: delta.ops,
  })

  emit('editor-event', emitCall('input_event', text))
}

function onWatchQuote(o: any) {
  if (!(o && o.id > 0)) return

  let delta = getQuill().getContents()

  for (let index = 0; index < delta.ops.length; index++) {
    if (delta.ops[index].insert.quote) return
  }

  const quill = getQuill()
  const index = (quill.getSelection() || {}).index || quill.getLength()

  quill.insertEmbed(0, 'quote', o)
  quill.setSelection(index + 1, 0, 'user')
  editorStore.quote = null
}

function loadEditorDraftText() {
  if (!editor.value) return

  const quill = getQuill()

  // 这里延迟处理，不然会有问题
  setTimeout(() => {
    // 从缓存中加载编辑器草稿
    let draft = editorDraftStore.items[indexName.value || '']

    if (draft) {
      quill.setContents(JSON.parse(draft))
    } else {
      quill.setContents([])
    }

    const index = (quill.getSelection() || {}).index || quill.getLength()
    quill.setSelection(index, 0, 'user')
  }, 100)
}

watch(indexName, loadEditorDraftText, { immediate: true })
watch(quote, onWatchQuote, { immediate: true })

onMounted(() => {
  loadEditorDraftText()
})
</script>

<template>
  <section class="el-container editor">
    <section class="el-container is-vertical">
      <header class="el-header toolbar bdr-t">
        <div class="tools">
          <n-popover
            placement="top-start"
            trigger="click"
            raw
            :show-arrow="false"
            :width="300"
            ref="emoticonRef"
            style="
              width: 500px;
              height: 250px;
              border-radius: 10px;
              overflow: hidden;
            "
          >
            <template #trigger>
              <div class="item pointer">
                <n-icon size="18" class="icon" :component="SmilingFace" />
                <p class="tip-title">表情符号</p>
              </div>
            </template>

            <MeEditorEmoticon @on-select="onEmoticonEvent" />
          </n-popover>

          <div
            class="item pointer"
            v-for="nav in navs"
            :key="nav.title"
            v-show="nav.show"
            @click="nav.click"
          >
            <n-icon size="18" class="icon" :component="nav.icon" />
            <p class="tip-title">{{ nav.title }}</p>
          </div>
        </div>
      </header>

      <main class="el-main height100">
        <QuillEditor
          ref="editor"
          id="editor"
          :options="editorOption"
          @editorChange="onEditorChange"
          style="height: 100%; border: none"
        />
      </main>
    </section>
  </section>

  <form enctype="multipart/form-data" style="display: none">
    <input
      type="file"
      ref="fileImageRef"
      accept="image/*"
      @change="onUploadFile"
    />
    <input type="file" ref="uploadFileRef" @change="onUploadFile" />
  </form>

  <MeEditorVote
    v-if="isShowEditorVote"
    @close="isShowEditorVote = false"
    @submit="onVoteEvent"
  />

  <MeEditorCode
    v-if="isShowEditorCode"
    @on-submit="onCodeEvent"
    @close="isShowEditorCode = false"
  />

  <MeEditorRecorder
    v-if="isShowEditorRecorder"
    @on-submit="onRecorderEvent"
    @close="isShowEditorRecorder = false"
  />
</template>

<style lang="less" scoped>
.editor {
  height: 100%;

  .toolbar {
    height: 38px;
    display: flex;

    .tools {
      height: 100%;
      flex: auto;
      display: flex;

      .item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 35px;
        margin: 0 2px;
        position: relative;
        user-select: none;

        .tip-title {
          display: none;
          position: absolute;
          top: 40px;
          left: 0px;
          line-height: 26px;
          background-color: rgb(241 241 241 / 90%);
          color: #484848;
          min-width: 20px;
          font-size: 12px;
          padding: 0 5px;
          border-radius: 2px;
          white-space: pre;
          user-select: none;
          z-index: 999999999999;
        }

        &:hover {
          // background-color: #f5f5f5;

          .tip-title {
            display: block;
          }
        }
      }
    }
  }
}

:global(.ql-editor) {
  padding: 8px;
}

:global(.ql-editor.ql-blank::before) {
  font-family: PingFang SC, Microsoft YaHei, 'Alibaba PuHuiTi 2.0 45' !important;
  left: 8px;
}

:global(.ql-snow .ql-editor img) {
  max-width: 80px;
  border-radius: 3px;
  background-color: #ccc;
  margin: 0px 2px;
}

:global(.image-uploading) {
  display: flex;
  width: 100px;
  height: 100px;
  background: #f5f5f5;
  border-radius: 5px;
}

:global(.image-uploading img) {
  filter: unset;
  display: none;
}
</style>

<style lang="less">
.ed-emoji {
  background-color: unset !important;
}

.ql-editor.ql-blank::before {
  font-style: unset;
  color: var(--im-text-color);
}

.ql-mention-list-container {
  width: 160px;
  max-height: 200px;
  overflow-y: auto;
  border-radius: 6px;

  &::-webkit-scrollbar {
    width: 3px;
    height: 3px;
    background-color: #e4e4e5;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #c0bebc;
  }

  .ql-mention-list-item {
    padding: 0 10px;
    overflow: hidden;

    &.selected {
      background-color: #508afe;
      color: #fff;
      text-decoration: none;
    }
  }
}

.mention {
  color: #409eff;
  background-color: transparent;
}

.member-item {
  height: 35px;
  display: flex;
  align-items: center;

  img {
    height: 20px;
    width: 20px;
    border-radius: 50%;
  }

  .member-name {
    margin-left: 5px;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.quote-card-content {
  display: flex;
  background-color: #f6f6f6;
  flex-direction: column;
  padding: 8px;
  margin-bottom: 5px;
  cursor: pointer;
  user-select: none;

  .quote-card-title {
    height: 22px;
    line-height: 22px;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .quote-card-meta {
    margin-top: 4px;
    font-size: 12px;
    line-height: 20px;
    color: #999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

html[data-theme='dark'] {
  .ql-mention-list-container {
    background-color: var(--im-message-bg-color);
    color: #fff;
    border: unset;
    box-shadow: 5px 1px 10px #181818;

    .ql-mention-list-item {
      &.selected {
        background-color: #1f1f23;
      }
    }
  }

  .quote-card-content {
    background-color: var(--im-message-bg-color);
  }
}
</style>
./util.ts
