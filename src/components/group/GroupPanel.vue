<template>
  <el-container class="container">
    <el-header class="header">
      <span>群信息</span>
      <el-tooltip content="发送消息" placement="top">
        <i class="icon-send el-icon-chat-line-square" @click="sendGroup" />
      </el-tooltip>
      <i class="el-icon-close" @click="$emit('close')" />
    </el-header>

    <el-main class="main lum-scrollbar">
      <div class="list-item flex">
        <p>
          <span>群名称：</span>
          <span class="group-setting-title">{{ detail.groupName }}</span>
        </p>
        <span
          v-show="detail.is_manager"
          class="more"
          @click="isShowManager = true"
          >管理
        </span>
      </div>

      <div class="list-item">
        <span>群主：</span>
        <span class="group-boss-name">{{ detail.groupOwner }}</span>
      </div>

      <div class="list-item">
        <span>我的群昵称：</span>
        <span v-if="!isEditRemark" class="edit-visit-card">
          <span>
            {{ detail.visitCard }}
            <span v-show="!detail.visitCard" style="font-size: 12px">
              添加群名片
            </span>
          </span>
          <i
            class="el-icon-edit-outline edit-remark-icon"
            @click="
              isEditRemark = true
              editRemarkText = detail.visitCard
            "
          />
        </span>
        <span v-else>
          <input
            v-model.trim="editRemarkText"
            class="edit-input"
            type="text"
            v-focus
            @keyup.enter="editRemark"
          />
          <span class="input-submit" @click="editRemark">确认</span>
        </span>
      </div>

      <div class="list-item flex">
        <span>消息免打扰：</span>
        <el-switch
          v-model="detail.is_disturb"
          inactive-color="#e0d6d6"
          :disabled="disturbDisabled"
          @change="editDisturb"
        />
      </div>

      <!-- 预留 -->
      <div class="list-item flex">
        <span>全员禁言：</span>
        <el-switch v-model="detail.no_message" inactive-color="#e0d6d6" />
      </div>

      <div class="list-item">
        <span>群成员：</span>
        <span>{{ members.length }} 人</span>
      </div>

      <div class="list-item-tips">群主已开启“新成员入群可查看所有聊天记录”</div>

      <div class="list-item">群简介</div>

      <div class="list-item-tips">
        {{ detail.profile ? detail.profile : '暂无群简介' }}
      </div>

      <div class="list-item flex">
        <span>群公告</span>
        <span
          v-show="detail.group_notice"
          class="more"
          @click="isShowGroupNotice = true"
          >更多
        </span>
      </div>

      <div class="list-item-tips group-notice">
        <span v-if="detail.group_notice.title">
          <b>#{{ detail.group_notice.title }}#</b><br />
          {{ detail.group_notice.content }}
        </span>
        <span v-else>暂无群公告</span>
      </div>

      <div class="list-item">
        <p class="group-invite" @click="addGroupMembers">
          <i class="el-icon-plus" />
          <span>&nbsp;邀请好友</span>
        </p>
      </div>

      <div class="list-item">
        <div class="member-box">
          <div class="view-box">
            <i class="iconfont icon-sousuo i-sousuo" />
            <input type="text" placeholder="搜索群成员" v-model="keywords" />
          </div>

          <el-row class="row-header">
            <el-col :span="11">昵称</el-col>
            <el-col :span="8">名片</el-col>
            <el-col :span="5">性别</el-col>
          </el-row>

          <template v-if="searchs.length == 0">
            <el-row class="row-items">
              <el-col :span="24">
                <p style="text-align:center;">无数据</p>
              </el-col>
            </el-row>
          </template>
          <template v-else>
            <el-row
              v-for="member in searchs"
              :key="member.user_id"
              class="row-items"
              @click.native="openUserDetail(member.user_id)"
            >
              <el-col :span="11">
                <img
                  width="20px"
                  :src="member.avatar"
                  :onerror="$store.state.detaultAvatar"
                />
                <span class="nickname">{{ member.nickname }}</span>
              </el-col>
              <el-col :span="8">
                <span>{{ member.user_card ? member.user_card : '-' }}</span>
              </el-col>
              <el-col :span="5">
                <span v-if="member.gender == 1">男</span>
                <span v-else-if="member.gender == 2">女</span>
                <span v-else>未知</span>
              </el-col>
            </el-row>
          </template>
        </div>
      </div>
    </el-main>

    <el-footer class="footer">
      <button v-if="detail.is_manager" @click="dismiss">解散群聊</button>
      <button v-else @click="isShowSignout = true">退出该群聊</button>
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
        <span style="color: #ccc">
          <i class="el-icon-loading" />
          正在退出群聊...
        </span>
      </p>

      <p v-show="signoutStatus == 2" class="signout-btn mt38">
        <span style="color: #cccccc">退出群聊失败，请3(s)后再试...</span>
      </p>

      <p v-show="signoutStatus == 3" class="signout-btn mt38">
        <span style="color: #339e19">
          <i class="iconfont icon-success_no_circle" /> 已成功退出群聊...
        </span>
      </p>
    </div>

    <!-- 邀请好友组件 -->
    <transition name="el-fade-in-linear">
      <GroupLaunch
        v-if="inviteFriendBox"
        :group-id="groupId"
        @close="inviteFriendBox = false"
        @invite-success="inviteSuccess"
      />
    </transition>

    <!-- 群管理组件 -->
    <transition name="el-fade-in-linear">
      <GroupManage
        v-if="isShowManager"
        :group-id="groupId"
        @close="isShowManager = false"
      />
    </transition>

    <!-- 群公告组件 -->
    <transition name="el-fade-in-linear">
      <GroupNotice
        v-if="isShowGroupNotice"
        :group-id="groupId"
        @close="isShowGroupNotice = false"
      />
    </transition>
  </el-container>
