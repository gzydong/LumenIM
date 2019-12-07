<template>
  <div id="dialogue-page">
    <lumen-layout-panel :subarea="true">
      <template v-slot:lcolumn>
        <lumen-search ref='lumenSearch' @search-change="searchChange" @click-open="launchGroupChatShow = true"
          placeholder="搜索聊天列表">
        </lumen-search>
        <div ref="lumenChatSidebar" class="lumen-chat-sidebar lumen-scrollbar">
          <p class="sidebar-load-status" v-show="dialogueListLoadStatus == 0"> <i class="iconfont icon-jiazaizhong lumen-icon-spin"></i>
            正在加载聊天列表...
          </p>

          <p class="sidebar-load-status" v-show="dialogueListLoadStatus == 2" @click="loadChatList"> 加载失败，点击我再次尝试...</p>

          <lumen-chat-list v-show="dialogueListLoadStatus == 1" @lumen-click="lumenClick" v-for="(item,idx) in searchDialogueList"
            :key="idx" :idx="idx" :img="item.avatar" :name="item.name" :content="item.msg_text" :time="item.created_at"
            :nickname='item.remark_name' :unreadNum="item.unread_num" :active="indexName == item.index_name" :params="item"
            :disturb="item.not_disturb">
          </lumen-chat-list>
        </div>
      </template>

      <template v-slot:rcolumn>
        <div v-show="indexName == null" class="lumen-w-h100">
          <lumen-amicable></lumen-amicable>
        </div>

        <div v-show="indexName != null" class="lumen-w-h100">
          <header class="lumen-chat-header">
            <p class="lumen-chat-title">
              <span class="lumen-chat-title-icon" :class="{'bg-friend':indexNameInfo.type==1,'bg-group':indexNameInfo.type==2}">{{indexNameInfo.type==1?'友':'群'}}</span>
              <span class="lumen-chat-title-name">&nbsp;{{indexNameInfo.remark_name?indexNameInfo.remark_name:indexNameInfo.name}}</span>
            </p>

            <div class="lumen-chat-icon-toolbar">
              <i class="iconfont icon-shijian"></i>
              <i class="iconfont icon-iconzhengli_wenjian"></i>
              <i class="lumen-icon-group iconfont icon-qunzu" v-show="indexNameInfo.group_id" @click="groupBoxShow = !groupBoxShow"></i>
            </div>
          </header>

          <main ref="lumenChatPanel" class="lumen-chat-main lumen-scrollbar">
            <div class="lumen-message-container">
              <div class="toolbar-loading-box">
                <span v-show="loadStatus == 1">
                  <i class="el-icon-loading"></i> 正在加载数据中...
                </span>

                <span v-show="minRecord != 0 && loadStatus == 0" @click="loadChatRecords">
                  查看更多消息...
                </span>

                <span class="not-have-msg" v-show="minRecord == 0 && loadStatus == 0">
                  没有更多消息了...
                </span>
              </div>
            </div>

            <div class="lumen-message-container" v-for="(item,idx) in dialogueRecords">
              <!-- 系统提示消息 -->
              <div v-if="item.float =='center'" class="lumen-message-container">
                <div class="lumen-message-system">
                  <span v-if="item.msg_type == 1" v-text="item.text_msg"></span>
                  <span v-if="item.msg_type == 5" class="group-invite-tips">
                    <a @click="$store.commit('showSeekFriendBox', {type: 2,text: item.text_msg[0].id})">{{item.text_msg[0].nickname}}</a>
                    邀请了
                    <a v-for="user in item.text_msg.slice(1)" @click="$store.commit('showSeekFriendBox', {type: 2,text: user.id})">{{user.nickname}}</a>
                    加入了群聊...
                  </span>
                  <span v-if="item.msg_type == 6" class="group-invite-tips">
                    <a @click="$store.commit('showSeekFriendBox', {type: 2,text: item.text_msg[0].id})">{{item.text_msg[0].nickname}}</a>
                    退出了群聊...
                  </span>
                </div>
              </div>

              <!-- 用户聊天消息 -->
              <div v-else :class="{'lumen-message-left':item.float =='left','lumen-message-right':item.float =='right'}">
                <div class="lumen-message-avatar">
                  <img :src="item.avatar" @click="$store.commit('showSeekFriendBox', {type: 2,text: item.user_id})"
                    :onerror="$store.state.user.detaultAvatar">
                </div>
                <div class="lumen-message-body">

                  <!-- 判断是否是群聊信息(群聊信息显示用户昵称) -->
                  <p v-show="item.source == 2 && item.float =='left'" class="lumen-message-nickname">
                    <span v-text="item.nickname"></span>
                    <span v-show="item.nickname_remarks">({{item.nickname_remarks}})</span>
                  </p>

                  <div class="lumen-message-content" :class="{'no-background':!(item.msg_type == 1)}">
                    <div class="lumen-arrow" v-show="item.msg_type == 1"></div>

                    <!-- 文字消息 -->
                    <div v-if="item.msg_type == 1">
                      <pre class="lumen-message-text" v-html="item.text_msg"></pre>
                    </div>

                    <!-- 图片消息 -->
                    <div v-else-if="item.msg_type == 2" class="lumen-message-image">
                      <img :src="item.text_msg" onerror="this.src='/static/image/loading-error.jpeg'">
                    </div>

                    <!-- 文件消息 -->
                    <div v-else-if="item.msg_type == 3" class="lumen-message-files">
                      <div class="lumen-files-title">
                        <div class="lumen-files-icon">
                          <i class="iconfont icon-Excel"></i>
                        </div>
                        <div class="lumen-files-info">
                          <p>
                            <span class="lumen-files-name">laravel-2019-11-22.log</span>
                            <span class="lumen-files-size">(6.54KB)</span>
                          </p>
                          <p>文件已成功发送,文件助手暂存30天</p>
                        </div>
                      </div>
                      <div class="lumen-files-tool">
                        <a>下载</a> <a>在线预览</a>
                      </div>
                    </div>

                    <div v-else>
                      未知的消息类型
                    </div>
                  </div>
                </div>
                <div class="clear"></div>
              </div>

              <!-- 消息发送时间 -->
              <p class="lumen-message-time" v-show="compareTime(idx,item.send_time)" v-text="sendTime(item.send_time)"></p>
            </div>
          </main>

          <footer class="lumen-chat-footer">
            <lumen-editor @send="submitSendMesage"></lumen-editor>
          </footer>
        </div>


        <!-- 群聊信息窗口 -->
        <div v-show="groupBoxShow" class="lumen-chat-group-box">
          <lumen-user-group v-if="indexNameInfo.group_id" :group-id='indexNameInfo.group_id' @sendGroup="sendGroupMsg"
            @close="groupBoxShow = false" @quitGroup="quitGroupSuccess"></lumen-user-group>
        </div>
      </template>
    </lumen-layout-panel>

    <!-- 聊天图片预览插件 -->
    <!-- <lumen-picture-preview></lumen-picture-preview> -->

    <!-- 创建群聊组件 -->
    <launch-group-chat v-if="launchGroupChatShow" @close="launchGroupChatShow = false" @create-success="launchGroupChatSuccess"></launch-group-chat>
  </div>
