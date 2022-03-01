<template>
  <div id="note-preview" :class="{ 'full-screen': fullscreen }">
    <div v-if="mode == 0" class="empty-mode">
      <SvgNote />
      <p>
        <span>这个社会，是赢家通吃，输者一无所有，</span>
        <br />
        <span>社会，永远都是只以成败论英雄。</span>
      </p>
    </div>
    <div v-else-if="loadStatus == 0" class="empty-mode">
      <Loading />
    </div>
    <div v-else class="other-mode">
      <el-container class="ov-hidden full-height">
        <el-main class="no-padding">
          <!-- 编辑器模式 -->
          <el-container
            v-if="mode == 2"
            class="full-height ov-hidden editor-mode"
          >
            <el-header height="61px">
              <input
                v-model="note.title"
                type="text"
                placeholder="笔记标题不能为空..."
                @keydown.stop="handlerKeyChange"
              />
            </el-header>
            <el-main class="full-height ov-hidden no-padding">
              <mavon-editor
                ref="mavonEditor"
                v-model="note.md_content"
                :toolbars="markdown.toolbars"
                :subfield="false"
                :ishljs="false"
                :boxShadow="false"
                :externalLink="false"
                fontSize="14px"
                previewBackground="#fff"
                placeholder="请输入您的笔记正文 ..."
                class="editor full-height"
                @save="editorSave"
                @change="editorChange"
                @imgAdd="editorUploadImage"
              />
            </el-main>
          </el-container>

          <!-- 预览模式 -->
          <el-container v-else class="full-height preview-mode ov-hidden">
            <el-header height="61px" class="preview-header">
              {{ note.title }}
            </el-header>
            <el-main id="note-detail" class="ov-hidden">
              <el-scrollbar class="full-height" tag="section" :native="false">
                <div
                  v-html="note.content"
                  v-code
                  id="note-info"
                  class="markdown-body"
                />
              </el-scrollbar>
            </el-main>
          </el-container>
        </el-main>

        <!-- 右侧工具栏 -->
        <el-aside width="50px" id="note-tools" class="no-select">
          <div class="item" @click="triggerFullScreen">
            <i class="el-icon-full-screen" />
            <p>{{ fullscreen ? '取消全屏' : '全屏' }}</p>
          </div>

          <div v-if="saveStatus == 1" class="item">
            <i class="el-icon-loading" />
            <p>保存中..</p>
          </div>

          <div
            v-else-if="note.status == -1 && note.md_content.length == 0"
            @click="triggerCancel"
            class="item"
          >
            <i class="el-icon-edit-outline" />
            <p>取消</p>
          </div>

          <div
            v-else-if="
              (note.status == -1 && note.md_content.length) ||
                (note.status == 1 && mode == 2)
            "
            @click="triggerSave(true)"
            class="item"
          >
            <i class="el-icon-edit-outline" />
            <p>保存</p>
          </div>

          <div v-if="note.status == 2" @click="triggerRecover" class="item">
            <i class="el-icon-refresh-left" />
            <p>恢复</p>
          </div>

          <div
            v-if="note.status == 1 && mode == 1"
            @click="mode = 2"
            class="item"
          >
            <i class="el-icon-edit-outline" />
            <p>编辑</p>
          </div>

          <div v-show="note.status == 1" v-popover:tagmanager class="item">
            <i
              class="el-icon-collection-tag"
              :class="{ 'i-color': note.tags.length }"
            />
            <p>标签</p>
          </div>

          <div v-show="note.status == 1" @click="triggerAsterisk" class="item">
            <i v-if="note.is_asterisk == 1" class="el-icon-star-on i-color" />
            <i v-else class="el-icon-star-off" />
            <p>星标</p>
          </div>

          <div v-show="note.status == 1" v-popover:annexlist class="item">
            <i class="el-icon-link" :class="{ 'i-color': note.files.length }" />
            <p>附件</p>
          </div>

          <el-tooltip
            v-show="note.status == 1"
            effect="dark"
            content="分享笔记给我的联系人"
            placement="left"
          >
            <div class="item" @click="triggerShare">
              <i class="el-icon-share" />
              <p>分享</p>
            </div>
          </el-tooltip>

          <el-tooltip
            v-show="note.status == 1"
            effect="dark"
            content="下载笔记，md格式"
            placement="left"
          >
            <div class="item" @click="triggerDownload">
              <i class="el-icon-download" />
              <p>下载</p>
            </div>
          </el-tooltip>

          <el-tooltip
            v-show="note.status == 1"
            effect="dark"
            content="30天内可在笔记回收站中恢复"
            placement="left"
          >
            <div class="item" @click="triggerRecycle">
              <i class="el-icon-delete" />
              <p>回收站</p>
            </div>
          </el-tooltip>

          <el-tooltip
            v-show="note.status == 2"
            effect="dark"
            content="从回收站中永久删除,删除后无法恢复"
            placement="left"
          >
            <div class="item" @click="triggerDelete">
              <i class="el-icon-delete" />
              <p>删除</p>
            </div>
          </el-tooltip>

          <!-- 笔记附件弹出层 -->
          <el-popover ref="annexlist" placement="left-start" trigger="click">
            <NoteAnnexBox :id="note.id" :files="note.files" />
          </el-popover>

          <!-- 笔记标签弹出层 -->
          <el-popover
            ref="tagmanager"
            placement="left-start"
            width="300"
            trigger="click"
          >
            <NoteTagBox :note_id="note.id" :tag_ids="note.tags" />
          </el-popover>
        </el-aside>
      </el-container>
    </div>
  </div>
