<template>
  <div>
    <div class="user-card animated fadeIn">
      <div class="card-header">
        <img :src="userCard.imgbag" class="no-select" />
        <div class="user-avatar no-select">
          <img :src="userCard.avatar" :onerror="$store.state.user.detaultAvatar" />
        </div>
        <div class="user-nickname">
          <i class="iconfont icon-qianming"></i>
          <span v-text="userCard.nickname"></span>
        </div>
      </div>
      <div class="card-main">
        <div class="usersign">
          <div class="usersign-arrow"></div>
          <span v-if="userCard.signature"><span style="font-weight: 600;">个性签名</span> ： {{userCard.signature}}</span>
          <span v-else>
            <i class="iconfont icon-bianji"></i>
            <span>编辑个签，展示我的独特态度。</span>
          </span>
        </div>
        <div class="count no-select">
          <div>
            <span>好友</span>
            <span>({{userCard.friends_num}})</span>
          </div>
          <span style="color: #f1efef;">|</span>
          <div>
            <span>群组</span>
            <span>({{userCard.groups_num}})</span>
          </div>
          <span style="color: #f1efef;">|</span>
          <div>
            <span>笔记</span>
            <span>({{userCard.note_num}})</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    findUserDetailServ,
  } from "@/api/user";
  export default {
    name: "uesr-card",
    data() {
      return {
        userCard: {
          nickname: this.$store.state.user.nickname,
          signature: "",
          avatar: this.$store.state.user.avatar,
          imgbag: "/static/image/default-user-banner.png",
          sex: 1, //(0:未知 1:男 2:女 默认0)
          friends_num: 0,
          groups_num: 0,
          note_num: 0
        },
      };
    },
    mounted() {
      this.getUserDetail();
    },
    methods: {
      getUserDetail() {
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
      }
    }
  };

</script>
<style scoped="scoped">
  .user-card {
    width: 320px;
    min-height: 370px;
    background: #ffffff;
    box-shadow: -1px 1px 9px 0px #e6e3e3;
    padding-bottom: 10px;
  }

  .user-card .card-header {
    height: 230px;
    overflow: hidden;
  }

  .user-card .card-header img {
    width: 100%;
    height: 180px;
    -webkit-transition: all 0.2s linear;
    transition: all 0.2s linear;
  }

  .user-card .card-header>img:hover {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
    -webkit-filter: contrast(130%);
    filter: contrast(130%);
  }

  .user-card .card-header .user-avatar {
    height: 70px;
    width: 70px;
    border: 5px solid #fff;
    background-color: #fff;
    border-radius: 50%;
    position: relative;
    top: -35px;
    margin-left: 15px;
  }

  .user-card .card-header .user-avatar img {
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

  .user-card .card-main {
    margin-top: 10px;
    min-height: 130px;
    text-align: left;
    padding: 0 16px;
  }

  .user-card .card-main .usersign {
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

  .user-card .card-main .usersign .icon-bianji {
    margin-left: 10px;
  }

  .user-card .card-main .usersign .usersign-arrow {
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

  .user-card .card-main .count {
    height: 38px;
    border-radius: 5px;
    box-shadow: 0 0 5px #f1eded;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .user-card .card-main .count div {
    font-size: 13px;
  }

</style>
