<script setup>
import { NImage } from 'naive-ui'
import { getImageInfo } from '@/utils/functions'

defineProps({
  extra: Object,
  data: Object,
})

const img = (src, width = 200) => {
  const info = getImageInfo(src)

  if (info.width < width) {
    return {
      width: `${info.width}px`,
      height: `${info.height}px`,
    }
  }

  return {
    width: width + 'px',
    height: parseInt(info.height / (info.width / width)) + 'px',
  }
}
</script>
<template>
  <section
    class="image-message"
    :class="{ left: data.float === 'left' }"
    :style="img(extra.url, 350)"
  >
    <n-image :src="extra.url" />
  </section>
</template>
<style lang="less" scoped>
.image-message {
  overflow: hidden;
  padding: 5px;
  border-radius: 5px;
  background-color: #daf3fd;
  min-width: 30px;
  min-height: 30px;

  &.left {
    background-color: #eff0f1;
  }

  :deep(.n-image img) {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
}
</style>
