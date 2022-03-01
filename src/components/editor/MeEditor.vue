<template>
  <div>
    <el-container class="editor-container">
      <el-header class="no-padding toolbar" height="35px">
        <ul>
          <li v-popover:popoverEmoticon>
            <i class="iconfont icon-icon_im_face" style="font-size: 15px" />
            <p class="tip-title">表情符号</p>
          </li>
          <li @click="codeBlock.isShow = true">
            <i class="iconfont icon-daima" />
            <p class="tip-title">代码片段</p>
          </li>
          <li @click="sendGeoLocation">
            <i class="el-icon-location-information" />
            <p class="tip-title">地理位置</p>
          </li>
          <li @click="recorder = true">
            <i class="el-icon-microphone" />
            <p class="tip-title">语音消息</p>
          </li>
          <li @click="$refs.restFile.click()">
            <i class="el-icon-picture-outline-round" />
            <p class="tip-title">图片</p>
          </li>
          <li @click="$refs.restFile2.click()">
            <i class="el-icon-folder" />
            <p class="tip-title">附件</p>
          </li>
          <li @click="filesManager.isShow = true">
            <i class="el-icon-folder-opened" />
            <p class="tip-title">上传管理</p>
          </li>
          <li v-show="isGroupTalk" @click="vote.isShow = true">
            <i class="el-icon-s-data" />
            <p class="tip-title">发起投票</p>
          </li>

          <p class="text-tips no-select">
            <span>按Enter发送 / Shift+Enter 换行</span>
            <el-popover placement="top-end" width="600" trigger="click">
              <div class="editor-books">
                <div class="books-title">编辑说明:</div>
                <p>
                  1.
                  支持上传QQ及微信截图，在QQ或微信中截图后使用Ctrl+v上传图片。
                </p>
                <p>
                  2.
                  支持浏览器及Word文档中的图片复制上传、复制后使用Ctrl+v上传图片。
                </p>
                <p>3. 支持图片拖拽上传。</p>
                <p>4. 支持文件上传 ( 文件小于100M ) 。</p>
                <p>5. 按Enter发送 / Shift+Enter 换行。</p>
                <p>
                  6.
                  注意：当文件正在上传时，请勿关闭网页或离开当前对话框，否则将导致文件停止上传或上传失败。
                </p>
              </div>
              <i class="el-icon-info" slot="reference" />
            </el-popover>
          </p>
        </ul>

        <el-popover
          ref="popoverEmoticon"
          placement="top-start"
          width="500"
          trigger="click"
          popper-class="no-padding"
        >
          <MeEditorEmoticon ref="editorEmoticon" @selected="selecteEmoticon" />
        </el-popover>

        <form
          enctype="multipart/form-data"
          style="display: none"
          ref="fileFrom"
        >
          <input
            type="file"
            ref="restFile"
            accept="image/*"
            @change="uploadImageChange"
          />
          <input type="file" ref="restFile2" @change="uploadFileChange" />
        </form>
      </el-header>
      <el-main class="no-padding textarea">
        <textarea
          ref="textarea"
          v-paste="pasteImage"
          v-drag="dragPasteImage"
          v-model.trim="editorText"
          rows="6"
          placeholder="你想要的聊点什么呢 ..."
          @keydown="keydownEvent($event)"
          @input="inputEvent($event)"
        />
      </el-main>
    </el-container>

    <!-- 图片查看器 -->
    <MeEditorImageView
      ref="imageViewer"
      v-model="imageViewer.isShow"
      :file="imageViewer.file"
      @confirm="confirmUploadImage"
    />

    <MeEditorRecorder
      v-if="recorder"
      @close="recorder = false"
      @send="sendRecorder"
    />

    <!-- 代码块编辑器 -->
    <TalkCodeBlock
      v-if="codeBlock.isShow"
      :edit-mode="codeBlock.editMode"
      @close="codeBlock.isShow = false"
      @confirm="confirmCodeBlock"
    />

    <!-- 文件上传管理器 -->
    <MeEditorFileManage ref="filesManager" v-model="filesManager.isShow" />

    <MeEditorVote
      v-if="vote.isShow"
      @close="
        () => {
          this.vote.isShow = false
        }
      "
    />

    <!-- <MeEditorLocation/> -->
  </div>
</template>

