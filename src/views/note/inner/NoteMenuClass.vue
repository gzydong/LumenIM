<script setup>
import { useCommonContextMenu } from '@/hooks/useCommonContextMenu.ts'
import { useNoteStore } from '@/store'
import { Add, More } from '@icon-park/vue-next'
import { VueDraggable } from 'vue-draggable-plus'

const store = useNoteStore()
const isShowAddInput = ref(false)

const items = ref([])

const { menu, ContextMenuElement } = useCommonContextMenu(onContextMenuHandle)

function onContextMenuHandle(key) {
  const item = menu.getItem()

  if (key == 'rename') {
    item.is_edit = true
  } else if (key == 'delete') {
    store.deleteClass(item.id)
  }
}
// 会话列表右键显示菜单
const onContextMenu = (e, item) => {
  menu.show(
    e,
    [
      {
        label: '重命名',
        key: 'rename'
      },
      {
        label: '删除',
        key: 'delete'
      }
    ],
    item
  )
}

const onAddClass = (e) => {
  const value = e.target.value
  const id = e.target.dataset.id
  if (value) {
    store.editClass(parseInt(id), value)
  }

  isShowAddInput.value = false
}
const onDragEnd = (e) => {
  store.sort(items.value.map((item) => item.id))
}

const loadWatchClassMenu = () => {
  watch(
    () => store.class,
    () => {
      items.value = store.class.map((item) => {
        return { ...item, is_edit: false }
      })
    },
    {
      deep: true
    }
  )
}

loadWatchClassMenu()
</script>

<template>
  <section class="h-full w-full category">
    <div class="category-header">
      <div class="title" style="color: rgb(108 102 102)">笔记分类({{ store.class.length }})</div>
      <div class="icon pointer" @click="isShowAddInput = true">
        <n-popover trigger="hover">
          <template #trigger> <n-icon size="16" :component="Add" /> </template>
          <span>新建分类</span>
        </n-popover>
      </div>
    </div>

    <div class="category-submenu">
      <div class="category-submenu-item" v-if="isShowAddInput">
        <input
          class="category-input"
          v-focus
          :data-id="0"
          @keyup.enter="$event.target.blur()"
          @blur="onAddClass($event)"
          type="text"
          placeholder="新建分类"
        />
      </div>

      <VueDraggable ref="el" v-model="items" @end="onDragEnd">
        <div
          class="category-submenu-item"
          v-for="item in items"
          :class="{
            actived: store.notes.params.find_type == 3 && store.notes.params.classify_id == item.id
          }"
          :key="item.id"
          @click="store.setParams({ find_type: 3, classify_id: item.id })"
        >
          <template v-if="item.is_edit">
            <input
              class="category-input"
              v-focus
              :data-id="item.id"
              @keyup.enter="$event.target.blur()"
              @blur="onAddClass($event)"
              :value="item.class_name"
              type="text"
              placeholder="新建分类"
            />
          </template>

          <template v-else>
            <div class="content">
              {{ item.class_name }}
            </div>
            <div class="more-icon" @click.stop="onContextMenu($event, item)">
              <n-icon size="16" :component="More" />
            </div>
            <div class="more-num">{{ item.count > 0 ? item.count : '' }}</div>
          </template>
        </div>
      </VueDraggable>
    </div>
  </section>

  <!-- 右键菜单 -->
  <ContextMenuElement />
</template>

<style lang="less" scoped>
.category {
  .category-header {
    height: 36px;
    padding: 0px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .category-submenu {
    margin: 3px 0px;
    padding: 0 15px;

    .category-input {
      width: 100%;
      border: 1px solid var(--im-primary-color);
      height: 28px;
      padding: 2px 8px;
      font-size: 12px;
      border-radius: 2px;
      box-sizing: border-box;
      transition: all 0.5s;

      &::placeholder {
        content: 'adfas' asfdas;
      }
    }

    .category-submenu-item {
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: start;
      gap: 5px;
      transition: all 0.5s;
      cursor: pointer;
      user-select: none;
      font-size: 13px;

      &:hover,
      &.actived {
        color: var(--im-primary-color);
      }

      .more-icon,
      .more-num {
        margin-left: auto;
      }

      .more-icon {
        display: none;
        align-items: center;
      }

      &:hover {
        .more-icon {
          display: flex;
        }

        .more-num {
          display: none;
        }
      }
    }
  }
}

html[theme-mode='dark'] {
  .category-input {
    border: 1px solid var(--border-color);
    background-color: var(--im-bg-color);
    color: var(--im-text-color);
  }
}
</style>
