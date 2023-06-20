<script setup lang="ts">
import { ref } from 'vue'
import { GroupNoticeExtra } from './types'

defineProps<{
  extra: GroupNoticeExtra
  data: any
  maxWidth: Boolean
}>()

let show = ref(false)
</script>
<template>
  <section class="group-notice-message pointer" @click="show = !show">
    <div class="title">
      <n-tag :bordered="false" size="small" type="info"> 群公告 </n-tag>
      {{ extra.title }}
    </div>
    <div class="content" :class="{ ellipsis: !show }">
      {{ extra.content }}
    </div>
  </section>
</template>

<style lang="less" scoped>
.group-notice-message {
  max-width: 500px;
  min-height: 50px;
  border-radius: 10px;
  padding: 8px 10px;
  border: 1px solid rgb(239 239 245);
  user-select: none;
  background-color: #ffffff;
  margin: 0 auto;

  .title {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #0d1a26;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 400;
    margin-bottom: 5px;
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
