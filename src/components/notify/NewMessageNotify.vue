<template>
  <!-- 新消息提示组件 -->
  <div class="notify-box pointer">
    <div class="lbox">
      <el-avatar size="medium" shape="square" :src="avatar" />
    </div>
    <div class="rbox">
      <div class="xheader">
        <p class="title">
          {{ talk_type == 1 ? '私信消息通知' : '群聊消息通知' }}
        </p>
        <p class="time"><i class="el-icon-time" /> {{ datetime | format }}</p>
      </div>
      <div class="xbody">
        <p>@{{ nickname }}</p>
        <div>{{ content }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils/functions'

export default {
  components: {},
  props: {
    avatar: {
      type: String,
      default:
        'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    },
    talk_type: {
      type: Number,
      default: 1,
    },
    nickname: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    datetime: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
  filters: {
    format(datetime) {
      datetime = datetime || new Date()
      return parseTime(datetime, '{m}/{d} {h}:{i} 分')
    },
  },
}
</script>
<style lang="less" scoped>
.notify-box {
  width: 300px;
  min-height: 100px;
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
      height: 25px;
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
      margin-top: 5px;

      p {
        font-size: 13px;
        font-weight: 400;
        color: #fb4208;
        margin-bottom: 4px;
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
