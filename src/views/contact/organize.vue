<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { NTree, NEmpty, NVirtualList, NButton } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useUserStore, useTalkStore } from '@/store'
import { ServeDepartmentList, ServePersonnelList } from '@/api/organize'
import { toApi } from '@/api'
import { Search, Male, Female } from '@icon-park/vue-next'
import { useInject } from '@/hooks'

const router = useRouter()
const userStore = useUserStore()
const talkStore = useTalkStore()
const { toShowUserInfo, message } = useInject()

const dept = ref(-1)
const keywords = ref('')
const items = ref<any[]>([])

// 过滤器
const filter = computed(() => {
  return items.value.filter((item) => {
    return (
      item.nickname.match(keywords.value) != null &&
      (dept.value == -1 || item.dept_items.some((item: any) => item.dept_id == dept.value))
    )
  })
})

const tree = ref<any[]>([])
const breadcrumb = ref('全体成员')

const onToTalk = (item: any) => {
  if (userStore.uid != item.user_id) {
    talkStore.toTalk(1, item.user_id, router)
  } else {
    message.info('禁止给自己发送消息!')
  }
}

function toTree(list: any[]): any[] {
  const map = {}

  list.forEach((item: any) => {
    map[item.dept_id] = item
  })

  const ancestors = (value: string) => {
    const list: string[] = []

    value.split(',').forEach((id) => {
      const item = map[parseInt(id)] as any

      item && list.push(item.dept_name)
    })

    return list
  }

  const tree: any[] = []

  for (const item of list) {
    item.breadcrumb = ancestors(item.ancestors || '').join(' / ')

    const parent = map[item.parent_id]
    if (parent) {
      if (parent.children == undefined) parent.children = []

      parent.children.push(item)
    } else {
      tree.push(item)
    }
  }

  return tree
}

const onInfo = (item: any) => {
  toShowUserInfo(item.user_id)
}

const onNodeProps = ({ option }) => {
  return {
    onClick() {
      breadcrumb.value = option.breadcrumb || '全部成员'
      dept.value = option.dept_id
    }
  }
}

async function onLoadDepartment() {
  const { code, data } = await toApi(ServeDepartmentList)
  if (code != 200) return

  const items = data.items || []

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
}

async function onLoadData() {
  const { code, data } = await toApi(ServePersonnelList)
  if (code != 200) return

  const users = data.items || []

  users.map((item: any) => {
    item.online = false
    item.sort = 1000000

    item.position_items.sort((a, b) => a.sort - b.sort)

    const values: string[] = []
    for (const o of item.position_items) {
      values.push(o.name)

      if (o.sort < item.sort) {
        item.sort = o.sort
      }
    }

    item.position = values.join('、')

    return item
  })

  items.value = users.sort((a: any, b: any) => a.sort - b.sort)
}

onMounted(() => {
  onLoadData()
  onLoadDepartment()
})
</script>

<template>
  <section class="el-container is-vertical height100">
    <header class="el-header me-view-header bdr-b">
      <div>{{ breadcrumb }} ({{ filter.length }})</div>

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
        </n-space>
      </div>
    </header>

    <main class="el-main">
      <section class="el-container height100">
        <main class="el-main" v-if="filter.length" style="padding-bottom: 10px">
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
                  <n-button text size="small" type="primary" @click="onToTalk(item)">
                    发消息
                  </n-button>
                </div>
              </div>
            </template>
          </n-virtual-list>
        </main>

        <main class="el-main flex-center" v-else>
          <n-empty description="暂无相关数据" />
        </main>

        <aside class="el-aside bdr-l pd-10" style="width: 200px">
          <n-tree
            key-field="dept_id"
            label-field="dept_name"
            :data="tree"
            :default-expand-all="true"
            :cancelable="true"
            :default-selected-keys="[-1]"
            :node-props="onNodeProps"
            block-line
            block-node
          />
        </aside>
      </section>
    </main>
  </section>
</template>

<style lang="less" scoped>
.aside {
  width: 250px;
  padding: 8px;
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

  &:hover {
    border: 1px solid var(--im-primary-color);
  }

  > div {
    height: inherit;
  }

  .avatar {
    width: 70px;
    height: inherit;
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
    width: 60px;
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
