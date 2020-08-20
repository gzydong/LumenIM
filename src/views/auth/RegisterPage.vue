<template>
  <div>
    <el-container id="auth-container">
      <el-main style="position: relative;">
        <div id="logo-name" class="animated slideInLeft">{{$store.state.website_name}}</div>
        <div id="login-box">
          <div class="header">
            账号注册
          </div>
          <div class="main" style="width: 100%;">
            <el-form ref="form" :model="form" :rules="rules">
              <el-form-item prop="nickname">
                <el-input v-model="form.nickname" placeholder="用户昵称" class="cuborder-radius" maxlength="11"
                  @keyup.enter.native="onSubmit('form')" />
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="form.password" type="password" placeholder="密码" class="cuborder-radius"
                  @keyup.enter.native="onSubmit('form')" />
              </el-form-item>
              <el-form-item prop="password2">
                <el-input v-model="form.password2" type="password" placeholder="确认密码" class="cuborder-radius"
                  @keyup.enter.native="onSubmit('form')" />
              </el-form-item>
              <el-form-item prop="username">
                <el-input v-model="form.username" placeholder="手机号" class="cuborder-radius" maxlength="11"
                  @keyup.enter.native="onSubmit('form')" />
              </el-form-item>
              <el-form-item prop="sms_code">
                <el-input v-model="form.sms_code" placeholder="验证码(随意填写)" class="cuborder-radius" maxlength="6"
                  @keyup.enter.native="onSubmit('form')" style="width: 205px;" />

                <div class="send-code-btn send-sms-disable" v-if="smsLock">正在发送 ...</div>
                <div class="send-code-btn" v-else-if="smsLock == false && smsLockObj.time == null" @click="sendSms">获取短信
                </div>
                <div class="send-code-btn send-sms-disable" v-else>重新发送({{smsLockObj.time}}s)</div>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit('form')" class="submit-btn" :loading="registerLoading">立即注册
                </el-button>
              </el-form-item>
              <el-form-item>
                <div class="links">
                  <el-link type="primary" @click="toLink('/forget')" :underline="false">找回密码</el-link>
                  <el-link type="primary" @click="toLink('/login')" :underline="false">已有账号，立即登录?</el-link>
                </div>

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
    registerServ,
    sendVerifyCodeServ
  } from "@/api/user";

  import validate from "@/utils/validate";
  import SmsLock from '@/plugins/sms-lock';

  export default {
    name: "new-register-page",
    data() {
      let validateMobile = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('手机号不能为空！'));
        } else {
          if (!validate.validatPhone(value)) {
            callback(new Error('手机号格式不正确！'));
          } else {
            callback();
          }
        }
      };

      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {
        registerLoading: false,
        form: {
          nickname: '',
          username: '',
          password: '',
          password2: '',
          sms_code: ''
        },
        rules: {
          nickname: [{
            required: true,
            message: '用户昵称不能为空!',
            trigger: 'blur'
          }],
          username: [{
            validator: validateMobile,
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '登录密码不能为空!',
            trigger: 'blur'
          }],
          password2: [{
            validator: validatePass2,
            trigger: 'blur'
          }],
          sms_code: [{
            required: true,
            message: '验证码不能为空!',
            trigger: 'blur'
          }, {
            min: 6,
            max: 6,
            message: '验证码格式不正确',
            trigger: 'blur'
          }],
        },

        smsLock: false,
        smsLockObj: null,
      };
    },
    created() {
      this.smsLockObj = new SmsLock('REGISTER_SMS', 120);
    },
    destroyed() {
      clearInterval(this.smsLockObj.timer);
    },
    methods: {
      toLink(url) {
        this.$router.push({
          path: url
        });
      },
      onSubmit(formName) {
        if (this.registerLoading) {
          return false;
        }

        this.$refs[formName].validate((valid) => {
          if (!valid) return false;
          this.registerLoading = true;
          this.register();
        });
      },

      register() {
        let _this = this;
        registerServ({
          nickname: this.form.nickname,
          mobile: this.form.username,
          password: this.form.password,
          sms_code: this.form.sms_code,
          invite_code: "000000"
        }).then(res => {
          if (res.code == 200) {
            this.$notify({
              title: "成功",
              message: "注册成功,快去登录吧...",
              type: "success"
            });

            this.$refs.form.resetFields();
            setTimeout(function () {
              _this.$router.push({
                path: "/login"
              });
            }, 1500);
          } else {
            this.$notify.info({
              title: "提示",
              message: res.msg
            });
          }
        }).catch(err => {
          this.$notify({
            message: "网络错误,请稍后再试..."
          });
        }).finally(() => {
          this.registerLoading = false;
        });
      },

      //点击发送验证码
      //点击发送验证码
      sendSms() {
        if (this.smsLock) {
          return false;
        }

        if (!validate.validatPhone(this.form.username)) {
          this.$refs.form.validateField("username");
          return false;
        }

        this.smsLock = true;
        sendVerifyCodeServ({
          mobile: this.form.username,
          type: 'user_register'
        }).then(res => {
          if (res.code == 200) {
            this.$notify({
              title: '成功',
              message: '验证码发送成功...',
              type: 'success'
            });

            this.smsLockObj.start();
            if (res.data.is_debug) {
              setTimeout(() => {
                this.$notify({
                  title: '提示',
                  message: '已自动填充验证码'
                });
                this.form.sms_code = res.data.sms_code;
              }, 500);
            }
          } else {
            this.$notify({
              title: '提示',
              message: '验证码发送失败...'
            });
          }
          this.smsLock = false;
        }).catch(err => {
          this.smsLock = false;
        });
      }
    }
  };

</script>
