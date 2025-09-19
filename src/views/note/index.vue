<script lang="ts" setup>
import { useNoteStore } from '@/store'
import NoteEmpty from './inner/NoteEmpty.vue'
import NoteList from './inner/NoteList.vue'
import NoteMenu from './inner/NoteMenu.vue'
import NoteView from './inner/NoteView.vue'

const noteStore = useNoteStore()

const currentLoadId = computed(() => noteStore.view.loadId)
</script>

<template>
  <section class="el-container h-full">
    <aside class="el-aside" style="width: 230px">
      <NoteMenu />
    </aside>

    <aside
      class="el-aside border-left border-right"
      style="width: 350px"
      v-dropsize="{ min: 200, max: 500, direction: 'right', key: 'note-list' }"
    >
      <NoteList />
    </aside>

    <main class="el-main">
      <component :is="currentLoadId > 0 ? NoteView : NoteEmpty" />
    </main>
  </section>
</template>

<style lang="less" scoped></style>
