<script lang="ts" setup>
import {
  ServContactGroupList,
  ServContactList,
  ServContactListResponseItem
} from '@/api/contact.ts'
import Dropdown from '@/components/basic/Dropdown.vue'
import UserSearchModal from '@/components/user/UserSearchModal.vue'
import { ContactConst } from '@/constant/event-bus'
import { useContact, useEventBus } from '@/hooks'
import { useTalkStore } from '@/store'
import { Female, Male, Plus, Search } from '@icon-park/vue-next'
import { useRouter } from 'vue-router'
import GroupManage from './inner/GroupManage.vue'

const router = useRouter()
const talkStore = useTalkStore()
const { onDeleteContact, onChangeContactRemark, toShowUserInfo } = useContact()

const isShowUserSearch = ref(false)
const loading = ref(false)
const isShowGroupModal = ref(false)
const keywords = ref('')
const index = ref(0)
const items = ref<ServContactListResponseItem[]>([])
const groups: any = ref([])

const filter: any = computed(() => {
  return items.value.filter((item: ServContactListResponseItem) => {
    let value = item.remark || item.nickname

    let findIndex = value.toLowerCase().indexOf(keywords.value.toLowerCase())
    if (index.value == 0) {
      return findIndex != -1
    }

    return findIndex != -1 && index.value == item.group_id
  })
})

const loadContactList = async () => {
  const { code, data } = await ServContactList({}, { loading })
  if (code != 200) return

  items.value = data?.items || []
}

const loadContactGroupList = async () => {
  const { code, data } = await ServContactGroupList()
  if (code != 200) return

  groups.value = data?.items || []
}

const onToTalk = (item: ServContactListResponseItem) => {
  talkStore.toTalk(1, item.user_id, router)
}

const onInfo = (item: ServContactListResponseItem) => {
  toShowUserInfo(item.user_id)
}

const onToolsMenu = (value: string) => {
  switch (value) {
    case 'add':
      isShowUserSearch.value = true
      break
    case 'group':
      isShowGroupModal.value = true
      break
  }
}

const onChangeRemark = (data: { user_id: number; remark: string }) => {
  let item: any = items.value.find(
    (item: ServContactListResponseItem) => item.user_id == data.user_id
  )
  item && (item.remark = data.remark)
}

const onClickDropdown = (key: string, item: ServContactListResponseItem) => {
  const { user_id, nickname, remark } = item

  switch (key) {
    case 'change-remark':
      onChangeContactRemark({ user_id, nickname, remark }, (): void => {
        loadContactList()
      })

      break
    case 'delete-contact':
      onDeleteContact({ user_id, nickname, remark }, () => {
        loadContactList()
      })
      break
  }
}

onMounted(() => {
  loadContactList()
  loadContactGroupList()
})

useEventBus([{ name: ContactConst.UpdateRemark, event: onChangeRemark }])
</script>

<template>
  <section class="el-container is-vertical h-full">
    <header class="el-header from-header border-bottom">
      <div class="groups">
        <n-tabs v-if="groups.length" v-model:value="index">
          <n-tab v-for="tab in groups" :key="tab.id" :name="tab.id">
            {{ tab.name }}({{ tab.count }})
          </n-tab>
        </n-tabs>
      </div>
      <div class="tools">
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
            :show-arrow="true"
            @select="onToolsMenu"
            :options="[
              {
                label: '添加好友',
                key: 'add'
              },
              {
                label: '分组管理',
                key: 'group'
              }
            ]"
          >
            <n-button circle>
              <template #icon>
                <n-icon :component="Plus" />
              </template>
            </n-button>
          </n-dropdown>
        </n-space>
      </div>
    </header>

    <main class="el-main" style="padding-bottom: 10px" v-if="filter.length">
      <n-virtual-list style="max-height: inherit" :item-size="80" :items="filter">
        <template #default="{ item }">
          <div :key="item.user_id" class="item-box pointer">
            <div class="avatar" @click="onInfo(item)">
              <im-avatar :src="item.avatar" :size="40" :username="item.nickname" />
            </div>
            <div class="content" @click="onInfo(item)">
              <div class="content-title">
                <span>{{ item.remark || item.nickname }}</span>
                <span>
                  <n-icon v-if="item.gender == 1" :component="Male" color="#508afe" />
                  <n-icon v-if="item.gender == 2" :component="Female" color="#ff5722" />
                </span>
              </div>
              <div class="content-text text-ellipsis">
                个性签名: {{ item.motto ? item.motto : '暂无' }}
              </div>
            </div>
            <div class="tool">
              <n-button text size="small" type="primary" @click="onToTalk(item)"> 发消息 </n-button>
              <Dropdown
                :value="item"
                :options="[
                  {
                    label: '编辑备注',
                    key: 'change-remark'
                  },
                  {
                    label: '删除好友',
                    key: 'delete-contact'
                  }
                ]"
                @select="onClickDropdown"
              />
            </div>
          </div>
        </template>
      </n-virtual-list>
    </main>

    <main class="el-main flex-center" v-else v-loading="loading">
      <n-empty description="暂无相关数据" />
    </main>
  </section>

  <!-- 用户查询模态框 -->
  <UserSearchModal v-model:show="isShowUserSearch" />

  <!-- 分组管理 -->
  <GroupManage
    v-if="isShowGroupModal"
    @close="isShowGroupModal = false"
    @relaod="loadContactGroupList"
  />
</template>

<style lang="less" scoped>
.from-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .groups {
    display: flex;
    align-items: center;
    flex: 1 auto;
    height: 100%;
    margin-right: 30px;
    overflow: hidden;
    padding-left: 15px;
  }

  .tools {
    display: flex;
    align-items: center;
    height: 100%;
    width: 250px;
    flex-shrink: 0;
    padding-right: 10px;
  }
}

.item-box {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.5s;
  border-radius: 5px;
  padding: 5px 0;
  border: 1px solid var(--border-color);
  margin: 10px;
  position: relative;

  &:hover {
    border: 1px solid var(--im-primary-color);
  }

  > div {
    height: inherit;
  }

  .avatar {
    width: 70px;
    flex-shrink: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .content {
    flex: 1;
    overflow: hidden;
    user-select: none;

    &-title {
      display: flex;
      align-items: center;
      height: 30px;
      line-height: 30px;
      span {
        margin-right: 5px;
      }
    }

    &-text {
      height: 30px;
      line-height: 30px;
      color: rgba(0, 0, 0, 45%);
    }
  }

  .tool {
    width: 100px;
    flex-shrink: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-right: 10px;
  }
}

html[theme-mode='dark'] {
  .item-box {
    background-color: rgba(255, 255, 255, 5%);
    border-color: transparent;

    &:hover {
      background-color: rgba(255, 255, 255, 10%);
    }

    .content {
      &-text {
        color: rgba(255, 255, 255, 50%);
      }
    }
  }
}
</style>
