<script setup>
import { computed, nextTick, reactive, ref, onMounted, h } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { useDialogueStore } from '@/store/dialogue'
import { useEditorStore } from '@/store/editor'
import { useTalkStore } from '@/store/talk'
import { NDropdown, NSkeleton, NEmpty, NIcon } from 'naive-ui'
import {
  ChatbubbleEllipsesOutline,
  AddSharp,
  TrashOutline,
  CreateOutline,
  EnterOutline,
  IdCardOutline,
  ArrowUp,
  ArrowDown,
  NotificationsOutline,
  NotificationsOffOutline,
} from '@vicons/ionicons5'
import TalkItem from './TalkItem.vue'
import {
  ServeTopTalkList,
  ServeClearTalkUnreadNum,
  ServeDeleteTalkList,
  ServeSetNotDisturb,
} from '@/api/chat'
import { ServeSecedeGroup, ServeGetGroupMembers } from '@/api/group'
import { ServeDeleteContact } from '@/api/contacts'
import GroupLaunch from '@/components/group/GroupLaunch.vue'
import UserCardModal from '@/components/user/UserCardModal.vue'
import { findTalk, findTalkIndex, getCacheIndexName } from '@/utils/talk'
import { modal } from '@/utils/common'
import { defAvatar } from '@/constant/default'

const dialogueStore = useDialogueStore()
const talkStore = useTalkStore()
const editorStore = useEditorStore()
const isShowGroup = ref(false)
const items = computed(() => talkStore.talkItems)
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

// 列表加载状态
const loadStatus = computed(() => talkStore.loadStatus)

// 当前会话索引
const indexName = computed(() => dialogueStore.index_name)

const renderIcon = icon => {
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
const onTabTalk = data => {
  if (data.index_name === indexName.value) {
    return
  }

  // 更新编辑信息
  dialogueStore.setDialogue({
    username: data.remark_name || data.name,
    talk_type: data.talk_type,
    receiver_id: data.receiver_id,
    online: data.is_online == 1,
  })

  // 更新编辑草稿
  dialogueStore.updateEditorText(data.draft_text)

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

  // 关闭提及功能
  editorStore.isShowMention = false

  if (data.talk_type == 2) {
    ServeGetGroupMembers({
      group_id: data.receiver_id,
    }).then(res => {
      if (res.code == 200) {
        editorStore.updateMentionItems(res.data || [])
      }
    })
  } else {
    editorStore.updateMentionItems([])
  }
}

const onUserInfo = data => {
  modal(UserCardModal, {
    uid: data.receiver_id,
  })
}

// 移除会话
const onRemoveTalk = data => {
  ServeDeleteTalkList({
    list_id: data.id,
  }).then(({ code }) => {
    if (code == 200) {
      onDeleteTalk(data.index_name)
    }
  })
}

// 设置消息免打扰
const onSetDisturb = data => {
  ServeSetNotDisturb({
    talk_type: data.talk_type,
    receiver_id: data.receiver_id,
    is_disturb: data.is_disturb == 0 ? 1 : 0,
  }).then(res => {
    if (res.code == 200) {
      $message.success('设置成功!')

      talkStore.updateItem({
        index_name: data.index_name,
        is_disturb: data.is_disturb == 0 ? 1 : 0,
      })
    } else {
      $message.error(res.message)
    }
  })
}

// 更新联系人备注
const onUpdateContactRemark = data => {
  $message.info('开发中...')
}

// 置顶会话
const onToTopTalk = data => {
  ServeTopTalkList({
    list_id: data.id,
    type: data.is_top == 0 ? 1 : 2,
  }).then(({ code }) => {
    if (code == 200) {
      talkStore.updateItem({
        index_name: data.index_name,
        is_top: data.is_top == 0 ? 1 : 0,
      })
    }
  })
}

// 移除联系人
const onDeleteContact = data => {
  window.$dialog.create({
    showIcon: false,
    title: `删除 [${data.name}] 联系人？`,
    content: '删除后不在接收对方任何消息。',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      ServeDeleteContact({
        friend_id: data.receiver_id,
      }).then(({ code }) => {
        if (code == 200) {
          $message.success('删除联系人成功！')
          onDeleteTalk(data.index_name)
        } else {
          $message.error(res.message)
        }
      })
    },
  })
}

