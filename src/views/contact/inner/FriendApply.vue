<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue'
import { NPopconfirm } from 'naive-ui'
import { Close, CheckSmall } from '@icon-park/vue-next'
import { ServeGetContactApplyRecords, ServeApplyAccept, ServeApplyDecline } from '@/api/contact'
import { throttle } from '@/utils/common'
import { parseTime } from '@/utils/datetime'
import { useUserStore } from '@/store'
import { useInject } from '@/hooks'

type Item = {
  id: number
  user_id: number
  friend_id: number
  remark: string
  nickname: string
  avatar: string
  created_at: string
}

const userStore = useUserStore()
const { showUserInfoModal } = useInject()
const items = ref<Item[]>([])
const loading = ref(true)
const isContactApply = computed(() => userStore.isContactApply)

const onLoadData = (isClearTip = false) => {
  ServeGetContactApplyRecords()
    .then((res) => {
      if (res.code == 200) {
        items.value = res.data.items || []

        if (isClearTip) {
          userStore.isContactApply = false
        }
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const onInfo = (item: Item) => {
  showUserInfoModal(item.user_id)
}

const onAccept = throttle((item: Item) => {
  let loading = window['$message'].loading('请稍等，正在处理')

  ServeApplyAccept({
    apply_id: item.id,
    remark: item.nickname
  }).then(({ code, message }) => {
    loading.destroy()
    if (code == 200) {
      onLoadData()
      window['$message'].success('已同意')
    } else {
      window['$message'].info(message)
    }
  })
}, 1000)

const onDecline = throttle((item) => {
  let loading = window['$message'].loading('请稍等，正在处理')

  ServeApplyDecline({
    apply_id: item.id,
    remark: '拒绝'
  }).then(({ code, message }) => {
    loading.destroy()
    if (code == 200) {
      onLoadData()
      window['$message'].success('已拒绝')
    } else {
      window['$message'].info(message)
    }
  })
}, 1000)

watch(isContactApply, () => {
  onLoadData(false)
})

onMounted(() => {
  onLoadData(true)
})
</script>

<template>
  <section v-loading="loading" style="min-height: 300px">
    <n-empty
      v-show="items.length == 0"
      size="200"
      description="暂无相关数据"
      style="margin-top: 10%"
    >
      <template #icon>
        <img src="@/assets/image/no-data.svg" alt="" />
      </template>
    </n-empty>

    <div class="item" v-for="item in items" :key="item.id">
      <div class="avatar" @click="onInfo(item)">
        <im-avatar :size="40" :src="item.avatar" :username="item.nickname" />
      </div>

      <div class="content pointer o-hidden" @click="onInfo(item)">
        <div class="username">
          <span>{{ item.nickname }}</span>
          <span class="time">{{ parseTime(item.created_at, '{m}/{d} {h}:{i}') }}</span>
        </div>
        <div class="remark text-ellipsis">备注: {{ item.remark }}</div>
      </div>

      <div class="tools">
        <n-button @click="onAccept(item)" strong secondary circle type="primary" size="small">
          <template #icon>
            <n-icon :component="CheckSmall" />
          </template>
        </n-button>

        <n-popconfirm @positive-click="onDecline(item)">
          <template #trigger>
            <n-button strong secondary circle type="tertiary" size="small">
              <template #icon>
                <n-icon :component="Close" />
              </template>
            </n-button>
          </template>
          确认要拒绝申请吗？
        </n-popconfirm>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
.item {
  height: 60px;
  display: flex;
  align-items: center;
  margin: 15px;
  transition: all 0.3s ease-in-out;

  &:first-child {
    margin-top: 0;
  }

  > div {
    height: inherit;
  }

  .avatar {
    width: 40px;
    display: flex;
    align-items: center;
  }

  .content {
    width: 100%;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .username {
      height: 30px;
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
      height: 30px;
      line-height: 25px;
      font-size: 12px;
      color: #9a9292;
      overflow: hidden;
      width: inherit;
      border-bottom: 1px solid var(--border-color);
    }
  }

  .tools {
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  &:hover {
    background-color: var(--im-active-bg-color);

    padding: 0 5px;
    border-radius: 5px;

    .remark {
      border-bottom-color: transparent;
    }
  }
}
</style>
