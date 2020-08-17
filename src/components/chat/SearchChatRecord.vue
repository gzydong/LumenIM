<template>
  <div class="base-mask">
    <el-container class="container" v-outside="close">
      <el-header height="60px" class="header no-select">
        <i class="el-icon-close" @click="close"></i>
        <span>消息管理器</span>
        <div class="title" v-if="findSource == 1">好友【{{title}}】</div>
        <div class="title" v-else>群【{{title}}】</div>
      </el-header>

      <el-header height="38px" class="header-tool">
        <i class="iconfont pointer" :class="{'icon-shouqi2':broadside,'icon-zhankai':!broadside}"
          @click="showBroadside"></i>
        <div class="search-box no-select">
          <i class="iconfont icon-sousuo"></i>
          <input type="text" placeholder="关键字搜索" v-model="search.keyword" @input="searchText($event)" />
        </div>
      </el-header>

      <el-container class="hv100 ov-hidden">
        <el-aside width="200px" class="broadside no-select" v-show="broadside">
          <el-container class="hv100">
            <el-header height="40px" class="padding0 aside-header">
              <div class="item" :class="{'item-selected':contacts.show == 'friends'}"
                @click="contacts.show = 'friends'">我的好友({{contacts.friends.length}})</div>
              <div class="item-shuxian">|</div>
              <div class="item" :class="{'item-selected':contacts.show == 'groups'}" @click="contacts.show = 'groups'">
                我的群组({{contacts.groups.length}})</div>
            </el-header>
            <el-main class="padding0">
              <el-scrollbar :native="false" tag="section" class="hv100">
                <div v-for="(item,i) in contacts[contacts.show]" class="contacts-item" @click="triggerMenuItem(item)"
                  :class="{'contacts-item-selected':findSource == item.type && findReceiveId == item.id}">
                  <div class="avatar">
                    <el-avatar :size="30" :src="item.avatar">
                      <img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    </el-avatar>
                  </div>
                  <div class="content" v-text="item.name"></div>
                </div>
              </el-scrollbar>
            </el-main>
          </el-container>
        </el-aside>

        <!-- 聊天记录阅览 -->
        <el-main v-show="showBox == 0" class="im-container">
          <div class="subheader">
            <div class="type-items no-select">
              <span :class="{'color-blue':findType == 0}" @click="changeLoadType(0)">全部</span>
              <span :class="{'color-blue':findType == 1}">图片</span>
              <span :class="{'color-blue':findType == 2}">文件</span>
            </div>
          </div>

          <!-- 用户聊天记录 -->
          <div class="im-message lumen-scrollbar" id="recordBox1">
            <div v-show="records.isEmpty" class="empty-message no-select">
              <img src="/static/image/chat-search-no-message.png" />
              <p>未找到匹配结果</p>
            </div>

            <div class="message-group no-select" v-show="records.loadStatus == 0 || records.loadStatus == 1">
              <div v-if="records.loadStatus == 0" class="load-button" @click="loadChatRecord">
                <span>加载更多...</span>
              </div>

              <div v-else-if="records.loadStatus == 1" class="load-button">
                <i class="iconfont icon-jiazaizhong lumen-icon-spin"></i>
                <span>&nbsp;加载数据中...</span>
              </div>
            </div>

            <div class="message-group" v-for="(item,i) in records.items" :key="item.id">
              <div class="avatar-box">
                <img :src="item.avatar" :onerror="$store.state.detaultAvatar" />
              </div>
              <div class="message-main">
                <div class="nickname">
                  <span>{{item.nickname_remarks?item.nickname_remarks:item.nickname}}</span>
                  <span>&nbsp;{{sendTime(item.send_time)}}</span>
                </div>
                <div class="talk-content message-dashed">
                  <!-- 文字消息 -->
                  <div class="text-record" v-if="item.msg_type == 1 && item.is_code == 0">
                    <pre v-html="item.content" v-hrefstyle></pre>
                  </div>

                  <!-- 代码块消息 -->
                  <div class="codeblock-record" v-else-if="item.msg_type == 1 && item.is_code == 1">
                    <i class="iconfont icon-tubiao_chakangongyi cat-code-block"
                      @click="catCodeBlock(item.content,item.code_lang)"></i>
                    <prism-editor :readonly="true" :code="item.content" :language="item.code_lang"
                      :line-numbers="false">
                    </prism-editor>
                  </div>

                  <!-- 图片消息 -->
                  <div class="images-record" v-else-if="item.msg_type == 2 && item.file_type == 1">
                    <el-image :lazy="true" fit="cover" :style="getImgStyle(item.file_url)" :src="item.file_url"
                      :preview-src-list="images" :z-index="getImgIndex(item.file_url)">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                      <div slot="placeholder" class="image-slot">
                        图片加载中<span class="dot">...</span>
                      </div>
                    </el-image>
                  </div>

                  <!-- 文件消息 -->
                  <div class="file-record" v-else-if="item.msg_type == 2 && item.file_type == 3">
                    <div class="filetitle">
                      <div class="lumen-files-icon">
                        <span>{{item.file_suffix.toUpperCase()}}</span>
                      </div>
                      <div class="info">
                        <p>
                          <span v-text="item.file_original_name"></span>
                          <span class="size">({{renderSize(item.file_size)}})</span>
                        </p>
                        <p>文件已成功发送, 文件助手永久保存</p>
                      </div>
                    </div>
                    <div class="filetools">
                      <a @click="download(item.id)">下载</a>
                      <a>在线预览</a>
                    </div>
                  </div>

                  <!-- 会话记录 -->
                  <div class="dialogue-records" v-else-if="item.msg_type == 5" @click="catForwardRecords(item.id)">
                    <p class="records-title">
                      <span v-text="getForwardTitle(item.forward_info)"></span>
                    </p>
                    <div class="records-list">
                      <p v-for="info in item.forward_info">
                        <span v-text="info.nickname"></span>
                        <span>:</span>
                        <span v-text="info.text"></span>
                      </p>
                    </div>
                    <p class="records-footer">
                      <span>转发：会话记录 ({{item.forward_info.length}}条)</span>
                    </p>
                  </div>
                  <div v-else>未知的消息类型</div>
                </div>
              </div>
            </div>
          </div>
        </el-main>

        <!-- 聊天关键词查询 -->
        <el-main v-show="showBox == 1" class="im-container">
          <div class="subheader">
            <div class="tools">
              <div class="date">
                <el-date-picker v-model="search.date" type="date" placeholder="筛选聊天日期" @blur="blurDateInput"
                  @focus="focusDateInput" @change="changeDateInput" :editable="true" size="mini"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </div>
              <div class="paging no-select">
                <div @click="triggerPaging(1)"><i class="el-icon-d-arrow-left"></i></div>
                <div @click="triggerPaging(2)"><i class="el-icon-arrow-left"></i></div>
                <div><input type="text" v-model="search.page" readonly /></div>
                <div @click="triggerPaging(3)"><i class="el-icon-arrow-right"></i></div>
                <div @click="triggerPaging(4)"><i class="el-icon-d-arrow-right"></i></div>
                <div @click="triggerPaging(4)">共{{search.totalPage}}页</div>
              </div>
            </div>
            <div class="clear"></div>
          </div>

          <!-- 用户聊天记录 -->
          <div class="im-message lumen-scrollbar">
            <div v-show="search.length" class="empty-message">
              <img src="/static/image/chat-search-no-message.png" />
              <p>未找到匹配结果</p>
            </div>

            <div class="message-group" v-for="(item,i) in search.items" :key="item.id">
              <div class="avatar-box">
                <img :src="item.avatar" :onerror="$store.state.detaultAvatar" />
              </div>
              <div class="message-main">
                <div class="nickname">
                  <span>{{item.nickname_remarks?item.nickname_remarks:item.nickname}}</span>
                  <span>&nbsp;{{sendTime(item.send_time)}}</span>
                  <div class="cat-context" @click="catRecordContext(item)">查看上下文</div>
                  <div class="clear"></div>
                </div>
                <div class="talk-content message-dashed">
                  <!-- 文字消息 -->
                  <div class="text-record" v-if="item.msg_type == 1 && item.is_code == 0">
                    <pre v-html="item.content"></pre>
                  </div>

                  <!-- 代码块消息 -->
                  <div class="codeblock-record" v-else-if="item.msg_type == 1 && item.is_code == 1">
                    <i class="iconfont icon-tubiao_chakangongyi cat-code-block"
                      @click="catCodeBlock(item.content,item.code_lang)"></i>
                    <prism-editor :readonly="true" :code="item.content" :language="item.code_lang"
                      :line-numbers="false">
                    </prism-editor>
                  </div>

                  <!-- 图片消息 -->
                  <div class="images-record" v-else-if="item.msg_type == 2 && item.file_type == 1">
                    <el-image :lazy="true" fit="cover" :style="getImgStyle(item.file_url)" :src="item.file_url"
                      :preview-src-list="images" :z-index="getImgIndex(item.file_url)">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                      <div slot="placeholder" class="image-slot">
                        图片加载中<span class="dot">...</span>
                      </div>
                    </el-image>
                  </div>

                  <!-- 文件消息 -->
                  <div class="file-record" v-else-if="item.msg_type == 2 && item.file_type == 3">
                    <div class="filetitle">
                      <div class="lumen-files-icon">
                        <span>{{item.file_suffix.toUpperCase()}}</span>
                      </div>
                      <div class="info">
                        <p>
                          <span v-text="item.file_original_name"></span>
                          <span class="size">({{renderSize(item.file_size)}})</span>
                        </p>
                        <p>文件已成功发送, 文件助手永久保存</p>
                      </div>
                    </div>
                    <div class="filetools">
                      <a @click="download(item.id)">下载</a>
                      <a>在线预览</a>
                    </div>
                  </div>

                  <!-- 会话记录 -->
                  <div class="dialogue-records" v-else-if="item.msg_type == 5" @click="catForwardRecords(item.id)">
                    <p class="records-title">
                      <span v-text="getForwardTitle(item.forward_info)"></span>
                    </p>
                    <div class="records-list">
                      <p v-for="info in item.forward_info">
                        <span v-text="info.nickname"></span>
                        <span>:</span>
                        <span v-text="info.text"></span>
                      </p>
                    </div>
                    <p class="records-footer">
                      <span>转发：会话记录 ({{item.forward_info.length}}条)</span>
                    </p>
                  </div>
                  <div v-else>未知的消息类型</div>
                </div>
              </div>
            </div>
          </div>
        </el-main>

        <!-- 聊天记录上下文查看 -->
        <el-main v-show="showBox == 2" class="im-container">
          <!-- 用户聊天记录 -->
          <div class="im-message lumen-scrollbar" id="recordBox3">

            <div class="message-group">
              <div v-if="query.beforeStatus == 0" class="load-button" @click="loadRecordContext(1)">
                <span>加载更多...</span>
              </div>
              <div v-else-if="query.beforeStatus == 1" class="load-button">
                <i class="iconfont icon-jiazaizhong lumen-icon-spin"></i>
                <span>&nbsp;加载数据中...</span>
              </div>
              <div v-else class="load-button">
                <span style="color: #cccccc;">&nbsp;没有更早的消息...</span>
              </div>
            </div>

            <div class="message-group" v-for="(item,i) in query.items" :key="item.id" :id="'records-items-'+item.id">
              <div class="avatar-box">
                <img :src="item.avatar" :onerror="$store.state.detaultAvatar" />
              </div>
              <div class="message-main">
                <div class="nickname" :class="{'nickname-bg':item.id == query.initial_id}">
                  <span>{{item.nickname_remarks?item.nickname_remarks:item.nickname}}</span>
                  <span>&nbsp;{{sendTime(item.send_time)}}</span>
                  <span>ID : {{item.id}}</span>
                  <div class="clear"></div>
                </div>
                <div class="talk-content message-dashed">
                  <!-- 文字消息 -->
                  <div class="text-record" v-if="item.msg_type == 1 && item.is_code == 0">
                    <pre v-html="item.content"></pre>
                  </div>

                  <!-- 代码块消息 -->
                  <div class="codeblock-record" v-else-if="item.msg_type == 1 && item.is_code == 1">
                    <i class="iconfont icon-tubiao_chakangongyi cat-code-block"
                      @click="catCodeBlock(item.content,item.code_lang)"></i>
                    <prism-editor :readonly="true" :code="item.content" :language="item.code_lang"
                      :line-numbers="false">
                    </prism-editor>
                  </div>

                  <!-- 图片消息 -->
                  <div class="images-record" v-else-if="item.msg_type == 2 && item.file_type == 1">
                    <el-image :lazy="true" fit="cover" :style="getImgStyle(item.file_url)" :src="item.file_url">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                      <div slot="placeholder" class="image-slot">
                        图片加载中<span class="dot">...</span>
                      </div>
                    </el-image>
                  </div>

                  <!-- 文件消息 -->
                  <div class="file-record" v-else-if="item.msg_type == 2 && item.file_type == 3">
                    <div class="filetitle">
                      <div class="lumen-files-icon">
                        <span>{{item.file_suffix.toUpperCase()}}</span>
                      </div>
                      <div class="info">
                        <p>
                          <span v-text="item.file_original_name"></span>
                          <span class="size">({{renderSize(item.file_size)}})</span>
                        </p>
                        <p>文件已成功发送, 文件助手永久保存</p>
                      </div>
                    </div>
                    <div class="filetools">
                      <a @click="download(item.id)">下载</a>
                      <a>在线预览</a>
                    </div>
                  </div>

                  <!-- 会话记录 -->
                  <div class="dialogue-records" v-else-if="item.msg_type == 5" @click="catForwardRecords(item.id)">
                    <p class="records-title">
                      <span v-text="getForwardTitle(item.forward_info)"></span>
                    </p>
                    <div class="records-list">
                      <p v-for="info in item.forward_info">
                        <span v-text="info.nickname"></span>
                        <span>:</span>
                        <span v-text="info.text"></span>
                      </p>
                    </div>
                    <p class="records-footer">
                      <span>转发：会话记录 ({{item.forward_info.length}}条)</span>
                    </p>
                  </div>
                  <div v-else>未知的消息类型</div>
                </div>
              </div>
            </div>

            <div class="message-group">
              <div v-if="query.afterStatus == 0" class="load-button" @click="loadRecordContext(2)">
                <span>加载更多...</span>
              </div>
              <div v-else-if="query.afterStatus == 1" class="load-button">
                <i class="iconfont icon-jiazaizhong lumen-icon-spin"></i>
                <span>&nbsp;加载数据中...</span>
              </div>
              <div v-else class="load-button">
                <span style="color: #cccccc;">&nbsp;没有更新的消息...</span>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>

    <!-- 会话记录查看器 -->
    <forward-records ref="forwardRecordsRef" />
  </div>
