<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { useDialogueStore, useTalkStore } from '@/store'
import { NDropdown, NIcon, NInput, NPopover } from 'naive-ui'
import { Search, Plus } from '@icon-park/vue-next'
import TalkItem from './TalkItem.vue'
import Skeleton from './Skeleton.vue'
import { ServeClearTalkUnreadNum } from '@/api/chat'
import GroupLaunch from '@/components/group/GroupLaunch.vue'
import { getCacheIndexName } from '@/utils/talk'
import { ISession } from '@/types/chat'
import { useSessionMenu } from '@/hooks'

const {
  dropdown,
  onContextMenuTalkHandle,
  onContextMenu: onContextMenuTalk,
  onCloseContextMenu,
  onToTopTalk
} = useSessionMenu()

const dialogueStore = useDialogueStore()
const talkStore = useTalkStore()
const isShowGroup = ref(false)
const searchKeyword = ref('')
const topItems = computed((): ISession[] => talkStore.topItems)
const unreadNum = computed(() => talkStore.talkUnreadNum)

const items = computed((): ISession[] => {
  if (searchKeyword.value.length === 0) {
    return talkStore.talkItems
  }

  return talkStore.talkItems.filter((item: ISession) => {
    let keyword = item.remark || item.name

    return keyword.toLowerCase().indexOf(searchKeyword.value.toLowerCase()) != -1
  })
})

// 列表加载状态
const loadStatus = computed(() => talkStore.loadStatus)

// 当前会话索引
const indexName = computed(() => dialogueStore.index_name)

// 切换会话
const onTabTalk = (item: ISession, follow = false) => {
  if (item.index_name === indexName.value) return

  searchKeyword.value = ''

  // 更新编辑信息
  dialogueStore.setDialogue(item)

  // 清空消息未读数
  if (item.unread_num > 0) {
    ServeClearTalkUnreadNum({
      talk_type: item.talk_type,
      receiver_id: item.receiver_id
    }).then(() => {
      talkStore.updateItem({
        index_name: item.index_name,
        unread_num: 0
      })
    })
  }

  // 设置滚动条跟随
  if (follow) {
    const el = document.getElementById('talk-session-list')
    if (el) {
      let index = talkStore.findTalkIndex(item.index_name)

      el.scrollTo({
        top: index * 66 + index * 5,
        behavior: 'smooth'
      })
    }
  }
}

const onReload = () => {
  talkStore.loadTalkList()
}

// 初始化加载
const onInitialize = () => {
  let index_name = getCacheIndexName()

  index_name && onTabTalk(talkStore.findItem(index_name), true)
}

// 路由更新事件
onBeforeRouteUpdate(onInitialize)

onMounted(() => {
  onInitialize()
})
</script>

<template>
  <!-- 右键菜单 -->
  <n-dropdown
    class="dropdown-menus"
    :show="dropdown.show"
    :x="dropdown.x"
    :y="dropdown.y"
    :options="dropdown.options"
    @select="onContextMenuTalkHandle"
    @clickoutside="onCloseContextMenu"
  />

  <section class="el-container is-vertical height100">
    <!-- 工具栏目 -->
    <header class="el-header header-tools">
      <n-input
        placeholder="搜索好友 / 群聊"
        v-model:value.trim="searchKeyword"
        round
        clearable
        style="width: 78%"
      >
        <template #prefix>
          <n-icon :component="Search" />
        </template>
      </n-input>

      <n-button circle @click="isShowGroup = true">
        <template #icon>
          <n-icon :component="Plus" />
        </template>
      </n-button>
    </header>

    <!-- 置顶栏目 -->
    <header class="el-header header-top" v-show="loadStatus == 3 && topItems.length > 0">
      <n-popover v-for="item in topItems" :key="item.index_name" placement="bottom" trigger="hover">
        <template #trigger>
          <div
            class="top-item pointer"
            @click="onTabTalk(item, true)"
            :class="{
              active: item.index_name == indexName
            }"
          >
            <im-avatar :src="item.avatar" :size="34" :username="item.name" />

            <span class="icon-mark robot" v-show="item.is_robot == 1"> 助 </span>

            <span class="icon-mark group" v-show="item.talk_type == 2 && item.is_robot == 0">
              群
            </span>

            <span class="text">{{ item.remark || item.name }}</span>
          </div>
        </template>
        <span> {{ item.remark || item.name }} </span>
      </n-popover>
    </header>

    <!-- 标题栏目 -->
    <header
      v-show="loadStatus == 3 && talkStore.talkItems.length > 0"
      class="el-header header-badge"
      :class="{ shadow: false }"
    >
      <p>会话记录({{ talkStore.talkItems.length }})</p>
      <p>
        <span class="badge unread" v-show="unreadNum">{{ unreadNum }}未读</span>
      </p>
    </header>

    <main id="talk-session-list" class="el-main me-scrollbar me-scrollbar-thumb">
      <template v-if="loadStatus == 2"><Skeleton /></template>
      <template v-else>
        <TalkItem
          v-for="item in items"
          :key="item.index_name"
          :data="item"
          :avatar="item.avatar"
          :username="item.remark || item.name"
          :active="item.index_name == indexName"
          @tab-talk="onTabTalk"
          @top-talk="onToTopTalk"
          @contextmenu.prevent="onContextMenuTalk($event, item)"
        />
      </template>
    </main>
  </section>

  <GroupLaunch v-if="isShowGroup" @close="isShowGroup = false" @on-submit="onReload" />
</template>

<style lang="less" scoped>
.header-tools {
  height: 60px;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 0 8px;
}

.header-badge {
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 10px;

  &.shadow {
    box-shadow: 0 2px 6px 0 rgb(31 35 41 / 5%);
  }

  .unread {
    background-color: #ff4d4f;
    color: white;
    cursor: pointer;
  }
}

.header-top {
  padding: 5px 8px;
  padding-right: 0;
  padding-right: 8px;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  grid-gap: 0 14px;
  grid-template-columns: repeat(auto-fill, 32px);
  display: grid;
  box-sizing: border-box;

  .top-item {
    flex-basis: 46px;
    flex-shrink: 0;
    height: 56px;
    margin: 3px 2px 3px 2px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;

    .icon-mark {
      position: absolute;
      height: 25px;
      width: 25px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      right: -12px;
      bottom: 15px;
      transform: scale(0.6);
      border-radius: 50%;

      &.group {
        color: #3370ff;
        background-color: #e1eaff;
      }

      &.robot {
        color: #dc9b04 !important;
        background-color: #faf1d1 !important;
      }
    }
    &.active {
      .text {
        color: rgb(80 138 254);
      }
    }

    .text {
      display: inline-block;
      height: 20px;
      font-size: 12px;
      transform: scale(0.9);
      text-align: center;
      line-height: 20px;
      word-break: break-all;
      overflow: hidden;
    }
  }
}

html[theme-mode='dark'] {
  .header-badge {
    &.shadow {
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
