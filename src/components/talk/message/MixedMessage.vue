<script lang="ts" setup>
import { NImage } from 'naive-ui'
import { textReplaceEmoji } from '@/utils/emojis'
import { textReplaceLink } from '@/utils/strings'
import { getImageInfo } from '@/utils/functions'
import { ITalkRecordExtraMixed, ITalkRecord } from '@/types/chat'

const props = defineProps<{
  extra: ITalkRecordExtraMixed
  data: ITalkRecord
  maxWidth?: Boolean
}>()

const float = props.data.float

const img = (src, width = 200) => {
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
  <div
    class="im-message-mixed"
    :class="{
      left: float == 'left',
      right: float == 'right',
      maxwidth: maxWidth
    }"
  >
    <pre>
      <template v-for="(item) in extra.items" :key="item.id">
   
        <template v-if="item.type === 1">
               <span v-html="textReplaceEmoji(textReplaceLink(item.content))" />
        </template>

        <template v-else-if="item.type === 3">
          <div
            :style="img(item.content, 300)"
            style="display: flex; margin: 5px 0;border-radius: 8px;overflow: hidden;;"
          >
            <n-image :src="item.content"></n-image>
          </div>
        </template>
      </template>
    </pre>
  </div>
</template>

<style lang="less" scoped>
.im-message-mixed {
  min-width: 30px;
  min-height: 30px;
  padding: 3px;
  color: var(--im-message-left-text-color);
  background: var(--im-message-left-bg-color);
  border-radius: 0px 10px 10px 10px;

  &.right {
    background-color: var(--im-message-right-bg-color);
    color: var(--im-message-right-text-color);
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
