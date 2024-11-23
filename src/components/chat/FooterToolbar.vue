<script lang="ts" setup>
import { useIntersectionObserver } from '@vueuse/core'
import { onUnmounted, useTemplateRef } from 'vue'

const model = defineModel<boolean>()

const { loadStatus, loadMode, fn } = defineProps<{
  loadStatus: number
  loadMode: string
  fn: (reload: boolean) => Promise<void>
}>()

const loadToolbarFotterTarget = useTemplateRef('load-toolbar-footer')

const { stop } = useIntersectionObserver(loadToolbarFotterTarget, ([{ isIntersecting }]) => {
  model.value = !isIntersecting

  if (loadMode === 'pullup' && isIntersecting) {
    fn(false)
  }
})

onUnmounted(() => {
  stop()
})
</script>

<template>
  <div class="load-toolbar-footer flex-center" ref="load-toolbar-footer">
    <template v-if="loadMode === 'pullup'">
      <span v-if="loadStatus === 3" class="no-more">― 没有更多消息 ―</span>
      <span v-else-if="loadStatus === 2" class="loading">加载数据中...</span>
      <span v-else class="loading">加载更多消息</span>
    </template>
  </div>
</template>

<style lang="less" scoped>
.load-toolbar-footer {
  height: 38px;
  width: 100%;

  .loading {
    color: var(--im-primary-color);
  }
}
</style>
