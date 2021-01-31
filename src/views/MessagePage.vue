<template>
  <div>
    <main-layout :idx="0">
      <el-container slot="container" class="full-height">
        <!-- 左侧侧边栏 -->
        <el-aside width="320px" class="aside-box">
          <el-container class="full-height" direction="vertical">
            <!-- 搜索栏 -->
            <el-header height="60px" class="header">
              <div class="from">
                <el-input
                  v-model="input"
                  prefix-icon="el-icon-search"
                  placeholder="搜索聊天 / 好友 / 群组"
                  size="small"
                />
              </div>

              <!-- 工具栏 -->
              <div class="tools">
                <el-button
                  icon="el-icon-plus"
                  circle
                  plain
                  size="small"
                  v-show="subMenu"
                />
                <el-button
                  icon="el-icon-plus"
                  circle
                  plain
                  size="small"
                  v-show="!subMenu"
                  @click="subMenu = true"
                />
                <transition name="el-zoom-in-top">
                  <div
                    class="tools-menu"
                    v-show="subMenu"
                    v-outside="closeSubMenu"
                  >
                    <div class="menu-item" @click="triggerSubMenu(1)">
                      创建群组
                    </div>
                    <div class="menu-item" @click="triggerSubMenu(2)">
                      添加好友
                    </div>
                  </div>
                </transition>
              </div>
            </el-header>

            <!-- 置顶栏 -->
            <el-header
              v-show="loadStatus == 1 && topItems.length > 0"
              :height="subHeaderPx"
              class="subheader"
              :class="{ shadow: subHeaderShadow }"
            >
              <div
                class="top-item"
                v-for="(item, idx) in topItems"
                @click="clickTab(2, item.index_name)"
                :key="item.index_name"
                @contextmenu.prevent="topItemsMenu(item, $event)"
              >
                <el-tooltip
                  effect="dark"
                  :content="item.remark_name ? item.remark_name : item.name"
                  placement="top-start"
                >
                  <div class="avatar">
                    <span v-show="!item.avatar">
                      {{
                        (item.remark_name
                          ? item.remark_name
                          : item.name
                        ).substr(0, 1)
                      }}
                    </span>
                    <img
                      v-show="item.avatar"
                      :src="item.avatar"
                      :onerror="$store.state.detaultAvatar"
                    />
                  </div>
                </el-tooltip>

                <div
                  class="name"
                  :class="{ active: index_name == item.index_name }"
                >
                  {{ item.remark_name ? item.remark_name : item.name }}
                </div>
              </div>
            </el-header>

            <!-- 对话列表栏 -->
            <el-scrollbar
              :native="false"
              tag="section"
              ref="myScrollbar"
              class="full-height"
            >
              <el-main class="main">
                <p class="empty-data" v-if="loadStatus == 0" key="empty">
                  <i class="el-icon-loading"></i> 正在加载数据中...
                </p>

                <p
                  class="empty-data"
                  v-if="loadStatus == 1 && talkNum == 0"
                  key="empty"
                >
                  暂无聊天消息
                </p>

                <p
                  class="main-menu"
                  v-show="loadStatus == 1 && talkNum > 0"
                  key="no-empty"
                >
                  <span class="title">消息记录 ({{ talkNum }})</span>
                </p>

                <!-- 对话列表 -->
                <div
                  class="talk-item pointer"
                  v-show="loadStatus == 1"
                  v-for="(item, idx) in talkItems"
                  :class="{ 'active-border': index_name == item.index_name }"
                  @click="clickTab(2, item.index_name)"
                  @contextmenu.prevent="talkItemsMenu(item, $event)"
                  :key="item.index_name"
                >
                  <div class="avatar">
                    <span v-show="!item.avatar">
                      {{
                        (item.remark_name
                          ? item.remark_name
                          : item.name
                        ).substr(0, 1)
                      }}
                    </span>
                    <img
                      v-show="item.avatar"
                      :src="item.avatar"
                      :onerror="$store.state.detaultAvatar"
                    />
                    <div
                      class="top-mask"
                      v-show="item.is_top == 0"
                      @click.stop="topChatItem(item)"
                    >
                      <i class="el-icon-top"></i>
                    </div>
                  </div>
                  <div class="card">
                    <div class="title">
                      <div class="card-name">
                        <p class="nickname">
                          {{ item.remark_name ? item.remark_name : item.name }}
                        </p>
                        <div class="larkc-tag" v-show="item.unread_num">
                          {{ item.unread_num }}条未读
                        </div>
                        <div class="larkc-tag top" v-show="item.is_top">
                          TOP
                        </div>
                        <div class="larkc-tag group" v-show="item.group_id">
                          群组
                        </div>
                        <div
                          class="larkc-tag disturb"
                          v-show="item.not_disturb"
                        >
                          <i class="iconfont icon-xiaoximiandarao"></i>
                        </div>
                      </div>
                      <div class="card-time">
                        {{ beautifyTime(item.updated_at) }}
                      </div>
                    </div>
                    <div class="content">
                      <span
                        v-if="item.type == 1"
                        :class="{ 'online-color': item.online }"
                        >[{{ item.online ? "在线" : "离线" }}]</span
                      >
                      <span v-else>[群消息]</span>
                      <span
                        v-text="item.msg_text"
                        style="margin-left: 5px"
                      ></span>
                    </div>
                  </div>
                </div>
              </el-main>
            </el-scrollbar>
          </el-container>
        </el-aside>

        <!-- 聊天面板容器 -->
        <el-main class="panel-box">
          <template v-if="index_name == null">
            <div class="friendly-tips animated flipInY">
              <img src="~@/assets/image/chat.png" width="300" />
              <p>
                不是井里没有水，而是你挖的不够深<br />
                不是成功来得慢，而是你努力的不够多<br />
                加油吧！ ......
              </p>
            </div>
          </template>
          <template v-else>
            <talk-editor-panel
              class="full-height"
              :params="params"
              :is-online="isFriendOnline"
              @change-talk="changeTalk"
              @close-talk="closeTalk"
            />
          </template>
        </el-main>
      </el-container>
    </main-layout>

    <!-- 创建群聊组件 -->
    <group-launch
      v-if="launchGroupShow"
      @close="launchGroupShow = false"
      @create-success="groupChatSuccess"
    />

    <!-- 查看好友用户信息 -->
    <user-business-card ref="userBusinessCard" />

    <!-- 用户查询 -->
    <user-search ref="searchUsers" />
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import MainLayout from "@/views/layout/MainLayout";
import GroupLaunch from "@/components/group/GroupLaunch";
import TalkEditorPanel from "@/components/chat/TalkEditorPanel";
import UserBusinessCard from "@/components/user/UserBusinessCard";
import UserSearch from "@/components/user/UserSearch";
import {
  ServeGetTalkList,
  ServeClearTalkUnreadNum,
  ServeDeleteTalkList,
  ServeTopTalkList,
  ServeSetNotDisturb,
} from "@/api/chat";
import { ServeDeleteContact,ServeEditContactRemark } from "@/api/contacts";
import { ServeSecedeGroup } from "@/api/group";
import { packTalkItem, beautifyTime } from "@/utils/functions";