</template>
<script>
import {
  ServeGetArticleDetail,
  ServeSetAsteriskArticle,
  ServeUploadArticleImg,
  ServeEditArticle,
  ServeDeleteArticle,
  ServeRecoverArticle,
  ServeForeverDeleteArticle,
} from '@/api/article'
import { SvgNoteBook, SvgNote } from '@/core/icons'
import PreCode from '@/directive/PreCode'
import NoteAnnexBox from '@/components/note/NoteAnnexBox'
import NoteTagBox from '@/components/note/NoteTagBox'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import Loading from '@/components/global/Loading'
export default {
  name: 'NotePreview',
  components: {
    SvgNoteBook,
    SvgNote,
    NoteAnnexBox,
    NoteTagBox,
    mavonEditor,
    Loading,
  },
  directives: {
    code: PreCode,
  },
  data() {
    return {
      note_id: 0, // 笔记ID

      // 是否全屏显示
      fullscreen: false,

      // 渲染模式[0:空模式;1:预览模式;2:编辑模式;]
      mode: 0,

      // 数据加载状态[-1:未加载;0:加载中;1:加载成功;2:加载失败;]
      loadStatus: -1,

      //笔记保存状态[0:正常;1:保存中;]
      saveStatus: 0,

      // 笔记信息
      note: {
        id: 0,
        class_id: 0,
        title: '',
        tags: [],
        files: [],
        md_content: '',
        content: '',
        is_asterisk: 0,
        status: -1,
        created_at: '',
      },

      // 编辑器相关信息
      markdown: {
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          subfield: true,
        },
      },
    }
  },
  methods: {
    // 触发全屏或关闭全屏模式
    triggerFullScreen() {
      this.fullscreen = !this.fullscreen
    },

    handlerKeyChange(e) {
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
        this.triggerSave()
        e.preventDefault()
      }
    },

    open(note_id, isEditor = false, class_id = 0) {
      this.note_id = note_id

      if (this.note_id == 0) {
        this.triggerCancel()
        this.note.class_id = class_id
        this.mode = 2
      } else {
        this.loadData(isEditor)
      }
    },
    close() {
      this.triggerCancel()
      this.mode = 0
    },

    // 加载笔记信息
    loadData(isEditor = false) {
      this.loadStatus = 0
      let article_id = this.note_id
      ServeGetArticleDetail({
        article_id,
      })
        .then(res => {
          if (res.code != 200 || this.note_id != article_id) return false

          Object.keys(this.note).forEach(field => {
            if (res.data[field] !== undefined) {
              this.note[field] = res.data[field]
            }
          })

          this.mode = isEditor ? 2 : 1
        })
        .finally(() => {
          this.loadStatus = 1
        })
    },

    // 编辑器保存回调事件
    editorSave() {
      this.triggerSave()
    },

    // 编辑器修改回调事件
    editorChange(value, render) {
      this.note.md_content = value
      this.note.content = render
    },

    // 编辑器上传图片回调事件
    editorUploadImage(pos, file) {
      let formdata = new FormData()
      formdata.append('image', file)

      let save_path = ''
      ServeUploadArticleImg(formdata)
        .then(res => {
          save_path = res.data.url || ''
        })
        .finally(() => {
          this.$refs.mavonEditor.$img2Url(pos, save_path)
        })
    },

    // 获取当前编辑笔记相关信息
    getEditData() {
      return {
        article_id: this.note.id,
        class_id: this.note.class_id,
        title: this.note.title,
        md_content: this.note.md_content,
        content: this.note.content,
      }
    },

    // 添加或更新笔记
    triggerSave(isCloseEditor = false) {
      if (this.saveStatus == 1) return false

      let data = this.getEditData()
      if (data.title == '') {
        this.$message('笔记标题不能为空!')
        return false
      }

      if (data.md_content == '' || data.content == '') {
        this.$message('笔记内容不能为空!')
        return false
      }

      this.saveStatus = 1
      let isNewSave = data.article_id == 0

      console.log(data)

      ServeEditArticle(data)
        .then(res => {
          if (res.code != 200) return false

          this.note.id = res.data.id
          this.note.md_content = data.md_content
          this.note.content = data.content
          this.note.status = 1

          if (isCloseEditor) this.mode = 1

          if (isNewSave) {
            this.$emit('create', this.note.id)
          } else {
            this.$emit('change', {
              id: this.note.id,
              title: this.note.title,
              abstract: this.note.md_content.substr(0, 100),
            })
          }
        })
        .finally(() => {
          this.saveStatus = 0
        })
    },

    triggerCancel() {
      this.mode = 0
      this.note = {
        id: 0,
        class_id: 0,
        title: '',
        tags: [],
        files: [],
        md_content: '',
        content: '',
        is_asterisk: 0,
        status: -1,
        created_at: '',
      }
    },

    // 恢复已删除笔记
    triggerRecover() {
      let article_id = this.note.id
      ServeRecoverArticle({
        article_id,
      }).then(({ code }) => {
        if (code !== 200) return false

        this.$emit('recover', article_id)

        this.note.status = 1
        this.$notify({
          title: '成功',
          message: '笔记已成功恢复...',
          type: 'success',
        })
      })
    },

    // 下载 md 笔记
    triggerDownload() {
      let title = this.note.title + '.md'
      let blob = new Blob([this.note.md_content], {
        type: 'text/plain',
      })

      let reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = function(e) {
        let a = document.createElement('a')
        a.download = title
        a.href = e.target.result
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    },

    // 设置笔记是否标记星号状态
    triggerAsterisk() {
      let type = this.note.is_asterisk == 1 ? 2 : 1
      ServeSetAsteriskArticle({
        article_id: this.note.id,
        type: type,
      }).then(res => {
        if (res.code !== 200) return false

        this.note.is_asterisk = type == 1 ? 1 : 0
      })
    },

    // 触发笔记分享
    triggerShare() {
      this.$alert('此功能研发中...')
    },

    // 笔记删除至回收站
    triggerRecycle() {
      let article_id = this.note.id
      let title = this.note.title
      this.$alert(`您确定要删除【${title}】笔记至回收站吗？`, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
        customClass: 'border-radius0',
        closeOnClickModal: true,
        callback: action => {
          if (action == 'confirm') {
            ServeDeleteArticle({
              article_id,
            }).then(res => {
              if (res.code !== 200) return false

              this.triggerCancel()

              this.$emit('recycle', article_id)
            })
          }
        },
      })
    },

    // 删除笔记至回收站
    triggerDelete() {
      let article_id = this.note.id
      let title = this.note.title
      this.$alert(
        `您确定要永久删除【${title}】笔记吗？删除后不可恢复！`,
        '温馨提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
          customClass: 'border-radius0',
          closeOnClickModal: true,
          callback: action => {
            if (action == 'confirm') {
              ServeForeverDeleteArticle({
                article_id,
              }).then(res => {
                if (res.code !== 200) return false

                this.triggerCancel()

                this.$notify({
                  title: '删除成功',
                  message: `笔记【${title}】已删除...`,
                  type: 'success',
                })

                this.$emit('del', article_id)
              })
            }
          },
        }
      )
    },
  },
}
</script>
<style lang="less" scoped>
@import '~@/assets/css/markdown.css';

