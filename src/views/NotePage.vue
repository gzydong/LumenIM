<template>
  <div>
    <main-layout :idx="2">
      <el-container slot="container" class="el-container-note">
        <el-aside width="230px" class="el-aside-one lm-scrollbar ov-hidden">
          <el-header>
            <el-dropdown split-button type="primary" @click="insterNote" @command="handleCommand"
              class="btn-dropdown-menu">
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
            <div v-for="(menu,i) in menus">
              <div class="note-list-first" @click="clickNoteMenu(1,i)" :class="{'note-list-active':menu.isActive}"
                @contextmenu.prevent="noteClassMenu($event,i)">
                <i class="iconfont" :style="'color:'+menu.color" :class="menu.icon"></i>
                <span v-text="menu.name"></span>
                <i v-show="menu.submenus.length" class="iconfont icon-menu-nav"
                  :class="{'icon-tubiao-':!menu.isShowSub,'icon-shangla':menu.isShowSub}"></i>
              </div>

              <div v-if="menu.isShowSub" class="note-list-two" v-for="(submenu,i2) in menu.submenus"
                @click="clickNoteMenu(2,i,i2)" :class="{'note-list-active':submenu.isActive}"
                @contextmenu.prevent="noteClassMenu($event,i,i2)">
                <p v-if="submenu.isEdit">
                  <input :value="submenu.name" type="text" v-focus @keyup.enter="editNoteMenu($event,i,i2)"
                    @blur="editNoteMenu($event,i,i2)" />
                </p>
                <p v-else>
                  <i class="iconfont icon-dian"></i>
                  <span v-text="submenu.name"></span>
                  <span v-if="submenu.count">({{submenu.count}})</span>
                </p>
              </div>
            </div>
          </el-scrollbar>
        </el-aside>

        <el-aside width="350px" class="el-aside-two">
          <div class="search-header">
            <i class="lumen-icon-sousuo iconfont icon-sousuo"></i>
            <input type="text" placeholder="搜索我的笔记 ..." maxlength="30" ref="querykeywords" @keyup.enter="queryNote" />
          </div>
          <div class="note-count-title no-select">
            <span>{{notes.length}} 篇笔记</span>

            <span v-if="loadNoteStatus == 0" class="load-span">
              <i class="el-icon-loading"></i> 加载中 ...
            </span>
            <span v-else class="load-span">
              <i class="iconfont icon-icon- sort-icon"></i>
            </span>
          </div>

          <div class="article-container">
            <template v-if="notes.length == 0">
              <div class="note-list-empty">
                <svg-icon icon-class="note-book" class="svg-notebook" />
                <p style="font-size:12px;text-align:center;color: #b6afaf;">
                  笔记空空如也，赶快<el-button type="text" @click="insterNote">添加笔记</el-button>吧...
                </p>
              </div>
            </template>
            <template v-else>
              <el-scrollbar :native="false" tag="section" class="hv100">
                <div class="article-row" v-for="(note,i) in notes"
                  :class="{'article-row-active':note.id == noteDetail.loadId}" :key="note.id"
                  @contextmenu.prevent="noteListMenu($event,i,note)">
                  <div class="article-title" @click="catNote(note)">
                    <span v-text="note.title"></span>
                  </div>

                  <div class="article-items" @click="catNote(note)">
                    <div class="article-item" :class="{'article-item-img':note.img != ''}">
                      <div class="article-date">
                        <span v-text="note.datetime"></span>
                        <span v-text="note.classify"></span>
                      </div>
                      <div class="article-abstract" v-text="note.abstract.replace(/[\r\n]/g,'')"></div>
                    </div>
                    <div class="article-image" v-show="note.img">
                      <el-image :src="note.img" fit="cover" style="width: 100%;height: 100%;" />
                    </div>
                  </div>

                  <div class="article-tool">
                    <i class="el-icon-edit-outline" @click="catNote(note,true)" v-show="note.status == 1"></i>
                    <i class="recover-note el-icon-refresh-left" @click="noteRecover(note.id)"
                      v-show="note.status == 2"></i>
                    <i class="el-icon-delete" v-if="note.status == 1" @click="noteRecycle(note.id,note.title)"></i>
                    <i class="el-icon-delete" v-else slot="reference" @click="noteDelete(note.id,note.title)"></i>
                  </div>
                </div>
              </el-scrollbar>
            </template>
          </div>
        </el-aside>

        <el-main class="el-main-content" v-if="loadStatus == -1 || loadStatus == 0 || loadStatus == 2"
          style="overflow: hidden;">
          <div v-if="loadStatus == -1" class="empty-note">
            <svg-icon icon-class="note" />
            <p v-if="notes.length == 0">你的笔记空空如也</p>
            <p style="line-height: 25px;">这个社会，是赢家通吃，输者一无所有，<br />社会，永远都是只以成败论英雄。</p>
          </div>
          <div v-else-if="loadStatus == 0" class="loading-note">
            <div class="ant-spin ant-spin-lg ant-spin-spinning">
              <span class="ant-spin-dot ant-spin-dot-spin">
                <i class="ant-spin-dot-item"></i>
                <i class="ant-spin-dot-item"></i>
                <i class="ant-spin-dot-item"></i>
                <i class="ant-spin-dot-item"></i>
              </span>
            </div>
            <p>正在努力加载中 ...</p>
          </div>
          <div v-else class="empty-note">
            <svg-icon icon-class="note" />
            <p @click="reloadCatNote" class="pointer">加载笔记失败，点击重试 ...</p>
          </div>
        </el-main>

        <el-main class="el-main-content" v-else :class="{'fullscreen-mode':markdown.isFull}">
          <el-container class="hv100">
            <!-- 编辑模块 -->
            <template v-if="markdown.isEdit">
              <el-container>
                <el-header id="note-header" height="61px">
                  <i class="el-icon-edit" style="display: inline-block;"></i>
                  <input type="text" style="display: inline-block;" v-model="noteDetail.title"
                    placeholder="笔记标题不能为空..." />
                </el-header>
                <el-main class="padding0 hv100 ov-hidden">
                  <mavon-editor ref="mavonEditor" v-model="markdown.mdText" fontSize="14px"
                    :toolbars="markdown.toolbars" :subfield="false" :ishljs="false" @change="$editorChange"
                    @imgAdd="$editorUploadImage" @save="$editorSave" previewBackground="#fff" :boxShadow="false"
                    placeholder="请输入您的笔记正文 ..." :externalLink="false" class="editor" style="height: 100%;" />
                </el-main>
              </el-container>
            </template>

            <!-- 阅读模块 -->
            <template v-else>
              <el-container>
                <el-header id="note-header" height="61px" style="padding-left: 30px;">
                  {{noteDetail.title}}
                </el-header>
                <el-main class="padding0">
                  <div id="note-detail">
                    <el-scrollbar :native="false" tag="section" class="hv100">
                      <div style="padding: 10px;">
                        <div class="subfield">
                          <p>
                            <span>时间：{{noteDetail.created_at}}</span>
                            <span>阅读量(1000)</span>
                            <span class="pointer"
                              v-show="filesManager.files.length">附件({{filesManager.files.length}})</span>
                          </p>
                          <p class="mt10">
                            <span>
                              分类：<span class="larkc-tag">{{getNoteClassName(noteDetail.class_id)}}</span>
                            </span>
                            <span>
                              标签：<span class="larkc-tag" v-for="(tag, index) in noteDetail.tags"
                                :key="index">{{tag.tag_name}}</span>
                              <span class="larkc-tag" v-show="noteDetail.tags.length == 0">无</span>
                            </span>
                          </p>
                        </div>
                      </div>
                      <div class="markdown-body" id="note-info" v-html="noteDetail.html" v-code></div>
                    </el-scrollbar>
                  </div>
                </el-main>
              </el-container>
            </template>

            <!-- 右侧工具栏 -->
            <el-aside width="50px" id="note-tools">
              <div class="item" @click="markdown.isFull = !markdown.isFull">
                <i class="el-icon-full-screen"></i>
                <p>{{markdown.isFull?'取消全屏':'全屏'}}</p>
              </div>

              <div class="item" v-if="noteDetail.status == 2" @click="noteRecover(noteDetail.id)">
                <i class="el-icon-refresh-left"></i>
                <p>恢复</p>
              </div>
              <div class="item" v-else-if="editNoteStatus == 1" @click="editNote(1)">
                <i class="el-icon-loading"></i>
                <p>保存中..</p>
              </div>
              <div class="item" v-else-if="markdown.isEdit && !isEdited" @click="cancelEdit">
                <i class="el-icon-edit-outline"></i>
                <p>取消</p>
              </div>
              <div class="item" v-else-if="markdown.isEdit" @click="editNote(1)">
                <i class="el-icon-edit-outline"></i>
                <p>保存</p>
              </div>
              <div class="item" v-else @click="openEditMode()">
                <i class="el-icon-edit-outline"></i>
                <p>编辑</p>
              </div>

              <div class="item" v-popover:tagManager v-show="noteDetail.id && noteDetail.status == 1">
                <i class="el-icon-collection-tag" :class="{'i-color':noteDetail.tags.length}"></i>
                <p>标签</p>
              </div>

              <div class="item" @click="setAsterisk" v-show="noteDetail.id && noteDetail.status == 1">
                <i v-if="noteDetail.is_asterisk == 1" class="el-icon-star-on i-color"></i>
                <i v-else class="el-icon-star-off"></i>
                <p>星标</p>
              </div>

              <div class="item" v-popover:fileManager v-show="noteDetail.id">
                <i class="el-icon-link" :class="{'i-color':filesManager.files.length}"></i>
                <p>附件</p>
              </div>

              <el-tooltip v-show="noteDetail.id && noteDetail.status == 1" effect="dark" content="分享笔记给我的联系人"
                placement="left">
                <div class="item" @click="shareNode">
                  <i class="el-icon-share"></i>
                  <p>分享</p>
                </div>
              </el-tooltip>

              <el-tooltip v-show="noteDetail.id && noteDetail.status == 1" effect="dark" content="下载笔记，md格式"
                placement="left">
                <div class="item" @click="noteDownload">
                  <i class="el-icon-download"></i>
                  <p>下载</p>
                </div>
              </el-tooltip>

              <el-tooltip v-show="noteDetail.id && noteDetail.status == 1" effect="dark" content="30天内可在笔记回收站中恢复"
                placement="left">
                <div class="item" @click="noteRecycle(noteDetail.id,noteDetail.title)">
                  <i class="el-icon-delete"></i>
                  <p>回收站</p>
                </div>
              </el-tooltip>

              <el-tooltip v-show="noteDetail.id && noteDetail.status == 2" effect="dark" content="从回收站中永久删除,删除后无法恢复"
                placement="left">
                <div class="item" @click="noteDelete(noteDetail.id,noteDetail.title)">
                  <i class="el-icon-delete"></i>
                  <p>删除</p>
                </div>
              </el-tooltip>

              <!-- 笔记附件弹出层 -->
              <el-popover ref="fileManager" placement="left-start" trigger="click">
                <p>笔记附件列表</p>
                <div class="note-files-manager lm-scrollbar">
                  <input type="file" ref="uploadNoteFile" @change="uploadAnnex" />
                  <div class="file-box">
                    <p class="no-file" v-show="filesManager.files.length == 0">暂无附件</p>
                    <div class="file-item" v-for="(file ,i) in filesManager.files">
                      <div class="file-type">{{file.file_suffix}}</div>
                      <div class="file-detail">
                        <div class="filename">{{file.original_name}}</div>
                        <div class="filetool">
                          <span>{{formateTime(file.created_at)}}</span>
                          <span style="color:#3a8ee6;">{{formateSize(file.file_size)}}</span>
                          <div class="filetool-help">
                            <i class="el-icon-download" @click="downloadAnnex(file.id)"></i>
                            <i class="el-icon-delete" @click="deleteAnnex(file.id,i)"></i>
                          </div>
                        </div>
                      </div>
                      <div class="clearfix"></div>
                    </div>
                  </div>
                  <div class="files-manager-footer">
                    <p class="upload-tips">最多可支持上传10个附件</p>
                    <el-button type="primary" size="small" :loading="filesManager.status" icon="el-icon-upload"
                      @click="$refs.uploadNoteFile.click()">
                      {{filesManager.status?'上传中...':'上传附件'}}</el-button>
                  </div>
                </div>
              </el-popover>

              <!-- 笔记标签弹出层 -->
              <el-popover ref="tagManager" placement="left-start" width="300" trigger="click">
                <div class="tag-manager">
                  <div class="tag-manager-title">
                    <span>已选择</span>
                  </div>
                  <div class="tag-manager-box">
                    <span class="tag-item" v-for="(tag,i) in tagManager.tags" v-show="tag.isSelectd">
                      <span v-text="tag.name"></span>
                      <i class="el-icon-close" @click="setNoteTag(i,1)"></i>
                    </span>
                  </div>
                  <div class="tag-manager-title">
                    <span>标签栏</span>
                  </div>
                  <div class="tag-manager-box">
                    <span v-for="(tag,i) in tagManager.tags" class="tag-item" :class="{'tag-item-active':tag.isSelectd}"
                      @click="setNoteTag(i,2)">
                      <span v-text="tag.name"></span>
                    </span>
                  </div>

                  <el-button v-show="!tagManager.isInput" type="primary" class="inster-tag"
                    @click="tagManager.isInput = !tagManager.isInput" :disabled="noteDetail.status == 2">添加标签
                  </el-button>

                  <div class="tag-manager-input" v-show="tagManager.isInput">
                    <input type="text" placeholder="回车保存..." ref="editTaginput" @keyup.enter="saveTagEvent" />
                    <el-button type="primary" size="small" @click="tagManager.isInput = false">取消编辑</el-button>
                  </div>
                </div>
              </el-popover>
            </el-aside>
          </el-container>
        </el-main>
      </el-container>
    </main-layout>

    <!-- 笔记附件回收站 -->
    <recycle-note-annex v-if="recycleAnnexBox" @close="recycleAnnexBox = false" />

    <!-- 选择联系人窗口 -->
    <select-contacts v-show="selectContactsBox" @close="selectContactsBox = false" @confirm="confirmSelectContacts" />
  </div>
