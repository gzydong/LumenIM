<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { NScrollbar, NDropdown } from 'naive-ui'
import RecycleModal from './RecycleModal.vue'
import { Down, AddOne, Plus } from '@icon-park/vue-next'
import { useNoteStore } from '@/store'

const store = useNoteStore()

let activedMenu = ref('0-0')

const menus = reactive([
  {
    name: '近期编辑',
    indexName: '0-0',
    submenus: []
  },
  {
    name: '我的收藏',
    indexName: '1-0',
    submenus: []
  },
  {
    name: '笔记分类',
    indexName: '2-1',
    isShowSub: true,
    isShowCount: true,
    isSubNode: true,
    submenus: []
  },
  {
    name: '笔记标签',
    indexName: '3-0',
    isShowSub: false,
    isShowCount: true,
    isSubNode: true,
    submenus: []
  }
])

const isShowRecycleModal = ref(false)
const dropdownMenu = reactive({
  options: [],
  show: false,
  dropdownX: 0,
  dropdownY: 0,
  item: {}
})

const loadWatchClassMenu = () => {
  watch(
    () => store.class,
    () => {
      let items = []
      for (const item of store.class) {
        items.push({
          id: item.id,
          name: item.class_name,
          count: item.count,
          isEdit: false,
          indexName: `2-${item.id}`
        })
      }

      menus[2].submenus = items
    },
    {
      deep: true
    }
  )
}

const loadWatchTagsMenu = () => {
  watch(
    () => store.tags,
    () => {
      let items = []

      for (const item of store.tags) {
        items.push({
          id: item.id,
          name: item.tag_name,
          count: item.count,
          isEdit: false,
          indexName: `3-${item.id}`
        })
      }

      menus[3].submenus = items
    },
    {
      deep: true
    }
  )
}

const getCalssId = () => {
  let str = activedMenu.value

  if (str.substring(0, 1) != '2') {
    return 0
  }

  return parseInt(str.substring(2))
}

// 一级菜单点击事件
const onMenuLevel1Event = (menu, index) => {
  if (menu.isSubNode) {
    menu.isShowSub = !menu.isShowSub
  } else {
    activedMenu.value = menu.indexName

    switch (index) {
      case 0:
        store.loadNoteList({ page: 1, find_type: 1 })
        break
      case 1:
        store.loadNoteList({ page: 1, find_type: 2 })
        break
    }
  }
}

// 二级菜单点击事件
const onMenuLevel2Event = (submenu, index) => {
  if (submenu.isEdit) {
    return
  }

  if (index === 2) {
    // 笔记分类
    store.loadNoteList({ page: 1, find_type: 3, cid: submenu.id })
  } else if (index === 3) {
    // 标签分类
    store.loadNoteList({ page: 1, find_type: 4, cid: submenu.id })
  }

  activedMenu.value = submenu.indexName
}

const onToolsMenu = (value) => {
  if (value == 'class') {
    menus[2].isShowSub = true
    menus[2].submenus.unshift({
      id: -1,
      name: '',
      isEdit: true,
      indexName: '2--1'
    })
  } else if (value == 'tag') {
    menus[3].isShowSub = true
    menus[3].submenus.unshift({
      id: -1,
      name: '',
      isEdit: true,
      indexName: '3--1'
    })
  }
}

const onEditNoteMenu = (e, i, i2, submenu) => {
  let name = e.target.value.trim()
  let id = submenu.id == -1 ? 0 : submenu.id

  // 删除
  if (name == '' && submenu.id == -1) {
    return menus[i].submenus.splice(i2, 1)
  }

  if (name == '' && submenu.id > 0) {
    return (submenu.isEdit = false)
  }

  if (i == 2) {
    store.editClass(id, name)
  } else if (i == 3) {
    store.editTag(id, name)
  }
}

// 会话列表右键显示菜单
const onContextMenu = (e, i, i2, submenu) => {
  dropdownMenu.show = false
  dropdownMenu.item = {
    index: i,
    index2: i2,
    submenu: submenu
  }

  dropdownMenu.options = [
    {
      label: '重命名',
      key: 'rename'
    },
    {
      label: '删除',
      key: 'delete'
    }
  ]

  nextTick(() => {
    dropdownMenu.show = true
    dropdownMenu.dropdownX = e.clientX
    dropdownMenu.dropdownY = e.clientY
  })

  e.preventDefault()
}

const onContextMenuHandle = (value) => {
  let submenu = menus[dropdownMenu.item.index].submenus[dropdownMenu.item.index2]

  if (value == 'rename') {
    submenu.isEdit = true
  } else if (value == 'delete') {
    if (dropdownMenu.item.index == 2) {
      store.deleteClass(submenu.id)
    } else if (dropdownMenu.item.index == 3) {
      store.deleteTag(submenu.id)
    }
  }

  dropdownMenu.show = false
}

