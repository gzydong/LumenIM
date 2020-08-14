<template>
  <el-container class="container">
    <el-header class="header">
      <span>群信息</span>
      <el-tooltip content="发送消息" placement="top" >
        <i class="send-message el-icon-chat-dot-square" @click="sendGroup"></i>
      </el-tooltip>
      <i class="close-btn el-icon-close" @click="$emit('close')"></i>
    </el-header>
    <el-main class="main lumen-scrollbar">
      <div class="list-item list-item-flex">
        <p>
          <span>群名称：</span>
          <span class="group-setting-title">{{groupMessage.groupName}}</span>
        </p>
        <span class="more">群管理</span>
      </div>

      <div class="list-item">
        <span>群主：</span>
        <span class="group-boss-name">{{ groupMessage.groupOwner }}</span>
      </div>

      <div class="list-item">
        <span>我的群昵称：</span>
        <span class="edit-visit-card" v-if="!isEditRemark">
          <span>
            {{groupMessage.visitCard}}
            <span v-show="!groupMessage.visitCard" style="font-size: 12px;">添加群名片</span>
          </span>
          <i class="el-icon-edit-outline edit-remark-icon"
            @click="isEditRemark = true;editRemarkText = groupMessage.visitCard"></i>
        </span>
        <span v-else>
          <input type="text" v-focus v-model="editRemarkText" @keyup.enter="editRemark" class="edit-input" />
          <span class="input-submit" @click="editRemark">确认</span>
        </span>
      </div>

      <div class="list-item list-item-flex">
        <span>消息免打扰：</span>
        <el-switch v-model="groupMessage.disturb" :disabled="disturbDisabled" inactive-color="#e0d6d6"
          @change="changeDisturb" />
      </div>

      <div class="list-item">
        <span>群成员：</span>
        <span>{{groupMessage.members.length}} 人</span>
      </div>

      <div class="list-item-tips">群主已开启“新成员入群可查看所有聊天记录”</div>

      <div class="list-item list-item-flex">
        <span>群公告</span>
        <span class="more">更多</span>
      </div>

      <div class="list-item-tips group-notice">暂无群公告</div>

      <div class="list-item">
        <span>群简介</span>
      </div>

      <div class="list-item-tips">{{groupMessage.groupProfile?groupMessage.groupProfile:'暂无群简介'}}</div>

      <div class="list-item">
        <p class="lumen-group-invite" @click="addGroupMembers">
          <i class="el-icon-circle-plus-outline"></i>
          <span>邀请好友</span>
        </p>
      </div>

      <div class="list-item">
        <div class="member-box">
          <div class="member-view-box">
            <i class="iconfont icon-sousuo i-sousuo"></i>
            <input type="text" placeholder="搜索群成员" v-model="searchMember" @input="searchKeyword"
              @keyup.enter="searchKeyword" />
          </div>

          <el-row class="row-header">
            <el-col :span="11">昵称</el-col>
            <el-col :span="8">名片</el-col>
            <el-col :span="5">性别</el-col>
          </el-row>

          <el-row class="row-items" v-for="(member,i) in searchList" :key="i"
            @click.native="showFriendInfo(member.user_id)">
            <el-col :span="11">
              <img :src="member.avatar" :onerror="$store.state.user.detaultAvatar" width="20px" />
              <span class="nickname">{{member.nickname}}</span>
            </el-col>
            <el-col :span="8">
              <span>{{member.visit_card?member.visit_card:'-'}}</span>
            </el-col>
            <el-col :span="5">
              <span v-if="member.gender == 1">男</span>
              <span v-else-if="member.gender == 2">女</span>
              <span v-else>未知</span>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-main>
    <el-footer class="footer">
      <button @click="isShowSignout = true">退出该群聊</button>
    </el-footer>

    <div class="signout-confirm-box no-user-select" v-show="isShowSignout">
      <p v-show="signoutStatus == 0">您确认退出当前群聊吗？</p>
      <p v-show="signoutStatus == 0">退群后群聊信息将不能查看</p>
      <p v-show="signoutStatus == 0" class="signout-button">
        <button @click="signout">确认</button>
        <button @click="isShowSignout = false">取消</button>
      </p>

      <p v-show="signoutStatus == 1" class="signout-button mt38">
        <span style="color: rgb(123, 212, 255);">
          <i class="iconfont icon-jiazaizhong lumen-icon-spin"></i> 正在退出群聊...
        </span>
      </p>

      <p v-show="signoutStatus == 2" class="signout-button mt38">
        <span style="color: #CCCCCC;">退出群聊失败，请3(s)后再试...</span>
      </p>

      <p v-show="signoutStatus == 3" class="signout-button mt38">
        <span style="color: #339e19;">
          <i class="iconfont icon-success_no_circle"></i> 已成功退出群聊...
        </span>
      </p>
    </div>

    <!-- 查看好友用户信息 -->
    <user-business-card ref="userBusinessCard" @send-friend-msg="sendFirendMsg" />

    <launch-group-chat v-if="isShow" :group-id="groupId" @close="isShow = false" @invite-success="inviteSuccess" />
  </el-container>
