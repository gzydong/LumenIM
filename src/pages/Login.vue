<template id="loginPage">
  <div class="fixed">
    <div class="wx-main">
      <div class="box-left"></div>
      <div class="box-right">
        <div class="logo-box">Lumen IM</div>
        <div class="boxRight-header">
            <span  @click="changingOver(0)" :class="activate==0?'activeBoder':''">我要登录</span>
            <span  @click="changingOver(1)" :class="activate==1?'activeBoder':''">用户注册</span>
        </div>

        <!-- 登录 -->
        <div class="headerTab" v-if="activate==0">
          <div class="tabList">
            <input type="text" placeholder="请输入您的手机号"  maxlength="11" v-model="username" @keyup.enter="login" />
          </div>
          <div class="tabList">
            <input type="password" placeholder="请输入您的密码"  v-model="password" @keyup.enter="login"   />
          </div>
          <button class="userRegister" @click="login">{{loginButton}}</button>
        </div>

        <!-- 注册 -->
        <div class="headerTab" v-else>
          <div class="tabList">
            <input type="text" placeholder="请输入您的手机号" v-model="mobile" maxlength="11" />
          </div>
          <div class="tabList">
            <input type="password" placeholder="4-16个字符,区分大小写" v-model="regPassword" maxlength="20" @keyup.enter="register"  />
          </div>
          <div class="tabList">
            <input type="password" placeholder="请重复您的密码" v-model="regPassword2" maxlength="20" @keyup.enter="register" />
          </div>
          <button class="userRegister" @click="register">{{registerButton}}</button>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
  @import url("../../static/css/login.css");
</style>
<script src="../../static/js/login.js"></script>
