<script lang="ts" setup>
import { fetchGroupOvertList } from '@/apis/api'
import { fetchApi } from '@/apis/request'
import GroupApply from '@/components/group/GroupApply.vue'
import { debounce } from '@/utils/common'
import { AddOne, Search } from '@icon-park/vue-next'
import GroupCard from './inner/GroupCard.vue'

const model = reactive({
  isShow: false,
  groupId: 0
})

const search = reactive({
  page: 1,
  name: '',
  next: false
})

const items = ref<any[]>([])

const onLoadData = async () => {
  const [err, data] = await fetchApi(fetchGroupOvertList, {
    page: search.page,
    name: search.name
  })

  if (err) return

  const list = data.items || []
  if (search.page == 1) {
    items.value = list
  } else {
    items.value.push(...list)
  }

  search.next = data.next
}

const onLoadMore = () => {
  search.page++
  onLoadData()
}

const onSearchInput = debounce((value: string) => {
  search.page = 1
  search.name = value

  onLoadData()
}, 300)

const onJoin = (item: any) => {
  model.isShow = true
  model.groupId = item.group_id
}

onLoadData()
</script>

<template>
  <section class="el-container h-full">
    <main class="el-main">
      <section class="el-container is-vertical h-full">
        <header class="el-header me-view-header border-bottom">
          <div>公开群聊({{ items.length }})</div>
          <div>
            <n-input
              placeholder="搜索"
              clearable
              style="width: 200px"
              :on-input="onSearchInput"
              round
            >
              <template #prefix>
                <n-icon :component="Search" />
              </template>
            </n-input>
          </div>
        </header>

        <main class="el-main" v-if="items.length == 0">
          <div style="min-height: 400px" class="flex-center">
            <n-empty description="暂无相关数据" />
          </div>
        </main>

        <main class="el-main me-scrollbar me-scrollbar-thumb pd-10" v-else>
          <n-alert type="info" :bordered="false" closable class="mt-b10">
            公开群聊可自行添加入群申请，待群主（管理员）同意后方可入群！
          </n-alert>

          <div class="cards">
            <GroupCard
              v-for="item in items"
              :key="item.group_id"
              :avatar="item.avatar"
              :username="item.name"
              :gender="item.gender"
              :motto="item.profile"
              :flag="item.count + '/' + item.max_num"
              @join="onJoin(item)"
            />

            <div v-show="search.next" class="flex-center more" @click="onLoadMore">
              <n-icon :component="AddOne" />

              &nbsp;加载更多
            </div>
          </div>
        </main>
      </section>
    </main>
  </section>

  <GroupApply v-if="model.isShow" :group-id="model.groupId" @close="model.isShow = false" />
</template>

<style lang="less" scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  grid-gap: 12px;
  gap: 12px;

  .more {
    border: 1px solid var(--border-color);
    border-radius: 10px;
    cursor: pointer;
    min-height: 97px;
    &:hover {
      border-color: rgb(80 138 254);
    }
  }
}
</style>
