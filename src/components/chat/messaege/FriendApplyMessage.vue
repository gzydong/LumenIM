<template>
  <!-- 好友申请消息 -->
  <div class="apply-card">
    <div class="card-header">
      <img class="avatar" :src="avatar" />
      <div class="nickname">No. {{ nickname }}</div>
      <div class="datetime">{{ datetime }}</div>
      <div class="remarks">
        <span>备注信息：{{ remarks }}</span>
      </div>
    </div>

    <div class="card-footer">
      <div class="mini-button" @click="handle(1)">同意</div>
      <el-divider direction="vertical"></el-divider>
      <div class="mini-button" @click="handle(2)">拒绝</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FriendApplyMessage',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      avatar:
        'http://im-img.gzydong.club/media/images/avatar/20210602/60b6f03598ed0104301.png',
      nickname: '独特态度',
      datetime: '05/09 12:13 分',
      remarks: '编辑个签，展示我的独特态度 展示我的独特态度。',
      apply_id: 0,
    }
  },
  created() {},
  methods: {
    handle(type) {
      alert(type)
    },
  },
}
</script>
<style lang="less" scoped>
.apply-card {
  position: relative;
  width: 170px;
  min-height: 180px;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.5s;
  box-sizing: border-box;
  background-image: linear-gradient(-84deg, #1ab6ff 0, #1ab6ff 0, #82c1f3 100%);
  // #028fff

  &:hover {
    transform: scale(1.02);
  }

  .card-header {
    position: relative;
    width: 100%;
    height: 135px;

    .avatar {
      position: absolute;
      top: 18px;
      left: 8px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: white;
    }

    .nickname {
      position: absolute;
      top: 15px;
      right: 8px;
      width: 90px;
      height: 25px;
      font-size: 10px;
      text-align: center;
      line-height: 25px;
      color: white;
      border-bottom: 1px dashed white;
    }

    .datetime {
      position: absolute;
      top: 42px;
      right: 11.5px;
      color: white;
      font-size: 10px;
      transform: scale(0.9);
    }

    .remarks {
      position: absolute;
      bottom: 5px;
      color: white;
      font-size: 10px;
      padding: 3px 5px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      transform: scale(0.95);
    }
  }

  .card-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    border-top: 1px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

    /deep/.el-divider {
      background: white;
    }

    .mini-button {
      display: flex;
      width: 50px;
      height: 25px;
      margin: 0 10px;
      text-align: center;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      color: white;
      cursor: pointer;

      &:hover {
        font-size: 14px;
      }
    }
  }
}
</style>
