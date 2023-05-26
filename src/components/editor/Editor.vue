<script setup lang="ts">
import { reactive, watch, ref, markRaw, computed, onMounted } from 'vue'
import { useDialogueStore, useEditorStore, useTalkStore } from '@/store'
import { NPopover } from 'naive-ui'
import Tribute from 'tributejs'
import 'tributejs/tribute.css'
import {
  Voice as IconVoice,
  SourceCode,
  Local,
  SmilingFace,
  Pic,
  FolderUpload,
  Ranking,
  History,
  TipsOne,
} from '@icon-park/vue-next'
import { emitCall } from '@/utils/common'
import MeEditorImage from './MeEditorImage.vue'
import MeEditorVote from './MeEditorVote.vue'
import MeEditorEmoticon from './MeEditorEmoticon.vue'
import MeEditorCode from './MeEditorCode.vue'
import MeEditorRecorder from './MeEditorRecorder.vue'
import {
  getPasteImgs,
  getDragPasteImg,
  pasteFilter,
  pasteUids,
} from '@/utils/editor'

const emit = defineEmits(['editor-event'])
const dialogueStore = useDialogueStore()
const editorStore = useEditorStore()
const talkStore = useTalkStore()
const props = defineProps({
  show_vote: {
    type: Boolean,
    default: false,
  },
})

const indexName = computed(() => dialogueStore.index_name)

const tribute = new Tribute({
  noMatchTemplate: () => '',
  selectTemplate: item => {
    return ` <span class="tribute-mention" data-atid="${item.original.id}" contenteditable="false">@${item.original.name}</span>`
  },
  requireLeadingSpace: false,
  lookup: 'name',
  values: (_, cb) => cb(editorStore.mentions),
})

