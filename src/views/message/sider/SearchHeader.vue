<script lang="ts" setup>
import { Search, Plus } from '@icon-park/vue-next'

const modelValue = defineModel<string>()

const emit = defineEmits(['showGroupBox', 'on-keyword-change'])

const onKeywordChange = () => {
  emit('on-keyword-change', modelValue)
}
</script>

<template>
  <header class="el-header search-header">
    <n-input
      placeholder="搜索好友 / 群聊"
      :on-input="onKeywordChange"
      v-model:value.trim="modelValue"
      round
      clearable
    >
      <template #prefix>
        <n-icon :component="Search" />
      </template>
    </n-input>

    <n-button circle @click="emit('showGroupBox')" style="margin-left: 10px">
      <template #icon>
        <n-icon :component="Plus" />
      </template>
    </n-button>
  </header>
</template>

<style lang="less" scoped>
.search-header {
  height: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 10px;
}
</style>
