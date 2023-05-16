<script setup>
import { ref } from 'vue'
import Loading from '@/components/base/Loading.vue'
import { ServeGetForwardRecords } from '@/api/chat'
import { MessageComponents } from '@/constant/message'
import { defAvatar } from '@/constant/default'

const emit = defineEmits(['close'])
const props = defineProps({
  recordId: {
    type: Number,
    default: 0,
  },
})
const isShow = ref(true)
const records = ref([])
const title = ref('会话记录')

const onMaskClick = () => {
  emit('close')
}

const onLoadData = () => {
  ServeGetForwardRecords({
    record_id: props.recordId,
  }).then(res => {
    if (res.code == 200) {
      records.value = res.data.items || []

      title.value = `会话记录(${records.value.length})`
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
    style="max-width: 550px; border-radius: 10px"
    class="o-hidden"
    :on-after-leave="onMaskClick"
    :segmented="{
      content: true,
    }"
    :header-style="{
      padding: '20px 15px',
    }"
    :content-style="{
      padding: 0,
    }"
  >
    <div class="main-box me-scrollbar">
      <Loading v-if="records.length === 0" />

      <div v-for="item in records" :key="item.msg_id" class="message-item">
        <div class="left-box">
          <n-avatar :size="30" :src="item.avatar || defAvatar" />
        </div>

        <div class="right-box">
          <div class="msg-header">
            <span class="name">{{ item.nickname }}</span>
            <span class="time"> {{ item.created_at }}</span>
          </div>

          <component
            :is="MessageComponents[item.msg_type] || 'unknown-message'"
            :extra="item.extra"
            :data="item"
          />
        </div>
      </div>
    </div>
  </n-modal>
</template>

<style lang="less" scoped>
.main-box {
  height: 600px;
  width: 100%;
  overflow-y: auto;
}

.message-item {
  min-height: 38px;
  display: flex;
  margin-bottom: 10px;
  padding: 5px 15px;

  .left-box {
    width: 30px;
    display: flex;
    user-select: none;
    padding-top: 8px;
  }

  .right-box {
    flex: auto;
    overflow-x: auto;
    height: fit-content;
    margin-left: 10px;

    .msg-header {
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      color: #a09a9a;
      position: relative;
      user-select: none;
      display: flex;
      justify-content: space-between;

      .name {
        color: #333;
      }
    }
  }
}
</style>
