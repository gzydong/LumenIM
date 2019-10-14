<template id="wxFixed">
  <div class="fixed">
    <div class="wx-main">
      <div class="box-left"></div>
      <div class="box-right">
        <div class="logo-box">IM 聊天室</div>
        <div class="boxRight-header">
          <span
            v-for="(item,index) in arr"
            @click="clickHead(item.id)"
            :class="headType==index?'activeBoder':''"
          >{{ item.name }}</span>
        </div>

        <div class="headerTab" v-if="headType==0">
          <div class="tabList">
            <input type="text" placeholder="请输入您的手机号" ref="logphone"  maxlength="11" v-model="logphone"  @input="change(logphone)" />
          </div>
          <div class="tabList">
            <input type="password" placeholder="请输入您的密码" ref="logpwd" v-model="logpwd" />
          </div>
          <button class="userRegister" @click="login">登录</button>
        </div>

        <div class="headerTab" v-else>
          <div class="tabList">
            <input type="text" placeholder="请输入您的手机号" ref="mobile" maxlength="11" />
          </div>
          <div class="tabList">
            <input type="password" placeholder="4-16个字符,区分大小写" ref="pwd" maxlength="20" />
          </div>
          <div class="tabList">
            <input type="password" placeholder="请重复您的密码" ref="pwd1" maxlength="20" />
          </div>
          <button class="userRegister" @click="register">注册</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped >
  @import url("../../static/css/login.css");
</style>
<script src="../../static/js/login.js" ></script>
