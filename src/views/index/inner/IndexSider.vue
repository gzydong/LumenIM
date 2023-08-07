<script setup lang="ts">
import { computed, nextTick, reactive, ref, onMounted, h, inject } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { useDialogueStore, useTalkStore } from '@/store'
import { NDropdown, NSkeleton, NIcon, NInput, NPopover } from 'naive-ui'
import {
  Search,
  ArrowUp,
  ArrowDown,
  Logout,
  Delete,
  Clear,
  Remind,
  CloseRemind,
  EditTwo,
  IdCard,
  Plus,
} from '@icon-park/vue-next'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import TalkItem from './TalkItem.vue'
import {
  ServeTopTalkList,
  ServeClearTalkUnreadNum,
  ServeDeleteTalkList,
  ServeSetNotDisturb,
} from '@/api/chat'
import { ServeSecedeGroup } from '@/api/group'
import { ServeDeleteContact, ServeEditContactRemark } from '@/api/contact'
import GroupLaunch from '@/components/group/GroupLaunch.vue'
import { findTalk, findTalkIndex, getCacheIndexName } from '@/utils/talk'

const user: any = inject('$user')
const dialogueStore = useDialogueStore()
const talkStore = useTalkStore()
const isShowGroup = ref(false)
const searchKeyword = ref('')
const topItems = computed(() => talkStore.topItems)
const unreadNum = computed(() => talkStore.talkUnreadNum)

const state = reactive({
  dropdown: {
    options: [],
    show: false,
    dropdownX: 0,
    dropdownY: 0,
    item: {},
  },
})

const items = computed(() => {
  if (searchKeyword.value.length === 0) {
    return talkStore.talkItems
  }

  return talkStore.talkItems.filter((item: any) => {
    let keyword = item.remark_name || item.name

    return (
      keyword.toLowerCase().indexOf(searchKeyword.value.toLowerCase()) != -1
    )
  })
})

// 列表加载状态
const loadStatus = computed(() => talkStore.loadStatus)

// 当前会话索引
const indexName = computed(() => dialogueStore.index_name)

const renderIcon = (icon: any) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    })
  }
}

const onDeleteTalk = (index_name = '') => {
  talkStore.delItem(index_name)

  index_name === indexName.value && dialogueStore.$reset()
}

// 切换会话
const onTabTalk = (data: any, follow = false) => {
  if (data.index_name === indexName.value) {
    return
  }

  searchKeyword.value = ''

  // 更新编辑信息
  dialogueStore.setDialogue(data)

  // 清空消息未读数
  if (data.unread_num > 0) {
    ServeClearTalkUnreadNum({
      talk_type: data.talk_type,
      receiver_id: data.receiver_id,
    }).then(() => {
      talkStore.updateItem({
        index_name: data.index_name,
        unread_num: 0,
      })
    })
  }

  // 设置滚动条跟随
  if (follow) {
    setTimeout(() => {
      let el = document.getElementById('talk-session-list')
      if (el) {
        let index = findTalkIndex(data.index_name)
        el.scrollTo({
          top: index * 66 + index * 5,
          behavior: 'smooth',
        })
      }
    }, 100)
  }
}

const onUserInfo = (data: any) => {
  user(data.receiver_id)
}

// 移除会话
const onRemoveTalk = (data: any) => {
  ServeDeleteTalkList({
    list_id: data.id,
  }).then(({ code }) => {
    if (code == 200) {
      onDeleteTalk(data.index_name)
    }
  })
}

// 设置消息免打扰
const onSetDisturb = (data: any) => {
  ServeSetNotDisturb({
    talk_type: data.talk_type,
    receiver_id: data.receiver_id,
    is_disturb: data.is_disturb == 0 ? 1 : 0,
  }).then(({ code, message }) => {
    if (code == 200) {
      window['$message'].success('设置成功!')
      talkStore.updateItem({
        index_name: data.index_name,
        is_disturb: data.is_disturb == 0 ? 1 : 0,
      })
    } else {
      window['$message'].error(message)
    }
  })
}

