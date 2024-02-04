<script setup>
import './sys-message.less'

defineProps({
  extra: Object,
  data: Object
})
</script>

<template>
  <div class="immsg-systext">
    <div class="sys-text">
      {{ extra.content }}
    </div>
  </div>
</template>

<style lang="less" scoped></style>
