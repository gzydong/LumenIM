<script lang="ts" setup>
import {
  ServContactApplyAccept,
  ServContactApplyDecline,
  ServContactApplyRecords
} from '@/api/contact'
import ButtonDropdown from '@/components/basic/ButtonDropdown.vue'
import { useInject } from '@/hooks'
import { useUserStore } from '@/store'
import { throttle } from '@/utils/common'
import { formatTime } from '@/utils/datetime'

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
const { toShowUserInfo, message } = useInject()
const items = ref<Item[]>([])
const loading = ref(true)
const isContactApply = computed(() => userStore.isContactApply)

const onLoadData = async (isClearTip = false) => {
  const { code, data } = await ServContactApplyRecords({}, { loading })

  if (code != 200) return

  items.value = data?.items || []

  if (isClearTip) {
    userStore.isContactApply = false
  }
}

const onInfo = (item: Item) => {
  toShowUserInfo(item.user_id)
}

const onAccept = throttle(async (item: Item) => {
  let loading = message.loading('请稍等，正在处理')

  await ServContactApplyAccept(
    {
      apply_id: item.id,
      remark: item.nickname
    },
    {
      successText: '已同意',
      onSuccess: () => onLoadData()
    }
  )

  loading.destroy()
}, 1000)

const onDecline = throttle(async (item: Item) => {
  let loading = message.loading('请稍等，正在处理')

  await ServContactApplyDecline(
    {
      apply_id: item.id,
      remark: item.nickname
    },
    {
      successText: '已拒绝',
      onSuccess: () => onLoadData()
    }
  )

  loading.destroy()
}, 1000)

watch(isContactApply, () => {
  onLoadData(false)
})

onMounted(() => {
  onLoadData(true)
})
</script>

<template>
  <section
    style="min-height: 100%; overflow-y: auto"
    :class="{
      'flex-center': items.length == 0
    }"
  >
    <n-empty v-show="items.length == 0" description="暂无相关数据" />

    <div class="item border-bottom" v-for="item in items" :key="item.id">
      <div class="avatar" @click="onInfo(item)">
        <im-avatar :size="30" :src="item.avatar" :username="item.nickname" />
      </div>

      <div class="content pointer o-hidden" @click="onInfo(item)">
        <div class="username">
          <span>{{ item.nickname }}</span>
          <span class="time">{{ formatTime(item.created_at, 'MM/DD HH:mm') }}</span>
        </div>
        <div class="remark text-ellipsis">留言: {{ item.remark }}</div>
      </div>

      <div class="tools">
        <ButtonDropdown
          primary-text="同意"
          primary-type="default"
          :options="[{ label: '忽略', key: 'delete' }]"
          size="small"
          @primary-click="onAccept(item)"
          @select="
            (key) => {
              if (key == 'delete') {
                onDecline(item)
              }

              return false
            }
          "
        />
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
.item {
  min-height: 60px;
  display: flex;
  align-items: center;

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
