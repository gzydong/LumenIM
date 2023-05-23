<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { NSpace, NDivider, NDrawer } from 'naive-ui'
import { ServeGetGroups } from '@/api/group'
import { Search, AddOne, Plus } from '@icon-park/vue-next'
import GroupPanel from '@/components/group/GroupPanel.vue'
import GroupLaunch from '@/components/group/GroupLaunch.vue'
import GroupCard from './inner/GroupCard.vue'
import { toTalk } from '@/utils/talk'

const isShowCreateGroupBox = ref(false)
const keywords = ref('')
const items = ref([])

const params = reactive({
  isShow: false,
  id: 0,
})

const filter = computed(() => {
  return items.value.filter(item => {
    return (
      item.group_name.toLowerCase().indexOf(keywords.value.toLowerCase()) != -1
    )
  })
})

const onLoadData = () => {
  ServeGetGroups().then(res => {
    if (res.code == 200) {
      items.value = res.data.items || []
    }
  })
}

const onShowGroup = item => {
  params.isShow = true
  params.id = item.id
}

const onToTalk = item => {
  toTalk(2, item.id)
}

const onGroupCallBack = data => {
  isShowCreateGroupBox.value = false
  onLoadData()
}

onMounted(() => {
  onLoadData()
})
</script>

<template>
  <section id="drawer-target" class="el-container is-vertical height100">
    <header class="el-header from-header bdr-b">
      <div>
        <n-space>
          <n-button text se> 全部群组({{ items.length }}) </n-button>
          <n-divider vertical />
          <n-button text> 我创建的 </n-button>
          <n-divider vertical />
          <n-button text> 我加入的 </n-button>
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

          <n-button circle @click="isShowCreateGroupBox = true">
            <plus theme="outline" size="21" fill="#333" :strokeWidth="2" />
          </n-button>
        </n-space>
      </div>
    </header>

    <main v-if="filter.length == 0" class="el-main flex-center">
      <n-empty size="200" description="暂无相关数据">
        <template #icon>
          <img src="@/assets/image/no-data.svg" alt="" />
        </template>
      </n-empty>
    </main>

    <main v-else class="el-main me-scrollbar pd-10">
      <div class="cards">
        <GroupCard
          v-for="item in filter"
          :avatar="item.avatar"
          :username="item.group_name"
          :gender="item.gender"
          :motto="item.profile"
          flag="查看"
          :is-member="true"
          @click="onShowGroup(item)"
          @talk="onToTalk(item)"
        />
      </div>
    </main>
  </section>

  <GroupLaunch
    v-model:show="isShowCreateGroupBox"
    @close="isShowCreateGroupBox = false"
    @on-submit="onGroupCallBack"
  />

  <n-drawer
    v-model:show="params.isShow"
    :width="400"
    placement="right"
    :trap-focus="false"
    :block-scroll="false"
    to="#drawer-target"
  >
    <GroupPanel
      :gid="params.id"
      @close="params.isShow = false"
      @to-talk="
        () => {
          toTalk(2, params.id)
        }
      "
    />
  </n-drawer>
</template>

<style lang="less" scoped>
.from-header {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  justify-content: space-between;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  grid-gap: 12px;
  gap: 12px;
}
</style>
