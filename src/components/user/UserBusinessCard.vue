<template>
  <div class="base-mask animated fadeIn" v-show="isShow">
    <el-container class="container" v-outside="close">
      <el-header class="padding0 header" height="180px">
        <i class="el-icon-error close-icon" @click="close"></i>
        <div class="img-banner">
          <img :src="userInfo.imgbag" class="img-banner" alt="">
        </div>
        <div class="user-header">
          <div class="avatar">
            <div class="avatar-box">
              <img :src="userInfo.avatar" :onerror="$store.state.detaultAvatar" alt="">
            </div>
          </div>
          <div class="nickname">
            <i class="iconfont icon-qianming"></i>
            <span>{{ userInfo.nickname || '未设置昵称'}}</span>
          </div>
        </div>
      </el-header>
      <el-main class="padding0 main">
        <div class="user-sign">
          <div class="sign-arrow"></div>
          <i class="iconfont icon-bianji"></i>
          <span>编辑个签，展示我的独特态度。
          </span>
        </div>

        <div class="card-rows no-select">
          <div class="card-row">
            <label>手机</label>
            <span>{{ mobile(userInfo.mobile)}} </span>
          </div>
          <div class="card-row">
            <label>昵称</label>
            <span>{{ userInfo.nickname || '未设置昵称'}}</span>
          </div>
          <div class="card-row">
            <label>性别</label>
            <span v-if="userInfo.gender == 1">男</span>
            <span v-else-if="userInfo.gender == 2">女</span>
            <span v-else>未知</span>
          </div>
          <div class="card-row" v-show="userInfo.friendStatus == 2">
            <label>备注</label>
            <span v-if="!editRemark.isShow">{{userInfo.nicknameRemark?userInfo.nicknameRemark:'暂无备注'}}</span>
            <span v-else><input class="friend-remark" v-focus v-model="editRemark.text" @keyup.enter="editRemarkSubmit"
                type="text"></span>
            <i v-show="!editRemark.isShow" @click="clickEditRemark" class="el-icon-edit-outline"></i>
          </div>
          <div class="card-row">
            <label>邮箱</label>
            <span>未设置</span>
          </div>
        </div>
      </el-main>
      <el-footer class="padding0 footer" height="50px" v-show="userInfo.friendStatus !== 0">
        <el-button type="primary" size="small" v-if="userInfo.friendStatus == 1 && userInfo.friendApply == 0"
          @click="applyFrom.isShow = true" icon="el-icon-circle-plus-outline">添加好友</el-button>
        <el-button type="primary" size="small" v-else-if="userInfo.friendApply == 1">已发送好友申请，请耐心等待...</el-button>
        <el-button type="primary" size="small" icon="el-icon-s-promotion" v-else="userInfo.friendStatus == 2"
          @click="sendMessage(userInfo)">发消息
        </el-button>
      </el-footer>

      <!-- 添加好友申请表单 -->
      <div class="friend-from" :class="{'friend-from-show':applyFrom.isShow}" v-outside="closeApplyFrom">
        <p>
          <span>请填写好友申请备注：</span>
          <span @click="closeApplyFrom">取消</span>
        </p>
        <div>
          <input type="text" placeholder="(必填项)" v-model="applyFrom.text" @keyup.enter="sendApply">
          <el-button type="primary" size="small" @click="sendApply">立即提交</el-button>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
  import validate from '@/utils/validate';
  import {
    chatListCrateServ
  } from '@/api/chat';

  import {
    searchUserServ,
    friendRemarkEditServ,
    friendApplyServ
  } from '@/api/user';

  import {
    packTalkItem
  } from '@/utils/functions';

  export default {
    name: 'user-business-card',
    data() {
      return {
        isShow: false,

        // 用户ID
        user_id: 0,

        //用户相关信息
        userInfo: {
          mobile: '',
          nickname: '',
          avatar: '',
          motto: '',
          friendStatus: 0,
          friendApply: 0,
          nicknameRemark: '',
          imgbag: '/static/image/default-user-banner.png',
          gender: 0, //(0:未知 1:男 2:女 默认0)
        },

        //好友备注表单
        editRemark: {
          isShow: false,
          text: ''
        },

        //好友申请表单
        applyFrom: {
          isShow: false,
          text: ''
        },
      };
    },
    methods: {
      // 显示窗口
      open(user_id) {
        this.isShow = true;
        this.user_id = user_id;
        this.findUserDetail();
      },

      // 关闭窗口
      close() {
        this.isShow = false;
      },

      // 手机号格式化
      mobile(mobile) {
        return mobile.substr(0, 3) + ' ' + mobile.substr(3, 4) + ' ' + mobile.substr(7, 4);
      },

      // 点击编辑备注信息
      clickEditRemark() {
        this.editRemark.isShow = true;
        this.editRemark.text = this.userInfo.nicknameRemark;
      },

      // 获取用户信息
      findUserDetail() {
        searchUserServ({
          user_id: this.user_id
        }).then((res) => {
          if (res.code == 200) {
            let data = res.data;
            this.userInfo.user_id = data.id;
            this.userInfo.mobile = data.mobile;
            this.userInfo.nickname = data.nickname;
            this.userInfo.nicknameRemark = data.nickname_remark;
            this.userInfo.motto = data.motto;
            this.userInfo.avatar = data.avatar;
            this.userInfo.friendStatus = data.friend_status;
            this.userInfo.friendApply = data.friend_apply;
            this.userInfo.gender = data.gender;
          }
        });
      },

      // 发送添加好友申请
      sendApply() {
        if (this.applyFrom.text == '') return;
        friendApplyServ({
          friend_id: this.userInfo.user_id,
          remarks: this.applyFrom.text
        }).then((res) => {
          if (res.code == 200) {
            this.applyFrom.isShow = false;
            this.applyFrom.text = '';
            this.userInfo.friendApply = 1;
          } else {
            alert('发送好友申请失败,请稍后再试...');
          }
        });
      },

      // 编辑好友备注信息
      editRemarkSubmit() {
        let data = {
          friend_id: this.userInfo.user_id,
          remarks: this.editRemark.text
        };

        if (data.remarks == this.userInfo.nicknameRemark) {
          this.editRemark.isShow = false;
          return;
        }

        friendRemarkEditServ(data).then(res => {
          if (res.code == 200) {
            this.editRemark.isShow = false;
            this.userInfo.nicknameRemark = data.remarks;
            this.$emit('changeRemark', data)
          }
        })
      },

      // 隐藏申请表单
      closeApplyFrom() {
        this.applyFrom.isShow = false;
      },

      // 发送好友消息
      sendMessage() {
        let userInfo = this.userInfo;
        chatListCrateServ({
          type: 1,
          receive_id: this.user_id
        }).then(res => {
          if (res.code !== 200) return;

          this.$root.dumpTalkPage(`1_${userInfo.user_id}`);
        });
      }
    }
  }

