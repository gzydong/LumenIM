<script lang="ts" setup>
import { NDropdown, DropdownOption } from 'naive-ui'
import { More } from '@icon-park/vue-next'

const emit = defineEmits(['select'])

const props = defineProps<{
  options: DropdownOption[]
  value: any
}>()

const handleSelect = (key: string) => {
  emit('select', key, props.value)
}
</script>

<template>
  <n-dropdown trigger="hover" :show-arrow="true" :options="options" @select="handleSelect">
    <n-button text>
      <template #icon>
        <n-icon :component="More" />
      </template>
    </n-button>
  </n-dropdown>
</template>
