<script lang="ts" setup>
import { NImage } from 'naive-ui'
import { textReplaceEmoji } from '@/utils/emojis'
import { textReplaceLink } from '@/utils/string'
import { getImageInfo } from '@/utils/file'

defineProps<{
  items: Array<{
    // 1: text, 3: image
    type: string
    content: string
  }>
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

  let h = info.height / (info.width / width)

  return {
    width: width + 'px',
    height: h + 'px'
  }
}
</script>

<template>
  <div class="im-message-mixed">
    <pre>
      <span class="line" v-for="(item,index) in items" :key="index">
   
        <template v-if="item.type === 'text'">
               <span v-html="textReplaceEmoji(textReplaceLink(item.content))" />
        </template>

        <template v-else-if="item.type === 'image'">
          <div
            :style="img(item.content, 300)"
            style="display: flex; margin: 3px 0;border-radius: 3px;overflow: hidden;"
          >
            <n-image :src="item.content"></n-image>
          </div>
        </template>
      </span>
    </pre>
  </div>
</template>

<style lang="less" scoped>
.im-message-mixed {
  min-width: 30px;
  min-height: 30px;
  padding: 3px;
  background: var(--im-message-left-bg-color);
  border-radius: 5px;

  pre {
    display: flex;
    flex-direction: column;
    white-space: pre-wrap;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    font-size: 13px;
    padding: 3px 5px;
    line-height: 1.8;

    :deep(a) {
      color: var(--im-primary-color);
      text-decoration: revert;
    }

    :deep(.emoji) {
      vertical-align: text-bottom;
      margin: 0 3px;
    }

    .line {
      display: flex;
    }
  }
}
</style>
