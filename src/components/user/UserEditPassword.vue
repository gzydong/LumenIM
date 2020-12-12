<template>
  <!-- 用户密码修改组件 -->
  <div class="base-mask animated fadeIn" v-show="isShow">
    <div class="container" v-outside="close">
      <el-container class="hv100">
        <el-header class="padding0 header" height="50px">
          <span>修改密码</span>
          <i class="close-btn el-icon-close" @click="close"></i>
        </el-header>
        <el-main class="main">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item prop="old_password" label="旧密码">
              <el-input v-model="form.old_password" type="password" placeholder="请填写旧密码" class="cuborder-radius border0"
                @keyup.enter.native="onSubmit('form')" size="medium" />
            </el-form-item>
            <el-form-item prop="new_password" label="新密码">
              <el-input v-model="form.new_password" type="password" placeholder="请填写新的密码" class=" cuborder-radius
                border0" @keyup.enter.native="onSubmit('form')" size="medium" />
            </el-form-item>
            <el-form-item prop="new_password2" label="重复密码">
              <el-input v-model="form.new_password2" type="password" placeholder="请再次填写新密码"
                class="cuborder-radius border0" @keyup.enter.native="onSubmit('form')" size="medium" />
            </el-form-item>
            <el-form-item style="margin-top: 40px;">
              <el-button type="primary" @click="onSubmit('form')" class="submit-btn" :loading="loading" size="medium">
                立即修改
              </el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
  import {
    ServeEditPassword
  } from '@/api/user';

  export default {
    name: 'user-edit-password',
    data() {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.new_password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {
        loading: false,
        form: {
          old_password: '',
          new_password: '',
          new_password2: ''
        },
        rules: {
          old_password: [{
            required: true,
            message: '旧密码不能为空!',
            trigger: 'blur'
          }],
          new_password: [{
            required: true,
            message: '新密码不能为空!',
            trigger: 'blur'
          }],
          new_password2: [{
            required: true,
            validator: validatePass2,
            trigger: 'blur'
          }],
        },

        isShow: false,
      };
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

      // 表单验证
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false;
          this.changePassword();
        });
      },

      // 提交修改手机号
      changePassword() {
        this.loading = true;
        ServeEditPassword({
          old_password: this.form.old_password,
          new_password: this.form.new_password
        }).then(res => {
          if (res.code == 200) {
            this.$refs['form'].resetFields();
            this.$notify({
              title: '成功',
              message: '密码修改成功...',
              type: 'success'
            });
          } else {
            this.$message(res.message);
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
    width: 450px;
    min-height: 340px;
    background-color: white;
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

  .cuborder-radius>>>.el-input__inner {
    border-radius: 1px !important;
  }

  .send-code-btn {
    width: 140px;
    height: 40px;
    line-height: 40px;
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