</template>
<script>
  import {
    findChatRecordsServ,
    searchChatRecordsServ,
    getRecordsContextServ
  } from "@/api/chat";

  import {
    findUserGroupsServ,
    friendsServ
  } from "@/api/user";

  import Prism from "prismjs";
  import "prismjs/themes/prism-okaidia.css";
  import PrismEditor from "vue-prism-editor";
  import "vue-prism-editor/dist/VuePrismEditor.css";
  import ForwardRecords from "@/components/chat/ForwardRecords";

  import Vue from 'vue';
  import {
    DatePicker
  } from 'element-ui';

  Vue.use(DatePicker);
  import {
    formateSize,
    formateTime,
    download,
    getImageInfo,
    imgZoom
  } from "@/utils/functions";
  export default {
    name: "search-chat-record",
    components: {
      PrismEditor,
      ForwardRecords
    },
    directives: {
      hrefstyle: {
        inserted: function (el) {
          let els = el.querySelectorAll('a');
          if (els) {
            els.forEach((item, i) => {
              item.style = 'color: #409eff;padding:0px 2px';
            });
          }
        }
      }
    },
    props: {
      receiveId: {
        type: [Number, String],
        default: 0
      },
      source: {
        type: [Number, String],
        default: 0
      },
      titleName: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        // 侧边栏相关信息
        broadside: false,
        contacts: {
          show: 'friends',
          friends: [],
          groups: []
        },

        uid: this.$store.state.user.uid,
        title: "",
        findType: 0, //查询的方式 0:所有 1:图片 2:文件
        findSource: 0, //查询的聊天类型 1:私聊 2:群聊
        findReceiveId: 0, //接收者ID(用户ID或群ID)

        //用户聊天记录
        records: {
          recordId: 0,
          items: [],
          isEmpty: false,
          loadStatus: 0
        },

        images: [],

        showBox: 0,

        search: {
          keyword: '', //关键字查询
          date: '', //时间查询
          page: 1, //当前分页
          totalPage: 50, //总分页
          items: [], //数据列表
          isShowDate: false,
        },

        //上下文查看
        query: {
          items: [],
          initial_id: 0,
          min_record_id: 0,
          max_record_id: 0,
          beforeStatus: 0,
          afterStatus: 0,
        }
      };
    },
    computed: {
      recordss() {
        return this.records.items;
      },
    },
    watch: {
      //监听聊天记录变化
      recordss(records) {
        this.images = records.filter(item => item.msg_type == 2 && item.file_type == 1).map(item => item.file_url);
      }
    },
    mounted() {
      this.title = this.titleName;
      this.findSource = this.source;
      this.findReceiveId = this.receiveId;

      this.loadChatRecord(0);
    },
    created() {
      this.loadFriends();
      this.loadGroups();
    },
    methods: {
      //格式化文件大小
      renderSize: formateSize,
      //聊天时间人性化处理
      sendTime: formateTime,
      //下载文件
      download: download,

      //获取图片信息
      getImgStyle(url) {
        return imgZoom(url, 200);
      },
      //获取图片索引
      getImgIndex(url) {
        return this.images.findIndex(src => src == url);
      },

      //获取会话记录消息名称
      getForwardTitle(item) {
        let arr = [...new Set(item.map(v => v.nickname))];

        if (arr.length == 1) {
          return arr[0] + '的会话记录';
        }

        return arr.slice(0, arr.length - 1).join('、') + '及' + arr[arr.length - 1] + '的会话记录';
      },

      //查看会话记录列表
      catForwardRecords(records_id) {
        this.$refs.forwardRecordsRef.open(records_id);
      },

      //获取好友列表
      loadFriends() {
        friendsServ().then(res => {
          if (res.code == 200) {
            this.contacts.friends = [];
            for (let friend of res.data) {
              this.contacts.friends.push({
                id: friend.id,
                type: 1,
                name: friend.friend_remark ?
                  friend.friend_remark : friend.nickname,
                avatar: friend.avatar
              });
            }
          }
        });
      },
      //获取群聊列表

      loadGroups() {
        findUserGroupsServ().then(res => {
          if (res.code == 200) {
            this.contacts.groups = [];
            for (let group of res.data) {
              this.contacts.groups.push({
                id: group.id,
                type: 2,
                name: group.group_name,
                avatar: group.avatar
              });
            }
          }
        });
      },

      //修改获取记录类型
      changeLoadType(type) {
        this.records.recordId = 0;
        this.loadChatRecord();
      },

      //修改查看对象
      triggerMenuItem(itemInfo) {
        this.title = itemInfo.name;
        this.findSource = itemInfo.type;
        this.findReceiveId = itemInfo.id;

        this.showBox = 0;
        this.records.recordId = 0;
        this.records.isEmpty = false;
        this.records.items = [];

        this.loadChatRecord();
      },

      //加载历史记录
      loadChatRecord() {
        let data = {
          record_id: this.records.recordId,
          receive_id: this.findReceiveId,
          source: this.findSource
        };

        if (this.records.loadStatus == 1) return;

        this.records.loadStatus = 1;

        let elBox = document.getElementById("recordBox1");

        let scroll = elBox ? elBox.scrollHeight : 0;
        findChatRecordsServ(data).then(res => {
          if (res.code != 200) return;

          let records = data.record_id == 0 ? [] : this.records.items;
          records.unshift(...res.data.rows.reverse());

          this.records.items = records;
          this.records.loadStatus = res.data.rows.length < res.data.limit ? 2 : 0;

          if (this.records.items.length == 0) {
            this.records.isEmpty = true;
          } else {
            this.records.recordId = this.records.items[0].id;
          }

          //滚动条处理
          let el = document.getElementById("recordBox1");
          this.$nextTick(function () {
            el.scrollTop = data.record_id == 0 ? el.scrollHeight : el.scrollHeight - scroll;
          });
        }).catch(err => {
          this.records.loadStatus = 0;
        });
      },

      //关闭窗口
      close() {
        if (this.isShowDate) {
          return false;
        }
        this.$emit("close");
      },

      searchText(e) {
        if (this.search.keyword == '') {
          this.showBox = 0;
          return false;
        }

        this.showBox = 1;
        this.search.page = 1;
        this.search.date = '';
        this.searchChatRecords();
      },
      focusDateInput() {
        this.isShowDate = true;
      },
      blurDateInput() {
        this.isShowDate = false;
      },
      changeDateInput(date) {
        this.search.date = date || '';
        console.log(this.search.date)
        this.searchChatRecords();
      },
      // 点击分页查询 type (1:首页,2:上一页,3:下一页,4:最后一页)
      triggerPaging(type) {
        switch (type) {
          case 1:
            this.search.page = 1;
            break;
          case 2:
            if (this.search.page == 1) {
              return false;
            }
            this.search.page--;
            this.searchChatRecords();
            break;
          case 3:
            if (this.search.page >= this.search.totalPage) {
              return false;
            }
            this.search.page++;
            break;
          case 4:
            this.search.page = this.search.totalPage;
            break;
        }

        this.searchChatRecords();
      },
      searchChatRecords() {
        let data = {
          page: this.search.page,
          keywords: this.search.keyword,
          date: this.search.date || '',
          source: this.findSource,
          receive_id: this.findReceiveId,
        }
        searchChatRecordsServ(data).then(res => {
          if (res.code == 200) {
            this.search.items = res.data.rows;
            this.search.totalPage = res.data.page_total;
          }
        });
      },

      // 查看聊天记录上下文
      catRecordContext(item) {
        this.showBox = 2;
        this.query.initial_id = item.id;
        this.query.min_record_id = item.id;
        this.query.max_record_id = item.id;
        this.loadRecordContext(2, true);
      },

      /**
       * 加载上下文数据
       * 
       * @param Number mode 查找数据方式 (1:向上查找 2:向下查找)
       */
      loadRecordContext(mode, firstLoad = false) {
        let data = {
          source: this.findSource,
          receive_id: this.findReceiveId,
          record_id: mode == 1 ? this.query.min_record_id : this.query.max_record_id,
          find_mode: mode,
          first_load: firstLoad
        }

        let height = document.getElementById('recordBox3').scrollHeight;
        if (mode == 1) {
          if (this.query.beforeStatus == 1) return false;

          this.query.beforeStatus = 1;
        } else {
          if (this.query.afterStatus == 1) return false;

          this.query.afterStatus = 1;
        }

        getRecordsContextServ(data).then(res => {
          if (mode == 1) {
            this.query.beforeStatus = 0;
          } else {
            this.query.afterStatus = 0;
          }

          if (res.code == 200) {
            if (firstLoad) {
              this.query.items = res.data.rows;
              if (res.data.rows.length < 30) {
                this.query.afterStatus = 2;
              }
            } else if (mode == 1) {
              this.query.items.unshift(...res.data.rows.reverse());
              if (res.data.rows.length < 30) {
                this.query.beforeStatus = 2;
              }
            } else {
              this.query.items.push(...res.data.rows)
              if (res.data.rows.length < 30) {
                this.query.afterStatus = 2;
              }
            }

            this.query.min_record_id = this.query.items[0].id;
            this.query.max_record_id = this.query.items[this.query.items.length - 1].id;

            let el = document.getElementById("recordBox3");
            this.$nextTick(function () {
              if (firstLoad) {
                el.scrollTop = 0;
                this.loadRecordContext(1);
              } else if (mode == 1) {
                el.scrollTop = el.scrollHeight - height;
              } else {
                el.scrollTop = height;
              }
            });
          }
        }).catch(err => {
          if (mode == 1) {
            this.query.beforeStatus = 0;
          } else {
            this.query.afterStatus = 0;
          }
        });
      },

      showBroadside() {
        this.broadside = !this.broadside;
      }
    }
  };

