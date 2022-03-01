<template>
  <div v-show="isShow" class="lum-dialog-mask">
    <el-container class="lum-dialog-box" v-outside="close">
      <el-header class="header" height="50px">
        <p>绑定手机</p>
        <p class="tools">
          <i class="close-btn el-icon-close" @click="close" />
        </p>
      </el-header>
      <el-main class="main">
        <el-form ref="form" :model="form" :rules="rules" label-position="top">
          <el-form-item prop="username" label="手机号">
            <el-input
              v-model="form.username"
              class="cuborder-radius"
              maxlength="11"
              size="medium"
              placeholder="请填写新手机号"
              @keyup.enter.native="onSubmit('form')"
            />
          </el-form-item>
          <el-form-item prop="sms_code" label="验证码">
            <el-input
              v-model="form.sms_code"
              class="cuborder-radius"
              style="width: 265px"
              maxlength="6"
              size="medium"
              placeholder="验证码"
              @keyup.enter.native="onSubmit('form')"
            />
            <div v-if="smsLock" class="send-code-btn disable">正在发送 ...</div>
            <div
              v-else-if="smsLock == false && smsLockObj.time == null"
              class="send-code-btn"
              @click="sendSms"
            >
              获取验证码
            </div>
            <div v-else class="send-code-btn disable">
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
import { isMobile } from '@/utils/validate'
import SmsLock from '@/plugins/sms-lock'
import { ServeUpdateMobile } from '@/api/user'
import { ServeSendVerifyCode } from '@/api/common'

export default {
  name: 'UserEditMobile',
  data() {
    let validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('登录手机号不能为空！'))
      } else {
        if (!isMobile(value)) {
          callback(new Error('登录手机号格式不正确！'))
        } else {
          callback()
        }
      }
    }

    return {
      loading: false,
      form: {
        username: '',
        password: '',
        sms_code: '',
      },
      rules: {
        username: [
          {
            required: true,
            validator: validateMobile,
            trigger: 'blur',
          },
          {
            min: 11,
            max: 11,
            message: '手机号格式不正确!',
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
    this.smsLockObj = new SmsLock('EDIT_MOBILE_SMS', 120)
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

    //点击发送验证码
    sendSms() {
      if (!isMobile(this.form.username)) {
        this.$refs.form.validateField('username')
        return false
      }

      this.smsLock = true
      ServeSendVerifyCode({
        channel: 'change_account',
        mobile: this.form.username,
      })
        .then(res => {
          if (res.code !== 200) {
            this.$notify({
              title: '提示',
              message: res.message,
            })
            return
          }

          this.smsLockObj.start()
          if (res.data.is_debug) {
            this.form.sms_code = res.data.sms_code
            setTimeout(() => {
              this.$notify({
                title: '提示',
                message: '已自动填充验证码',
                type: 'success',
              })
              this.form.sms_code = res.data.sms_code
            }, 500)
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
        this.changeMobile()
      })
    },

    // 提交修改手机号
    changeMobile() {
      this.loading = true
      ServeUpdateMobile({
        mobile: this.form.username,
        sms_code: this.form.sms_code,
        password: this.form.password,
      })
        .then(res => {
          if (res.code == 200) {
            this.$refs['form'].resetFields()
            this.$notify({
              title: '成功',
              message: '更换手机号成功...',
              type: 'success',
            })
            this.$emit('success')
            this.close()
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
      margin-left: 5px;
      border-radius: 5px;

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
