<script setup>
import { ref, computed, reactive, nextTick } from 'vue'
import { NSpace, NDropdown, NCheckbox } from 'naive-ui'
import { Search, Plus } from '@icon-park/vue-next'
import { defAvatar } from '@/constant/default'
import GroupLaunch from '../GroupLaunch.vue'
import UserCardModal from '@/components/user/UserCardModal.vue'
import { useUserStore } from '@/store/user'
import { modal } from '@/utils/common'

import {
  ServeGetGroupMembers,
  ServeRemoveMembersGroup,
  ServeGroupAssignAdmin,
  ServeGroupHandover,
  ServeGroupNoSpeak,
} from '@/api/group'

const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },
})

const userStore = useUserStore()
const isGroupLaunch = ref(false)
const keywords = ref('')
const batchDelete = ref(false)
const items = ref([])

const filterCheck = computed(() => {
  return items.value.filter(item => item.is_delete)
})

const filterSearch = computed(() => {
  if (!keywords.value.length) {
    return items.value
  }

  return items.value.filter(item => {
    return (
      item.nickname.match(keywords.value) != null ||
      item.user_card.match(keywords.value) != null
    )
  })
})

const isAdmin = computed(() => {
  return items.value.some(item => {
    return item.user_id == userStore.uid && item.leader == 2
  })
})

const dropdown = reactive({
  options: [],
  show: false,
  dropdownX: 0,
  dropdownY: 0,
  item: {},
})

const onLoadData = () => {
  ServeGetGroupMembers({
    group_id: props.id,
  }).then(res => {
    if (res.code == 200) {
      let data = res.data || []

      data.forEach(item => {
        item.is_delete = false
      })

      items.value = data
    }
  })
}

const onDelete = item => {
  ServeRemoveMembersGroup({
    group_id: props.id,
    members_ids: `${item.user_id}`,
  }).then(res => {
    if (res.code == 200) {
      onLoadData()
      window['$message'].success('删除成功！')
    }
  })
}

const onBatchDelete = () => {
  if (!filterCheck.value.length) {
    return
  }

  ServeRemoveMembersGroup({
    group_id: props.id,
    members_ids: filterCheck.value.map(item => item.user_id).join(','),
  }).then(res => {
    if (res.code == 200) {
      batchDelete.value = false
      onLoadData()
      window['$message'].success('删除成功！')
    }
  })
}

const onRowClick = item => {
  if (batchDelete.value == true) {
    if (item.leader < 2) {
      item.is_delete = !item.is_delete
    }
  } else {
    modal(UserCardModal, {
      uid: item.user_id,
    })
  }
}

const onCancelDelete = () => {
  items.value.forEach(item => {
    item.is_delete = false
  })

  batchDelete.value = false
}

const onUserInfo = item => {
  modal(UserCardModal, {
    uid: item.user_id,
  })
}

const onAssignAdmin = item => {
  let title =
    item.leader == 0
      ? `确定要给 [${item.nickname}] 分配管理员权限吗？`
      : `确定解除 [${item.nickname}] 管理员权限吗？`

  window.$dialog.create({
    title: '温馨提示',
    content: title,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      ServeGroupAssignAdmin({
        mode: item.leader == 0 ? 1 : 2,
        group_id: props.id,
        user_id: parseInt(item.user_id),
      }).then(res => {
        if (res.code == 200) {
          window['$message'].success('操作成功！')
          onLoadData()
        } else {
          window['$message'].error(res.message)
        }
      })
    },
  })
}

