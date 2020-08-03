<template>
  <div>
    <main-layout :idx="3">
      <el-container slot="container" class="hv100">
        <!-- 左侧侧边栏 -->
        <el-aside width="300px" class="aside-box padding0">
          <el-container class="hv100" direction="vertical">

            <!-- 搜索栏 -->
            <el-header height="60px" class="padding0 header">
              <div class="from">
                <el-autocomplete v-model="input" :fetch-suggestions="querySearch" placeholder="搜索聊天列表(开发中)"
                  prefix-icon="el-icon-search" size="small" clearable>
                  <template slot-scope="{ item }">
                    <div class="search-item">
                      <div class="avatar">
                        <span v-show="!item.avatar">
                          {{(item.remark_name?item.remark_name:item.name).substr(0,1)}}
                        </span>
                        <img v-show="item.avatar" :src="item.avatar" :onerror="$store.state.user.detaultAvatar" />
                      </div>
                      <div class="card">
                        <div class="title">{{item.name}}</div>
                        <div class="content">备注：{{item.remark_name}}</div>
                      </div>
                    </div>
                  </template>
                </el-autocomplete>
              </div>

              <!-- 工具栏 -->
              <div class="tools">
                <el-button icon="el-icon-plus" circle plain size="small" v-show="subMenu"></el-button>
                <el-button icon="el-icon-plus" circle plain size="small" v-show="!subMenu" @click="subMenu = true">
                </el-button>
                <transition name="el-zoom-in-top">
                  <div class="tools-menu" v-show="subMenu" v-outside="closeSubMenu">
                    <div class="menu-item" @click="triggerSubMenu(1)">创建群聊</div>
                    <div class="menu-item" @click="triggerSubMenu(2)">添加好友</div>
                  </div>
                </transition>
              </div>
            </el-header>

            <!-- 置顶栏 -->
            <el-header id="subheader" v-show="topNum > 0" :height="subHeaderPx" class="padding0 subheader">
              <div class="top-item" v-for="(item,idx) in $store.state.talks.items" v-if="item.is_top"
                @click="clickTab(2, item.index_name)">
                <el-tooltip effect="dark" :content="(item.remark_name?item.remark_name:item.name)"
                  placement="top-start">
                  <div class="avatar">
                    <span v-show="!item.avatar">
                      {{(item.remark_name?item.remark_name:item.name).substr(0,1)}}
                    </span>
                    <img v-show="item.avatar" :src="item.avatar" :onerror="$store.state.user.detaultAvatar" />
                  </div>
                </el-tooltip>

                <div class="name" :class="{'name-active':index_name == item.index_name}">
                  {{item.remark_name?item.remark_name:item.name}}</div>
              </div>
            </el-header>

            <!-- 对话列表栏 -->
            <el-scrollbar :native="false" class="hv100" tag="section" ref="myScrollbar">
              <el-main class="padding0 main">
                <p class="talk-item-empty" v-if="$store.state.talks.items.length == 0">
                  暂无聊天消息
                </p>
                <p class="main-menu" v-else>
                  <span class="title">消息记录 ({{$store.state.talks.items.length}})</span>
                </p>

                <!-- 对话列表 -->
                <div class="talk-item" v-for="(item,idx) in $store.state.talks.items" :key="idx"
                  :class="{'talk-item-border':index_name == item.index_name}" @click="clickTab(2, item.index_name)"
                  @contextmenu.prevent="chatItemsMenu(item,$event)">
                  <div class="avatar">
                    <span v-show="!item.avatar">
                      {{(item.remark_name?item.remark_name:item.name).substr(0,1)}}
                    </span>

                    <img v-show="item.avatar" :src="item.avatar" :onerror="$store.state.user.detaultAvatar" />

                    <div class="unread" v-show="item.unread_num" v-text="item.unread_num"></div>
                  </div>
                  <div class="card">
                    <div class="title">
                      <div class="card-name">
                        <p class="nickname">{{item.remark_name?item.remark_name:item.name}}</p>
                        <div class="larkc-tag top" v-show="item.is_top">TOP</div>
                        <div class="larkc-tag group" v-show="item.group_id">群组</div>
                        <div class="larkc-tag disturb" v-show="item.not_disturb">
                          <i class="iconfont icon-xiaoximiandarao"></i>
                        </div>
                      </div>
                      <div class="card-time">{{beautifyTime(item.updated_at)}}</div>
                    </div>
                    <div class="content" v-html="formatHandleText(item)"></div>
                  </div>
                </div>
              </el-main>
            </el-scrollbar>
          </el-container>
        </el-aside>

        <!-- 聊天面板容器 -->
        <el-main class="padding0 hv100 ov-hidden">
          <template v-if="index_name == null">
            <div class="reserve-box">
              <img src="/static/image/chat.png" width="300">
            </div>
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
    <user-business-card ref="userBusinessCard" @send-friend-msg="sendFriendMsg" />

    <!-- 用户查询 -->
    <search-users ref="searchUsers" @send-friend-msg="sendFriendMsg" />
  </div>
