<script setup>
import { useNoteStore } from '@/store'
import { CalendarThirty, DeleteThemes, DocAdd, FolderFocus, Right } from '@icon-park/vue-next'
import NoteMenuClass from './NoteMenuClass.vue'
import RecycleModal from './RecycleModal.vue'

const store = useNoteStore()

const isShowRecycleModal = ref(false)

const getCalssId = () => {
  return store.notes.params.classify_id
}
const onInit = () => {
  store.loadClass()
  store.loadNoteList({}, true)
}

onInit()
</script>

<template>
  <section class="el-container is-vertical section h-full w-full">
    <header class="el-header menu-header">
      <n-button ghost @click="() => store.addNewNote(getCalssId())" block>
        <template #icon>
          <n-icon size="16" :component="DocAdd" />
        </template>
        新建笔记
      </n-button>
    </header>

    <header class="el-header menu-sub-header">
      <span style="color: rgb(108 102 102)">我的笔记</span>

      <n-popover trigger="hover">
        <template #trigger>
          <n-icon
            size="16"
            :component="DeleteThemes"
            @click="isShowRecycleModal = true"
            class="pointer"
          />
        </template>
        <span>回收站</span>
      </n-popover>
    </header>

    <n-scrollbar class="el-main h-full">
      <div class="navs">
        <div
          class="nav-item pointer"
          :class="{ actived: store.notes.params.find_type == 1 }"
          @click="store.setParams({ find_type: 1 })"
        >
          <div class="icon-left">
            <n-icon size="16" :component="CalendarThirty" />
          </div>
          <div class="title">近期编辑</div>
          <div class="icon-right">
            <n-icon size="16" :component="Right" />
          </div>
        </div>

        <div
          class="nav-item pointer"
          :class="{ actived: store.notes.params.find_type == 2 }"
          @click="store.setParams({ find_type: 2 })"
        >
          <div class="icon-left">
            <n-icon size="16" :component="FolderFocus" />
          </div>
          <div class="title">我的收藏</div>
          <div class="icon-right">
            <n-icon size="16" :component="Right" />
          </div>
        </div>
      </div>

      <div style="margin: 15px">
        <n-divider style="margin: 0" />
      </div>

      <NoteMenuClass />
    </n-scrollbar>
  </section>

  <RecycleModal v-if="isShowRecycleModal" @close="isShowRecycleModal = false" />
</template>

<style lang="less" scoped>
.section {
  .menu-header {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 15px;
  }

  .menu-sub-header {
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .navs {
    .nav-item {
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: start;
      gap: 15px;
      margin: 3px 15px;

      &.actived {
        color: var(--im-primary-color);
      }

      .icon-left {
        display: flex;
        align-items: center;
      }

      .icon-right {
        margin-left: auto;
      }
    }
  }
}
</style>
