<script setup>
import { ref, defineProps, h, defineEmits } from "vue";
import { message, Spin } from "ant-design-vue";
import { ICopy, ICheckOutlined, IOct, ICloseCircle } from "../icons";
import { LoadingOutlined } from "@ant-design/icons-vue";

const props = defineProps({
  list: {
    type: Array,
    required: true,
  },
  showLoading: {
    type: Boolean,
    required: true,
  },
  showSuggestions: {
    type: Boolean,
    default: true,
  },
  selectText: {
    type: String,
  },
});

// const emit = defineEmits();
const emit = defineEmits(['update:textareaContent']);

const suggestions = ref([
  "写一首七言古诗",
  "如何在 Javascript 中发出 HTTP 请求？",
]);

const indicator = h(LoadingOutlined, {
  style: {
    fontSize: "14px",
    color: "#3872e0",
  },
  spin: true,
});

const showCopySuccess = ref(false);
const handleCopySuccess = () => {
  showCopySuccess.value = true;
  message.success("复制成功");
  setTimeout(() => {
    showCopySuccess.value = false;
  }, 3000);
};

const handleClickSuggestion = (item) => {
  emit("suggest", item);
};
const handleCloseSelectionText = () => {
  emit("clearSection");
};
</script>
<template>
  <div class="chat-container" style="padding-bottom: 60px">
    <slot name="more"></slot>
    <template v-for="item in list" :key="item._id">
      <div class="chat-item chat-question" v-if="item.item_type === 'intent'">
        <div class="feedback message-content-wrap">
          <div class="chat-content markdown-body">
            <p class="highlight" v-html="item.content"></p>
          </div>
        </div>
      </div>
      <div
        class="chat-item chat-reply"
        v-if="item.item_type === 'reply' && item.content"
      >
        <div class="feedback message-content-wrap">
          <div class="chat-content markdown-body gpt-markdown">
            <div class="markdown __markdown light markdown-body">
              <p class="highlight" v-html="item.content"></p>
              <div class="operate-bar">
                <span
                  title="复制内容"
                  v-if="item.content && !showCopySuccess"
                  v-clipboard:copy="item.content"
                  v-clipboard:success="handleCopySuccess"
                >
                  <ICopy :width="16" :height="16"></ICopy>
                </span>
                <span title="已复制！" v-if="showCopySuccess">
                  <ICheckOutlined :width="16" :height="16"></ICheckOutlined>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="chat-item chat-reply selection-text" v-if="selectText">
      <div class="feedback message-content-wrap">
        <div class="chat-content markdown-body gpt-markdown">
          <div class="tips">
            <IOct width="12" heigth="12" />
            选择内容
          </div>
          <div class="markdown __markdown light">{{ selectText }}</div>
          <span class="selection-text-close" @click="handleCloseSelectionText"
            ><ICloseCircle
          /></span>
        </div>
      </div>
    </div>
    <div class="chat-item chat-reply" v-if="showLoading">
      <div class="feedback message-content-wrap">
        <div class="chat-content markdown-body gpt-markdown">
          <div class="markdown __markdown light">
            <Spin :indicator="indicator" />
          </div>
        </div>
      </div>
    </div>
    <div
      class="chat-suggestion"
      v-if="(!curChat || !curChat.short_cut_id) && showSuggestions"
    >
      <div class="suggestion-bar">
        <div
          class="suggestion-item"
          v-for="(item, key) in suggestions"
          :key="key"
          @click="handleClickSuggestion(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.chat-container {
  position: absolute;
  left: 0;
  top: 0;
  overflow: visible auto;
  box-sizing: border-box;
  max-height: 100%;
  width: 100%;
  height: calc(100vh - 245px);
  padding: 16px 13px 20px 16px;
  scrollbar-gutter: stable;
  font-size: 14px;
}
.chat-item {
  margin-bottom: 16px;
  position: relative;
}
.chat-question {
  text-align: right;
}
.feedback {
  position: relative;
  display: inline-block;
  max-width: 100%;
}
.chat-item .chat-content {
  display: inline-block;
  font-size: 14px;
  line-height: 22px;
  box-sizing: border-box;
  padding: 8px 12px;
  max-width: 100%;
}
.chat-content {
  transition: box-shadow 0.1s ease;
}
.chat-question .chat-content {
  border-radius: 8px 8px 0;
  background: #6e819c;
  color: #fff;
  text-align: left;
}
.chat-item .chat-content p {
  margin: 0;
  white-space: pre-wrap;
}
.chat-question .chat-content p {
  white-space: pre-wrap;
}
:deep(.chat-item .chat-content p a) {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: none;
  text-decoration: none;
}
.chat-reply {
  text-align: left;
}
.chat-reply .operate-bar {
  display: none;
}
.chat-reply:hover .operate-bar {
  display: block;
}
.operate-bar span {
  cursor: pointer;
}
.operate-bar {
  position: absolute;
  bottom: 5px;
  right: 10px;
  background: #f6f8fa;
  padding: 5px;
  border-radius: 5px;
  line-height: 1;
}
.chat-reply .chat-content {
  border-radius: 8px 8px 8px 0;
  background: #f6f8fa;
  color: #000;
}
.chat-reply .chat-content.markdown-body.gpt-markdown {
  font-size: 14px;
  line-height: 1.6;
}
.chat-suggestion {
  margin-top: 120px;
  margin-bottom: -30px;
}
.suggestion-bar {
  visibility: visible;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  box-sizing: border-box;
  padding-left: 75px;
}
.suggestion-item {
  display: inline-flex;
  padding: 8px 12px;
  box-sizing: border-box;
  max-width: 100%;
  border: 1px solid rgba(56, 114, 224, 0.48);
  border-radius: 8px 8px 0;
  background: #ffffff;
  transition: border 0.2s ease, background 0.2s ease;
  cursor: pointer;
  font-size: 13px;
  line-height: 16px;
  color: #225ebe;
}
.tips {
  user-select: none;
  margin-bottom: 4px;
  color: #8b949d;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  line-height: 24px;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 2px;
}
.selection-text {
  position: relative;
}
.selection-text-close {
  position: absolute;
  top: -2px;
  right: 0px;
  color: #8b949d;
  cursor: pointer;
}
</style>
