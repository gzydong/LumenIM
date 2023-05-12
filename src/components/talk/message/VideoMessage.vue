<script setup>
defineProps({
  extra: Object,
  data: Object,
})
</script>

<template>
  <video
    ref="video"
    height="300"
    controls
    preload="metadata"
    :poster="extra.cover"
    :src="extra.url"
  />
</template>

<style lang="less" scoped>
video {
  border-radius: 5px;
}
</style>