const onTransfer = item => {
  window.$dialog.create({
    title: '温馨提示',
    content: `确定把群主权限转交给 [${item.nickname}] ？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      ServeGroupHandover({
        group_id: props.id,
        user_id: parseInt(item.user_id),
      }).then(res => {
        if (res.code == 200) {
          window['$message'].success('操作成功！')
          onLoadData()
        } else {
          window['$message'].error(res.message)
        }
      })
    },
  })
}

const onForbidden = item => {
  let content = `确定要禁言 [${item.nickname}] 此用户吗？`

  if (item.is_mute === 1) {
    content = `确定要解除 [${item.nickname}] 此用户的禁言吗？`
  }

  window.$dialog.create({
    title: '温馨提示',
    content: content,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      ServeGroupNoSpeak({
        mode: item.is_mute == 0 ? 1 : 2,
        group_id: props.id,
        user_id: parseInt(item.user_id),
      }).then(res => {
        if (res.code == 200) {
          window['$message'].success('操作成功！')
          onLoadData()
        } else {
          window['$message'].error(res.message)
        }
      })
    },
  })
}

// 会话列表右键显示菜单
const onContextMenu = (e, item) => {
  if (batchDelete.value == true || item.leader == 2) {
    return
  }

  dropdown.show = false
  dropdown.item = Object.assign({}, item)
  dropdown.options = [
    {
      label: '查看成员',
      key: 'info',
    },
    {
      label: item.is_mute ? '解除禁言' : '禁止发言',
      key: 'forbidden',
    },
    {
      label: '删除成员',
      key: 'delete',
    },
    {
      label: '批量删除',
      key: 'batch_delete',
    },
  ]

  if (isAdmin.value) {
    dropdown.options.push({ label: '转让群主', key: 'transfer' })

    if (item.leader == 1) {
      dropdown.options.push({ label: '管理权限(解除)', key: 'assignment' })
    } else if (item.leader == 0) {
      dropdown.options.push({ label: '管理权限(分配)', key: 'assignment' })
    }
  }

  nextTick(() => {
    dropdown.show = true
    dropdown.dropdownX = e.clientX
    dropdown.dropdownY = e.clientY
  })

  e.preventDefault()
}

const onContextMenuHandle = key => {
  // 注册回调事件
  const evnets = {
    info: onUserInfo,
    assignment: onAssignAdmin,
    transfer: onTransfer,
    forbidden: onForbidden,
    delete: onDelete,
    batch_delete: data => {
      batchDelete.value = true
    },
  }

  dropdown.show = false
  evnets[key] && evnets[key](dropdown.item)
}

onLoadData()
</script>
<template>
  <section class="section el-container is-vertical height100">
    <header class="el-header header bdr-b">
      <p>成员管理({{ filterSearch.length }})</p>
      <div>
        <n-space>
          <n-input
            placeholder="搜索"
            v-model:value.trim="keywords"
            clearable
            style="width: 200px"
            round
          >
            <template #prefix>
              <n-icon :component="Search" />
            </template>
          </n-input>

          <n-button circle @click="isGroupLaunch = true">
            <template #icon>
              <plus theme="outline" size="21" fill="#333" :strokeWidth="2" />
            </template>
          </n-button>
        </n-space>
      </div>
    </header>

    <main v-if="filterSearch.length === 0" class="el-main main flex-center">
      <n-empty size="200" description="暂无相关数据">
        <template #icon>
          <img src="@/assets/image/no-data.svg" alt="" />
        </template>
      </n-empty>
    </main>

    <main v-else class="el-main main me-scrollbar">
      <div
        class="member-item"
        v-for="member in filterSearch"
        :key="member.user_id"
      >
        <div class="tool flex-center" v-show="batchDelete">
          <n-checkbox
            v-show="member.leader < 2"
            size="small"
            :checked="member.is_delete"
          />
        </div>
        <div class="avatar pointer" @click="onUserInfo(member)">
          <n-avatar :size="30" :src="member.avatar" :fallback-src="defAvatar" />
        </div>
        <div
          class="content pointer o-hidden"
          @click="onRowClick(member)"
          @contextmenu.prevent="onContextMenu($event, member)"
        >
          <div class="item-title">
            <p class="nickname text-ellipsis">
              <span>{{ member.nickname || '未设置昵称' }}</span>
              <span v-show="member.user_card"> ({{ member.user_card }})</span>
            </p>
            <p>
              <span class="badge master" v-show="member.leader == 2">群主</span>
              <span class="badge leader" v-show="member.leader == 1"
                >管理员</span
              >
              <span class="badge" v-show="member.is_mute == 1">已禁言</span>
              <!-- <span class="badge qiye">企业</span> -->
            </p>
          </div>
          <div class="item-text text-ellipsis">
            {{ member.motto || '暂无简介' }}
          </div>
        </div>
      </div>
    </main>

    <footer class="el-footer footer bdr-t" v-show="batchDelete">
      <div class="tips">已选({{ filterCheck.length }})</div>
      <div>
        <n-space>
          <n-button type="primary" ghost size="small" @click="onCancelDelete">
            取消
          </n-button>
          <n-button type="error" size="small" @click="onBatchDelete">
            批量删除
          </n-button>
        </n-space>
      </div>
    </footer>
  </section>

  <!-- 右键菜单 -->
  <n-dropdown
    :show="dropdown.show"
    :x="dropdown.dropdownX"
    :y="dropdown.dropdownY"
    :options="dropdown.options"
    @select="onContextMenuHandle"
    @clickoutside="
      () => {
        dropdown.show = false
        dropdown.item = {}
      }
    "
  />

  <GroupLaunch
    v-if="isGroupLaunch"
    :gid="id"
    @close="isGroupLaunch = false"
    @on-invite="onLoadData"
  />
</template>
<style lang="less" scoped>
.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
}

.main {
  padding: 0 5px;
}

.member-item {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  margin: 10px 0;
  user-select: none;
  border-radius: 3px;
  border: 1px dashed transparent;
  padding: 3px;
  border-bottom: 1px solid #f5f5f5;
  box-sizing: border-box;

  &:hover {
    border: 1px dashed rgb(80 138 254);
  }

  .avatar {
    width: 30px;
    height: inherit;
    border-radius: 5px;
    flex-shrink: 0;
    user-select: none;
    padding-top: 10px;
  }

  .content {
    width: 100%;
    height: inherit;
    margin-left: 10px;

    .item-title {
      height: 30px;
      width: inherit;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 500;

      .nickname {
        margin-right: 5px;
      }
    }

    .item-text {
      width: inherit;
      height: 20px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 13px;
    }
  }

  .tool {
    width: 30px;
    height: inherit;
    flex-shrink: 0;
    margin-right: 10px;
  }
}

.footer {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  background-color: #fdf9f9;
  border-bottom-right-radius: 15px;

  .tips {
    font-size: 16px;
  }
}

.badge {
  margin-left: 3px;
  &.master {
    background-color: #ffe699;
    color: red;
  }

  &.leader {
    color: #3370ff;
    background-color: #e1eaff;
  }

  &.qiye {
    background-color: #2196f3;
    color: #ffffff;
  }
}
</style>
