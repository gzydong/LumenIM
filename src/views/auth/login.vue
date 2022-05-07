<template>
  <div id="login-box">
    <div class="header">快捷登录</div>
    <div class="main">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="手机号"
            class="cuborder-radius"
            maxlength="11"
            @keyup.enter.native="onSubmit('form')"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            class="cuborder-radius"
            @keyup.enter.native="onSubmit('form')"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="submit-btn"
            :loading="loginLoading"
            @click="onSubmit('form')"
            >立即登录
          </el-button>
        </el-form-item>
        <el-form-item>
          <div class="links">
            <el-link
              type="primary"
              :underline="false"
              @click="toLink('/auth/forget')"
              >找回密码
            </el-link>
            <el-link
              type="primary"
              :underline="false"
              @click="toLink('/auth/register')"
              >还没有账号？立即注册
            </el-link>
          </div>
        </el-form-item>

        <p style="margin-top: 50px">
          <el-divider>
            <span style="color: rgb(181, 176, 176); font-weight: 200">
              <i class="el-icon-mobile-phone" /> 预览账号
            </span>
          </el-divider>
        </p>
        <el-form-item class="preview-account">
          <p>预览账号:18798272054 / 密码: admin123</p>
          <p>预览账号:18798272055 / 密码: admin123</p>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { setToken } from '@/utils/auth'
import { ServeLogin } from '@/api/auth'

export default {
  data() {
    return {
      loginLoading: false,
      form: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          {
            required: true,
            message: '登录账号不能为空!',
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
      },
    }
  },
  methods: {
    onSubmit(formName) {
      if (this.loginLoading) return false

      this.$refs[formName].validate(valid => {
        if (!valid) return false
        this.loginLoading = true
        this.login()
      })
    },

    login() {
      ServeLogin({
        mobile: this.form.username,
        password: this.form.password,
        platform: 'web',
      })
        .then(res => {
          if (res.code == 200) {
            let result = res.data

            // 保存授权信息到本地缓存
            setToken(result.access_token, result.expires_in)

            this.$store.commit('UPDATE_USER_INFO', result.userInfo)
            this.$store.commit('UPDATE_LOGIN_STATUS')
            this.$store.dispatch('LOAD_TALK_ITEMS')

            // 登录成功后连接 WebSocket 服务器
            this.$root.initialize()

            this.toLink('/')
            
            this.showNotice()
          } else {
            this.$notify.info({
              title: '提示',
              message: '登录密码不正确或账号不存在...',
            })
          }
        })
        .finally(() => {
          this.loginLoading = false
        })
    },

    toLink(url) {
      this.$router.push({
        path: url,
      })
    },

    showNotice() {
      setTimeout(() => {
        this.$notify({
          title: '友情提示',
          message:
            '此站点仅供演示、学习所用，请勿进行非法操作、上传或发布违法资讯。',
          duration: 0,
        })
      }, 3000)
    },
  },
}
</script>
<style lang="less" scoped>
@import '~@/assets/css/page/login-auth.less';
</style>