<script>
import MeEditorEmoticon from './MeEditorEmoticon'
import MeEditorFileManage from './MeEditorFileManage'
import MeEditorImageView from './MeEditorImageView'
import MeEditorRecorder from './MeEditorRecorder'
import MeEditorVote from './MeEditorVote'
import MeEditorLocation from './MeEditorLocation'
import TalkCodeBlock from '@/components/chat/TalkCodeBlock'
import { getPasteImgs, getDragPasteImg } from '@/utils/editor'
import { findTalk } from '@/utils/talk'

import {
  ServeSendTalkCodeBlock,
  ServeSendTalkImage,
  ServeSendEmoticon,
} from '@/api/chat'

export default {
  name: 'MeEditor',
  components: {
    MeEditorEmoticon,
    MeEditorFileManage,
    MeEditorImageView,
    TalkCodeBlock,
    MeEditorRecorder,
    MeEditorVote,
    MeEditorLocation,
  },
  computed: {
    talkUser() {
      return this.$store.state.dialogue.index_name
    },
    isGroupTalk() {
      return this.$store.state.dialogue.talk_type == 2
    },
  },
  watch: {
    talkUser(n_index_name) {
      this.$refs.filesManager.clear()
      this.editorText = this.getDraftText(n_index_name)
    },
  },
  data() {
    return {
      // 当前编辑的内容
      editorText: '',

      // 图片查看器相关信息
      imageViewer: {
        isShow: false,
        file: null,
      },

      codeBlock: {
        isShow: false,
        editMode: true,
      },

      filesManager: {
        isShow: false,
      },

      vote: {
        isShow: false,
      },

      // 录音器
      recorder: false,

      // 上次发送消息的时间
      sendtime: 0,

      // 发送间隔时间（默认1秒）
      interval: 1000,
    }
  },
  methods: {
    // 读取对话编辑草稿信息
    getDraftText(index_name) {
      return findTalk(index_name).draft_text || ''
    },

    //复制粘贴图片回调方法
    pasteImage(e) {
      let files = getPasteImgs(e)
      if (files.length == 0) return

      this.openImageViewer(files[0])
    },

    //拖拽上传图片回调方法
    dragPasteImage(e) {
      let files = getDragPasteImg(e)
      if (files.length == 0) return

      this.openImageViewer(files[0])
    },

    inputEvent(e) {
      this.$emit('keyboard-event', e.target.value)
    },

    // 键盘按下监听事件
    keydownEvent(e) {
      if (e.keyCode == 13 && this.editorText == '') {
        e.preventDefault()
      }

      // 回车发送消息
      if (e.keyCode == 13 && e.shiftKey == false && this.editorText != '') {
        let currentTime = new Date().getTime()

        if (this.sendtime > 0) {
          // 判断 1秒内只能发送一条消息
          if (currentTime - this.sendtime < this.interval) {
            e.preventDefault()
            return false
          }
        }

        this.$emit('send', this.editorText)
        this.editorText = ''
        this.sendtime = currentTime
        e.preventDefault()
      }
    },

    // 选择图片文件后回调方法
    uploadImageChange(e) {
      console.log(e.target.files[0])
      this.openImageViewer(e.target.files[0])
      this.$refs.restFile.value = null
    },

    // 选择文件回调事件
    uploadFileChange(e) {
      let maxsize = 100 * 1024 * 1024
      if (e.target.files.length == 0) {
        return false
      }

      let file = e.target.files[0]
      if (/\.(gif|jpg|jpeg|png|webp|GIF|JPG|PNG|WEBP)$/.test(file.name)) {
        this.openImageViewer(file)
        return
      }

      if (file.size > maxsize) {
        this.$notify.info({
          title: '消息',
          message: '上传文件不能大于100M',
        })
        return
      }

      this.filesManager.isShow = true
      this.$refs.restFile2.value = null
      this.$refs.filesManager.upload(file)
    },

    // 打开图片查看器
    openImageViewer(file) {
      this.imageViewer.isShow = true
      this.imageViewer.file = file
    },

    sendRecorder(file) {
      this.recorder = false
      this.$refs.filesManager.upload(file)
    },

    // 代码块编辑器确认完成回调事件
    confirmCodeBlock(data) {
      const { talk_type, receiver_id } = this.$store.state.dialogue
      ServeSendTalkCodeBlock({
        talk_type,
        receiver_id,
        code: data.code,
        lang: data.language,
      }).then(res => {
        if (res.code == 200) {
          this.codeBlock.isShow = false
        } else {
          this.$notify({
            title: '友情提示',
            message: res.message,
            type: 'warning',
          })
        }
      })
    },

    // 确认上传图片消息回调事件
    confirmUploadImage() {
      const { talk_type, receiver_id } = this.$store.state.dialogue

      let fileData = new FormData()
      fileData.append('talk_type', talk_type)
      fileData.append('receiver_id', receiver_id)
      fileData.append('image', this.imageViewer.file)

      let ref = this.$refs.imageViewer

      ServeSendTalkImage(fileData)
        .then(res => {
          ref.loading = false
          if (res.code == 200) {
            ref.closeBox()
          } else {
            this.$notify({
              title: '友情提示',
              message: res.message,
              type: 'warning',
            })
          }
        })
        .finally(() => {
          ref.loading = false
        })
    },

    // 选中表情包回调事件
    selecteEmoticon(data) {
      if (data.type == 1) {
        let value = this.editorText
        let el = this.$refs.textarea
        let startPos = el.selectionStart
        let endPos = el.selectionEnd
        let newValue =
          value.substring(0, startPos) +
          data.value +
          value.substring(endPos, value.length)

        this.editorText = newValue

        if (el.setSelectionRange) {
          setTimeout(() => {
            let index = startPos + data.value.length
            el.setSelectionRange(index, index)
            el.focus()
          }, 0)
        }
      } else {
        const { talk_type, receiver_id } = this.$store.state.dialogue
        ServeSendEmoticon({
          talk_type,
          receiver_id,
          emoticon_id: data.value,
        })
      }

      this.$refs.popoverEmoticon.doClose()
    },

    sendGeoLocation() {},
  },
}
</script>
<style scoped>
.editor-container {
  height: 160px;
  width: 100%;
  background-color: white;
}