</script>

<style scoped>
  .container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    width: 350px;
    height: 600px;
    overflow: hidden;
  }

  .container .header {
    position: relative;
  }

  .container .header .close-icon {
    position: absolute;
    right: 5px;
    top: 5px;
    color: white;
    cursor: pointer;
    transition: all 1s;
    z-index: 1;
  }

  .container .header .img-banner {
    width: 100%;
    height: 100%;
    background-image: url(/static/image/default-user-banner.png);
    background-size: 100%;
    transition: all .2s linear;
    cursor: pointer;
    overflow: hidden;
  }

  .container .header .img-banner img:hover {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
    -webkit-filter: contrast(130%);
    filter: contrast(130%)
  }

  .user-header {
    width: 100%;
    height: 80px;
    position: absolute;
    bottom: -40px;
    display: flex;
    flex-direction: row;
  }

  .user-header .avatar {
    width: 100px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
  }

  .user-header .avatar .avatar-box {
    width: 80px;
    height: 80px;
    background-color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .user-header .avatar .avatar-box img {
    height: 70px;
    width: 70px;
    border-radius: 50%;
  }

  .user-header .nickname {
    flex: auto;
    padding-top: 50px;
    font-size: 16px;
    font-weight: 400;
  }

  .container .main {
    background-color: white;
    padding: 45px 16px 0;
  }

  .container .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #f5eeee;
  }

  .container .footer button {
    width: 80%;
  }

  .user-sign {
    min-height: 26px;
    border-radius: 5px;
    padding: 5px;
    line-height: 25px;
    background: #f3f5f7;
    color: #7d7d7d;
    font-size: 12px;
    margin-bottom: 20px;
    position: relative;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    position: relative;
  }

  .user-sign .sign-arrow {
    position: absolute;
    width: 0;
    height: 0;
    font-size: 0;
    border: 5px solid hsla(0, 0%, 96.9%, 0);
    border-bottom-color: #f3f5f7;
    left: 28px;
    top: -9px;
  }

  .card-rows .card-row {
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    position: relative;
    cursor: pointer;
    color: #736f6f;
  }

  .card-rows .card-row label {
    margin-right: 25px;
    color: #cbc5c5;
  }

  .card-rows .card-row .friend-remark {
    border-bottom: 1px dashed #bec3d0;
    padding-bottom: 2px;
    color: #736f6f;
    width: 60%;
    padding-right: 5px;
  }

  .card-rows .card-row .im-copy-icon:active {
    color: indianred;
  }

  /* 好友申请表单 */
  .friend-from {
    position: absolute;
    background: #fbf6f6;
    height: 80px;
    z-index: 2;
    width: 100%;
    bottom: -80px;
    left: 0;
    transition: all 0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    -webkit-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
  }

  .friend-from-show {
    bottom: 0;
  }

  .friend-from p {
    height: 20px;
    line-height: 20px;
    padding: 7px 5px 5px 15px;
    font-size: 13px;
  }

  .friend-from p span:nth-child(2) {
    float: right;
    margin-right: 13px;
    color: #32caff;
    cursor: pointer;
  }

  .friend-from div {
    height: 31px;
    line-height: 20px;
    padding: 7px 5px 5px 15px;
    font-size: 13px;
  }

  .friend-from input {
    height: 30px;
    line-height: 30px;
    width: 230px;
    border-radius: 3px;
    padding: 0 5px;
  }

</style>
