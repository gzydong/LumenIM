<script setup>
import { reactive, watch, ref, markRaw, computed, onMounted } from 'vue'
import { useDialogueStore } from '@/store/dialogue'
import { useEditorStore } from '@/store/editor'
import { useTalkStore } from '@/store/talk'
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
  TipsOne,
} from '@icon-park/vue-next'
import { emitCall } from '@/utils/common'
import MeEditorImage from './MeEditorImage.vue'
import MeEditorVote from './MeEditorVote.vue'
import MeEditorEmoticon from './MeEditorEmoticon.vue'
import MeEditorCode from './MeEditorCode.vue'
import MeEditorRecorder from './MeEditorRecorder.vue'
import MeMention from './MeMention.vue'
import { getPasteImgs, getDragPasteImg, pasteFilter } from '@/utils/editor'

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

let lastSelection = null
let lastEditRange = null

const editorListener = () => {
  const fn = function () {
    let selection = window.getSelection
      ? window.getSelection()
      : document.selection
    let range = selection.createRange
      ? selection.createRange()
      : selection.getRangeAt(0)

    lastSelection = selection
    lastEditRange = range
  }

  let editor = document.getElementById('me-editor')
  editor.onclick = fn // 编辑框点击事件
  editor.onkeyup = fn // 编辑框按键弹起事件
}

onMounted(() => {
  editorListener()
})

watch(
  indexName,
  () => {
    const elEditor = document.getElementById('me-editor')
    if (elEditor) {
      const talk = talkStore.findItem(dialogueStore.index_name)

      if (talk) {
        elEditor.innerHTML = talk.draft_text
      }
    }
  },
  { immediate: true }
)

const isShowEditorVote = ref(false)
const isShowEditorCode = ref(false)
const isShowEditorRecorder = ref(false)
const fileImageRef = ref(null)
const uploadFileRef = ref(null)
const emoticonRef = ref(null)

const imagePreview = reactive({
  show: false,
  file: null,
})

// 键盘监听事件
const onKeydownEvent = e => {
  if (e.keyCode == 38 || e.keyCode == 40) {
    return e.preventDefault()
  }

  let text = e.target.innerText.replace(/<br>/g, '/n').trim()

  // 空信息禁止换行
  if (e.keyCode == 13 && !text) {
    return e.preventDefault()
  }

  // 这里需要判断是否是群聊，非群聊不需要@功能
  if (e.shiftKey && e.keyCode == 50 && dialogueStore.isGroupTalk) {
    lastEditRange = window.getSelection().getRangeAt(0)
    editorStore.updateMentionStatus(true)
    return e.preventDefault()
  }

  if (e.keyCode == 13 && editorStore.mention.isShow) {
    return e.preventDefault()
  }

  // 回车发送消息
  if (e.keyCode == 13 && e.shiftKey == false && text) {
    if (text.length > 1024) {
      return window.$message.info('发送内容超长，请分条发送')
    }

    let atids = e.target.innerHTML.match(/data-atid="\d+"/g)
    let uids = []
    if (atids) {
      uids = atids
        .toString()
        .match(/\d+/g)
        .map(value => {
          return parseInt(value)
        })
    }

    let event = emitCall('text_event', { text, uids }, isBool => {
      if (isBool) {
        e.target.innerHTML = ''
      }
    })

    emit('editor-event', event)

    return e.preventDefault()
  }

  editorStore.updateMentionStatus(false)
  dialogueStore.updateEditorText(e.target.innerHTML.toString())
}

// 输入事件监听
const onInputEvent = e => {
  emit('editor-event', emitCall('input_event', e.target.innerHTML.toString()))
}

// 推送图片事件
const onImageEvent = ({ callBack }) => {
  const msg = emitCall('image_event', imagePreview.file, isBool => {
    callBack(isBool)
  })

  emit('editor-event', msg)
}

const onVoteEvent = data => {
  const msg = emitCall('vote_event', data, isBool => {
    if (isBool) {
      isShowEditorVote.value = false
    }
  })

  emit('editor-event', msg)
}

const editorInsertText = text => {
  // 获取编辑框对象
  var edit = document.getElementById('me-editor')
  // 编辑框设置焦点
  edit.focus()
  // 获取选定对象
  var selection = getSelection()
  // 判断是否有最后光标对象存在
  if (lastEditRange) {
    // 存在最后光标对象，选定对象清除所有光标并添加最后光标还原之前的状态
    selection.removeAllRanges()
    selection.addRange(lastEditRange)
  }

  // 判断选定对象范围是编辑框还是文本节点
  if (selection.anchorNode.nodeName != '#text') {
    // 如果是编辑框范围。则创建表情文本节点进行插入
    var emojiText = document.createTextNode(text)

    if (edit.childNodes.length > 0) {
      // 如果文本框的子元素大于0，则表示有其他元素，则按照位置插入表情节点
      for (var i = 0; i < edit.childNodes.length; i++) {
        if (i == selection.anchorOffset) {
          edit.insertBefore(emojiText, edit.childNodes[i])
        }
      }
    } else {
      // 否则直接插入一个表情元素
      edit.appendChild(emojiText)
    }
    // 创建新的光标对象
    var range = document.createRange()
    // 光标对象的范围界定为新建的表情节点
    range.selectNodeContents(emojiText)
    // 光标位置定位在表情节点的最大长度
    range.setStart(emojiText, emojiText.length)
    // 使光标开始和光标结束重叠
    range.collapse(true)
    // 清除选定对象的所有光标对象
    selection.removeAllRanges()
    // 插入新的光标对象
    selection.addRange(range)
  } else {
    // 如果是文本节点则先获取光标对象
    var range = selection.getRangeAt(0)
    // 获取光标对象的范围界定对象，一般就是textNode对象
    var textNode = range.startContainer
    // 获取光标位置
    var rangeStartOffset = range.startOffset
    // 文本节点在光标位置处插入新的表情内容
    textNode.insertData(rangeStartOffset, text)
    // 光标移动到到原来的位置加上新内容的长度
    range.setStart(textNode, rangeStartOffset + text.length)
    // 光标开始和光标结束重叠
    range.collapse(true)
    // 清除选定对象的所有光标对象
    selection.removeAllRanges()
    // 插入新的光标对象
    selection.addRange(range)
  }

  // 无论如何都要记录最后光标对象
  lastEditRange = selection.getRangeAt(0)
}

const editorInsertMention = (atid, atname) => {
  let node = document.createTextNode(' ')
  lastEditRange.insertNode(node)

  let node2 = document.createElement('span')
  node2.className = 'mention'
  node2.contentEditable = false
  node2.textContent = `@${atname} ` // 这里的空格请勿删除，正则匹配需要用到
  node2.dataset['atid'] = atid
  lastEditRange.insertNode(node2)

  window.getSelection().collapseToEnd()
}

const onEmoticonEvent = data => {
  if (data.type == 1) {
    editorInsertText(data.value)
  } else {
    emit('editor-event', emitCall('emoticon_event', data.value))
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

const onMention = (id, name) => {
  editorInsertMention(id, name)
  editorStore.updateMentionStatus(false)
}

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
    <aside class="el-aside" v-if="editorStore.mention.isShow">
      <MeMention
        @on-select="onMention"
        @on-close="editorStore.updateMentionStatus(false)"
      />
    </aside>

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
  -webkit-user-select: text;
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
