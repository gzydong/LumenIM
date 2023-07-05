<script setup lang="ts">
import { reactive, watch, ref, markRaw, computed, onMounted } from 'vue'
import { useDialogueStore, useTalkStore } from '@/store'
import { NPopover } from 'naive-ui'
import Tribute from 'tributejs'
import { getEditorNodeInfo } from './editor.ts'
import { getImageInfo } from '@/utils/functions'
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
} from '@icon-park/vue-next'
import { emitCall } from '@/utils/common'
import { defAvatar } from '@/constant/default'
import MeEditorVote from './MeEditorVote.vue'
import MeEditorEmoticon from './MeEditorEmoticon.vue'
import MeEditorCode from './MeEditorCode.vue'
import MeEditorRecorder from './MeEditorRecorder.vue'
import { getPasteImgs, getDragPasteImg, pasteFilter } from '@/utils/editor'
import { ServeUploadImage } from '@/api/upload'
import { ServePublishMessage } from '@/api/chat'

const emit = defineEmits(['editor-event'])
const dialogueStore = useDialogueStore()
const talkStore = useTalkStore()
const props = defineProps({
  vote: {
    type: Boolean,
    default: false,
  },
  members: {
    default: () => [],
  },
})

const indexName = computed(() => dialogueStore.index_name)
const isShowEditorVote = ref(false)
const isShowEditorCode = ref(false)
const isShowEditorRecorder = ref(false)
const fileImageRef = ref()
const uploadFileRef = ref()
const emoticonRef = ref()

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

const tribute = new Tribute({
  noMatchTemplate: () => '',
  selectTemplate: (item: any) => {
    return ` <span class="ed-mention" data-atid="${item.original.id}" contenteditable="false">@${item.original.nickname}</span>`
  },
  menuItemTemplate: (item: any) => {
    let name = item.original.nickname

    if (item.original.remark) {
      name += `(${item.original.remark})`
    }

    return `
    <img width="18" height="18" src="${item.original.avatar}" style="border-radius:50%;">
    <span class="text-ellipsis">${name}</span>`
  },
  requireLeadingSpace: false,
  lookup: 'name',
  values: (_, cb) => {
    let items = !props.members.length
      ? []
      : [{ id: 0, nickname: '所有人', avatar: defAvatar }, ...props.members]

    return cb(items)
  },
})

const onKeydownEvent = (e: any) => {
  onInputEvent(e)

  let data = getEditorNodeInfo(document.getElementById('me-editor'))

  // 空信息禁止换行
  if (e.keyCode == 13 && !data.items) {
    return e.preventDefault()
  }

  let isOk =
    e.keyCode == 13 && !tribute.isActive && e.shiftKey == false && data.items

  // 回车发送消息
  if (isOk) {
    switch (data.msgType) {
      case 1: // 文字消息
        if (data.items[0].content.length > 1024) {
          return window['$message'].info('发送内容超长，请分条发送')
        }

        let event = emitCall(
          'text_event',
          { text: data.items[0].content, uids: data.mentionUids },
          (ok: any) => {
            ok && (e.target.innerHTML = '')
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
              ok && (e.target.innerHTML = '')
            }
          )
        )
        break
      case 12: // 图文消息
        emit(
          'editor-event',
          emitCall('mixed_event', { items: data.items }, (ok: any) => {
            ok && (e.target.innerHTML = '')
          })
        )
        break
    }

    return e.preventDefault()
  }
}

// 输入事件监听
const onInputEvent = (e: any) => {
  emit(
    'editor-event',
    emitCall('input_event', e.target.innerHTML.toString(), () => {})
  )
}

const onVoteEvent = (data: any) => {
  const msg = emitCall('vote_event', data, (ok: boolean) => {
    if (ok) {
      isShowEditorVote.value = false
    }
  })

  emit('editor-event', msg)
}

function editorInsertText(text: string, img: string) {
  let editor = document.getElementById('me-editor')
  let selection = window.getSelection()

  if (selection && editor) {
    editor.focus()

    let range = selection.getRangeAt(0)
    range.deleteContents()

    let textNode: any = document.createTextNode(text)
    if (img.length) {
      textNode = document.createElement('img')
      textNode.src = img
      textNode.className = 'ed-emoji'
      textNode.dataset['text'] = text
    }

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
    editorInsertText(data.value, data.img)
  } else {
    emit(
      'editor-event',
      emitCall('emoticon_event', data.value, () => {})
    )
  }

  emoticonRef.value.setShow(false)
}

