<script setup>
defineProps({
  extra: Object,
  data: Object,
})
</script>

<template>
  <video
    class="im-message-video"
    ref="video"
    height="300"
    controls
    preload="metadata"
    :poster="extra.cover"
    :src="extra.url"
  />
</template>

<style lang="less" scoped>
.im-message-video {
  border-radius: 5px;
}
</style>
