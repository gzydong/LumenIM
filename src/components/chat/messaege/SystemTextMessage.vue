<template>
  <div class="system-text-message">
    <div class="content">{{ content }}</div>
  </div>
</template>
<script>
import { formateTime as sendTime } from '@/utils/functions'

export default {
  name: 'SystemTextMessage',
  props: {
    content: String,
  },
  methods: {
    sendTime,
  },
}
</script>
<style lang="less" scoped>
.system-text-message {
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
  }
}
</style>