const onCodeEvent = (data: any) => {
  const msg = emitCall('code_event', data, isok => {
    isShowEditorCode.value = false
  })

  emit('editor-event', msg)
}

const insertEditorImage = (file: File) => {
  let imageNode = document.createElement('img')
  imageNode.className = 'ed-image'

  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    let editor = document.getElementById('me-editor')
    let selection = window.getSelection()

    if (selection && editor) {
      editor.focus()

      let range = selection.getRangeAt(0)
      range.deleteContents()

      imageNode.src = reader.result

      range.insertNode(imageNode)
      range.setStartAfter(imageNode)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
      editor.focus()
    }
  }
	
  const form = new FormData()
  form.append('file', file)
  ServeUploadImage(form).then(({ code, data, message }) => {
    if (code == 200) {
      // imageNode.src = data.src
    } else {
      imageNode.remove()
      window['$message'].error(message)
    }
  })
}

const onUploadFile = (e: any) => {
  let file = e.target.files[0]

  e.target.value = null

  if (/\.(gif|jpg|jpeg|png|webp|GIF|JPG|PNG|WEBP)$/.test(file.name)) {
    return insertEditorImage(file)
  }

  emit(
    'editor-event',
    emitCall('file_event', file, () => {})
  )
}

const onRecorderEvent = (file: any) => {
  emit('editor-event', emitCall('file_event', file))
  isShowEditorRecorder.value = false
}

//复制粘贴图片回调方法
const onPaste = (e: any) => {
  try {
    ;async () => {
      const clipboardItems = await navigator.clipboard.read()
      console.log(clipboardItems)
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          const blob = await clipboardItem.getType(type)

          if (blob.type == 'text/plain' || blob.type == 'text/html') {
            console.log(await blob.text())
          } else {
            console.log(blob)
          }
        }
      }
    }
  } catch (err) {
    console.error(err)
  }

  // let files = getPasteImgs(e)
  // if (files.length > 0) {
  //   insertEditorImage(files[0])
  // } else {
  //   pasteFilter(e)
  // }

  return e.preventDefault()
}

//拖拽上传图片回调方法
const onDragPaste = (e: any) => {
  let files = getDragPasteImg(e)

  if (files.length == 0) return

  for (const file of files) {
    insertEditorImage(file)
  }

  return e.preventDefault()
}

const onCopy = (e: any) => {
  // let data = new Blob(['一文彻底掌握 Blob Web API'], { type: 'text/plain' })
  // const clipboardItem = new ClipboardItem({ 'text/plain': data })
  // const clipboardItem2 = new ClipboardItem({ 'text/plain': new Blob(['||||一文彻底掌握 Blob Web API'], { type: 'text/plain' }) })

  // navigator.clipboard.write([clipboardItem,clipboardItem2])

  var txt = window.getSelection
    ? window.getSelection()
    : document.selection.createRange()
  console.log('onCopy', txt)
  return e.preventDefault()
}

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

watch(indexName, loadEditorDraftText, { immediate: true })

onMounted(() => {
  const editor = document.getElementById('me-editor')
  if (editor) {
    tribute.attach(editor)
  }

  loadEditorDraftText()
})
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
        <div
          id="me-editor"
          class="me-scrollbar"
          spellcheck="true"
          contenteditable="true"
          @keydown="onKeydownEvent($event)"
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
        }

        &:hover {
          background-color: #f5f5f5;

          .tip-title {
            display: block;
          }
        }
      }
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
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Alibaba PuHuiTi 2.0 45';
}

:global(.ed-mention) {
  color: #518afe;
}

:global(.ed-image) {
  max-width: 100px;
  object-fit: contain;
  padding-right: 6px;
  // display: block;
  margin: 5px 0;
}

#me-editor[contenteditable]:empty:before {
  content: attr(placeholder);
  color: #a7a4a4;
  font-size: 12px;
  font-weight: 400;
}

#me-editor[contenteditable]:focus {
  content: none;
}

:global(.tribute-container) {
  border: 5px solid #f5f5f5;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: 0 0 20px 5px #ffffff;
}
:global(.tribute-container ul) {
  margin-top: 0;
  padding: 0 3px;
  background-color: #f5f5f5;
}

:global(.tribute-container li) {
  display: flex;
  align-items: center;
  width: 130px;
  border-radius: 5px;
}

:global(.tribute-container li span) {
  font-weight: 400;
  margin-left: 10px;
}

:global(.tribute-container li.highlight) {
  // background: #daf3fd;
  background-color: rgb(80, 138, 254);
  color: #ffffff;
}

:global(.tribute-mention) {
  color: #518afe;
  padding: 0 2px;
}
</style>
