<script setup>
import { useUserStore } from '@/store/user'

const store = useUserStore()
</script>

<template>
  <section class="account-card">
    <div class="card-header">
      <img :src="store.banner" />

      <div class="user-avatar">
        <img :src="store.avatar" />
      </div>

      <div class="user-nickname">
        <span>{{ store.nickname }}</span>
      </div>
    </div>

    <div class="card-main">
      <div class="usersign pointer">
        <div class="arrow"></div>
        <template v-if="store.motto">
          <span style="font-weight: 600">个性签名</span>
          <span>：{{ store.motto }}</span>
        </template>
        <template v-else>
          <span> 编辑个签，展示我的独特态度。</span>
        </template>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
.account-card {
  width: 320px;
  min-height: 300px;
  background: #ffffff;
  padding-bottom: 20px;

  .card-header {
    height: 230px;
    overflow: hidden;

    img {
      width: 100%;
      height: 180px;
      -webkit-transition: all 0.2s linear;
      transition: all 0.2s linear;

      &:hover {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
        -webkit-filter: contrast(130%);
        filter: contrast(130%);
      }
    }

    .user-avatar {
      height: 70px;
      width: 70px;
      border: 5px solid #fff;
      background-color: #fff;
      border-radius: 50%;
      position: relative;
      top: -35px;
      margin-left: 15px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        cursor: pointer;
      }
    }

    .user-nickname {
      position: relative;
      top: -72px;
      text-align: left;
      margin-left: 105px;
      margin-right: 5px;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      span {
        font-size: 16px;
        font-weight: 400;
        margin-left: 8px;
      }
    }
  }
}

.account-card .card-main {
  margin-top: 10px;
  min-height: 50px;
  text-align: left;
  padding: 0 16px;

  .usersign {
    min-height: 26px;
    border-radius: 5px;
    padding: 8px;
    line-height: 25px;
    background: #f3f5f7;
    color: #7d7d7d;
    font-size: 12px;
    margin-bottom: 20px;
    position: relative;

    .arrow {
      position: absolute;
      width: 0;
      height: 0;
      font-size: 0;
      border: solid 5px;
      top: 5px;
      border-color: rgba(247, 247, 247, 0) rgba(247, 247, 247, 0) #f3f5f7
        rgba(247, 247, 247, 0);
      top: -10px;
      left: 31px;
    }
  }
}
</style>
