<template>
  <div>
    <div class="container">
      <h4>消息通知设置</h4>
      <el-row type="flex" class="list-item">
        <el-col :span="20" class="left-col">
          <h4>新消息提示音</h4>
          <p>{{ notifyCueTone ? '已开启' : '已关闭' }}</p>
        </el-col>
        <el-col :span="4" class="right-col">
          <span class="action">
            <el-switch v-model="notifyCueTone" @change="changeNotifyCueTone" />
          </span>
        </el-col>
      </el-row>

      <el-row type="flex" class="list-item">
        <el-col :span="20" class="left-col">
          <h4>推送键盘输入消息</h4>
          <p>{{ keyboardEvent ? '已开启' : '已关闭' }}</p>
        </el-col>
        <el-col :span="4" class="right-col">
          <span class="action">
            <el-switch v-model="keyboardEvent" @change="changeKeyboardEvent" />
          </span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'NotificationPage',
  data() {
    return {
      notifyCueTone: true,
      keyboardEvent: true,
    }
  },
  created() {
    const { notifyCueTone, keyboardEventNotify } = this.$store.state.settings

    this.notifyCueTone = notifyCueTone
    this.keyboardEvent = keyboardEventNotify
  },
  methods: {
    // 触发修改消息提示音状态
    changeNotifyCueTone(value) {
      this.$store.commit('SET_NOTIFY_CUE_TONE', value)
    },

    // 修改键盘消息推送状态
    changeKeyboardEvent(value) {
      this.$store.commit('SET_KEYBOARD_EVENT_NOTIFY', value)
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
