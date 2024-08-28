<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { useDialogueStore, useTalkStore } from '@/store'
import { NDropdown, NVirtualList } from 'naive-ui'
import type { VirtualListInst } from 'naive-ui'
import TalkItem from './TalkItem.vue'
import Skeleton from './Skeleton.vue'
import TabsHeader from './TabsHeader.vue'
import TopHeader from './TopHeader.vue'
import SearchHeader from './SearchHeader.vue'
import { ServeClearTalkUnreadNum } from '@/api/chat'
import GroupLaunch from '@/components/group/GroupLaunch.vue'
import { getCacheIndexName, formatTalkItem } from '@/utils/talk'
import { ISession } from '@/types/chat'
import { useSessionMenu, useEventBus } from '@/hooks'
import { bus } from '@/utils'
import { SessionConst } from '@/constant/event-bus'

const {
  dropdown,
  onContextMenuTalkHandle,
  onContextMenu: onContextMenuTalk,
  onCloseContextMenu,
  onToTopTalk
} = useSessionMenu()

const dialogueStore = useDialogueStore()
const talkStore = useTalkStore()

const selectIndex = ref(0)
const isShowGroup = ref(false)
const searchKeyword = ref('')

const virtualListInst = ref<VirtualListInst>()

const items = computed(() => {
  if (searchKeyword.value.length === 0) {
    switch (selectIndex.value) {
      case 1:
        return talkStore.friendItems
      case 2:
        return talkStore.groupItems
      case 3:
        return talkStore.unreadItems
      default:
        return talkStore.items
    }
  }

  return talkStore.items.filter((item) => {
    const keyword = item.remark || item.name
    return keyword.toLowerCase().includes(searchKeyword.value.toLowerCase())
  })
})

const loadStatus = computed(() => talkStore.loadStatus)
const indexName = computed(() => dialogueStore.index_name)

const onTabTalk = (item: ISession, follow = false) => {
  if (item.index_name === indexName.value) return

  const data = { talk_mode: item.talk_mode, to_from_id: item.to_from_id }

  bus.emit(SessionConst.Switch, data)

  searchKeyword.value = ''
  dialogueStore.setDialogue(item)

  if (item.unread_num > 0) {
    talkStore.clearUnreadNum(item.index_name)
    ServeClearTalkUnreadNum(data)
  }

  if (follow) scrollToItem(item)
}

const scrollToItem = (item: ISession) => {
  if (selectIndex.value != 0) return

  const index = items.value.findIndex((i) => i.index_name === item.index_name)

  if (index == -1) return

  virtualListInst.value?.scrollTo({
    top: index * 66,
    behavior: 'smooth'
  })
}

const onKeywordChange = () => {
  selectIndex.value = 0
}

const onGroupLaunchCreate = (groupId: number, groupName: string) => {
  const item = formatTalkItem({
    talk_mode: 2,
    to_from_id: groupId,
    name: groupName
  })

  talkStore.addItem(item as ISession)
}

const onInitialize = () => {
  const index_name = getCacheIndexName()
  if (index_name) {
    const item = talkStore.findItem(index_name)
    item && onTabTalk(item)
  }
}

onBeforeRouteUpdate(onInitialize)

onMounted(() => {
  talkStore.loadTalkList()
  onInitialize()
})

useEventBus([
  {
    name: 'talk-session-scroll',
    event: (data?: any) => {
      data && virtualListInst.value?.scrollTo(data)
    }
  }
])
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

  <section class="el-container container is-vertical height100">
    <!-- 工具栏目 -->
    <SearchHeader
      v-model="searchKeyword"
      @on-keyword-change="onKeywordChange"
      @show-group-box="isShowGroup = true"
    />

    <!-- 置顶栏目 -->
    <TopHeader
      :index-name="indexName"
      :items="talkStore.topItems"
      v-show="loadStatus === 3 && talkStore.topItems.length > 0"
      @tab-talk="(value: any) => onTabTalk(value, true)"
    />

    <!-- tabs栏目 -->
    <TabsHeader v-show="loadStatus === 3" v-model="selectIndex" />

    <main class="el-main">
      <template v-if="loadStatus === 2"><Skeleton /></template>
      <template v-else-if="!items.length">
        <div class="empty-box">
          <n-empty description="暂无会话" />
        </div>
      </template>
      <template v-else>
        <n-virtual-list
          ref="virtualListInst"
          style="max-height: inherit; cursor: pointer"
          :item-size="66"
          :items="items"
        >
          <template #default="{ item }">
            <TalkItem
              :key="item.index_name"
              :data="item"
              :avatar="item.avatar"
              :username="item.remark || item.name"
              :active="item.index_name === indexName"
              @tab-talk="onTabTalk"
              @top-talk="onToTopTalk"
              @contextmenu.prevent="onContextMenuTalk($event, item)"
            />
          </template>
        </n-virtual-list>
      </template>
    </main>
  </section>

  <GroupLaunch
    :group-id="0"
    v-if="isShowGroup"
    @close="isShowGroup = false"
    @on-submit="onGroupLaunchCreate"
  />
</template>

<style lang="less" scoped>
.empty-box {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 100px;
}
</style>
