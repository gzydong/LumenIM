<script setup>
defineProps({
  extra: Object,
  data: Object,
})
</script>
<template>
  <div class="system-text-message">
    <div class="content">
      {{ data.content }}
    </div>
  </div>
</template>
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
