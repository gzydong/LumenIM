<template>
  <el-container class="container">
    <el-header class="header">
      <span>群信息</span>
      <el-tooltip content="发送消息" placement="top">
        <i class="send-message el-icon-chat-dot-square" @click="sendGroup"></i>
      </el-tooltip>
      <i class="el-icon-close" @click="$emit('close')"></i>
    </el-header>

    <el-main class="main lm-scrollbar">
      <div class="list-item list-item-flex">
        <p>
          <span>群名称：</span>
          <span class="group-setting-title">{{ detail.groupName }}</span>
        </p>
        <span
          class="more"
          @click="isShowManager = true"
          v-show="detail.is_manager"
          >管理</span
        >
      </div>

      <div class="list-item">
        <span>群主：</span>
        <span class="group-boss-name">{{ detail.groupOwner }}</span>
      </div>

      <div class="list-item">
        <span>我的群昵称：</span>
        <span class="edit-visit-card" v-if="!isEditRemark">
          <span>
            {{ detail.visitCard }}
            <span v-show="!detail.visitCard" style="font-size: 12px"
              >添加群名片</span
            >
          </span>
          <i
            class="el-icon-edit-outline edit-remark-icon"
            @click="
              isEditRemark = true;
              editRemarkText = detail.visitCard;
            "
          ></i>
        </span>
        <span v-else>
          <input
            type="text"
            v-focus
            v-model="editRemarkText"
            @keyup.enter="editRemark"
            class="edit-input"
          />
          <span class="input-submit" @click="editRemark">确认</span>
        </span>
      </div>

      <div class="list-item list-item-flex">
        <span>消息免打扰：</span>
        <el-switch
          v-model="detail.disturb"
          :disabled="disturbDisabled"
          inactive-color="#e0d6d6"
          @change="editDisturb"
        />
      </div>

      <!-- 预留 -->
      <div class="list-item list-item-flex">
        <span>全员禁言：</span>
        <el-switch v-model="detail.no_message" inactive-color="#e0d6d6" />
      </div>

      <div class="list-item">
        <span>群成员：</span>
        <span>{{ members.length }} 人</span>
      </div>

      <div class="list-item-tips">群主已开启“新成员入群可查看所有聊天记录”</div>

      <div class="list-item">
        <span>群简介</span>
      </div>

      <div class="list-item-tips">
        {{ detail.groupProfile ? detail.groupProfile : "暂无群简介" }}
      </div>

      <div class="list-item list-item-flex">
        <span>群公告</span>
        <span
          class="more"
          v-show="detail.group_notice"
          @click="isShowGroupNotice = true"
          >更多</span
        >
      </div>

      <div class="list-item-tips group-notice">
        <span v-if="detail.group_notice.title">
          <b>#{{ detail.group_notice.title }}#</b><br />
          {{ detail.group_notice.content }}
        </span>
        <span v-else>暂无群公告</span>
      </div>

      <div class="list-item no-select">
        <p class="group-invite" @click="addGroupMembers">
          <i class="el-icon-plus"></i>
          <span>邀请好友</span>
        </p>
      </div>

      <div class="list-item">
        <div class="member-box">
          <div class="member-view-box">
            <i class="iconfont icon-sousuo i-sousuo"></i>
            <input type="text" placeholder="搜索群成员" v-model="keywords" />
          </div>

          <el-row class="row-header">
            <el-col :span="11">昵称</el-col>
            <el-col :span="8">名片</el-col>
            <el-col :span="5">性别</el-col>
          </el-row>

          <el-row
            class="row-items"
            v-for="(member, i) in searchs"
            :key="member.user_id"
            @click.native="openUserDetail(member.user_id)"
          >
            <el-col :span="11">
              <img
                :src="member.avatar"
                :onerror="$store.state.detaultAvatar"
                width="20px"
              />
              <span class="nickname">{{ member.nickname }}</span>
            </el-col>
            <el-col :span="8">
              <span>{{ member.visit_card ? member.visit_card : "-" }}</span>
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

    <!-- 退群提示层 -->
    <div class="signout-box no-select" v-show="isShowSignout">
      <p v-show="signoutStatus == 0">您确认退出当前群聊吗？</p>
      <p v-show="signoutStatus == 0">退群后群聊信息将不能查看</p>
      <p v-show="signoutStatus == 0" class="signout-btn">
        <button @click="signout">确认</button>
        <button @click="isShowSignout = false">取消</button>
      </p>

      <p v-show="signoutStatus == 1" class="signout-btn mt38">
        <span style="color: rgb(123, 212, 255)">
          <i class="iconfont icon-jiazaizhong lm-icon-spin"></i> 正在退出群聊...
        </span>
      </p>

      <p v-show="signoutStatus == 2" class="signout-btn mt38">
        <span style="color: #cccccc">退出群聊失败，请3(s)后再试...</span>
      </p>

      <p v-show="signoutStatus == 3" class="signout-btn mt38">
        <span style="color: #339e19">
          <i class="iconfont icon-success_no_circle"></i> 已成功退出群聊...
        </span>
      </p>
    </div>

    <!-- 查看好友用户信息 -->
    <user-business-card ref="userBusinessCard" />

    <group-launch
      v-if="inviteFriendBox"
      :group-id="groupId"
      @close="inviteFriendBox = false"
      @invite-success="inviteSuccess"
    />

    <!-- 群管理组件 -->
    <group-manage
      v-if="isShowManager"
      :group-id="groupId"
      @close="isShowManager = false"
    />

    <group-notice
      v-if="isShowGroupNotice"
      :group-id="groupId"
      @close="isShowGroupNotice = false"
    />
  </el-container>
