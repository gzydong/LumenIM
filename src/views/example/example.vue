<script setup>
import { ref } from 'vue'
import { NMention,InternalSelectMenu } from 'naive-ui'

const options = [
  {
    label: '1杰·盖茨比',
    value: '12jay gatsby',
  },
  {
    label: '2黛西·布坎南',
    value: 'daiadsasy buchanan',
  },
  {
    label: '3尼克·卡拉威',
    value: 'nicsdfk carraway',
  },
  {
    label: '4杰·盖茨比',
    value: '1jasdy gatsby',
  },
  {
    label: '5黛西·布坎南',
    value: '2daisy buchanan',
  },
  {
    label: '6尼克·卡拉威',
    value: '3nick carraway',
  },
  {
    label: '7杰·盖茨比',
    value: '4jay gatsby',
  },
  {
    label: '8黛西·布坎南',
    value: '5daisy buchanan',
  },
  {
    label: '9尼克·卡拉威',
    value: '6nick carraway',
  },
]

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

  <n-mention :options="options" default-value="@" type="text" />
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