const onInit = () => {
  store.loadClass()
  store.loadTags()
  store.loadNoteList({}, true)
}

onInit()
loadWatchClassMenu()
loadWatchTagsMenu()
</script>

<template>
  <section class="el-container is-vertical section">
    <header class="el-header menu-header">
      <n-button
        type="primary"
        round
        @click="
          () => {
            store.addNewNote(getCalssId())
          }
        "
        class="btn-add"
      >
        + 新建笔记
      </n-button>

      <n-dropdown
        class="tools-menus"
        :animated="true"
        trigger="click"
        :show-arrow="false"
        @select="onToolsMenu"
        :options="[
          {
            label: '创建分类',
            key: 'class'
          },
          {
            label: '创建标签',
            key: 'tag'
          }
        ]"
      >
        <n-button circle type="primary" ghost>
          <n-icon :size="22" :component="Plus" />
        </n-button>
      </n-dropdown>
    </header>

    <header class="el-header menu-subheader">
      <span>我的笔记</span>
      <span
        ><n-button
          type="primary"
          size="tiny"
          ghost
          round
          color="red"
          @click="isShowRecycleModal = true"
        >
          回收站
        </n-button></span
      >
    </header>

    <main class="el-main height100">
      <n-scrollbar>
        <div v-for="(menu, i) in menus" :key="i" class="menu">
          <div
            class="menu-level1 pointer"
            :class="{ actived: menu.indexName == activedMenu }"
            @click="onMenuLevel1Event(menu, i)"
          >
            <span class="dot">●</span>

            <span>
              {{ menu.name }}
              <template v-if="menu.isShowCount"> ({{ menu.submenus.length }}) </template>
            </span>

            <n-icon v-show="menu.submenus.length" class="nav-icon" size="18" :component="Down" />
          </div>

          <div
            v-for="(submenu, i2) in menu.submenus"
            v-show="menu.isShowSub"
            :key="i2"
            class="menu-level2 pointer"
            :class="{ actived: submenu.indexName == activedMenu }"
            @click="onMenuLevel2Event(submenu, i)"
          >
            <p v-if="submenu.isEdit">
              <input
                v-focus
                :value="submenu.name"
                @keyup.enter="$event.target.blur()"
                @blur="onEditNoteMenu($event, i, i2, submenu)"
                type="text"
              />
            </p>
            <p v-else @contextmenu.prevent="onContextMenu($event, i, i2, submenu)">
              <span>|- {{ submenu.name }}</span>
              <span v-if="submenu.count">({{ submenu.count }})</span>
            </p>
          </div>
        </div>
      </n-scrollbar>
    </main>
  </section>

  <!-- 右键菜单 -->
  <n-dropdown
    :show="dropdownMenu.show"
    :x="dropdownMenu.dropdownX"
    :y="dropdownMenu.dropdownY"
    :options="dropdownMenu.options"
    @select="onContextMenuHandle"
    @clickoutside="
      () => {
        dropdownMenu.show = false
        dropdownMenu.item = {}
      }
    "
  />

  <RecycleModal v-if="isShowRecycleModal" @close="isShowRecycleModal = false" />
</template>

<style lang="less" scoped>
.section {
  width: 100%;
  height: 100%;

  .menu-header {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    .btn-add {
      width: 150px;
    }
  }

  .menu-subheader {
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    font-size: 16px;
    font-weight: 300;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .menu {
    .menu-level1 {
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      position: relative;
      user-select: none;

      &:hover {
        background: var(--im-hover-bg-color);
      }

      .dot {
        color: #ff9800;
        font-size: 12px;
        display: inline-flex;
        transform: scale(0.75);
        transform-origin: left;
      }

      > span {
        padding-left: 5px;
        font-size: 13px;
      }

      .nav-icon {
        position: absolute;
        right: 10px;
        top: 10px;
      }
    }

    .menu-level2 {
      height: 35px;
      line-height: 35px;
      padding-left: 32px;
      user-select: none;
      font-size: 12px;

      input {
        width: 165px;
        border: 1px solid #66b1ff;
        height: 28px;
        padding: 2px 8px;
        font-size: 12px;
        border-radius: 2px;
        box-sizing: border-box;
      }

      &:hover {
        color: #448aff;
      }
    }

    .actived {
      background: var(--im-active-bg-color);
    }
  }
}

html[theme-mode='dark'] {
  .menu-level2 {
    input {
      border: 1px solid var(--border-color);
      background-color: var(--im-bg-color);
      color: var(--im-text-color);
    }
  }
}
</style>
