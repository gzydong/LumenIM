<template>
  <div>
    <el-container id="auth-container">
      <el-main style="position: relative;">
        <div id="logo-name" class="animated slideInLeft">{{$store.state.website_name}}</div>
        <div id="login-box">
          <div class="header">
            快捷登录
          </div>
          <div class="main" style="width: 100%;">
            <el-form ref="form" :model="form" :rules="rules">
              <el-form-item prop="username">
                <el-input v-model="form.username" placeholder="手机号" class="cuborder-radius" maxlength="11"
                  @keyup.enter.native="onSubmit('form')"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="form.password" type="password" placeholder="密码" class="cuborder-radius"
                  @keyup.enter.native="onSubmit('form')"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit('form')" class="submit-btn" :loading="loginLoading">立即登录
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-link type="primary" @click="toLink('/forget')" :underline="false"
                  style="float: left;font-weight: 400;">找回密码</el-link>
                <el-link type="primary" @click="toLink('/register')" :underline="false"
                  style="float: right;font-weight: 400;">还没有账号？立即注册</el-link>
              </el-form-item>

              <p style="margin-top: 50px;">
                <el-divider>
                  <span style="color: rgb(181, 176, 176);font-weight: 200;">
                    <i class="el-icon-mobile-phone"></i> 预览账号</span>
                </el-divider>
              </p>
              <el-form-item class="preview-account">
                <p>预览账号:18798272054 / 密码: admin123</p>
                <p>预览账号:18798272055 / 密码: admin123</p>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="copyright" v-html="$store.state.copyright"></div>
      </el-main>
      <el-aside width="500px" class="login-broadside">
        <p class="describe">{{$store.state.website_name}} 是一款使用vue开发的聊天项目，功能点包含单聊、群聊,
          消息类型包含文字、图片、文件、自定义表情包及代码块。新增编辑笔记及笔记分享好友功能 ...</p>
      </el-aside>
    </el-container>
  </div>
</template>

<style scoped src="@static/css/page/login-auth.css"></style>
<script>
  import {
    loginServ
  } from "@/api/user";

  import validate from "@/utils/validate";

  export default {
    name: "new-login-page",
    data() {
      var validateMobile = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('登录手机号不能为空！'));
        } else {
          if (!validate.validatPhone(value)) {
            callback(new Error('登录手机号格式不正确！'));
          } else {
            callback();
          }
        }
      };

      return {
        loginLoading: false,
        form: {
          username: '',
          password: '',
        },
        rules: {
          username: [{
              validator: validateMobile,
              trigger: 'blur'
            },
            {
              min: 11,
              max: 11,
              message: '手机号格式不正确!',
              trigger: 'blur'
            }
          ],
          password: [{
            required: true,
            message: '登录密码不能为空!',
            trigger: 'blur'
          }]
        }
      };
    },
    methods: {
      onSubmit(formName) {
        if (this.loginLoading) {
          return false;
        }

        this.$refs[formName].validate((valid) => {
          if (!valid) return false;
          this.loginLoading = true;
          this.login();
        });
      },

      login() {
        loginServ({
          mobile: this.form.username,
          password: this.form.password
        }).then(res => {
          this.loginLoading = false;
          if (res.code == 200) {
            this.$store.dispatch("ACT_USER_LOGIN", {
              authInfo: {
                access_token: res.data.access_token,
                expires_in: res.data.expires_in
              },
              userInfo: res.data.userInfo
            });

            this.$root.loadWebsocket();
            this.$router.push({
              path: "/"
            });
          } else {
            this.$notify({
              title: '登录提示',
              message: '登录密码不正确或账号不存在...'
            });
          }
        }).catch(err => {
          this.loginLoading = false;
        });
      },

      toLink(url) {
        this.$router.push({
          path: url
        });
      }
    }
  };

</script>
