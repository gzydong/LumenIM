<template>
  <div class="visit-card-message">
    <div class="user flex-center">
      <div class="avatar flex-center">
        <el-avatar :size="28" :src="avatar" />
      </div>
      <div class="content flex-center">
        <p class="ellipsis">{{ nickname }}</p>
      </div>
      <div class="tools flex-center">
        <span class="flex-center pointer">
          <i class="el-icon-plus" /> 加好友
        </span>
      </div>
    </div>
    <div class="sign"><span>个性签名 : </span>{{ sign }}</div>
    <div class="share no-select ellipsis">
      <a class="pointer" @click="openVisitCard(friendId)">你是谁?</a>
      分享了用户名片，可点击添加好友 ...
    </div>
  </div>
</template>
<script>
export default {
  name: 'VisitCardMessage',
  data() {
    return {
      userId: 0,
      friendId: 0,
      avatar:
        'http://im-serve0.gzydong.club/static/image/sys-head/2019012107542668696.jpg',
      sign:
        '这个社会，是赢家通吃，输者一无所有，社会，永远都是只以成败论英雄。',
      nickname:
        '氨基酸纳氨基酸纳氨基酸纳氨基酸纳氨基酸纳氨基酸纳氨基酸纳氨基酸纳',
    }
  },
  created() {},
  methods: {
    openVisitCard(user_id) {
      this.$emit('openVisitCard', user_id)
    },
  },
}
</script>
<style lang="less" scoped>
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.visit-card-message {
  min-height: 130px;
  min-width: 100px;
  max-width: 300px;
  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ece5e5;
  transition: all 0.5s;

  &:hover {
    box-shadow: 0 0 8px #e2d3d3;
    transform: scale(1.01);
  }

  .user {
    height: 40px;
    overflow: hidden;
    box-sizing: border-box;
    > div {
      height: inherit;
    }

    .avatar {
      flex-basis: 30px;
      flex-shrink: 0;
    }

    .content {
      flex: 1 1;
      margin: 0 10px;
      font-size: 14px;
      justify-content: flex-start;
      overflow: hidden;
    }

    .tools {
      flex-basis: 60px;
      flex-shrink: 0;

      span {
        width: 65px;
        height: 30px;
        background: #409eff;
        color: white;
        font-size: 13px;
        border-radius: 20px;
        padding: 0 8px;
        transform: scale(0.8);
        user-select: none;

        &:active {
          background: #83b0f3;
          transform: scale(0.83);
        }
      }
    }
  }

  .sign {
    min-height: 22px;
    line-height: 22px;
    border-radius: 3px;
    padding: 5px 8px;
    background: #f3f5f7;
    color: #7d7d7d;
    font-size: 12px;
    margin: 10px 0;
    span {
      font-weight: bold;
    }
  }

  .share {
    font-size: 12px;
    color: #7d7d7d;
    a {
      color: #4cabf7;
    }
  }
}
</style>