</template>

<script>
  import {
    chatListCrateServ,
    setNotDisturbServ
  } from "@/api/chat";

  import {
    groupDetailServ,
    setGroupCardServ,
    secedeGroupServ
  } from "@/api/group";

  //创建群聊组件
  import LaunchGroupChat from "@/components/chat/LaunchGroupChat";
  import UserBusinessCard from "@/components/user/UserBusinessCard";
  export default {
    name: "user-group",
    components: {
      LaunchGroupChat,
      UserBusinessCard
    },
    props: {
      groupId: {
        type: [String, Number],
        default: null
      }
    },
    data() {
      return {
        loadStatus: 0,
        groupMessage: {
          groupAvatar: "",
          groupId: 0,
          groupName: "",
          groupOwner: "",
          groupProfile: "",
          disturb: 0,
          members: [],
          visitCard: ""
        },

        isEditRemark: false,
        editRemarkText: "",
        searchMember: "",

        reveal: true,
        searchList: [],
        isShow: false,
        isShowSignout: false,

        signoutStatus: 0,

        disturbDisabled: false
      };
    },
    watch: {
      groupId: function (newval, oldval) {
        if (newval > 0) {
          this.groupDetailList();
        }
      }
    },
    created() {
      if (parseInt(this.groupId) > 0) {
        this.groupDetailList();
      }
    },
    methods: {
      // 列表点击事件
      showFriendInfo(user_id) {
        this.$refs.userBusinessCard.open(user_id);
      },
      //发送好友消息
      sendFirendMsg(firendInfo) {
        this.$emit('send-friend-msg', firendInfo)
      },
      changeDisturb(value) {
        this.disturbDisabled = true;
        setNotDisturbServ({
          type: 2,
          receive_id: this.groupId,
          not_disturb: value ? 1 : 0
        }).then(res => {
          this.disturbDisabled = false;
          if (res.code == 200) {
            this.$emit("disturb-change", {
              group_id: this.groupId,
              status: value ? 1 : 0
            });
          } else {
            this.groupMessage.disturb = value ? 0 : 1;
          }
        }).catch(err => {
          this.disturbDisabled = false;
          this.groupMessage.disturb = value ? 0 : 1;
        });
      },
      searchKeyword() {
        let keyWords = this.searchMember;
        if (keyWords == "") {
          this.searchList = this.groupMessage.members;
          return;
        }

        this.searchList = this.groupMessage.members.filter((item, i, a) => {
          if (item.visit_card.match(keyWords) != null) {
            return item;
          } else if (item.nickname.match(keyWords) != null) {
            return item;
          }
        });
      },
      groupDetailList() {
        let that = this;
        this.loadStatus = 0;
        this.isEditRemark = false;
        groupDetailServ({
          group_id: that.groupId
        }).then(res => {
          if (res.code == 200) {
            that.loadStatus = 1;
            that.searchMember = "";
            that.groupMessage.groupAvatar = res.data.group_avatar;
            that.groupMessage.groupId = res.data.group_id;
            that.groupMessage.userId = res.data.user_id;
            that.groupMessage.groupName = res.data.group_name;
            that.groupMessage.groupOwner = res.data.group_owner;
            that.groupMessage.groupProfile = res.data.group_profile;
            that.groupMessage.disturb = res.data.not_disturb == 1 ? true : false;
            that.searchList = that.groupMessage.members = res.data.members;

            let uid = this.$store.state.user.uid;
            let item = that.groupMessage.members.find((item, key, arr) => {
              return item.user_id == uid;
            });

            if (item) {
              that.groupMessage.visitCard = item.visit_card;
            }

            that.$emit("group-info", {
              group_id: that.groupMessage.groupId,
              members_num: that.groupMessage.members.length
            });
          }
        });
      },

      //邀请好友加入群聊
      addGroupMembers() {
        sessionStorage.setItem("invite_group_id", this.groupMessage.groupId);
        this.isShow = true;
      },

      //提交修改用户群名片
      editRemark() {
        let that = this;
        if (this.editRemarkText == "") {
          this.isEditRemark = false;
          return;
        }

        if (this.groupMessage.visitCard == this.editRemarkText) {
          this.isEditRemark = false;
          return;
        }

        setGroupCardServ({
          group_id: this.groupId,
          visit_card: this.editRemarkText
        }).then(res => {
          if (res.code == 200) {
            that.isEditRemark = false;
            that.groupMessage.visitCard = that.editRemarkText;
          }
        });
      },

      //邀请好友成功之后的回调事件
      inviteSuccess() {
        this.isShow = false;
        this.groupDetailList();
      },

      //发送群聊
      sendGroup() {
        chatListCrateServ({
          type: 2,
          receive_id: this.groupMessage.groupId
        }).then(res => {
          if (res.code !== 200) return;
          this.$emit("send-group", {
            list_id: res.data.list_id,
            index_name: `2_${this.groupMessage.groupId}`,
            type: 2,
            groupId: this.groupMessage.groupId,
            avatar: this.groupMessage.groupAvatar,
            groupName: this.groupMessage.groupName
          });
        });
      },

      //退出群操操作
      signout() {
        let that = this;
        this.signoutStatus = 1;
        secedeGroupServ({
          group_id: this.groupMessage.groupId
        }).then(res => {
          if (res.code == 200) {
            that.signoutStatus = 3;
            setTimeout(function () {
              that.signoutStatus = 0;
              that.isShowSignout = false;
              that.$emit("quit-group");
            }, 1500);
          } else {
            that.signoutStatus = 2;
            setTimeout(function () {
              that.signoutStatus = 0;
            }, 3000);
          }
        }).catch(err => {
          that.signoutStatus = 2;
          setTimeout(function () {
            that.signoutStatus = 0;
          }, 3000);
        });
      }
    }
  };

