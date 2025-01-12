<script lang="ts" setup>
import { Search } from '@icon-park/vue-next'

const emit = defineEmits(['on-to-info'])

const isShow = defineModel({ default: false })

const { items } = defineProps({
  items: {
    default: (): any[] => []
  }
})

const keyword = ref('')

const onToInfo = (item: any) => {
  emit('on-to-info', item)
}

const filters = computed(() => {
  if (!keyword.value) return items

  return items.filter((item: any) => {
    return item.nickname.match(keyword.value) != null || item.remark.match(keyword.value) != null
  })
})
</script>
<template>
  <n-drawer v-model:show="isShow" :width="320" placement="right" to="#group-panel">
    <n-drawer-content :body-content-style="{ padding: 0 }" title="群聊成员" closable>
      <div class="member-box">
        <div>
          <n-input size="small" placeholder="搜索" v-model:value="keyword" :clearable="true" round>
            <template #prefix>
              <n-icon :component="Search" />
            </template>
          </n-input>
        </div>

        <div class="table">
          <div class="theader">
            <div class="avatar"></div>
            <div class="nickname">昵称</div>
            <div class="card">群名片</div>
          </div>

          <div class="row pointer" v-for="item in filters" :key="item.id" @click="onToInfo(item)">
            <div class="avatar">
              <im-avatar :size="20" :src="item.avatar" :username="item.nickname" />
            </div>
            <div class="nickname text-ellipsis">
              <span>{{ item.nickname ? item.nickname : '-' }}</span>
              <span class="badge master" v-show="item.leader === 1">群主</span>
              <span class="badge leader" v-show="item.leader === 2">管理员</span>
            </div>
            <div class="card text-ellipsis grey">
              {{ item.remark || '-' }}
            </div>
          </div>

          <div class="mt-t20 pd-t20" v-if="filters.length == 0">
            <n-empty description="暂无相关数据" />
          </div>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>
<style lang="less" scoped>
.badge {
  margin-left: 3px;

  &.master {
    color: #dc9b04 !important;
    background-color: #faf1d1 !important;
  }

  &.leader {
    color: #3370ff;
    background-color: #e1eaff;
  }
}

.member-box {
  padding: 15px;

  .table {
    margin-top: 20px;

    .theader {
      height: 36px;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 15px;
    }

    .row {
      height: 30px;
      margin: 3px 0;
      &:hover {
        .nickname {
          color: #1890ff;
        }
      }
      padding: 0 8px;
    }

    .theader,
    .row {
      display: flex;
      align-items: center;
      justify-content: center;

      > div {
        height: 30px;
        display: flex;
        align-items: center;
        font-size: 13px;
      }

      .avatar {
        width: 30px;
        justify-content: flex-start;
      }

      .nickname {
        flex: auto;
      }

      .card {
        width: 100px;
        justify-content: flex-end;

        &.grey {
          font-size: 13px;
          font-weight: 300;
        }
      }
    }
  }
}

html[theme-mode='dark'] {
  .member-box {
    .row:hover {
      background-color: rgba(255, 255, 255, 15%);
      border-radius: 5px;
    }
  }
}
</style>
