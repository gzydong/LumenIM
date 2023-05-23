<script setup>
import { ref, computed } from 'vue'
import { NSpace, NTabs, NTab, NDropdown } from 'naive-ui'
import { Search, More } from '@icon-park/vue-next'
import UserCardModal from '@/components/user/UserCardModal.vue'
import MemberCard from './inner/MemberCard.vue'
import ApplyListModal from './inner/ApplyListModal.vue'
import UserSearchModal from './inner/UserSearchModal.vue'
import GroupManage from './inner/GroupManage.vue'
import { modal } from '@/utils/common'
import { toTalk } from '@/utils/talk'
import { useUserStore } from '@/store/user'
import { ServeGetContacts, ServeContactGroupList } from '@/api/contacts'

const userStore = useUserStore()
const isShowDrawer = ref(false)
const isShowUserSearch = ref(false)
const isShowGroupModal = ref(false)
const keywords = ref('')
const index = ref(0)
const items = ref([])
const groups = ref([])

const filter = computed(() => {
  return items.value.filter(item => {
    let value = item.remark || item.nickname

    let findIndex = value.toLowerCase().indexOf(keywords.value.toLowerCase())
    if (index.value == 0) {
      return findIndex != -1
    }

    return findIndex != -1 && index.value == item.group_id
  })
})

const onLoadData = () => {
  ServeGetContacts().then(res => {
    if (res.code == 200) {
      items.value = res.data.items || []
    }
  })

  ServeContactGroupList().then(res => {
    if (res.code == 200) {
      groups.value = res.data.items || []
    }
  })
}

const onToTalk = item => {
  toTalk(1, item.id)
}

const onInfo = item => {
  modal(UserCardModal, {
    uid: item.id,
  })
}

const onShowApplyList = () => {
  isShowDrawer.value = true
}

const onToolsMenu = value => {
  switch (value) {
    case 'add':
      isShowUserSearch.value = true
      break
    case 'group':
      window['$message'].info('待完善...')

      isShowGroupModal.value = true
      break
  }
}

onLoadData()
</script>

<template>
  <section class="el-container is-vertical height100">
    <header class="el-header from-header bdr-b">
      <div>
        <n-space>
          <p>
            <n-button text @click="onShowApplyList" color="#333">
              好友申请列表
            </n-button>
            <span v-show="userStore.isContactApply" class="badge new-apply">
              New
            </span>
          </p>
        </n-space>
      </div>

      <div>
        <n-space>
          <n-input
            v-model:value.trim="keywords"
            placeholder="搜索"
            clearable
            style="width: 200px"
            round
          >
            <template #prefix>
              <n-icon :component="Search" />
            </template>
          </n-input>

          <n-dropdown
            :animated="true"
            trigger="hover"
            :show-arrow="false"
            @select="onToolsMenu"
            :options="[
              {
                label: '添加好友',
                key: 'add',
              },
              {
                label: '分组管理',
                key: 'group',
              },
            ]"
          >
            <n-button circle>
              <template #icon>
                <n-icon :component="More" />
              </template>
            </n-button>
          </n-dropdown>
        </n-space>
      </div>
    </header>

    <header v-if="groups.length" class="el-header pd-10">
      <n-tabs type="line" v-model:value="index">
        <n-tab v-for="tab in groups" :key="tab.id" :name="tab.id">
          {{ tab.name }}({{ tab.count }})
        </n-tab>
      </n-tabs>
    </header>

    <main
      id="drawer-target"
      class="el-main pd-10 me-scrollbar"
      v-if="filter.length"
    >
      <div class="cards">
        <MemberCard
          v-for="item in filter"
          :avatar="item.avatar"
          :username="item.remark || item.nickname"
          :gender="item.gender"
          :motto="item.motto"
          flag="查看"
          @click="onInfo(item)"
          @to-talk="onToTalk(item)"
        />
      </div>
    </main>

    <main class="el-main flex-center" v-else>
      <n-empty size="200" description="暂无相关数据">
        <template #icon>
          <img src="@/assets/image/no-data.svg" alt="" />
        </template>
      </n-empty>
    </main>
  </section>

  <!-- 好友申请模态框 -->
  <ApplyListModal v-if="isShowDrawer" @close="isShowDrawer = false" />

  <!-- 用户查询模态框 -->
  <UserSearchModal v-model:show="isShowUserSearch" />

  <!-- 分组管理 -->
  <GroupManage v-if="isShowGroupModal" @close="isShowGroupModal = false" />
</template>

<style lang="less" scoped>
.from-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
}

#drawer-target {
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    grid-gap: 12px;
    gap: 12px;
  }
}

.new-apply {
  background-color: red;
  color: #ffffff;
  margin-left: 5px;
  cursor: pointer;
}
</style>
