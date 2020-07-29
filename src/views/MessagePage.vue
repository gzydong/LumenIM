<template>
  <div>
    <main-layout :idx="0">
      <el-container slot="container" class="hv100">
        <el-aside width="250px">
          <el-container class="hv100">
            <el-header class="padding0">
              <lumen-search ref="lumenSearch" @search-change="searchChange" @click-open="launchGroupShow = true"
                placeholder="搜索聊天列表" />
            </el-header>
            <el-main class="padding0 lumen-scrollbar" style="background: #e4e4e5;">
              <p class="sidebar-load-status" v-show="dataStatus == 0">
                <i class="iconfont icon-jiazaizhong lumen-icon-spin"></i>
                正在加载聊天列表...
              </p>

              <p class="sidebar-load-status" v-show="dataStatus == 2" @click="loadChatList">加载失败，点击我再次尝试...</p>

              <div v-if="dataStatus == 1 && $store.state.talkItems.items.length == 0" class="empty-chat-list">暂时没有新的消息
              </div>

              <div v-show="dataStatus == 1 && $store.state.talkItems.items.length > 0">
                <lumen-chat-list class="avatar-odd-bag" @lumen-click="clickTab(2, item.index_name)"
                  v-for="(item,idx) in $store.state.talkItems.items" :key="idx" :idx="idx" :img="item.avatar"
                  :name="item.name" :content="handleTip(item)" :time="beautifyTime(item.updated_at)"
                  :nickname="item.remark_name" :unread-num="item.unread_num" :active="index_name == item.index_name"
                  :params="item" :disturb="item.not_disturb" :is-top="item.is_top == 1"
                  @on-contextmenu="chatItemsMenu" />
              </div>
            </el-main>
          </el-container>
        </el-aside>

        <el-main class="padding0 hv100" style="overflow: hidden;">
          <template v-if="index_name == null">
            <main-amicable />
          </template>
          <template v-else>
            <talk-editor-panel class="hv100" :params="params" :is-online="isFriendOnline" @change-talk="changeTalk"
              @close-talk="closeTalk" />
          </template>
        </el-main>

      </el-container>
    </main-layout>

    <!-- 创建群聊组件 -->
    <launch-group-chat v-if="launchGroupShow" @close="launchGroupShow = false" @create-success="groupChatSuccess" />

    <!-- 查看好友用户信息 -->
    <user-business-card ref="userBusinessCard" />
  </div>
</template>

