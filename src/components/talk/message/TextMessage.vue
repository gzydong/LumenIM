<script setup>
import { textReplaceEmoji } from '@/utils/emojis'
import { textReplaceLink, textReplaceMention } from '@/utils/strings'

const props = defineProps({
  extra: Object,
  data: Object,
})

const float = props.data.float

let textContent = props.data.content
// let textContent = textReplaceLink(props.data.content, '#2196F3')

// // 只有对话类型为群聊时，需要解析@信息
if (props.data.talk_type == 2) {
  textContent = textReplaceMention(textContent)
}

textContent = textReplaceEmoji(textContent)
</script>

<template>
  <div
    class="text-message"
    :class="{
      left: float == 'left',
      right: float == 'right',
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
  max-width: 60%;

  &.left {
    background: #eff0f1;
    border-radius: 0px 10px 0px 10px;
  }

  &.right {
    background-color: #daf3fd;
    border-radius: 10px 0px 10px 0px;
  }

  > pre {
    white-space: pre-wrap;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    font-size: 14px;
    padding: 3px 5px;
    font-family: 'Microsoft YaHei';
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
