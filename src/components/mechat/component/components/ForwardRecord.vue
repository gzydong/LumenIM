<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ServTalkForwardRecords } from '@/api/chat'
import { ITalkRecord } from '@/types/chat'
import { ChatPlus } from '@/components/chat'
import { formatChatMessage } from '@/components/mechat/render'

const emit = defineEmits(['close'])
const props = defineProps({
  msgIds: {
    required: true
  },
  talkMode: {
    type: Number,
    required: true
  }
})

const isShow = ref(true)
const items = ref<ITalkRecord[]>([])
const title = ref('会话记录')

const onMaskClick = () => {
  emit('close')
}

/**
 * 自定义消息渲染器
 * @param item
 */
const customMessageRender = (item: any) => formatChatMessage(0, item)

const onLoadData = async () => {
  let { code, data } = await ServTalkForwardRecords({
    msg_ids: props.msgIds,
    talk_mode: props.talkMode
  })

  if (code != 200) {
    return alert('获取会话记录失败')
  }

  items.value = data.items || []
  title.value = `会话记录(${items.value.length})`

  console.log(data.items)
}

onMounted(() => {
  onLoadData()
})
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
      content: true
    }"
    :header-style="{
      padding: '20px 15px'
    }"
    :content-style="{
      padding: 0
    }"
  >
    <div class="main-box me-scrollbar me-scrollbar-thumb">
      <ChatPlus dataSourceMode="custom" :items="items" :custom-render="customMessageRender" />
    </div>
  </n-modal>
</template>

<style lang="less" scoped>
.main-box {
  height: 600px;
  width: 100%;
  overflow-y: auto;
  padding-bottom: 15px;
  box-sizing: border-box;
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
