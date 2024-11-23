<script lang="ts" setup>
defineProps<{
  msgType?: number
}>()
</script>

<template>
  <div class="immsg-unknown">未知消息类型 [msg_type={{ msgType }}]</div>
</template>

<style lang="less" scoped>
.immsg-unknown {
  height: 35px;
  line-height: 35px;
  border-radius: 20px;
  background: var(--chat-assistant-bg-color);
  padding: 0px 12px;
}
</style>
