<script setup lang="ts">
import { ref, inject } from 'vue'
import Loading from '@/components/base/Loading.vue'
import { ServeGetForwardRecords } from '@/api/chat'
import { MessageComponents } from '@/constant/message'

const emit = defineEmits(['close'])
const props = defineProps({
  pid: {
    type: String,
    default: '',
  },
  recordId: {
    type: Number,
    default: 0,
  },
})
const user = inject('$user')
const isShow = ref(true)
const records = ref([])
const title = ref('会话记录')

const onMaskClick = () => {
  emit('close')
}

const onLoadData = () => {
  console.log(props.pid)

  ServeGetForwardRecords({
    pid: props.pid,
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
    style="max-width: 500px"
    class="modal-radius"
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
    <div class="main-box me-scrollbar me-scrollbar-thumb">
      <Loading v-if="records.length === 0" />

      <div v-for="item in records" :key="item.msg_id" class="message-item">
        <div class="left-box pointer" @click="user(item.user_id)">
          <im-avatar :src="item.avatar" :size="30" :username="item.nickname" />
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
            :pid="pid"
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
    width: 100%;
    overflow-x: auto;
    padding: 0px 5px 15px 5px;
    box-sizing: border-box;
    height: fit-content;

    .msg-header {
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      position: relative;
      user-select: none;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
