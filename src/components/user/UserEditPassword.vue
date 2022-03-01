<template>
  <!-- 用户密码修改组件 -->
  <div class="lum-dialog-mask" v-show="isShow">
    <el-container class="lum-dialog-box" v-outside="close">
      <el-header class="header" height="50px">
        <p>修改密码</p>
        <p class="tools">
          <i class="el-icon-close" @click="close" />
        </p>
      </el-header>
      <el-main class="main">
        <el-form ref="form" :model="form" :rules="rules" label-position="top" >
          <el-form-item prop="old_password" label="旧密码">
            <el-input
              v-model="form.old_password"
              class="cuborder-radius no-border"
              type="password"
              size="medium"
              placeholder="请填写旧密码"
              @keyup.enter.native="onSubmit('form')"
            />
          </el-form-item>
          <el-form-item prop="new_password" label="新密码">
            <el-input
              v-model="form.new_password"
              class="cuborder-radius no-border"
              type="password"
              size="medium"
              placeholder="请填写新的密码"
              @keyup.enter.native="onSubmit('form')"
            />
          </el-form-item>
          <el-form-item prop="new_password2" label="重复密码">
            <el-input
              v-model="form.new_password2"
              class="cuborder-radius no-border"
              size="medium"
              type="password"
              placeholder="请再次填写新密码"
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
import { ServeUpdatePassword } from '@/api/user'

export default {
  name: 'UserEditPassword',
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      form: {
        old_password: '',
        new_password: '',
        new_password2: '',
      },
      rules: {
        old_password: [
          {
            required: true,
            message: '旧密码不能为空!',
            trigger: 'blur',
          },
        ],
        new_password: [
          {
            required: true,
            message: '新密码不能为空!',
            trigger: 'blur',
          },
        ],
        new_password2: [
          {
            required: true,
            validator: validatePass2,
            trigger: 'blur',
          },
        ],
      },

      isShow: false,
    }
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

    // 表单验证
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return false
        this.changePassword()
      })
    },

    // 提交修改手机号
    changePassword() {
      this.loading = true
      ServeUpdatePassword({
        old_password: this.form.old_password,
        new_password: this.form.new_password,
      })
        .then(res => {
          if (res.code == 200) {
            this.$refs['form'].resetFields()
            this.$notify({
              title: '成功',
              message: '密码修改成功...',
              type: 'success',
            })
          } else {
            this.$message(res.message)
          }

          this.loading = false
        })
        .catch(() => {
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
}

/deep/.el-form--label-top .el-form-item__label{
  padding: 0;
  line-height: 30px;
}
</style>
