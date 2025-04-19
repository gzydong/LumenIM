<script lang="ts" setup>
import { Search, SortAmountDown } from '@icon-park/vue-next'
import { useNoteStore, NoteItem } from '@/store'
import { debounce } from '@/utils/common'
import Loading from '@/components/basic/Loading.vue'
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
      <div class="icon">
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

    <header class="el-header header-desc">
      <span>{{ items.length }} 篇笔记</span>
      <div class="menu-icon">
        <n-icon size="18" :component="SortAmountDown" />
      </div>
    </header>

    <main class="el-main height100 flex-center" v-if="loadStatus == 0 || !items.length">
      <Loading v-if="loadStatus == 0" />
      <n-empty v-else description="暂无相关数据" />
    </main>

    <main class="el-main" v-else>
      <n-scrollbar>
        <div
          class="article-item pointer"
          v-for="note in items"
          :key="note.article_id"
          @click="onCatDetail(note)"
          :class="{ active: loadId == note.article_id }"
          @contextmenu.prevent="onContextMenu($event, note)"
        >
          <div class="article-item-title text-ellipsis">
            <span>{{ note.title }}</span>
          </div>

          <div class="article-item-body">
            <div class="content">
              <div class="datetime">
                <span>{{ note.created_at.substring(0, 10) }}</span>
                <span>{{ note.class_name }}</span>
              </div>

              <div class="abstract">
                {{ note.abstract.replace(/[\r\n]/g, '').replace(/(<([^>]+)>)/gi, '') }}
              </div>
            </div>
          </div>
        </div>
      </n-scrollbar>
    </main>
  </section>

  <ContextMenuElement />
</template>
<style lang="less" scoped>
.note-list-view {
  --im-note-list-bg-color: #f4f6f9;
  --header-desc-border-color: #ece8e8;
  --article-bg-color: #ffffff;
  --article-active-bg-color: transparent;

  width: 100%;
  height: 100%;
  background: var(--im-note-list-bg-color);

  .header-search {
    height: 60px;
    text-align: center;
    position: relative;

    .icon {
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

  .header-desc {
    height: 40px;
    line-height: 40px;
    position: relative;
    color: #7b7777;
    border-top: 1px solid var(--header-desc-border-color);
    border-bottom: 1px solid var(--header-desc-border-color);
    font-size: 13px;
    padding: 0 10px;

    .menu-icon {
      position: absolute;
      right: 10px;
      top: 3px;
    }
  }

  .article-item {
    min-height: 50px;
    padding: 8px;
    background-color: var(--article-bg-color);
    margin: 8px;
    transition: all 0.5s ease;
    border-radius: 3px;

    &-title {
      height: 26px;
      line-height: 26px;
      font-size: 15px;
      width: 100%;
    }

    &-body {
      display: flex;
      align-items: center;

      .content {
        flex-grow: 1;

        .datetime {
          display: flex;
          align-items: center;
          font-size: 10px;
          color: #a7afbc;
          font-weight: 300;
          line-height: 1.6;

          span {
            margin-right: 15px;
          }
          height: 22px;
          margin: 3px 0;
        }

        .abstract {
          display: -webkit-box;
          flex-grow: 1;
          max-height: 42px;
          font-size: 10px;
          color: rgba(0, 0, 0, 0.3);
          line-height: 1.6;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          word-break: break-word;
          overflow: hidden;
        }
      }
    }

    &.active {
      background-color: var(--article-active-bg-color);
    }
  }
}

html[theme-mode='dark'] {
  .note-list-view {
    --im-note-list-bg-color: #1b1b1b;
    --header-desc-border-color: #1f1f23;
    --article-bg-color: rgba(255, 255, 255, 0.05);
    --article-active-bg-color: #413f3f;

    .abstract {
      color: rgba(255, 255, 255, 0.4) !important;
    }
  }
}
</style>
