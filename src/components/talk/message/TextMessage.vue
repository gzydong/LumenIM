<script setup>
import { textReplaceEmoji } from '@/utils/emojis'
import { textReplaceLink, textReplaceMention } from '@/utils/strings'
const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  float: {
    type: String,
    default: 'right',
  },
  arrow: {
    type: Boolean,
    default: true,
  },
})

let textContent = textReplaceLink(props.content, '#2196F3')
textContent = textReplaceMention(textContent)
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
  border-radius: 3px;
  padding: 3px;
  color: #000000;
  background: #eff0f1;

  &.right {
    // color: #fff;
    // background: #1ebafc;
    background-color: #daf3fd;
  }

  pre {
    white-space: pre-wrap;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    font-size: 14px;
    padding: 3px 10px;
    font-family: 'Microsoft YaHei';
    line-height: 25px;

    :deep(.emoji) {
      vertical-align: text-bottom;
      margin: 0 5px;
    }
    a {
      color: blue;
    }

    img {
      vertical-align: text-bottom;
    }
  }
}
</style>