</template>
<script>
import { ServeSetNotDisturb } from '@/api/chat'
import {
  ServeGroupDetail,
  ServeUpdateGroupCard,
  ServeSecedeGroup,
  ServeGetGroupMembers,
} from '@/api/group'

//创建群聊组件
import GroupLaunch from '@/components/group/GroupLaunch'
import GroupManage from '@/components/group/GroupManage'
import GroupNotice from '@/components/group/GroupNotice'

export default {
  name: 'GroupPanel',
  components: {
    GroupLaunch,
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
        groupAvatar: '',
        groupId: 0,
        groupName: '',
        groupOwner: '',
        profile: '',
        is_disturb: 0,
        no_message: false,
        visitCard: '',
        is_manager: false,
        group_notice: [],
      },

      keywords: '',
      members: [],

      isEditRemark: false,
      editRemarkText: '',

      inviteFriendBox: false,
      isShowSignout: false,

      signoutStatus: 0,

      disturbDisabled: false,

      // 是否显示群管理窗口
      isShowManager: false,

      // 是否显示群公告窗口
      isShowGroupNotice: false,
    }
  },
  watch: {
    groupId: function(value) {
      if (value > 0) {
        this.loadGroupDetail()
        this.loadMembers()
      }
    },
  },
  computed: {
    searchs() {
      return this.keywords == ''
        ? this.members
        : this.members.filter(item => {
            return (
              item.nickname.match(this.keywords) != null ||
              item.user_card.match(this.keywords) != null
            )
          })
    },
  },
  created() {
    if (parseInt(this.groupId) > 0) {
      this.loadGroupDetail()
      this.loadMembers()
    }
  },
  methods: {
    // 加载群组成员列表
    loadMembers() {
      ServeGetGroupMembers({
        group_id: this.groupId,
      }).then(res => {
        if (res.code == 200) {
          this.members = res.data
          this.$emit('group-info', {
            group_id: this.members.groupId,
            members_num: this.members.length,
          })
        }
      })
    },

    // 加载群信息
    loadGroupDetail() {
      this.isEditRemark = false
      ServeGroupDetail({
        group_id: this.groupId,
      }).then(res => {
        if (res.code == 200) {
          let result = res.data
          this.detail.groupAvatar = result.avatar
          this.detail.groupId = result.group_id
          this.detail.userId = res.data.user_id
          this.detail.groupName = result.group_name
          this.detail.groupOwner = result.manager_nickname
          this.detail.profile = result.profile
          this.detail.is_disturb = result.is_disturb == 1
          this.detail.visitCard = result.visit_card
          this.detail.is_manager = result.is_manager

          if (result.notice) {
            this.detail.group_notice = result.notice
          }
        }
      })
    },

    // 设置群免打扰状态
    editDisturb(value) {
      this.disturbDisabled = true
      ServeSetNotDisturb({
        talk_type: 2,
        receiver_id: parseInt(this.groupId),
        is_disturb: value ? 1 : 0,
      })
        .then(res => {
          if (res.code == 200) {
            this.$emit('disturb-change', {
              group_id: this.groupId,
              status: value ? 1 : 0,
            })
          } else {
            this.detail.is_disturb = value ? 0 : 1
          }
        })
        .catch(() => {
          this.detail.is_disturb = value ? 0 : 1
        })
        .finally(() => {
          this.disturbDisabled = false
        })
    },

    // 设置用户群名片
    editRemark() {
      if (this.editRemarkText == '') {
        this.isEditRemark = false
        return
      }

      if (this.detail.visitCard == this.editRemarkText) {
        this.isEditRemark = false
        return
      }

      ServeUpdateGroupCard({
        group_id: parseInt(this.groupId),
        visit_card: this.editRemarkText,
      }).then(res => {
        if (res.code == 200) {
          this.isEditRemark = false
          this.detail.visitCard = this.editRemarkText
        }
      })
    },

    // 查看用户信息
    openUserDetail(user_id) {
      this.$user(user_id)
    },

    // 邀请好友加入群聊
    addGroupMembers() {
      sessionStorage.setItem('invite_group_id', this.detail.groupId)
      this.inviteFriendBox = true
    },

    // 邀请好友成功之后的回调事件
    inviteSuccess() {
      this.inviteFriendBox = false
      this.loadMembers()

      this.$notify({
        title: '邀请成功',
        message: `好友已成功加入群组...`,
        type: 'success',
      })
    },

    // 发送群聊
    sendGroup() {
      this.$emit('send-group', this.detail.groupId)
    },

    // 退出群操操作
    signout() {
      this.signoutStatus = 1
      ServeSecedeGroup({
        group_id: this.detail.groupId,
      })
        .then(res => {
          if (res.code == 200) {
            this.signoutStatus = 3
            setTimeout(() => {
              this.signoutStatus = 0
              this.isShowSignout = false
              this.$emit('quit-group')
            }, 1500)
          } else {
            this.signoutStatus = 2
            setTimeout(() => {
              this.signoutStatus = 0
            }, 3000)
          }
        })
        .catch(() => {
          this.signoutStatus = 2
          setTimeout(() => {
            this.signoutStatus = 0
          }, 3000)
        })
    },

    // 解散群组
    dismiss() {
      this.$confirm(`你确定要解散当前群组吗？此操作是不可恢复的！`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        dangerouslyUseHTMLString: true,
      }).then(() => {})
    },
  },
}
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

    .icon-send {
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

  &.flex {
    display: flex;
    justify-content: space-between;
  }

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
    line-height: 30px;
    text-align: center;
    color: #877272;
    cursor: pointer;
    border-radius: 2px;
    border: 1px dashed #d9bbbb;
    font-size: 13px;
    transition: all 0.5s ease-in-out;
    &:hover {
      color: #ff5722;
      border-color: #ff5722;
      transform: scale(1.01);
    }
  }

  .more {
    color: #409eff;
    cursor: pointer;
    font-size: 12px;
  }
}

.list-item-tips {
  font-size: 12px;
  color: #b1b1b1;
  margin-top: 5px;
  padding-left: 16px;
  padding-right: 16px;
  font-weight: 300;
  overflow: hidden;
  word-break: break-word;
}

.group-notice {
  line-height: 22px;
}

.member-box {
  min-height: 180px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ecebeb;
  border-radius: 3px;

  .view-box {
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
    cursor: pointer;

    &:hover {
      background: #f6f6f6;
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

  .mt38 {
    margin-top: 38px;
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