</template>
<script>
import { ServeSetNotDisturb } from "@/api/chat";

import {
  ServeGroupDetail,
  ServeSetGroupCard,
  ServeSecedeGroup,
  ServeGetGroupMembers,
} from "@/api/group";

//创建群聊组件
import GroupLaunch from "@/components/group/GroupLaunch";
import UserBusinessCard from "@/components/user/UserBusinessCard";
import GroupManage from "@/components/group/GroupManage";
import GroupNotice from "@/components/group/GroupNotice";

export default {
  name: "group-panel",
  components: {
    GroupLaunch,
    UserBusinessCard,
    GroupManage,
    GroupNotice,
  },
  props: {
    groupId: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      detail: {
        groupAvatar: "",
        groupId: 0,
        groupName: "",
        groupOwner: "",
        groupProfile: "",
        disturb: 0,
        no_message: false,
        visitCard: "",
        is_manager: false,
        group_notice: [],
      },

      keywords: "",
      members: [],

      isEditRemark: false,
      editRemarkText: "",

      inviteFriendBox: false,
      isShowSignout: false,

      signoutStatus: 0,

      disturbDisabled: false,

      // 是否显示群管理窗口
      isShowManager: false,

      // 是否显示群公告窗口
      isShowGroupNotice: false,
    };
  },
  watch: {
    groupId: function (newval, oldval) {
      if (newval > 0) {
        this.loadGroupDetail();
        this.loadMembers();
      }
    },
  },
  computed: {
    searchs() {
      return this.keywords == ""
        ? this.members
        : this.members.filter((item, index) => {
            return (
              item.nickname.match(this.keywords) != null ||
              item.visit_card.match(this.keywords) != null
            );
          });
    },
  },
  created() {
    if (parseInt(this.groupId) > 0) {
      this.loadGroupDetail();
      this.loadMembers();
    }
  },
  methods: {
    // 加载群组成员列表
    loadMembers() {
      ServeGetGroupMembers({
        group_id: this.groupId,
      }).then((res) => {
        if (res.code == 200) {
          this.members = res.data;
          this.$emit("group-info", {
            group_id: this.members.groupId,
            members_num: this.members.length,
          });
        }
      });
    },

    // 加载群信息
    loadGroupDetail() {
      this.isEditRemark = false;
      ServeGroupDetail({
        group_id: this.groupId,
      }).then((res) => {
        if (res.code == 200) {
          let result = res.data;
          this.detail.groupAvatar = result.avatar;
          this.detail.groupId = result.group_id;
          this.detail.userId = res.data.user_id;
          this.detail.groupName = result.group_name;
          this.detail.groupOwner = result.manager_nickname;
          this.detail.groupProfile = result.group_profile;
          this.detail.disturb = result.not_disturb == 1 ? true : false;
          this.detail.visitCard = result.visit_card;
          this.detail.is_manager = result.is_manager;

          if (result.notice) {
            this.detail.group_notice = result.notice;
          }
        }
      });
    },

    // 设置群免打扰状态
    editDisturb(value) {
      this.disturbDisabled = true;
      ServeSetNotDisturb({
        type: 2,
        receive_id: this.groupId,
        not_disturb: value ? 1 : 0,
      })
        .then((res) => {
          if (res.code == 200) {
            this.$emit("disturb-change", {
              group_id: this.groupId,
              status: value ? 1 : 0,
            });
          } else {
            this.detail.disturb = value ? 0 : 1;
          }
        })
        .catch((err) => {
          this.detail.disturb = value ? 0 : 1;
        })
        .finally(() => {
          this.disturbDisabled = false;
        });
    },

    // 设置用户群名片
    editRemark() {
      if (this.editRemarkText == "") {
        this.isEditRemark = false;
        return;
      }

      if (this.detail.visitCard == this.editRemarkText) {
        this.isEditRemark = false;
        return;
      }

      ServeSetGroupCard({
        group_id: this.groupId,
        visit_card: this.editRemarkText,
      }).then((res) => {
        if (res.code == 200) {
          this.isEditRemark = false;
          this.detail.visitCard = this.editRemarkText;
        }
      });
    },

    // 查看用户信息
    openUserDetail(user_id) {
      this.$refs.userBusinessCard.open(user_id);
    },

    // 邀请好友加入群聊
    addGroupMembers() {
      sessionStorage.setItem("invite_group_id", this.detail.groupId);
      this.inviteFriendBox = true;
    },

    //邀请好友成功之后的回调事件
    inviteSuccess() {
      this.inviteFriendBox = false;
      this.loadMembers();

      this.$notify({
        title: "邀请成功",
        message: `好友已成功加入群组...`,
        type: "success",
      });
    },

    //发送群聊
    sendGroup() {
      this.$emit("send-group", this.detail.groupId);
    },

    //退出群操操作
    signout() {
      this.signoutStatus = 1;
      ServeSecedeGroup({
        group_id: this.detail.groupId,
      })
        .then((res) => {
          if (res.code == 200) {
            this.signoutStatus = 3;
            setTimeout(() => {
              this.signoutStatus = 0;
              this.isShowSignout = false;
              this.$emit("quit-group");
            }, 1500);
          } else {
            this.signoutStatus = 2;
            setTimeout(() => {
              this.signoutStatus = 0;
            }, 3000);
          }
        })
        .catch((err) => {
          this.signoutStatus = 2;
          setTimeout(() => {
            this.signoutStatus = 0;
          }, 3000);
        });
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  height: 100%;

  .header {
    height: 60px;
    line-height: 60px;
    padding: 0;
    text-align: center;
    box-shadow: -1px 0px 5px 0px #cccccc45;
    position: relative;

    span {
      font-size: 16px;
      font-weight: 400;
    }

    .send-message {
      position: absolute;
      left: 15px;
      top: 22px;
      font-size: 18px;
      cursor: pointer;
    }

    .el-icon-close {
      position: absolute;
      right: 15px;
      top: 22px;
      font-size: 18px;
      cursor: pointer;
    }
  }

  .main {
    padding: 0;
  }
}

.list-item {
  position: relative;
  padding: 16px 16px 0;
  min-height: 18px;
  font-size: 14px;

  .edit-visit-card {
    position: initial;
    color: #a29f9f;
  }

  .edit-remark-icon {
    margin-left: 5px;
    color: rgb(169, 184, 187);
    position: absolute;
    top: 20px;
    cursor: pointer;
  }

  .edit-input {
    width: 46%;
    height: 25px;
    line-height: 25px;
    border: 1px solid #92cbff;
    padding-left: 5px;
    border-radius: 3px;
  }

  .input-submit {
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

  .group-setting-title {
    max-width: 250px;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: bottom;
  }

  .group-boss-name {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    max-width: 180px;
    position: relative;
    top: 4px;
  }

  .group-invite {
    height: 30px;
    background: #fdf2f2;
    line-height: 30px;
    text-align: center;
    color: #f3848e;
    cursor: pointer;
    border-radius: 2px;

    &:active {
      background: #f7e5e5;
    }
  }

  .more {
    color: #409eff;
    cursor: pointer;
    font-size: 12px;
  }
}

.list-item-flex {
  display: flex;
  justify-content: space-between;
}

.list-item-tips {
  font-size: 12px;
  color: #b1b1b1;
  margin-top: 5px;
  padding-left: 16px;
  padding-right: 16px;
  font-weight: 300;
}

.group-notice {
  line-height: 22px;
}

.member-box {
  cursor: pointer;
  min-height: 180px;
  box-shadow: -2px -3px 18px #eae4e4;
  padding: 10px;
  margin-bottom: 20px;

  .addGroupFired {
    border: 1px dashed #c3bbbb;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: block;
    margin: 0px 5px 5px 4px;
    line-height: 40px;
    color: #c3bbbb;
  }
}

.member-view-box {
  width: 100%;
  height: 30px;
  margin-top: 20px;
  margin-bottom: 15px;
  position: relative;

  input {
    width: calc(100% - 40px);
    height: 30px;
    line-height: 28px;
    border-radius: 3px;
    border: 1px solid #f1e9e9;
    color: #b3b0b0;
    font-size: 13px;
    padding: 0 10px 0 30px;

    &::-webkit-input-placeholder {
      color: #ccc9c9;
      font-size: 13px;
    }
  }

  .i-sousuo {
    color: rgb(179, 176, 176);
    position: absolute;
    left: 10px;
    top: 9px;
  }

  span {
    position: relative;

    i {
      font-size: 24px;
      top: -3px;
      left: 10px;
      position: absolute;
      color: #ccc;
    }
  }
}

.row-header {
  width: 100%;
  height: 30px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e0dddd;

  div {
    height: 30px;
    line-height: 30px;

    &:nth-child(2) {
      text-align: center;
    }

    &:nth-child(3) {
      text-align: right;
    }
  }
}

.row-items {
  width: 100%;
  height: 30px;
  margin-bottom: 3px;
  font-size: 12px;

  &:hover {
    background: #f6f6f6;
    padding: 0 5px;
    font-size: 12px;
    border-radius: 3px;
  }

  div {
    height: 30px;
    line-height: 30px;

    &:nth-child(2) {
      text-align: center;
    }

    &:nth-child(3) {
      text-align: right;
    }
  }

  img {
    display: inline-block;
    border-radius: 50%;
    position: relative;
    top: 4px;
  }

  .nickname {
    margin-left: 5px;
    &:hover {
      color: #3685d6;
    }
  }
}

.signout-box {
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

  p {
    &:first-child {
      text-align: center;
      height: 35px;
      line-height: 35px;
    }

    &:nth-child(2) {
      text-align: center;
      font-size: 12px;
      color: #cccccc;
    }
  }
}

.signout-btn {
  text-align: center;
  margin-top: 10px;

  button {
    height: 30px;
    width: 90px;
    line-height: 30px;
    background: #007fbb;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;

    &:first-child {
      background: #ff3333;
      color: white;
    }

    &:last-child {
      background: #f1eded;
    }
  }
}

.container .footer {
  height: 60px;
  padding: 0;
  line-height: 60px;
  text-align: center;
  background-color: #f8f8f8;

  button {
    width: 180px;
    height: 35px;
    line-height: 35px;
    background: #ed3c3b;
    border-radius: 3px;
    color: white;
    cursor: pointer;
    font-size: 12px;
    margin: auto auto;

    &:active {
      background: #f5b8b8;
    }
  }
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
