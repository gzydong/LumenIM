<script setup>
import { ref } from 'vue'
import { NModal } from 'naive-ui'
import Loading from '@/components/base/Loading.vue'
import { ServeGetForwardRecords } from '@/api/chat'

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
    style="max-width: 450px; border-radius: 10px"
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
          <n-avatar :size="30" :src="item.avatar" />
        </div>

        <div class="right-box">
          <div class="msg-header">
            <span class="name">
              {{ item.nickname_remarks || item.nickname }}
            </span>

            <span class="time"> {{ item.created_at }}</span>
          </div>

          <!-- 文本消息 -->
          <text-message
            v-if="item.msg_type == 1"
            :content="item.content"
            float="left"
          />

          <!-- 文件 - 图片消息 -->
          <image-message
            v-else-if="item.msg_type == 2 && item.extra.type == 1"
            :src="item.extra.url"
          />

          <!-- 文件 - 音频消息 -->
          <audio-message
            v-else-if="item.msg_type == 2 && item.extra.type == 2"
            :src="item.extra.url"
          />

          <!-- 文件 - 视频消息 -->
          <video-message
            v-else-if="item.msg_type == 2 && item.extra.type == 3"
            :src="item.extra.url"
          />

          <!-- 文件消息 -->
          <file-message
            v-else-if="item.msg_type == 2 && item.extra && item.extra.type == 4"
            :file-name="item.extra.original_name"
            :size="item.extra.size"
            :ext="item.extra.suffix"
            :record-id="item.id"
          />

          <!-- 代码块消息 -->
          <code-message
            v-else-if="item.msg_type == 4"
            :code="item.extra.code"
            :lang="item.extra.lang"
          />

          <div v-else class="other-message">未知消息类型</div>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<style lang="less" scoped>
.main-box {
  height: 500px;
  width: 100%;
  overflow-y: auto;
}

.message-item {
  min-height: 30px;
  display: flex;
  margin-bottom: 5px;
  flex-direction: row;
  padding: 5px 15px;

  &:first-child {
    margin-top: 10px;
  }

  .left-box {
    width: 30px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    user-select: none;
    padding-top: 8px;
    margin-right: 10px;

    img {
      height: 30px;
      width: 30px;
      border-radius: 3px;
    }
  }

  .right-box {
    flex: auto;
    overflow-x: auto;
    padding: 0px 5px 15px 5px;

    .msg-header {
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      color: #a09a9a;
      position: relative;
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .name {
        color: #333;
      }
    }
  }
}
</style>