// 退出群聊
const onSignOutGroup = data => {
  window.$dialog.create({
    showIcon: false,
    title: `退出 [${data.name}] 群聊？`,
    content: '退出后不在接收任何群消息。',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      ServeSecedeGroup({
        group_id: data.receiver_id,
      }).then(res => {
        if (res.code == 200) {
          $message.success('已退出群组！')
          onDeleteTalk(data.index_name)
        } else {
          $message.error(res.message)
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
      icon: renderIcon(IdCardOutline),
      label: '好友信息',
      key: 'info',
    })
    state.dropdown.options.push({
      icon: renderIcon(CreateOutline),
      label: '修改备注',
      key: 'remark',
    })
  }

  state.dropdown.options.push({
    icon: item.is_top ? renderIcon(ArrowDown) : renderIcon(ArrowUp),
    label: item.is_top ? '取消置顶' : '会话置顶',
    key: 'top',
  })

  state.dropdown.options.push({
    icon: item.is_disturb
      ? renderIcon(NotificationsOutline)
      : renderIcon(NotificationsOffOutline),
    label: item.is_disturb ? '关闭免打扰' : '开启免打扰',
    key: 'disturb',
  })

  state.dropdown.options.push({
    icon: renderIcon(TrashOutline),
    label: '移除会话',
    key: 'remove',
  })

  if (item.talk_type == 1) {
    state.dropdown.options.push({
      icon: renderIcon(TrashOutline),
      label: '删除好友',
      key: 'delete_contact',
    })
  } else {
    state.dropdown.options.push({
      icon: renderIcon(EnterOutline),
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
const onContextMenuTalkHandle = key => {
  // 注册回调事件
  const evnets = {
    info: onUserInfo,
    top: onToTopTalk,
    remove: onRemoveTalk,
    disturb: onSetDisturb,
    signout_group: onSignOutGroup,
    delete_contact: onDeleteContact,
  }

  state.dropdown.show = false
  evnets[key] && evnets[key](state.dropdown.item)
}

const onReload = () => {
  talkStore.loadTalkList()
}

// 创建群组回调事件
const onGroupCallBack = data => {
  onReload()
}

// 初始化加载
const onInitialize = () => {
  let index_name = getCacheIndexName()
  if (index_name) {
    onTabTalk(findTalk(index_name))

    // 设置滚动条
    document.getElementById('talk-session-list').scrollTop =
      findTalkIndex(index_name) * 66
  }
}

// 路由更新事件
onBeforeRouteUpdate(to => {
  onInitialize()
})

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
      <n-input placeholder="搜索聊天 / 好友 / 群组" round style="width: 78%">
        <template #prefix>
          <n-icon :component="ChatbubbleEllipsesOutline" />
        </template>
      </n-input>

      <n-button circle @click="isShowGroup = true">
        <template #icon>
          <n-icon :component="AddSharp"></n-icon>
        </template>
      </n-button>
    </header>

    <!-- 置顶栏目 -->
    <header
      class="el-header tops-header"
      v-show="loadStatus == 3 && topItems.length > 0"
    >
      <div
        class="top-item pointer"
        v-for="item in topItems"
        :key="item.index_name"
        @click="onTabTalk(item)"
        :class="{
          active: item.index_name == indexName,
        }"
      >
        <n-avatar
          v-if="item.avatar"
          round
          :src="item.avatar"
          :fallback-src="defAvatar"
        />
        <n-avatar
          v-else
          round
          :style="{
            color: '#ffffff',
            backgroundColor: '#508afe',
          }"
        >
          {{ item.name && (item.name.substr(0, 1) || '') }}
        </n-avatar>

        <span class="text">{{ item.remark_name || item.name }}</span>
      </div>
    </header>

    <!-- 标题栏目 -->
    <header
      v-show="loadStatus == 3 && topItems.length > 0"
      class="el-header notify-header"
    >
      <p>会话记录({{ items.length }})</p>
      <p>
        <span class="badge unread" v-show="unreadNum">{{ unreadNum }}未读</span>
      </p>
    </header>

    <!-- 侧边栏目 -->
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

      <!-- 加载成功模块 -->
      <template v-if="loadStatus == 3">
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

        <div class="empty-list" v-show="items.length === 0">
          <img src="@/assets/image/no-data.svg" alt="" />
          <p>暂无会话</p>
        </div>
      </template>

      <!-- 加载失败模块 -->
      <template v-if="loadStatus == 4">
        <n-empty
          description="数据加载异常，请点击重试..."
          style="margin-top: 30%"
        >
          <template #extra>
            <n-button size="small" text @click="onReload"> 加载数据 </n-button>
          </template>
        </n-empty>
      </template>
    </main>
  </section>

  <GroupLaunch
    v-if="isShowGroup"
    @close="isShowGroup = false"
    @on-submit="onGroupCallBack"
  />
</template>

<style lang="less" scoped>
.me-scrollbar {
  &::-webkit-scrollbar {
    background-color: unset;
  }
}

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
  }
}

.tops-header {
  min-height: 20px;
  background: #f0f8ff;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 5px 8px;
  overflow: hidden;
  flex-shrink: 0;
  justify-content: flex-start;

  .top-item {
    flex-basis: 46px;
    flex-shrink: 0;
    height: 56px;
    margin: 3px 2px 3px 2px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    &.active {
      .text {
        color: rgb(80 138 254);
      }
    }

    .text {
      display: inline-block;
      height: 20px;
      font-size: 12px;
      color: #8f959e;
      transform: scale(0.84);
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
</style>
