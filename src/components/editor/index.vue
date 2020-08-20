<template>
  <div>
    <el-container class="editor-container">
      <el-header class="padding0 toolbar" height="35px">
        <ul>
          <li v-popover:popoverEmoticon>
            <i class="iconfont icon-icon_im_face" style="font-size: 15px;"></i>
            <p class="tip-title">表情符号</p>
          </li>
          <li @click="codeBlock.isShow = true">
            <i class="iconfont icon-daima"></i>
            <p class="tip-title">代码片段</p>
          </li>
          <li @click="$refs.restFile.click()">
            <i class="el-icon-picture-outline-round"></i>
            <p class="tip-title">图片</p>
          </li>
          <li @click="$refs.restFile2.click()">
            <i class="el-icon-folder"></i>
            <p class="tip-title">附件</p>
          </li>
          <li>
            <i class="el-icon-microphone"></i>
            <p class="tip-title">录音(开发中)</p>
          </li>

          <p class="text-tips no-select">
            <span>按Enter发送 / Shift+Enter 换行</span>
            <el-popover placement="top-end" width="600" trigger="click">
              <div class="editor-books">
                <div class="books-title">编辑说明:</div>
                <p>1. 支持上传QQ及微信截图，在QQ或微信中截图后使用Ctrl+v上传图片</p>
                <p>2. 支持浏览器及Word文档中的图片复制上传、复制后使用Ctrl+v上传图片</p>
                <p>3. 支持图片拖拽上传</p>
                <p>4. 支持文件上传 ( 文件小于100M ) </p>
                <p>5. 按Enter发送 / Shift+Enter 换行</p>
                <p>6. (注意) 当文件正在上传时，请勿关闭网页或离开当前对话框，否则将导致文件停止上传或上传失败</p>
              </div>
              <i class="el-icon-info" slot="reference"></i>
            </el-popover>
          </p>
        </ul>

        <el-popover ref="popoverEmoticon" placement="top-start" width="500" trigger="click" popper-class="padding0">
          <editor-emoticon ref="editorEmoticon" @selected="selecteEmoticon" />
        </el-popover>

        <form enctype="multipart/form-data" style="display: none;" ref="fileFrom">
          <input type="file" ref="restFile" accept="image/*" @change="uploadImageChange" />
          <input type="file" ref="restFile2" @change="uploadFileChange" />
        </form>
      </el-header>
      <el-main class="padding0 textarea">
        <textarea ref="textarea" v-paste="pasteImage" v-drag="dragPasteImage" v-model.trim="editorText"
          @keydown="keydownEvent($event)" placeholder="你想要的聊点什么呢 ..." rows="6"></textarea>
      </el-main>
    </el-container>

    <!-- 图片查看器 -->
    <image-viewer v-model="imageViewer.isShow" :file="imageViewer.file" @success="successImageViewer" />
    
    <!-- <recorder v-model="recorder"  /> -->

    <!-- 代码块编辑器 -->
    <code-block v-if="codeBlock.isShow" :edit-mode="codeBlock.editMode" @close="codeBlock.isShow = false"
      @confirm="confirmCodeBlock">
    </code-block>

    <!-- 文件上传管理器 -->
    <files-manager ref="filesManager" v-model="filesManager.isShow" @success="fileUploadSuccess"></files-manager>
  </div>
</template>

