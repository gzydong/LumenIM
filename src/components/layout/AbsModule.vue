<template>
  <div>
    <div class="abs-module" v-show="isShow">
      <div class="abs-box">
        <i class="el-icon-circle-close" @click="close" />
        <a href="https://www.aliyun.com/minisite/goods?userCode=kqyyppx2">
          <img src="~@/assets/image/aliyun-abs.jpg" width="300" />
        </a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShow: false,
    }
  },
  created() {
    if (this.getNum() <= 2) {
      setTimeout(() => {
        this.isShow = true
      }, 1000 * 60 * 2)
    }
  },
  methods: {
    getNum() {
      return parseInt(sessionStorage.getItem('ABS_BOX')) || 0
    },
    close() {
      sessionStorage.setItem('ABS_BOX', this.getNum() + 1)
      this.isShow = false
    },
  },
}
</script>
<style lang="less" scoped>
.abs-module {
  position: fixed;
  width: 300px;
  height: 163.63px;
  right: 20px;
  top: 20px;
  border-radius: 5px;
  z-index: 9999;
  overflow: hidden;
  transition: all 2s;
  animation: absfade 1000ms infinite;

  .abs-box {
    width: 100%;
    height: 100%;
    position: relative;

    i {
      position: absolute;
      right: 10px;
      top: 10px;
      color: white;
      cursor: pointer;
      font-size: 22px;
    }
  }
}

@keyframes absfade {
  from {
    transform: scale(1);
  }

  50% {
    transform: scale(1.02);
  }

  to {
    transform: scale(1);
  }
}
</style>
