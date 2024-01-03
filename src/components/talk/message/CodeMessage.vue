<script lang="ts" setup>
import { ref } from 'vue'
import { NCode } from 'naive-ui'
import { Copy, Stretching } from '@icon-park/vue-next'
import { clipboard } from '@/utils/common'
import { useUtil } from '@/hooks'
import { ITalkRecordExtraCode, ITalkRecord } from '@/types/chat'

const props = defineProps<{
  extra: ITalkRecordExtraCode
  data: ITalkRecord
  maxWidth?: Boolean
}>()

const { useMessage } = useUtil()
const lineMumber = props.extra.code.trim().split('\n').length
const full = ref(false)

const onClipboard = () => {
  clipboard(props.extra.code, () => {
    useMessage.success('复制成功')
  })
}
</script>
<template>
  <section
    class="im-message-code el-container is-vertical"
    :class="{
      maxwidth: maxWidth,
      full: full
    }"
  >
    <header class="el-header tools">
      <p># {{ extra.lang }}</p>
      <p>
        <n-icon class="icon" :component="Stretching" @click="full = !full" />
        <n-icon class="icon" :component="Copy" @click="onClipboard" />
      </p>
    </header>
    <main class="el-main me-scrollbar me-scrollbar-thumb" :lineMumber="lineMumber">
      <n-code :language="extra.lang" :code="extra.code" show-line-numbers />
      <div class="el-footer mask pointer" v-show="lineMumber > 20" @click="full = !full">
        查看更多
      </div>
    </main>
  </section>
</template>
<style lang="less" scoped>
.im-message-code {
  min-width: 300px;
  min-height: 100px;
  border-radius: 10px;
  overflow-x: auto;
  border: 1px solid var(--border-color);
  padding: 5px 8px;
  max-height: 500px;
  overflow-y: hidden;
  flex: unset;

  .el-main {
    overflow-y: hidden;
  }

  &.maxwidth {
    max-width: 60%;
  }

  &.full {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    background-color: var(--im-bg-color);
    width: 100%;
    height: 100%;
    border: 0;
    box-sizing: border-box;
    max-width: unset;
    max-height: unset;
    overflow-y: unset;
    border-radius: unset;

    .el-main {
      overflow-y: unset;
    }

    .mask {
      display: none;
    }
  }

  .tools {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    cursor: pointer;
    padding: 0 8px;

    .icon {
      margin-left: 5px;
    }
  }

  .mask {
    height: 80px;
    text-align: center;
    line-height: 10;
    position: sticky;
    bottom: 0;
    left: 0;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
    color: var(--im-text-color);
  }
}

html[theme-mode='dark'] {
  .im-message-code {
    background: var(--im-message-bg-color);

    .mask {
      background: linear-gradient(to bottom, transparent 0%, var(--im-bg-color) 100%);
    }
  }
}
</style>
