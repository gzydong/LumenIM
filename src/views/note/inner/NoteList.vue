<script lang="ts" setup>
import { ArticleListResponse_Item } from '@/apis/types.js'
import Loading from '@/components/basic/Loading.vue'
import { useNoteStore } from '@/store'
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

const onCatDetail = (item: ArticleListResponse_Item) => {
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

    <header class="el-header header-tools border-top">
      <span>{{ items.length }} 篇笔记</span>
      <span><n-icon size="18" :component="SortAmountDown" /></span>
    </header>

    <main class="el-main flex-center" v-if="loadStatus == 0 || !items.length">
      <Loading v-if="loadStatus == 0" />
      <n-empty v-else description="暂无相关数据" />
    </main>

    <main class="el-main" style="padding: 8px" v-else>
      <n-scrollbar>
        <template v-for="note in items" :key="note.article_id">
          <NoteListItem
            :title="note.title"
            :datetime="note.updated_at"
            :classname="note.class_name"
            :active="loadId == note.article_id"
            :is-asterisk="note.is_asterisk == 1"
            @click="onCatDetail(note)"
            @contextmenu.prevent="onContextMenu($event, note)"
          />
        </template>

        <div
          style="
            text-align: center;
            margin-top: 50px;
            margin-bottom: 16px;
            color: var(--im-text-color-grey);
            font-size: 12px;
          "
        >
          已加载全部笔记
        </div>
      </n-scrollbar>
    </main>
  </section>

  <ContextMenuElement />
</template>
<style lang="less" scoped>
.note-list-view {
  width: 100%;
  height: 100%;

  .header-search {
    height: 60px;
    text-align: center;
    display: flex;
    align-items: center;
    padding: 0 16px;

    .icon-search {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    input {
      height: 30px;
      background: transparent;
      color: var(--im-text-color);
      flex: auto;
      margin-left: 4px;
      padding: 0 8px;

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
    font-size: 14px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fafafa;
  }
}

html[theme-mode='dark'] {
  .note-list-view {
    .header-tools {
      background: rgb(16 16 16);
    }
  }
}
</style>
