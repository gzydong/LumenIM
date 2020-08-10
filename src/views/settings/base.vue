<template>
  <div>
    <div class="container">
      <h4>设置个人信息</h4>
      <el-row>
        <el-col :span="16">
          <el-form ref="form" :model="form" :rules="rules">
            <el-form-item label="昵称:" prop="nickname">
              <el-input v-model="form.nickname" size="medium" placeholder="给自己起个名字" />
            </el-form-item>
            <el-form-item label="性别:">
              <el-radio-group v-model="form.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="电子邮箱:" prop="email">
              <el-input v-model="form.email" size="medium" placeholder="电子邮箱" />
            </el-form-item>
            <el-form-item label="座右铭:">
              <el-input type="textarea" v-model="form.motto" rows="3" placeholder="编辑我的座右铭..." />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" size="medium" :loading="loading">更新我的信息</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8" class="avatar-col">
          <div class="avatar-box">
            <img :src="form.avatar" v-show="form.avatar" />
            <div class="upload-icon"><i class="el-icon-upload"></i></div>
            <div class="upload-mask" @click="isAvatarCropper = true"><i class="el-icon-plus"></i></div>
          </div>
          <p style="margin-top: 20px;">设置头像</p>
        </el-col>
      </el-row>
    </div>

    <avatar-cropper v-if="isAvatarCropper" v-on:close="closeAvatarCropper" />
  </div>
</template>

<script>
  import AvatarCropper from '@/components/layout/AvatarCropper';
  import {
    editUserSetupServ,
    findUserDetailServ
  } from '@/api/user';
  export default {
    name: 'personal-page',
    components: {
      AvatarCropper
    },
    data() {
      let checkEmail = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('邮箱不能为空'));
        }

        const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        mailReg.test(value) ? callback() : callback(new Error('请输入正确的邮箱格式'));
      }

      return {
        isAvatarCropper: false,
        form: {
          nickname: '',
          gender: '',
          avatar: '',
          motto: '',
          email: ''
        },
        rules: {
          nickname: [{
            required: true,
            message: '用户昵称不能为空!',
            trigger: 'blur'
          }],
          email: [{
            validator: checkEmail,
            trigger: 'blur'
          }]
        },

        loading: false,
      }
    },
    created() {
      this.getUserDetail();
    },
    methods: {
      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (!valid) return false;
          this.editUserDetail();
        });
      },

      // 关闭头像裁剪弹出层
      closeAvatarCropper(type, avatar = '') {
        this.isAvatarCropper = false;
        if (type == 1 && avatar != '') {
          this.form.avatar = avatar;
        }
      },

      // 获取用户信息
      getUserDetail() {
        findUserDetailServ().then((res) => {
          if (res.code == 200) {
            this.form.mobile = res.data.mobile;
            this.form.nickname = res.data.nickname;
            this.form.avatar = res.data.avatar;
            this.form.motto = res.data.motto;
            this.form.email = res.data.email;
            this.form.gender = res.data.gender;
          }
        });
      },

      // 修改用户信息
      editUserDetail() {
        this.loading = true;
        let _this = this;
        editUserSetupServ({
          nickname: this.form.nickname,
          avatar: this.form.avatar,
          motto: this.form.motto,
          email: this.form.email,
          gender: this.form.gender
        }).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '信息修改成功...',
              type: 'success'
            });

            _this.$store.dispatch('ACT_USER_UPDATE_AVATAR', this.form.avatar);
          }
        }).finally(function () {
          _this.loading = false;
        });
      },
    },
  };

</script>
<style scoped>
  .container h4 {
    color: rgba(0, 0, 0, .85);
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    margin-bottom: 12px;
  }

  .container>>>.el-input__inner,
  .container>>>.el-textarea__inner {
    border-radius: 0;
  }

  .container>>>.el-button {
    border-radius: 0;
  }

  .avatar-col {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .avatar-box {
    width: 180px;
    height: 180px;
    box-shadow: 0px 0px 7px 1px #e8e4e4;
    border-radius: 50%;
    position: relative;
    cursor: pointer;
    transition: ease .5s;
  }

  .avatar-box .upload-icon {
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(184, 184, 197, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .avatar-box .upload-icon i {
    font-size: 30px;
    color: #1bb0f3;
  }

  .avatar-box img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    z-index: 0;
  }

  .avatar-box .upload-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 3;
    display: none;
    justify-content: center;
    align-items: center;
  }

  .avatar-box .upload-mask i {
    font-size: 30px;
    color: white;
  }

  .avatar-box:hover .upload-mask {
    display: flex;
  }

  @media screen and (max-width: 1150px) {
    .avatar-box {
      width: 130px;
      height: 130px;
    }
  }

  @media screen and (max-width: 750px) {
    .avatar-box {
      width: 100px;
      height: 100px;
    }
  }

</style>
