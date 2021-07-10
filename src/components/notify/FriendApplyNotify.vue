<template>
  <!-- 新消息提示组件 -->
  <div class="notify-box">
    <div class="lbox">
      <el-avatar size="medium" :src="avatar" />
    </div>
    <div class="rbox">
      <div class="xheader">
        <p class="title">好友申请消息</p>
        <p class="time">{{ datetime }}</p>
      </div>
      <div class="xbody">
        <h4>申请备注:</h4>
        <div>{{ content }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    params: {
      type: Object,
      default() {},
    },
  },
  data() {
    return {
      avatar:
        'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      talk_type: 1,
      nickname: '阿萨纳斯卡',
      content: '阿斯纳俺家你卡萨啊看看番按实际开发n',
      datetime: '2021-06-18 23:15:12',
    }
  },
  computed: {},
  methods: {},
  created() {},
}
</script>
<style lang="less" scoped>
.notify-box {
  width: 300px;
  min-height: 100px;
  // background: rebeccapurple;
  display: flex;
  box-sizing: border-box;
  padding: 5px;

  .lbox {
    flex-basis: 50px;
    flex-shrink: 1;
    display: flex;
    justify-content: center;
  }

  .rbox {
    flex: 1 auto;
    margin-left: 5px;

    .xheader {
      height: 35px;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 13px;
        font-weight: 500;
      }
      .time {
        font-size: 12px;
      }
    }

    .xbody {
      min-height: 60px;
      width: 100%;

      h4 {
        font-size: 13px;
        font-weight: 400;
        margin-bottom: 3px;
      }
      div {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        background: #f3f5f7;
        font-size: 13px;
        padding: 5px;
        border-radius: 5px;
      }
    }
  }
}
</style>
