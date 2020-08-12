<template>
  <div class="base-mask">
    <div class="container" v-outside="close">
      <el-container class="hv100">
        <el-header class="padding0 header no-user-select" height="50px">
          <span>群管理【你就按】</span>
          <i class="close-btn el-icon-close" @click="close"></i>
        </el-header>
        <el-main class="main padding0">
          <el-container class="hv100">
            <el-aside width="130px" class="aside-border">
              <div class="menu-list menu-list-selectd">基础信息</div>
              <div class="menu-list">群成员</div>
              <div class="menu-list">群公告</div>
              <div class="menu-list">群文件</div>
              <div class="menu-list">退出群组</div>
            </el-aside>
            <el-main>
              <el-row>
                <el-col :span="14">
                  <el-form ref="form" :model="form" :rules="rules">
                    <el-form-item label="群名:" prop="nickname">
                      <el-input v-model="form.nickname" size="medium" placeholder="给自己起个名字" />
                    </el-form-item>
                    <el-form-item label="群简介:">
                      <el-input type="textarea" v-model="form.motto" rows="3" placeholder="编辑我的座右铭..." />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" size="small">修改</el-button>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="10" class="avatar-col">
                  <div class="avatar-box">
                    <img :src="form.avatar" v-show="form.avatar" />
                    <div class="upload-icon"><i class="el-icon-upload"></i></div>
                    <div class="upload-mask" @click="isAvatarCropper = true"><i class="el-icon-plus"></i></div>
                  </div>
                  <p style="margin-top: 20px;">设置头像</p>
                </el-col>
              </el-row>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </div>

    <avatar-cropper v-if="isAvatarCropper" v-on:close="closeAvatarCropper" />
  </div>
</template>
<script>
  import AvatarCropper from '@/components/layout/AvatarCropper';
  export default {
    name: "group-manager",
    props: {
      groupId: {
        type: [String, Number],
        default: null,
      }
    },
    components: {
      AvatarCropper
    },
    data() {
      return {
        form: {
          nickname: '',
          gender: '',
          avatar: '',
          motto: '',
          email: '',
          mobile: '',
        },
        rules: {
          nickname: [{
            required: true,
            message: '用户昵称不能为空!',
            trigger: 'blur'
          }]
        },
        isAvatarCropper: false,
      };
    },
    methods: {
      //关闭窗口
      close() {
        this.$emit("close");
      },

      // 关闭头像裁剪弹出层
      closeAvatarCropper(type, avatar = '') {
        this.isAvatarCropper = false;
        if (type == 1 && avatar != '') {
          this.form.avatar = avatar;
        }
      },
    }
  };

</script>
<style scoped>
  .container>>>.el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .base-mask {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container {
    width: 80%;
    height: 500px;

    max-width: 800px;

    border-radius: 3px;
    overflow: hidden;
    background-color: white;
  }

  .container .header {
    height: 50px;
    line-height: 50px;
    position: relative;
    text-indent: 15px;
    border-bottom: 1px solid #f5eeee;
  }

  .container .header .close-btn {
    position: absolute;
    right: 20px;
    top: 15px;
    font-size: 20px;
    cursor: pointer;
  }


  .container .aside-border {
    background-color: #f0f2f5;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;
    padding: 8px;
  }

  .container .aside-border .menu-list {
    height: 30px;
    line-height: 30px;
    margin: 4px 2px;
    padding-left: 15px;
    font-weight: 400;
    font-size: 13px;
    background-color: white;
    cursor: pointer;
    -webkit-transition: ease .2s;
    transition: ease .2s;
  }

  .container .aside-border .menu-list-selectd {
    background: #2196F3;
    color: white !important;
  }

  .avatar-col {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .avatar-box {
    width: 100px;
    height: 100px;
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

</style>
