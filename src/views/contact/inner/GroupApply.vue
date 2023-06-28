<script setup>
import { ref, onMounted, inject } from 'vue'
import { NPopconfirm } from 'naive-ui'
import { Close, CheckSmall } from '@icon-park/vue-next'
import {
  ServeGetGroupApplyAll,
  ServeDeleteGroupApply,
  ServeAgreeGroupApply,
} from '@/api/group'
import { debounce } from '@/utils/common'
import { parseTime } from '@/utils/datetime'
import { defAvatar } from '@/constant/default'

const items = ref([])
const loading = ref(true)

const user = inject('$user')

const onLoadData = (isClearTip = false) => {
  ServeGetGroupApplyAll()
    .then(res => {
      if (res.code == 200) {
        items.value = res.data.items || []
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const onInfo = item => {
  user(item.user_id)
}

const onAgree = debounce(item => {
  ServeAgreeGroupApply({
    apply_id: item.id,
  }).then(res => {
    if (res.code == 200) {
      window['$message'].success('已同意')
      onLoadData()
    } else {
      window['$message'].info(res.message)
    }
  })
}, 1000)

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

onMounted(() => {
  onLoadData(true)
})
</script>

<template>
  <section v-loading="loading" style="min-height: 100%">
    <n-empty
      v-show="items.length == 0"
      style="margin-top: 10%"
      size="200"
      description="暂无相关数据"
    >
      <template #icon>
        <img src="@/assets/image/no-data.svg" alt="" />
      </template>
    </n-empty>

    <div class="item bdr-b" v-for="item in items" :key="item.id">
      <div class="avatar">
        <n-avatar :size="45" :src="item.avatar || defAvatar" />
      </div>

      <div class="content pointer o-hidden" @click="onInfo(item)">
        <div class="username">
          <span>
            <n-tag :bordered="false" size="small" type="info">
              {{ item.group_name }}
            </n-tag>
            {{ item.nickname }}
          </span>
          <span class="time">{{
            parseTime(item.created_at, '{m}/{d} {h}:{i}')
          }}</span>
        </div>
        <div class="remark text-ellipsis">[备注] {{ item.remark }}</div>
      </div>

      <div class="tools">
        <n-button
          @click="onAgree(item)"
          strong
          secondary
          circle
          size="small"
          type="info"
        >
          <template #icon>
            <n-icon :component="CheckSmall" />
          </template>
        </n-button>

        <n-popconfirm @positive-click="onDelete(item)">
          <template #trigger>
            <n-button strong secondary circle type="tertiary" size="small">
              <template #icon>
                <n-icon :component="Close" />
              </template>
            </n-button>
          </template>
          确认要删除记录吗？
        </n-popconfirm>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
.from-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
}

.item {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 8px 0;

  > div {
    height: inherit;
  }

  .avatar {
    width: 50px;
  }

  .content {
    width: 100%;
    margin-left: 10px;

    .username {
      height: 25px;
      line-height: 25px;
      display: flex;
      align-items: center;

      .time {
        font-size: 12px;
        color: #bfbbbb;
        margin-left: 5px;
      }
    }

    .remark {
      height: 25px;
      line-height: 25px;
      font-size: 12px;
      color: #9a9292;
      overflow: hidden;
      width: inherit;
    }
  }

  .tools {
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}
</style>
