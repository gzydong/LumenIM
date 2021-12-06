<template>
  <div class="box">
    <div class="container">
      <h4>个人信息</h4>
      <el-row>
        <el-col :span="15">
          <el-form ref="form" :model="form" :rules="rules">
            <el-form-item label="登录账号:">
              <p>{{ form.mobile }}</p>
            </el-form-item>
            <el-form-item label="电子邮箱:">
              <p>
                <span>{{ form.email ? form.email : '未设置邮箱' }}</span>
                <el-button
                  type="text"
                  icon="el-icon-edit-outline"
                  style="margin-left: 20px; font-weight: 300"
                  @click="toEmail"
                  >{{ form.email ? '修改邮箱' : '设置邮箱' }}</el-button
                >
              </p>
            </el-form-item>
            <el-form-item label="昵称:" prop="nickname">
              <el-input
                v-model="form.nickname"
                size="medium"
                placeholder="给自己起个名字"
              />
            </el-form-item>
            <el-form-item label="性别:">
              <el-radio-group v-model="form.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="座右铭:">
              <el-input
                type="textarea"
                v-model="form.motto"
                rows="3"
                placeholder="编辑我的座右铭..."
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="onSubmit"
                size="medium"
                :loading="loading"
                >立即修改</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8" class="avatar-col">
          <div class="avatar-box">
            <img :src="form.avatar" v-show="form.avatar" />
            <div class="upload-icon"><i class="el-icon-upload" /></div>
            <div class="upload-mask" @click="isAvatarCropper = true">
              <i class="el-icon-plus" />
            </div>
          </div>
          <p>设置头像</p>
        </el-col>
      </el-row>
    </div>

    <AvatarCropper v-if="isAvatarCropper" @close="closeAvatarCropper" />
  </div>
</template>
<script>
import AvatarCropper from '@/components/layout/AvatarCropper'
import { ServeUpdateUserDetail, ServeGetUserDetail } from '@/api/user'

export default {
  name: 'UsrBasePage',
  components: {
    AvatarCropper,
  },
  data() {
    return {
      isAvatarCropper: false,

      form: {
        nickname: '',
        gender: '',
        avatar: '',
        motto: '',
        email: '',
        mobile: '',
      },

      rules: {
        nickname: [
          {
            required: true,
            message: '用户昵称不能为空!',
            trigger: 'blur',
          },
        ],
      },

      loading: false,
    }
  },
  created() {
    this.getUserDetail()
  },
  methods: {
    toEmail() {
      this.$router.push({
        path: '/settings/security',
      })
    },
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) return false
        this.editUserDetail()
      })
    },

    // 关闭头像裁剪弹出层
    closeAvatarCropper(type, avatar = '') {
      this.isAvatarCropper = false
      if (type == 1 && avatar != '') {
        this.form.avatar = avatar
      }
    },

    // 获取用户信息
    getUserDetail() {
      ServeGetUserDetail().then(res => {
        if (res.code == 200) {
          this.form.mobile = res.data.mobile.replace(
            /(\d{3})\d{4}(\d{4})/,
            '$1****$2'
          )

          this.form.nickname = res.data.nickname
          this.form.avatar = res.data.avatar
          this.form.motto = res.data.motto
          this.form.email = res.data.email
          this.form.gender = res.data.gender
        }
      })
    },

    // 修改用户信息
    editUserDetail() {
      this.loading = true
      ServeUpdateUserDetail({
        nickname: this.form.nickname,
        avatar: this.form.avatar,
        motto: this.form.motto,
        gender: this.form.gender,
      })
        .then(res => {
          if (res.code == 200) {
            this.$store.commit('UPDATE_USER_INFO', {
              nickname: this.form.nickname,
              sex: this.form.gender,
              signature: this.form.motto,
              avatar: this.form.avatar,
            })

            this.$message({
              message: '信息修改成功...',
              type: 'success',
            })
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
.box {
  height: 100%;
  overflow-y: auto;
}

.container h4 {
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  margin-bottom: 12px;
}

.container /deep/ .el-input__inner,
.container /deep/ .el-textarea__inner {
  border-radius: 0;
}

.container /deep/ .el-button {
  border-radius: 2px;
  font-weight: 400;
}

.avatar-col {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  .avatar-box {
    width: 180px;
    height: 180px;
    box-shadow: 0px 0px 7px 1px #e8e4e4;
    border-radius: 50%;
    position: relative;
    cursor: pointer;
    transition: ease 0.5s;

    .upload-icon {
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

      i {
        font-size: 30px;
        color: #1bb0f3;
      }
    }

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      z-index: 0;
    }

    .upload-mask {
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

      i {
        font-size: 30px;
        color: white;
      }
    }

    &:hover .upload-mask {
      display: flex;
    }
  }

  > p {
    margin-top: 20px;
  }
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
