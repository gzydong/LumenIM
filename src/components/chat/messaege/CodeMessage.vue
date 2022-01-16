<template>
  <div
    class="code-message"
    :class="{
      'max-height': lineNumber > 6,
      'max-width': maxwidth,
      'full-screen': fullscreen,
    }"
  >
    <i
      :class="
        fullscreen ? 'el-icon-close' : 'iconfont icon-tubiao_chakangongyi'
      "
      @click="fullscreen = !fullscreen"
    />
    <pre class="lum-scrollbar" v-html="formatCode(code, lang)" />
  </div>
</template>
<script>
import Prism from 'prismjs'
import 'prismjs/themes/prism-okaidia.css'

export default {
  name: 'CodeMessage',
  props: {
    code: {
      type: [String, Number],
      default: '',
    },
    lang: {
      type: String,
      default: '',
    },
    maxwidth: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fullscreen: false,
      lineNumber: 0,
    }
  },
  created() {
    this.lineNumber = this.code.split(/\n/).length
  },
  methods: {
    formatCode(code, lang) {
      try {
        return Prism.highlight(code, Prism.languages[lang], lang) + '<br/>'
      } catch (error) {
        return code
      }
    },
  },
}
</script>
<style lang="less" scoped>
.code-message {
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  box-sizing: border-box;

  &.max-width {
    max-width: 500px;
  }

  &.max-height {
    height: 208px;
  }

  i {
    position: absolute;
    right: 0px;
    top: 0px;
    font-size: 16px;
    cursor: pointer;
    color: white;
    display: inline-block;
    opacity: 0;
    width: 50px;
    height: 30px;
    background: #171616;
    text-align: center;
    line-height: 30px;
    border-radius: 0 0 0px 8px;
    transition: 1s ease;
  }

  &:hover {
    i {
      opacity: 1;
    }
  }

  pre {
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    overflow: auto;
    padding: 30px 10px 10px 10px;
    line-height: 24px;
    background: #272822;
    color: #d5d4d4;
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
      'Courier New', monospace;
    font-size: 85%;

    &.lum-scrollbar {
      &::-webkit-scrollbar {
        background-color: black;
      }
    }
  }

  pre:before {
    position: absolute;
    left: 12px;
    z-index: 0;
    margin-top: -18px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #fc625d;
    box-shadow: 20px 0 #fdbc40, 40px 0 #35cd4b;
    content: ' ';
  }

  &.full-screen {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    max-width: unset;
    max-height: unset;
    border-radius: 0px;
    background: #272822;
    z-index: 99999999;

    i {
      position: fixed;
      top: 15px;
      right: 15px;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 24px;

      &:active {
        box-shadow: 0 0 5px 0px #ccc;
      }
    }
  }
}
</style>