#note-detail {
  border-top: none;
  border-bottom: none;
  background: #fff;
  height: 100%;
  padding: 0 5px;

  .markdown-body {
    padding: 20px;
    font-size: 16px;
  }
}

#note-detail /deep/pre {
  position: relative;
  padding-top: 15px;
  background-color: #f6f8fa;
  padding-bottom: 5px;

  .fz-btn {
    position: absolute;
    right: 0px;
    top: 0px;
    min-width: 50px;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: #ecebeb;
    color: #333131;
    cursor: pointer;
    font-size: 12px;
    font-weight: 100;
    font-family: 'Microsoft YaHei';
    opacity: 0;
    visibility: hidden;
    transition: ease 1s;
  }

  .lang-name {
    position: absolute;
    right: 0;
    top: 0;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #c5b6b6;
    font-size: 12px;
  }

  code {
    display: block;
    max-width: auto;
    margin: 0;
    overflow: visible;
    line-height: inherit;
    word-wrap: normal;
    background-color: initial;
    border: 0;
    overflow-x: auto;
    padding-bottom: 10px;
  }

  &:hover {
    .fz-btn {
      opacity: 1;
      visibility: visible;
    }

    .lang-name {
      display: none;
    }
  }
}

#note-detail /deep/p code {
  padding: 2px 4px;
  color: #c7254e;
  background-color: #ffe8e8;
  margin: 0 3px;
  white-space: nowrap;
  border-radius: 2px;
}

