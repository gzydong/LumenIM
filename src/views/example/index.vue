<script lang="ts" setup>
import { h } from 'vue'
const sd = h('text-message', {
  role: 'user',
  content: 'akfaml'
})
</script>

<template>
  <div class="el-container">
    <text-message content="asdfakj" role="user" />
    <sd />

    <component :is="sd" />
  </div>
</template>

<style scoped lang="less">
.el-container {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
</style>
