<script lang="ts" setup>
import { onUnmounted, computed } from 'vue'
import { useDialogueStore } from '@/store'
import IndexContent from './inner/IndexContent.vue'
import IndexSider from './inner/IndexSider.vue'
import IndexAmicable from './inner/IndexAmicable.vue'

const dialogueStore = useDialogueStore()
const indexName = computed(() => dialogueStore.index_name)

onUnmounted(() => {
  dialogueStore.$reset()
})
</script>

<template>
  <section class="el-container">
    <aside
      v-show="dialogueStore.isShowSessionList"
      v-dropsize="{
        min: 200,
        max: 500,
        direction: 'right',
        key: 'session-list'
      }"
      class="el-aside bdr-r session-list"
    >
      <IndexSider />
    </aside>

    <main class="el-main">
      <component :is="indexName ? IndexContent : IndexAmicable" />
    </main>
  </section>
</template>

<style lang="less">
.el-container {
  height: 100%;
}

.el-aside {
  width: 320px;
  position: relative;
  user-select: none;
}

.small-screen {
  .el-aside {
    width: 260px;
  }
}
</style>
