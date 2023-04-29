<script setup>
import { Search, SortAmountDown, SortAmountUp } from '@icon-park/vue-next'
import { NImage, NScrollbar } from 'naive-ui'
import { useNoteStore } from '@/store/note'
import { debounce } from '@/utils/common'
import Loading from '@/components/base/Loading.vue'
const store = useNoteStore()

const onCatDetail = item => {
  store.loadDetail(item.id)
}

const onSearchInput = debounce(e => {
  store.loadNoteList({}, false)
}, 500)
</script>
<template>
  <section class="el-container is-vertical section">
    <header class="el-header search-header">
      <div class="icon">
        <n-icon size="18" :component="Search" />
      </div>

      <input
        type="text"
        v-model="store.notes.params.keyword"
        placeholder="搜索我的笔记 ..."
        maxlength="30"
        @input="onSearchInput"
      />
    </header>

    <header class="el-header sub-header">
      <span>{{ store.notes.items.length }} 篇笔记</span>
      <div class="menu-icon">
        <n-icon size="18" :component="SortAmountDown" />
      </div>
    </header>

    <main
      class="el-main height100 flex-center"
      v-if="store.notes.loadStatus == 0"
    >
      <Loading />
    </main>

    <main
      class="el-main height100 flex-center"
      v-else-if="!store.notes.items.length"
    >
      <n-empty size="200" description="暂无相关数据">
        <template #icon>
          <img src="@/assets/image/no-data.svg" alt="" />
        </template>
      </n-empty>
    </main>

    <main class="el-main" v-else>
      <n-scrollbar>
        <div
          class="article"
          v-for="note in store.notes.items"
          :key="note.id"
          @click="onCatDetail(note)"
          :class="{ selectd: store.view.loadId == note.id }"
        >
          <div class="article-title">
            <span>{{ note.title }}</span>
          </div>

          <div class="article-main pointer">
            <div class="content">
              <div class="datetime">
                <span>{{ note.created_at.substr(0, 10) }}</span>
                <span>{{ note.class_name }}</span>
              </div>
              <div class="abstract">
                {{
                  note.abstract
                    .replace(/[\r\n]/g, '')
                    .replace(/(<([^>]+)>)/gi, '')
                }}
              </div>
            </div>

            <div class="image" v-show="note.image">
              <n-image
                width="56"
                height="56"
                preview-disabled
                style="border-radius: 2px"
                :src="note.image"
                fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
              />
            </div>
          </div>
        </div>
      </n-scrollbar>
    </main>
  </section>
</template>
<style lang="less" scoped>
.section {
  width: 100%;
  height: 100%;
  background: #f4f6f9;

  .search-header {
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
      background: #f4f6f9;

      &::-webkit-input-placeholder {
        color: rgb(158, 150, 150);
        font-size: 13px;
      }
    }
  }

  .sub-header {
    height: 40px;
    line-height: 40px;
    position: relative;
    color: #7b7777;
    border-top: 1px solid #ece8e8;
    border-bottom: 1px solid #ece8e8;
    font-size: 13px;
    padding: 0 10px;

    .menu-icon {
      position: absolute;
      right: 10px;
      top: 3px;
    }
  }
}

.article {
  min-height: 50px;
  padding: 10px 10px 5px 10px;
  position: relative;
  background: white;
  margin: 8px 5px;
  transition: border 0.1s;

  .article-title {
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    i {
      display: none;
    }
  }

  .article-main {
    display: flex;
    align-items: center;

    .content {
      flex-grow: 1;

      .datetime {
        display: flex;
        align-items: center;
        padding-top: 4px;
        font-size: 10px;
        color: #a7afbc;
        font-weight: 300;
        line-height: 1.6;

        span {
          margin-right: 15px;
        }
      }

      .abstract {
        display: -webkit-box;
        flex-grow: 1;
        max-height: 42px;
        font-size: 12px;
        color: #b5b5b5;
        line-height: 1.6;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        word-break: break-word;
        overflow: hidden;
      }
    }

    .image {
      width: 56px;
      height: 56px;
      flex-grow: 0;
      flex-shrink: 0;
      margin-left: 16px;
      cursor: pointer;
    }
  }

  &.selectd {
    .article-title {
      color: #5c504c;
      font-weight: bold;
    }

    border-left: 4px solid #2196f3;
  }
}
</style>
