<template>
  <!-- 用户个人信息设置组件 -->
  <div id="user-setup-mask">
    <div class="usersetup-from-panel">
      <div class="panel-header">
        <p><img :src="userInfo.avatarurl" :onerror="$store.state.user.detaultAvatar"></p>
        <p class="edit-pic" @click="isAvatarCropper = true">＋ 更换头像</p>
        <i class="iconfont icon-guanbi close-btn" @click="$store.commit('showUserSetupBox',false)"></i>
      </div>

      <div class="panel-body">
        <ul>
          <li>
            <label>账号</label>
            <input type="text" placeholder="请设置新的登录密码" v-model="userInfo.mobile" readonly>
          </li>
          <li>
            <label>昵称</label>
            <input type="text" placeholder="请设置账户昵称" v-model="userInfo.nickname" @keyup.enter="editUserDetail">
          </li>
          <li>
            <label>座右铭</label>
            <input type="text" placeholder="请设置座右铭" v-model="userInfo.motto" @keyup.enter="editUserDetail">
          </li>
        </ul>
      </div>

      <div class="panel-footer">
        <button class="pwd-from-submit" @click="editUserDetail">{{buttonText}}</button>
      </div>

    </div>

    <lumen-avatar-cropper v-if="isAvatarCropper" v-on:close="closeAvatarCropper"></lumen-avatar-cropper>
  </div>
</template>

<script>
  import LumenAvatarCropper from '@/components/layout/LumenAvatarCropper'
  import {
    editUserSetupApi,
    getUserDetailApi
  } from '@/services/api'
  export default {
    data() {
      return {
        isAvatarCropper: false,
        userInfo: {
          mobile: '',
          nickname: '',
          avatarurl: '',
          motto: ''
        },
        buttonText: '保存设置'
      }
    },
    components: {
      LumenAvatarCropper
    },
    created() {
      this.getUserDetail();
    },
    methods: {
      editUserDetail() {
        let that = this;
        editUserSetupApi({
          nickname: that.userInfo.nickname,
          avatarurl: that.userInfo.avatarurl,
          motto: that.userInfo.motto,
        }).then((res) => {
          if (res.code == 200) {
            that.buttonText = '设置成功...';
            that.$store.dispatch('setAvatar', that.userInfo.avatarurl);
          } else {
            that.buttonText = '设置失败,请稍后再试...';
          }

          setTimeout(function() {
            that.buttonText = '保存设置';
          }, 3000);
        }).catch((res) => {
          alert('信息设置失败，请稍后再试...');
        });
      },
      getUserDetail() {
        let that = this;
        getUserDetailApi().then((res) => {
          if (res.code == 200) {
            that.userInfo.mobile = res.data.mobile;
            that.userInfo.nickname = res.data.nickname;
            that.userInfo.avatarurl = res.data.avatarurl;
            that.userInfo.motto = res.data.motto;
          }
        });
      },
      closeAvatarCropper(type, avatar = '') {
        this.isAvatarCropper = false;
        if (type == 1 && avatar != '') {
          this.userInfo.avatarurl = avatar;
        }
      },
    }
  }
</script>

<style scoped>
  #user-setup-mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }


  .usersetup-from-panel {
    width: 355px;
    height: 550px;
    background: #FFFFFF;
    margin: auto auto;
    margin-top: calc((100vh - 550px) / 2);
    margin-top: -moz-calc((100vh - 550px) / 2);
    margin-top: -webkit-calc((100vh - 550px) / 2);
  }


  .usersetup-from-panel .panel-header {
    height: 165px;
    width: 100%;
    background: #6bc5e8;
    color: #fff;
    position: relative;
    background: url(/static/image/banner-bag.jpg);
    background-color: #29befd;
    background-size: 100% 100%;
  }

  .usersetup-from-panel .panel-header .close-btn {
    position: absolute;
    right: -30px;
    top: 0px;
    font-size: 20px;
    cursor: pointer;
  }

  .usersetup-from-panel .panel-header p {
    width: 80px;
    height: 80px;
    position: absolute;
    left: 132px;
    top: 46px;
  }

  .usersetup-from-panel .panel-header .edit-pic {
    width: 70px;
    height: 20px;
    position: absolute;
    left: 137px;
    top: 137px;
    text-align: center;
    line-height: 20px;
    cursor: pointer;
    font-size: 11px;
    color: #ffffff;
    background: #2ac1fe;
    border-radius: 2px;
  }

  .usersetup-from-panel .panel-header p img {
    width: 80px;
    height: 80px;
    border-radius: 50% 50%;
    cursor: pointer;
  }

  .usersetup-from-panel .panel-body {
    height: calc(100% - 210px);
    width: 100%;
  }

  .panel-body ul {
    padding: 20px 10px 5px 10px;
  }

  .panel-body ul li {
    height: 50px;
    width: 100%;
    text-align: center;
  }


  .pwd-tips {
    padding-left: 115px;
    font-size: 12px;
    color: #878686;
  }


  .panel-body ul li label {
    height: 45px;
    line-height: 47px;
    width: 55px;
    display: inline-block;
    text-align: right;
    color: #2dcee9;
    padding-right: 3px;
    font-size: 13px;
  }

  .panel-body ul li:nth-child(1) label i,
  .panel-body ul li:nth-child(3) label i {
    font-size: 14px;
  }

  .panel-body ul li:nth-child(2) label i {
    font-size: 16px;
  }

  .panel-body ul li input {
    height: 25px;
    width: 240px;
    border-bottom: 1px dashed #f1e9e9;
    text-indent: 3px;
    color: #a9a4a4;
    font-size: 12px;
  }


  input::-webkit-input-placeholder {
    color: #a9a4a4;
    font-size: 12px;
  }


  .error-tips {
    padding-left: 135px;
    color: #ff8383;
  }

  .usersetup-from-panel .panel-footer {
    height: 45px;
    width: 100%;
    border-top: 1px solid #f2f2f2;
    text-align: center;
  }

  .pwd-from-submit {
    width: 193px;
    height: 31px;
    background: #9ff5fe;
    margin: 7px auto;
    cursor: pointer;
    color: #fff;
    border-radius: 1px;
  }
</style>
