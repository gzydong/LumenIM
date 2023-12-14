<script lang="ts" setup>
import { textReplaceEmoji } from '@/utils/emojis'
import { textReplaceLink, textReplaceMention } from '@/utils/strings'
import { ITalkRecordExtraText, ITalkRecord } from '@/types/chat'

const props = defineProps<{
  extra: ITalkRecordExtraText
  data: ITalkRecord
  maxWidth?: boolean
  source?: 'panel' | 'forward' | 'history'
}>()

const float = props.data.float

let textContent = props.extra?.content || ''

textContent = textReplaceLink(textContent)

if (props.data.talk_type == 2) {
  textContent = textReplaceMention(textContent, '#1890ff')
}

textContent = textReplaceEmoji(textContent)
</script>

<template>
  <div
    class="im-message-text"
    :class="{
      left: float == 'left',
      right: float == 'right',
      maxwidth: maxWidth,
      'radius-reset': source != 'panel'
    }"
  >
    <pre v-html="textContent" />
  </div>
</template>

<style lang="less" scoped>
.im-message-text {
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

  &.radius-reset {
    border-radius: 0;
  }

  pre {
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

    :deep(a) {
      color: #2196f3;
      text-decoration: revert;
    }
  }
}
</style>
