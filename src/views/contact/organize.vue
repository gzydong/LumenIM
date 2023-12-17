<script setup>
import { ref, computed, inject } from 'vue'
import { NTree, NEmpty } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useUserStore, useTalkStore } from '@/store'
import { ServeDepartmentList, ServePersonnelList } from '@/api/organize'
import { Search, AllApplication } from '@icon-park/vue-next'
import MemberCard from './inner/MemberCard.vue'
import { useInject } from '@/hooks'

const router = useRouter()
const userStore = useUserStore()
const talkStore = useTalkStore()
const { showUserInfoModal } = useInject()

const dept = ref(-1)
const keywords = ref('')
const isShowOrganize = ref(true)
const items = ref([])

// 过滤器
const filter = computed(() => {
  return items.value.filter((item) => {
    return (
      item.nickname.match(keywords.value) != null &&
      (dept.value == -1 || item.dept_items.some((item) => item.dept_id == dept.value))
    )
  })
})

const tree = ref([])
const breadcrumb = ref('全体成员')

const onToTalk = (item) => {
  if (userStore.uid != item.user_id) {
    talkStore.toTalk(1, item.user_id, router)
  } else {
    window['$message'].info('禁止给自己发送消息!!!')
  }
}

function toTree(data) {
  const map = {}
  data.forEach((item) => (map[item.dept_id] = item))

  const ancestors = (value) => {
    let list = []

    value.split(',').forEach((id) => {
      map[parseInt(id)] && list.push(map[parseInt(id)].dept_name)
    })

    return list
  }

  const tree = []
  data.forEach((item) => {
    const parent = map[item.parent_id]

    item.breadcrumb = ancestors(item.ancestors || '').join(' / ')

    if (parent) {
      if (parent.children == undefined) parent.children = []

      parent.children.push(item)
    } else {
      tree.push(item)
    }
  })

  return tree
}

const onInfo = (item) => {
  showUserInfoModal(item.user_id)
}

const onNodeProps = ({ option }) => {
  return {
    onClick() {
      breadcrumb.value = option.breadcrumb || '全部成员'
      dept.value = option.dept_id
    }
  }
}

function onLoadDepartment() {
  ServeDepartmentList().then((res) => {
    const items = res.data.items || []

    items.unshift({
      dept_id: -1,
      dept_name: '全部成员',
      parent_id: 0,
      ancestors: '0'
    })

    for (const item of items) {
      item.suffix = 0
      if (item.dept_id > 0) {
        item.ancestors = `${item.ancestors},${item.dept_id}`
      }
    }

    tree.value = toTree(items)
  })
}

async function onLoadData() {
  const res = await ServePersonnelList()
  if (!res || res.code != 200) {
    return
  }

  let users = res.data.items || []

  users.map((item) => {
    item.online = false
    item.sort = 1000000

    item.position_items.sort((a, b) => a.sort - b.sort)

    let map = []
    for (const o of item.position_items) {
      map.push(o.name)

      if (o.sort < item.sort) {
        item.sort = o.sort
      }
    }

    item.position = map.join('、')

    return item
  })

  items.value = users.sort((a, b) => a.sort - b.sort)
}

onLoadData()
onLoadDepartment()
</script>

<template>
  <section class="el-container is-vertical height100">
    <header class="el-header me-view-header bdr-b">
      <div style="font-weight: 500">{{ breadcrumb }} ({{ filter.length }})</div>

      <div>
        <n-space style="display: flex; align-items: center">
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

          <n-icon
            class="pointer"
            style="margin-top: 5px"
            :component="AllApplication"
            :size="18"
            @click="isShowOrganize = !isShowOrganize"
          />
        </n-space>
      </div>
    </header>

    <section class="el-container">
      <main class="el-main me-scrollbar pd-10" v-if="filter.length">
        <div class="cards">
          <MemberCard
            v-for="item in filter"
            :key="item.id"
            :username="item.nickname"
            :gender="item.gender"
            :motto="item.position"
            :flag="'查看'"
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
      <aside v-if="isShowOrganize" class="el-aside aside bdr-l">
        <n-tree
          key-field="dept_id"
          label-field="dept_name"
          :data="tree"
          :default-expand-all="true"
          :cancelable="true"
          :default-selected-keys="[-1]"
          :node-props="onNodeProps"
        />
      </aside>
    </section>
  </section>
</template>

<style lang="less" scoped>
.aside {
  width: 250px;
  padding: 8px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  grid-gap: 12px;
  gap: 12px;
}

:deep(.n-tree-node) {
  padding: 5px 10px;
  user-select: none;
}

:deep(.n-tree-node--selected) {
  background-color: #e8f4ff !important;
}
</style>
