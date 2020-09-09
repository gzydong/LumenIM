<template>
  <div>
    <el-container class="vh100" style="position: relative;background-color: white;">
      <!-- 头部信息 -->
      <el-header class="padding0 panel-header no-select">
        <div class="title">
          <span class="badge badge-friend" v-if="params.source == 1">友</span>
          <span class="badge" v-else>群</span>
          <span class="name pointer">
            <span v-if="params.source == 1" @click="catFriendDetail(params.receiveId)">{{params.nickname}}</span>
            <span v-else @click="groupBoxShow = !groupBoxShow">{{params.nickname}}</span>
            <span class="num" v-show="groupNum && params.source == 2">({{groupNum}}人)</span>
          </span>
        </div>
        <div class="online" v-show="params.source == 1">
          <p class="badge" :class="{'yes-badge':isOnline == true}">
            <span class="badge-status-dot badge-status-processing" v-show="isOnline == true"></span>
            <span>{{isOnline?'在线':'离线'}}</span>
          </p>
          <p class="input" v-show="keyEvent.isShow">对方正在输入 ...</p>
        </div>
        <div class="means">
          <el-tooltip content="历史消息" placement="top">
            <p>
              <i class="el-icon-time" @click="findChatRecord = true"></i>
            </p>
          </el-tooltip>
          <el-tooltip content="群公告" placement="top">
            <p v-show="params.source == 2">
              <i class="iconfont icon-gonggao2" @click="isShowGroupNotice = true"></i>
            </p>
          </el-tooltip>
          <el-tooltip content="群设置" placement="top">
            <p v-show="params.source == 2">
              <i class="el-icon-setting" @click="groupBoxShow = !groupBoxShow"></i>
            </p>
          </el-tooltip>
        </div>
      </el-header>

      <!-- 主体信息 -->
      <el-main class="padding0 panel-main lm-scrollbar" ref="lumenChatPanel" id="lumenChatPanel"
        @scroll.native="talkPanelScroll($event)">
        <div class="record-container no-select">
          <div class="toolbars">
            <span v-show="loadRecord.status == 0">
              <i class="el-icon-loading"></i> 正在加载数据中...
            </span>
            <span v-show="loadRecord.status == 1" @click="loadChatRecords"><i class="el-icon-bottom"></i>
              查看更多消息...</span>
            <span v-show="loadRecord.status == 2" class="not-have-msg">没有更多消息了...</span>
          </div>
        </div>

        <div class="record-container" v-for="(item,idx) in records"
          :class="{'container-checked':multiSelect.isOpen === true}" :key="item.id">

          <!-- 入群系统提示消息 -->
          <div v-if="item.msg_type == 3" class="message-system no-select">
            <span v-if="item.invite.type == 1 || item.invite.type == 3" class="group-invite-tips">
              <a @click="catFriendDetail(item.invite.operate_user.id)">{{item.invite.operate_user.nickname}}</a>
              <span>{{item.invite.type == 1?'邀请了':'将'}}</span>
              <template v-for="(user,uidx) in item.invite.users">
                <a @click="catFriendDetail(user.id)">{{user.nickname}}</a>
                <em v-show="uidx < item.invite.users.length - 1">、</em>
              </template>
              <span>{{item.invite.type == 1?'加入了群聊':'踢出了群聊'}}</span>
            </span>
            <span v-else-if="item.invite.type == 2" class="group-invite-tips">
              <a @click="catFriendDetail(item.invite.operate_user.id)">{{item.invite.operate_user.nickname}}</a>
              <span style="background: none;">退出了群聊</span>
            </span>
          </div>

          <!-- 撤回消息提示 -->
          <div v-else-if="item.is_revoke == 1" class="message-system no-select">
            <span v-if="$store.state.user.uid == item.user_id" class="recall">你撤回了一条消息 |
              {{sendTime(item.created_at)}}</span>
            <span v-else-if="params.source == 1" class="recall">对方撤回了一条消息 | {{sendTime(item.created_at)}}</span>
            <span v-else class="recall">"{{item.nickname}}" 撤回了一条消息 | {{sendTime(item.created_at)}}</span>
          </div>

          <!-- 用户聊天消息 -->
          <div v-else class="record-box" :class="{'left-record':item.float =='left','right-record':item.float =='right'}" >
            <div class="checked-button"
              v-show="multiSelect.isOpen && (item.msg_type==1 || item.msg_type==2 || item.msg_type==5)"
              @click="triggerMultiSelect(item.id)">
              <i class="el-icon-success" :class="{'selected-record':verifyMultiSelect(item.id)}"></i>
            </div>

            <div class="record-avatar no-select">
              <img :src="item.avatar" @click="catFriendDetail(item.user_id)" :onerror="$store.state.detaultAvatar" />
            </div>

            <div class="talk-container">
              <div class="record-time2">
                <span v-text="parseTime(item.created_at,'{m}月{d}日 {h}:{i}')"></span>
              </div>

              <!-- 判断是否是群聊信息(群聊信息显示用户昵称) -->
              <p v-show="item.source == 2 && item.float =='left'" class="record-nickname">
                <span v-text="item.nickname"></span>
                <span v-show="item.friend_remarks">({{item.friend_remarks}})</span>
              </p>

              <div class="talk-content" :class="{'no-background':isNoBackground(item)}">
                <div class="lumen-arrow" v-show="!isNoBackground(item)"></div>

                <!-- 文字消息 -->
                <div class="text-record" v-if="item.msg_type == 1" @contextmenu="onCopy(idx,item,$event)">
                  <pre v-html="item.content" :id="'copy_class_'+item.id" v-href></pre>
                </div>

                <!-- 图片消息 -->
                <div class="images-record" v-else-if="item.msg_type == 2 && item.file.file_type == 1"
                  @contextmenu="onCopy(idx,item,$event)">
                  <el-image :lazy="true" fit="cover" :style="getImgStyle(item.file.file_url)" :src="item.file.file_url"
                    :preview-src-list="images" :z-index="getImgIndex(item.file.file_url)">
                    <div slot="error" class="image-slot">
                      加载失败...
                    </div>
                    <div slot="placeholder" class="image-slot">
                      图片加载中<span class="dot">...</span>
                    </div>
                  </el-image>
                  <i class="el-icon-circle-plus enlarge"></i>
                </div>

                <!-- 音频文件预留 -->
                <div class="file-record" v-else-if="item.msg_type == 2 && item.file.file_type == 2">

                </div>

                <!-- 视频文件预留 -->
                <div class="file-record" v-else-if="item.msg_type == 2 && item.file.file_type == 3">

                </div>

                <!-- 其它格式的文件消息 -->
                <div class="file-record" v-else-if="item.msg_type == 2 && item.file.file_type == 4"
                  @contextmenu="onCopy(idx,item,$event)">
                  <div class="filetitle">
                    <div class="files-icon">
                      <span>{{item.file.file_suffix.toUpperCase()}}</span>
                    </div>
                    <div class="info">
                      <p>
                        <span v-text="item.file.original_name"></span>
                        <span class="size">({{renderSize(item.file.file_size)}})</span>
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
                <div class="dialogue-records" v-else-if="item.msg_type == 4" @contextmenu="onCopy(idx,item,$event)"
                  @click="catForwardRecords(item.id)">
                  <p class="records-title">
                    <span v-text="getForwardTitle(item.forward.list)"></span>
                  </p>
                  <div class="records-list">
                    <p v-for="info in item.forward.list">
                      <span v-text="info.nickname"></span>
                      <span>:</span>
                      <span v-text="info.text"></span>
                    </p>
                  </div>
                  <p class="records-footer">
                    <span>转发：会话记录 ({{item.forward.num}}条)</span>
                  </p>
                </div>

                <!-- 代码块消息 -->
                <div class="codeblock-record" v-else-if="item.msg_type == 5" @contextmenu="onCopy(idx,item,$event)">
                  <i class="iconfont icon-tubiao_chakangongyi cat-code-block"
                    @click="catCodeBlock(item.code_block.code,item.code_block.code_lang)"></i>
                  <prism-editor :readonly="true" :code="item.code_block.code" :language="item.code_block.code_lang"
                    :line-numbers="false" />
                </div>

                <div v-else>未知的消息类型</div>
              </div>
            </div>
            <div class="clear"></div>
          </div>

          <!-- 消息发送时间 -->
          <p class="record-time no-select" v-show="compareTime(idx,item.created_at)" v-text="sendTime(item.created_at)">
          </p>
        </div>
      </el-main>

      <!-- 页脚信息 -->
      <el-footer class="padding0 panel-footer" height="160">
        <template v-if="!multiSelect.isOpen">
          <editor ref="talkEditor" @send="submitSendMesage" @sendCodeBlock="sendCodeBlock"
            @keyboard-event="keyboardEvent" />
        </template>
        <template v-else>
          <div class="multi-select">
            <div class="multi-title" v-show="multiSelect.items.length > 0">
              <span>已选中：{{multiSelect.items.length}} 条消息</span>
            </div>
            <div class="multi-btn-group">
              <div class="multi-icon" @click="handleMultiMode(2)">
                <i class="el-icon-position"></i>
              </div>
              <p>合并转发</p>
            </div>
            <div class="multi-btn-group">
              <div class="multi-icon" @click="handleMultiMode(3)">
                <i class="el-icon-delete"></i>
              </div>
              <p>批量删除</p>
            </div>
            <div class="multi-btn-group">
              <div class="multi-icon" @click="closeMultiSelect">
                <i class="el-icon-close"></i>
              </div>
              <p>关闭</p>
            </div>
          </div>
        </template>
      </el-footer>

      <!-- 群设置侧边栏 -->
      <div class="sidebar-box" :class="{'sidebar-box-show':groupBoxShow}" v-outside="hideChatGroup">
        <user-group v-if="params.source == 2" :group-id="params.receiveId" @close="hideChatGroup"
          @send-group="hideChatGroup" @quit-group="quitGroupSuccess" @disturb-change="disturbChange"
          @group-info="syncGroupInfo" />
      </div>

      <!-- 置底按钮 -->
      <transition name="el-fade-in-linear">
        <div class="tips-board" v-show="tipsBoard" @click="talkPanelScrollBottom">
          <svg-icon icon-class="mention-down" style="width: 10px;" />
          <span>回到底部</span>
        </div>
      </transition>
    </el-container>

    <!-- 代码查看器 -->
    <code-block v-show="codeBlock.isShow" :load-code="codeBlock.code" :load-lang="codeBlock.lang"
      @close="codeBlock.isShow = false" />

    <!-- 会话记录查看器 -->
    <forward-records ref="forwardRecordsRef" />

    <!-- 消息管理器 -->
    <search-chat-record v-if="findChatRecord" @close="findChatRecord = false" :source="params.source"
      :receive-id="params.receiveId" :titleName="params.nickname" />

    <!-- 选择联系人窗口 -->
    <select-contacts v-show="selectContacts.isShow" @close="selectContacts.isShow = false"
      @confirm="confirmSelectContacts" />

    <!-- 查看好友用户信息 -->
    <user-business-card ref="userBusinessCard" />

    <!-- 群公告组件 -->
    <group-notice v-if="isShowGroupNotice" :group-id="params.receiveId" @close="isShowGroupNotice = false" />
  </div>
