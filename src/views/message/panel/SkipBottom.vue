<script lang="ts" setup>
import { DoubleDown } from '@icon-park/vue-next'

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  unread: {
    type: Number,
    default: 0
  }
})

// 聊天版本滚动到底部
const onSkipBottom = () => {
  const el = document.getElementById('imChatPanel')
  el?.scrollTo({
    top: el.scrollHeight + 1000,
    behavior: 'smooth'
  })
}
</script>

<template>
  <!-- 置底按钮 -->
  <div class="skip-bottom pointer" :class="{ show }" @click="onSkipBottom">
    <span v-if="unread">{{ unread }} 条未读消息</span>
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
  background-color: var(--im-primary-color);
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

html[theme-mode='dark'] {
  .skip-bottom {
    background-color: #2c2c32;
  }
}
</style>