</template>

<script>
  import Vue from "vue";
  import MainLayout from "@/views/layout/MainLayout";
  import LaunchGroupChat from "@/components/chat/LaunchGroupChat";
  import TalkEditorPanel from "@/components/chat/TalkEditorPanel";
  import UserBusinessCard from "@/components/user/UserBusinessCard";
  import SearchUsers from "@/components/user/SearchUsers";
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
    beautifyTime,
    addClass,
    removeClass
  } from '@/utils/functions';

  export default {
    name: 'schedule-page',
    components: {
      MainLayout,
      LaunchGroupChat,
      TalkEditorPanel,
      UserBusinessCard,
      SearchUsers
    },
    data() {
      return {
        launchGroupShow: false,

        // 当前聊天的对话索引名称
        index_name: null,

        // 对话面板的传递参数 
        params: {
          source: 0,
          receiveId: 0,
          nickname: '',
        },

        //用户对话列表加载状态
        dataStatus: 0,

        // 查询关键词
        input: '',

        // 搜索列表
        restaurants: [{
            "value": "测试数据（功能尚未完善）",
            "address": "长宁区新渔路144号"
          },
          {
            "value": "Hot honey 首尔炸鸡（仙霞路）",
            "address": "上海市长宁区淞虹路661号"
          },
          {
            "value": "南拳妈妈龙虾盖浇饭",
            "address": "普陀区金沙江路1699号鑫乐惠美食广场A13"
          }
        ],

        // header 工具菜单
        subMenu: false,
      };
    },
    computed: {
      // 计算置顶数量
      topNum() {
        return this.$store.state.talks.items.filter((item) => {
          return item.is_top == 1;
        }).length;
      },

      // 置顶栏目的高度
      subHeaderPx() {
        let num = this.topNum,
          len = 65,
          n = 6; // 一排能显示的用户数

        if (num > n) {
          let y = (num % n) > 0 ? 1 : 0;
          len = (Math.floor(num / n) + y) * len;
        }

        return `${len}px`;
      },

      reloadDialogues() {
        return this.$store.state.talks.heavyLoad;
      },
      unreadNum() {
        return this.$store.state.talks.items.reduce(function (total, item) {
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
        return this.$store.state.talks.items[i].online == 1;
      }
    },
    watch: {
      unreadNum(nval, oval) {
        this.$store.commit("setUnreadNum", nval);
      },

      // 监听用户在线状态
      monitorUserStatus(nval, oval) {
        let [status, friend_id] = nval.split("_");
        let key = this.getIndex(`1_${friend_id}`);
        if (key == -1) return;

        this.$store.commit({
          type: "UPDATE_TALK_ONLINE_STATUS",
          key,
          status
        });
      },

      // 监听入群通知消息
      enterGroup(nval, oval) {
        this.loadChatList();
      },

      // 监听是否刷新聊天菜单
      reloadDialogues(n, o) {
        if (n) {
          this.loadChatList();
          this.$store.commit("TRIGGER_TALK_ITEMS_LOAD", false);
        }
      }
    },
    mounted() {
      this.loadChatList();
      this.scrollEvent();
    },
    destroyed() {
      this.$root.updateMessage(0, 0);
    },
    methods: {
      // 美化时间格式
      beautifyTime,

      // 格式化好友消息
      formatHandleText(info) {
        let online = "[群消息]";
        if (info.type == 1) {
          online = info.online ? '<span style="color: #4CAF50;font-weight: 500;">[在线]</span>' : "[离线]";
        }

        return `${online} ${info.msg_text}`;
      },

      // 发送消息方法
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

      // header 功能栏隐藏事件
      closeSubMenu() {
        this.subMenu = false;
      },

      // 工具栏事件
      triggerSubMenu(type) {
        this.closeSubMenu();
        if (type == 1) {
          this.launchGroupShow = true;
        } else {
          this.$refs.searchUsers.open();
        }
      },

      // 监听自定义滚动条事件
      scrollEvent(e) {
        let _self = this;
        let scrollbarEl = this.$refs.myScrollbar.wrap
        scrollbarEl.onscroll = function () {
          let el = document.getElementById('subheader');
          if (scrollbarEl.scrollTop == 0) {
            removeClass(el, 'header-shadow');
          } else {
            addClass(el, 'header-shadow');
          }
        }
      },

      // 用户卡片回调事件
      sendFriendMsg(data) {
        let index = this.getIndex(data.index_name);
        if (index >= 0) {
          this.clickTab(1, data.index_name);
        } else {
          this.changeTalk(data.index_name);
        }
      },

      // 搜索框查询
      querySearch(queryString, cb) {
        let restaurants = this.$store.state.talks.items.map((item) => {
          item.value = item.name + ' ' + item.remark_name;
          return item;
        });

        let createFilter = (queryString) => {
          return (restaurant) => {
            return (restaurant.value.indexOf(queryString) === 0);
          };
        };

        let results = queryString ? restaurants.filter(createFilter(queryString)) : restaurants;

        cb(results);
      },

      // 获取用户对话列表
      loadChatList() {
        if (this.$store.state.talks.items.length == 0) {
          this.dataStatus = 0;
        }

        chatListsServ().then(res => {
          if (res.code == 200) {
            this.$store.commit({
              type: "SET_TALK_ITEM",
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

      // 发起群聊成功后回调方法
      groupChatSuccess(data) {
        this.launchGroupShow = false;
        sessionStorage.setItem("send_message_index_name", `2_${data.group_info.id}`);
        this.loadChatList();
      },

      // 根据用户对话索引获取对话数组对应的key
      getIndex(index_name) {
        return this.$store.state.talks.items.findIndex(
          item => item.index_name == index_name
        );
      },

      // 切换聊天栏目
      clickTab(type = 1, index_name) {
        let idx = this.getIndex(index_name);

        if (idx == -1) return;

        let item = this.$store.state.talks.items[idx];
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
            this.$store.commit("CLEAR_TLAK_UNREAD_NUM", idx);

            //清空消息未读数(后期改成websocket发送消息)
            clearChatUnreadNumServ({
              type: source,
              receive: receive_id
            });
          }
        });
      },

      // 修改当前对话
      changeTalk(index_name) {
        sessionStorage.setItem("send_message_index_name", index_name);
        this.loadChatList();
      },

      // 关闭当前对话及刷新对话列表
      closeTalk() {
        this.index_name = null;
        this.loadChatList();
      },

      // 对话列表的右键自定义菜单
      chatItemsMenu(data, event) {
        let item = data;
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
              label: "修改备注",
              icon: "el-icon-edit-outline",
              disabled: item.type == 2,

              onClick: () => {
                alert('修改好友备注，开发中...');
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
            },
          ],
          event: event,
          zIndex: 3
        };

        this.$contextmenu(items);
        return false;
      },

      // 会话列表置顶（重写）
      topChatItem(item) {
        topChatItemServ({
          list_id: item.id,
          type: item.is_top == 0 ? 1 : 2
        }).then(res => {
          if (res.code == 200) {
            this.$store.commit({
              type: "UPDATE_TALK_ITEM",
              key: this.getIndex(item.index_name),
              item: {
                is_top: item.is_top == 0 ? 1 : 0
              }
            });
          }
        });
      },

      // 设置消息免打扰
      setNotDisturb(item) {
        setNotDisturbServ({
          type: item.type,
          receive_id: item.type == 1 ? item.friend_id : item.group_id,
          not_disturb: item.not_disturb == 0 ? 1 : 0
        }).then(res => {
          if (res.code == 200) {
            this.$store.commit({
              type: "UPDATE_TALK_ITEM",
              key: this.getIndex(item.index_name),
              item: {
                not_disturb: item.not_disturb == 0 ? 1 : 0
              }
            });
          }
        });
      },

      // 移除会话列表
      delChatItem(item) {
        delChatItemServ({
          list_id: item.id
        }).then(res => {
          if (res.code == 200) {
            this.$store.commit("REMOVE_TALK_ITEM", item.index_name);
          }
        });
      },

      // 解除好友关系
      removeFriend(item) {
        removeFriendServ({
          friend_id: item.friend_id
        }).then(res => {
          if (res.code == 200) {
            if (this.index_name == item.index_name) {
              this.index_name = null;
            }

            this.$store.commit('REMOVE_TALK_ITEM', item.index_name);
          }
        });
      },

      // 退出群聊
      removeGroup(item) {
        secedeGroupServ({
          group_id: item.group_id
        }).then(res => {
          if (res.code == 200) {
            if (this.index_name == item.index_name) {
              this.index_name = null;
            }

            this.$store.commit('REMOVE_TALK_ITEM', item.index_name);
          }
        });
      }
    }
  };

</script>
<style>
  .el-autocomplete-suggestion__wrap li {
    padding: 0 10px !important;
  }

</style>
<style scoped>
  .aside-box {
    position: relative;
    background-color: white;
    border-right: 1px solid rgb(245, 245, 245);
    overflow: hidden;
  }

  /* header start */
  .aside-box .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 15px;
  }

  .aside-box .header .from {
    flex: 1 1;
    flex-shrink: 0;
    height: 40px;
  }

  .aside-box .header .from>>>.el-autocomplete {
    width: 225px;
  }

  .aside-box .header .from>>>.el-autocomplete .el-input__inner {
    border-radius: 20px;
  }

  .aside-box .header .tools {
    flex-basis: 32px;
    flex-shrink: 0;
    height: 32px;
    margin-bottom: 8px;
    cursor: pointer;
    line-height: 32px;
    text-align: center;
    position: relative;
    user-select: none;
  }

  .aside-box .header .tools .tools-menu {
    position: absolute;
    right: 0;
    top: 38px;
    width: 100px;
    min-height: 80px;
    box-sizing: border-box;
    background-color: rgba(31, 35, 41, .9);
    border-radius: 5px;
    z-index: 1;
    padding: 3px 0;
  }

  .aside-box .header .tools .tools-menu .menu-item {
    height: 40px;
    line-height: 40px;
    color: white;
    font-size: 14px;
  }

  .aside-box .header .tools .tools-menu .menu-item:hover {
    background-color: rgba(70, 72, 73, 0.9);
  }

  /* header end */


  /* subheader start */

  .aside-box .header-shadow {
    box-shadow: 0 2px 6px 0 rgba(31, 35, 41, .05);
  }

  .aside-box .subheader {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 3px 8px 10px;
    overflow: hidden;
    flex-shrink: 0;
  }

  .aside-box .subheader .top-item {
    flex-basis: 41px;
    flex-shrink: 0;
    height: 50px;
    margin: 0 1px 6px 1px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  .aside-box .subheader .top-item .avatar {
    flex-basis: 32px;
    width: 32px;
    height: 32px;
    background-color: #508afe;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 10px;
    color: white;
    flex-shrink: 0;
    overflow: hidden;
    user-select: none;
  }

  .aside-box .subheader .top-item .avatar img {
    width: 100%;
    height: 100%;
    background-color: white;
  }

  .aside-box .subheader .top-item .name {
    font-size: 12px;
    text-align: center;
    color: #8f959e;
    transform: scale(.84);
    text-align: center;
    line-height: 20px;
    word-break: break-all;
    overflow: hidden;
  }

  .aside-box .subheader .top-item .name-active {
    color: #508afe;
    font-weight: 600;
  }

  /* subheader end */


  /* aside main start */
  .aside-box .main {
    overflow: hidden;
  }

  .aside-box>>>.el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .aside-box .main .main-menu {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 3px 10px 3px 10px;
    align-items: center;
    user-select: none;
  }

  .aside-box .main .main-menu .title {
    font-size: 12px;
    font-weight: 600;
    color: #1f2329;
  }

  .aside-box .main .main-menu .icon {
    cursor: pointer;
  }


  .aside-box .talk-item-empty {
    text-align: center;
    padding-top: 40px;
    color: #ccc;
  }

  .aside-box .talk-item {
    padding: 8px 10px;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    border-left: 3px solid white;
    transition: .2s ease-in;
  }

  .aside-box .talk-item-border {
    border-color: #3370ff;
    background-color: #eff0f1;
  }

  .aside-box .talk-item:hover {
    background-color: #eff0f1;
  }

  .aside-box .talk-item .avatar {
    height: 35px;
    width: 35px;
    flex-basis: 35px;
    flex-shrink: 0;
    background-color: #508afe;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: white;
    user-select: none;
    transition: ease 1s;
    position: relative;
    overflow: hidden;
  }

  .aside-box .talk-item .avatar img {
    width: 100%;
    height: 100%;
    background-color: white;
    border-radius: 3px;
  }

  .aside-box .talk-item .avatar .unread {
    position: absolute;
    top: -5px;
    right: -5px;
    min-width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: red;
    font-size: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: scale(.8);
  }

  .aside-box .talk-item .card {
    height: 40px;
    display: flex;
    align-content: center;
    flex-direction: column;
    flex: 1 1;
    margin-left: 10px;
    overflow: hidden;
  }

  .aside-box .talk-item .card .title {
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
  }

  .aside-box .talk-item .card .title .card-name {
    color: #1f2329;
    font-size: 14px;
    line-height: 20px;
    flex: 1 1;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .aside-box .talk-item .card .title .card-name .nickname {
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 3px;
  }

  .aside-box .talk-item .card .title .card-name .larkc-tag {
    font-size: 12px;
    font-weight: 400;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
    height: 20px;
    border-radius: 2px;
    cursor: default;
    user-select: none;
    background-color: #dee0e3;
    transform: scale(.8);
    transform-origin: left;
    flex-shrink: 0;
  }

  .top {
    color: #dc9b04 !important;
    background-color: #faf1d1 !important;
  }

  .group {
    color: #3370ff !important;
    background-color: #e1eaff !important;
    font-size: 13px;
  }

  .disturb {
    color: #98999c !important;
    background-color: #ecedf1 !important;
    font-size: 12px;
  }

  .disturb i {
    font-size: 12px;
  }

  .aside-box .talk-item .card .title .card-time {
    color: #8f959e;
    font-size: 12px;
    margin-left: 10px;
    user-select: none;
  }

  .aside-box .talk-item .card .content {
    font-size: 10px;
    line-height: 18px;
    color: #8f959e;
    overflow: hidden;
    margin-top: 3px;
    font-weight: 300;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* aside main end */

  .reserve-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    font-size: 24px;
    color: #d8dae2;
    background-color: white;
  }

  /* search-item */
  .search-item {
    display: flex;
    height: 50px;
    /* background-color: red; */
    margin-top: 2px;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    /* border-bottom: 1px solid #ece5e5; */
  }

  .search-item .avatar {
    height: 35px;
    width: 35px;
    flex-basis: 35px;
    flex-shrink: 0;
    background-color: #508afe;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: white;
    user-select: none;
    transition: ease 1s;
    position: relative;
    overflow: hidden;
  }

  .search-item .avatar img {
    height: 100%;
    width: 100%;
    background-color: white;
  }

  .search-item .card {
    height: 40px;
    display: flex;
    align-content: center;
    flex-direction: column;
    flex: 1 1;
    margin-left: 10px;
    overflow: hidden;
  }

  .search-item .card .title {
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
  }

  .search-item .card .content {
    font-size: 10px;
    line-height: 18px;
    color: #8f959e;
    overflow: hidden;
    margin-top: 3px;
    font-weight: 300;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

</style>