</template>

<script type="text/javascript">
  import Vue from "vue";

  import UserBusinessCard from "@/components/user/UserBusinessCard";
  import SearchChatRecord from "@/components/chat/SearchChatRecord";
  import ForwardRecords from "@/components/chat/ForwardRecords";
  import SelectContacts from "@/components/chat/SelectContacts";
  import UserGroup from "@/components/group/UserGroup";
  import GroupNotice from "@/components/group/GroupNotice";
  import CodeBlock from "@/components/chat/CodeBlock";
  import Editor from "@/components/editor";

  import Prism from "prismjs";
  import "prismjs/themes/prism-okaidia.css";
  import PrismEditor from "vue-prism-editor";
  import "vue-prism-editor/dist/VuePrismEditor.css";
  import Contextmenu from "vue-contextmenujs";
  Vue.use(Contextmenu);

  import {
    chatRecordsServ,
    forwardRecordsServ,
    removeRecordsServ,
    revokeRecordsServ,
  } from "@/api/chat";

  import {
    collectEmoticonServ
  } from "@/api/emoticon";

  import {
    formateTime,
    formateSize,
    download,
    parseTime,
    imgZoom,
    getSelection,
    copyTextToClipboard,
    addClass,
    removeClass,
    replaceEmoji
  } from "@/utils/functions";

  export default {
    name: 'talk-editor-panel',
    components: {
      Editor,
      CodeBlock,
      ForwardRecords,
      PrismEditor,
      SelectContacts,
      UserGroup,
      SearchChatRecord,
      UserBusinessCard,
      GroupNotice
    },
    props: {
      //对话相关参数
      params: {
        type: Object,
        default: {
          //消息来源（1：好友私信 2:群聊）
          source: 0,
          //消息接收者ID（好友ID或者群聊ID）
          receiveId: 0,
          nickname: '',
        }
      },

      //用户是否在线
      isOnline: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        groupNum: 0,

        //查看聊天记录信息
        forwardRecordBox: {
          isShow: false,
          records_id: 0
        },

        //代码查看信息
        codeBlock: {
          isShow: false,
          code: "",
          lang: ""
        },

        //记录加载相关参数
        loadRecord: {
          status: 0,
          minRecord: 0,
          scrollHeight: 0
        },

        //多选相关操作
        multiSelect: {
          isOpen: false,
          items: [],
          mode: 0,
        },

        //选择联系人窗口
        selectContacts: {
          isShow: false,
        },

        //图片查看器列表
        images: [],
        groupBoxShow: false,

        //键盘输入事件
        keyEvent: {
          isShow: false,
          time: 0
        },

        //聊天记录管理器数据
        findChatRecord: false,

        // 置底按钮是否显示
        tipsBoard: false,

        isShowGroupNotice: false,
      };
    },
    computed: {
      records() {
        return this.$root.message.records;
      },
      inputEvent() {
        return this.$store.state.notify.inputEvent;
      },
      scroll() {
        return this.$store.state.notify.scroll;
      },
    },
    watch: {
      // 监听面板传递参数
      params(val) {
        this.loadRecord.minRecord = 0;
        this.$root.message.records = [];
        this.multiSelect = {
          isOpen: false,
          items: [],
          mode: 0
        }

        this.loadChatRecords();
        this.tipsBoard = false;
      },
      scroll(n, o) {
        this.$nextTick(() => {
          this.talkPanelScrollBottom();
        });
      },
      //监听聊天记录变化
      records(records) {
        this.images = records.filter(item => item.msg_type == 2 && item.file.file_type == 1).map(item => item.file
          .file_url);
      },
      //监听好友键盘事件
      inputEvent(n, o) {
        this.keyEvent.isShow = true;
        setTimeout(() => {
          this.keyEvent.isShow = false;
        }, 2000);
      },
    },
    mounted() {
      this.loadChatRecords();
    },
    methods: {
      //格式化文件大小
      renderSize: formateSize,

      //聊天时间人性化处理
      sendTime: formateTime,

      parseTime:parseTime,

      //下载文件
      download,

      //获取光标选中内容
      getSelection,

      //获取图片信息
      getImgStyle(url) {
        return imgZoom(url, 200);
      },
      //获取图片索引
      getImgIndex(url) {
        return this.images.findIndex(src => src == url);
      },

      //发送消息方法
      sendSocket(message) {
        this.$root.socket.send(message);
      },

      //回车键发送消息回调事件
      submitSendMesage(content) {
        //调用父类Websocket组件发送消息
        this.sendSocket({
          event: "event_talk",
          data: {
            // 发送消息的用户ID
            send_user: this.$store.state.user.uid,

            // 接受者消息ID(用户ID或群ID)
            receive_user: this.params.receiveId,

            // 聊天类型  1:私聊 2:群聊信息显示用户昵称
            source_type: this.params.source,

            // 消息文本
            text_message: content,
          }
        });
      },
      // 发送代码消息
      sendCodeBlock() {

      },

      //推送编辑事件消息
      keyboardEvent() {
        // 判断是否推送键盘输入事件消息
        if (!this.$store.state.settings.keyboardEventNotify) {
          return false;
        }

        let time = new Date().getTime();

        //判断当前对话是否属于私聊信息
        if (this.params.source == 2 || !this.isOnline) return;

        //判断在两秒内是否已推送事件
        if (this.keyEvent.time != 0 && time - this.keyEvent.time < 2000) {
          return;
        }

        this.keyEvent.time = new Date().getTime();

        //调用父类Websocket组件发送消息
        this.sendSocket({
          event: "event_keyboard",
          data: {
            send_user: this.$store.state.user.uid,
            receive_user: this.params.receiveId
          }
        });
      },

      //加载用户聊天详情信息
      loadChatRecords() {
        let data = {
          record_id: this.loadRecord.minRecord,
          receive_id: this.params.receiveId,
          source: this.params.source
        };

        this.loadRecord.status = 0;
        this.loadRecord.scrollHeight = document.getElementById("lumenChatPanel").scrollHeight;
        chatRecordsServ(data).then(res => {
          //防止点击切换过快消息返回延迟，导致信息错误
          if (res.code != 200 || (data.receive_id != this.params.receiveId && data.source != this.params.source)) {
            return;
          }

          let records = data.record_id == 0 ? [] : this.$root.message.records;

          records.unshift(...res.data.rows.reverse());

          this.loadRecord.minRecord =
            res.data.rows.length == res.data.limit ? res.data.record_id : 0;

          let user_id = this.$store.state.user.uid;

          this.$root.message.records = records.map((item) => {
            item.float = (item.user_id == 0) ? 'center' : (item.user_id == user_id ? 'right' : 'left');

            if (item.msg_type == 1) {
              item.content = replaceEmoji(item.content);
            }

            return item;
          });

          this.loadRecord.status = res.data.rows.length >= res.data.limit ? 1 : 2;

          //滚动条处理
          let el = document.getElementById("lumenChatPanel");
          this.$nextTick(function () {
            if (data.record_id == 0) {
              //首页加载数据滚动条置底
              el.scrollTop = el.scrollHeight;
            } else {
              //加载数据完成之后将滚动条重置到加载之前的位置
              el.scrollTop = el.scrollHeight - this.loadRecord.scrollHeight;
            }
          });
        }).catch(e => {
          this.loadRecord.status = 1;
        });
      },

      //多选处理方式
      handleMultiMode(type) {
        if (this.multiSelect.items.length <= 1) {
          return false;
        }

        this.multiSelect.mode = type;
        if (type == 1) { //逐条转发
          if (this.verifyMultiSelectType(4)) {
            this.$notify({
              title: '消息转发',
              message: '会话记录不支持合并转发'
            });
            return false;
          }

          this.selectContacts.isShow = true;
        } else if (type == 2) { //合并转发
          if (this.verifyMultiSelectType(4)) {
            this.$notify({
              title: '消息转发',
              message: '会话记录不支持合并转发'
            });
            return false;
          }

          this.selectContacts.isShow = true;
        } else { //批量删除
          let ids = this.multiSelect.items;
          removeRecordsServ({
            source: this.params.source,
            receive_id: this.params.receiveId,
            record_id: ids.join(',')
          }).then(res => {
            if (res.code == 200) {
              this.delRecords(ids).closeMultiSelect();
            }
          });
        }
      },

      //确认消息转发联系人事件
      confirmSelectContacts(arr) {
        let user_ids = [],
          group_ids = [];
        arr.forEach(item => {
          if (item.type == 1) {
            user_ids.push(item.id);
          } else {
            group_ids.push(item.id);
          }
        });

        this.selectContacts.isShow = false;
        forwardRecordsServ({
          forward_mode: this.multiSelect.mode,
          source: this.params.source,
          receive_id: this.params.receiveId,
          records_ids: this.multiSelect.items,
          receive_user_ids: user_ids,
          receive_group_ids: group_ids
        }).then(res => {
          if (res.code == 200) {
            this.closeMultiSelect();
            this.$notify({
              title: '消息转发',
              message: '消息转发成功...',
              type: 'success'
            });
          }
        });
      },

      //判断消息是否需要背景
      isNoBackground(item) {
        if (item.msg_type != 1 || (item.msg_type == 1 && item.is_code == 1)) {
          return true;
        }
        return false;
      },

      //处理消息时间是否显示
      compareTime(index, datetime) {
        if (datetime == undefined) {
          return false;
        }

        if (this.$root.message.records[index].is_revoke == 1) {
          return false;
        }

        datetime = datetime.replace(/-/g, "/");
        let time = Math.floor(Date.parse(datetime) / 1000);
        let currTime = Math.floor(new Date().getTime() / 1000);

        //当前时间5分钟内时间不显示
        if (currTime - time < 300) return false;

        //判断是否是最后一条消息,最后一条消息默认显示时间
        if (index == this.$root.message.records.length - 1) {
          return true;
        }

        let nextDate = this.$root.message.records[index + 1].created_at.replace(
          /-/g,
          "/"
        );

        return !(
          parseTime(new Date(datetime), "{y}-{m}-{d} {h}:{i}") ==
          parseTime(new Date(nextDate), "{y}-{m}-{d} {h}:{i}")
        );
      },

      //查看好友用户信息
      catFriendDetail(value) {
        this.$refs.userBusinessCard.open(value);
      },

      //查看代码显示窗口
      catCodeBlock(code, lang) {
        this.codeBlock.isShow = true;
        this.codeBlock.code = code;
        this.codeBlock.lang = lang;
      },

      //撤回消息
      revokeRecords(idx, item) {
        revokeRecordsServ({
          record_id: item.id
        }).then(res => {
          if (res.code == 200) {
            this.$root.message.records[idx].is_revoke = 1;
          }
        });
      },

      //删除消息
      removeRecords(idx, item) {
        let user_id = this.$store.state.user.uid;
        let receive_id = item.receive_id;
        if (item.source == 1 && item.user_id != user_id) {
          receive_id = item.user_id;
        }

        removeRecordsServ({
          source: item.source,
          receive_id: receive_id,
          record_id: item.id
        }).then(res => {
          if (res.code == 200) {
            this.$delete(this.$root.message.records, idx);
          }
        });
      },

      //转发消息
      forwardRecords(idx, item) {
        alert('单条记录转发开发中...');
      },

      //从列表中删除记录
      delRecords(arr) {
        arr.forEach(record_id => {
          let i = this.$root.message.records.findIndex(item => item.id == record_id);
          if (i >= 0) {
            this.$delete(this.$root.message.records, i);
          }
        });

        return this;
      },

      //查看会话记录列表
      catForwardRecords(records_id) {
        this.$refs.forwardRecordsRef.open(records_id);
      },

      //获取会话记录消息名称
      getForwardTitle(item) {
        let arr = [...new Set(item.map(v => v.nickname))];
        return arr.join('、') + '的会话记录';
      },

      //开启多选模式
      openMultiSelect() {
        this.multiSelect.isOpen = true;
      },

      //关闭多选模式
      closeMultiSelect() {
        this.multiSelect.isOpen = false;
        this.multiSelect.items = [];
      },

      //判断记录是否选中
      verifyMultiSelect(records_id) {
        return this.multiSelect.items.indexOf(records_id) >= 0;
      },

      //触发多选事件
      triggerMultiSelect(records_id) {
        let i = this.multiSelect.items.indexOf(records_id);
        if (i >= 0) {
          this.multiSelect.items.splice(i, 1);
        } else {
          if (this.multiSelect.items.length >= 30) {
            this.$notify({
              title: '温馨提示',
              message: '批量操作最大支持30条数据...'
            });
            return false;
          }
          this.multiSelect.items.push(records_id);
        }
      },

      //验证是否存在选择的指定类型的消息
      verifyMultiSelectType(type) {
        for (let o of this.$root.message.records) {
          if (this.verifyMultiSelect(o.id) && o.msg_type == type) {
            return true;
          }
        }
        return false;
      },

      //消息点击右键触发自定义菜单
      onCopy(idx, item, event) {
        let menus = [];
        let content = this.getSelection();

        if (!content) {
          if (document.getElementById('copy_class_' + item.id)) {
            content = document.getElementById('copy_class_' + item.id).innerText;
          }
        }

        if (item.msg_type == 5) {
          menus.push({
            label: "查看",
            icon: 'iconfont icon-daima',
            customClass: 'cus-contextmenu-item',
            onClick: () => {
              if (item.msg_type == 5) {
                this.catCodeBlock(item.code_block.code, item.code_block.code_lang);
              }
            }
          });
        }

        if (content) {
          menus.push({
            label: "复制",
            icon: 'el-icon-document-copy',
            customClass: 'cus-contextmenu-item',
            onClick: () => {
              copyTextToClipboard(content);
            }
          });
        }

        if (item.user_id == this.$store.state.user.uid) {
          let time = (new Date()).getTime() - Date.parse(item.created_at.replace(/-/g, "/"));
          if (Math.floor(time / 1000 / 60) < 2) {
            menus.push({
              label: "撤回",
              icon: 'el-icon-s-flag',
              customClass: 'cus-contextmenu-item',
              onClick: () => {
                this.revokeRecords(idx, item);
              }
            });
          }
        }

        menus.push({
          label: "删除",
          icon: 'el-icon-delete',
          customClass: 'cus-contextmenu-item',
          onClick: () => {
            this.removeRecords(idx, item);
          }
        });

        menus.push({
          label: "转发",
          icon: 'el-icon-s-promotion',
          customClass: 'cus-contextmenu-item',
          onClick: () => {
            this.forwardRecords(idx, item);
          }
        });

        menus.push({
          label: "引用",
          icon: 'el-icon-connection',
          customClass: 'cus-contextmenu-item',
          onClick: () => {

          }
        });

        menus.push({
          label: "多选",
          icon: 'el-icon-finished',
          customClass: 'cus-contextmenu-item',
          onClick: () => {
            this.openMultiSelect();
          }
        });

        // 判断是否是图片消息
        if (item.msg_type == 2 && item.file.file_type == 1) {
          menus.push({
            label: "收藏",
            icon: 'el-icon-picture',
            customClass: 'cus-contextmenu-item',
            onClick: () => {
              collectEmoticonServ({
                record_id: item.id
              }).then(res => {
                if (res.code == 200) {
                  this.$notify({
                    title: '收藏提示',
                    message: '表情包收藏成功...',
                    type: 'success'
                  });

                  this.$refs.talkEditor.reloadEmoticon();
                }
              }).catch(err => {
                this.$notify({
                  title: '收藏提示',
                  message: '表情包收藏失败...',
                  type: 'warning'
                });
              });
            }
          });
        }

        this.$contextmenu({
          items: menus,
          event,
          customClass: "cus-contextmenu",
          zIndex: 3,
          minWidth: 120,
        });

        this.closeMultiSelect();
        event.preventDefault();
      },
      hideChatGroup() {
        this.groupBoxShow = false;
      },

      //修改群聊免打扰状态
      disturbChange(detail) {
        let key = this.$store.state.talks.items.findIndex(item => item.index_name == `2_${this.params.receiveId}`);
        if (key == -1) return false;
        this.$store.commit({
          type: "UPDATE_TALK_ITEM",
          key: key,
          item: {
            not_disturb: parseInt(detail.status)
          }
        });
      },

      //退出群聊回调事件
      quitGroupSuccess() {
        this.$emit('close-talk');
      },

      //同步群信息
      syncGroupInfo(groupInfo) {
        this.groupNum = groupInfo.members_num;
      },

      // 对话面板滚动事件
      talkPanelScroll(e) {
        this.tipsBoard = !(Math.ceil(e.target.scrollTop) + e.target.clientHeight >= e.target.scrollHeight);
      },

      // 聊天版本滚动到底部
      talkPanelScrollBottom() {
        let el = document.getElementById("lumenChatPanel");
        el.scrollTop = el.scrollHeight;
      }
    }
  };

</script>
<style scoped src="@static/css/talk/style.css"></style>
