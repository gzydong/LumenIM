<template>
  <div>
    <div class="im-user-card animated fadeIn">
      <div class="card-header">
        <img :src="userCard.imgbag" alt="个性背景..." />
        <div class="user-avatar">
          <img :src="userCard.avatar" :onerror="$store.state.user.detaultAvatar" />
        </div>
        <div class="user-nickname">
          <i class="iconfont icon-qianming"></i>
          <span v-text="userCard.nickname"></span>
          <i v-show="userCard.sex == 1" class="iconfont icon-nan"></i>
          <i v-show="userCard.sex == 2" class="iconfont icon-nv"></i>
        </div>
      </div>
      <div class="card-body">
        <div class="user-sign">
          <div class="user-sign-arrow"></div>
          <span v-if="userCard.signature"><span style="font-weight: 500;">个性签名</span> ： {{userCard.signature}}</span>
          <span v-else>
            <i class="iconfont icon-bianji"></i>
            <span>编辑个签，展示我的独特态度。</span>
          </span>
        </div>
        <div class="count">
          <div>
            <span>好友</span>
            <span>({{userCard.friends_num}})</span>
          </div>
          <div>
            <span>群组</span>
            <span>({{userCard.groups_num}})</span>
          </div>
          <div>
            <span>笔记</span>
            <span>({{userCard.note_num}})</span>
          </div>
        </div>

        <div class="card-rows">
          <div class="card-row" @click="userSetup = true">
            <span>编辑资料</span>
            <i class="iconfont icon-jiantou1"></i>
          </div>
          <div class="card-row" @click="changePassword">
            <span>修改密码</span>
            <i class="iconfont icon-jiantou1"></i>
          </div>
          <div class="card-row" @click="setupMobile">
            <span>更换手机</span>
            <i class="iconfont icon-jiantou1"></i>
          </div>
          <div class="card-row" @click="setup">
            <span>个人设置</span>
            <i class="iconfont icon-jiantou1"></i>
          </div>
          <div class="card-row" @click="logout">
            <span>退出登录</span>
            <i class="iconfont icon-jiantou1"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改密码组件 -->
    <change-password ref="changePasswrodRef" />

    <!-- 修改手机号组件 -->
    <change-mobile ref="changeMobileRef" />

    <!-- 用户信息设置组件 -->
    <user-setup v-if="userSetup" @close="userSetup = false" />
  </div>
</template>

<script>
  //修改密码组件
  import ChangePassword from "@/components/user/ChangePassword";
  import ChangeMobile from "@/components/user/ChangeMobile";
  import UserSetup from "@/components/user/UserSetup";
  import {
    findUserDetailServ
  } from "@/api/user";

  export default {
    name: "uesr-card",
    components: {
      ChangePassword,
      UserSetup,
      ChangeMobile
    },
    data() {
      return {
        userCard: {
          nickname: this.$store.state.user.nickname,
          signature: "",
          avatar: this.$store.state.user.avatar,
          imgbag: "static/image/default-user-banner.png",
          sex: 1, //(0:未知 1:男 2:女 默认0)
          friends_num: 0,
          groups_num: 0,
          note_num: 0
        },

        userSetup: false,
      };
    },
    mounted() {
      this.user();
    },
    methods: {
      logout() {
        this.$store.dispatch("logout", this.$router);
      },
      user() {
        findUserDetailServ().then(res => {
          if (res.code == 200) {
            this.userCard.avatar = res.data.avatar;
            this.userCard.nickname = res.data.nickname;
            this.userCard.signature = res.data.motto;
            this.userCard.sex = res.data.gender;
            this.userCard.friends_num = res.data.count.friends_num;
            this.userCard.groups_num = res.data.count.groups_num;
            this.userCard.note_num = res.data.count.note_num;
          }
        });
      },
      setup() {
        alert('个人设置功能暂未开放，请耐心等待...')
      },
      changePassword() {
        this.$refs.changePasswrodRef.open();
      },
      setupMobile() {
        this.$refs.changeMobileRef.open();
      }
    }
  };

</script>


<style scoped="scoped">
  .icon-nan {
    color: rgb(0, 145, 255);
  }

  .icon-nv {
    color: rgb(255, 77, 148);
  }

  .icon-qianming {
    color: #007cff;
  }

  .user-sign .icon-bianji {
    margin-left: 10px;
  }

  .im-user-card {
    width: 320px;
    min-height: 400px;
    background: #ffffff;
    box-shadow: -1px 1px 9px 0px #e6e3e3;
    padding-bottom: 10px;
  }

  .im-user-card .card-header {
    height: 230px;
    overflow: hidden;
  }

  .im-user-card .card-header img {
    width: 100%;
    height: 180px;
    -webkit-transition: all 0.2s linear;
    transition: all 0.2s linear;
  }

  .im-user-card .card-header>img:hover {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
    -webkit-filter: contrast(130%);
    filter: contrast(130%);
  }

  .im-user-card .card-header .user-avatar {
    height: 70px;
    width: 70px;
    border: 5px solid #fff;
    background-color: #fff;
    border-radius: 50%;
    position: relative;
    top: -35px;
    margin-left: 15px;
  }

  .im-user-card .card-header .user-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    cursor: pointer;
  }

  .card-header .user-nickname {
    position: relative;
    top: -72px;
    text-align: left;
    margin-left: 105px;
    margin-right: 5px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card-header .user-nickname span {
    font-size: 16px;
    font-weight: 400;
  }

  .im-user-card .card-body {
    margin-top: 10px;
    min-height: 130px;
    text-align: left;
    padding: 0 16px;
  }

  .im-user-card .card-body .user-sign {
    min-height: 26px;
    border-radius: 5px;
    padding: 5px;
    line-height: 25px;
    background: #f3f5f7;
    color: #7d7d7d;
    font-size: 12px;
    margin-bottom: 20px;
    position: relative;
  }

  .im-user-card .card-body .user-sign .user-sign-arrow {
    position: absolute;
    width: 0;
    height: 0;
    font-size: 0;
    border: solid 5px;
    top: 5px;
    border-color: rgba(247, 247, 247, 0) rgba(247, 247, 247, 0) #f3f5f7 rgba(247, 247, 247, 0);
    top: -10px;
    left: 31px;
  }

  .im-user-card .card-body .count {
    height: 38px;
    border-radius: 5px;
    box-shadow: 0 0 5px #f1eded;
    display: flex;
    line-height: 38px;
  }

  .im-user-card .card-body .count div {
    width: 33.3%;
    text-align: center;
    font-size: 12px;
  }

  .im-user-card .card-body .card-rows {
    margin-top: 30px;
  }

  .im-user-card .card-body .card-row {
    height: 35px;
    line-height: 35px;
    font-size: 13px;
    border-bottom: 1px solid #f5f0f0;
    position: relative;
    cursor: pointer;
    color: #736f6f;
    padding-left: 5px;
  }

  .im-user-card .card-body .card-row:hover {
    background: #fcfcfc;
    border-bottom-color: #fcfcfc;
  }

  .im-user-card .card-body .card-row i {
    position: absolute;
    right: 3px;
  }

</style>
