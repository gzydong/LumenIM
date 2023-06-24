<script setup lang="ts">
import { DoubleDown } from '@icon-park/vue-next'
defineProps(['modelValue'])
</script>

<template>
  <!-- 置底按钮 -->
  <div class="skip-bottom pointer" :class="{ show: modelValue }">
    <span>回到底部</span>
    <n-icon size="14" color="#fff" :component="DoubleDown" />
  </div>
</template>

<style lang="less" scoped>
.skip-bottom {
  position: absolute;
  // right: -35px;
  // top: 15%;
  // right: -35px;
  right: 58px;
  bottom: -40px;
  width: 100px;
  height: 28px;
  font-size: 12px;
  background-color: #1ebafc;
  color: white;
  display: flex;
  // flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  transition: bottom 1s ease-in-out;
  border-radius: 10px 10px 0 0;

  span {
    margin-right: 5px;
  }

  &.show {
    bottom: 0px;
  }
}
</style>
