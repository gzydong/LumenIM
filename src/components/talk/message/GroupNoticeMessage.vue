<script lang="ts" setup>
import { ref } from 'vue'
import { ITalkRecordExtraGroupNotice, ITalkRecord } from '@/types/chat'

defineProps<{
  extra: ITalkRecordExtraGroupNotice
  data: ITalkRecord
  maxWidth?: Boolean
}>()

let show = ref(false)
</script>
<template>
  <section class="im-message-group-notice pointer" @click="show = !show">
    <div class="title">
      <n-tag :bordered="false" size="small" type="primary"> 群公告 </n-tag>
      《{{ extra.title }}》
    </div>
    <div class="content" :class="{ ellipsis: !show }">
      {{ extra.content }}
    </div>
  </section>
</template>

<style lang="less" scoped>
.im-message-group-notice {
  max-width: 500px;
  min-height: 10px;
  border-radius: 10px;
  padding: 8px 10px;
  border: 1px solid var(--im-message-border-color);
  user-select: none;

  .title {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 400;
    margin-bottom: 5px;
    position: relative;
  }

  .content {
    font-size: 13px;
    color: #a8a8a8;
    line-height: 24px;
    white-space: pre-wrap;

    &.ellipsis {
      height: 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
