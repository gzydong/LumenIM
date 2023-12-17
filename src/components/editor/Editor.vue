<script lang="ts" setup>
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'quill-image-uploader/dist/quill.imageUploader.min.css'
import '@/assets/css/editor-mention.less'
import { reactive, watch, ref, markRaw, computed, onMounted, onUnmounted } from 'vue'
import { NPopover } from 'naive-ui'
import {
  Voice as IconVoice,
  SourceCode,
  Local,
  SmilingFace,
  Pic,
  FolderUpload,
  Ranking,
  History
} from '@icon-park/vue-next'
import { QuillEditor, Quill } from '@vueup/vue-quill'
import ImageUploader from 'quill-image-uploader'
import EmojiBlot from './formats/emoji'
import QuoteBlot from './formats/quote'
import 'quill-mention'
import { useDialogueStore, useEditorDraftStore } from '@/store'
import { deltaToMessage, deltaToString, isEmptyDelta } from './util'
import { getImageInfo } from '@/utils/functions'
import { EditorConst } from '@/constant/event-bus'
import { emitCall } from '@/utils/common'
import { defAvatar } from '@/constant/default'
import MeEditorVote from './MeEditorVote.vue'
import MeEditorEmoticon from './MeEditorEmoticon.vue'
import MeEditorCode from './MeEditorCode.vue'
import MeEditorRecorder from './MeEditorRecorder.vue'
import { ServeUploadImage } from '@/api/upload'
import { useEventBus } from '@/hooks'

Quill.register('formats/emoji', EmojiBlot)
Quill.register('formats/quote', QuoteBlot)
Quill.register('modules/imageUploader', ImageUploader)

const emit = defineEmits(['editor-event'])
const dialogueStore = useDialogueStore()
const editorDraftStore = useEditorDraftStore()
const props = defineProps({
  vote: {
    type: Boolean,
    default: false
  },
  members: {
    default: () => []
  }
})

const editor = ref()

const getQuill = () => {
  return editor.value?.getQuill()
}

const getQuillSelectionIndex = () => {
  let quill = getQuill()

  return (quill.getSelection() || {}).index || quill.getLength()
}

const indexName = computed(() => dialogueStore.index_name)
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
      matchers: [[Node.ELEMENT_NODE, onClipboardMatcher]]
    },

    keyboard: {
      bindings: {
        enter: {
          key: 13,
          handler: onSendMessage
        }
      }
    },

    imageUploader: {
      upload: onEditorUpload
    },

    mention: {
      allowedChars: /^[\u4e00-\u9fa5]*$/,
      mentionDenotationChars: ['@'],
      positioningStrategy: 'fixed',
      renderItem: (data: any) => {
        const el = document.createElement('div')
        el.className = 'ed-member-item'
        el.innerHTML = `<img src="${data.avatar}" class="avator"/>`
        el.innerHTML += `<span class="nickname">${data.nickname}</span>`
        return el
      },
      source: function (searchTerm: string, renderList: any) {
        if (!props.members.length) {
          return renderList([])
        }

        let list = [
          { id: 0, nickname: '所有人', avatar: defAvatar, value: '所有人' },
          ...props.members
        ]

        const items = list.filter(
          (item: any) => item.nickname.toLowerCase().indexOf(searchTerm) !== -1
        )

        renderList(items)
      },
      mentionContainerClass: 'ql-mention-list-container me-scrollbar me-scrollbar-thumb'
    }
  },
  placeholder: '按Enter发送 / Shift+Enter 换行',
  theme: 'snow'
}

const navs = reactive([
  {
    title: '图片',
    icon: markRaw(Pic),
    show: true,
    click: () => {
      fileImageRef.value.click()
    }
  },
  {
    title: '附件',
    icon: markRaw(FolderUpload),
    show: true,
    click: () => {
      uploadFileRef.value.click()
    }
  },
  {
    title: '代码',
    icon: markRaw(SourceCode),
    show: true,
    click: () => {
      isShowEditorCode.value = true
    }
  },
  {
    title: '语音消息',
    icon: markRaw(IconVoice),
    show: true,
    click: () => {
      isShowEditorRecorder.value = true
    }
  },
  {
    title: '地理位置',
    icon: markRaw(Local),
    show: true,
    click: () => {}
  },
  {
    title: '群投票',
    icon: markRaw(Ranking),
    show: computed(() => props.vote),
    click: () => {
      isShowEditorVote.value = true
    }
  },
  {
    title: '历史记录',
    icon: markRaw(History),
    show: true,
    click: () => {
      emit('editor-event', emitCall('history_event'))
    }
  }
])