<script>
  import Vue from "vue";
  import MainLayout from "@/views/layout/MainLayout";
  import MainAmicable from "@/views/layout/MainAmicable";
  import LumenSearch from "@/components/layout/LumenSearch";
  import LumenChatList from "@/components/layout/LumenChatList";
  import SearchChatRecord from "@/components/chat/SearchChatRecord";
  import LaunchGroupChat from "@/components/chat/LaunchGroupChat";
  import TalkEditorPanel from "@/components/chat/TalkEditorPanel";
  import UserBusinessCard from "@/components/user/UserBusinessCard";
  import Contextmenu from "vue-contextmenujs";
  Vue.use(Contextmenu);

  import {
    chatListsServ,
    clearChatUnreadNumServ,
    delChatItemServ,
    topChatItemServ,
    setNotDisturbServ
  } from "@/api/chat";

  import {
    removeFriendServ
  } from "@/api/user";

  import {
    secedeGroupServ
  } from "@/api/group";

  import {
    packTalkItem,
    beautifyTime
  } from '@/utils/functions';

  export default {
    name: "message-page",
    components: {
      MainLayout,
      LumenSearch,
      LumenChatList,
      MainAmicable,
      LaunchGroupChat,
      SearchChatRecord,
      TalkEditorPanel,
      UserBusinessCard
    },
    data() {
      return {
        groupBoxShow: false,
        launchGroupShow: false,

        index_name: null,
        params: {
          source: 0,
          receiveId: 0,
          nickname: '',
        },

        //用户对话列表加载状态
        dataStatus: 0,
      };
    },
    computed: {
      reloadDialogues() {
        return this.$store.state.talkItems.heavyLoad;
      },
      unreadNum() {
        return this.$store.state.talkItems.items.reduce(function (total, item) {
          return total + parseInt(item.unread_num);
        }, 0);
      },
      monitorUserStatus() {
        return this.$store.state.notify.friendStatus;
      },
      enterGroup() {
        return this.$store.state.notify.enterGroup;
      },
      isFriendOnline() {
        let i = this.getIndex(this.index_name);
        if (i == -1) return 0;
        return this.$store.state.talkItems.items[i].online == 1;
      }
    },
    watch: {
      unreadNum(nval, oval) {
        this.$store.commit("setUnreadNum", nval);
      },

      //监听用户在线状态
      monitorUserStatus(nval, oval) {
        let [status, friend_id] = nval.split("_");
        let key = this.getIndex(`1_${friend_id}`);
        if (key == -1) return;

        this.$store.commit({
          type: "updateOnlineStatus",
          key,
          status
        });
      },

      //监听入群通知消息
      enterGroup(nval, oval) {
        this.loadChatList();
      },

      //监听是否刷新聊天菜单
      reloadDialogues(n, o) {
        if (n) {
          this.loadChatList();
          this.$store.commit("setHeavyLoad", false);
        }
      }
    },
    mounted() {
      this.loadChatList();
    },
    destroyed() {
      this.$root.updateMessage(0, 0);
    },
    methods: {
      //美化时间格式
      beautifyTime: beautifyTime,

      //发送消息方法
      sendSocket(message) {
        if (this.$store.getters.socketStatus) {
          this.$notify({
            title: '友情提示:',
            message: "网络服务器已断开，正在尝试连接..."
          });

          return false;
        }

        this.$root.socket.send(message);
      },

      //格式化好友消息
      handleTip(info) {
        let online = "[群消息]";
        if (info.type == 1) {
          online = info.online ?
            '<span style="color:#058205a3">[在线]</span>' :
            "[离线]";
          return `${online} ${info.msg_text}`;
        }

        return `${online} ${info.msg_text}`;
      },

      //搜索框修改触发事件
      searchChange(keyWords) {
        this.$notify({
          title: '友情提示:',
          message: "功能正在研发中请耐心等待..."
        });
      },

      //获取用户对话列表
      loadChatList() {
        if (this.$store.state.talkItems.items.length == 0) {
          this.dataStatus = 0;
        }

        chatListsServ().then(res => {
          if (res.code == 200) {
            this.$store.commit({
              type: "setItems",
              items: res.data.map(item => packTalkItem(item))
            });

            this.dataStatus = 1;

            let index_name = sessionStorage.getItem("send_message_index_name");
            if (index_name) {
              this.$nextTick(function () {
                this.clickTab(2, index_name);
              });

              sessionStorage.removeItem("send_message_index_name");
            }
          } else {
            this.dataStatus = 2;
          }
        }).catch(err => {
          this.dataStatus = 2;
        });
      },

      //发起群聊成功后回调方法
      groupChatSuccess(data) {
        this.launchGroupShow = false;
        sessionStorage.setItem("send_message_index_name", `2_${data.group_info.id}`);
        this.loadChatList();
      },

      //根据用户对话索引获取对话数组对应的key
      getIndex(index_name) {
        return this.$store.state.talkItems.items.findIndex(
          item => item.index_name == index_name
        );
      },

      //切换聊天栏目
      clickTab(type = 1, index_name) {
        let idx = this.getIndex(index_name);

        if (idx == -1) return;

        let item = this.$store.state.talkItems.items[idx];
        let [source, receive_id] = index_name.split("_");
        this.index_name = item.index_name;
        this.params = {
          source: source,
          receiveId: receive_id,
          nickname: source == 2 ? item.name : (item.remark_name ? item.remark_name : item.name)
        }

        this.$root.updateMessage(source, receive_id, item.avatar);
        this.$nextTick(function () {
          if (index_name == this.$root.message.index_name) {
            //清空对话的未读数
            this.$store.commit("clearUnreadNum", idx);

            //清空消息未读数(后期改成websocket发送消息)
            clearChatUnreadNumServ({
              type: source,
              receive: receive_id
            });
          }
        });
      },

      //修改当前对话
      changeTalk(index_name) {
        sessionStorage.setItem("send_message_index_name", index_name);
        this.loadChatList();
      },
      //关闭当前对话
      closeTalk() {
        this.index_name = null;
        this.loadChatList();
      },


      //右键菜单
      chatItemsMenu(data) {
        let item = data.item;
        let items = {
          items: [{
              label: "好友信息",
              icon: "el-icon-user",
              disabled: item.type == 2,
              onClick: () => {
                this.$refs.userBusinessCard.open(item.friend_id);
              }
            },
            {
              label: item.is_top == 0 ? "会话置顶" : "取消置顶",
              icon: "el-icon-top",
              onClick: () => {
                this.topChatItem(item);
              }
            },
            {
              label: item.not_disturb == 0 ? "消息免打扰" : "开启消息提示",
              icon: item.not_disturb == 0 ?
                "el-icon-close-notification" : "el-icon-bell",
              onClick: () => {
                this.setNotDisturb(item);
              }
            },
            {
              label: "移除会话",
              icon: "el-icon-remove-outline",
              divided: true,
              onClick: () => {
                this.delChatItem(item);
              }
            },
            {
              label: item.type == 1 ? "删除好友" : '退出群聊',
              icon: "el-icon-delete",
              onClick: () => {
                let title = item.type == 1 ? "删除好友" : '退出群聊';
                this.$confirm(`此操作将 <span style="color:red;font-size:16px;">${title}</span>, 是否继续?`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  center: true,
                  dangerouslyUseHTMLString: true
                }).then(() => {
                  if (item.type == 1) {
                    this.removeFriend(item);
                  } else {
                    this.removeGroup(item);
                  }
                });
              }
            }
          ],
          event: data.event,
          zIndex: 3
        };

        this.$contextmenu(items);
        return false;
      },

      //会话列表置顶
      topChatItem(item) {
        topChatItemServ({
          list_id: item.id,
          type: item.is_top == 0 ? 1 : 2
        }).then(res => {
          if (res.code == 200) {
            this.loadChatList();
          }
        });
      },

      //设置消息免打扰
      setNotDisturb(item) {
        setNotDisturbServ({
          type: item.type,
          receive_id: item.type == 1 ? item.friend_id : item.group_id,
          not_disturb: item.not_disturb == 0 ? 1 : 0
        }).then(res => {
          if (res.code == 200) {
            this.$store.commit({
              type: "updateItem",
              key: this.getIndex(item.index_name),
              item: {
                not_disturb: item.not_disturb == 0 ? 1 : 0
              }
            });
          }
        });
      },
      //移除会话列表
      delChatItem(item) {
        delChatItemServ({
          list_id: item.id
        }).then(res => {
          if (res.code == 200) {
            this.$store.commit("removeItem", item.index_name);
          }
        });
      },
      //解除好友关系
      removeFriend(item) {
        removeFriendServ({
          friend_id: item.friend_id
        }).then(res => {
          if (res.code == 200) {
            if (this.index_name == item.index_name) {
              this.index_name = null;
            }
            this.loadChatList();
          } else {
            alert('解除好友失败...');
          }
        });
      },
      //退出群聊
      removeGroup(item) {
        secedeGroupServ({
          group_id: item.group_id
        }).then(res => {
          if (res.code == 200) {
            if (this.index_name == item.index_name) {
              this.index_name = null;
            }

            this.loadChatList();
          } else {
            alert('退出群聊失败...');
          }
        });
      }
    }
  };

