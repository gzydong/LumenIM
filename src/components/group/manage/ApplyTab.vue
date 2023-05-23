<script setup>
import { ref, computed } from 'vue'
import { NSpace } from 'naive-ui'
import { Search, RefreshOne, CheckSmall, Close } from '@icon-park/vue-next'
import {
  ServeGetGroupApplyList,
  ServeDeleteGroupApply,
  ServeAgreeGroupApply,
} from '@/api/group'

const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },
})

const keywords = ref('')
const batchDelete = ref(false)
const items = ref([])

const filterSearch = computed(() => {
  if (!keywords.value.length) {
    return items.value
  }

  return items.value.filter(item => {
    return item.nickname.match(keywords.value) != null
  })
})

const onLoadData = () => {
  ServeGetGroupApplyList({
    group_id: props.id,
  }).then(res => {
    if (res.code == 200) {
      let data = res.data || []
      items.value = data
    }
  })
}

const onRowClick = item => {
  if (batchDelete.value == true) {
  } else {
  }
}

const onAgree = item => {
  ServeAgreeGroupApply({
    apply_id: item.id,
  }).then(res => {
    if (res.code == 200) {
      onLoadData()
    } else {
      window['$message'].info(res.message)
    }
  })
}

const onDelete = item => {
  ServeDeleteGroupApply({
    apply_id: item.id,
  }).then(res => {
    if (res.code == 200) {
      onLoadData()
    } else {
      window['$message'].info(res.message)
    }
  })
}

onLoadData()
</script>
<template>
  <section class="section el-container is-vertical height100">
    <header class="el-header header bdr-b">
      <p>申请管理({{ filterSearch.length }})</p>
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

          <n-button circle @click="onLoadData">
            <template #icon> <n-icon :component="RefreshOne" /> </template>
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

    <main v-else class="el-main main">
      <div
        class="member-item"
        v-for="item in filterSearch"
        @click="onRowClick(item)"
      >
        <div class="content pointer o-hidden">
          <div class="item-title">
            <p class="nickname text-ellipsis">
              <span>{{ item.nickname }}</span>
              <span class="date mt-l15">{{ item.created_at }}</span>
            </p>
          </div>
          <div class="item-text text-ellipsis">备注: {{ item.remark }}</div>
        </div>

        <div class="tool flex-center">
          <n-space>
            <n-button
              @click="onAgree(item)"
              strong
              secondary
              circle
              type="info"
            >
              <template #icon>
                <n-icon :component="CheckSmall" />
              </template>
            </n-button>

            <n-button
              @click="onDelete(item)"
              strong
              secondary
              circle
              type="tertiary"
            >
              <template #icon>
                <n-icon :component="Close" />
              </template>
            </n-button>
          </n-space>
        </div>
      </div>
    </main>
  </section>
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
  padding: 0 15px;
  box-sizing: border-box;
}

.member-item {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  margin: 15px 0;
  user-select: none;
  padding: 5px 0;

  .content {
    width: 100%;
    height: inherit;

    .item-title {
      height: 30px;
      width: inherit;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .date {
        color: #989898;
        font-size: 12px;
      }
    }

    .item-text {
      width: inherit;
      height: 20px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
    }
  }

  .tool {
    width: 100px;
    height: inherit;
    flex-shrink: 0;
    margin-left: 15px;
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
</style>
