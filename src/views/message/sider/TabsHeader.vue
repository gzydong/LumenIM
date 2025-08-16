<script lang="ts" setup>
import { useTalkStore } from '@/store'

const talkStore = useTalkStore()

const tabIndex = defineModel()

const tabs = ref([
  {
    name: '全部',
    value: computed(() => {
      return talkStore.items.length
    })
  },
  {
    name: '好友',
    value: computed(() => {
      return talkStore.friendItems.length
    })
  },
  {
    name: '群聊',
    value: computed(() => {
      return talkStore.groupItems.length
    })
  },
  {
    name: '未读',
    value: computed(() => {
      return talkStore.unreadItems.length
    })
  }
])

const onChange = (index: number) => {
  tabIndex.value = index
}
</script>

<template>
  <header class="el-header tabs-header">
    <n-space :wrap="false">
      <n-tag
        v-for="(tab, index) in tabs"
        :bordered="false"
        :type="tabIndex == index ? 'primary' : 'default'"
        size="small"
        class="pointer"
        :key="tab.name"
        @click="onChange(index)"
      >
        {{ tab.name }}<span>&nbsp;{{ tab.value }}</span>
      </n-tag>
    </n-space>
  </header>
</template>

<style lang="less" scoped>
.tabs-header {
  height: 38px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
}
</style>
