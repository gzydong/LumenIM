<script setup lang="ts">
import { useDialogueStore } from '@/store'
import { DoubleDown } from '@icon-park/vue-next'
defineProps(['modelValue'])

const dialogueStore = useDialogueStore()
</script>

<template>
  <!-- 置底按钮 -->
  <div class="skip-bottom pointer" :class="{ show: modelValue }">
    <span v-if="dialogueStore.unreadBubble"
      >{{ dialogueStore.unreadBubble }} 条未读消息</span
    >
    <span v-else>回到底部</span>
    <n-icon size="14" color="#fff" :component="DoubleDown" />
  </div>
</template>

<style lang="less" scoped>
.skip-bottom {
  position: absolute;
  right: 58px;
  bottom: -40px;
  min-width: 100px;
  height: 28px;
  font-size: 12px;
  background-color: #1ebafc;
  color: #ffffff;
  display: flex;
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

html[data-theme='dark'] {
  .skip-bottom {
    background-color: #2c2c32;
  }
}
</style>