</script>

<style scoped="scoped">
  .hv100 {
    height: 100%;
  }

  .sidebar-load-status {
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
    text-indent: 10px;
  }

  .empty-chat-list {
    text-align: center;
    font-size: 14px;
    margin-top: 30px;
    padding: 0 20px 0 20px;
    color: #b3aaaa;
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
    left: 30px;
    font-size: 14px;
  }

  .lumen-chat-title-username {
    position: absolute;
    display: inline-block;
    font-size: 14px;
    left: 2px;
    height: 20px;
    top: 20px;
  }

  .lumen-chat-title-username .title-icon {
    font-size: 10px;
    color: white;
    padding: 3px;
    border-radius: 0px;
    text-align: center;
    display: inline;
    position: relative;
    top: -1px;
  }

  .lumen-chat-title .lumen-chat-title-tip {
    height: 100%;
    width: 100px;
    margin: 0 auto;
  }

  .lumen-chat-title .lumen-chat-title-tip p:first-child {
    height: 38px;
    line-height: 55px;
    text-align: center;
    color: #058205a3;
  }

  .lumen-chat-title-tip .content-input-tip {
    color: #c3a9a9;
    font-size: 10px;
    animation: inputfade 600ms infinite;
    -webkit-animation: inputfade 600ms infinite;
    text-align: center;
  }

  .lumen-chat-header .lumen-chat-icon-toolbar {
    position: absolute;
    top: 0;
    right: 0;
    width: 110px;
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
    color: #cccccc !important;
  }

  .lumen-chat-footer {
    height: 160px;
    background-color: white;
  }

  .lumen-side-edge-box {
    position: absolute;
    width: 350px;
    height: 100%;
    top: 0px;
    right: 0;
    z-index: 2;
    animation: showBox 0.5s ease-in-out;
    -webkit-animation: showBox 0.5s ease-in-out;
    -moz-animation: showBox 0.5s ease-in-out;
    -webkit-box-direction: normal;
    background: white;
    box-shadow: 0 0 14px #cccccc70;
  }

  @keyframes showBox {
    0% {
      transform: translateX(600px);
    }

    to {
      transform: translateX(0);
    }
  }

  @-webkit-keyframes showBox {
    0% {
      -webkit-transform: translateX(600px);
    }

    to {
      -webkit-transform: translateX(0);
    }
  }

  @keyframes inputfade {
    from {
      opacity: 1;
    }

    50% {
      opacity: 0.4;
    }

    to {
      opacity: 1;
    }
  }

  @-webkit-keyframes inputfade {
    from {
      opacity: 1;
    }

    50% {
      opacity: 0.4;
    }

    to {
      opacity: 1;
    }
  }

  .el-image-viewer__wrapper>>>.el-icon-circle-close {
    color: white !important;
  }

  .el-image-viewer__wrapper>>>.el-image-viewer__actions__inner i {
    cursor: pointer;
  }

  .avatar-odd-bag:nth-child(odd)>>>.avatar-text {
    background: #eb6841;
  }

</style>
