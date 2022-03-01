<template>
  <div id="login-box">
    <div class="header">找回密码</div>
    <div class="main">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="我的手机号"
            class="cuborder-radius"
            maxlength="11"
            @keyup.enter.native="onSubmit('form')"
          />
        </el-form-item>

        <el-form-item prop="sms_code">
          <el-input
            v-model="form.sms_code"
            placeholder="短信验证码"
            class="cuborder-radius"
            maxlength="6"
            @keyup.enter.native="onSubmit('form')"
            style="width: 205px"
          />
          <div class="send-code-btn send-sms-disable" v-if="smsLock">
            正在发送 ...
          </div>
          <div
            class="send-code-btn"
            v-else-if="smsLock == false && smsLockObj.time == null"
            @click="sendSms"
          >
            获取短信
          </div>
          <div class="send-code-btn send-sms-disable" v-else>
            重新发送({{ smsLockObj.time }}s)
          </div>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="设置新密码"
            class="cuborder-radius"
            @keyup.enter.native="onSubmit('form')"
          />
        </el-form-item>
        <el-form-item prop="password2">
          <el-input
            v-model="form.password2"
            type="password"
            placeholder="确认新密码"
            class="cuborder-radius"
            @keyup.enter.native="onSubmit('form')"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="submit-btn"
            :loading="forgetLoading"
            @click="onSubmit('form')"
            >立即找回
          </el-button>
        </el-form-item>

        <el-form-item>
          <div class="links">
            <el-link
              type="primary"
              :underline="false"
              @click="toLink('/auth/register')"
              >注册账号
            </el-link>
            <el-link
              type="primary"
              :underline="false"
              @click="toLink('/auth/login')"
              >已有账号，立即登录?
            </el-link>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { ServeForgetPassword } from '@/api/auth'
import { ServeSendVerifyCode } from '@/api/common'
import { isMobile } from '@/utils/validate'
import SmsLock from '@/plugins/sms-lock'

export default {
  name: 'ForgetPasswordPage',
  data() {
    let validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空！'))
      } else {
        isMobile(value) ? callback() : callback(new Error('手机号格式不正确！'))
      }
    }

    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      forgetLoading: false,

      form: {
        username: '',
        password: '',
        password2: '',
        sms_code: '',
      },

      rules: {
        username: [
          {
            validator: validateMobile,
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
        password2: [
          {
            validator: validatePass2,
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
    }
  },
  created() {
    this.smsLockObj = new SmsLock('FORGET_PSW_SMS', 60)
  },
  destroyed() {
    this.smsLockObj.clearInterval()
  },
  methods: {
    toLink(url) {
      this.$router.push({
        path: url,
      })
    },

    onSubmit(formName) {
      if (this.forgetLoading) return false

      this.$refs[formName].validate(valid => {
        if (!valid) return false
        this.forgetLoading = true
        this.forgetAccount()
      })
    },

    forgetAccount() {
      ServeForgetPassword({
        mobile: this.form.username,
        password: this.form.password,
        sms_code: this.form.sms_code,
      })
        .then(res => {
          this.forgetLoading = false
          if (res.code == 200) {
            this.$notify({
              title: '成功',
              message: '密码修改成功,快去登录吧...',
              type: 'success',
            })

            this.$refs.form.resetFields()
            setTimeout(() => {
              this.$router.push('/auth/login')
            }, 1500)
          } else {
            this.$notify({
              message: res.message,
            })
          }
        })
        .catch(() => {
          this.forgetLoading = false
          this.$notify({
            message: '网络错误,请稍后再试...',
          })
        })
    },

    //点击发送验证码
    sendSms() {
      if (this.smsLock) return false

      if (!isMobile(this.form.username)) {
        this.$refs.form.validateField('username')
        return false
      }

      this.smsLock = true
      ServeSendVerifyCode({
        mobile: this.form.username,
        channel: 'forget_account',
      })
        .then(res => {
          if (res.code == 200) {
            this.smsLockObj.start()
            this.$notify({
              title: '成功',
              message: '验证码发送成功...',
              type: 'success',
            })

            if (res.data.is_debug) {
              setTimeout(() => {
                this.$notify({
                  title: '提示',
                  message: '已自动填充验证码',
                })

                this.form.sms_code = res.data.sms_code
              }, 500)
            }
          } else {
            this.$notify({
              title: '提示',
              message: '验证码发送失败...',
            })
          }
        })
        .finally(() => {
          this.smsLock = false
        })
    },
  },
}
</script>
<style lang="less" scoped>
@import '~@/assets/css/page/login-auth.less';
</style>
