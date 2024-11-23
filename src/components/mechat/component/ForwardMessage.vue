<script lang="ts" setup>
import { ref } from 'vue'
import ForwardRecord from '@/components/mechat/ForwardRecord.vue'

const props = defineProps<{
  count: number
  items: {
    nickname: string
    content: string
  }[]
  msgIds: string[]
  talkMode: number
}>()

const isShowRecord = ref(false)

const title = [...new Set(props.items.map((v) => v.nickname))].join('、')
</script>
<template>
  <section class="immsg-forward pointer" @click="isShowRecord = true">
    <div class="title">{{ title }} 的会话记录</div>
    <div class="item" v-for="(record, index) in items" :key="index">
      <p>
        <span>{{ record.nickname }}: </span>
        <span>{{ record.content }}</span>
      </p>
    </div>

    <div class="describe">
      <span>转发：聊天会话记录 ({{ count }}条)</span>
    </div>

    <ForwardRecord
      v-if="isShowRecord"
      :msg-ids="msgIds"
      :talk-mode="talkMode"
      @close="isShowRecord = false"
    />
  </section>
</template>

<style lang="less" scoped>
.immsg-forward {
  width: 250px;
  min-height: 50px;
  border-radius: 5px;
  padding: 8px 10px;
  border: 1px solid var(--im-message-border-color);
  user-select: none;

  .title {
    height: 30px;
    line-height: 30px;
    font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 400;
    margin-bottom: 5px;
  }

  .item p {
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    color: #a8a8a8;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 5px;
  }

  .describe {
    height: 32px;
    line-height: 35px;
    color: #8a8888;
    border-top: 1px solid var(--border-color);
    font-size: 12px;
    margin-top: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

html[theme-mode='dark'] {
  .immsg-forward {
    border: unset;
    background: rgb(43 43 43);
  }
}
</style>