</script>
<style scoped="scoped">
  .color-blue {
    color: #66b1ff !important;
  }

  .container {
    width: 70%;
    height: 600px;
    min-width: 500px;
    max-width: 1000px;
    background-color: white;
    position: fixed;
    left: 0;
    right: 0;
    top: 0px;
    bottom: 0;
    margin: auto auto;
    overflow: hidden;
    border-radius: 3px;
  }

  .container>>>.el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .header {
    padding: 0;
    line-height: 60px;
    text-align: left;
    text-indent: 6px;
    position: relative;
    border-bottom: 1px solid #f6f1f1;
  }

  .header span {
    color: #000000;
    font-size: 16px;
    margin-left: 15px;
  }

  .header>i {
    position: absolute;
    right: 20px;
    top: 18px;
    color: #4d4d4d;
    cursor: pointer;
  }

  .header .el-icon-close {
    font-size: 22px;
  }

  .header .title {
    width: 220px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header-tool {
    height: 38px;
    line-height: 38px;
    font-size: 12px;
    border-bottom: 1px solid #f9f4f4;
    margin-top: 10px;
    padding: 0 10px;
    position: relative;
  }

  .header-tool>i {
    font-size: 22px;
    color: #6f6a6a;
  }

  .header-tool .search-box {
    position: absolute;
    width: 230px;
    height: 30px;
    top: 2px;
    right: 10px;
    background: #f9f4f4;
    border-radius: 5px;
  }

  .header-tool .search-box i {
    position: absolute;
    left: 10px;
    top: -3px;
  }

  .header-tool .search-box input {
    position: absolute;
    left: 30px;
    top: 3px;
    height: 25px;
    width: 184px;
    color: #7d7171;
    background: #f9f4f4;
  }

  /* 侧边栏 */
  .broadside {
    border-right: 1px solid #f9f9f9;
  }

  .im-container {
    height: 100%;
    padding: 8px;
    overflow: hidden;
  }

  .im-container .subheader {
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #f0e5e5;
  }

  .im-container .subheader .type-items {
    float: left;
    width: 220px;
    height: 100%;
    font-size: 12px;
    font-weight: 300;
  }

  .im-container .subheader .type-items span {
    width: 45px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
  }

  .im-container .subheader .tools {
    min-width: 200px;
    height: 100%;
    float: right;
    position: relative;
    top: -3px;
    text-align: right;
    margin-right: 2px;
  }

  .subheader .tools .paging {
    min-width: 215px;
    float: right;
    line-height: 36px;
    position: relative;
    top: -1px;
  }

  .subheader .tools .paging>div {
    display: inline-block;
    margin: 0 2px;
    height: 26px;
    border: 1px solid #DCDFE6;
    line-height: 26px;
    padding: 0 3px;

    cursor: pointer;
    font-weight: 300;
    color: #cccccc;
  }

  .subheader .tools .paging input {
    text-align: center;
    height: 22px;
    line-height: 22px;
    padding: 0px 5px;
    position: relative;
    top: -1px;
    font-size: 14px;
    width: 50px;
  }

  .subheader .tools .paging i {
    color: #bebebe;
  }

  .subheader .tools .paging div:active {
    border-color: #c6c6c7;
  }

  .subheader .tools .date {
    width: 150px;
    float: left;
    margin-bottom: 5px;
  }

  .subheader .tools .date>>>.el-date-editor {
    width: 140px;

  }

  .subheader .tools .date>>>input {
    border-radius: 0 !important;
  }

  .im-message {
    height: calc(100% - 40px);
    height: -moz-calc(100% - 40px);
    height: -webkit-calc(100% - 40px);
    overflow-y: auto;
    margin-top: 5px;
  }


  .im-message .message-group {
    min-height: 30px;
    margin: 10px 0;
    display: flex;
  }

  .im-message .message-dashed {
    padding-bottom: 10px;
    border-bottom: 1px dashed #e8e2e2;
  }

  .im-message .message-group .avatar-box {
    width: 50px;
  }

  .im-message .message-group .avatar-box img {
    height: 30px;
    width: 30px;
    margin-left: 10px;
    border-radius: 3px;
    cursor: pointer;
  }

  .im-message .message-group .message-main {
    width: calc(100% - 60px);
    width: -moz-calc(100% - 60px);
    width: -webkit-calc(100% - 60px);
    min-height: 30px;
  }


  .message-main .nickname {
    height: 22px;
    line-height: 22px;
    font-size: 13px;
  }

  .message-main .nickname-bg {
    background: #21b9fc;
    color: white;
    padding-left: 10px;
  }

  .message-main .nickname .cat-context {
    float: right;
    display: none;
    cursor: pointer;
    color: cornflowerblue;
  }

  .message-main:hover .cat-context {
    display: block;
  }

  .message-main .talk-content {
    min-height: 30px;
    width: 100%;
    margin-top: 3px;
  }

  /* 文本信息消息 */
  .talk-content .text-record pre {
    white-space: pre-wrap;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    font-size: 13px;
    padding: 5px;
    font-family: "微软雅黑";
    line-height: 20px;
    background-color: #f3f3f3;
    color: #5b5b5b;
    min-height: 20px;
  }

  .talk-content .text-record pre a {
    color: #919496 !important;
  }

  /* 图片信息消息 */
  .talk-content .images-record {
    position: relative;
    cursor: pointer;
    border-radius: 3px;
  }

  .talk-content .images-record .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #d6d6d6;
    color: #909399;
    font-size: 14px;
  }

  .talk-content .images-record .image-slot i {
    font-size: 22px;
  }

  .talk-content .images-record>>>.el-image {
    box-shadow: 1px 1px 8px #eae4e4;
    border-radius: 3px;
  }

  .talk-content .images-record>>>.el-image img {
    max-width: 200px;
    min-width: 20px;
    border-radius: 3px !important;
  }

  .talk-content .images-record>>>.el-image-viewer__wrapper {
    z-index: 999999999999 !important;
  }


  /* 会话记录消息 */
  .talk-content .dialogue-records {
    width: 230px;
    min-height: 95px;
    max-height: 150px;
    border-radius: 5px;
    background-color: white;
    padding: 3px 10px;
    cursor: pointer;
    box-shadow: 0 0 9px 0px #cccccc;
  }

  .talk-content .dialogue-records:hover {
    box-shadow: 0 0 9px 0px #97c3f1;
  }

  .talk-content .dialogue-records .records-title {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #565353;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 400;
  }

  .talk-content .dialogue-records .records-list p {
    height: 18px;
    line-height: 18px;
    font-size: 10px;
    color: #aaa9a9;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 100;
  }

  .talk-content .dialogue-records .records-footer {
    height: 25px;
    line-height: 25px;
    color: #858282;
    border-top: 1px dashed #bfbfbf;
    font-size: 12px;
    margin-top: 6px;
    font-weight: 300;
  }


  /* 文件信息消息 */
  .talk-content .file-record {
    width: 300px;
    height: 85px;
    background: white;
    box-shadow: 0 0 7px 0px #e8e4e4;
  }

  .talk-content .file-record .lumen-files-icon {
    width: 45px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    color: #ffffff;
    background: #49a4ff;
    margin-left: 3px;
    float: left;
    border-radius: 2px;
    font-size: 12px;
  }

  .talk-content .file-record .lumen-files-icon i {
    font-size: 46px;
  }

  .talk-content .file-record .filetitle {
    height: 50px;
    border-bottom: 1px solid #eff7ef;
    padding-top: 5px;
  }

  .talk-content .file-record .filetitle .info {
    width: 245px;
    height: 45px;
    float: left;
  }

  .talk-content .file-record .filetitle .info p:first-child {
    height: 25px;
    line-height: 25px;
    padding-left: 5px;
    color: rgb(76, 76, 76);
    font-size: 14px;
  }

  .talk-content .file-record .filetitle .info p:nth-child(2) {
    height: 25px;
    line-height: 25px;
    font-size: 12px;
    padding-left: 5px;
    color: #929191;
  }

  .talk-content .file-record .filetitle .info .size {
    color: #929191;
    font-size: 12px;
  }

  .talk-content .file-record .filetools {
    height: 30px;
    background: white;
    text-align: right;
    padding-right: 5px;
    line-height: 30px;
    color: #00d7ff;
    font-size: 12px;
    cursor: pointer;
  }

  .talk-content .file-record .filetools a {
    margin-right: 15px;
  }


  /* 代码块信息消息 */
  .talk-content .codeblock-record i {
    position: absolute;
    right: 15px;
    top: 15px;
    font-size: 18px;
    cursor: pointer;
    color: white;
    display: none;
  }

  .talk-content .codeblock-record:hover i {
    display: block;
  }

  .talk-content .codeblock-record>>>.prism-editor-wrapper pre::-webkit-scrollbar {
    width: 5px;
    background-color: #272822;
  }

  .talk-content .codeblock-record>>>.prism-editor-wrapper pre::-webkit-scrollbar-thumb {
    background-color: #41413f;
  }

  .talk-content .codeblock-record>>>.prism-editor-wrapper {
    border-radius: 3px;
  }


  .im-message .empty-message {
    text-align: center;
    padding: 10px 0;
    font-size: 14px;
    margin-top: 50px;
  }

  .im-message .empty-message img {
    width: 140px;
    margin-bottom: 15px;
  }

  .im-message .empty-message p {
    color: #807e7e;
  }


  .message-group .load-button {
    width: 115px;
    height: 20px;
    line-height: 20px;
    margin: 0 auto;
    font-size: 12px;
    text-align: center;
    color: #58abff;
    cursor: pointer;
    position: relative;
  }

  .message-group .load-button i {
    position: absolute;
    top: 0px;
    left: 8px;
  }


  .broadside .aside-header {
    display: flex;
    flex-direction: row;
    height: 100%;
    border-bottom: 1px solid #f9f9f9;
  }

  .broadside .aside-header>div {
    text-align: center;
    line-height: 40px;
    font-size: 13px;
    font-weight: 300;
  }

  .broadside .aside-header .item {
    flex: 1;
    cursor: pointer;
  }

  .broadside .aside-header .item-shuxian {
    flex-basis: 1px;
    flex-shrink: 0;
    color: rgb(232 224 224);
  }

  .broadside .aside-header .item-selected {
    color: #66b1ff;
  }

  .contacts-item {
    height: 35px;
    margin: 5px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-left: 10px;
  }

  .contacts-item:hover,
  .contacts-item-selected {
    background-color: #f5f5f5;
  }


  .contacts-item .avatar {
    flex-basis: 40px;
    flex-shrink: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .contacts-item .content {
    flex: 1 1;
    height: 100%;
    line-height: 35px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    padding-right: 10px;
    cursor: pointer;
  }

</style>
