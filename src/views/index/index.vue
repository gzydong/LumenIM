<script setup>
import { onUnmounted } from 'vue'
import { useDialogueStore } from '@/store/dialogue'
import IMLayout from '@/views/layout/IMLayout.vue'
import IndexContent from './inner/IndexContent.vue'
import IndexSider from './inner/IndexSider.vue'
import IndexAmicable from './inner/IndexAmicable.vue'

const dialogueStore = useDialogueStore()

onUnmounted(() => {
  dialogueStore.$reset()
})
</script>

<template>
  <IMLayout>
    <section class="el-container height100">
      <aside class="el-aside bdr-r" style="width: 320px">
        <IndexSider />
      </aside>

      <main class="el-main">
        <IndexContent v-if="dialogueStore.index_name" />
        <IndexAmicable v-else />
      </main>
    </section>
  </IMLayout>
</template>