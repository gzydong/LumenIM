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
      <aside v-dropsize="{ max: 500, min: 250 }" class="el-aside bdr-r">
        <IndexSider />
      </aside>

      <main class="el-main">
        <IndexContent v-if="dialogueStore.index_name" />
        <IndexAmicable v-else />
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

@media screen and (max-width: 900px) {
  .el-aside {
    width: 280px;
  }
}
</style>
