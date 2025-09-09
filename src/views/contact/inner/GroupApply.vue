<script lang="ts" setup>
import { ServGroupApplyAgree, ServGroupApplyAll, ServGroupApplyDecline } from '@/api/group'
import ButtonDropdown from '@/components/basic/ButtonDropdown.vue'
import { useInject } from '@/hooks'
import { useUserStore } from '@/store'
import { throttle } from '@/utils/common'
import { formatTime } from '@/utils/datetime'

interface Item {
  id: number
  user_id: number
  group_id: number
  avatar: string
  nickname: string
  remark: string
  created_at: string
  group_name: string
}

const { toShowUserInfo, message } = useInject()
const userStore = useUserStore()
const items = ref<Item[]>([])
const loading = ref(true)

const onLoadData = async () => {
  const { code, data } = await ServGroupApplyAll({}, { loading })

  if (code != 200) return

  items.value = data.items || []
}

const onInfo = (item: Item) => {
  toShowUserInfo(item.user_id)
}

const onAgree = throttle(async (item: Item) => {
  let loading = message.loading('请稍等，正在处理')

  await ServGroupApplyAgree(
    {
      apply_id: item.id
    },
    {
      successText: '已同意',
      onSuccess: onLoadData
    }
  )

  loading.destroy()
}, 1000)

const onDelete = (item: Item) => {
  ServGroupApplyDecline(
    {
      apply_id: item.id,
      remark: '已拒绝'
    },
    {
      successText: '已拒绝',
      onSuccess: onLoadData
    }
  )
}

onMounted(() => {
  onLoadData()

  userStore.isGroupApply = false
})
</script>

<template>
  <section
    style="min-height: 100%; overflow-y: auto"
    :class="{
      'flex-center': items.length == 0
    }"
  >
    <n-empty v-show="items.length == 0" description="暂无相关数据"> </n-empty>

    <div class="item border-bottom" v-for="item in items" :key="item.id">
      <div class="avatar" @click="onInfo(item)">
        <im-avatar :size="30" :src="item.avatar" :username="item.nickname" />
      </div>

      <div class="content pointer o-hidden" @click="onInfo(item)">
        <div class="username">
          <span>
            {{ item.nickname }}
          </span>
          <span class="time">{{ formatTime(item.created_at, 'MM/DD HH:mm') }}</span>
        </div>
        <div class="text text-ellipsis">
          <span>申请加入:</span>
          <n-button text type="primary">&nbsp;{{ item.group_name }} </n-button>
        </div>
        <div class="remark text-ellipsis">留言: {{ item.remark }}</div>
      </div>

      <div class="tools">
        <ButtonDropdown
          primary-text="同意"
          primary-type="default"
          :options="[{ label: '忽略', key: 'delete' }]"
          size="small"
          @primary-click="onAgree(item)"
          @select="
            (key) => {
              if (key == 'delete') {
                onDelete(item)
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
    align-items: start;
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
