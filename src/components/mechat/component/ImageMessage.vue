<script lang="ts" setup>
import { NImage } from 'naive-ui'
import { getImageInfo } from '@/utils/file'

defineProps<{
  url: string
}>()

const img = (src: string, width = 200) => {
  const info = getImageInfo(src)

  if (info.width == 0 || info.height == 0) {
    return {}
  }

  if (info.width < width) {
    return {
      width: `${info.width}px`,
      height: `${info.height}px`
    }
  }

  return {
    width: width + 'px',
    height: `${info.height / (info.width / width)}px`
  }
}
</script>
<template>
  <section class="immsg-image" :style="img(url, 250)">
    <n-image :src="url" object-fit="cover" />
  </section>
</template>
<style lang="less" scoped>
.immsg-image {
  padding: 3px;
  border-radius: 5px;
  background: var(--im-message-left-bg-color);
  min-width: 30px;
  min-height: 30px;
  max-width: min(500px, 60%);
  width: 100%;
  display: flex;

  &.right {
    background: var(--im-message-right-bg-color);
  }

  :deep(.n-image img) {
    width: 100%;
    height: 100%;
    border-radius: 3px;
  }
}
</style>
