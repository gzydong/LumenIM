<script setup>
import { ref, computed } from 'vue'
import { NSpace, NDivider, NTag } from 'naive-ui'
import { SearchOutline, AddOutline } from '@vicons/ionicons5'
import UserCardModal from '@/components/user/UserCardModal.vue'
import MemberCard from './inner/MemberCard.vue'
import ApplyListModal from './inner/ApplyListModal.vue'
import UserSearchModal from './inner/UserSearchModal.vue'
import { modal } from '@/utils/common'
import { toTalk } from '@/utils/talk'
import { useUserStore } from '@/store/user'
import { ServeGetContacts } from '@/api/contacts'

const userStore = useUserStore()
const isShowDrawer = ref(false)
const isShowUserSearch = ref(false)
const keywords = ref('')
const items = ref([])
const filter = computed(() => {
  return items.value.filter(item => {
    return item.nickname.match(keywords.value) != null
  })
})

const onLoadData = () => {
  ServeGetContacts().then(res => {
    if (res.code == 200) {
      items.value = res.data.items || []
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

onLoadData()
</script>

<template>
  <section class="el-container is-vertical height100">
    <header class="el-header from-header bdr-b">
      <div>
        <n-space>
          <n-button text color="#333"> 全部好友({{ filter.length }}) </n-button>
          <n-divider vertical />
          <p>
            <n-button text @click="onShowApplyList" color="#333">
              申请列表
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
              <n-icon :component="SearchOutline" />
            </template>
          </n-input>

          <n-button circle @click="isShowUserSearch = true">
            <template #icon> <n-icon :component="AddOutline" /> </template>
          </n-button>
        </n-space>
      </div>
    </header>

    <main
      id="drawer-target"
      class="el-main pd-10 me-scrollbar"
      v-if="filter.length"
    >
      <!-- <div class="tags">
        <n-tag class="tag pointer" :bordered="false" type="info" round> 家人(10) </n-tag>
        <n-tag class="tag pointer" :bordered="false" type="info" round> 同事(2) </n-tag>
        <n-tag class="tag pointer" :bordered="false" type="info" round>
          添加标签
        </n-tag>
      </div> -->

      <div class="cards">
        <MemberCard
          v-for="item in filter"
          :avatar="item.avatar"
          :username="item.friend_remark || item.nickname"
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
  .tags {
    margin-bottom: 10px;
    .tag {
      margin-right: 8px;
      margin-bottom: 5px;
    }
  }

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
