<script setup>
import { ref } from 'vue'
import { NEmpty, NModal } from 'naive-ui'
import { Check, Close } from '@icon-park/vue-next'
import {
  ServeGetContactApplyRecords,
  ServeApplyAccept,
  ServeApplyDecline,
} from '@/api/contacts'
import { parseTime } from '@/utils/datetime'
import { defAvatar } from '@/constant/default'
import UserCardModal from '@/components/user/UserCardModal.vue'
import { modal } from '@/utils/common'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const emit = defineEmits(['close'])
const isShow = ref(true)
const items = ref([])
const title = ref('申请列表')

const onMaskClick = () => {
  emit('close')
}

const onLoadData = () => {
  ServeGetContactApplyRecords().then(res => {
    if (res.code == 200) {
      items.value = res.data.items || []

      userStore.isContactApply = false

      if (items.value.length) {
        title.value = `好友申请(${items.value.length})`
      }
    }
  })
}

const onInfo = item => {
  modal(UserCardModal, {
    uid: item.user_id,
  })
}

const onAccept = item => {
  ServeApplyAccept({
    apply_id: item.id,
    remark: item.nickname,
  }).then(res => {
    if (res.code == 200) {
      onLoadData()
      window['$message'].success('已同意！')
    } else {
      window['$message'].info(res.message)
    }
  })
}

const onDecline = item => {
  ServeApplyDecline({
    apply_id: item.id,
    remark: '拒绝',
  }).then(res => {
    if (res.code == 200) {
      onLoadData()
      window['$message'].success('已拒绝！')
    } else {
      window['$message'].info(res.message)
    }
  })
}

onLoadData()
</script>

<template>
  <n-modal
    v-model:show="isShow"
    preset="card"
    :title="title"
    size="huge"
    :bordered="false"
    class="o-hidden"
    style="max-width: 450px; border-radius: 10px"
    :segmented="{
      content: true,
    }"
    :header-style="{
      padding: '20px 15px',
    }"
    :content-style="{
      padding: 0,
    }"
    transform-origin="center"
    :on-after-leave="onMaskClick"
  >
    <section v-if="items.length === 0" class="section flex-center">
      <n-empty size="200" description="暂无相关数据">
        <template #icon>
          <img src="@/assets/image/no-data.svg" alt="" />
        </template>
      </n-empty>
    </section>

    <section v-else class="section me-scrollbar">
      <div class="item-box" v-for="item in items" :key="item.id">
        <div class="avatar">
          <n-avatar :size="45" :src="item.avatar" :fallback-src="defAvatar" />
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

          <n-button size="tiny" color="red" @click="onDecline(item)">
            <template #icon>
              <n-icon :component="Close" />
            </template>
            拒绝
          </n-button>
        </div>
      </div>
    </section>
  </n-modal>
</template>
<style lang="less" scoped>
.section {
  height: 550px;
  width: 100%;
  overflow-y: auto;

  .item-box {
    width: inherit;
    height: 50px;
    margin: 15px 0;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 15px;

    .avatar {
      width: 50px;
      height: inherit;
    }

    .content {
      height: inherit;
      width: 100%;
      margin: 0 10px;

      .username {
        height: 25px;
        line-height: 25px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: space-between;

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
      height: inherit;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      flex-shrink: 0;
      transition: all 0.5 ease-in-out;
    }

    &:hover {
      .tools {
        width: 60px;
        display: flex;
      }

      .time {
        display: none;
      }
    }
  }
}
</style>
