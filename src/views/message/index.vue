<script lang="ts" setup>
import { onUnmounted, computed } from 'vue'
import { useDialogueStore } from '@/store'
import IndexContent from './panel/Index.vue'
import IndexSider from './sider/Index.vue'
import IndexAmicable from './amicable.vue'

const dialogueStore = useDialogueStore()
const indexName = computed(() => dialogueStore.index_name)

onUnmounted(() => {
  dialogueStore.$reset()
})
</script>

<template>
  <section class="el-container">
    <aside
      v-show="dialogueStore.isShowSessionMenu"
      v-dropsize="{
        min: 200,
        max: 500,
        direction: 'right',
        key: 'session-list'
      }"
      class="el-aside aside bdr-r"
    >
      <IndexSider />
    </aside>

    <main class="el-main">
      <component :is="indexName ? IndexContent : IndexAmicable" />
    </main>
  </section>
</template>

<style lang="less" scoped>
.aside {
  width: 320px;
  position: relative;
  user-select: none;
}
</style>
