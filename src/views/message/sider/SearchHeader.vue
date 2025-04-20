<script lang="ts" setup>
import { Search, Plus } from '@icon-park/vue-next'

const modelValue = defineModel<string>()

const { options } = defineProps<{
  options: {
    label: string
    key: string
  }[]
}>()

const emit = defineEmits(['on-select', 'on-keyword'])

const onKeywordChange = () => {
  emit('on-keyword', modelValue.value)
}

const onToolsMenu = (value: string) => {
  emit('on-select', value)
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

    <n-dropdown
      :animated="true"
      trigger="hover"
      :show-arrow="true"
      @select="onToolsMenu"
      :options="options"
    >
      <n-button circle style="margin-left: 10px">
        <template #icon>
          <n-icon :component="Plus" />
        </template>
      </n-button>
    </n-dropdown>
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
