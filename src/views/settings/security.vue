<template>
  <div>
    <div class="container">
      <h4>安全设置</h4>

      <el-row type="flex" class="list-item">
        <el-col :span="20" class="left-col">
          <h4>账户密码</h4>
          <p>当前密码强度 ：{{cipherStrength}}</p>
        </el-col>
        <el-col :span="4" class="right-col">
          <span class="action" @click="$refs.changePasswrodRef.open()">修改</span>
        </el-col>
      </el-row>

      <el-row type="flex" class="list-item">
        <el-col :span="20" class="left-col">
          <h4>绑定手机</h4>
          <p>已绑定手机 ：{{bindMobile}}</p>
        </el-col>
        <el-col :span="4" class="right-col">
          <span class="action" @click="$refs.changeMobileRef.open()">更换</span>
        </el-col>
      </el-row>

      <el-row type="flex" class="list-item">
        <el-col :span="20" class="left-col">
          <h4>绑定邮箱</h4>
          <p>已绑定邮箱 ：{{bindEmail}}</p>
        </el-col>
        <el-col :span="4" class="right-col">
          <span class="action" @click="$refs.changeEmailRef.open()">修改</span>
        </el-col>
      </el-row>
    </div>

    <!-- 修改密码组件 -->
    <user-edit-password ref="changePasswrodRef" />

    <!-- 修改手机号组件 -->
    <user-edit-mobile ref="changeMobileRef" @success="getUserDetail" />

    <!-- 修改邮箱组件 -->
    <user-edit-email ref="changeEmailRef" @success="getUserDetail" />
  </div>
</template>

<script>
  import UserEditPassword from "@/components/user/UserEditPassword";
  import UserEditMobile from "@/components/user/UserEditMobile";
  import UserEditEmail from "@/components/user/UserEditEmail";
  import {
    ServeFindUserDetail
  } from '@/api/user';
  export default {
    name: 'security-page',
    components: {
      UserEditPassword,
      UserEditMobile,
      UserEditEmail
    },
    data() {
      return {
        // 密码强度
        cipherStrength: '中',

        bindMobile: '',

        bindEmail: ''
      }
    },
    created() {
      this.getUserDetail();
    },
    methods: {
      // 获取登录用户信息
      getUserDetail() {
        ServeFindUserDetail().then((res) => {
          if (res.code == 200) {
            this.bindMobile = res.data.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
            this.bindEmail = res.data.email;
          }
        });
      }
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

  .list-item {
    height: 70px;
    margin: 5px 25px 5px 0px;
    border-bottom: 1px solid #e8e8e8;
  }

  .list-item .left-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .list-item .left-col h4 {
    margin-bottom: 4px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    line-height: 1.5715;
  }

  .list-item .left-col p {
    margin-top: 5px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 1.5715;
  }

  .list-item .right-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
  }

  .list-item .right-col .action {
    color: rgb(24, 144, 255);
    font-size: 14px;
    font-weight: 300;
    cursor: pointer;
    user-select: none;
  }

</style>
