<script setup>
import { onUnmounted } from 'vue'
import { useDialogueStore } from '@/store/dialogue'
import Layout from '@/layout/index.vue'
import IndexContent from './inner/IndexContent.vue'
import IndexSider from './inner/IndexSider.vue'
import IndexAmicable from './inner/IndexAmicable.vue'

const dialogueStore = useDialogueStore()

onUnmounted(() => {
  dialogueStore.$reset()
})
</script>

<template>
  <Layout>
    <section class="el-container">
      <aside
        v-show="dialogueStore.isShowSessionList"
        class="el-aside bdr-r session-list"
      >
        <IndexSider />
      </aside>

      <main class="el-main">
        <component
          :is="dialogueStore.index_name ? IndexContent : IndexAmicable"
        />
      </main>
    </section>
  </Layout>
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

@media screen and (max-width: 1000px) {
  .el-aside {
    width: 260px;
  }
}
</style>
