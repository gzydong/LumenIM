<script setup>
import { ref } from 'vue'

const srr = '/asdfas/icon.png'
</script>

<template>
  <n-avatar
    :style="{
      color: 'white',
      backgroundColor: '#508afe',
    }"
    round
    :src="srr"
    fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
  >
    M
  </n-avatar>
</template>

<style lang="less">
.mention {
  color: #428be5;
}
</style>
<style lang="less" scoped>
.me-editor {
  width: 500px;
  height: 300px;
  border: 1px solid red;
  margin: 200px auto;
  overflow: auto;
}
.mention {
  color: #428be5;
}

.me-editor[contenteditable]:empty:before {
  content: attr(placeholder);
  color: #cccccc;
}
.me-editor[contenteditable]:focus {
  content: none;
}
</style>
