<template id="wxFixed">
  <div class="fixed" v-if="closeNone">
    <div class="wx-main">
      <div class="wx-box">
        <span class="close iconfont icon-guanbi11" @click="closeBOX"></span>
        <van-tabs v-model="active">
          <van-tab title="注册新用户">
            <div class="headerTab">
              <div class="tabList"><span>用户名</span><input type="text" placeholder="请输入您的用户名"></div>
              <div class="tabList"><span>密码</span><input type="text" placeholder="4-16个字符,区分大小写"></div>
              <div class="tabList"><span>确认密码</span><input type="text" placeholder="请重复您的密码"></div>
              <button class="userRegister">注册</button>
            </div>
          </van-tab>
          <van-tab title="用户登录">
            <div class="headerTab">
              <div class="tabList"><span>用户名</span><input type="text" placeholder="请输入您的用户名"></div>
              <div class="tabList"><span>密码</span><input type="text" placeholder="请输入您的密码"></div>
              <button class="userRegister">登录</button>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "wxFixed",
    data() {
      return {
        active: 0,
        closeNone: true
      };
    },
    methods: {
      closeBOX: function() {
        this.closeNone = false
      }
    }
  };
</script>

<style scoped>
  .fixed {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    background: rgba(0, 0, 0, 0.7);
  }

  .wx-main {
    width: 400px;
    height: 400px;
    margin: auto;
    position: absolute;
    background-color: rgba(255, 255, 255);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 5px;
    opacity: 1;
  }

  .wx-box {
    width: 100%;
    position: relative;

  }

 .van-tabs__nav{
    border-radius: 5px 5px 0 0;
  }

  .wx-box .close {
    position: absolute;
    top: -50px;
    right: -60px;
    width: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 50px;
    color: #fff;
  }

  .header li {
    width: 50%;
    line-height: 50px;
    text-align: center;
    float: left;
  }

  .headerTab {
    width: 80%;
    margin: 0px auto;
    margin-top: 60px;

  }

  .headerTab .tabList {
    margin: 20px 0;
  }

  .headerTab .tabList>span {
    width: 75px;
    text-align: right;
    display: inline-block;
    font-size: 15px;
  }

  .headerTab .tabList>input {
    min-width: 200px;
    margin-left: 20px;
    font-size: 13px;
    border: 1px solid #f1f1f1;
    line-height: 30px;
    padding-left: 10px;
    border-radius: 3px;
  }

  .headerTab .userRegister {
    width: 270px;
    text-align: center;
    line-height: 40px;
    background-color: #F56723;
    color: #fff;
    margin: 0 auto;
    margin-top: 50px;
    display: block;
  }
</style>
