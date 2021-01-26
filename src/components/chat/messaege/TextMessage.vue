<template>
  <div
    class="text-message"
    :class="{
      left: float == 'left',
      right: float == 'right',
      'max-width': !fullWidth,
    }"
  >
    <pre
      v-html="content"
      v-href="float == 'right' ? '#ffffff' : 'rgb(9 149 208)'"
    />
  </div>
</template>
<script>
export default {
  name: "TextMessage",
  props: {
    content: {
      type: String | Number,
      default: "",
    },
    float: {
      type: String,
      default: "left",
    },
    fullWidth: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
<style lang="less" scoped>
.text-message {
  min-width: 30px;
  min-height: 30px;
  color: #3a3a3a;
  border-radius: 6px;

  &.max-width {
    max-width: calc(100% - 50px);
  }

  &.left {
    background: #f5f5f5;
  }

  &.right {
    background: #1ebafc;
    color: #fff;
  }

  pre {
    white-space: pre-wrap;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    font-size: 15px;
    padding: 0 10px;
    font-family: "Microsoft YaHei";
    line-height: 25px;
    padding-top: 2px;
  }
}
</style>