#note-detail /deep/.token.important,
#note-detail /deep/.token.bold {
  font-weight: unset;
}

#note-preview {
  &.full-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }

  width: 100%;
  height: 100%;
  background: white;
}

.empty-mode,
.other-mode {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.empty-mode {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > p {
    text-align: center;
    font-size: 12px;
    color: #b9b4b4;
  }
}

.editor-mode,
.preview-mode {
  /deep/.el-header {
    border-bottom: 1px solid #efecec;

    input {
      width: 90%;
      height: 40px;
      margin-top: 8px;
      margin-left: -8px;
      font-size: 18px;
      padding: 3px;
      margin-left: 10px;

      &::-webkit-input-placeholder {
        color: rgb(158, 150, 150);
        font-size: 14px;
      }
    }
  }
}

.preview-mode {
  .preview-header {
    line-height: 60px;
    font-size: 20px;
    font-weight: 700;
    overflow: hidden;
  }
}

#note-tools {
  border-left: 1px solid rgb(255, 255, 255);
  box-shadow: rgb(246, 245, 245) 0px 0px 6px 0px;
  padding-top: 3px;
  flex-shrink: 0;
  overflow: hidden;

  .item {
    width: 50px;
    height: 50px;
    margin: 5px auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .i-color {
      color: red;
    }

    p {
      font-size: 10px;
      margin-top: 5px;
      transform: scale(0.9);
    }

    &:hover {
      color: #409eff;
    }
  }
}
</style>
