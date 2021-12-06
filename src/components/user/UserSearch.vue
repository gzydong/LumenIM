<template>
  <div>
    <div class="lum-dialog-mask" v-show="isShow">
      <el-container class="lum-dialog-box" v-outside="close">
        <el-header class="header" height="50px">
          <p>添加好友</p>
          <p class="tools">
            <i class="el-icon-close" @click="close" />
          </p>
        </el-header>
        <el-main class="main">
          <el-input
            v-model="mobile"
            id="serach-mobile"
            class="input"
            prefix-icon="el-icon-search"
            placeholder="请输入对方手机号(精确查找)"
            clearable
            @keyup.enter.native="onSubmit"
            @input="error = false"
          />
          <p v-show="error" class="error">
            无法找到该用户，请检查搜索内容并重试
          </p>
          <el-button
            type="primary"
            size="small"
            :loading="loading"
            @click="onSubmit"
            >立即查找
          </el-button>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
import { ServeSearchContact } from '@/api/contacts'

export default {
  name: 'UserSearch',
  data() {
    return {
      loading: false,
      isShow: false,
      mobile: '',
      error: false,
    }
  },
  methods: {
    // 显示窗口
    open() {
      this.mobile = ''
      this.isShow = true
      this.$nextTick(() => {
        document.getElementById('serach-mobile').focus()
      })
    },

    // 关闭窗口
    close() {
      this.isShow = false
    },

    onSubmit() {
      let { mobile } = this

      if (mobile == '') return false

      this.loading = true
      ServeSearchContact({
        mobile,
      })
        .then(res => {
          if (res.code == 200) {
            this.$user(res.data.id)
            this.close()
          } else {
            this.error = true
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
  height: 250px;

  .main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .input {
      width: 85%;
    }

    .error {
      width: 85%;
      color: red;
      font-size: 12px;
      height: 50px;
      line-height: 50px;
    }

    button {
      margin-top: 20px;
      width: 100px;
    }
  }
}
</style>
