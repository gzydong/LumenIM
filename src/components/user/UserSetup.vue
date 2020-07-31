<template>
  <div class="base-mask animated fadeIn">
    <div class="container" v-outside="close">
      <div class="header">
        <div class="user-avatar">
          <img :src="userInfo.avatar" @click="isAvatarCropper = true" :onerror="$store.state.user.detaultAvatar">
          <div @click="isAvatarCropper = true"><i class="iconfont icon-xiangji"></i></div>
        </div>
        <p class="edit-pic">更换封面</p>
        <i class="iconfont icon-guanbi close-btn" @click="$emit('close')"></i>
      </div>

      <div class="main">
        <ul>
          <li>
            <label>手机</label>
            <input type="text" v-model="userInfo.mobile" disabled>
          </li>
          <li>
            <label>昵称</label>
            <input type="text" placeholder="请设置个人昵称" v-model="userInfo.nickname" @keyup.enter="editUserDetail">
          </li>
          <li>
            <label>邮箱</label>
            <input type="text" placeholder="请设置个人邮箱" v-model="userInfo.email" @keyup.enter="editUserDetail">
          </li>
          <li>
            <label>性别</label>
            <div class="select-gender">
              <span :class="{'active-icon-nan':userInfo.gender == 1}" @click="clickGender(1)"><i
                  class="iconfont icon-nan"></i>男</span>
              <span :class="{'active-icon-nv':userInfo.gender == 2}" @click="clickGender(2)"><i
                  class="iconfont icon-nv"></i>女</span>
            </div>
          </li>
          <li>
            <label style="vertical-align: top;">签名</label>
            <textarea v-model="userInfo.motto" placeholder="请设置我的个性签名"></textarea>
          </li>
        </ul>
      </div>

      <div class="footer">
        <button class="from-submit" @click="editUserDetail">{{buttonText}}</button>
      </div>
    </div>

    <avatar-cropper v-if="isAvatarCropper" v-on:close="closeAvatarCropper" />
  </div>
</template>

<script>
  import AvatarCropper from '@/components/layout/AvatarCropper'
  import {
    editUserSetupServ,
    findUserDetailServ
  } from '@/api/user';

  export default {
    name: 'user-setup',
    components: {
      AvatarCropper
    },
    data() {
      return {
        isAvatarCropper: false,
        userInfo: {
          mobile: '',
          nickname: '',
          avatar: '',
          motto: '',
          email: '',
          gender: 0
        },
        buttonText: '修改信息'
      }
    },
    created() {
      this.getUserDetail();
    },
    methods: {
      editUserDetail() {
        let that = this;
        editUserSetupServ({
          nickname: that.userInfo.nickname,
          avatar: that.userInfo.avatar,
          motto: that.userInfo.motto,
          email: that.userInfo.email,
          gender: that.userInfo.gender
        }).then((res) => {
          if (res.code == 200) {
            that.buttonText = '修改完成';
            that.$store.dispatch('dispatch("ACT_USER_UPDATE_AVATAR"', that.userInfo.avatar);
          } else {
            that.buttonText = '修改失败,请稍后再试 ...';
          }

          setTimeout(function () {
            that.buttonText = '修改信息';
          }, 3000);
        }).catch((res) => {
          that.buttonText = '修改失败,请稍后再试 ...';
        })
      },
      getUserDetail() {
        findUserDetailServ().then((res) => {
          if (res.code == 200) {
            this.userInfo.mobile = res.data.mobile;
            this.userInfo.nickname = res.data.nickname;
            this.userInfo.avatar = res.data.avatar;
            this.userInfo.motto = res.data.motto;
            this.userInfo.email = res.data.email;
            this.userInfo.gender = res.data.gender;
          }
        });
      },
      closeAvatarCropper(type, avatar = '') {
        this.isAvatarCropper = false;
        if (type == 1 && avatar != '') {
          this.userInfo.avatar = avatar;
        }
      },
      clickGender(gender) {
        this.userInfo.gender = gender;
      },
      close() {
        this.$emit('close');
      }
    }
  }

