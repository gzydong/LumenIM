<template>
  <div>
    <main-layout :idx="1">
      <el-container slot="container" class="hv100">
        <el-aside width="250px">
          <el-container class="hv100">
            <el-header class="no-padding" style="height: 100px;">
              <lumen-search @search-change="searchChange" placeholder="搜索好友/群组" @click-open="open" />
              <div class="tab-subfield">
                <div class="tab-item" :class="{'tab-item-active':active == 1}" @click="triggerActive(1)">
                  好友({{friends.length}})</div>
                <div class="tab-item" :class="{'tab-item-active':active == 2}" @click="triggerActive(2)">
                  群组({{group.items.length}})</div>
              </div>
            </el-header>
            <el-main class="no-padding lumen-scrollbar" style="background: #e4e4e5;">
              <div v-show="active == 1">
                <div class="friends-notify" @click="showFriendApply = true">
                  <div class="cus-tubiao">
                    <i class="iconfont icon-jurassic_add-users"></i>
                  </div>
                  <span>
                    <span>新的朋友</span>
                    <span v-show="$store.state.notify.applyNum">({{$store.state.notify.applyNum}})</span>
                  </span>
                </div>

                <lumen-chat-list class="avatar-odd-bag" @lumen-click="clickfriends" v-for="(item,idx) in friends"
                  :key="idx" :idx="idx" :img="item.avatar" :name="item.nickname" :content="setUserTip(item)"
                  :nickname="item.friend_remark" :active="false" :params="item" />
              </div>
              <div v-show="active == 2">
                <lumen-chat-list class="avatar-odd-bag" v-for="(item,idx) in group.items" :key="idx" :idx="idx"
                  :img="item.avatar" :name="item.group_name" :content="item.group_profile" :params="item"
                  :disturb="item.not_disturb" @lumen-click="clickGroupInfo" />
              </div>
            </el-main>
          </el-container>
        </el-aside>

        <el-main class="no-padding">
          <main-amicable v-show="group.catGroupId == 0" />

          <div class="lumen-chat-group-box" v-if="group.catGroupId > 0">
            <user-group @close="group.catGroupId = 0" :group-id="group.catGroupId" @send-group="sendMessage"
              @quit-group="quitGroupSuccess" @disturb-change="disturbChange" @send-friend-msg="sendFriendMsg" />
          </div>
        </el-main>
      </el-container>
    </main-layout>

    <!-- 查看好友用户信息 -->
    <user-business-card ref="userBusinessCard" @changeRemark="changeRemark" @send-friend-msg="sendFriendMsg" />

    <!-- 用户查询 -->
    <search-users ref="searchUsers" />

    <friend-apply-record v-if="showFriendApply" @close="showFriendApply = false" />

    <launch-group-chat v-if="launchGroupShow" @close="launchGroupShow = false" @create-success="groupChatSuccess" />

    <div class="insmode-mask" v-if="insmodeBox">
      <div class="insmode-box">
        <i class="el-icon-circle-close close" @click="insmodeBox = false;"></i>
        <div class="insmode-vessel">
          <div>添加好友</div>
          <el-button type="primary" icon="el-icon-s-custom" round @click="showFoundMode(1)">添加好友</el-button>
        </div>
        <div class="insmode-vessel">
          <div>创建群聊</div>
          <el-button type="success" icon="iconfont icon-qunzu" round @click="showFoundMode(2)"> 创建群聊</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    friendsServ,
    findFriendApplyServ,
    handleFriendApplyServ,
    findUserGroupsServ
  } from "@/api/user";

  import LumenSearch from "@/components/layout/LumenSearch";
  import LumenChatList from "@/components/layout/LumenChatList";
  import MainAmicable from "@/views/layout/MainAmicable";
  import MainLayout from "@/views/layout/MainLayout";
  import UserGroup from "@/components/chat/UserGroup";
  import FriendApplyRecord from "@/components/user/FriendApplyRecord";
  import LaunchGroupChat from "@/components/chat/LaunchGroupChat";
  import UserBusinessCard from "@/components/user/UserBusinessCard";
  import SearchUsers from "@/components/user/SearchUsers";
  export default {
    name: "friends-page",
    components: {
      LumenSearch,
      LumenChatList,
      MainAmicable,
      MainLayout,
      UserGroup,
      FriendApplyRecord,
      LaunchGroupChat,
      UserBusinessCard,
      SearchUsers
    },
    data() {
      return {
        active: 1,

        //好友列表
        friends: [],

        group: {
          items: [],
          catGroupId: 0
        },

        showFriendApply: false,

        insmodeBox: false,
        launchGroupShow: false
      };
    },
    computed: {
      monitorUserStatus() {
        return this.$store.state.notify.friendStatus;
      }
    },
    watch: {
      monitorUserStatus(nval, oval) {
        let [status, friend_id] = nval.split("_");
        this.syncFriendStatus(friend_id, status);
      }
    },
    created() {
      this.loadFriends();
      this.loadUserGroups();
    },
    methods: {
      triggerActive(i) {
        this.active = i;
        if (i == 1) {
          this.group.catGroupId = 0;
        }
      },

      //加载好友列表
      loadFriends() {
        let that = this;
        friendsServ().then(res => {
          if (res.code == 200) {
            that.friends = res.data;
          }
        });
      },

      //加载群聊列表接口
      loadUserGroups() {
        findUserGroupsServ().then(res => {
          if (res.code == 200) {
            this.group.items = res.data;
          }
        });
      },

      //格式化好友签名
      setUserTip(firend) {
        let online = firend.online ?
          '<span style="color:#058205a3">[在线]</span>' :
          "[离线]";
        return `${online} - ${firend.motto}`;
      },

      // 列表点击事件
      clickfriends(data) {
        this.$refs.userBusinessCard.open(data.object.id);
      },

      clickGroupInfo(data) {
        this.group.catGroupId = data.object.id;
      },

      //搜索框修改触发事件
      searchChange(value) {
        alert("功能正在研发中请耐心等待...");
      },

      //搜索框加号点击事件
      open(e) {
        this.insmodeBox = true;
      },

      //获取指定好友的索引
      getIndex(user_id) {
        return this.friends.findIndex(function (item, index, arr) {
          return item.id == user_id;
        });
      },

      //同步用户在线状态
      syncFriendStatus(user_id, status) {
        let index = this.getIndex(user_id);
        if (index >= 0) {
          this.friends[index].online = parseInt(status);
        }
      },

      //给群聊成员发送好友信息
      sendFriendMsg(friendInfo) {
        sessionStorage.setItem("send_message_index_name", friendInfo.index_name);
        this.$router.push({
          path: "/message"
        });
      },

      //更新好友备注昵称
      changeRemark(firendInfo) {
        let index = this.getIndex(firendInfo.friend_id);
        if (index >= 0) this.friends[index].friend_remark = firendInfo.remarks;
      },

      //用户退出群聊回调事件
      quitGroupSuccess() {
        this.group.catGroupId = 0;
        this.loadUserGroups();
      },

      //修改群聊免打扰状态
      disturbChange(detail) {
        let idx = this.getGroupIndex(detail.group_id);
        this.group.items[idx].not_disturb = detail.status;
      },

      //根据用户对话索引获取对话数组对应的key
      getGroupIndex(group_id) {
        return this.group.items.findIndex(function (item, index, arr) {
          return item.id == group_id;
        });
      },

      //更新群信息
      updateGroupInfo(group_id, obj = {}) {
        let idx = this.getGroupIndex(group_id);
        this.group.items[idx] = Object.assign(this.group.items[idx], obj);
      },

      //群聊窗口点击发送群聊信息按钮回调事件
      sendMessage(groupInfo) {
        sessionStorage.setItem(
          "send_message_index_name",
          `2_${groupInfo.groupId}`
        );
        this.$router.push({
          path: "/message"
        });
      },

      showFoundMode(type = 1) {
        if (type == 1) {
          this.insmodeBox = false;
          this.$refs.searchUsers.open();
        } else {
          this.launchGroupShow = true;
          this.insmodeBox = false;
          this.triggerActive(2);
        }
      },

      //发起群聊成功后回调方法
      groupChatSuccess(data) {
        this.launchGroupShow = false;
        this.loadUserGroups();
      }
    }
  };

