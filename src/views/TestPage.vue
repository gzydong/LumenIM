<template>
  <div class="test-page">
    <!-- <visit-card-message /> -->
    <el-button type="primary">重新发送({{ SmsLock.time }}s)</el-button>
    <el-button type="primary" @click="sendSms">发送</el-button>
    <el-button type="primary" @click="toHome">首页</el-button>
  </div>
</template>

<script>
import SmsLock from '@/plugins/sms-lock'

export default {
  name: 'TestPage',
  data() {
    return {
      SmsLock: null,
    }
  },
  methods: {
    sendSms() {
      this.SmsLock.start()
    },

    toHome() {
      this.$router.push({
        path: '/',
      })
    },
  },
  created() {
    this.SmsLock = new SmsLock('REGISTER_SMS', 120)
  },
  destroyed() {
    this.SmsLock.clearInterval()
  },
}
</script>
<style lang="less" scoped>
.test-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