</template>

<script>
  import Vue from 'vue';
  import MainLayout from "@/views/layout/MainLayout";
  import RecycleNoteAnnex from "@/components/note/RecycleNoteAnnex";
  import SelectContacts from "@/components/chat/SelectContacts";

  import {
    mavonEditor
  } from "mavon-editor";

  import "mavon-editor/dist/css/index.css";

  import Contextmenu from "vue-contextmenujs";
  Vue.use(Contextmenu);

  import Prism from 'prismjs';
  import {
    copyTextToClipboard
  } from "@/utils/functions";

  import {
    findArticleClassServ,
    findArticleTagsServ,
    findArticleServ,
    findArticleDetailServ,
    editArticleClassServ,
    editArticleTagServ,
    editArticleServ,
    delArticleClassServ,
    delArticleTagServ,
    articleClassSortServ,
    mergeArticleClassServ,
    moveArticleServ,
    uploadArticleImgServ,
    setAsteriskArticleServ,
    uploadArticleAnnexServ,
    deleteArticleAnnexServ,
    downloadAnnexServ,
    updateArticleTagServ,
    recoverArticleServ,
    deleteArticleServ,
    foreverDeleteArticleServ
  } from "@/api/article";

  import {
    parseTime,
    trim,
    formateSize,
    formateTime
  } from "@/utils/functions";

  export default {
    name: 'note-page',
    components: {
      MainLayout,
      mavonEditor,
      RecycleNoteAnnex,
      SelectContacts
    },
    directives: {
      // 代码高亮指令
      code: {
        inserted: function (el) {
          let preNodes = el.querySelectorAll('pre');

          let copyFunc = (pre, text) => {
            let el = document.createElement("p");
            el.className = 'fz-btn';
            el.innerText = "复制";
            el.onclick = () => {
              copyTextToClipboard(text.replace(/(^\s*)|(\s*$)/g, ''),
                () => {
                  el.innerText = '复制成功!';
                  setTimeout(() => {
                    el.innerText = '复制';
                  }, 1000);
                }
              );
            };

            pre.appendChild(el);
          };

          let preNmae = (pre, lang) => {
            let el = document.createElement("p");
            el.className = 'lang-name';
            el.innerText = lang;
            pre.appendChild(el);
          };

          preNodes.forEach(elPre => {
            let elCode = elPre.querySelector('code');
            let className = elCode.className;
            let language = className.split('-')[1];

            copyFunc(elPre, elCode.innerText);
            if (language != undefined) {
              elCode.className = 'language-' + language;
              if (Prism.languages[language]) {
                elCode.innerHTML = Prism.highlight(elCode.innerText, Prism.languages[language], language);
              }

              preNmae(elPre, language);
            }
          });
        }
      }
    },
    data() {
      return {
        //菜单列表
        menus: [{
            name: "近期笔记",
            icon: "icon-jinqiyulan",
            color: "rgb(255, 181, 169)",
            isShowSub: false,
            isActive: true,
            submenus: []
          },
          {
            name: "星标笔记",
            icon: "icon-xingxing1",
            color: "#ffc152",
            isShowSub: false,
            isActive: false,
            submenus: []
          },
          {
            name: "分类笔记",
            icon: "icon-biji8",
            color: "#5ba0ff",
            isShowSub: true,
            isActive: false,
            submenus: []
          },
          {
            name: "标签夹",
            icon: "icon-biaoqian5",
            color: "#5ba0ff",
            isShowSub: false,
            isActive: false,
            submenus: []
          },
          {
            name: "回收站",
            icon: "el-icon-delete",
            color: "#fd6f41",
            isShowSub: false,
            isActive: false,
            submenus: [{
                name: "笔记回收站",
                icon: "icon-dian",
                isActive: false,
              },
              {
                name: "附件回收站",
                icon: "icon-dian",
                isActive: false,
              }
            ]
          }
        ],

        //笔记列表
        loadNoteStatus: 0,
        notes: [],

        // 笔记详情
        loadStatus: -1,
        editNoteStatus: 0,
        noteDetail: {
          loadId: 0,
          id: 0,
          title: "",
          tags: [],
          class_id: 0,
          content: "",
          html: "",
          is_asterisk: 0,
          status: 1,
          created_at: ''
        },

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
          }
        },

        //附件管理
        filesManager: {
          status: false,
          files: []
        },

        //标签管理
        tagManager: {
          isInput: false,
          tags: []
        },

        recycleAnnexBox: false,

        //选择联系人窗口
        selectContactsBox: false,
      };
    },
    computed: {
      isEdited() {
        return this.markdown.mdText || this.noteDetail.title ? true : false;
      }
    },
    mounted() {
      this.loadNoteClass();
      this.loadNoteTags();
      this.loadNoteList();

      this.isEdited;
    },
    methods: {
      //格式化文件大小
      formateSize: formateSize,

      //格式化时间显示格式
      formateTime,

      //下载笔记附件
      downloadAnnex: downloadAnnexServ,

      //加载笔记详情信息
      loadNoteDetail(id, isEdit) {
        this.markdown.isEdit = false;
        findArticleDetailServ({
          article_id: id
        }).then(res => {
          if (res.code == 200 && this.noteDetail.loadId == id) {
            this.loadStatus = 1;
            this.noteDetail.id = res.data.id;
            this.noteDetail.loadId = res.data.id;
            this.noteDetail.content = res.data.md_content;
            this.noteDetail.html = res.data.content;
            this.noteDetail.title = res.data.title;
            this.noteDetail.created_at = res.data.created_at;
            this.noteDetail.class_id = res.data.class_id;
            this.noteDetail.is_asterisk = res.data.is_asterisk;
            this.noteDetail.tags = res.data.tags;
            this.noteDetail.status = res.data.status;
            this.filesManager.files = res.data.files;

            // 赋值给编辑器
            this.markdown.mdText = this.noteDetail.content;

            this.tagManager.tags = this.menus[3].submenus.map(item => {
              return {
                id: item.id,
                name: item.name,
                isSelectd: false
              };
            });

            let ids = res.data.tags.map(item => item.id);
            this.tagManager.tags.forEach((value, i) => {
              this.tagManager.tags[i].isSelectd = ids.includes(value.id);
            });

            if (isEdit) {
              this.markdown.isEdit = true;
            }
          } else if (res.code !== 200 && this.noteDetail.loadId == id) {
            this.loadStatus = 2;
          }
        }).catch(err => {
          if (this.noteDetail.loadId == id) {
            this.loadStatus = 2;
          }
        });
      },

      //加载标签列表
      loadNoteTags() {
        findArticleTagsServ().then(res => {
          if (res.code != 200) return false;
          this.menus[3].submenus = res.data.tags.map(item => {
            return {
              id: item.id,
              name: item.tag_name,
              icon: "icon-dian",
              count: item.count,
              isEdit: false,
              isDefault: 0,
              isActive: false,
            };
          });
        });
      },

      //加载文章列表
      loadNoteList() {
        let data = {
          page: 1,
          keyword: "",
          find_type: "",
          cid: ""
        };

        let [i1, i2] = this.getSelectMenu();
        if (i1 == 0) {
          data.find_type = 1;
        } else if (i1 == 1) {
          data.find_type = 2;
        } else if (i1 == 2) {
          data.find_type = 3;
          data.cid = this.menus[2].submenus[i2].id;
        } else if (i1 == 3) {
          data.find_type = 4;
          let cid = this.menus[3].submenus[i2].id;
          data.cid = cid;
        } else if (i1 == 4) {
          data.find_type = 5;
        } else if (i1 == -1) {
          data.keyword = trim(this.$refs.querykeywords.value);
          data.find_type = 6;
        }

        this.loadNoteStatus = 0;
        findArticleServ(data).then(res => {
          this.loadNoteStatus = 1;

          if (res.code !== 200) return false;
          this.notes = res.data.rows.map(item => {
            return {
              id: item.id,
              title: item.title,
              datetime: parseTime(item.updated_at, "{y}/{m}/{d}"),
              classify: item.class_name || "我的笔记",
              abstract: item.abstract,
              img: item.image,
              class_id: item.class_id,
              status: item.status
            };
          });
        }).catch(err => {
          this.loadNoteStatus = 1;
        });
      },

      //加载笔记分类列表
      loadNoteClass(class_id = null) {
        findArticleClassServ().then(res => {
          if (res.code != 200) return false;
          this.menus[2].submenus = res.data.rows.map(item => {
            return {
              id: item.id,
              name: item.class_name,
              icon: "icon-dian",
              count: item.count,
              isEdit: false,
              isDefault: item.is_default,
              isActive: class_id == item.id,
            };
          });
        });
      },

      //添加或编辑笔记信息
      editNote(type = 1) {
        let data = this.getEditData();
        if (data.title == "") {
          this.$message("笔记标题不能为空...");
          return false;
        }

        if (data.md_content == "" || data.content == "") {
          this.$message("笔记内容不能为空...");
          return false;
        }

        this.editNoteStatus = 1;
        editArticleServ(data).then(res => {
          if (res.code == 200) {
            if (data.article_id == 0) {
              this.loadNoteList();
              this.loadNoteClass(data.class_id);
            }

            this.noteDetail.id = res.data.aid;
            this.noteDetail.loadId = res.data.aid;
            this.noteDetail.content = data.md_content;
            this.noteDetail.html = data.content;

            if (type == 1) {
              this.markdown.isEdit = false;
            }
          }
        }).finally(() => {
          this.editNoteStatus = 0;
        });
      },

      //获取当前编辑笔记相关信息
      getEditData() {
        return {
          article_id: this.noteDetail.id,
          class_id: this.noteDetail.class_id,
          title: this.noteDetail.title,
          md_content: this.markdown.mdText,
          content: this.markdown.htmlText
        };
      },

      //切换当前编辑模式
      openEditMode() {
        this.markdown.isEdit = true;
      },

      //查看笔记详情
      catNote(info, isEdit = false) {
        this.loadStatus = 0;
        this.noteDetail.loadId = info.id;
        this.loadNoteDetail(info.id, isEdit);
      },

      //重新加载当前查看的笔记
      reloadCatNote() {
        this.loadNoteDetail(this.noteDetail.loadId);
      },

      //文章列表移除指定的文章
      removeListNote(id) {
        this.notes.splice(this.notes.findIndex(item => item.id == id), 1);
      },

      //编辑器修改信息触发事件
      $editorChange(value, render) {
        this.markdown.mdText = value;
        this.markdown.htmlText = render;
      },

      //编辑器保存信息触发事件
      $editorSave(value, render) {
        this.editNote(2);
      },

      //编辑器上传图片触发事件
      $editorUploadImage(pos, $file) {
        let formdata = new FormData();
        formdata.append("image", $file);
        uploadArticleImgServ(formdata).then(res => {
          if (res.code == 200) {
            this.$refs.mavonEditor.$img2Url(pos, res.data.save_path);
          } else {
            this.$refs.mavonEditor.$img2Url(pos, '');
          }
        }).catch(err => {
          this.$refs.mavonEditor.$img2Url(pos, '');
        });
      },

      //左侧菜单栏点击事件
      clickNoteMenu(type, index, index2 = -1) {
        if (type == 1 && (index == 2 || index == 3 || index == 4)) {
          this.menus[index].isShowSub = !this.menus[index].isShowSub;
          return;
        }

        //点击查看附件回收站事件
        if (index == 4 && index2 != 0) {
          this.recycleAnnexBox = true;
          return;
        }

        this.setSelectMenu(index, index2);
        this.loadNoteList();
        this.$refs.querykeywords.value = '';
      },

      //添加新的笔记
      insterNote() {
        let [i1, i2] = this.getSelectMenu();
        if (i1 != 2) {
          i1 = 2;
          i2 = this.defaultNoteClassIdx();
          this.setSelectMenu(i1, i2)
          this.loadNoteList();
        }

        this.loadStatus = 1;
        this.openEditMode();
        this.resetNoteEmpty();
        this.noteDetail.class_id = this.menus[i1].submenus[i2].id;
      },

      cancelEdit() {
        this.loadStatus = -1;
        this.resetNoteEmpty();
      },

      //重置清空笔记信息
      resetNoteEmpty() {
        this.noteDetail.id = 0;
        this.noteDetail.loadId = 0;
        this.noteDetail.content = "";
        this.noteDetail.html = "";
        this.noteDetail.title = "";
        this.noteDetail.tags = [];
        this.noteDetail.is_asterisk = 0;
        this.noteDetail.class_id = 0;
        this.noteDetail.status = 1;
        this.filesManager.files = [];
        this.tagManager.tags = [];
        this.markdown.mdText = '';
        this.markdown.htmlText = '';
      },

      //回车修改分类名
      editNoteMenu(e, i, i2) {
        let item = this.menus[i].submenus[i2],
          name = trim(e.target.value);
        if (name == "" && item.id == null) {
          return (this.$delete(this.menus[i].submenus, i2));
        } else if (name && item.name == name) {
          return (this.menus[i].submenus[i2].isEdit = false);
        }

        if (i == 2) {
          editArticleClassServ({
            class_id: item.id | 0,
            class_name: name
          }).then(res => {
            if (res.code == 200) {
              this.menus[i].submenus[i2].id = res.data.id;
              this.menus[i].submenus[i2].name = name;
              this.menus[i].submenus[i2].isEdit = false;
            }
          });
        } else {
          editArticleTagServ({
            tag_id: item.id | 0,
            tag_name: name
          }).then(res => {
            if (res.code == 200) {
              this.menus[i].submenus[i2].id = res.data.id;
              this.menus[i].submenus[i2].name = name;
              this.menus[i].submenus[i2].isEdit = false;
            }
          });
        }
      },

      //笔记分类的自定义右键菜单栏
      noteClassMenu(event, i, i2 = null) {
        if (!(i == 2 || i == 3)) {
          return;
        }

        let menu = [];
        if (i == 2 && i2 == null) {
          menu = [{
              label: "重新加载",
              icon: "el-icon-refresh",
              onClick: () => {
                this.menus[2].submenus = [];
                this.loadNoteClass();
              }
            },
            {
              label: "添加分类",
              icon: "el-icon-circle-plus-outline",
              onClick: () => {
                this.menus[i].isShowSub = true;
                this.menus[i].submenus.unshift({
                  id: null,
                  name: "",
                  icon: "icon-dian",
                  count: 0,
                  isEdit: true,
                  isActive: false,
                  isDefault: 0
                });
              }
            }
          ];
        } else if (i == 2 && i2 >= 0) {
          menu = [{
              label: "添加笔记",
              icon: "el-icon-circle-plus-outline",
              onClick: () => {
                let [first_idx, last_idx] = this.getSelectMenu();
                if (first_idx != i || last_idx != i2) {
                  this.setSelectMenu(i, i2);
                  this.loadNoteList();
                }

                this.insterNote();
              }
            },
            {
              label: "重命名",
              icon: "el-icon-edit-outline",
              disabled: this.menus[i].submenus[i2].isDefault == 1,
              onClick: () => {
                this.menus[i].submenus[i2].isEdit = true;
              }
            },
            {
              label: "删除分类",
              icon: "el-icon-delete",
              disabled: this.menus[i].submenus[i2].isDefault == 1 ||
                this.menus[i].submenus[i2].count > 0,
              onClick: () => {
                delArticleClassServ({
                  class_id: this.menus[i].submenus[i2].id
                }).then(res => {
                  if (res.code == 200) {
                    this.$delete(this.menus[i].submenus, i2);
                  }
                });
              }
            },
            {
              label: "向上移动",
              icon: "el-icon-top",
              onClick: () => {
                if (i2 > 0) {
                  let item1 = this.menus[i].submenus[i2 - 1];
                  let item2 = this.menus[i].submenus[i2];
                  articleClassSortServ({
                    class_id: this.menus[i].submenus[i2].id,
                    sort_type: 2
                  }).then(res => {
                    if (res.code == 200) {
                      this.$set(this.menus[i].submenus, i2 - 1, item2);
                      this.$set(this.menus[i].submenus, i2, item1);
                    }
                  });
                }
              }
            },
            {
              label: "向下移动",
              icon: "el-icon-bottom",
              onClick: () => {
                if (i2 < this.menus[i].submenus.length - 1) {
                  let item1 = this.menus[i].submenus[i2 + 1];
                  let item2 = this.menus[i].submenus[i2];
                  articleClassSortServ({
                    class_id: this.menus[i].submenus[i2].id,
                    sort_type: 1
                  }).then(res => {
                    if (res.code == 200) {
                      this.$set(this.menus[i].submenus, i2 + 1, item2);
                      this.$set(this.menus[i].submenus, i2, item1);
                    }
                  });
                }
              }
            },
            {
              label: "合并分类至",
              icon: "el-icon-s-help",
              minWidth: 200,
              children: this.menus[2].submenus.map(item => {
                return {
                  label: item.name,
                  disabled: item.id == this.menus[i].submenus[i2].id,
                  onClick: () => {
                    mergeArticleClassServ({
                      class_id: this.menus[i].submenus[i2].id,
                      toid: item.id
                    }).then(res => {
                      if (res.code == 200) {
                        this.loadNoteClass();
                      }
                    });
                  }
                };
              })
            }
          ];
        } else if (i == 3 && i2 == null) {
          menu = [{
              label: "重新加载",
              icon: "el-icon-refresh",
              onClick: () => {
                this.menus[3].submenus = [];
                this.loadNoteTags();
              }
            },
            {
              label: "添加标签",
              icon: "el-icon-circle-plus-outline",
              onClick: () => {
                this.menus[i].isShowSub = true;
                this.menus[i].submenus.unshift({
                  id: null,
                  name: "",
                  icon: "icon-dian",
                  count: 0,
                  isEdit: true,
                  isActive: false,
                  isDefault: 0
                });
              }
            }
          ];
        } else if (i == 3 && i2 >= 0) {
          menu = [{
              label: "重命名",
              icon: "el-icon-edit-outline",
              onClick: () => {
                this.menus[i].submenus[i2].isEdit = true;
              }
            },
            {
              label: "删除标签",
              icon: "el-icon-delete",
              disabled: this.menus[i].submenus[i2].count > 0,
              onClick: () => {
                delArticleTagServ({
                  tag_id: this.menus[i].submenus[i2].id
                }).then(res => {
                  if (res.code == 200) {
                    this.$delete(this.menus[i].submenus, i2);
                  }
                });
              }
            }
          ];
        }

        this.$contextmenu({
          items: menu,
          event,
          zIndex: 999,
          minWidth: 150
        });

        return false;
      },

      //笔记列表的右键自定义菜单栏
      noteListMenu(event, i, note) {
        if (note.status == 2) {
          return false;
        }

        this.$contextmenu({
          items: [{
              label: "编辑笔记",
              icon: "el-icon-edit-outline",
              onClick: () => {
                this.catNote(note, true);
              }
            },
            {
              label: "删除笔记",
              icon: "el-icon-delete",
              divided: true,
              onClick: () => {
                this.noteRecycle(note.id, note.title);
              }
            },
            {
              label: "笔记移动至",
              icon: "el-icon-location",
              minWidth: 200,
              children: this.menus[2].submenus.map(item => {
                return {
                  label: item.name,
                  disabled: note.class_id == item.id,
                  onClick: () => {
                    moveArticleServ({
                      article_id: note.id,
                      class_id: item.id
                    }).then(res => {
                      if (res.code == 200) {
                        this.$delete(this.notes, i);
                        this.loadNoteClass();
                      }
                    });
                  }
                };
              })
            }
          ],
          event,
          zIndex: 3,
          minWidth: 150
        });

        return false;
      },

      handleCommand(command) {
        if (command == "a") {
          this.insterNote();
        } else if (command == "b") {
          this.menus[2].isShowSub = true;
          this.menus[2].submenus.unshift({
            id: null,
            name: "",
            icon: "icon-dian",
            count: 0,
            isEdit: true,
            isDefault: 0,
            isActive: false
          });
        } else if (command == "c") {
          this.menus[3].isShowSub = true;
          this.menus[3].submenus.unshift({
            id: null,
            name: "",
            icon: "icon-dian",
            count: 0,
            isEdit: true,
            isDefault: 0,
            isActive: false
          });
        }
      },

      //设置笔记是否标记星号状态
      setAsterisk() {
        let type = this.noteDetail.is_asterisk == 1 ? 2 : 1;
        setAsteriskArticleServ({
          article_id: this.noteDetail.id,
          type: type
        }).then(res => {
          if (res.code == 200) {
            this.noteDetail.is_asterisk = type == 1 ? 1 : 0;
          }
        });
      },

      //获取默认笔记分类的索引
      defaultNoteClassIdx() {
        return this.menus[2].submenus.findIndex(item => {
          return item.isDefault == 1;
        });
      },

      //上传笔记附件文件
      uploadAnnex(e) {
        if (e.target.files.length == 0 || this.filesManager.files.length >= 10) {
          return false;
        }

        let file = e.target.files[0];
        if (file.size / (1024 * 1024) > 10) {
          alert("文件不能大于10M");
          return false;
        }

        let fileData = new FormData();
        fileData.append("annex", file);
        fileData.append("article_id", this.getArticleId());
        this.filesManager.status = true;
        uploadArticleAnnexServ(fileData).then(res => {
          if (res.code == 200) {
            this.filesManager.files.push({
              id: res.data.id,
              original_name: res.data.original_name,
              created_at: parseTime(new Date()),
              file_size: res.data.file_size,
              file_suffix: res.data.file_suffix
            });
          }

          this.filesManager.status = false;
        }).catch(err => {
          this.filesManager.status = false;
        });
      },

      //删除笔记附件
      deleteAnnex(annex_id, index) {
        deleteArticleAnnexServ({
          annex_id
        }).then(res => {
          if (res.code == 200) {
            this.$delete(this.filesManager.files, index);
          }
        });
      },

      //设置笔记标签事件
      setNoteTag(i, type) {
        this.tagManager.tags[i].isSelectd = type == 1 ? false : !this.tagManager.tags[i].isSelectd;
        updateArticleTagServ({
          article_id: this.getArticleId(),
          tags: this.getSelectTags()
        });
      },

      //获取选中的标签ids
      getSelectTags() {
        let ids = [];
        for (let item of this.tagManager.tags) {
          if (item.isSelectd) ids.push(item.id);
        }

        return ids;
      },

      //获取当前查看的笔记ID
      getArticleId() {
        return this.noteDetail.loadId;
      },

      //保存标签事件
      saveTagEvent() {
        let tagName = this.$refs.editTaginput.value;
        editArticleTagServ({
          tag_id: 0,
          tag_name: tagName
        }).then(res => {
          if (res.code == 200) {
            this.menus[3].submenus.unshift({
              id: res.data.id,
              name: tagName,
              icon: "icon-dian",
              count: 0,
              isEdit: false,
              isDefault: 0,
              isActive: false
            });

            this.tagManager.tags.push({
              id: res.data.id,
              name: tagName,
              isSelectd: false
            });

            this.$refs.editTaginput.value = "";
            this.tagManager.isInput = false;
          }
        });
      },

      //关键词查询笔记
      queryNote() {
        if (trim(this.$refs.querykeywords.value)) {
          this.setSelectMenu(-1, -1);
        } else {
          this.setSelectMenu(0, -1);
        }

        this.loadNoteList();
      },

      //设置当前选中的菜单选项
      setSelectMenu(index1, index2) {
        this.menus.map((item, i) => {
          item.isActive = (i == index1 && index2 == -1);
          item.submenus.map((item2, i2) => {
            item2.isActive = (i == index1 && index2 == i2);
            return item2;
          });

          return item;
        })
      },

      //获取当前选中的菜单选项
      getSelectMenu() {
        for (let [i, item] of this.menus.entries()) {
          if (item.isActive) return [i, -1];

          if (!item.submenus) continue;

          for (let [i2, item2] of item.submenus.entries()) {
            if (item2.isActive) return [i, i2];
          }
        }

        return [-1, -1];
      },

      //分享笔记给我的朋友
      shareNode() {
        this.selectContactsBox = true;
      },

      //分享好友确认按钮
      confirmSelectContacts(value) {
        this.selectContactsBox = false;
        this.$notify({
          message: '功能研发中...'
        });
      },

      //获取分类ID
      getNoteClassName(class_id) {
        let idx = this.menus[2].submenus.findIndex((item) => {
          return item.id == class_id;
        });

        if (idx == -1) {
          return '未知';
        }

        return this.menus[2].submenus[idx].name;
      },

      //下载笔记（md格式）
      noteDownload() {
        let reader = new FileReader();
        let text = this.noteDetail.content;
        let title = this.noteDetail.title + '.md';
        reader.readAsDataURL(blob);
        reader.onload = function (e) {
          var a = document.createElement('a');
          a.download = title;
          a.href = e.target.result;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
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
              deleteArticleServ({
                article_id: id
              }).then(res => {
                if (res.code == 200) {
                  this.removeListNote(id);
                  this.loadNoteClass();
                  if (id == this.noteDetail.id) {
                    this.loadStatus = -1;
                    this.resetNoteEmpty();
                  }
                }
              });
            }
          }
        });
      },

      //笔记从回收站中永久删除
      noteDelete(id, title) {
        this.$alert(`您确定要永久删除【${title}】笔记吗？删除后不可恢复！`, '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
          customClass: 'border-radius0',
          closeOnClickModal: true,
          callback: action => {
            if (action == 'confirm') {
              foreverDeleteArticleServ({
                article_id: id
              }).then(res => {
                if (res.code == 200) {
                  this.removeListNote(id);

                  if (id == this.noteDetail.id) {
                    this.loadStatus = -1;
                    this.resetNoteEmpty();
                  }

                  this.$notify({
                    title: '删除成功',
                    message: `笔记【${title}】已删除...`,
                    type: 'success'
                  });
                }
              });
            }
          }
        });
      },

      //恢复回收站中的笔记
      noteRecover(id) {
        recoverArticleServ({
          article_id: id
        }).then(res => {
          if (res.code == 200) {
            this.removeListNote(id);
            this.loadNoteClass();

            if (id == this.noteDetail.id) {
              this.noteDetail.status = 1;
            }

            this.$notify({
              title: '成功',
              message: '笔记已成功恢复...',
              type: 'success'
            });
          }
        });
      }
    }
  };

</script>
<style src="@static/css/github-markdown.css"></style>
<style scoped src="@static/css/page/note-page.css"></style>