</script>

<style scoped>
  .container {
    height: 100%;
  }

  .container .header {
    height: 60px;
    line-height: 60px;
    padding: 0;
    text-align: center;
    box-shadow: -1px 0px 5px 0px #cccccc45;
    position: relative;
  }

  .container .header span {
    font-size: 16px;
    font-weight: 400;
  }

  .container .header .send-message {
    position: absolute;
    left: 15px;
    top: 22px;
    font-size: 18px;
    cursor: pointer;
  }

  .container .header .close-btn {
    position: absolute;
    right: 15px;
    top: 22px;
    font-size: 18px;
    cursor: pointer;
  }

  .container .main {
    padding: 0;
  }

  .list-item {
    position: relative;
    padding: 16px 16px 0;
    min-height: 18px;
    font-size: 14px;
  }

  .list-item-flex {
    display: flex;
    justify-content: space-between;
  }

  .list-item .edit-visit-card {
    position: initial;
    color: #a29f9f;
  }

  .list-item .edit-remark-icon {
    margin-left: 5px;
    color: rgb(169, 184, 187);
    position: absolute;
    top: 20px;
    cursor: pointer;
  }

  .list-item .edit-input {
    width: 46%;
    height: 25px;
    line-height: 25px;
    border: 1px solid #92cbff;
    padding-left: 5px;
    border-radius: 3px;
  }

  .list-item .input-submit {
    width: 55px;
    text-align: center;
    height: 25px;
    line-height: 25px;
    background-color: #008cee;
    border-radius: 2px;
    display: inline-block;
    color: #fff !important;
    font-size: 12px;
    margin-left: 10px;
    cursor: pointer;
  }

  .list-item .group-setting-title {
    max-width: 250px;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: bottom;
  }

  .list-item .group-boss-name {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    max-width: 180px;
    position: relative;
    top: 4px;
  }

  .list-item-tips {
    font-size: 12px;
    color: #b1b1b1;
    margin-top: 5px;
    padding-left: 16px;
    padding-right: 16px;
  }

  .list-item .lumen-group-invite {
    height: 30px;
    background: #fdf2f2;
    line-height: 30px;
    text-align: center;
    color: #f3848e;
    cursor: pointer;
    border-radius: 2px;
  }

  .list-item .lumen-group-invite:active {
    background: #f7e5e5;
  }

  .list-item .more {
    color: #409eff;
    cursor: pointer;
    font-size: 12px;
  }

  .group-notice {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .member-box {
    cursor: pointer;
    min-height: 180px;
    box-shadow: -2px -3px 18px #eae4e4;
    padding: 10px;
    margin-bottom: 20px;
  }

  .member-view-box input::-webkit-input-placeholder {
    color: #ccc9c9;
    font-size: 13px;
  }

  .member-view-box {
    width: 100%;
    height: 30px;
    margin-top: 20px;
    margin-bottom: 15px;
    position: relative;
  }

  .member-view-box .i-sousuo {
    color: rgb(179, 176, 176);
    position: absolute;
    left: 10px;
    top: 9px;
  }

  .member-view-box input {
    width: calc(100% - 40px);
    height: 30px;
    line-height: 28px;
    border-radius: 3px;
    border: 1px solid #f1e9e9;
    color: #b3b0b0;
    font-size: 13px;
    padding: 0 10px 0 30px;
  }

  .member-view-box span {
    position: relative;
  }

  .member-view-box span i {
    font-size: 24px;
    top: -3px;
    left: 10px;
    position: absolute;
    color: #ccc;
  }

  .row-header {
    width: 100%;
    height: 30px;
    margin-bottom: 10px;
    border-bottom: 1px solid #e0dddd;
  }

  .row-header div {
    height: 30px;
    line-height: 30px;
  }

  .row-header div:nth-child(2) {
    text-align: center;
  }

  .row-header div:nth-child(3) {
    text-align: right;
  }


  .row-items {
    width: 100%;
    height: 30px;
    margin-bottom: 3px;
  }

  .row-items:hover {
    background-color: #f9efef;
  }

  .row-items div {
    height: 30px;
    line-height: 30px;
  }

  .row-items div:nth-child(2) {
    text-align: center;
  }

  .row-items div:nth-child(3) {
    text-align: right;
  }

  .row-items img {
    display: inline-block;
    border-radius: 50%;
    position: relative;
    top: 4px;
  }

  .row-items .nickname:hover {
    color: #3685d6;
  }

  .member-box .addGroupFired {
    border: 1px dashed #c3bbbb;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: block;
    margin: 0px 5px 5px 4px;
    line-height: 40px;
    color: #c3bbbb;
  }

  .signout-confirm-box {
    width: 100%;
    height: 100px;
    background: #ffffff;
    position: absolute;
    z-index: 2;
    bottom: 0;
    box-shadow: -1px -3px 11px 0px #cccccc82;
    -webkit-animation: showFooter 0.35s ease-in-out;
    -moz-animation: showFooter 0.35s ease-in-out;
    animation: showFooter 0.35s ease-in-out;
  }

  .signout-confirm-box p:first-child {
    text-align: center;
    height: 35px;
    line-height: 35px;
  }

  .signout-confirm-box p:nth-child(2) {
    text-align: center;
    font-size: 12px;
    color: #cccccc;
  }

  .signout-button {
    text-align: center;
    margin-top: 10px;
  }

  .signout-confirm-box button {
    height: 30px;
    width: 90px;
    line-height: 30px;
    background: #007fbb;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
  }

  .signout-button button:first-child {
    background: #ff3333;
    color: white;
  }

  .signout-button button:last-child {
    background: #f1eded;
  }

  .container .footer {
    height: 60px;
    padding: 0;
    line-height: 60px;
    text-align: center;
    background-color: #f8f8f8;
  }

  .container .footer button {
    width: 180px;
    height: 35px;
    background: #ed3c3b;
    border-radius: 3px;
    color: white;
    cursor: pointer;
    font-size: 12px;
    margin: auto auto;
  }

  .container .footer button:active {
    background: #f5b8b8;
  }

  @keyframes showFooter {
    0% {
      transform: translateY(75px);
    }

    to {
      transform: translateY(0);
    }
  }

  @-webkit-keyframes showFooter {
    0% {
      -webkit-transform: translateY(75px);
    }

    to {
      -webkit-transform: translateY(0);
    }
  }

</style>
