<script setup>
import { ref, defineProps, watch, defineEmits, onUnmounted } from "vue";
import { ISend } from "../icons";
const props = defineProps({
  textareaContent: {
    type: String,
  },
});
const emit = defineEmits(['update:textareaContent']);

const content = ref(props.textareaContent);

const stop = watch(
  () => props.textareaContent,
  () => {
    content.value = props.textareaContent || "";
  },
  { deep: true }
);

const stopContent = watch(
  () => content.value,
  () => {
    emit("update:textareaContent", content.value);
  }
);

const handleEnter = (event) => {
  emit("enter");
  if (event) event.preventDefault();
};

onUnmounted(() => {
  stop();
  stopContent();
});
</script>
<template>
  <div class="input-box">
    <div class="input">
      <div class="input-container">
        <div class="input-msg-content">
          <div class="textarea">
            <div
              class="mirror-node"
              style="max-height: 100px; min-height: 32px"
            >
              <span></span>
            </div>
            <textarea
              placeholder="问我任何问题..."
              @keypress.enter.stop="handleEnter"
              v-model="content"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="input-toolbar">
        <div class="input-msg-btn send" @click="handleEnter">
          <ISend width="16" height="16"></ISend>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.input-box {
  width: 100%;
  position: relative;
  padding-bottom: 16px;
}
.input-box .input {
  width: 100%;
  min-height: 146px;
  background: white;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid #6e819c;
}
.input-box .input-container {
  flex: 1;
  display: flex;
  margin-bottom: 5px;
  padding-top: 7px;
}
.input-msg-content {
  flex: 1;
  position: relative;
}
.textarea {
  visibility: visible;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  font-family: Courier New, Courier, monospace;
}
.textarea .mirror-node {
  width: 100%;
  min-height: 32px;
  pointer-events: none;
  box-sizing: border-box;
  padding: 2px;
  visibility: hidden;
}
.textarea textarea {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  resize: none;
  border: none;
  font-size: 14px;
  overflow: hidden auto;
  box-shadow: none;
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  color: #212b36;
  outline: none;
}
.input-toolbar {
  height: 24px;
  display: flex;
  user-select: none;
  justify-content: flex-end;
}

.input-toolbar .input-word-limit {
  flex: 1;
  line-height: 24px;
  font-size: 12px;
  color: #737373;
  visibility: hidden;
}
.input-toolbar .input-msg-btn {
  width: 30px;
  height: 30px;
  font-size: 18px;
  color: #737373;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  position: relative;
  right: -6px;
  top: -2px;
}
.input-msg-btn.send {
  opacity: 0.8;
}
.input-msg-btn:hover {
  background: #ededef;
}
</style>
