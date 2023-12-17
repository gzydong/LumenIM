<script lang="ts" setup>
import { ref, onMounted, h } from 'vue'
import { NInput } from 'naive-ui'
import { Close, CheckSmall } from '@icon-park/vue-next'
import { useUserStore } from '@/store'
import { ServeGetGroupApplyAll, ServeDeleteGroupApply, ServeAgreeGroupApply } from '@/api/group'
import { throttle } from '@/utils/common'
import { parseTime } from '@/utils/datetime'
import { useUtil, useInject } from '@/hooks'

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

const { useMessage, useDialog } = useUtil()
const { showUserInfoModal } = useInject()
const userStore = useUserStore()
const items = ref<Item[]>([])
const loading = ref(true)

const onLoadData = () => {
  ServeGetGroupApplyAll()
    .then((res) => {
      if (res.code == 200) {
        items.value = res.data.items || []
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const onInfo = (item: Item) => {
  showUserInfoModal(item.user_id)
}

const onAgree = throttle((item: Item) => {
  let loading = useMessage.loading('请稍等，正在处理')

  ServeAgreeGroupApply({
    apply_id: item.id
  }).then((res) => {
    loading.destroy()
    if (res.code == 200) {
      useMessage.success('已同意')
    } else {
      useMessage.info(res.message)
    }

    onLoadData()
  })
}, 1000)

const onDelete = (item: Item) => {
  let remark = ''
  let dialog = useDialog.create({
    title: '拒绝入群申请',
    content: () => {
      return h(NInput, {
        defaultValue: '',
        placeholder: '请填写拒绝原因',
        style: { marginTop: '20px' },
        onInput: (value) => (remark = value),
        autofocus: true
      })
    },
    negativeText: '取消',
    positiveText: '提交',
    onPositiveClick: () => {
      if (!remark.length) return false

      dialog.loading = true

      ServeDeleteGroupApply({
        apply_id: item.id,
        remark: remark
      }).then((res) => {
        dialog.destroy()

        if (res.code == 200) {
          useMessage.success('已拒绝')
        } else {
          useMessage.info(res.message)
        }

        onLoadData()
      })

      return false
    }
  })
}

onMounted(() => {
  onLoadData()

  userStore.isGroupApply = false
})
</script>

<template>
  <section v-loading="loading" style="min-height: 300px">
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

    <div class="item" v-for="item in items" :key="item.id">
      <div class="avatar" @click="onInfo(item)">
        <im-avatar :size="40" :src="item.avatar" :username="item.nickname" />
      </div>

      <div class="content pointer o-hidden" @click="onInfo(item)">
        <div class="username">
          <span>
            <n-tag :bordered="false" size="small" type="primary">
              {{ item.group_name }}
            </n-tag>
            {{ item.nickname }}
          </span>
          <span class="time">{{ parseTime(item.created_at, '{m}/{d} {h}:{i}') }}</span>
        </div>
        <div class="remark text-ellipsis">备注: {{ item.remark }}</div>
      </div>

      <div class="tools">
        <n-button @click="onAgree(item)" strong secondary circle size="small" type="primary">
          <template #icon>
            <n-icon :component="CheckSmall" />
          </template>
        </n-button>

        <n-button @click="onDelete(item)" strong secondary circle type="tertiary" size="small">
          <template #icon>
            <n-icon :component="Close" />
          </template>
        </n-button>
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
  transition: all 0.3s ease-in;

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
