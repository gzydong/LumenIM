<template>
  <div
    class="code-message"
    :class="{ height: lineNumber > 6, 'full-screen': fullscreen }"
  >
    <i
      :class="
        fullscreen ? 'el-icon-close' : 'iconfont icon-tubiao_chakangongyi'
      "
      @click="fullscreen = !fullscreen"
    ></i>
    <pre class="lum-scrollbar" v-html="formatCode(code, lang)"></pre>
  </div>
</template>
<script>
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";

export default {
  name: "CodeMessage",
  props: {
    code: {
      type: String | Number,
      default: "",
    },
    lang: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      fullscreen: false,
      lineNumber: 0,
    };
  },
  created() {
    this.lineNumber = this.code.split(/\n/).length;
  },
  methods: {
    formatCode(code, lang) {
      try {
        return Prism.highlight(code, Prism.languages[lang], lang)+"<br/>";
      } catch (error) {
        return code;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.code-message {
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  width: 100%;

  &.height {
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
    height: 100%;
    width: 100%;
    overflow: auto;
    padding: 10px;
    line-height: 24px;
    background: #272822;
    color: #d5d4d4;
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace;
    font-size: 85%;

    &.lum-scrollbar {
      &::-webkit-scrollbar {
        background-color: black;
      }
    }
  }

  &.full-screen {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh !important;
    width: 100vw !important;
    max-height: unset;
    border-radius: 0px;
    background: #272822;
    z-index: 99999;

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