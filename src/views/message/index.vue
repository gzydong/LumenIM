<script lang="ts" setup>
import { useDialogueStore, useTalkStore } from '@/store'
import Panel from './panel/Index.vue'
import Sider from './sider/Index.vue'
import Amicable from './amicable.vue'

const dialogueStore = useDialogueStore()
const talkStore = useTalkStore()
const indexName = computed(() => dialogueStore.index_name)

onUnmounted(() => {
  dialogueStore.$reset()
  talkStore.isShowSessionMenu = true
})
</script>

<template>
  <section class="el-container">
    <aside
      v-show="talkStore.isShowSessionMenu"
      v-dropsize="{
        min: 200,
        max: 500,
        direction: 'right',
        key: 'aside-session'
      }"
      class="el-aside aside-session border-right"
    >
      <Sider />
    </aside>

    <main class="el-main">
      <component :is="indexName ? Panel : Amicable" />
    </main>
  </section>
</template>

<style lang="less" scoped>
.aside-session {
  width: 320px;
  position: relative;
  user-select: none;
}
</style>
