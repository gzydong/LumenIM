<script setup>
import { ref } from 'vue'
import { Close } from '@vicons/ionicons5'
import { storage } from '@/utils/storage'

let isShow = ref(false)

let num = storage.get('reward', 0)

setTimeout(() => {
  isShow.value = num <= 2
}, 15000)

const onClose = () => {
  isShow.value = false
  storage.set('reward', num + 1)
}
</script>

<template>
  <div>
    <div class="reward" v-show="isShow">
      <div class="title">
        <span>开源支持</span>
        <n-icon :size="24" :component="Close" @click="onClose" />
      </div>

      <div class="main">
        <div class="pay-box">
          <img
            src="https://cdn.learnku.com/uploads/images/202101/30/46424/PPYHOUhCb4.jpg"
          />
          <p>支付宝</p>
        </div>
        <div class="pay-box">
          <img
            src="https://cdn.learnku.com/uploads/images/202101/30/46424/XLmCJjbvlQ.png"
          />
          <p>微信</p>
        </div>
      </div>
      <div class="footer">
        开源不易，如果你觉得项目对你有帮助，可以请作者喝杯咖啡☕️！鼓励下...
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.reward {
  position: fixed;
  width: 550px;
  height: 400px;
  right: 20px;
  bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 0 12px #ccc;
  border: 1px solid rgb(228, 225, 225);
  box-sizing: border-box;
  overflow: hidden;
  user-select: none;
  z-index: 9999;
  background: white;

  .title {
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    width: 100%;
    font-size: 16px;
    background: #f9f7f7;
    position: relative;
    box-sizing: border-box;

    i {
      position: absolute;
      right: 15px;
      top: 18px;
      font-size: 18px;
      cursor: pointer;
    }
  }

  .main {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .pay-box {
      width: 200px;
      height: 240px;
      background: #1977ff;
      margin: 0 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 5px;

      img {
        width: 150px;
        height: 150px;
      }

      p {
        margin-top: 20px;
        color: white;
      }

      &:last-child {
        background: #22ab38;
      }
    }
  }

  .footer {
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 13px;
  }
}
</style>