<script>
  import EditorEmoticon from "./EditorEmoticon";
  import FilesManager from "./FilesManager";
  import ImageViewer from "./ImageViewer";
  import Recorder from "./Recorder";
  import CodeBlock from "@/components/chat/CodeBlock";

  import {
    getPasteImgs,
    getDragPasteImg,
  } from "@/utils/editor";

  export default {
    name: 'editor',
    components: {
      EditorEmoticon,
      FilesManager,
      ImageViewer,
      CodeBlock,
      Recorder
    },
    computed: {
      talkUser() {
        return this.$root.message.index_name;
      }
    },
    watch: {
      talkUser(ndata, odata) {
        this.$refs.filesManager.clear();
      }
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
          editMode: true
        },

        filesManager: {
          isShow: false
        },
        recorder:true,
      };
    },
    methods: {
      //复制粘贴图片回调方法
      pasteImage(e) {
        let files = getPasteImgs(e);
        if (files.length == 0) return;

        this.openImageViewer(files[0]);
      },

      //拖拽上传图片回调方法
      dragPasteImage(e) {
        let files = getDragPasteImg(e);
        if (files.length == 0) return;

        this.openImageViewer(files[0]);
      },

      // 键盘监听事件
      keydownEvent(e) {
        if (e.keyCode == 13 && this.editorText == "") {
          e.preventDefault(); // 阻止浏览器默认换行操作
        }

        if (e.keyCode !== 13) {
          this.$emit("input-event");
          return;
        }

        // 回车发送消息
        if (e.keyCode == 13 && e.shiftKey == false && this.editorText != '') {
          this.$emit("send", {
            type: 1,
            text: this.editorText
          });

          this.editorText = "";
          e.preventDefault();
        }
      },

      // 选择图片文件后回调方法
      uploadImageChange(e) {
        this.openImageViewer(e.target.files[0]);
        this.$refs.restFile.value = null;
      },
      // 选择文件回调事件
      uploadFileChange(e) {
        let that = this;
        var maxsize = 100 * 1024 * 1024;

        let file = null;
        if (e.target.files.length == 0) {
          return false;
        }

        file = e.target.files[0];
        if (/\.(gif|jpg|jpeg|png|webp|GIF|JPG|PNG|WEBP)$/.test(file.name)) {
          this.openImageViewer(file);
          return;
        }

        if (file.size > maxsize) {
          alert("上传文件不能大于100M");
          return;
        }

        this.filesManager.isShow = true;
        this.$refs.restFile2.value = null;
        this.$refs.filesManager.upload(file);
      },

      // 打开图片查看器
      openImageViewer(file) {
        this.imageViewer.isShow = true;
        this.imageViewer.file = file;
      },

      // 图片查看器上传图片成功回调事件
      successImageViewer(value) {
        this.imageViewer.isShow = false;
        console.log(value);
        // 处理发送消息

        this.$emit("send", {
          type: 2,
          text: value
        });
      },

      // 代码块编辑器确认完成回调事件
      confirmCodeBlock(data) {
        this.codeBlock.isShow = false;

        // 这里处理发送代码块信息逻辑
        this.$emit("send", {
          type: 4,
          code_lang: data.language,
          code: data.code
        });
      },

      // 文件管理器文件上传成功回调事件
      fileUploadSuccess(fileInfo) {
        this.$emit("send", {
          type: 2,
          text: fileInfo.fileid
        });
      },

      // 选中表情包回调事件
      selecteEmoticon(data) {
        if (data.type == 1) {
          let value = this.editorText;
          let el = this.$refs.textarea;
          let startPos = el.selectionStart;
          let endPos = el.selectionEnd;
          let newValue =
            value.substring(0, startPos) +
            data.value +
            value.substring(endPos, value.length);
          this.editorText = newValue;
          if (el.setSelectionRange) {
            setTimeout(() => {
              let index = startPos + data.value.length;
              el.setSelectionRange(index, index);
              el.focus();
            }, 0);
          }
        } else {
          this.$emit("send", {
            type: 3,
            text: data.value
          });
        }

        this.$refs.popoverEmoticon.doClose();
      },

      reloadEmoticon() {
        this.$refs.editorEmoticon.loadUserEmoji();
      }
    }
  };

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
    background-color: rgba(31, 35, 41, .9);
    color: white;
    min-width: 30px;
    font-size: 10px;
    padding: 0 5px;
    border-radius: 2px;
    white-space: pre;
    text-align: center;
    user-select: none;
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
  }

  textarea::-webkit-scrollbar {
    width: 4px;
    height: 1px;
  }

  textarea::-webkit-scrollbar-thumb {
    background: #d5cfcf;
  }

  textarea::-webkit-scrollbar-track {
    background: #EDEDED;
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
