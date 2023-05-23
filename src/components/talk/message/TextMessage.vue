<script setup lang="ts">
import { textReplaceEmoji } from '@/utils/emojis'
import { Data } from './types.d'

const props = defineProps<{
  extra: any
  data: Data
  maxWidth: Boolean
}>()

const float = props.data.float

let textContent = props.data.content

textContent = textReplaceEmoji(textContent)
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
    <pre v-html="textContent" />
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
  border-radius: 0px 10px 0px 10px;

  &.right {
    background-color: #daf3fd;
    border-radius: 10px 0px 10px 0px;
  }

  &.maxwidth {
    max-width: 70%;
  }

  > pre {
    white-space: pre-wrap;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    font-size: 14px;
    padding: 3px 5px;
    font-family: 'PingFang SC', 'Microsoft YaHei', 'Alibaba PuHuiTi 2.0 45';
    line-height: 25px;

    :deep(.emoji) {
      vertical-align: text-bottom;
      margin: 0 5px;
    }

    :deep(img[alt='img']) {
      max-width: 300px;
      border-radius: 3px !important;
      display: block;
      cursor: pointer;
    }

    :deep(a) {
      color: #2196f3;
      text-decoration: revert;
    }
  }
}
</style>
