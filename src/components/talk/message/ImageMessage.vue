<script lang="ts" setup>
import { NImage } from 'naive-ui'
import { getImageInfo } from '@/utils/functions'
import { ITalkRecordExtraImage, ITalkRecord } from '@/types/chat'

defineProps<{
  extra: ITalkRecordExtraImage
  data: ITalkRecord
  maxWidth?: Boolean
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
  <section
    class="im-message-image"
    :class="{ left: data.float === 'left' }"
    :style="img(extra.url, 350)"
  >
    <n-image :src="extra.url" />
  </section>
</template>
<style lang="less" scoped>
.im-message-image {
  overflow: hidden;
  padding: 5px;
  border-radius: 5px;
  background: var(--im-message-left-bg-color);
  min-width: 30px;
  min-height: 30px;

  &.left {
    background: var(--im-message-right-bg-color);
  }

  :deep(.n-image img) {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
}
</style>
