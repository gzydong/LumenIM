<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ServeGetForwardRecords } from '@/api/chat'
import { ITalkRecord } from '@/types/chat'
import { ChatPlus } from '@/components/chat'
import { formatChatMessage } from './render.tsx'
import { toApi } from '@/api'

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

const loading = ref(true)
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

const loadChatRecord = async () => {
  const { code, data } = await toApi(
    ServeGetForwardRecords,
    {
      msg_ids: props.msgIds,
      talk_mode: props.talkMode
    },
    { loading }
  )

  if (code != 200) return

  items.value = data.items || []
  items.value.map((item: any) => {
    item.extra = JSON.parse(item.extra)
    item.quote = JSON.parse(item.quote)
  })

  title.value = `会话记录(${items.value.length})`
}

onMounted(() => {
  loadChatRecord()
})
</script>

<template>
  <n-modal
    v-model:show="isShow"
    preset="card"
    :title="title"
    style="max-width: 500px"
    class="modal-radius o-hidden"
    :on-after-leave="onMaskClick"
    :segmented="{
      content: true
    }"
    :header-style="{
      padding: '15px 15px'
    }"
    :content-style="{
      padding: 0
    }"
  >
    <section class="section me-scrollbar" v-loading="loading">
      <ChatPlus dataSourceMode="custom" :items="items" :custom-render="customMessageRender" />
    </section>
  </n-modal>
</template>

<style lang="less" scoped>
.section {
  height: 600px;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