.editor-container .toolbar {
  line-height: 35px;
  border-bottom: 1px solid #f5f0f0;
  border-top: 1px solid #f5f0f0;
}

.editor-container .toolbar li {
  list-style: none;
  float: left;
  width: 35px;
  margin-left: 3px;
  cursor: pointer;
  text-align: center;
  line-height: 35px;
  position: relative;
  color: #8d8d8d;
}

.editor-container .toolbar li .tip-title {
  display: none;
  position: absolute;
  top: 38px;
  left: 0px;
  height: 26px;
  line-height: 26px;
  background-color: rgba(31, 35, 41, 0.9);
  color: white;
  min-width: 30px;
  font-size: 10px;
  padding: 0 5px;
  border-radius: 2px;
  white-space: pre;
  text-align: center;
  user-select: none;
  z-index: 1;
}

.editor-container .toolbar li:hover .tip-title {
  display: block;
}

.editor-container .toolbar li:hover {
  background-color: #f7f5f5;
}

.editor-container .toolbar .text-tips {
  float: right;
  margin-right: 15px;
  font-size: 12px;
  color: #ccc;
}

.editor-container .toolbar .text-tips i {
  font-size: 14px;
  cursor: pointer;
  margin-left: 5px;
  color: rgb(255, 181, 111);
}

.editor-container .textarea {
  overflow: hidden;
  position: relative;
}

textarea {
  width: calc(100% - 10px);
  width: -moz-calc(100% - 10px);
  width: -webkit-calc(100% - 10px);
  height: calc(100% - 10px);
  height: -moz-calc(100% - 10px);
  height: -webkit-calc(100% - 10px);
  border: 0 none;
  outline: none;
  resize: none;
  font-size: 15px;
  overflow-y: auto;
  color: #464545;
  padding: 5px;
  position: relative;
}

textarea::-webkit-scrollbar {
  width: 4px;
  height: 1px;
}

textarea::-webkit-scrollbar-thumb {
  background: #d5cfcf;
}

textarea::-webkit-scrollbar-track {
  background: #ededed;
}

textarea::-webkit-input-placeholder {
  color: #dccdcd;
  font-size: 12px;
  font-weight: 400;
}

/* 编辑器文档说明 --- start */
.editor-books .books-title {
  font-size: 16px;
  height: 30px;
  line-height: 22px;
  margin-top: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #cbcbcb;
  color: #726f6f;
  font-weight: 400;
  margin-left: 11px;
}

.editor-books p {
  text-indent: 10px;
  font-size: 12px;
  height: 30px;
  line-height: 30px;
  color: #7f7c7c;
}

/* 编辑器文档说明 --- end */
</style>
