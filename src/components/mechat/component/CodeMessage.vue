<script lang="ts" setup>
import { useInject } from '@/hooks'
import { clipboard } from '@/utils/common'
import { Copy, Stretching } from '@icon-park/vue-next'

const props = defineProps<{
  code: string
  lang: string
}>()

const { message } = useInject()
const full = ref(false)

const onClipboard = () => {
  clipboard(props.code, () => {
    message.success('复制成功')
  })
}
</script>
<template>
  <section
    class="immsg-code el-container is-vertical"
    :class="{
      full: full
    }"
  >
    <header class="el-header header">
      <p>{{ lang }}</p>
      <p style="display: flex; gap: 5px">
        <n-icon class="icon" :size="18" :component="Copy" @click="onClipboard" />
        <n-icon class="icon" :size="18" :component="Stretching" @click="full = !full" />
      </p>
    </header>

    <main class="el-main main me-scrollbar me-scrollbar-thumb">
      <n-code :language="lang" :code="code" show-line-numbers />
    </main>
  </section>
</template>
<style lang="less" scoped>
.immsg-code {
  border-radius: 5px;
  overflow-x: auto;
  border: 1px solid var(--border-color);
  padding: 5px 10px;
  max-width: fit-content;
  min-width: 250px;
  width: 100%;
  background-color: #ffffff;

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 38px;
    cursor: pointer;
    font-size: 16px;
    border-bottom: 1px solid var(--border-color);

    .icon {
      margin-left: 8px;
    }
  }

  .main {
    overflow-y: hidden;
    padding: 10px 0;

    overflow: auto;
    :deep(.n-code pre) {
      overflow: auto;
    }

    max-height: 300px;
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

  &.full {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
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
      max-height: unset;
    }
  }
}

html[theme-mode='dark'] {
  .immsg-code {
    border: unset;
    background: rgb(43 43 43);

    .footer {
      background-color: rgba(255, 255, 255, 5%);
    }
  }
}
</style>