const loadEditorDraftText = () => {
  const editor = document.getElementById('me-editor')
  if (!editor) return

  const talk = talkStore.findItem(dialogueStore.index_name)
  if (talk) {
    editor.innerHTML = talk.draft_text
  }

  editor.focus()

  // 将光标移动到文本末尾
  let selection = window.getSelection()
  if (selection) {
    let range = document.createRange()
    range.selectNodeContents(editor)
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

onMounted(() => {
  const editor = document.getElementById('me-editor')
  if (editor) {
    tribute.attach(editor)
  }

  loadEditorDraftText()
})

watch(indexName, loadEditorDraftText, { immediate: true })

const isShowEditorVote = ref(false)
const isShowEditorCode = ref(false)
const isShowEditorRecorder = ref(false)
const fileImageRef = ref()
const uploadFileRef = ref()
const emoticonRef = ref()

const imagePreview = reactive({
  show: false,
  file: null,
})

// 键盘监听事件
const onKeydownEvent = (e: any) => {
  let text = e.target.innerText.replace(/<br>/g, '/n').trim()

  // 空信息禁止换行
  if (e.keyCode == 13 && !text) {
    return e.preventDefault()
  }

  // 回车发送消息
  if (e.keyCode == 13 && !tribute.isActive && e.shiftKey == false && text) {
    if (text.length > 1024) {
      return window['$message'].info('发送内容超长，请分条发送')
    }

    let uids = pasteUids(e.target.innerHTML)

    let event = emitCall('text_event', { text, uids }, (ok: any) => {
      ok && (e.target.innerHTML = '')
    })

    emit('editor-event', event)

    return e.preventDefault()
  }
}

// 输入事件监听
const onInputEvent = e => {
  emit(
    'editor-event',
    emitCall('input_event', e.target.innerHTML.toString(), () => {})
  )
}

// 推送图片事件
const onImageEvent = ({ callBack }) => {
  const data = emitCall('image_event', imagePreview.file, (ok: boolean) => {
    callBack(ok)
  })

  emit('editor-event', data)
}

const onVoteEvent = data => {
  const msg = emitCall('vote_event', data, (ok: boolean) => {
    if (ok) {
      isShowEditorVote.value = false
    }
  })

  emit('editor-event', msg)
}

function editorInsertText(text: string) {
  let editor = document.getElementById('me-editor')
  let selection = window.getSelection()

  if (selection && editor) {
    editor.focus()

    let range = selection.getRangeAt(0)
    range.deleteContents()
    let textNode = document.createTextNode(text)
    range.insertNode(textNode)
    range.setStartAfter(textNode)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
    editor.focus()
  }
}

const onEmoticonEvent = (data: any) => {
  if (data.type == 1) {
    editorInsertText(data.value)
  } else {
    emit(
      'editor-event',
      emitCall('emoticon_event', data.value, () => {})
    )
  }

  emoticonRef.value.setShow(false)
}

const onCodeEvent = data => {
  const msg = emitCall('code_event', data, isBool => {
    isShowEditorCode.value = false
  })

  emit('editor-event', msg)
}

function uploadImageChange(e) {
  openImagePreview(e.target.files[0])
}

function openImagePreview(file) {
  imagePreview.file = file
  imagePreview.show = true
}

function closeImagePreview() {
  imagePreview.file = null
  imagePreview.show = false
}

const onUploadFile = e => {
  let file = e.target.files[0]
  if (/\.(gif|jpg|jpeg|png|webp|GIF|JPG|PNG|WEBP)$/.test(file.name)) {
    return openImagePreview(file)
  }

  emit('editor-event', emitCall('file_event', file))
}

const onRecorderEvent = file => {
  emit('editor-event', emitCall('file_event', file))
  isShowEditorRecorder.value = false
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
    show: computed(() => props.show_vote),
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

//复制粘贴图片回调方法
const onPaste = e => {
  let files = getPasteImgs(e)
  if (files.length > 0) {
    openImagePreview(files[0])
  } else {
    pasteFilter(e)
  }
}

//拖拽上传图片回调方法
const onDragPaste = e => {
  let files = getDragPasteImg(e)
  if (files.length == 0) return
  openImagePreview(files[0])
}
</script>

<template>
  <section class="el-container editor">
    <section class="el-container is-vertical">
      <header class="el-header toolbar bdr-t bdr-b">
        <div class="tools">
          <n-popover
            placement="top-start"
            trigger="click"
            raw
            :show-arrow="false"
            :width="300"
            ref="emoticonRef"
            style="
              margin-bottom: 12px;
              margin-left: -10px;
              width: 500px;
              height: 250px;
              border-radius: 5px;
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
        <div class="tips">
          <n-icon size="18" class="pointer" :component="TipsOne" />
          <!-- 按Enter发送 / Shift+Enter 换行 -->
        </div>
      </header>

      <main class="el-main o-hidden height100">
        <div
          id="me-editor"
          spellcheck="true"
          contenteditable="true"
          @keydown="onKeydownEvent($event)"
          @input="onInputEvent($event)"
          placeholder="你想要说点什么呢..."
          v-paste="onPaste"
          v-drag="onDragPaste"
        />
      </main>
    </section>
  </section>

  <form enctype="multipart/form-data" style="display: none">
    <input
      type="file"
      ref="fileImageRef"
      accept="image/*"
      @change="uploadImageChange"
    />
    <input type="file" ref="uploadFileRef" @change="onUploadFile" />
  </form>

  <MeEditorImage
    v-if="imagePreview.show"
    :file="imagePreview.file"
    @close="closeImagePreview"
    @submit="onImageEvent"
  />

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
        }

        &:hover {
          background-color: #f5f5f5;

          .tip-title {
            display: block;
          }
        }
      }
    }

    .tips {
      width: 200px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 20px;
      user-select: none;
    }
  }
}

#me-editor {
  width: 100%;
  height: inherit;
  border: none;
  outline: none;
  resize: none;
  font-size: 15px;
  overflow-y: auto;
  color: #464545;
  padding: 8px;
  box-sizing: border-box;
  white-space: pre-wrap;
  word-break: break-word;
  word-wrap: break-word;
  user-select: none;
  cursor: text;
  outline: none;
}

#me-editor[contenteditable]:empty:before {
  content: attr(placeholder);
  color: #464545;
  font-size: 12px;
  font-weight: 400;
}

#me-editor[contenteditable]:focus {
  content: none;
}
</style>

<style lang="less">
.tribute-container li.highlight {
  background: #518afe;
  color: #ffffff;
}

.tribute-mention {
  color: #518afe;
  padding: 0 2px;
}
</style>
