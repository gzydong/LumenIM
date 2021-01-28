<template>
  <div class="code-message" :class="{ 'full-screen': fullscreen }">
    <i
      :class="
        fullscreen ? 'el-icon-close' : 'iconfont icon-tubiao_chakangongyi'
      "
      @click="fullscreen = !fullscreen"
    ></i>
    <pre v-html="formatCode(code, lang)" class="lum-scrollbar"></pre>
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
    };
  },
  methods: {
    formatCode(code, lang) {
      try {
        return Prism.highlight(code, Prism.languages[lang], lang) + "<br/>";
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
  height: 200px;
  overflow: hidden;
  border-radius: 5px;
  width: 100%;

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
    overflow: auto;
    padding: 10px;
    line-height: 24px;
    background: #272822;
    color: #d5d4d4;
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace;
    font-size: 85%;
  }

  &.full-screen {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
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