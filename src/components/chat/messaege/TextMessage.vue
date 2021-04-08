<template>
  <div
    class="text-message"
    :class="{
      left: float == 'left',
      right: float == 'right',
      'max-width': !fullWidth,
    }"
  >
    <div v-if="arrow" class="arrow"></div>
    <pre v-html="html" />
  </div>
</template>
<script>
import { textReplaceLink } from '@/utils/functions'
import { textReplaceEmoji } from '@/utils/emojis'

export default {
  name: 'TextMessage',
  props: {
    content: {
      type: [String, Number],
      default: '',
    },
    float: {
      type: String,
      default: 'left',
    },
    fullWidth: {
      type: Boolean,
      default: true,
    },
    arrow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      html: '',
    }
  },
  created() {
    const text = textReplaceLink(
      this.content,
      this.float == 'right' ? '#ffffff' : 'rgb(9 149 208)'
    )

    this.html = textReplaceEmoji(text)
  },
}
</script>
<style lang="less" scoped>
@bg-left-color: #f5f5f5;
@bg-right-color: #1ebafc;

.text-message {
  position: relative;
  min-width: 30px;
  min-height: 30px;
  border-radius: 5px;
  padding: 5px;

  .arrow {
    position: absolute;
    width: 0;
    height: 0;
    font-size: 0;
    border: 5px solid;
    top: 6px;
    left: -10px;
  }

  &.max-width {
    max-width: calc(100% - 50px);
  }

  &.left {
    color: #3a3a3a;
    background: @bg-left-color;

    .arrow {
      border-color: transparent @bg-left-color transparent transparent;
    }
  }

  &.right {
    color: #fff;
    background: @bg-right-color;

    .arrow {
      right: -10px;
      left: unset;
      border-color: transparent transparent transparent @bg-right-color;
    }
  }

  pre {
    white-space: pre-wrap;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    font-size: 15px;
    padding: 3px 10px;
    font-family: 'Microsoft YaHei';
    line-height: 25px;
  }
}
</style>
