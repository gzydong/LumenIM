<script setup>
import { ref } from 'vue'
import { CloseOne } from '@icon-park/vue-next'

defineProps({
  extra: Object,
  data: Object,
  maxWidth: Boolean,
})

const isFullCat = ref(false)
</script>
<template>
  <div
    class="code-message"
    :class="{
      maxwidth: maxWidth,
    }"
  >
    <p class="more pointer flex-center" @click="isFullCat = true">
      <span class="text">{{ extra.lang }}</span>
    </p>

    <highlightjs :language="extra.lang" :code="extra.code" />

    <div v-if="isFullCat" class="full-code">
      <div class="close pointer" @click="isFullCat = false">
        <CloseOne :size="30" />
      </div>

      <highlightjs
        :language="extra.lang"
        :code="extra.code"
        @contextmenu.stop
      />
    </div>
  </div>
</template>
<style lang="less" scoped>
.code-message {
  position: relative;
  min-width: 150px;
  border-radius: 10px;
  overflow-x: auto;
  background-color: #f5f5f5;
  border: 1px solid #f5f5f5;

  &.maxwidth {
    max-width: 70%;
  }

  .more {
    height: 35px;
    font-size: 14px;
    color: #333;
    display: flex;
    justify-content: flex-end;
    padding: 0 15px;

    &:before {
      position: absolute;
      left: 12px;
      z-index: 0;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #fc625d;
      box-shadow: 20px 0 #fdbc40, 40px 0 #35cd4b;
      content: ' ';
    }
  }

  :deep(pre code.hljs) {
    padding: 10px;
    max-height: 500px;
    min-height: 80px;
    min-width: 100px;
    overflow-y: hidden;
    box-sizing: border-box;
  }
}

.full-code {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
  width: 100vw;
  height: 100vh;

  .close {
    position: fixed;
    right: 30px;
    top: 30px;
    height: 50px;
    width: 50px;
    z-index: 9999999;
  }

  :deep(pre) {
    width: 100%;
    height: 100vh;
    overflow: auto;
    padding: 0;
    box-sizing: border-box;

    .hljs {
      overflow-y: auto !important;
      max-height: unset !important;
    }

    code {
      height: 100%;
      padding-top: 30px !important;
    }
  }
}
</style>
