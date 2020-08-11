<template>
  <div>
    <el-container class="vh100" style="position: relative;background-color: white;">
      <!-- 头部信息 -->
      <el-header class="padding0 panel-header no-user-select">
        <div class="title">
          <span class="badge badge-friend" v-if="params.source == 1">友</span>
          <span class="badge" v-else>群</span>
          <span class="name">
            <span>{{params.nickname}}</span>
            <span class="num" v-show="groupNum && params.source == 2">({{groupNum}})</span>
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
          <p><i class="el-icon-time" @click="findChatRecord = true"></i></p>
          <p v-show="params.source == 2">
            <i class="el-icon-setting" @click="groupBoxShow = !groupBoxShow"></i>
          </p>
        </div>
      </el-header>

      <!-- 主体信息 -->
      <el-main class="padding0 panel-main lumen-scrollbar" ref="lumenChatPanel" id="lumenChatPanel"
        @scroll.native="talkPanelScroll($event)">
        <div class="record-container">
          <div class="toolbars">
            <span v-show="loadRecord.status == 0">
              <i class="el-icon-loading"></i> 正在加载数据中...
            </span>
            <span v-show="loadRecord.status == 1" @click="loadChatRecords">查看更多消息...</span>
            <span v-show="loadRecord.status == 2" class="not-have-msg">没有更多消息了...</span>
          </div>
        </div>

        <div class="record-container" v-for="(item,idx) in records"
          :class="{'container-checked':multiSelect.isOpen === true}">

          <!-- 系统提示消息 -->
          <div v-if="item.float =='center'" class="message-system">
            <span v-if="item.msg_type == 1" v-text="item.content"></span>

            <span v-if="item.msg_type == 3 && item.group_notify.type == 1" class="group-invite-tips">
              <a
                @click="catFriendDetail(item.group_notify.operate_user.id,2)">{{item.group_notify.operate_user.nickname}}</a>
              <span style="background: none;">邀请了</span>
              <a v-for="user in item.group_notify.users" @click="catFriendDetail(user.id,2)">[ {{user.nickname}} ]</a>
              <span style="background: none;">加入了群聊 ...</span>
            </span>

            <span v-else-if="item.msg_type == 3 && item.group_notify.type == 2" class="group-invite-tips">
              <a
                @click="catFriendDetail(item.group_notify.operate_user.id,2)">{{item.group_notify.operate_user.nickname}}</a>
              <span style="background: none;">将</span>
              <a v-for="user in item.group_notify.users" @click="catFriendDetail(user.id,2)">[ {{user.nickname}} ]</a>
              <span style="background: none;">踢出了群聊 ...</span>
            </span>

            <span v-else-if="item.msg_type == 3 && item.group_notify.type == 3" class="group-invite-tips">
              <a
                @click="catFriendDetail(item.group_notify.operate_user.id,2)">{{item.group_notify.operate_user.nickname}}</a>
              <span style="background: none;">退出了群聊</span>
            </span>
          </div>

          <!-- 撤回消息提示 -->
          <div v-else-if="item.is_revoke == 1" class="message-system">
            <span v-if="$store.state.user.uid == item.user_id" class="recall">你撤回了一条消息 |
              {{sendTime(item.send_time)}}</span>
            <span v-else-if="params.source == 1" class="recall">对方撤回了一条消息 | {{sendTime(item.send_time)}}</span>
            <span v-else class="recall">"{{item.nickname}}" 撤回了一条消息 | {{sendTime(item.send_time)}}</span>
          </div>

          <!-- 用户聊天消息 -->
          <div v-else :class="{'left-record':item.float =='left','right-record':item.float =='right'}">

            <div class="checked-button"
              v-show="multiSelect.isOpen && (item.msg_type==1 || item.msg_type==2 || item.msg_type==5)"
              @click="triggerMultiSelect(item.id)">
              <i class="el-icon-success" :class="{'selected-record':verifyMultiSelect(item.id)}"></i>
            </div>

            <div class="record-avatar no-user-select">
              <img :src="item.avatar" @click="catFriendDetail(item.user_id,2)"
                :onerror="$store.state.user.detaultAvatar" />
            </div>

            <div class="talk-container">
              <!-- 判断是否是群聊信息(群聊信息显示用户昵称) -->
              <p v-show="item.source == 2 && item.float =='left'" class="record-nickname">
                <span v-text="item.nickname"></span>
                <span v-show="item.friend_remarks">({{item.friend_remarks}})</span>
              </p>

              <div class="talk-content" :class="{'no-background':isNoBackground(item)}">
                <div class="lumen-arrow" v-show="!isNoBackground(item)"></div>

                <!-- 文字消息 -->
                <div class="text-record" v-if="item.msg_type == 1 && item.is_code == 0"
                  @contextmenu="onCopy(idx,item,$event)">
                  <pre v-html="item.content" :id="'copy_class_'+item.id"></pre>
                </div>

                <!-- 代码块消息 -->
                <div class="codeblock-record" v-else-if="item.msg_type == 1 && item.is_code == 1"
                  @contextmenu="onCopy(idx,item,$event)">
                  <i class="iconfont icon-tubiao_chakangongyi cat-code-block"
                    @click="catCodeBlock(item.content,item.code_lang)"></i>
                  <prism-editor :readonly="true" :code="item.content" :language="item.code_lang"
                    :line-numbers="false" />
                </div>

                <!-- 图片消息 -->
                <div class="images-record" v-else-if="item.msg_type == 2 && item.file_type == 1"
                  @contextmenu="onCopy(idx,item,$event)">
                  <el-image :lazy="true" fit="cover" :style="getImgStyle(item.file_url)" :src="item.file_url"
                    :preview-src-list="images" :z-index="getImgIndex(item.file_url)">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                    <div slot="placeholder" class="image-slot">
                      图片加载中<span class="dot">...</span>
                    </div>
                  </el-image>

                  <i class="el-icon-circle-plus enlarge"></i>
                </div>

                <!-- 文件消息 -->
                <div class="file-record" v-else-if="item.msg_type == 2 && item.file_type == 3"
                  @contextmenu="onCopy(idx,item,$event)">
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
                <div class="dialogue-records" v-else-if="item.msg_type == 4" @contextmenu="onCopy(idx,item,$event)"
                  @click="catForwardRecords(item.id)">
                  <p class="records-title">
                    <span v-text="getForwardTitle(item.forward_info.list)"></span>
                  </p>
                  <div class="records-list">
                    <p v-for="info in item.forward_info.list">
                      <span v-text="info.nickname"></span>
                      <span>:</span>
                      <span v-text="info.text"></span>
                    </p>
                  </div>
                  <p class="records-footer">
                    <span>转发：会话记录 ({{item.forward_info.num}}条)</span>
                  </p>
                </div>

                <div v-else>未知的消息类型</div>
              </div>
            </div>
            <div class="clear"></div>
          </div>

          <!-- 消息发送时间 -->
          <p class="record-time no-user-select" v-show="compareTime(idx,item.send_time)"
            v-text="sendTime(item.send_time)"></p>
        </div>
      </el-main>

      <!-- 页脚信息 -->
      <el-footer class="padding0 panel-footer" height="160">
        <template v-if="!multiSelect.isOpen">
          <editor ref="talkEditor" @send="submitSendMesage" @input-event="inputEventPush" />
        </template>
        <template v-else>
          <div class="multi-select">
            <div class="multi-close" @click="closeMultiSelect">
              <i class="el-icon-close"></i>
            </div>
            <div class="multi-title" v-show="multiSelect.items.length > 0">
              <span>已选中：{{multiSelect.items.length}} 条消息</span>
            </div>
            <div class="multi-btn-group">
              <div class="multi-icon" @click="handleMultiMode(1)">
                <i class="iconfont icon-zhuanfa"></i>
              </div>
              <p>逐条转发</p>
            </div>
            <div class="multi-btn-group">
              <div class="multi-icon" @click="handleMultiMode(2)">
                <i class="iconfont icon-zhuangfa"></i>
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
          @send-friend-msg="sendFriendMsg" @group-info="syncGroupInfo" />
      </div>

      <!-- 置底按钮 -->
      <transition name="el-fade-in-linear">
        <div class="tips-board" v-show="tipsBoard" @click="talkPanelScrollBottom">
          <svg-icon icon-class="mention-down" />
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
    <user-business-card ref="userBusinessCard" @send-friend-msg="sendFriendMsg" />
  </div>
