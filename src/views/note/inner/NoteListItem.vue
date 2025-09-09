<script lang="ts" setup>
import { MoreOne, Star } from '@icon-park/vue-next'

defineProps<{
  title: string
  datetime: string
  classname?: string
  active: boolean
  isAsterisk: boolean
}>()

const tools = () => {
  console.log('asdfa')
}
</script>

<template>
  <div class="note-list-item pointer" :class="{ active: active }">
    <div class="title text-ellipsis">
      <n-icon v-if="isAsterisk" size="16" :component="Star" class="pointer" color="red" />
      {{ title }}
    </div>

    <div class="content">
      <span style="width: 100%; max-width: fit-content"
        >{{ datetime?.substring(2, 16)?.split('-').join('/') }}
      </span>
      <n-divider vertical />
      <span class="text-ellipsis">{{ classname }}</span>

      <n-icon
        size="18"
        :component="MoreOne"
        class="pointer"
        @click.stop="tools"
        style="margin-left: auto"
      />
    </div>
  </div>
</template>

<style lang="less">
.note-list-item {
  --article-bg-color: #ffffff;
  --articl-hover-border-color: #1890ff;

  min-height: 50px;
  padding: 8px;
  margin-bottom: 8px;
  transition: all 0.5s ease;
  border-radius: 3px;
  border: 1px solid transparent;
  overflow: hidden;
  background-color: var(--article-bg-color);

  &.active,
  &:hover {
    border-color: var(--articl-hover-border-color);
  }

  .title {
    height: 26px;
    line-height: 26px;
    font-size: 15px;
    width: 100%;
  }

  .content {
    margin-top: 5px;
    height: 26px;
    line-height: 26px;
    font-size: 13px;
    width: 100%;
    color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
  }
}

html[theme-mode='dark'] {
  .note-list-item {
    --article-bg-color: rgba(255, 255, 255, 0.05);
    --articl-hover-border-color: rgba(255, 255, 255, 0.3);

    .content {
      color: rgba(255, 255, 255, 0.4) !important;
    }
  }
}
</style>
