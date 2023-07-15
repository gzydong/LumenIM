<script setup lang="ts">
import { NImage } from 'naive-ui'
import { textReplaceEmoji } from '@/utils/emojis'
import { textReplaceLink } from '@/utils/strings'
import { Data, MixedExtra } from './types.d'
import { getImageInfo } from '@/utils/functions'

const props = defineProps<{
  extra: MixedExtra
  data: Data
  maxWidth: Boolean
}>()

const float = props.data.float

const maxWidth = (src, width = 200) => {
  const info = getImageInfo(src)

  if (info.width == 0) {
    return width
  }

  if (info.width < width) {
    return info.width
  }

  return width
}
</script>

<template>
  <div
    class="text-message"
    :class="{
      left: float == 'left',
      right: float == 'right',
      maxwidth: maxWidth,
    }"
  >
    <pre>
      <template v-for="item in extra.items">
        <template v-if="item.type === 1">
            <span v-html="textReplaceEmoji(textReplaceLink(item.content))" />
        </template>

        <template v-else-if="item.type === 3">
          <n-image :width="maxWidth(item.content, 500)" :src="item.content" object-fit="contain" :style="{
            borderRadius: '10px',
            margin: '5px 0',
            overflow: 'hidden',
          }" />
        </template>
      </template>
    </pre>
  </div>
</template>

<style lang="less" scoped>
.text-message {
  position: relative;
  min-width: 30px;
  min-height: 30px;
  padding: 3px;
  color: #333;
  background: #eff0f1;
  border-radius: 0px 10px 10px 10px;

  &.right {
    background-color: #daf3fd;
    border-radius: 10px 0px 10px 10px;
  }

  &.maxwidth {
    max-width: 70%;
  }

  pre {
    display: flex;
    flex-direction: column;
    white-space: pre-wrap;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    font-size: 14px;
    padding: 3px 5px;
    font-family: 'PingFang SC', 'Microsoft YaHei', 'Alibaba PuHuiTi 2.0 45';
    line-height: 25px;

    :deep(a) {
      color: #2196f3;
      text-decoration: revert;
    }
  }
}
</style>
