<script lang="ts" setup>
import {
  fetchContactApplyAccept,
  fetchContactApplyDecline,
  fetchContactApplyList
} from '@/apis/api'
import { fetchApi } from '@/apis/request'
import { ContactApplyListResponse_Item } from '@/apis/types'
import ButtonDropdown from '@/components/basic/ButtonDropdown.vue'
import { useInject } from '@/hooks'
import { useUserStore } from '@/store'
import { formatTime } from '@/utils/datetime'

const userStore = useUserStore()
const { toShowUserInfo, message } = useInject()
const items = ref<ContactApplyListResponse_Item[]>([])
const loading = ref(true)
const isContactApply = computed(() => userStore.isContactApply)

const onLoadData = async (isClearTip = false) => {
  const [err, data] = await fetchApi(fetchContactApplyList, {}, { loading })
  if (err) return

  items.value = data?.items || []

  if (isClearTip) {
    userStore.isContactApply = false
  }
}

const onInfo = (item: ContactApplyListResponse_Item) => {
  toShowUserInfo(item.user_id)
}

const onAccept = async (item: ContactApplyListResponse_Item) => {
  let loading = message.loading('请稍等，正在处理')

  const [err] = await fetchApi(
    fetchContactApplyAccept,
    {
      apply_id: item.id,
      remark: '拒绝'
    },
    { successText: '已同意' }
  )
  if (err) return

  onLoadData()
  loading.destroy()
}

const onDecline = async (item: ContactApplyListResponse_Item) => {
  let loading = message.loading('请稍等，正在处理')

  const [err] = await fetchApi(
    fetchContactApplyDecline,
    {
      apply_id: item.id,
      remark: '拒绝'
    },
    { successText: '已拒绝' }
  )
  if (err) return

  onLoadData()
  loading.destroy()
}

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
      'flex-center': !items.length
    }"
  >
    <n-empty v-show="!items.length" description="暂无好友通知" />

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
  padding: 6px 0;

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
      font-size: 15px;

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
