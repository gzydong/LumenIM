<script lang="ts" setup>
import { textReplaceEmoji } from '@/utils/emojis'
import { textReplaceLink, textReplaceMention } from '@/utils/string'

const props = defineProps<{
  content: string
  role: string
}>()

let textContent = props.content || ''

textContent = textReplaceLink(textContent)
textContent = textReplaceEmoji(textContent)
textContent = textReplaceMention(textContent)
</script>

<template>
  <div
    class="immsg-text"
    :class="{
      user: role === 'user'
    }"
  >
    <pre v-html="textContent" />
  </div>
</template>

<style lang="less" scoped>
.immsg-text {
  min-width: 30px;
  min-height: 30px;
  padding: 3px;
  border-radius: 5px;
  background: var(--chat-assistant-bg-color);

  &.user {
    background: var(--chat-user-bg-color);
  }

  pre {
    white-space: pre-wrap;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    font-size: 13px;
    padding: 3px 5px;
    font-family:
      system,
      -apple-system,
      BlinkMacSystemFont,
      PingFang SC,
      Segoe UI,
      Microsoft YaHei,
      wenquanyi micro hei,
      Hiragino Sans GB,
      Hiragino Sans GB W3,
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      Fira Sans,
      Droid Sans,
      Helvetica Neue,
      Helvetica,
      Arial,
      sans-serif;
    line-height: 1.8;

    :deep(.emoji) {
      vertical-align: text-bottom;
      margin: 0 3px;
    }

    :deep(a) {
      color: var(--im-primary-color);
      text-decoration: revert;
    }
  }
}
</style>
