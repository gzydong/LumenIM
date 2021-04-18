<template>
  <div>
    <MainLayout :idx="2">
      <el-container slot="container" class="note-container">
        <!-- 左侧工具栏 -->
        <el-aside width="230px" class="el-aside-one lum-scrollbar">
          <el-header class="btn-header">
            <el-dropdown
              class="btn-dropdown-menu"
              split-button
              type="primary"
              @click="insterNote"
              @command="handleCommand"
            >
              <span>+ 添加笔记</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">新建笔记</el-dropdown-item>
                <el-dropdown-item command="b">新建分类</el-dropdown-item>
                <el-dropdown-item command="c">新建标签</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-header>

          <div class="note-headline">我的笔记</div>

          <el-scrollbar :native="false" tag="section" class="note-aside">
            <div v-for="(menu, i) in menus" :key="i">
              <div
                class="note-list-first"
                :class="{ 'note-list-active': menu.isActive }"
                @click="clickNoteMenu(1, i)"
                @contextmenu.prevent="noteClassMenu($event, i)"
              >
                <i
                  class="iconfont"
                  :class="menu.icon"
                  :style="{ color: menu.color }"
                />
                <span>{{ menu.name }}</span>
                <i
                  v-show="menu.submenus.length"
                  class="iconfont icon-menu-nav"
                  :class="{
                    'icon-tubiao-': !menu.isShowSub,
                    'icon-shangla': menu.isShowSub,
                  }"
                />
              </div>

              <div
                v-for="(submenu, i2) in menu.submenus"
                v-show="menu.isShowSub"
                :key="i2"
                class="note-list-two"
                :class="{ 'note-list-active': submenu.isActive }"
                @click="clickNoteMenu(2, i, i2)"
                @contextmenu.prevent="noteClassMenu($event, i, i2)"
              >
                <p v-if="submenu.isEdit">
                  <input
                    v-focus
                    :value="submenu.name"
                    type="text"
                    @keyup.enter="editNoteMenu($event, i, i2)"
                    @blur="editNoteMenu($event, i, i2)"
                  />
                </p>
                <p v-else>
                  <i class="iconfont icon-dian" />
                  <span>{{ submenu.name }}</span>
                  <span v-if="submenu.count">({{ submenu.count }})</span>
                </p>
              </div>
            </div>
          </el-scrollbar>
        </el-aside>

        <!-- 笔记列表栏 -->
        <el-aside width="350px" class="el-aside-two">
          <div class="search-header">
            <i class="iconfont icon-sousuo" />
            <input
              type="text"
              placeholder="搜索我的笔记 ..."
              maxlength="30"
              ref="querykeywords"
              @keyup.enter="queryNote"
            />
          </div>

          <div class="title-header">
            <span>{{ notes.length }} 篇笔记</span>
            <span v-if="loadNoteStatus == 0" class="load-span">
              <i class="el-icon-loading" /> 加载中 ...
            </span>
            <span v-else class="load-span">
              <i class="iconfont icon-icon- sort-icon" />
            </span>
          </div>

          <div class="article-main">
            <template v-if="notes.length == 0">
              <div class="note-empty">
                <SvgNoteBook class="svg-notebook" />
                <p style="font-size: 12px; text-align: center; color: #b6afaf">
                  笔记空空如也，赶快<el-button type="text" @click="insterNote"
                    >添加笔记</el-button
                  >吧...
                </p>
              </div>
            </template>
            <template v-else>
              <el-scrollbar :native="false" tag="section" class="full-height">
                <div
                  v-for="(note, i) in notes"
                  class="article-row"
                  :class="{
                    'active-row': note.id == noteDetail.loadId,
                  }"
                  :key="note.id"
                  @contextmenu.prevent="noteListMenu($event, i, note)"
                >
                  <div class="article-title" @click="catNote(note)">
                    <span>{{ note.title }}</span>
                  </div>

                  <div class="article-items" @click="catNote(note)">
                    <div
                      class="article-item"
                      :class="{ 'item-image': note.img != '' }"
                    >
                      <div class="article-date">
                        <span>{{ note.datetime }}</span>
                        <span>{{ note.classify }}</span>
                      </div>
                      <div class="article-abstract">
                        {{ note.abstract.replace(/[\r\n]/g, '') }}
                      </div>
                    </div>
                    <div v-show="note.img" class="article-image">
                      <el-image fit="cover" :src="note.img" />
                    </div>
                  </div>

                  <div class="article-tool">
                    <i
                      v-show="note.status == 1"
                      class="el-icon-edit-outline"
                      @click="catNote(note, true)"
                    />
                    <i
                      v-show="note.status == 2"
                      class="recover-note el-icon-refresh-left"
                      @click="noteRecover(note.id)"
                    />
                    <i
                      v-if="note.status == 1"
                      class="el-icon-delete"
                      @click="noteRecycle(note.id, note.title)"
                    />
                    <i
                      v-else
                      class="el-icon-delete"
                      slot="reference"
                      @click="noteDelete(note.id, note.title)"
                    />
                  </div>
                </div>
              </el-scrollbar>
            </template>
          </div>
        </el-aside>

        <!-- 右侧文章栏 -->
        <el-main
          v-if="loadStatus == -1 || loadStatus == 0 || loadStatus == 2"
          class="el-main-content"
        >
          <div v-if="loadStatus == -1" class="empty-note">
            <SvgNote />
            <p v-if="notes.length == 0">你的笔记空空如也</p>
            <p v-else style="line-height: 25px">
              这个社会，是赢家通吃，输者一无所有，<br />社会，永远都是只以成败论英雄。
            </p>
          </div>
          <div v-else-if="loadStatus == 0" class="loading-note">
            <div class="ant-spin ant-spin-lg ant-spin-spinning">
              <span class="ant-spin-dot ant-spin-dot-spin">
                <i class="ant-spin-dot-item" />
                <i class="ant-spin-dot-item" />
                <i class="ant-spin-dot-item" />
                <i class="ant-spin-dot-item" />
              </span>
            </div>
            <p>正在努力加载中 ...</p>
          </div>
          <div v-else class="empty-note">
            <SvgNote icon-class="note" />
            <p class="pointer" @click="reloadCatNote">
              加载笔记失败，点击重试 ...
            </p>
          </div>
        </el-main>
        <el-main
          v-else
          class="el-main-content"
          :class="{ 'fullscreen-mode': markdown.isFull }"
        >
          <el-container class="full-height">
            <!-- 编辑模块 -->
            <template v-if="markdown.isEdit">
              <el-container>
                <el-header id="note-header" height="61px">
                  <i class="el-icon-edit" />
                  <input
                    v-model="noteDetail.title"
                    type="text"
                    placeholder="笔记标题不能为空..."
                  />
                </el-header>
                <el-main class="no-padding full-height ov-hidden">
                  <mavon-editor
                    ref="mavonEditor"
                    v-model="markdown.mdText"
                    :toolbars="markdown.toolbars"
                    :subfield="false"
                    :ishljs="false"
                    :boxShadow="false"
                    :externalLink="false"
                    fontSize="14px"
                    previewBackground="#fff"
                    placeholder="请输入您的笔记正文 ..."
                    class="editor full-height"
                    @change="$editorChange"
                    @imgAdd="$editorUploadImage"
                    @save="$editorSave"
                  />
                </el-main>
              </el-container>
            </template>

            <!-- 阅读模块 -->
            <template v-else>
              <el-container>
                <el-header id="note-header" height="61px">
                  {{ noteDetail.title }}
                </el-header>
                <el-main class="no-padding">
                  <div id="note-detail">
                    <el-scrollbar
                      class="full-height"
                      tag="section"
                      :native="false"
                    >
                      <div
                        v-html="noteDetail.html"
                        v-code
                        id="note-info"
                        class="markdown-body"
                      />
                    </el-scrollbar>
                  </div>
                </el-main>
              </el-container>
            </template>

            <!-- 右侧工具栏 -->
            <el-aside width="50px" id="note-tools">
              <div class="item" @click="markdown.isFull = !markdown.isFull">
                <i class="el-icon-full-screen" />
                <p>{{ markdown.isFull ? '取消全屏' : '全屏' }}</p>
              </div>

              <div
                v-if="noteDetail.status == 2"
                class="item"
                @click="noteRecover(noteDetail.id)"
              >
                <i class="el-icon-refresh-left" />
                <p>恢复</p>
              </div>
              <div
                v-else-if="editNoteStatus == 1"
                class="item"
                @click="editNote(1)"
              >
                <i class="el-icon-loading" />
                <p>保存中..</p>
              </div>
              <div
                v-else-if="markdown.isEdit && !isEdited"
                class="item"
                @click="cancelEdit"
              >
                <i class="el-icon-edit-outline" />
                <p>取消</p>
              </div>
              <div
                v-else-if="markdown.isEdit"
                class="item"
                @click="editNote(1)"
              >
                <i class="el-icon-edit-outline" />
                <p>保存</p>
              </div>
              <div class="item" v-else @click="openEditMode()">
                <i class="el-icon-edit-outline" />
                <p>编辑</p>
              </div>

              <div
                v-show="noteDetail.id && noteDetail.status == 1"
                v-popover:tagManager
                class="item"
              >
                <i
                  class="el-icon-collection-tag"
                  :class="{ 'i-color': noteDetail.tags.length }"
                />
                <p>标签</p>
              </div>

              <div
                v-show="noteDetail.id && noteDetail.status == 1"
                class="item"
                @click="setAsterisk"
              >
                <i
                  :class="
                    noteDetail.is_asterisk == 1
                      ? 'el-icon-star-on i-color'
                      : 'el-icon-star-off'
                  "
                />
                <p>星标</p>
              </div>

              <div v-show="noteDetail.id" v-popover:annexlist class="item">
                <i class="el-icon-link" :class="{ 'i-color': files.length }" />
                <p>附件</p>
              </div>

              <el-tooltip
                v-show="noteDetail.id && noteDetail.status == 1"
                effect="dark"
                content="分享笔记给我的联系人"
                placement="left"
              >
                <div class="item" @click="shareNode">
                  <i class="el-icon-share" />
                  <p>分享</p>
                </div>
              </el-tooltip>

              <el-tooltip
                v-show="noteDetail.id && noteDetail.status == 1"
                effect="dark"
                content="下载笔记，md格式"
                placement="left"
              >
                <div class="item" @click="noteDownload">
                  <i class="el-icon-download" />
                  <p>下载</p>
                </div>
              </el-tooltip>

              <el-tooltip
                v-show="noteDetail.id && noteDetail.status == 1"
                effect="dark"
                content="30天内可在笔记回收站中恢复"
                placement="left"
              >
                <div
                  class="item"
                  @click="noteRecycle(noteDetail.id, noteDetail.title)"
                >
                  <i class="el-icon-delete" />
                  <p>回收站</p>
                </div>
              </el-tooltip>

              <el-tooltip
                v-show="noteDetail.id && noteDetail.status == 2"
                effect="dark"
                content="从回收站中永久删除,删除后无法恢复"
                placement="left"
              >
                <div
                  class="item"
                  @click="noteDelete(noteDetail.id, noteDetail.title)"
                >
                  <i class="el-icon-delete" />
                  <p>删除</p>
                </div>
              </el-tooltip>

              <!-- 笔记附件弹出层 -->
              <el-popover
                ref="annexlist"
                placement="left-start"
                trigger="click"
              >
                <NoteAnnexBox :id="noteDetail.id" :fileList="files" />
              </el-popover>

              <!-- 笔记标签弹出层 -->
              <el-popover
                ref="tagManager"
                placement="left-start"
                width="300"
                trigger="click"
              >
                <NoteTagBox
                  :id="noteDetail.id"
                  :tagsList="tags"
                  @create="
                    tag => {
                      this.menus[3].submenus.push(tag)
                    }
                  "
                />
              </el-popover>
            </el-aside>
          </el-container>
        </el-main>
      </el-container>
    </MainLayout>

    <!-- 笔记附件回收站 -->
    <NoteAnnexRecycle v-if="recycleAnnexBox" @close="recycleAnnexBox = false" />

    <!-- 选择联系人窗口 -->
    <UserContacts
      v-show="selectContactsBox"
      @close="selectContactsBox = false"
      @confirm="confirmSelectContacts"
    />
  </div>
