<script setup>
import { ref, onMounted, inject, watch, computed } from 'vue'
import { NTabs, NTab } from 'naive-ui'
import { Check, Close } from '@icon-park/vue-next'
import {
  ServeGetContactApplyRecords,
  ServeApplyAccept,
  ServeApplyDecline,
} from '@/api/contacts'
import { parseTime } from '@/utils/datetime'
import { defAvatar } from '@/constant/default'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const items = ref([])

const user = inject('$user')

const isContactApply = computed(() => userStore.isContactApply)

const onLoadData = (isClearTip = false) => {
  ServeGetContactApplyRecords().then(res => {
    if (res.code == 200) {
      items.value = res.data.items || []

      if (isClearTip) {
        userStore.isContactApply = false
      }
    }
  })
}

const onInfo = item => {
  user(item.user_id)
}

const onAccept = item => {
  ServeApplyAccept({
    apply_id: item.id,
    remark: item.nickname,
  }).then(({ code, message }) => {
    if (code == 200) {
      onLoadData()
      window['$message'].success('已同意！')
    } else {
      window['$message'].info(message)
    }
  })
}

const onDecline = item => {
  ServeApplyDecline({
    apply_id: item.id,
    remark: '拒绝',
  }).then(({ code, message }) => {
    if (code == 200) {
      onLoadData()
      window['$message'].success('已拒绝！')
    } else {
      window['$message'].info(message)
    }
  })
}

watch(isContactApply, () => {
  onLoadData()
})

onMounted(() => {
  onLoadData(true)
})
</script>

<template>
  <section class="el-container is-vertical height100">
    <header class="el-header from-header bdr-b">
      申请列表 <span v-show="items.length">({{ items.length }})</span>
    </header>

    <main class="el-main pd-10 me-scrollbar" v-show="items.length">
      <div class="item bdr-b" v-for="item in items" :key="item.id">
        <div class="avatar">
          <n-avatar :size="45" :src="item.avatar || defAvatar" />
        </div>

        <div class="content pointer o-hidden" @click="onInfo(item)">
          <div class="username">
            <span>{{ item.nickname }}</span>
            <span class="time">{{
              parseTime(item.created_at, '{m}/{d} {h}:{i}')
            }}</span>
          </div>
          <div class="remark text-ellipsis">[备注] {{ item.remark }}</div>
        </div>

        <div class="tools">
          <n-button size="tiny" type="primary" @click="onAccept(item)">
            <template #icon>
              <n-icon :component="Check" />
            </template>
            同意
          </n-button>

          <n-button size="tiny" @click="onDecline(item)">
            <template #icon>
              <n-icon :component="Close" />
            </template>
            拒绝
          </n-button>
        </div>
      </div>
    </main>

    <main v-if="items.length === 0" class="el-main" style="padding-top: 10%">
      <n-empty size="200" description="暂无相关数据">
        <template #icon>
          <img src="@/assets/image/no-data.svg" alt="" />
        </template>
      </n-empty>
    </main>
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
      font-weight: 500;
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
    width: 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}
</style>