</script>

<style scoped>
  .no-padding {
    padding: 0;
  }

  .hv100 {
    height: 100%;
  }

  .tab-subfield {
    height: 40px;
    text-align: center;
  }

  .tab-subfield .tab-item {
    float: left;
    width: 50%;
    height: 39px;
    line-height: 39px;
    background-color: #f1e9e9;
    font-size: 13px;
    cursor: pointer;
    border-bottom: 1px solid #f1e9e9;
  }

  .tab-subfield .tab-item-active {
    color: #4caf50;
    border-bottom-color: #4caf50;
    transition-duration: 0.3s;
    transition: all 0.3s ease-in-out 0s;
    -webkit-transition: all 0.4s ease-in-out 0s;
    -moz-transition: all 0.3s ease-in-out 0s;
    -o-transition: all 0.3s ease-in-out 0s;
    -ms-transition: all 0.3s ease-in-out 0s;
  }

  .lumen-chat-group-box {
    position: absolute;
    width: 350px;
    height: 100%;
    right: 0;
    z-index: 2;
    animation: showBox 0.5s ease-in-out;
    -webkit-animation: showBox 0.5s ease-in-out;
    -moz-animation: showBox 0.5s ease-in-out;
    -webkit-box-direction: normal;
    background: white;
    box-shadow: 0 0 14px #cccccc70;
  }

  .friends-notify {
    height: 50px;
    line-height: 50px;
    background: #e4e4e5;
    border-bottom: 1px solid #e3d9d9;
    padding: 5px 5px 5px 10px;
    cursor: pointer;
  }

  .friends-notify .cus-tubiao {
    height: 40px;
    width: 40px;
    display: inline-block;
    background: #e4a52b;
    text-align: center;
    line-height: 40px;
    color: white;
    border-radius: 50%;
  }

  .friends-notify .cus-tubiao:hover {
    transform: rotate(360deg) 0.5s ease-in-out;
    -ms-transform: rotate(360deg) 0.5s ease-in-out;
    /* IE 9 */
    -moz-transform: rotate(360deg) 0.5s ease-in-out;
    /* Firefox */
    -webkit-transform: rotate(360deg) 0.5s ease-in-out;
    /* Safari 和 Chrome */
    -o-transform: rotate(360deg) 0.5s ease-in-out;
    /* Opera */
    transition-duration: 0.3s;
  }

  .friends-notify span {
    padding-left: 3px;
  }

  .insmode-mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999;
    width: 100%;
    height: 100%;
  }

  .insmode-box {
    width: 400px;
    height: 270px;
    background-color: white;
    position: fixed;
    left: 0;
    right: 0;
    top: 0px;
    bottom: 0;
    margin: auto auto;
    box-shadow: 0 0 20px 0px #ccc;
    border-radius: 3px;
    text-align: center;
    padding: 10px;
    display: flex;
  }

  .insmode-box .close {
    position: absolute;
    right: -25px;
    top: 0px;
    color: #aca7a7;
    cursor: pointer;
    font-size: 20px;
  }

  .insmode-box .insmode-vessel {
    flex: 1;
    padding: 5px;
  }

  .insmode-box .insmode-vessel:hover {
    background-color: #fafafa;
  }

  .insmode-box .insmode-vessel div {
    height: 100px;
    margin-bottom: 5px;
    padding-top: 80px;
  }

  .insmode-box .insmode-vessel button {
    height: 35px;
    padding: 5px 20px;
  }

  .avatar-odd-bag:nth-child(odd)>>>.avatar-text {
    background: #eb6841;
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

</style>