</template>

<script>
  import {
    chatListsApi,
    chatRecordsApi,
    updateChatUnreadNumApi,
    crateChatListApi
  } from '@/services/api';

  import {
    dateFormat,
    formateTime
  } from '@/utils/functions';

  import MessageHandle from '@/utils/MessageHandle';

  import LumenLayoutPanel from '@/components/layout/LumenLayoutPanel';
  import LumenSearch from '@/components/layout/LumenSearch';
  import LumenChatList from '@/components/layout/LumenChatList';
  import LumenEditor from '@/components/layout/LumenEditor';
  import LumenAmicable from '@/components/layout/LumenAmicable';
  import LumenPicturePreview from '@/components/layout/LumenPicturePreview';
  import LumenUserGroup from '@/components/layout/LumenUserGroup';
  import LaunchGroupChat from '@/components/LaunchGroupChat';

  export default {
    name: "dialogue-page",
    components: {
      LumenLayoutPanel,
      LumenSearch,
      LumenChatList,
      LumenEditor,
      LumenAmicable,
      LumenPicturePreview,
      LumenUserGroup,
      LaunchGroupChat
    },

    data() {
      return {
        //群设置窗口
        groupBoxShow: false,

        //是否显示群聊发起窗口
        launchGroupChatShow: false,

        //当前正在对话的索引对对应的数据
        indexNameInfo: {},

        //当前正在对话的索引
        indexName: null,

        dialogueListLoadStatus: 0,
        //用户对话列表
        dialogueList: [],
        //筛选后的对话列表
        searchDialogueList: [],

        //对话最小记录ID
        minRecord: 0,

        //加载历史记录前滚动条的高度
        scrollHeight: 0,

        //对话记录加载状态
        loadStatus: 0,

        //用户对话记录
        dialogueRecords: []
      }
    },

    computed: {
      unreadNum() {
        let num = 0;
        this.dialogueList.map(v => {
          num += parseInt(v.unread_num)
        });
        return num;
      },
    },

    watch: {
      unreadNum(nval, oval) {
        this.$store.commit('updateUnreadNum', nval);
      }
    },

    created() {
      this.loadChatList();
    },

    methods: {
      //搜索框修改触发事件
      searchChange(keyWords) {
        if (keyWords == '') {
          this.searchDialogueList = this.dialogueList;
          return;
        }

        this.searchDialogueList = this.dialogueList.filter((item, i, a) => {
          if (item.remark_name !== '') {
            if (item.remark_name.match(keyWords) != null) {
              return item;
            }
          } else if (item.name.match(keyWords) != null) {
            return item;
          }
        });
      },

      //聊天列表点击事件
      lumenClick(data) {
        this.indexName = data.object.index_name;
        this.indexNameInfo = data.object;
        this.groupBoxShow = false;
        this.clickTab(2, this.indexName);
      },

      //获取用户对话列表
      loadChatList() {
        let that = this;
        this.dialogueListLoadStatus = 0;
        chatListsApi().then(res => {
          if (res.code == 200) {
            that.searchDialogueList = that.dialogueList = res.data.sort(MessageHandle.sortCompare("created_at")).map(
              (item) => {
                let index = item.type == 1 ? item.friend_id : item.group_id;
                item.index_name = `${item.type}_${index}`;
                item.created_at = MessageHandle.beautifyTime(item.created_at);
                return item;
              });
            that.dialogueListLoadStatus = 1;
          } else {
            that.dialogueListLoadStatus = 2;
          }
        }).catch(err => {
          that.dialogueListLoadStatus = 2;
        });
      },

      //加载用户聊天详情信息
      loadChatRecords() {
        let that = this;
        let params = {
          record_id: this.minRecord,
          receive_id: this.indexNameInfo.type == 1 ? this.indexNameInfo.friend_id : this.indexNameInfo.group_id,
          type: this.indexNameInfo.type,
        };

        this.loadStatus = 1;
        this.scrollHeight = this.$refs.lumenChatPanel.scrollHeight;
        let indexName = this.indexName;
        chatRecordsApi(params).then(res => {
          if (res.code != 200) {
            return;
          }

          //防止点击切换过快消息返回延迟，导致信息错误
          if (indexName != that.indexName) {
            return false;
          }

          let records = that.dialogueRecords;
          if (params.record_id == 0) {
            records = [];
          }

          for (const record of res.data.rows) {
            records.unshift(record);
          }

          that.minRecord = res.data.rows.length == res.data.page_size ? res.data.record_id : 0;
          that.loadStatus = 0;
          that.dialogueRecords = records;

          //滚动条处理
          let lumenChatPanel = that.$refs.lumenChatPanel;
          if (params.record_id == 0) { //首页加载数据滚动条置底
            setTimeout(function() {
              lumenChatPanel.scrollTop = lumenChatPanel.scrollHeight;
            }, 0);
          } else { //加载数据完成之后将滚动条重置到加载之前的位置
            setTimeout(function() {
              lumenChatPanel.scrollTop = lumenChatPanel.scrollHeight - that.scrollHeight;
            }, 0);
          }

          //清空消息未读数
          that.dialogueList[that.getIndex(that.indexName)].unread_num = 0;

          //清空消息未读数(后期改成websocket发送消息)
          updateChatUnreadNumApi({
            type: params.type,
            receive: params.receive_id
          });
        }).catch(e => {
          that.loadStatus = 0;
        });
      },

      //回车键发送消息回调事件
      submitSendMesage(content) {
        //调用父类Websocket组件发送消息
        this.$parent.wsSocketObj.send({
          event: 'event_chat_dialogue',
          data: {
            source_type: this.indexNameInfo.type,
            msg_type: content.type,
            send_user: this.$store.state.user.uid,
            receive_user: this.indexNameInfo.type == 1 ? this.indexNameInfo.friend_id : this.indexNameInfo.group_id,
            content: content.text
          }
        });
      },

      //同步用户聊天消息
      syncMessage(message, isActive) {
        let uid = this.$store.state.user.uid;
        let that = this;

        //获取对话索引
        let index_name = message.source_type == 2 || (message.source_type == 1 && message.send_user == uid) ?
          `${message.source_type}_${message.receive_user}` : `${message.source_type}_${message.send_user}`;

        let idx = this.getIndex(index_name);

        //判断消息是否来自当前对话
        if (this.indexName != index_name) {
          if (message.send_user == 0) return;

          let text = message.content;
          if (message.msg_type == 2) {
            text = '[图片消息]';
          } else if (message.msg_type == 3) {
            text = '[文件消息]';
          }

          this.dialogueList[idx].unread_num++;
          this.dialogueList[idx].msg_text = text;

          this.$notify({
            message: `您有新的消息请注意查收...`,
            position: 'top-right'
          });

          return false;
        }

        this.dialogueRecords.push(MessageHandle.handle(message, this.indexNameInfo, this.$store.state.user));

        //更新消息未读数
        if (uid != message.send_user) {
          updateChatUnreadNumApi({
            type: message.source_type,
            receive: message.send_user
          });
        }

        //滚动条处理
        setTimeout(function() {
          let lumenChatPanel = that.$refs.lumenChatPanel;
          lumenChatPanel.scrollTop = lumenChatPanel.scrollHeight;
        }, 50);
      },

      //聊天时间人性化处理
      sendTime: formateTime,

      //处理时间是否显示
      compareTime(index, datetime) {
        datetime = datetime.replace(/-/g, "/");
        let time = Math.floor(Date.parse(datetime) / 1000);
        let currTime = Math.floor(new Date().getTime() / 1000);

        //当前时间5分钟内时间不显示
        if (((currTime - time) < 300)) {
          return false;
        }

        let len = this.dialogueRecords.length - 1;
        if (index == len) {
          return true;
        }

        let nextDate = this.dialogueRecords[index + 1].send_time.replace(/-/g, "/");
        return !(dateFormat("YYYY-mm-dd HH:MM", new Date(datetime)) == dateFormat("YYYY-mm-dd HH:MM", new Date(nextDate)));
      },

      //发起群聊成功后回调方法
      launchGroupChatSuccess(data) {
        let groupInfo = data.group_info;
        let index_name = `2_${groupInfo.id}`;
        if (this.getIndex(index_name) >= 0) {
          this.clickTab(2, index_name);
        } else {
          this.clickTab(1, {
            type: 2,
            group_id: groupInfo.id,
            index_name: index_name,
            avatar: groupInfo.avatarurl,
            name: groupInfo.group_name
          });
        }

        this.launchGroupChatShow = false;
      },

      //根据用户对话索引获取对话数组对应的key
      getIndex(index_name) {
        return this.dialogueList.findIndex(function(item, index, arr) {
          return item.index_name == index_name;
        });
      },

      //新增对话列表
      unshiftDialogue(obj) {
        this.dialogueList.unshift(obj);
        this.searchDialogueList = this.dialogueList;
      },

      //切换聊天栏目
      clickTab(type = 1, obj) {
        let that = this;

        //初始化数据
        let sync = function(index_name, obj) {
          that.minRecord = 0;
          that.scrollHeight = 0;
          that.dialogueRecords = [];
          that.indexName = index_name;
          that.indexNameInfo = obj;
        };

        if (type == 1) {
          obj = MessageHandle.getDialogueObj(obj);

          this.unshiftDialogue(obj);

          sync(obj.index_name, obj);

          this.loadChatRecords();
          crateChatListApi({
            type: obj.type,
            receive_id: obj.type == 1 ? obj.friend_id : obj.group_id
          });

          return;
        }

        let idx = this.getIndex(obj);
        if (idx < 0) return;

        sync(obj, this.dialogueList[idx]);

        this.searchDialogueList = this.dialogueList;
        this.loadChatRecords();

        setTimeout(function() {
          let lumenChatSidebar = that.$refs.lumenChatSidebar;
          let top = 64 * idx;
          let minHeight = lumenChatSidebar.scrollTop;
          let maxHeight = minHeight + lumenChatSidebar.offsetHeight;
          if (!(top >= minHeight && top <= maxHeight)) {
            lumenChatSidebar.scrollTop = top;
          }
        }, 0);
      },

      //退出群聊回调事件
      quitGroupSuccess() {
        this.indexName = null;
        this.groupBoxShow = false;
        this.loadChatList();
      },

      //群聊窗口点击发送群聊信息按钮回调事件
      sendGroupMsg() {
        this.groupBoxShow = false;
      }
    }
  };
