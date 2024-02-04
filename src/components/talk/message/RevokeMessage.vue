<script setup>
import { formatTime } from '@/utils/datetime'

defineProps({
  loginUid: {
    type: Number,
    default: 0
  },
  userId: {
    type: Number,
    default: 0
  },
  talkMode: {
    type: Number,
    default: 0
  },
  nickname: {
    type: String,
    default: ''
  },
  datetime: {
    type: String,
    default: ''
  }
})
</script>
<template>
  <div class="immsg-revoke">
    <div class="content">
      <span v-if="loginUid == userId"> 你撤回了一条消息 | {{ formatTime(datetime) }} </span>
      <span v-else-if="talkMode == 1"> 对方撤回了一条消息 | {{ formatTime(datetime) }} </span>
      <span v-else>
        {{ nickname }} 撤回了一条消息&nbsp;&nbsp;|&nbsp;&nbsp;{{ formatTime(datetime) }}
      </span>
    </div>
  </div>
</template>
<style lang="less" scoped>
.immsg-revoke {
  display: flex;
  justify-content: center;

  .content {
    margin: 10px auto;
    background-color: #f5f5f5;
    font-size: 12px;
    line-height: 30px;
    padding: 0 8px;
    word-break: break-all;
    word-wrap: break-word;
    user-select: none;
    display: inline-block;
    border-radius: 3px;

    span {
      margin: 0 5px;
    }
  }
}

html[theme-mode='dark'] {
  .immsg-revoke {
    .content {
      color: rgba(255, 255, 255, 0.5);
      background: #2c2c32;
    }
  }
}
</style>