// 置顶会话
const onToTopTalk = (data: any) => {
  if (data.is_top == 0 && topItems.value.length >= 18) {
    return window['$message'].info('置顶最多不能超过18个会话')
  }

  ServeTopTalkList({
    list_id: data.id,
    type: data.is_top == 0 ? 1 : 2,
  }).then(({ code, message }) => {
    if (code == 200) {
      talkStore.updateItem({
        index_name: data.index_name,
        is_top: data.is_top == 0 ? 1 : 0,
      })
    } else {
      window['$message'].error(message)
    }
  })
}

// 移除联系人
const onDeleteContact = (data: any) => {
  let name = data.remark || data.name

  window['$dialog'].create({
    showIcon: false,
    title: `删除 [${name}] 联系人？`,
    content: '删除后不再接收对方任何消息。',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      ServeDeleteContact({
        friend_id: data.receiver_id,
      }).then(({ code, message }) => {
        if (code == 200) {
          window['$message'].success('删除联系人成功')
          onDeleteTalk(data.index_name)
        } else {
          window['$message'].error(message)
        }
      })
    },
  })
}

// 退出群聊
const onSignOutGroup = (data: any) => {
  window['$dialog'].create({
    showIcon: false,
    title: `退出 [${data.name}] 群聊？`,
    content: '退出后不再接收此群的任何消息。',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      ServeSecedeGroup({
        group_id: data.receiver_id,
      }).then(({ code, message }) => {
        if (code == 200) {
          window['$message'].success('已退出群聊')
          onDeleteTalk(data.index_name)
        } else {
          window['$message'].error(message)
        }
      })
    },
  })
}

const onChangeRemark = (data: any) => {
  let remark = ''
  window['$dialog'].create({
    showIcon: false,
    title: '修改备注',
    content: () => {
      return h(NInput, {
        defaultValue: data.remark_name,
        placeholder: '请输入备注信息',
        style: { marginTop: '20px' },
        onInput: value => (remark = value),
        autofocus: true,
      })
    },
    negativeText: '取消',
    positiveText: '修改备注',
    onPositiveClick: () => {
      ServeEditContactRemark({
        friend_id: data.receiver_id,
        remark: remark,
      }).then(({ code, message }) => {
        if (code == 200) {
          window['$message'].success('备注成功')
          talkStore.updateItem({
            index_name: data.index_name,
            remark_name: remark,
          })
        } else {
          window['$message'].error(message)
        }
      })
    },
  })
}

// 会话列表右键显示菜单
const onContextMenuTalk = (e, item) => {
  state.dropdown.show = false
  state.dropdown.item = Object.assign({}, item)
  state.dropdown.options = []

  if (item.talk_type == 1) {
    state.dropdown.options.push({
      icon: renderIcon(IdCard),
      label: '好友信息',
      key: 'info',
    })
    state.dropdown.options.push({
      icon: renderIcon(EditTwo),
      label: '修改备注',
      key: 'remark',
    })
  }

  state.dropdown.options.push({
    icon: renderIcon(item.is_top ? ArrowDown : ArrowUp),
    label: item.is_top ? '取消置顶' : '会话置顶',
    key: 'top',
  })

  state.dropdown.options.push({
    icon: renderIcon(item.is_disturb ? Remind : CloseRemind),
    label: item.is_disturb ? '关闭免打扰' : '开启免打扰',
    key: 'disturb',
  })

  state.dropdown.options.push({
    icon: renderIcon(Clear),
    label: '移除会话',
    key: 'remove',
  })

  if (item.talk_type == 1) {
    state.dropdown.options.push({
      icon: renderIcon(Delete),
      label: '删除好友',
      key: 'delete_contact',
    })
  } else {
    state.dropdown.options.push({
      icon: renderIcon(Logout),
      label: '退出群聊',
      key: 'signout_group',
    })
  }

  nextTick(() => {
    state.dropdown.show = true
    state.dropdown.dropdownX = e.clientX
    state.dropdown.dropdownY = e.clientY
  })

  e.preventDefault()
}

// 会话列表右键菜单回调事件
const onContextMenuTalkHandle = (key: string) => {
  // 注册回调事件
  const evnets = {
    info: onUserInfo,
    top: onToTopTalk,
    remove: onRemoveTalk,
    disturb: onSetDisturb,
    signout_group: onSignOutGroup,
    delete_contact: onDeleteContact,
    remark: onChangeRemark,
  }

  state.dropdown.show = false
  evnets[key] && evnets[key](state.dropdown.item)
}

const onReload = () => {
  talkStore.loadTalkList()
}