function onUploadImage(file: File) {
  return new Promise((resolve) => {
    let image = new Image()
    image.src = URL.createObjectURL(file)
    image.onload = () => {
      const form = new FormData()
      form.append('file', file)
      form.append('width', image.width.toString())
      form.append('height', image.height.toString())

      ServeUploadImage(form).then(({ code, data, message }) => {
        if (code == 200) {
          resolve(data.src)
        } else {
          resolve('')
          window['$message'].error(message)
        }
      })
    }
  })
}

function onEditorUpload(file: File) {
  async function fn(file: File, resolve: Function, reject: Function) {
    if (file.type.indexOf('image/') === 0) {
      return resolve(await onUploadImage(file))
    }

    reject()

    if (file.type.indexOf('video/') === 0) {
      let fn = emitCall('video_event', file, () => {})
      emit('editor-event', fn)
    } else {
      let fn = emitCall('file_event', file, () => {})
      emit('editor-event', fn)
    }
  }

  return new Promise((resolve, reject) => {
    fn(file, resolve, reject)
  })
}

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
    let index = getQuillSelectionIndex()

    if (index == 1 && quill.getLength() == 1 && quill.getText(0, 1) == '\n') {
      quill.deleteText(0, 1)
      index = 0
    }

    if (data.img) {
      quill.insertEmbed(index, 'emoji', {
        alt: data.value,
        src: data.img,
        width: '24px',
        height: '24px'
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

async function onUploadFile(e: any) {
  let file = e.target.files[0]

  e.target.value = null

  if (file.type.indexOf('image/') === 0) {
    const quill = getQuill()
    let index = getQuillSelectionIndex()

    if (index == 1 && quill.getLength() == 1 && quill.getText(0, 1) == '\n') {
      quill.deleteText(0, 1)
      index = 0
    }

    let src = await onUploadImage(file)
    if (src) {
      quill.insertEmbed(index, 'image', src)
      quill.setSelection(index + 1)
    }

    return
  }

  if (file.type.indexOf('video/') === 0) {
    let fn = emitCall('video_event', file, () => {})
    emit('editor-event', fn)
  } else {
    let fn = emitCall('file_event', file, () => {})
    emit('editor-event', fn)
  }
}

function onRecorderEvent(file: any) {
  emit('editor-event', emitCall('file_event', file))
  isShowEditorRecorder.value = false
}

function onClipboardMatcher(node: any, Delta) {
  const ops: any[] = []

  Delta.ops.forEach((op) => {
    // 如果粘贴了图片，这里会是一个对象，所以可以这样处理
    if (op.insert && typeof op.insert === 'string') {
      ops.push({
        insert: op.insert, // 文字内容
        attributes: {} //文字样式（包括背景色和文字颜色等）
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

  if (data.items.length === 0) {
    return
  }

  switch (data.msgType) {
    case 1: // 文字消息
      if (data.items[0].content.length > 1024) {
        return window['$message'].info('发送内容超长，请分条发送')
      }

      emit(
        'editor-event',
        emitCall('text_event', data, (ok: any) => {
          ok && getQuill().setContents([], Quill.sources.USER)
        })
      )
      break
    case 3: // 图片消息
      emit(
        'editor-event',
        emitCall(
          'image_event',
          { ...getImageInfo(data.items[0].content), url: data.items[0].content, size: 10000 },
          (ok: any) => {
            ok && getQuill().setContents([])
          }
        )
      )
      break
    case 12: // 图文消息
      emit(
        'editor-event',
        emitCall('mixed_event', data, (ok: any) => {
          ok && getQuill().setContents([])
        })
      )
      break
  }
}

function onEditorChange() {
  let delta = getQuill().getContents()

  let text = deltaToString(delta)

  if (!isEmptyDelta(delta)) {
    editorDraftStore.items[indexName.value || ''] = JSON.stringify({
      text: text,
      ops: delta.ops
    })
  } else {
    // 删除 editorDraftStore.items 下的元素
    delete editorDraftStore.items[indexName.value || '']
  }

  emit('editor-event', emitCall('input_event', text))
}

function loadEditorDraftText() {
  if (!editor.value) return

  // 这里延迟处理，不然会有问题
  setTimeout(() => {
    hideMentionDom()

    const quill = getQuill()

    if (!quill) return

    // 从缓存中加载编辑器草稿
    let draft = editorDraftStore.items[indexName.value || '']
    if (draft) {
      quill.setContents(JSON.parse(draft)?.ops || [])
    } else {
      quill.setContents([])
    }

    const index = getQuillSelectionIndex()
    quill.setSelection(index, 0, 'user')
  }, 0)
}

function onSubscribeMention(data: any) {
  const mention = getQuill().getModule('mention')

  mention.insertItem({ id: data?.id, denotationChar: '@', value: data.value }, true)
}

function onSubscribeQuote(data: any) {
  const delta = getQuill().getContents()
  if (delta.ops?.some((item: any) => item.insert.quote)) {
    return
  }

  const quill = getQuill()
  const index = getQuillSelectionIndex()

  quill.insertEmbed(0, 'quote', data)
  quill.setSelection(index + 1, 0, 'user')
}

function hideMentionDom() {
  let el = document.querySelector('.ql-mention-list-container')
  if (el) {
    document.querySelector('body')?.removeChild(el)
  }
}

watch(indexName, loadEditorDraftText, { immediate: true })

onMounted(() => {
  loadEditorDraftText()
})

onUnmounted(() => {
  hideMentionDom()
})

useEventBus([
  { name: EditorConst.Mention, event: onSubscribeMention },
  { name: EditorConst.Quote, event: onSubscribeQuote }
])
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
            style="width: 500px; height: 250px; border-radius: 10px; overflow: hidden"
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
    <input type="file" ref="fileImageRef" accept="image/*" @change="onUploadFile" />
    <input type="file" ref="uploadFileRef" @change="onUploadFile" />
  </form>

  <MeEditorVote v-if="isShowEditorVote" @close="isShowEditorVote = false" @submit="onVoteEvent" />

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
  --tip-bg-color: rgb(241 241 241 / 90%);

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
          background-color: var(--tip-bg-color);
          color: var(--im-text-color);
          min-width: 20px;
          font-size: 12px;
          padding: 0 5px;
          border-radius: 2px;
          white-space: pre;
          user-select: none;
          z-index: 999999999999;
        }

        &:hover {
          .tip-title {
            display: block;
          }
        }
      }
    }
  }
}

html[theme-mode='dark'] {
  .editor {
    --tip-bg-color: #48484d;
  }
}
</style>

<style lang="less">
#editor {
  overflow: hidden;
}

.ql-editor {
  padding: 8px;

  &::-webkit-scrollbar {
    width: 3px;
    height: 3px;
    background-color: unset;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: transparent;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      background-color: var(--im-scrollbar-thumb);
    }
  }
}

.ql-editor.ql-blank::before {
  font-family:
    PingFang SC,
    Microsoft YaHei,
    'Alibaba PuHuiTi 2.0 45' !important;
  left: 8px;
}

.ql-snow .ql-editor img {
  max-width: 100px;
  border-radius: 3px;
  background-color: #48484d;
  margin: 0px 2px;
}

.image-uploading {
  display: flex;
  width: 100px;
  height: 100px;
  background: #f5f5f5;
  border-radius: 5px;

  img {
    filter: unset;
    display: none;
  }
}

.ed-emoji {
  background-color: unset !important;
}

.ql-editor.ql-blank::before {
  font-style: unset;
  color: #b8b3b3;
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
    display: flex;
    justify-content: space-between;

    .quote-card-remove {
      margin-right: 15px;
      font-size: 18px;
    }
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

html[theme-mode='dark'] {
  .ql-editor.ql-blank::before {
    color: #57575a;
  }

  .quote-card-content {
    background-color: var(--im-message-bg-color);
  }
}
</style>
