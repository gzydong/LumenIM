<template>
  <div id="chat-dialogue-page">
    <lumen-layout-panel :subarea="true">
      <template v-slot:lcolumn>
        <lumen-search @search-change="searchChange" @click-open="isLaunchGroupChat = true" placeholder="搜索聊天列表"></lumen-search>
        <div class="lumen-chat-sidebar lumen-scrollbar">
          <lumen-chat-list @lumen-click="lumenClick" v-for="(item,idx) in $store.state.dialogue.chatModule.chatList"
            :key="idx" :idx="idx" :img="item.avatar" :name="item.name" :content="item.msg_text" :time="item.created_at"
            :nickname='item.remark_name' :unreadNum="item.unread_num" :active="$store.state.dialogue.chatModule.idx == item.index_name"
            :params="item"></lumen-chat-list>
        </div>
      </template>

      <template v-slot:rcolumn>
        <!-- 群聊信息窗口 -->
        <div v-show="show" class="lumen-chat-group-box">
          <lumen-user-group v-if="groupId" :group-id='groupId' @close="show = false"></lumen-user-group>
        </div>

        <lumen-amicable v-show="$store.state.dialogue.chatModule.idx == null"></lumen-amicable>
        <div v-show="$store.state.dialogue.chatModule.idx != null" style="height: 100%;width: 100%;">
          <header class="lumen-chat-header">
            <p class="lumen-chat-title">
              <span class="lumen-chat-title-icon" :class="{'bg-friend':false,'bg-group':true}">友</span>
              <span class="lumen-chat-title-name">{{otherPartyName}} </span>
            </p>

            <div class="lumen-chat-icon-toolbar">
              <i class="iconfont icon-shijian"></i>
              <i class="iconfont icon-iconzhengli_wenjian"></i>
              <i class="iconfont icon-qunzu" v-show="groupId" @click="show = !show" style="font-size: 22px;"></i>
            </div>
          </header>

          <main ref="lumenChatPanel" class="lumen-chat-main lumen-scrollbar">

            <div class="lumen-message-container">
              <div class="toolbar-loading-box">
                <span v-show="$store.state.dialogue.chatModule.loadStatus == 1">
                  <i class="el-icon-loading"></i> 正在加载数据中...
                </span>

                <span v-show="$store.state.dialogue.chatModule.minRecordId != null && $store.state.dialogue.chatModule.loadStatus == 0"
                  @click="loadChatRecords">
                  查看更多消息...
                </span>

                <span class="not-have-msg" v-show="$store.state.dialogue.chatModule.minRecordId == null && $store.state.dialogue.chatModule.loadStatus == 0">
                  没有更多消息了...
                </span>
              </div>
            </div>

            <div class="lumen-message-container" v-for="(item,idx) in $store.state.dialogue.chatModule.cahtRecords">
              <!-- 系统提示消息 -->
              <div v-if="item.float =='center'" class="lumen-message-container">
                <div class="lumen-message-system">
                  <span v-text="item.text_msg"></span>
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
              <p class="lumen-message-time" v-show="compareTime(idx,$store.state.dialogue.chatModule.cahtRecords.length,item.send_time)"
                v-text="sendTime(item.send_time)"></p>
            </div>
          </main>

          <footer class="lumen-chat-footer">
            <lumen-editor @send="submitSendMesage"></lumen-editor>
          </footer>
        </div>
      </template>
    </lumen-layout-panel>

    <!-- <lumen-picture-preview></lumen-picture-preview> -->

    <!-- 创建群聊组件 -->
    <launch-group-chat v-if="isLaunchGroupChat" @close="isLaunchGroupChat = false" @create-success="launchGroupChatSuccess"></launch-group-chat>
  </div>
</template>

