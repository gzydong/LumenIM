<script setup>
import { ref, computed, watch } from 'vue'

import IMLayout from '@/views/layout/IMLayout.vue'
import NoteMenu from './inner/NoteMenu.vue'
import NoteList from './inner/NoteList.vue'
import NoteView from './inner/NoteView.vue'
import NoteEmpty from './inner/NoteEmpty.vue'

import { useNoteStore } from '@/store/note'

const noteStore = useNoteStore()

const loadId = computed(() => noteStore.view.loadId)
</script>

<template>
  <IMLayout :index="2">
    <section class="el-container height100">
      <aside class="el-aside" style="width: 230px"><NoteMenu /></aside>
      <aside class="el-aside" style="width: 350px"><NoteList /></aside>
      <main class="el-main" v-if="loadId > 0"><NoteView /></main>
      <main class="el-main" v-else><NoteEmpty /></main>
    </section>
  </IMLayout>
</template>

<style lang="less" scoped></style>