</template>

<script type="text/javascript">
  import Vue from "vue";

  import UserBusinessCard from "@/components/user/UserBusinessCard";
  import SearchChatRecord from "@/components/chat/SearchChatRecord";
  import ForwardRecords from "@/components/chat/ForwardRecords";
  import SelectContacts from "@/components/chat/SelectContacts";
  import UserGroup from "@/components/chat/UserGroup";
  import CodeBlock from "@/components/chat/CodeBlock";
  import Editor from "@/components/editor/Editor";

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
      UserBusinessCard
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
        this.images = records.filter(item => item.msg_type == 2 && item.file_type == 1).map(item => item.file_url);
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
        const source_type = this.params.source;
        const send_user = this.$store.state.user.uid;
        const receive_user = this.params.receiveId;
        const msg_type = content.type;

        let text_message = "";
        let file_message = "";
        let code = {
          is_code: false,
          code_lang: ""
        };

        //content.type  1:文本 2:文件 3:表情包 4:代码块
        if (content.type == 1) {
          text_message = content.text;
        } else if (content.type == 4) {
          text_message = content.code;
          code = {
            is_code: true,
            code_lang: content.code_lang
          };
        } else {
          file_message = content.text;
        }
        this.sendSocket({
          event: "event_chat_dialogue",
          data: {
            send_user, //发送消息的用户ID
            receive_user, //接受者消息ID(用户ID或群ID)
            source_type, //聊天类型  1:私聊     2:群聊
            msg_type, //消息类型  1:文本消息 2:文件消息 3:表情包消息 4:代码块消息
            text_message, //文本消息内容
            file_message, //文件消息或表情包消息
            code_lang: code.code_lang
          }
        });
      },

      //推送编辑事件消息
      inputEventPush() {
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
          event: "event_chat_input_tip",
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

          this.$root.message.records = records;

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
          if (this.verifyMultiSelectType(5)) {
            this.$notify({
              title: '消息转发',
              message: '会话记录不支持合并转发'
            });
            return false;
          }

          this.selectContacts.isShow = true;
        } else if (type == 2) { //合并转发
          if (this.verifyMultiSelectType(5)) {
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

      //美化时间格式
      beautifyTime(datetime = "") {
        if (datetime == null) {
          return "";
        }

        datetime = datetime.replace(/-/g, "/");

        //当前时间戳
        let time = new Date();
        let outTime = new Date(datetime);
        if (/^[1-9]\d*$/.test(datetime)) {
          outTime = new Date(parseInt(datetime) * 1000);
        }

        if (time.getTime() < outTime.getTime()) {
          return parseTime(outTime, "{y}/{m}/{d}");
        }

        if (time.getFullYear() != outTime.getFullYear()) {
          return parseTime(outTime, "{y}/{m}/{d}");
        }

        if (time.getMonth() != outTime.getMonth()) {
          return parseTime(outTime, "{m}/{d}");
        }

        if (time.getDate() != outTime.getDate()) {
          let day = outTime.getDate() - time.getDate();
          if (day == -1) {
            return parseTime(outTime, "昨天 {h}:{i}");
          }

          if (day == -2) {
            return parseTime(outTime, "前天 {h}:{i}");
          }

          return parseTime(outTime, "{m}-{d}");
        }

        if (time.getHours() != outTime.getHours()) {
          return parseTime(outTime, "{h}:{i}");
        }

        let minutes = outTime.getMinutes() - time.getMinutes();
        if (minutes == 0) {
          return "刚刚";
        }

        minutes = Math.abs(minutes);
        return `${minutes}分钟前`;
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

        let nextDate = this.$root.message.records[index + 1].send_time.replace(
          /-/g,
          "/"
        );

        return !(
          parseTime(new Date(datetime), "{y}-{m}-{d} {h}:{i}") ==
          parseTime(new Date(nextDate), "{y}-{m}-{d} {h}:{i}")
        );
      },

      //查看好友用户信息
      catFriendDetail(value, type) {
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

        if (arr.length == 1) {
          return arr[0] + '的会话记录';
        }

        return arr.slice(0, arr.length - 1).join('、') + '及' + arr[arr.length - 1] + '的会话记录';
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

        if (item.msg_type == 1 && item.is_code == 1) {
          menus.push({
            label: "查看",
            icon: 'iconfont icon-daima',
            customClass: 'cus-contextmenu-item',
            onClick: () => {
              if (item.msg_type == 1 && item.is_code == 1) {
                this.catCodeBlock(item.content, item.code_lang);
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
          let time = (new Date()).getTime() - Date.parse(item.send_time.replace(/-/g, "/"));
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
        if (item.msg_type == 2 && item.file_type == 1) {
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

      //切换聊天对象
      sendFriendMsg(friendInfo) {
        this.groupBoxShow = false;
        this.$emit('change-talk', friendInfo.index_name);
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
