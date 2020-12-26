<template>
  <div>
    <div class="not-found">
      <div class="not-found-left">
        <svg-icon icon-class="not-fount" class="svg-notfount" />
      </div>
      <div class="not-found-right">
        <h1>404</h1>
        <p>抱歉，你访问的页面不存在或仍在开发中...</p>
        <div>
          <el-button type="primary" size="small" @click="toHome">返回首页 ({{second}}S)</el-button>
        </div>
      </div>
    </div>

    <div class="fly bg-fly-circle1"></div>
    <div class="fly bg-fly-circle2"></div>
    <div class="fly bg-fly-circle3"></div>
    <div class="fly bg-fly-circle4"></div>
  </div>
</template>

<script>
  export default {
    name: 'NotFoundPage',
    data() {
      return {
        second: 9,
        setInterval: null,
      };
    },
    created() {
      this.setInterval = setInterval(() => {
        this.second--;
        if (this.second == 0) {
          clearInterval(this.setInterval);
          this.toHome();
        }
      }, 1000);
    },
    destroyed() {
      clearInterval(this.setInterval);
    },
    methods: {
      toHome() {
        this.$router.push({
          path: '/'
        });
      }
    }
  };

</script>
<style scoped>
  .not-found {
    position: fixed;
    width: 600px;
    height: 300px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .not-found-left {
    width: 300px;
    height: 300px;
    float: left;
  }

  .not-found .not-found-left .svg-notfount {
    width: 300px;
    height: 300px;
  }

  .not-found-right {
    width: 300px;
    height: 300px;
    float: left;
  }

  .not-found-right h1 {
    margin-bottom: 24px;
    color: #434e59;
    font-weight: 600;
    font-size: 72px;
    line-height: 72px;
    padding-left: 30px;
    margin-top: 50px;
  }

  .not-found-right p {
    padding-left: 30px;
    margin-bottom: 16px;
    color: rgba(0, 0, 0, .45);
    font-size: 20px;
    line-height: 28px;
  }

  .not-found-right div {
    padding-left: 30px;
    margin-top: 20px;
  }
</style>
