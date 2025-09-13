<script lang="ts" setup>
import { fetchMessageForwardRecords } from '@/apis/api.ts'
import { fetchApi } from '@/apis/request.ts'
import { ChatPlus } from '@/components/chat'
import { ITalkRecord } from '@/types/chat'
import { safeParseJson } from '@/utils/common.ts'
import { onMounted, ref } from 'vue'
import { formatChatMessage } from './render.tsx'

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
  const [err, data] = await fetchApi(
    fetchMessageForwardRecords,
    {
      msg_ids: props.msgIds as string[],
      talk_mode: props.talkMode
    },
    { loading }
  )

  if (err) return

  items.value = data.items.map((item: any) => {
    item.extra = safeParseJson(item.extra)
    item.quote = safeParseJson(item.quote)
    return item
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
