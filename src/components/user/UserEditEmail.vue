<template>
  <div class="lum-dialog-mask" v-show="isShow">
    <el-container class="lum-dialog-box" v-outside="close">
      <el-header class="header" height="50px">
        <p>绑定邮箱</p>
        <p class="tools">
          <i class="el-icon-close" @click="close" />
        </p>
      </el-header>
      <el-main class="main">
        <el-form ref="form" :model="form" :rules="rules" label-position="top">
          <el-form-item prop="email" label="邮箱">
            <el-input
              v-model="form.email"
              class="cuborder-radius"
              size="medium"
              placeholder="请填写邮箱地址"
              @keyup.enter.native="onSubmit('form')"
            />
          </el-form-item>
          <el-form-item prop="sms_code" label="验证码">
            <el-input
              v-model="form.sms_code"
              class="cuborder-radius"
              style="width: 265px"
              size="medium"
              maxlength="6"
              placeholder="邮件验证码"
              @keyup.enter.native="onSubmit('form')"
            />
            <div v-if="smsLock" class="code-btn disable">正在发送 ...</div>
            <div
              v-else-if="smsLock == false && smsLockObj.time == null"
              class="code-btn"
              @click="sendSms"
            >
              获取验证码
            </div>
            <div v-else class="code-btn disable">
              重新发送({{ smsLockObj.time }}s)
            </div>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input
              v-model="form.password"
              class="cuborder-radius no-border"
              type="password"
              size="medium"
              placeholder="登录密码验证"
              @keyup.enter.native="onSubmit('form')"
            />
          </el-form-item>
          <el-form-item style="margin-top: 40px">
            <el-button
              class="submit-btn"
              type="primary"
              size="medium"
              :loading="loading"
              @click="onSubmit('form')"
              >提交
            </el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import SmsLock from '@/plugins/sms-lock'
import { ServeUpdateEmail } from '@/api/user'
import { ServeSendEmailCode } from '@/api/common'
import { isEmail } from '@/utils/validate'

export default {
  name: 'UserEditEmail',
  data() {
    return {
      loading: false,
      form: {
        email: '',
        password: '',
        sms_code: '',
      },
      rules: {
        email: [
          {
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur',
          },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '登录密码不能为空!',
            trigger: 'blur',
          },
        ],
        sms_code: [
          {
            required: true,
            message: '验证码不能为空!',
            trigger: 'blur',
          },
        ],
      },

      smsLock: false,
      smsLockObj: null,
      isShow: false,
    }
  },
  created() {
    this.smsLockObj = new SmsLock('CHANGE_EMAIL_SMS', 120)
  },
  destroyed() {
    this.smsLockObj.clearInterval()
  },
  methods: {
    // 显示窗口
    open() {
      this.$refs['form'].resetFields()
      this.isShow = true
    },

    // 关闭窗口
    close() {
      this.isShow = false
    },

    //点击发送邮件验证码
    sendSms() {
      if (!isEmail(this.form.email)) {
        this.$refs.form.validateField('email')
        return false
      }

      this.smsLock = true
      ServeSendEmailCode({
        email: this.form.email,
      })
        .then(res => {
          if (res.code == 200) {
            this.smsLockObj.start()
          }
        })
        .finally(() => {
          this.smsLock = false
        })
    },

    // 表单验证
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return false
        this.changeEmail()
      })
    },

    // 提交修改邮箱
    changeEmail() {
      this.loading = true
      ServeUpdateEmail({
        email: this.form.email,
        email_code: this.form.sms_code,
        password: this.form.password,
      })
        .then(res => {
          if (res.code == 200) {
            this.$refs['form'].resetFields()
            this.$emit('success')
            this.close()
            this.$notify({
              title: '成功',
              message: '修改邮箱成功...',
              type: 'success',
            })
          } else {
            this.$message(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
<style lang="less" scoped>
.lum-dialog-box {
  width: 450px;
  max-width: 450px;

  .main {
    .code-btn {
      width: 140px;
      height: 36px;
      line-height: 36px;
      display: inline-block;
      background: #f3ecec;
      text-align: center;
      color: #777373;
      cursor: pointer;
      user-select: none;
      margin-left: 5px;

      &:active {
        background: #e4dbdb;
      }

      &.disable {
        cursor: not-allowed !important;
        background: #f7f7f7 !important;
        color: silver !important;
      }
    }
  }
}

/deep/.el-form--label-top .el-form-item__label{
  padding: 0;
  line-height: 30px;
}
</style>
