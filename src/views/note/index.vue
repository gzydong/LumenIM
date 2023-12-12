<script lang="ts" setup>
import { computed } from 'vue'
import NoteMenu from './inner/NoteMenu.vue'
import NoteList from './inner/NoteList.vue'
import NoteView from './inner/NoteView.vue'
import NoteEmpty from './inner/NoteEmpty.vue'
import { useNoteStore } from '@/store'

const noteStore = useNoteStore()

const loadId = computed(() => noteStore.view.loadId)
</script>

<template>
  <section class="el-container height100">
    <aside class="el-aside" style="width: 230px"><NoteMenu /></aside>
    <aside
      class="el-aside"
      style="width: 350px"
      v-dropsize="{ min: 200, max: 500, direction: 'right' }"
    >
      <NoteList />
    </aside>

    <main class="el-main">
      <component :is="loadId > 0 ? NoteView : NoteEmpty" />
    </main>
  </section>
</template>

<style lang="less" scoped></style>
