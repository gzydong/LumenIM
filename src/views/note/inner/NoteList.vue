<script lang="ts" setup>
import Loading from '@/components/basic/Loading.vue'
import { NoteItem, useNoteStore } from '@/store'
import { debounce } from '@/utils/common'
import { Search, SortAmountDown } from '@icon-park/vue-next'
import NoteListItem from './NoteListItem.vue'
import { useNoteListContextMenu } from './useNoteListContextMenu.ts'

const { onContextMenu, ContextMenuElement } = useNoteListContextMenu()

const store = useNoteStore()
const items = computed(() => store.notes.items)
const loadId = computed(() => store.view.loadId)
const loadStatus = computed(() => store.notes.loadStatus)
const keyword = computed({
  get: () => store.notes.params.keyword,
  set: (val) => {
    store.notes.params.keyword = val
  }
})

const onCatDetail = (item: NoteItem) => {
  store.loadDetail(item.article_id)
}

const onSearchInput = debounce(() => {
  store.loadNoteList({}, false)
}, 300)
</script>
<template>
  <section class="el-container is-vertical note-list-view">
    <header class="el-header header-search">
      <div class="icon-search">
        <n-icon size="18" :component="Search" />
      </div>

      <input
        type="text"
        class="search"
        v-model="keyword"
        placeholder="搜索我的笔记 ..."
        maxlength="30"
        @input="onSearchInput"
      />
    </header>

    <header class="el-header header-tools">
      <span>{{ items.length }} 篇笔记</span>
      <span><n-icon size="18" :component="SortAmountDown" /></span>
    </header>

    <main class="el-main flex-center" v-if="loadStatus == 0 || !items.length">
      <Loading v-if="loadStatus == 0" />
      <n-empty v-else description="暂无相关数据" />
    </main>

    <main class="el-main" style="padding: 8px" v-else>
      <n-scrollbar>
        <NoteListItem
          v-for="note in items"
          :key="note.article_id"
          :title="note.title"
          :datetime="note.updated_at"
          :classname="note.class_name"
          :active="loadId == note.article_id"
          :is-asterisk="note.is_asterisk == 1"
          @click="onCatDetail(note)"
          @contextmenu.prevent="onContextMenu($event, note)"
        />
      </n-scrollbar>
    </main>
  </section>

  <ContextMenuElement />
</template>
<style lang="less" scoped>
.note-list-view {
  --im-note-list-bg-color: #f4f6f9;
  --header-desc-border-color: #ece8e8;

  width: 100%;
  height: 100%;
  background: var(--im-note-list-bg-color);

  .header-search {
    height: 60px;
    text-align: center;
    position: relative;

    .icon-search {
      position: absolute;
      left: 19px;
      top: 22px;
    }

    input {
      height: 30px;
      width: 70%;
      position: absolute;
      left: 40px;
      top: 15px;
      padding: 0 3px;
      font-size: 14px;
      background: transparent;
      color: var(--im-text-color);

      &::-webkit-input-placeholder {
        color: rgb(158, 150, 150);
        font-size: 13px;
      }
    }
  }

  .header-tools {
    height: 40px;
    line-height: 40px;
    position: relative;
    color: #7b7777;
    border-top: 1px solid var(--header-desc-border-color);
    border-bottom: 1px solid var(--header-desc-border-color);
    font-size: 13px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

html[theme-mode='dark'] {
  .note-list-view {
    --im-note-list-bg-color: #1b1b1b;
    --header-desc-border-color: #1f1f23;
  }
}
</style>
