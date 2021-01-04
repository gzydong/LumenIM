<template>
  <div>
    <div class="base-mask" v-show="isShow">
      <div class="container" v-outside="close">
        <el-container class="hv100">
          <el-header class="padding0 header" height="50px">
            <span>添加好友</span>
            <i class="el-icon-close" @click="close"></i>
          </el-header>
          <el-main class="main">
            <el-input
              prefix-icon="el-icon-search"
              placeholder="请输入对方手机号(精确查找)"
              v-model="input"
              clearable
              @keyup.enter.native="onSubmit"
              class="input"
              @input="isError = false"
              style="text-align: center"
            />
            <p class="error" v-show="isError">
              无法找到该用户，请检查搜索内容并重试
            </p>
            <el-button
              type="primary"
              size="small"
              @click="onSubmit"
              :loading="loading"
              >立即查找</el-button
            >
          </el-main>
        </el-container>
      </div>
    </div>

    <!-- 查看好友用户信息 -->
    <user-business-card ref="userBusinessCard" />
  </div>
</template>

<script>
import { ServeSearchUser } from "@/api/user";

import UserBusinessCard from "@/components/user/UserBusinessCard";

export default {
  name: "user-search",
  components: {
    UserBusinessCard,
  },
  data() {
    return {
      loading: false,
      isShow: false,
      input: "",
      isError: false,
    };
  },

  methods: {
    // 显示窗口
    open() {
      this.isShow = true;
    },

    // 关闭窗口
    close() {
      this.isShow = false;
    },

    onSubmit() {
      if (this.input == "") {
        return false;
      }

      this.loading = true;
      ServeSearchUser({
        mobile: this.input,
      })
        .then((res) => {
          if (res.code == 200) {
            this.$refs.userBusinessCard.open(res.data.id);
            this.close();
          } else {
            this.isError = true;
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  width: 450px;
  height: 250px;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 2px 8px 0 rgba(31, 35, 41, 0.2);

  .header {
    height: 50px;
    line-height: 50px;
    position: relative;
    text-indent: 20px;
    border-bottom: 1px solid #f5eeee;

    .el-icon-close {
      position: absolute;
      right: 20px;
      top: 15px;
      font-size: 20px;
      cursor: pointer;
    }
  }

  .main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .input {
      width: 85%;

      input {
        border-radius: 0;
      }
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