const title = document.title;

export default {
  name: "MessagePage",
  components: {
    MainLayout,
    GroupLaunch,
    TalkEditorPanel,
    UserBusinessCard,
    UserSearch,
  },
  data() {
    return {
      subHeaderShadow: false,
      launchGroupShow: false,

      // 当前聊天的对话索引名称
      index_name: null,

      // 对话面板的传递参数
      params: {
        source: 0,
        receiveId: 0,
        nickname: "",
      },

      // 查询关键词
      input: "",

      // header 工具菜单
      subMenu: false,

      // 对话消息列表加载状态
      loadStatus: 0, // 0:加载中 1:加载完成  2:加载失败

      interval: null,
    };
  },
  computed: {
    ...mapGetters(["topItems", "talkItems", "unreadNum", "talkNum"]),
    ...mapState({
      talks: (state) => state.talks.items,
      monitorUserStatus: (state) => state.notify.friendStatus,
    }),

    // 计算置顶栏目的高度
    subHeaderPx() {
      let num = this.topItems.length,
        len = 60,
        n = 7; // 一排能显示的用户数

      if (num > n) {
        let y = num % n > 0 ? 1 : 0;
        len = (Math.floor(num / n) + y) * len;
      }

      return `${len}px`;
    },

    // 当前对话好友在线状态
    isFriendOnline() {
      let i = this.getIndex(this.index_name);
      return i >= 0 && this.talks[i].online == 1;
    },
  },
  watch: {
    unreadNum(nval, oval) {
      if (nval) {
        clearInterval(this.interval);
        this.interval = setInterval(() => {
          let newTitle = `【新消息】${title}`;
          document.title = document.title == title ? newTitle : title;
        }, 2000);
      } else {
        document.title = title;
        clearInterval(this.interval);
      }
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
        status,
      });
    },
  },
  created() {
    this.loadChatList();
  },
  mounted() {
    this.scrollEvent();
  },
  destroyed() {
    document.title = title;
    clearInterval(this.interval);
    this.clearTalk();
  },
  methods: {
    // 美化时间格式
    beautifyTime,

    // header 功能栏隐藏事件
    closeSubMenu() {
      this.subMenu = false;
    },

    // 清除当前对话
    clearTalk() {
      this.index_name = null;
      this.params = {
        source: 0,
        receiveId: 0,
        nickname: "",
      };

      this.$root.updateMessage(0, 0);
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
      let scrollbarEl = this.$refs.myScrollbar.wrap;
      scrollbarEl.onscroll = () => {
        this.subHeaderShadow = scrollbarEl.scrollTop > 0;
      };
    },

    // 获取用户对话列表
    loadChatList() {
      this.loadStatus = this.talkNum == 0 ? 0 : 1;

      ServeGetTalkList().then((res) => {
        if (res.code == 200) {
          this.$store.commit({
            type: "SET_TALK_ITEM",
            items: res.data.map((item) => packTalkItem(item)),
          });

          let index_name = sessionStorage.getItem("send_message_index_name");
          if (index_name) {
            this.$nextTick(function () {
              this.clickTab(2, index_name);
            });

            sessionStorage.removeItem("send_message_index_name");
          }
        }

        this.loadStatus = 1;
      });
    },

    // 发起群聊成功后回调方法
    groupChatSuccess(data) {
      this.launchGroupShow = false;
      sessionStorage.setItem("send_message_index_name", `2_${data.group_id}`);
      this.loadChatList();
    },

    // 根据用户对话索引获取对话数组对应的key
    getIndex(index_name) {
      return this.talks.findIndex((item) => item.index_name == index_name);
    },

    // 切换聊天栏目
    clickTab(type = 1, index_name) {
      let idx = this.getIndex(index_name);

      if (idx == -1) {
        return;
      }

      let item = this.talks[idx];
      let [source, receive_id] = index_name.split("_");
      this.index_name = item.index_name;
      this.params = {
        source: source,
        receiveId: receive_id,
        nickname:
          source == 2
            ? item.name
            : item.remark_name
            ? item.remark_name
            : item.name,
      };

      this.$root.updateMessage(source, receive_id, item.avatar);

      this.$nextTick(function () {
        if (index_name == this.$root.message.index_name) {
          //清空对话的未读数
          this.$store.commit("CLEAR_TLAK_UNREAD_NUM", idx);

          //清空消息未读数(后期改成websocket发送消息)
          ServeClearTalkUnreadNum({
            type: source,
            receive: receive_id,
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
    talkItemsMenu(data, event) {
      let item = data;
      let items = {
        items: [
          {
            label: "好友信息",
            icon: "el-icon-user",
            disabled: item.type == 2,
            onClick: () => {
              this.$refs.userBusinessCard.open(item.friend_id);
            },
          },
          {
            label: "修改备注",
            icon: "el-icon-edit-outline",
            disabled: item.type == 2,
            onClick: () => {
              this.editFriendRemarks(item);
            },
          },
          {
            label: item.is_top == 0 ? "会话置顶" : "取消置顶",
            icon: "el-icon-top",
            onClick: () => {
              this.topChatItem(item);
            },
          },
          {
            label: item.not_disturb == 0 ? "消息免打扰" : "开启消息提示",
            icon:
              item.not_disturb == 0
                ? "el-icon-close-notification"
                : "el-icon-bell",
            onClick: () => {
              this.setNotDisturb(item);
            },
          },
          {
            label: "移除会话",
            icon: "el-icon-remove-outline",
            divided: true,
            onClick: () => {
              this.delChatItem(item);
            },
          },
          {
            label: item.type == 1 ? "删除好友" : "退出群聊",
            icon: "el-icon-delete",
            onClick: () => {
              let title = item.type == 1 ? "删除好友" : "退出群聊";
              this.$confirm(
                `此操作将 <span style="color:red;font-size:16px;">${title}</span>, 是否继续?`,
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                  center: true,
                  dangerouslyUseHTMLString: true,
                }
              ).then(() => {
                if (item.type == 1) {
                  this.removeFriend(item);
                } else {
                  this.removeGroup(item);
                }
              });
            },
          },
        ],
        event: event,
        zIndex: 3,
      };

      this.$contextmenu(items);
      return false;
    },

    // 置顶栏右键菜单栏
    topItemsMenu(data, event) {
      let item = data;
      let items = {
        items: [
          {
            label: item.is_top == 0 ? "会话置顶" : "取消置顶",
            icon: "el-icon-top",
            onClick: () => {
              this.topChatItem(item);
            },
          },
        ],
        event: event,
        zIndex: 3,
      };

      this.$contextmenu(items);
      return false;
    },

    // 会话列表置顶（重写）
    topChatItem(item) {
      ServeTopTalkList({
        list_id: item.id,
        type: item.is_top == 0 ? 1 : 2,
      }).then((res) => {
        if (res.code == 200) {
          this.$store.commit({
            type: "UPDATE_TALK_ITEM",
            key: this.getIndex(item.index_name),
            item: {
              is_top: item.is_top == 0 ? 1 : 0,
            },
          });
        }
      });
    },

    // 设置消息免打扰
    setNotDisturb(item) {
      ServeSetNotDisturb({
        type: item.type,
        receive_id: item.type == 1 ? item.friend_id : item.group_id,
        not_disturb: item.not_disturb == 0 ? 1 : 0,
      }).then((res) => {
        if (res.code == 200) {
          this.$store.commit({
            type: "UPDATE_TALK_ITEM",
            key: this.getIndex(item.index_name),
            item: {
              not_disturb: item.not_disturb == 0 ? 1 : 0,
            },
          });
        }
      });
    },

    // 移除会话列表
    delChatItem(item) {
      ServeDeleteTalkList({
        list_id: item.id,
      }).then((res) => {
        if (res.code == 200) {
          this.clearTalk();
          this.$store.commit("REMOVE_TALK_ITEM", item.index_name);
        }
      });
    },

    // 解除好友关系
    removeFriend(item) {
      ServeDeleteContact({
        friend_id: item.friend_id,
      }).then((res) => {
        if (res.code == 200) {
          if (this.index_name == item.index_name) {
            this.index_name = null;
          }

          this.$store.commit("REMOVE_TALK_ITEM", item.index_name);
        }
      });
    },

    // 退出群聊
    removeGroup(item) {
      ServeSecedeGroup({
        group_id: item.group_id,
      }).then((res) => {
        if (res.code == 200) {
          if (this.index_name == item.index_name) {
            this.index_name = null;
          }

          this.$store.commit("REMOVE_TALK_ITEM", item.index_name);
        }
      });
    },

    // 修改好友备注信息
    editFriendRemarks(item) {
      let title = `您正在设置【${item.name}】好友的备注信息`;

      if (item.remark_name) {
        title += `，当前备注为【${item.remark_name}】`;
      }

      this.$prompt(title, "修改备注", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "border-radius0",
        inputPlaceholder: "请设置好友备注信息",
        inputValue: item.remark_name ? item.remark_name : item.name,
        inputValidator(val) {
          return val == null || val == "" ? "好友备注不能为空" : true;
        },
      })
        .then(({ value }) => {
          if (value == item.remark_name) {
            return false;
          }

          ServeEditContactRemark({
            friend_id: item.friend_id,
            remarks: value,
          }).then((res) => {
            if (res.code == 200) {
              this.$store.commit({
                type: "UPDATE_TALK_ITEM",
                key: this.getIndex(item.index_name),
                item: {
                  remark_name: value,
                },
              });

              this.$notify({
                title: "成功",
                message: "好友备注修改成功...",
                type: "success",
              });
            } else {
              this.$notify({
                title: "消息",
                message: "好友备注修改失败，请稍后再试...",
                type: "warning",
              });
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.el-scrollbar__wrap {
  overflow-x: hidden;
}

.aside-box {
  position: relative;
  border-right: 1px solid rgb(245, 245, 245);
  overflow: hidden;
  padding: 0;

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 15px;

    .from {
      flex: 1 1;
      flex-shrink: 0;
      height: 40px;

      /deep/ .el-input .el-input__inner {
        border-radius: 20px;
        width: 240px;
      }
    }

    .tools {
      flex-basis: 32px;
      flex-shrink: 0;
      height: 32px;
      margin-bottom: 8px;
      cursor: pointer;
      line-height: 32px;
      text-align: center;
      position: relative;
      user-select: none;

      .tools-menu {
        position: absolute;
        right: 0;
        top: 38px;
        width: 100px;
        min-height: 80px;
        box-sizing: border-box;
        background-color: rgba(31, 35, 41, 0.9);
        border-radius: 5px;
        z-index: 1;
        padding: 3px 0;

        .menu-item {
          height: 40px;
          line-height: 40px;
          color: white;
          font-size: 14px;

          &:hover {
            background-color: rgba(70, 72, 73, 0.9);
          }
        }
      }
    }
  }

  .subheader {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 3px 8px 10px;
    overflow: hidden;
    flex-shrink: 0;

    .top-item {
      flex-basis: 41px;
      flex-shrink: 0;
      height: 50px;
      margin: 0 1px 6px 1px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;

      .avatar {
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

        img {
          width: 100%;
          height: 100%;
          background-color: white;
        }
      }

      .name {
        font-size: 12px;
        text-align: center;
        color: #8f959e;
        transform: scale(0.84);
        text-align: center;
        line-height: 20px;
        word-break: break-all;
        overflow: hidden;

        &.active {
          color: #508afe;
        }
      }
    }

    &.shadow {
      box-shadow: 0 2px 6px 0 rgba(31, 35, 41, 0.05);
    }
  }
}

.aside-box .main {
  overflow: hidden;
  padding: 0;

  .empty-data {
    text-align: center;
    padding-top: 40px;
    color: #ccc;
  }

  .main-menu {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 3px 10px 3px 10px;
    align-items: center;
    user-select: none;

    .title {
      font-size: 12px;
      font-weight: 600;
      color: #1f2329;
    }

    .icon {
      cursor: pointer;
    }
  }

  .talk-item {
    padding: 8px 10px;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-left: 3px solid transparent;
    transition: 0.2s ease-in;

    .avatar {
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

      img {
        width: 100%;
        height: 100%;
        background-color: white;
        border-radius: 3px;
      }

      .top-mask {
        width: 100%;
        height: 100%;
        background-color: rgba(22, 25, 29, 0.6);
        position: absolute;
        top: 0;
        left: 0;
        color: white;
        display: none;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      }

      &:hover .top-mask {
        display: flex;
      }
    }

    .card {
      height: 40px;
      display: flex;
      align-content: center;
      flex-direction: column;
      flex: 1 1;
      margin-left: 10px;
      overflow: hidden;

      .title {
        width: 100%;
        height: 20px;
        display: flex;
        align-items: center;

        .card-name {
          color: #1f2329;
          font-size: 14px;
          line-height: 20px;
          flex: 1 1;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          align-items: center;
          overflow: hidden;

          .nickname {
            font-weight: 400;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: 3px;
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
        }
      }

      .card-time {
        color: #8f959e;
        font-size: 12px;
        margin-left: 10px;
        user-select: none;
      }

      .content {
        font-size: 10px;
        line-height: 18px;
        color: #8f959e;
        overflow: hidden;
        margin-top: 3px;
        font-weight: 300;
        white-space: nowrap;
        text-overflow: ellipsis;

        .online-color {
          color: #4aa71c;
          font-weight: 400;
        }
      }
    }

    &:hover {
      background-color: #eff0f1;
    }

    &.active-border {
      border-color: #3370ff;
      background-color: #eff0f1;
    }
  }
}

.panel-box {
  overflow: hidden;
  height: 100%;
  padding: 0;

  .friendly-tips {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    font-size: 24px;
    background-color: white;
    user-select: none;

    p {
      width: 100%;
      font-weight: 300;
      text-align: center;
      font-size: 15px;
      color: #b9b4b4;
      margin-top: -30px;
    }
  }
}
</style>