</script>

<style scoped>
  #dialogue-page {
    width: 100%;
    height: 100%;
  }

  .lumen-w-h100 {
    width: 100%;
    height: 100%;
  }




  #dialogue-page>>>#luem-layout-panel .luem-panel-rcolumn {
    position: relative;
  }

  .lumen-chat-sidebar {
    height: calc(100% - 60px);
    height: -moz-calc(100% - 60px);
    height: -webkit-calc(100% - 60px);
    background: #e4e4e5;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .lumen-chat-sidebar .sidebar-load-status {
    text-align: center;
    font-size: 14px;
    margin-top: 30px;
    color: #a0a0a0;
    cursor: pointer;
  }

  .lumen-chat-header {
    height: 59px;
    box-shadow: -1px 1px 20px #e8e3e3;
  }

  .lumen-chat-header .lumen-chat-title {
    position: relative;
    height: 60px;
    line-height: 60px;
    text-indent: 10px;
  }

  .lumen-chat-title .lumen-chat-title-icon {
    font-size: 10px;
    color: white;
    padding: 2px;
    border-radius: 4px;
  }

  .lumen-chat-title .bg-friend {
    background: #66b1ff;
  }

  .lumen-chat-title .bg-group {
    background: rgb(255, 197, 106);
  }

  .lumen-chat-title .lumen-chat-title-name {
    position: absolute;
    display: inline-block;
    top: 2px;
    left: 20px;
    font-size: 14px;
  }

  .lumen-chat-header .lumen-chat-icon-toolbar {
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 60px;
    line-height: 60px;
    text-align: right;
    padding-right: 15px;
  }

  .lumen-chat-header .lumen-chat-icon-toolbar i {
    font-size: 23px;
    color: #676767;
    cursor: pointer;
    margin-left: 8px;
  }

  .lumen-chat-header .lumen-chat-icon-toolbar .lumen-icon-group {
    font-size: 22px;
  }

  .lumen-chat-icon-toolbar i:active {
    color: #CCCCCC !important;
  }

  .lumen-chat-main {
    height: calc(100% - 60px - 158px);
    height: -moz-calc(100% - 60px - 158px);
    height: -webkit-calc(100% - 60px - 158px);
    overflow-y: auto;
  }

  .lumen-chat-main .lumen-message-container {
    margin: 20px 10px 0 10px;
    min-height: 30px;
    overflow: hidden;
  }

  .lumen-message-container .lumen-message-system {
    text-align: center;
  }

  .lumen-message-system span {
    display: inline-block;
    background: #e2e2e2cc;
    padding: 3px 10px 3px 10px;
    border-radius: 3px;
    font-size: 12px;
    color: #b9b8b8;
  }

  .lumen-message-system .group-invite-tips a {
    color: #71a7ea;
    cursor: pointer;
  }

  .lumen-message-system .group-invite-tips a:after {
    content: '、';
  }

  .lumen-message-system .group-invite-tips a:first-child:after,
  .lumen-message-system .group-invite-tips a:last-child:after {
    content: '' !important;
  }

  .lumen-chat-main .lumen-message-container:last-child {
    margin-bottom: 20px;
  }

  .lumen-message-container .lumen-message-avatar {
    width: 40px;
    height: 40px;
    background: white;
  }

  .lumen-message-container .lumen-message-avatar img {
    width: 40px;
    height: 40px;
    border-radius: 3px;
    cursor: pointer;
  }

  .lumen-message-container .lumen-message-body {
    max-width: calc(100% - 80px);
    min-height: 50px;
  }

  .lumen-message-container .lumen-message-time {
    text-align: center;
    color: #CCC9C9;
    font-size: 12px;
    margin-bottom: 5px;
    margin-top: 15px;
  }

  .lumen-message-nickname {
    height: 20px;
    font-size: 12px;
    color: #bab0b0;
  }

  .lumen-message-content {
    background: white;
    border-radius: 2px;
    position: relative;
    padding: 5px 5px 0 5px;
    min-height: 35px;
  }

  .no-background {
    background: #f5f5f5 !important;
  }

  .lumen-message-content .lumen-arrow {
    position: absolute;
    width: 0;
    height: 0;
    font-size: 0;
    border: solid 5px;
    top: 5px;
  }

  .lumen-message-content .lumen-message-text {
    white-space: pre-line;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    font-size: 16px;
    padding: 0 5px 5px 5px;
  }

  .lumen-message-content .lumen-message-image {
    position: relative;
    cursor: pointer;
  }

  .lumen-message-content .lumen-message-image img {
    max-width: 200px;
  }

  .lumen-message-content .lumen-message-files {
    width: 300px;
    height: 80px;
    background: white;
  }

  .lumen-message-files .lumen-files-icon {
    color: #089e08;
    width: 50px;
    height: 50px;
    float: left;
  }

  .lumen-message-files .lumen-files-icon i {
    font-size: 46px;
  }

  .lumen-message-files .lumen-files-title {
    height: 50px;
    border-bottom: 1px solid #eff7ef;
  }

  .lumen-files-title .lumen-files-info {
    width: 250px;
    height: 50px;
    float: left;
  }

  .lumen-files-title .lumen-files-info p:first-child {
    height: 25px;
    line-height: 25px;
    padding-left: 5px;
    color: rgb(76, 76, 76);
    font-size: 13px;
  }

  .lumen-files-title .lumen-files-info p:nth-child(2) {
    height: 25px;
    line-height: 25px;
    font-size: 12px;
    padding-left: 5px;
    color: #929191;
  }

  .lumen-files-info .lumen-files-size {
    color: #929191;
    font-size: 12px;
  }

  .lumen-message-files .lumen-files-tool {
    height: 30px;
    background: white;
    text-align: right;
    padding-right: 5px;
    line-height: 30px;
    color: #00D7FF;
    font-size: 12px;
    cursor: pointer;
  }

  .lumen-message-left .lumen-message-avatar {
    float: left;
  }

  .lumen-message-right .lumen-message-avatar {
    float: right;
  }

  .lumen-message-left .lumen-message-body {
    float: left;
    padding-left: 10px;
  }

  .lumen-message-right .lumen-message-body {
    float: right;
    padding-right: 10px;
  }

  .lumen-message-right .lumen-message-nickname {
    text-align: right;
  }

  .lumen-message-left .lumen-arrow {
    border-color: #f5f5f5 #fff #f5f5f5 #f5f5f5;
    left: -10px;
  }

  .lumen-message-right .lumen-arrow {
    border-color: #f5f5f5 #f5f5f5 #f5f5f5 #1ebafc;
    right: -10px;
  }

  .lumen-message-right .lumen-message-content {
    background: #1ebafc;
    color: white;
  }

  .lumen-message-left .lumen-message-content {
    /* background: #e1e7ea; */
  }

  .lumen-message-container .toolbar-loading-box {
    color: #00d7ff;
    cursor: pointer;
    text-align: center;
  }

  .lumen-message-container .toolbar-loading-box .not-have-msg {
    color: #cec4c4;
  }

  .lumen-chat-footer {
    height: 158px;
  }

  .lumen-chat-group-box {
    position: absolute;
    width: 350px;
    height: 100%;
    top: 0px;
    right: 0;
    z-index: 2;
    animation: showBox .5s ease-in-out;
    -webkit-animation: showBox .5s ease-in-out;
    -moz-animation: showBox .5s ease-in-out;
    -webkit-box-direction: normal;
    background: white;
    box-shadow: 0 0 14px #cccccc70;
  }

  @keyframes showBox {
    0% {
      transform: translateX(600px)
    }

    to {
      transform: translateX(0)
    }
  }

  @-webkit-keyframes showBox {
    0% {
      -webkit-transform: translateX(600px)
    }

    to {
      -webkit-transform: translateX(0)
    }
  }
</style>