</script>

<style scoped>
  .container {
    position: absolute;
    left: 0;
    right: 0;
    top: 0px;
    bottom: 0;
    margin: auto;

    width: 330px;
    height: 550px;
    background: #FFFFFF;
  }


  .container .header {
    height: 165px;
    width: 100%;
    color: #fff;
    position: relative;
    background: url(/static/image/default-user-banner.png);
    background-color: #29befd;
    background-size: 100% 100%;
  }

  .container .header .close-btn {
    position: absolute;
    right: 6px;
    font-size: 15px;
    cursor: pointer;
    top: 3px;
  }

  .container .header .user-avatar {
    width: 80px;
    height: 80px;
    position: absolute;
    left: 131px;
    top: 46px;
    border-radius: 50%;
    background: white;
    text-align: center;
    box-shadow: 0px 0px 20px #c5c0c0;
  }

  .user-avatar div {
    position: absolute;
    top: 6px;
    left: 5px;
    width: 70px;
    height: 70px;
    cursor: pointer;
    border-radius: 50%;
    line-height: 70px;
    background-color: rgb(0, 0, 0, .2);
  }

  .user-avatar div:active {
    background-color: rgb(0, 0, 0, .5);
  }

  .user-avatar div i {
    font-size: 30px;
    color: white;
  }

  .container .header .edit-pic {
    width: 50px;
    height: 20px;
    line-height: 20px;
    position: absolute;
    top: 5px;
    left: 5px !important;
    cursor: pointer;
    font-size: 11px;
    color: #ffffff;
    border-radius: 2px;
  }

  .container .header img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    cursor: pointer;
    margin-top: 5px;
  }

  .container .main {
    height: calc(100% - 210px);
    width: 100%;
  }

  .main ul {
    padding: 20px 10px 5px 10px;
  }

  .main ul li {
    min-height: 50px;
    width: 100%;
    text-align: center;
    list-style: none;
  }

  .main ul li label {
    width: 30px;
    text-align: right;
    color: #b5bebf;
    padding-right: 3px;
    font-size: 13px;
  }

  .main ul li input {
    height: 25px;
    width: 230px;
    color: #a9a4a4;
    font-size: 12px;
    background: #fbfbfb;
    padding: 2px 5px;
  }

  .main ul li textarea {
    width: 230px;
    color: #a9a4a4;
    font-size: 12px;
    background: #fbfbfb;
    padding: 2px 5px;
    height: 80px;
    padding-top: 8px;
  }

  input::-webkit-input-placeholder {
    color: #a9a4a4;
    font-size: 12px;
  }

  textarea::-webkit-input-placeholder {
    color: #a9a4a4;
    font-size: 12px;
  }


  .select-gender {
    width: 242px;
    display: inline-block;
    height: 25px;
    text-align: left;
  }

  .select-gender span {
    display: inline-block;
    width: 40px;
    height: 18px;
    border: 1px solid #bbbbbb;
    margin-right: 15px;
    font-size: 12px;
    position: relative;
    cursor: pointer;
    padding-left: 8px;
    color: #bbbbbb;
    border-radius: 3px;
  }

  .select-gender .active-icon-nan {
    border-color: rgb(0, 145, 255);
    color: rgb(0, 145, 255);
  }

  .select-gender .active-icon-nv {
    border-color: rgb(255, 77, 148);
    color: rgb(255, 77, 148);
  }

  .select-gender span i {
    position: absolute;
    top: -2px;
    left: 25px;
  }

  .container .footer {
    height: 45px;
    width: 100%;
    text-align: center;
  }

  .container .footer .from-submit {
    width: 80%;
    height: 30px;
    background: #57b7ff;
    margin: 7px auto;
    cursor: pointer;
    color: #fff;
    border-radius: 3px;
  }

</style>
