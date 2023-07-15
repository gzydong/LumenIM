<script setup lang="ts">
import { computed } from 'vue'
import { NSpace, NTabs, NTab, NDropdown } from 'naive-ui'
import { useFriendsMenu } from '@/composition/group-list-menu'

const { dropdown, showDropdownMenu, closeDropdownMenu } = useFriendsMenu()

const emit = defineEmits(['user'])

const props = defineProps({
  members: {
    default: () => [],
  },
})

const filter: any = computed(() => {
  return props.members.filter((item: any) => item.online)
})

const onContextMenu = (e, item) => {
  // showDropdownMenu(e, item)

  e.preventDefault()
}

const onContextMenuHandle = (key = '') => {
  const evnets = {}

  // 触发事件
  evnets[key] && evnets[key](dropdown.item)

  closeDropdownMenu()
}
</script>

<template>
  <section class="el-container is-vertical section bdr-l">
    <header class="el-header header">
      <span>群成员({{ members.length }})</span>
      <!-- <span>{{ members.length }}</span> -->
    </header>
    <main class="el-main main me-scrollbar">
      <div
        class="item pointer"
        v-for="item in members"
        :key="item.id"
        @click="emit('user', item.id)"
        @contextmenu.prevent="onContextMenu($event, item)"
      >
        <n-avatar class="avatar" round :size="16" :src="item.avatar" />

        <span class="nickname online text-ellipsis">
          {{ item.remark || item.nickname }}
        </span>
      </div>
    </main>

    <!-- 右键菜单 -->
    <n-dropdown
      :show="dropdown.show"
      :show-arrow="true"
      placement="left"
      :x="dropdown.x"
      :y="dropdown.y"
      :options="dropdown.options"
      @select="onContextMenuHandle"
      @clickoutside="closeDropdownMenu"
    />
  </section>
</template>

<style lang="less" scoped>
.header {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;

  .slide {
    height: 100%;
    width: 10px;
    background-color: rebeccapurple;
  }
}

.main {
  overflow-y: auto;

  .item {
    height: 34px;
    margin-bottom: 3px;
    display: flex;
    align-items: center;
    transition: all 0.5s;
    padding: 0 8px;

    .avatar {
      flex-shrink: 0;
    }

    .nickname {
      margin-left: 10px;
    }

    &:hover {
      background-color: #f5f5f5;
    }
  }
}
</style>
