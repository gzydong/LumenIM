<template>
  <div class="base-mask animated fadeIn" v-show="isShow">
    <div class="container" v-outside="close">
      <el-container class="hv100">
        <el-header class="padding0 header" height="50px">
          <span>绑定邮箱</span>
          <i class="close-btn el-icon-close" @click="close"></i>
        </el-header>
        <el-main class="main">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item prop="email" label="邮箱地址">
              <el-input v-model="form.email" placeholder="请填写邮箱地址" class="cuborder-radius"
                @keyup.enter.native="onSubmit('form')" size="medium" />
            </el-form-item>
            <el-form-item prop="sms_code" label="验证码">
              <el-input v-model="form.sms_code" placeholder="验证码" class="cuborder-radius"
                @keyup.enter.native="onSubmit('form')" style="width: 185px;" size="medium" />

              <div class="send-code-btn send-sms-disable" v-if="smsLock">正在发送 ...</div>
              <div class="send-code-btn" v-else-if="smsLock == false && smsLockObj.time == null" @click="sendSms">获取验证码
              </div>
              <div class="send-code-btn send-sms-disable" v-else>重新发送({{smsLockObj.time}}s)</div>
            </el-form-item>
            <el-form-item prop="password" label="密码">
              <el-input v-model="form.password" type="password" placeholder="登录密码验证" class="cuborder-radius border0"
                @keyup.enter.native="onSubmit('form')" size="medium" />
            </el-form-item>
            <el-form-item style="margin-top: 40px;">
              <el-button type="primary" @click="onSubmit('form')" class="submit-btn" :loading="loading" size="medium">
                立即提交
              </el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
  import SmsLock from '@/plugins/sms-lock';
  import {
    sendEmailCodeServ,
    editEmailServ
  } from '@/api/user';

  export default {
    name: 'change-email',
    data() {
      let checkEmail = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('邮箱不能为空'));
        }

        const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        mailReg.test(value) ? callback() : callback(new Error('请输入正确的邮箱格式'));
      }

      return {
        loading: false,
        form: {
          email: '',
          password: '',
          sms_code: ''
        },
        rules: {
          email: [{
            required: true,
            validator: checkEmail,
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '登录密码不能为空!',
            trigger: 'blur'
          }],
          sms_code: [{
            required: true,
            message: '验证码不能为空!',
            trigger: 'blur'
          }]
        },

        smsLock: false,
        smsLockObj: null,
        isShow: false,
      };
    },
    created() {
      this.smsLockObj = new SmsLock('CHANGE_EMAIL_SMS', 120);
    },
    destroyed() {
      clearInterval(this.smsLockObj.timer);
    },
    methods: {
      // 显示窗口
      open() {
        this.$refs['form'].resetFields();
        this.isShow = true;
      },

      // 关闭窗口
      close() {
        this.isShow = false;
      },

      //点击发送邮件验证码
      sendSms() {
        const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if (!mailReg.test(this.form.email)) {
          this.$refs.form.validateField("email");
          return false;
        }

        this.smsLock = true;
        sendEmailCodeServ({
          email: this.form.email
        }).then(res => {
          if (res.code == 200) {
            this.smsLockObj.start();
          }
        }).finally(() => {
          this.smsLock = false;
        });
      },

      // 表单验证
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false;
          this.changeEmail();
        });
      },

      // 提交修改手机号
      changeEmail() {
        this.loading = true;
        editEmailServ({
          email: this.form.email,
          email_code: this.form.sms_code,
          password: this.form.password
        }).then(res => {
          if (res.code == 200) {
            this.$refs['form'].resetFields();
            this.$notify({
              title: '成功',
              message: '修改邮箱成功...',
              type: 'success'
            });

            this.$emit('success');
            this.close();
          } else {
            this.$message(res.msg);
          }

          this.loading = false;
        }).catch(err => {
          this.loading = false;
        });
      }
    },
  }

</script>

<style scoped>
  .base-mask {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container {
    background-color: white;
    width: 450px;
    min-height: 340px;
    border-radius: 3px;
    overflow: hidden;
    box-shadow: 0 2px 8px 0 rgba(31, 35, 41, .2);
  }

  .container .header {
    height: 50px;
    line-height: 50px;
    position: relative;
    text-indent: 20px;
    border-bottom: 1px solid #f5eeee;
  }

  .container .header .close-btn {
    position: absolute;
    right: 20px;
    top: 15px;
    font-size: 20px;
    cursor: pointer;
  }

  .container .main {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .cuborder-radius>>>.el-input__inner {
    border-radius: 1px !important;
  }

  .send-code-btn {
    width: 140px;
    height: 36px;
    line-height: 36px;
    display: inline-block;
    background: #f3ecec;
    text-align: center;
    color: #777373;
    cursor: pointer;
    user-select: none;
  }

  .send-code-btn:active {
    background: #e4dbdb;
  }

  .send-sms-disable {
    cursor: not-allowed !important;
    background: #f7f7f7 !important;
    color: silver !important;
  }

  .submit-btn {
    border-radius: 0;
    width: 150px;
  }

</style>
