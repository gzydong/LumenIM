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
              placement="top-end"
              @click="insertNote"
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
                  笔记空空如也，赶快<el-button type="text" @click="insertNote"
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
                    'active-row': note.id == note_id,
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

        <el-main class="no-padding">
          <NotePreview
            ref="refNotePreview"
            @create="
              note_id => {
                this.note_id = note_id
                this.loadNoteClass()
                this.loadNoteList()
              }
            "
            @recover="
              note_id => {
                this.loadNoteClass()
                this.removeListNote(note_id)
              }
            "
            @change="
              note => {
                this.notes.forEach((value, index) => {
                  if (value.id == note.id) {
                    value.title = note.title
                    value.abstract = note.abstract
                  }
                })
              }
            "
            @recycle="
              note_id => {
                this.loadNoteClass()
                this.removeListNote(note_id)
              }
            "
            @del="
              note_id => {
                this.removeListNote(note_id)
              }
            "
          />
        </el-main>
      </el-container>
    </MainLayout>

    <!-- 笔记附件回收站 -->
    <NoteAnnexRecycle v-if="recycleAnnexBox" @close="recycleAnnexBox = false" />
  </div>
</template>
<script>
import MainLayout from '@/views/layout/MainLayout'
import NoteAnnexRecycle from '@/components/note/NoteAnnexRecycle'
import { SvgNoteBook, SvgNote } from '@/core/icons'
import NotePreview from './NotePreview.vue'
import {
  ServeGetArticleClass,
  ServeGetArticleTag,
  ServeGetArticleList,
  ServeEditArticleClass,
  ServeEditArticleTag,
  ServeDeleteArticleClass,
  ServeDeleteArticleTag,
  ServeArticleClassSort,
  ServeMergeArticleClass,
  ServeMoveArticle,
  ServeRecoverArticle,
  ServeDeleteArticle,
  ServeForeverDeleteArticle,
} from '@/api/article'
import { parseTime } from '@/utils/functions'
import { mapState } from 'vuex'

export default {
  name: 'NotePage',
  components: {
    MainLayout,
    NoteAnnexRecycle,
    SvgNoteBook,
    SvgNote,
    NotePreview,
  },
  data() {
    return {
      menus: [
        {
          name: '近期编辑',
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

      // 当前查看的笔记ID
      note_id: 0,

      recycleAnnexBox: false,
    }
  },
  computed: {
    ...mapState({
      tags: state => state.note.tags,
    }),
  },
  watch: {
    tags(values) {
      this.menus[3].submenus = values.map(item => {
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
    },
  },
  mounted() {
    this.loadNoteClass()
    this.loadNoteTags()
    this.loadNoteList()
  },
  methods: {
    // 加载标签列表
    loadNoteTags() {
      ServeGetArticleTag().then(({ code, data }) => {
        if (code != 200) return false

        this.$store.commit('SET_NOTE_TAGS', data.tags)
      })
    },

    // 加载文章列表
    loadNoteList() {
      let data = {
        page: 1,
        keyword: '',
        find_type: 0,
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
        .then(({ code, data }) => {
          this.loadNoteStatus = 1

          if (code !== 200) return false

          this.notes = data.rows.map(item => {
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
      ServeGetArticleClass().then(({ code, data }) => {
        if (code != 200) return false

        this.menus[2].submenus = data.rows.map(item => {
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

    // 查看笔记详情
    catNote(info, isEditor = false) {
      this.note_id = info.id

      this.$refs.refNotePreview.open(this.note_id, isEditor)
    },

    // 文章列表移除指定的文章
    removeListNote(id) {
      let index = this.notes.findIndex(item => item.id === id)
      this.notes.splice(index, 1)
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
    insertNote() {
      let [i1, i2] = this.getSelectMenu()
      if (i1 != 2) {
        i1 = 2
        i2 = this.defaultNoteClassIdx()
        this.setSelectMenu(i1, i2)
        this.loadNoteList()
      }

      let class_id = this.menus[i1].submenus[i2].id

      this.$refs.refNotePreview.open(0, true, class_id)
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

              this.insertNote()
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
        this.insertNote()
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

    // 获取默认笔记分类的索引
    defaultNoteClassIdx() {
      return this.menus[2].submenus.findIndex(item => {
        return item.isDefault == 1
      })
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

    // 获取分类ID
    getNoteClassName(class_id) {
      let idx = this.menus[2].submenus.findIndex(item => {
        return item.id == class_id
      })

      if (idx == -1) return '未知'

      return this.menus[2].submenus[idx].name
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

                if (id == this.note_id) {
                  this.note_id = 0
                  this.$refs.refNotePreview.close()
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

                  this.$notify({
                    title: '删除成功',
                    message: `笔记【${title}】已删除...`,
                    type: 'success',
                  })

                  if (id == this.note_id) {
                    this.note_id = 0
                    this.$refs.refNotePreview.close()
                  }
                }
              })
            }
          },
        }
      )
    },

    // 恢复回收站中的笔记
    noteRecover(article_id) {
      ServeRecoverArticle({
        article_id,
      }).then(({ code }) => {
        if (code == 200) {
          this.removeListNote(article_id)
          this.loadNoteClass()

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
@import '~@/assets/css/page/note-page.less';
</style>