// 创建群聊回调事件
const onGroupCallBack = (data: any) => {
  onReload()
}

// 初始化加载
const onInitialize = () => {
  let index_name = getCacheIndexName()

  index_name && onTabTalk(findTalk(index_name), true)
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
    :show="state.dropdown.show"
    :x="state.dropdown.dropdownX"
    :y="state.dropdown.dropdownY"
    :options="state.dropdown.options"
    @select="onContextMenuTalkHandle"
    @clickoutside="
      () => {
        state.dropdown.show = false
        state.dropdown.item = {}
      }
    "
  />

  <section class="el-container is-vertical height100">
    <!-- 工具栏目 -->
    <header class="el-header tools-header">
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
    <header
      class="el-header tops-header"
      v-show="loadStatus == 3 && topItems.length > 0"
    >
      <n-popover
        v-for="item in topItems"
        :key="item.index_name"
        placement="bottom"
        trigger="hover"
      >
        <template #trigger>
          <div
            class="top-item pointer"
            @click="onTabTalk(item, true)"
            :class="{
              active: item.index_name == indexName,
            }"
          >
            <im-avatar :src="item.avatar" :size="34" :username="item.name" />

            <span class="icon-mark robot" v-show="item.is_robot == 1">
              助
            </span>

            <span
              class="icon-mark group"
              v-show="item.talk_type == 2 && item.is_robot == 0"
            >
              群
            </span>

            <span class="text">{{ item.remark_name || item.name }}</span>
          </div>
        </template>
        <span> {{ item.remark_name || item.name }} </span>
      </n-popover>
    </header>

    <!-- 标题栏目 -->
    <header
      v-show="loadStatus == 3 && talkStore.talkItems.length > 0"
      class="el-header notify-header"
      :class="{ shadow: false }"
    >
      <p>会话记录({{ talkStore.talkItems.length }})</p>
      <p>
        <span class="badge unread" v-show="unreadNum">{{ unreadNum }}未读</span>
      </p>
    </header>

    <template v-if="loadStatus == 2">
      <main id="talk-session-list" class="el-main me-scrollbar">
        <!-- 加载中模块 -->
        <template v-if="loadStatus == 2">
          <div class="skeleton flex-center" v-for="i in 10" :key="i">
            <div class="avatar"><n-skeleton circle size="medium" /></div>
            <div class="content">
              <n-skeleton text :repeat="1" />
              <n-skeleton text style="width: 60%" />
            </div>
          </div>
        </template>
      </main>
    </template>

    <template v-else>
      <div
        id="talk-session-list"
        class="el-main scroller me-scrollbar me-scrollbar-thumb"
      >
        <TalkItem
          v-for="item in items"
          :key="item.index_name"
          :data="item"
          :avatar="item.avatar"
          :username="item.remark_name || item.name"
          :active="item.index_name == indexName"
          @tab-talk="onTabTalk"
          @top-talk="onToTopTalk"
          @contextmenu.prevent="onContextMenuTalk($event, item)"
        />
      </div>

      <!-- <RecycleScroller
        id="talk-session-list"
        class="el-main scroller me-scrollbar me-scrollbar-thumb"
        :items="items"
        :item-size="72"
        key-field="index_name"
        v-slot="{ item }"
      >
        <div style="height: 72px">
          <TalkItem
            :key="item.index_name"
            :data="item"
            :avatar="item.avatar"
            :username="item.remark_name || item.name"
            :active="item.index_name == indexName"
            @tab-talk="onTabTalk"
            @top-talk="onToTopTalk"
            @contextmenu.prevent="onContextMenuTalk($event, item)"
          />
        </div>
      </RecycleScroller> -->
    </template>
  </section>

  <GroupLaunch
    v-if="isShowGroup"
    @close="isShowGroup = false"
    @on-submit="onGroupCallBack"
  />
</template>

<style lang="less" scoped>
.tools-header {
  height: 60px;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 0 8px;
}

.notify-header {
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

.tops-header {
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

.skeleton {
  padding: 5px 10px;
  margin: 8px 0;

  .avatar {
    width: 50px;
  }

  .content {
    flex: auto;
  }
}

.empty-list {
  margin-top: 30%;
  width: 100%;
  text-align: center;
}

html[data-theme='dark'] {
  .notify-header {
    &.shadow {
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
