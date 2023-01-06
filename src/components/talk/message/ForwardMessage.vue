<script setup>
import { computed, ref } from 'vue'
import ForwardRecord from '../ForwardRecord.vue'

const props = defineProps({
  recordId: {
    type: Number,
    default: 0,
  },
  records: {
    type: Array,
    default: () => [],
  },
  num: {
    type: Number,
    default: 0,
  },
})

const isShowRecord = ref(false)

const title = computed(() => {
  return [...new Set(props.records.map(v => v.nickname))].join('、')
})

const onClick = () => {
  isShowRecord.value = true
}
</script>
<template>
  <section class="forward-message pointer" @click="onClick">
    <div class="title">{{ title }} 的会话记录</div>

    <div class="list" v-for="(record, index) in records" :key="index">
      <p>
        <span>{{ record.nickname }}: </span>
        <span>{{ record.text }}</span>
      </p>
    </div>

    <div class="tips">
      <span>转发：聊天会话记录 ({{ num }}条)</span>
    </div>

    <ForwardRecord
      v-if="isShowRecord"
      :record-id="recordId"
      @close="isShowRecord = false"
    />
  </section>
</template>

<style lang="less" scoped>
.forward-message {
  width: 250px;
  min-height: 95px;
  max-height: 150px;
  border-radius: 10px;
  padding: 8px 15px;
  border: 1px solid #d6caca;
  text-align: left;
  user-select: none;
  background-color: #ffffff;

  .title {
    height: 30px;
    line-height: 30px;
    font-size: 15px;
    color: #0d1a26;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 400;
    margin-bottom: 5px;
  }

  .list p {
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    color: #a8a8a8;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 5px;
  }

  .tips {
    height: 32px;
    line-height: 35px;
    color: #8a8888;
    border-top: 1px solid #f5f5f5;
    font-size: 12px;
    margin-top: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
