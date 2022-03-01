<template>
  <div>
    <div class="container">
      <h4>安全设置</h4>
      <el-row type="flex" class="list-item">
        <el-col :span="20" class="left-col">
          <h4>账户密码</h4>
          <p>当前密码强度 ：中</p>
        </el-col>
        <el-col :span="4" class="right-col">
          <span class="action" @click="$refs.changePasswrodRef.open()">
            修改
          </span>
        </el-col>
      </el-row>

      <el-row type="flex" class="list-item">
        <el-col :span="20" class="left-col">
          <h4>绑定手机</h4>
          <p>已绑定手机 ：{{ mobile }}</p>
        </el-col>
        <el-col :span="4" class="right-col">
          <span class="action" @click="$refs.changeMobileRef.open()">修改</span>
        </el-col>
      </el-row>

      <el-row type="flex" class="list-item">
        <el-col :span="20" class="left-col">
          <h4>绑定邮箱</h4>
          <p>已绑定邮箱 ：{{ email }}</p>
        </el-col>
        <el-col :span="4" class="right-col">
          <span class="action" @click="$refs.changeEmailRef.open()">修改</span>
        </el-col>
      </el-row>
    </div>

    <!-- 修改密码组件 -->
    <UserEditPassword ref="changePasswrodRef" />

    <!-- 修改手机号组件 -->
    <UserEditMobile ref="changeMobileRef" @success="getUserDetail" />

    <!-- 修改邮箱组件 -->
    <UserEditEmail ref="changeEmailRef" @success="getUserDetail" />
  </div>
</template>

<script>
import UserEditPassword from '@/components/user/UserEditPassword'
import UserEditMobile from '@/components/user/UserEditMobile'
import UserEditEmail from '@/components/user/UserEditEmail'
import { ServeGetUserDetail } from '@/api/user'

export default {
  name: 'SecurityPage',
  components: {
    UserEditPassword,
    UserEditMobile,
    UserEditEmail,
  },
  data() {
    return {
      mobile: '',
      email: '',
    }
  },
  created() {
    this.getUserDetail()
  },
  methods: {
    // 获取登录用户信息
    getUserDetail() {
      ServeGetUserDetail().then(res => {
        if (res.code == 200) {
          this.mobile = res.data.mobile.replace(
            /(\d{3})\d{4}(\d{4})/,
            '$1****$2'
          )

          this.email = res.data.email
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.container h4 {
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  margin-bottom: 12px;
}

.container .list-item {
  height: 70px;
  margin: 5px 25px 5px 0px;
  border-bottom: 1px solid #e8e8e8;

  .left-col {
    display: flex;
    flex-direction: column;
    justify-content: center;

    h4 {
      margin-bottom: 4px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      line-height: 1.5715;
    }

    p {
      margin-top: 5px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      line-height: 1.5715;
    }
  }

  .right-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;

    .action {
      color: rgb(24, 144, 255);
      font-size: 14px;
      font-weight: 300;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>
