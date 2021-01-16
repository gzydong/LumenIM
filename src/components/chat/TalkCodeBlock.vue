<template>
  <div class="base-mask">
    <div
      class="container animated bounceInDown"
      :class="{ 'full-screen': isFullScreen }"
    >
      <el-container class="hv100">
        <el-header class="header padding0" height="50px">
          <div class="tools">
            <span>选择编程语言:</span>
            <el-select
              size="mini"
              v-model="language"
              :disabled="!editMode"
              filterable
              placeholder="语言类型"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <i class="el-icon-close close-btn" @click="close"></i>
          <i
            class="iconfont icon-full-screen"
            :class="{
              'icon-tuichuquanping': isFullScreen,
              'icon-quanping ': !isFullScreen,
            }"
            :title="isFullScreen ? '关闭全屏模式' : '打开全屏模式'"
            @click="isFullScreen = !isFullScreen"
          ></i>
        </el-header>

        <el-main class="main padding0">
          <prism-editor
            class="peditor"
            :code="code"
            :language="language"
            :line-numbers="true"
            @change="codeChanged"
            style="border-radius: 0"
          ></prism-editor>
        </el-main>

        <el-footer class="footer padding0" height="50px">
          <div class="code-num">
            <span>代码字数：{{ code.length }}字</span>
            <span class="code-warning" v-show="code.length > 10000 && editMode"
              >(字数不能超过10000字)</span
            >
          </div>

          <div class="buttom-group">
            <el-button size="small" @click="close" plain>{{
              editMode ? "取消编辑" : "关闭预览"
            }}</el-button>
            <el-button
              type="primary"
              size="small"
              @click="submit"
              v-show="editMode"
              >发送代码</el-button
            >
          </div>
        </el-footer>
      </el-container>
    </div>
  </div>
</template>
<script>
import Prism from "prismjs";
import PrismEditor from "vue-prism-editor";
import "vue-prism-editor/dist/VuePrismEditor.css";
import "prismjs/themes/prism-okaidia.css";
import Vue from "vue";
import { Select, Option } from "element-ui";
Vue.use(Select);
Vue.use(Option);

export default {
  name: "code-block",
  components: {
    PrismEditor,
  },
  props: {
    loadCode: {
      type: String,
      default: "",
    },
    loadLang: {
      type: String,
      default: "",
    },
    editMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      language: "",
      code: "",
      options: [
        {
          value: "css",
          label: "css",
        },
        {
          value: "less",
          label: "less",
        },
        {
          value: "javascript",
          label: "javascript",
        },
        {
          value: "json",
          label: "json",
        },
        {
          value: "bash",
          label: "bash",
        },
        {
          value: "c",
          label: "c",
        },
        {
          value: "cil",
          label: "cil",
        },
        {
          value: "docker",
          label: "docker",
        },
        {
          value: "git",
          label: "git",
        },
        {
          value: "go",
          label: "go",
        },
        {
          value: "java",
          label: "java",
        },
        {
          value: "lua",
          label: "lua",
        },
        {
          value: "nginx",
          label: "nginx",
        },
        {
          value: "objectivec",
          label: "objectivec",
        },
        {
          value: "php",
          label: "php",
        },
        {
          value: "python",
          label: "python",
        },
        {
          value: "ruby",
          label: "ruby",
        },
        {
          value: "rust",
          label: "rust",
        },
        {
          value: "sql",
          label: "sql",
        },
        {
          value: "swift",
          label: "swift",
        },
        {
          value: "vim",
          label: "vim",
        },
        {
          value: "visual-basic",
          label: "visual-basic",
        },
        {
          value: "shell",
          label: "shell",
        },
      ],
      isFullScreen: false,
    };
  },
  watch: {
    loadCode(value) {
      this.code = value;
    },
    loadLang(value) {
      this.language = value;
    },
  },
  created() {
    this.code = this.loadCode;
    this.language = this.loadLang;
  },
  methods: {
    submit() {
      if (!this.code) {
        alert("代码块不能为空...");
        return false;
      }

      if (this.language == "") {
        alert("请选择语言类型...");
        return false;
      }

      if (this.code.length > 10000) {
        alert("代码字数不能超过10000字！！！");
        return false;
      }
      this.$emit("confirm", {
        language: this.language,
        code: this.code,
      });
    },
    close() {
      this.$emit("close");
    },
    codeChanged(code) {
      this.code = code;
    },
  },
};
</script>
<style lang="less" scoped>
.base-mask {
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  width: 80%;
  max-width: 800px;
  height: 600px;
  overflow: hidden;
  box-shadow: 0 2px 8px 0 rgba(31, 35, 41, 0.2);
  transition: 0.5s ease;
  background: #2d2d2d;

  .header {
    position: relative;
    background-color: white;

    .close-btn {
      position: absolute;
      right: 12px;
      top: 13px;
      font-size: 24px;
      cursor: pointer;
    }

    .icon-full-screen {
      position: absolute;
      right: 45px;
      top: 13px;
      font-size: 20px;
      cursor: pointer;
    }

    .tools {
      line-height: 50px;
      padding-left: 10px;
    }
  }

  .footer {
    background-color: #3c3c3c;
    padding-right: 20px;
    line-height: 50px;

    .code-num {
      float: left;
      color: white;
      padding-left: 10px;
      font-size: 14px;
    }

    .code-warning {
      color: red;
    }

    .buttom-group {
      float: right;
      height: 100%;
      line-height: 50px;
      text-align: right;

      button {
        border-radius: 0;
      }
    }
  }
}

.full-screen {
  width: 100%;
  height: 100%;
  max-width: 100%;
}

/deep/ .el-input__inner {
  border-radius: 0;
  width: 130px;
}

/deep/ pre {
  border-radius: 0;
}

/deep/ .prism-editor-wrapper pre::-webkit-scrollbar {
  background-color: #272822;
}

/deep/ .prism-editor-wrapper pre::-webkit-scrollbar-thumb {
  background-color: #41413f;
  cursor: pointer;
}

/deep/ .prism-editor-wrapper::-webkit-scrollbar {
  background-color: #272822;
}

/deep/ .prism-editor-wrapper::-webkit-scrollbar-thumb {
  background-color: rgb(114, 112, 112);
  cursor: pointer;
}
</style>