</template>
<script>
import MainLayout from '@/views/layout/MainLayout'
import NoteAnnexRecycle from '@/components/note/NoteAnnexRecycle'
import UserContacts from '@/components/chat/UserContacts'
import NoteAnnexBox from '@/components/note/NoteAnnexBox'
import NoteTagBox from '@/components/note/NoteTagBox'
import { SvgNoteBook, SvgNote } from '@/core/icons'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import PreCode from '@/directive/PreCode'
import {
  ServeGetArticleClass,
  ServeGetArticleTag,
  ServeGetArticleList,
  ServeGetArticleDetail,
  ServeEditArticleClass,
  ServeEditArticleTag,
  ServeEditArticle,
  ServeDeleteArticleClass,
  ServeDeleteArticleTag,
  ServeArticleClassSort,
  ServeMergeArticleClass,
  ServeMoveArticle,
  ServeUploadArticleImg,
  ServeSetAsteriskArticle,
  ServeRecoverArticle,
  ServeDeleteArticle,
  ServeForeverDeleteArticle,
} from '@/api/article'
import { parseTime } from '@/utils/functions'

export default {
  name: 'NotePage',
  components: {
    MainLayout,
    mavonEditor,
    NoteAnnexRecycle,
    UserContacts,
    SvgNoteBook,
    SvgNote,
    NoteAnnexBox,
    NoteTagBox,
  },
  directives: {
    code: PreCode,
  },
  data() {
    return {
      menus: [
        {
          name: '近期笔记',
          icon: 'icon-jinqiyulan',
          color: 'rgb(255, 181, 169)',
          isShowSub: false,
          isActive: true,
          submenus: [],
        },
        {
          name: '星标笔记',
          icon: 'icon-xingxing1',
          color: '#ffc152',
          isShowSub: false,
          isActive: false,
          submenus: [],
        },
        {
          name: '分类笔记',
          icon: 'icon-biji8',
          color: '#5ba0ff',
          isShowSub: true,
          isActive: false,
          submenus: [],
        },
        {
          name: '标签夹',
          icon: 'icon-biaoqian5',
          color: '#5ba0ff',
          isShowSub: false,
          isActive: false,
          submenus: [],
        },
        {
          name: '回收站',
          icon: 'el-icon-delete',
          color: '#fd6f41',
          isShowSub: false,
          isActive: false,
          submenus: [
            {
              name: '笔记回收站',
              icon: 'icon-dian',
              isActive: false,
            },
            {
              name: '附件回收站',
              icon: 'icon-dian',
              isActive: false,
            },
          ],
        },
      ],

      // 笔记列表
      loadNoteStatus: 0,
      notes: [],

      // 笔记详情
      loadStatus: -1,
      editNoteStatus: 0,
      noteDetail: {
        loadId: 0,
        id: 0,
        title: '',
        tags: [],
        class_id: 0,
        content: '',
        html: '',
        is_asterisk: 0,
        status: 1,
        created_at: '',
      },
      files: [],
      tags: [],

      // 编辑器相关信息
      markdown: {
        mdText: '',
        htmlText: '',
        isEdit: false,
        isFull: false, //是否全屏模式
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

      recycleAnnexBox: false,
      selectContactsBox: false,
    }
  },
  computed: {
    isEdited() {
      return this.markdown.mdText || this.noteDetail.title ? true : false
    },
  },
  mounted() {
    this.loadNoteClass()
    this.loadNoteTags()
    this.loadNoteList()
  },
  methods: {
    // 加载笔记详情信息
    loadNoteDetail(id, isEdit) {
      this.markdown.isEdit = false
      ServeGetArticleDetail({
        article_id: id,
      })
        .then(res => {
          if (res.code == 200 && this.noteDetail.loadId == id) {
            this.loadStatus = 1
            this.noteDetail.id = res.data.id
            this.noteDetail.loadId = res.data.id
            this.noteDetail.content = res.data.md_content
            this.noteDetail.html = res.data.content
            this.noteDetail.title = res.data.title
            this.noteDetail.created_at = res.data.created_at
            this.noteDetail.class_id = res.data.class_id
            this.noteDetail.is_asterisk = res.data.is_asterisk
            this.noteDetail.tags = res.data.tags
            this.noteDetail.status = res.data.status
            this.markdown.mdText = this.noteDetail.content

            let ids = res.data.tags.map(item => item.id)
            this.files = res.data.files
            this.tags = this.menus[3].submenus.map(item => {
              return {
                id: item.id,
                name: item.name,
                isSelectd: ids.includes(item.id),
              }
            })

            if (isEdit) {
              this.markdown.isEdit = true
            }
          } else if (res.code !== 200 && this.noteDetail.loadId == id) {
            this.loadStatus = 2
          }
        })
        .catch(() => {
          if (this.noteDetail.loadId == id) {
            this.loadStatus = 2
          }
        })
    },

    // 加载标签列表
    loadNoteTags() {
      ServeGetArticleTag().then(res => {
        if (res.code != 200) return false

        this.menus[3].submenus = res.data.tags.map(item => {
          return {
            id: item.id,
            name: item.tag_name,
            icon: 'icon-dian',
            count: item.count,
            isEdit: false,
            isDefault: 0,
            isActive: false,
          }
        })
      })
    },

    // 加载文章列表
    loadNoteList() {
      let data = {
        page: 1,
        keyword: '',
        find_type: '',
        cid: '',
      }

      let [i1, i2] = this.getSelectMenu()
      if (i1 == 0) {
        data.find_type = 1
      } else if (i1 == 1) {
        data.find_type = 2
      } else if (i1 == 2) {
        data.find_type = 3
        data.cid = this.menus[2].submenus[i2].id
      } else if (i1 == 3) {
        data.find_type = 4
        let cid = this.menus[3].submenus[i2].id
        data.cid = cid
      } else if (i1 == 4) {
        data.find_type = 5
      } else if (i1 == -1) {
        data.keyword = this.$refs.querykeywords.value.trim()
        data.find_type = 6
      }

      this.loadNoteStatus = 0
      ServeGetArticleList(data)
        .then(res => {
          this.loadNoteStatus = 1

          if (res.code !== 200) return false

          this.notes = res.data.rows.map(item => {
            return {
              id: item.id,
              title: item.title,
              datetime: parseTime(item.updated_at, '{y}/{m}/{d}'),
              classify: item.class_name || '我的笔记',
              abstract: item.abstract,
              img: item.image,
              class_id: item.class_id,
              status: item.status,
            }
          })
        })
        .catch(() => {
          this.loadNoteStatus = 1
        })
    },

    // 加载笔记分类列表
    loadNoteClass(class_id = null) {
      ServeGetArticleClass().then(res => {
        if (res.code != 200) return false

        this.menus[2].submenus = res.data.rows.map(item => {
          return {
            id: item.id,
            name: item.class_name,
            icon: 'icon-dian',
            count: item.count,
            isEdit: false,
            isDefault: item.is_default,
            isActive: class_id == item.id,
          }
        })
      })
    },

    // 添加或编辑笔记信息
    editNote(type = 1) {
      let data = this.getEditData()
      if (data.title == '') {
        this.$message('笔记标题不能为空!')
        return false
      }

      if (data.md_content == '' || data.content == '') {
        this.$message('笔记内容不能为空!')
        return false
      }

      this.editNoteStatus = 1
      ServeEditArticle(data)
        .then(res => {
          if (res.code == 200) {
            if (data.article_id == 0) {
              this.loadNoteList()
              this.loadNoteClass(data.class_id)
            }

            this.noteDetail.id = res.data.aid
            this.noteDetail.loadId = res.data.aid
            this.noteDetail.content = data.md_content
            this.noteDetail.html = data.content

            if (type == 1) {
              this.markdown.isEdit = false
            }
          }
        })
        .finally(() => {
          this.editNoteStatus = 0
        })
    },

    // 获取当前编辑笔记相关信息
    getEditData() {
      return {
        article_id: this.noteDetail.id,
        class_id: this.noteDetail.class_id,
        title: this.noteDetail.title,
        md_content: this.markdown.mdText,
        content: this.markdown.htmlText,
      }
    },

    // 切换当前编辑模式
    openEditMode() {
      this.markdown.isEdit = true
    },

    // 查看笔记详情
    catNote(info, isEdit = false) {
      this.loadStatus = 0
      this.noteDetail.loadId = info.id
      this.loadNoteDetail(info.id, isEdit)
    },

    // 重新加载当前查看的笔记
    reloadCatNote() {
      this.loadNoteDetail(this.noteDetail.loadId)
    },

    // 文章列表移除指定的文章
    removeListNote(id) {
      this.notes.splice(
        this.notes.findIndex(item => item.id === id),
        1
      )
    },

    // 编辑器修改信息触发事件
    $editorChange(value, render) {
      this.markdown.mdText = value
      this.markdown.htmlText = render
    },

    // 编辑器保存信息触发事件
    $editorSave(value, render) {
      this.editNote(2)
    },

    // 编辑器上传图片触发事件
    $editorUploadImage(pos, file) {
      let formdata = new FormData()
      formdata.append('image', file)

      let save_path = ''
      ServeUploadArticleImg(formdata)
        .then(res => {
          save_path = res.data.save_path || ''
        })
        .finally(() => {
          this.$refs.mavonEditor.$img2Url(pos, save_path)
        })
    },

    // 左侧菜单栏点击事件
    clickNoteMenu(type, index, index2 = -1) {
      if (type == 1 && (index == 2 || index == 3 || index == 4)) {
        this.menus[index].isShowSub = !this.menus[index].isShowSub
        return
      }

      // 点击查看附件回收站事件
      if (index == 4 && index2 != 0) {
        this.recycleAnnexBox = true
        return
      }

      this.setSelectMenu(index, index2)
      this.loadNoteList()
      this.$refs.querykeywords.value = ''
    },

    // 添加新的笔记
    insterNote() {
      let [i1, i2] = this.getSelectMenu()
      if (i1 != 2) {
        i1 = 2
        i2 = this.defaultNoteClassIdx()
        this.setSelectMenu(i1, i2)
        this.loadNoteList()
      }

      this.loadStatus = 1
      this.openEditMode()
      this.resetNoteEmpty()
      this.noteDetail.class_id = this.menus[i1].submenus[i2].id
    },

    cancelEdit() {
      this.loadStatus = -1
      this.resetNoteEmpty()
    },

    // 重置清空笔记信息
    resetNoteEmpty() {
      this.noteDetail.id = 0
      this.noteDetail.loadId = 0
      this.noteDetail.content = ''
      this.noteDetail.html = ''
      this.noteDetail.title = ''
      this.noteDetail.tags = []
      this.noteDetail.is_asterisk = 0
      this.noteDetail.class_id = 0
      this.noteDetail.status = 1
      this.files = []
      this.tags = []
      this.markdown.mdText = ''
      this.markdown.htmlText = ''
    },

    // 回车修改分类名
    editNoteMenu(e, i, i2) {
      let item = this.menus[i].submenus[i2]
      let name = e.target.value.trim()

      if (name == '' && item.id == null) {
        return this.$delete(this.menus[i].submenus, i2)
      } else if (name && item.name == name) {
        return (this.menus[i].submenus[i2].isEdit = false)
      }

      if (i == 2) {
        ServeEditArticleClass({
          class_id: item.id || 0,
          class_name: name,
        }).then(res => {
          if (res.code == 200) {
            this.menus[i].submenus[i2].id = res.data.id
            this.menus[i].submenus[i2].name = name
            this.menus[i].submenus[i2].isEdit = false
          }
        })
      } else {
        ServeEditArticleTag({
          tag_id: item.id || 0,
          tag_name: name,
        }).then(res => {
          if (res.code == 200) {
            this.menus[i].submenus[i2].id = res.data.id
            this.menus[i].submenus[i2].name = name
            this.menus[i].submenus[i2].isEdit = false
          }
        })
      }
    },

    // 笔记分类的自定义右键菜单栏
    noteClassMenu(event, i, i2 = null) {
      if (!(i == 2 || i == 3)) return

      let menu = []
      if (i == 2 && i2 == null) {
        menu = [
          {
            label: '重新加载',
            icon: 'el-icon-refresh',
            onClick: () => {
              this.menus[2].submenus = []
              this.loadNoteClass()
            },
          },
          {
            label: '添加分类',
            icon: 'el-icon-circle-plus-outline',
            onClick: () => {
              this.menus[i].isShowSub = true
              this.menus[i].submenus.unshift({
                id: null,
                name: '',
                icon: 'icon-dian',
                count: 0,
                isEdit: true,
                isActive: false,
                isDefault: 0,
              })
            },
          },
        ]
      } else if (i == 2 && i2 >= 0) {
        menu = [
          {
            label: '添加笔记',
            icon: 'el-icon-circle-plus-outline',
            onClick: () => {
              let [first_idx, last_idx] = this.getSelectMenu()
              if (first_idx != i || last_idx != i2) {
                this.setSelectMenu(i, i2)
                this.loadNoteList()
              }

              this.insterNote()
            },
          },
          {
            label: '重命名',
            icon: 'el-icon-edit-outline',
            disabled: this.menus[i].submenus[i2].isDefault == 1,
            onClick: () => {
              this.menus[i].submenus[i2].isEdit = true
            },
          },
          {
            label: '删除分类',
            icon: 'el-icon-delete',
            disabled:
              this.menus[i].submenus[i2].isDefault == 1 ||
              this.menus[i].submenus[i2].count > 0,
            onClick: () => {
              ServeDeleteArticleClass({
                class_id: this.menus[i].submenus[i2].id,
              }).then(res => {
                if (res.code == 200) {
                  this.$delete(this.menus[i].submenus, i2)
                }
              })
            },
          },
          {
            label: '向上移动',
            icon: 'el-icon-top',
            onClick: () => {
              if (i2 > 0) {
                let item1 = this.menus[i].submenus[i2 - 1]
                let item2 = this.menus[i].submenus[i2]
                ServeArticleClassSort({
                  class_id: this.menus[i].submenus[i2].id,
                  sort_type: 2,
                }).then(res => {
                  if (res.code == 200) {
                    this.$set(this.menus[i].submenus, i2 - 1, item2)
                    this.$set(this.menus[i].submenus, i2, item1)
                  }
                })
              }
            },
          },
          {
            label: '向下移动',
            icon: 'el-icon-bottom',
            onClick: () => {
              if (i2 < this.menus[i].submenus.length - 1) {
                let item1 = this.menus[i].submenus[i2 + 1]
                let item2 = this.menus[i].submenus[i2]
                ServeArticleClassSort({
                  class_id: this.menus[i].submenus[i2].id,
                  sort_type: 1,
                }).then(res => {
                  if (res.code == 200) {
                    this.$set(this.menus[i].submenus, i2 + 1, item2)
                    this.$set(this.menus[i].submenus, i2, item1)
                  }
                })
              }
            },
          },
          {
            label: '合并分类至',
            icon: 'el-icon-s-help',
            minWidth: 200,
            children: this.menus[2].submenus.map(item => {
              return {
                label: item.name,
                disabled: item.id == this.menus[i].submenus[i2].id,
                onClick: () => {
                  ServeMergeArticleClass({
                    class_id: this.menus[i].submenus[i2].id,
                    toid: item.id,
                  }).then(res => {
                    if (res.code == 200) {
                      this.loadNoteClass()
                    }
                  })
                },
              }
            }),
          },
        ]
      } else if (i == 3 && i2 == null) {
        menu = [
          {
            label: '重新加载',
            icon: 'el-icon-refresh',
            onClick: () => {
              this.menus[3].submenus = []
              this.loadNoteTags()
            },
          },
          {
            label: '添加标签',
            icon: 'el-icon-circle-plus-outline',
            onClick: () => {
              this.menus[i].isShowSub = true
              this.menus[i].submenus.unshift({
                id: null,
                name: '',
                icon: 'icon-dian',
                count: 0,
                isEdit: true,
                isActive: false,
                isDefault: 0,
              })
            },
          },
        ]
      } else if (i == 3 && i2 >= 0) {
        menu = [
          {
            label: '重命名',
            icon: 'el-icon-edit-outline',
            onClick: () => {
              this.menus[i].submenus[i2].isEdit = true
            },
          },
          {
            label: '删除标签',
            icon: 'el-icon-delete',
            disabled: this.menus[i].submenus[i2].count > 0,
            onClick: () => {
              ServeDeleteArticleTag({
                tag_id: this.menus[i].submenus[i2].id,
              }).then(res => {
                if (res.code == 200) {
                  this.$delete(this.menus[i].submenus, i2)
                }
              })
            },
          },
        ]
      }

      this.$contextmenu({
        items: menu,
        event,
        zIndex: 999,
        minWidth: 150,
      })

      return false
    },

    // 笔记列表的右键自定义菜单栏
    noteListMenu(event, i, note) {
      if (note.status == 2) return false

      this.$contextmenu({
        items: [
          {
            label: '编辑笔记',
            icon: 'el-icon-edit-outline',
            onClick: () => {
              this.catNote(note, true)
            },
          },
          {
            label: '删除笔记',
            icon: 'el-icon-delete',
            divided: true,
            onClick: () => {
              this.noteRecycle(note.id, note.title)
            },
          },
          {
            label: '笔记移动至',
            icon: 'el-icon-location',
            minWidth: 200,
            children: this.menus[2].submenus.map(item => {
              return {
                label: item.name,
                disabled: note.class_id == item.id,
                onClick: () => {
                  ServeMoveArticle({
                    article_id: note.id,
                    class_id: item.id,
                  }).then(res => {
                    if (res.code == 200) {
                      this.$delete(this.notes, i)
                      this.loadNoteClass()
                    }
                  })
                },
              }
            }),
          },
        ],
        event,
        zIndex: 3,
        minWidth: 150,
      })

      return false
    },

    handleCommand(command) {
      if (command == 'a') {
        this.insterNote()
      } else if (command == 'b') {
        this.menus[2].isShowSub = true
        this.menus[2].submenus.unshift({
          id: null,
          name: '',
          icon: 'icon-dian',
          count: 0,
          isEdit: true,
          isDefault: 0,
          isActive: false,
        })
      } else if (command == 'c') {
        this.menus[3].isShowSub = true
        this.menus[3].submenus.unshift({
          id: null,
          name: '',
          icon: 'icon-dian',
          count: 0,
          isEdit: true,
          isDefault: 0,
          isActive: false,
        })
      }
    },

    // 设置笔记是否标记星号状态
    setAsterisk() {
      let type = this.noteDetail.is_asterisk == 1 ? 2 : 1
      ServeSetAsteriskArticle({
        article_id: this.noteDetail.id,
        type: type,
      }).then(res => {
        if (res.code == 200) {
          this.noteDetail.is_asterisk = type == 1 ? 1 : 0
        }
      })
    },

    // 获取默认笔记分类的索引
    defaultNoteClassIdx() {
      return this.menus[2].submenus.findIndex(item => {
        return item.isDefault == 1
      })
    },

    // 获取当前查看的笔记ID
    getArticleId() {
      return this.noteDetail.loadId
    },

    // 关键词查询笔记
    queryNote() {
      if (this.$refs.querykeywords.value.trim()) {
        this.setSelectMenu(-1, -1)
      } else {
        this.setSelectMenu(0, -1)
      }

      this.loadNoteList()
    },

    // 设置当前选中的菜单选项
    setSelectMenu(index1, index2) {
      this.menus.map((item, i) => {
        item.isActive = i == index1 && index2 == -1

        item.submenus.map((item2, i2) => {
          item2.isActive = i == index1 && index2 == i2
          return item2
        })

        return item
      })
    },

    // 获取当前选中的菜单选项
    getSelectMenu() {
      for (let [i, item] of this.menus.entries()) {
        if (item.isActive) return [i, -1]

        if (!item.submenus) continue

        for (let [i2, item2] of item.submenus.entries()) {
          if (item2.isActive) return [i, i2]
        }
      }

      return [-1, -1]
    },

    // 分享笔记给我的朋友
    shareNode() {
      this.selectContactsBox = true
    },

    // 分享好友确认按钮
    confirmSelectContacts(value) {
      this.selectContactsBox = false
      this.$notify({
        message: '功能研发中...',
      })
    },

    // 获取分类ID
    getNoteClassName(class_id) {
      let idx = this.menus[2].submenus.findIndex(item => {
        return item.id == class_id
      })

      if (idx == -1) return '未知'

      return this.menus[2].submenus[idx].name
    },

    // 下载笔记（md格式）
    noteDownload() {
      let reader = new FileReader()
      let title = this.noteDetail.title + '.md'
      let blob = new Blob([this.noteDetail.content], {
        type: 'text/plain',
      })

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

    // 笔记移至回收站
    noteRecycle(id, title) {
      this.$alert(`您确定要删除【${title}】笔记至回收站吗？`, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
        customClass: 'border-radius0',
        closeOnClickModal: true,
        callback: action => {
          if (action == 'confirm') {
            ServeDeleteArticle({
              article_id: id,
            }).then(res => {
              if (res.code == 200) {
                this.removeListNote(id)
                this.loadNoteClass()
                if (id == this.noteDetail.id) {
                  this.loadStatus = -1
                  this.resetNoteEmpty()
                }
              }
            })
          }
        },
      })
    },

    // 笔记从回收站中永久删除
    noteDelete(id, title) {
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
                article_id: id,
              }).then(res => {
                if (res.code == 200) {
                  this.removeListNote(id)

                  if (id == this.noteDetail.id) {
                    this.loadStatus = -1
                    this.resetNoteEmpty()
                  }

                  this.$notify({
                    title: '删除成功',
                    message: `笔记【${title}】已删除...`,
                    type: 'success',
                  })
                }
              })
            }
          },
        }
      )
    },

    // 恢复回收站中的笔记
    noteRecover(id) {
      ServeRecoverArticle({
        article_id: id,
      }).then(res => {
        if (res.code == 200) {
          this.removeListNote(id)
          this.loadNoteClass()

          if (id == this.noteDetail.id) {
            this.noteDetail.status = 1
          }

          this.$notify({
            title: '成功',
            message: '笔记已成功恢复...',
            type: 'success',
          })
        }
      })
    },
  },
}
</script>
<style scoped lang="less">
@import '~@/assets/css/markdown.css';
@import '~@/assets/css/page/note-page.less';
</style>
