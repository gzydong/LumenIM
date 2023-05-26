<script setup>
import { Remind } from '@icon-park/vue-next'

import { useDialogueStore } from '@/store'

const dialogueStore = useDialogueStore()
</script>

<template>
  <div
    class="unread-bubble pointer"
    :class="{
      show: dialogueStore.unreadBubble,
    }"
  >
    <n-icon size="18" color="#fff" :component="Remind" />
    <span>{{ dialogueStore.unreadBubble }}条新消息，请注意查看！</span>
  </div>
</template>

<style lang="less" scoped>
.unread-bubble {
  position: absolute;
  left: -300px;
  bottom: 20px;
  min-width: 100px;
  height: 35px;
  background-color: #1ebafc;
  border-radius: 0 20px 20px 0;
  display: flex;
  align-items: center;
  padding: 0 15px;
  color: #ffffff;
  transition: left 1s ease-in-out;

  span {
    margin-left: 5px;
  }

  &.show {
    left: 0px;
  }
}
</style>
