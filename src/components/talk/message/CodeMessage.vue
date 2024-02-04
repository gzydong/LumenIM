<script lang="ts" setup>
import { ref } from 'vue'
import { NCode } from 'naive-ui'
import { Copy, Stretching } from '@icon-park/vue-next'
import { clipboard } from '@/utils/common'
import { useInject } from '@/hooks'
import { ITalkRecordExtraCode, ITalkRecord } from '@/types/chat'

const props = defineProps<{
  extra: ITalkRecordExtraCode
  data: ITalkRecord
  maxWidth?: Boolean
  talkMode?: Number
}>()

const { message } = useInject()
const lineMumber = props.extra.code.trim().split('\n').length
const full = ref(false)

const onClipboard = () => {
  clipboard(props.extra.code, () => {
    message.success('复制成功')
  })
}
</script>
<template>
  <section
    class="immsg-code el-container is-vertical"
    :class="{
      maxwidth: maxWidth,
      full: full
    }"
  >
    <header class="el-header header">
      <p># {{ extra.lang }}</p>
      <p>
        <n-icon class="icon" :size="16" :component="Stretching" @click="full = !full" />
        <n-icon class="icon" :size="16" :component="Copy" @click="onClipboard" />
      </p>
    </header>

    <main class="el-main main me-scrollbar me-scrollbar-thumb" :lineMumber="lineMumber">
      <n-code :language="extra.lang" :code="extra.code" show-line-numbers />
    </main>

    <footer v-show="!full" class="el-footer footer pointer" @click="full = !full">查看详情</footer>
  </section>
</template>
<style lang="less" scoped>
.immsg-code {
  min-width: 300px;
  min-height: 100px;
  border-radius: 10px;
  overflow-x: auto;
  border: 1px solid var(--border-color);
  padding: 5px 10px;
  max-height: 512px;
  flex: unset;

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 38px;
    cursor: pointer;
    font-size: 16px;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 10px;

    .icon {
      margin-left: 8px;
    }
  }

  .main {
    overflow-y: hidden;

    :deep(.n-code pre) {
      overflow: auto;
    }
  }

  .footer {
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.03);
    border-radius: 20px;
    margin: 10px 0;
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
    border: unset;
    box-sizing: border-box;
    max-width: unset;
    max-height: unset;
    border-radius: unset;

    .header {
      height: 60px;
    }

    .main {
      overflow-y: unset;
    }
  }
}

html[theme-mode='dark'] {
  .immsg-code {
    .footer {
      background-color: rgba(255, 255, 255, 5%);
    }
  }
}
</style>
