<template>
  <div>
    <n-button @click="onAddEmj">插入表情</n-button>

    <QuillEditor
      ref="editor"
      id="editor"
      :options="editorOption"
      @ready="onEditorReady"
      style="height: 300px"
    />
  </div>
</template>

<script lang="ts" setup>
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'quill-image-uploader/dist/quill.imageUploader.min.css'
import 'quill-mention/dist/quill.mention.min.css'
import { ref } from 'vue'
import { QuillEditor, Quill } from '@vueup/vue-quill'
import EmojiBlot from './formats/emoji.ts'
import { memberList } from './formats/util.ts'
import ImageUploader from 'quill-image-uploader'
import 'quill-mention'

Quill.register('formats/emoji', EmojiBlot)
Quill.register('modules/imageUploader', ImageUploader)

import { ServeUploadImage } from '@/api/upload'

const editor = ref()

const getQuill = () => {
  return editor.value.getQuill()
}

// 添加匹粘贴板事件禁止图片粘贴
function handleCustomMatcher(node, Delta) {
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

const editorOption = {
  modules: {
    toolbar: false,

    clipboard: {
      // 粘贴版，处理粘贴时候的自带样式
      matchers: [[Node.ELEMENT_NODE, handleCustomMatcher]],
    },

    keyboard: {
      bindings: {
        enter: {
          key: 13,
          handler: () => {
            var delta = getQuill().getContents()
            console.log('发送消息==>', delta)
          },
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
                  <span class="member-name">${data.value}</span>
              </div>
            `
      },
      source: function (searchTerm, renderList, mentionChar) {
        const items = memberList.filter(
          item => item.value.indexOf(searchTerm) !== -1
        )

        renderList(items)
      },
    },
  },
  placeholder: 'Compose an epic...',
  theme: 'snow',
}

const onEditorReady = (quill: Quill) => {
  console.log('onEditorReady')
}

const onAddEmj = () => {
  const quill = getQuill()

  const index = (quill.getSelection() || {}).index || quill.getLength()

  // 这里可以用 img 的属性, 也可以通过 data-* 来传递一些数据
  quill.insertEmbed(index, 'emoji', {
    alt: '测试',
    src: 'https://www.naiveui.com/assets/naivelogo-93278402.svg',
    width: '20px',
    height: '20px',
  })

  setTimeout(() => {
    const index = (quill.getSelection() || {}).index || quill.getLength()
    console.log(quill.getSelection())
    quill.setSelection(index, index + 1, 'user')
  }, 0)
}
</script>

<style lang="less" scoped>
:global(.ql-snow .ql-editor img) {
  max-width: 200px;
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
.ql-mention-list-container {
  width: 160px;
  max-height: 200px;
  overflow-y: auto;
  border-radius: 6px;
}

.ql-mention-list-item {
  padding: 0 10px;
}

.ql-mention-list-item.selected {
  background-color: #508afe;
  color: #fff;
  text-decoration: none;
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
</style>
