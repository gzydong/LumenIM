<script setup>
import { formatTime } from '@/utils/datetime'

defineProps({
  login_uid: {
    type: Number,
    default: 0
  },
  user_id: {
    type: Number,
    default: 0
  },
  talk_type: {
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
  <div class="im-message-revoke">
    <div class="content">
      <span v-if="login_uid == user_id"> 你撤回了一条消息 | {{ formatTime(datetime) }} </span>
      <span v-else-if="talk_type == 1"> 对方撤回了一条消息 | {{ formatTime(datetime) }} </span>
      <span v-else>
        "{{ nickname }}" 撤回了一条消息 |
        {{ formatTime(datetime) }}
      </span>
    </div>
  </div>
</template>
<style lang="less" scoped>
.im-message-revoke {
  display: flex;
  justify-content: center;

  .content {
    margin: 10px auto;
    background-color: #f5f5f5;
    font-size: 11px;
    line-height: 30px;
    padding: 0 8px;
    word-break: break-all;
    word-wrap: break-word;
    color: #979191;
    user-select: none;
    font-weight: 300;
    display: inline-block;
    border-radius: 3px;

    span {
      margin: 0 5px;
    }
  }
}

html[theme-mode='dark'] {
  .im-message-revoke {
    .content {
      background: unset;
    }
  }
}
</style>
