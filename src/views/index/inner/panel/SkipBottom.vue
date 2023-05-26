<script setup>
import { ExpandDownOne } from '@icon-park/vue-next'
defineProps(['modelValue'])
</script>

<template>
  <!-- 置底按钮 -->
  <div class="skip-bottom pointer" :class="{ show: modelValue }">
    <n-icon size="14" color="#fff" :component="ExpandDownOne" />
    <span>回</span>
    <span>到</span>
    <span>底</span>
    <span>部</span>
  </div>
</template>

<style lang="less" scoped>
.skip-bottom {
  position: absolute;
  right: -35px;
  top: 15%;
  width: 30px;
  height: 100px;
  font-size: 12px;
  background-color: #1ebafc;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  transition: right 1s ease-in-out;

  &.show {
    right: 0px;
  }
}
</style>