<script>
  import {
    chatListsApi,
    chatRecordsApi,
    updateChatUnreadNumApi
  } from '@/services/api'

  import {
    dateFormat,
    formateTime
  } from '@/utils/functions'

  import LumenLayoutPanel from '@/components/layout/LumenLayoutPanel';
  import LumenSearch from '@/components/layout/LumenSearch';
  import LumenChatList from '@/components/layout/LumenChatList';
  import LumenEditor from '@/components/layout/LumenEditor';
  import LumenAmicable from '@/components/layout/LumenAmicable';
  import LumenPicturePreview from '@/components/layout/LumenPicturePreview';
  import LumenUserGroup from '@/components/layout/LumenUserGroup.vue';

  //创建群聊组件
  import LaunchGroupChat from '@/components/LaunchGroupChat';

  export default {
    name: "chat-dialogue-page",
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
    computed: {
      getIdx() {
        return this.$store.state.dialogue.chatModule.idx
      }
    },
    watch: {
      getIdx(newVal, oldVal) {
        this.show = false;
        let info = this.$store.state.dialogue.chatModule.chatList[this.getChatListIdx(newVal)];
        this.otherPartyName = info.remark_name || info.name;
        this.groupId = info.group_id;
        this.loadChatRecords();
      }
    },
    created() {
      this.loadChatLists();
    },
    data() {
      return {

        show: false,
        //对方聊天名称
        otherPartyName: '',

        groupId: 0,

        isLaunchGroupChat: false
      }
    },
    methods: {
      //搜索框修改触发事件
      searchChange(value) {
        alert('功能正在研发中请耐心等待...');
      },

      //聊天列表点击事件
      lumenClick(data) {
        this.$store.commit('func', {
          idx: data.object.index_name,
          minRecordId: 0,
          cahtRecords: []
        });
        if (this.getIdx == data.object.index_name) {
          this.loadChatRecords();
        }
      },

      //格式化显示时间
      formateTime(datetime) {
        datetime = datetime.replace(/-/g, "/");

        //当前时间戳
        let time = new Date();
        let outTime = new Date(datetime);
        if (/^[1-9]\d*$/.test(datetime)) {
          outTime = new Date(parseInt(datetime) * 1000);
        }

        if (time.getTime() < outTime.getTime()) {
          return dateFormat("YYYY/mm/dd", outTime);
        }

        if (time.getFullYear() != outTime.getFullYear()) {
          return dateFormat("YYYY/mm/dd", outTime);
        }

        if (time.getMonth() != outTime.getMonth()) {
          return dateFormat("mm/dd", outTime);
        }

        if (time.getDate() != outTime.getDate()) {
          let day = outTime.getDate() - time.getDate();
          if (day > 0) {
            return dateFormat("mm-dd", outTime);
          }

          if (day == -1) {
            return dateFormat("昨天 HH:MM", outTime);
          }

          if (day == -2) {
            return dateFormat("前天 HH:MM", outTime);
          }

          return dateFormat("mm-dd", outTime);
        }

        if (time.getHours() != outTime.getHours()) {
          return dateFormat("HH:MM", outTime);
        }

        let minutes = outTime.getMinutes() - time.getMinutes();
        if (minutes == 0) {
          return '刚刚';
        }

        minutes = Math.abs(minutes)
        return `${minutes}分钟前`;
      },

      //获取用户聊天记录列表
      loadChatLists() {
        let that = this;
        chatListsApi().then(res => {
          if (res.code == 200) {
            let list = res.data;
            let compare = function(prop) {
              return function(obj1, obj2) {
                let val1 = obj1[prop],
                  val2 = obj2[prop];
                if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                  val1 = Number(val1);
                  val2 = Number(val2);
                }
                if (val1 > val2) {
                  return -1;
                } else if (val1 < val2) {
                  return 1;
                } else {
                  return 0;
                }
              }
            }

            list.sort(compare("created_at"));
            list.map((item) => {
              item.index_name = (item.type == 1) ? `${item.type}_${item.friend_id}` :
                `${item.type}_${item.group_id}`;
              item.created_at = that.formateTime(item.created_at);
              return item;
            });

            that.$store.commit('updateChatList', {
              type: 1,
              list
            });
          }
        })
      },

      //获取聊天详情信息
      loadChatRecords() {
        let that = this;
        let module = this.$store.state.dialogue.chatModule;
        let o = module.chatList[this.getChatListIdx(module.idx)];
        let params = {
          record_id: module.minRecordId,
          receive_id: o.type == 1 ? o.friend_id : o.group_id,
          type: o.type,
        };

        that.$store.commit('func', {
          loadStatus: 1,
          scrollHeight: this.$refs.lumenChatPanel.scrollHeight
        });

        chatRecordsApi(params).then(res => {
          let chatModule = that.$store.state.dialogue.chatModule;

          //防止点击过快，导致数据返回出错
          if (chatModule.idx != module.idx) {
            return;
          }

          let tmpArr = chatModule.cahtRecords;
          for (const record of res.data.rows) {
            tmpArr.unshift(record);
          }

          that.$store.commit('func', {
            minRecordId: (res.data.rows.length == res.data.page_size) ? res.data.record_id : null,
            loadStatus: 0,
            cahtRecords: tmpArr,
          });

          //滚动条处理
          let lumenChatPanel = that.$refs.lumenChatPanel;
          if (params.record_id == 0) { //首页加载数据滚动条置底
            setTimeout(function() {
              lumenChatPanel.scrollTop = lumenChatPanel.scrollHeight;
            }, 0);

            updateChatUnreadNumApi({
              type: params.type,
              receive: params.receive_id
            });

            this.$store.commit('updateChatList', {
              type: 3,
              idx: that.getChatListIdx(that.getIdx)
            });
          } else { //加载数据完成之后将滚动条重置到加载之前的位置
            setTimeout(function() {
              lumenChatPanel.scrollTop = lumenChatPanel.scrollHeight - chatModule.scrollHeight;
            }, 0);
          }
        }).catch(e => {
          that.$store.commit('func', {
            loadStatus: 0
          });
        });
      },

      //回车键发送消息回调事件
      submitSendMesage(content) {
        let module = this.$store.state.dialogue.chatModule;
        let receiveInfo = module.chatList[this.getChatListIdx(module.idx)];
        let message = {
          event: 'event_chat_dialogue',
          data: {
            source_type: receiveInfo.type,
            msg_type: content.type,
            send_user: this.$store.state.user.uid,
            receive_user: receiveInfo.type == 1 ? receiveInfo.friend_id : receiveInfo.group_id,
            content: content.text
          }
        };

        this.$parent.wsSocketObj.send(message);
      },

      //同步用户聊天消息
      syncMessage(message, isActive) {
        let that = this;
        let uid = this.$store.state.user.uid;
        let index_name = '';
        if (message.source_type == 1) {
          if (message.send_user == uid) {
            index_name = `${message.source_type}_${message.receive_user}`;
          } else {
            index_name = `${message.source_type}_${message.send_user}`;
          }
        } else {
          index_name = `${message.source_type}_${message.receive_user}`;
        }

        if (this.$store.state.dialogue.chatModule.idx != index_name) {
          let idx = this.getChatListIdx(index_name);
          this.$store.commit('updateChatList', {
            type: 2,
            message: {
              idx,
              text: message.content
            }
          });

          this.$notify({
            message: `您有新的消息请注意查收...`,
            position: 'top-right'
          });

          return false;
        }

        let module = this.$store.state.dialogue.chatModule;
        let receiveInfo = module.chatList[this.getChatListIdx(module.idx)];

        let avatar = '';
        if (message.send_user == uid) {
          avatar = this.$store.state.user.avatar;
        } else if (message.source_type == 1) {
          avatar = receiveInfo.avatar;
        } else {
          avatar = message.sendUserInfo.avatar;
        }

        this.$store.commit('pushCahtRecords', {
          avatar: avatar,
          float: message.send_user == uid ? 'right' : 'left',
          msg_type: message.msg_type,
          nickname: message.sendUserInfo.nickname,
          nickname_remarks: message.sendUserInfo.remark_nickname,
          receive_id: message.receive_user,
          send_time: message.send_time,
          source: message.source_type,
          text_msg: message.content,
          user_id: message.send_user
        });

        //更新消息未读数
        if (this.$store.state.user.uid != message.send_user) {
          updateChatUnreadNumApi({
            type: message.source_type,
            receive: message.send_user
          });
        }

        //滚动条处理
        setTimeout(function() {
          let lumenChatPanel = that.$refs.lumenChatPanel;
          lumenChatPanel.scrollTop = lumenChatPanel.scrollHeight;
        }, 0);
      },

      // 获取聊天列表数组索引
      getChatListIdx(index_name) {
        let list = this.$store.state.dialogue.chatModule.chatList;
        for (let i in list) {
          if (list[i].index_name == index_name) {
            return i;
          }
        }
        return -1;
      },

      sendTime(time) {
        return formateTime(time);
      },

      //处理时间是否显示
      compareTime(idx, length, datetime) {
        datetime = datetime.replace(/-/g, "/");
        let time = Math.floor(Date.parse(datetime) / 1000);
        let currTime = Math.floor(new Date().getTime() / 1000);
        return !((currTime - time) < 300);
      },

      launchGroupChatSuccess() {
        this.isLaunchGroupChat = false;
        this.loadChatLists();
      }
    }
  };
</script>

<style scoped>
  #chat-dialogue-page {
    width: 100%;
    height: 100%;
  }

  .lumen-chat-sidebar {
    height: calc(100% - 60px);
    height: -moz-calc(100% - 60px);
    height: -webkit-calc(100% - 60px);
    background: #e4e4e5;
    overflow-x: hidden;
    overflow-y: auto;
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
    color: white;
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
