<script lang="ts" setup>
import type { DropdownOption } from 'naive-ui'

interface Props {
  // 主按钮文本
  primaryText?: string
  // 主按钮类型
  primaryType?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  // 下拉选项
  options?: DropdownOption[]
  // 按钮尺寸
  size?: 'small' | 'medium' | 'large'
  // 是否为幽灵按钮
  ghost?: boolean
}

withDefaults(defineProps<Props>(), {
  primaryText: '操作',
  primaryType: 'primary',
  options: () => [],
  size: 'medium',
  ghost: false
})

const emit = defineEmits<{
  (e: 'primary-click'): void
  (e: 'select', key: string): void
}>()

const onPrimaryClick = () => {
  emit('primary-click')
}

const handleSelect = (key: string) => {
  emit('select', key)
}
</script>

<template>
  <n-button-group size="tiny">
    <n-button :type="primaryType" :ghost="ghost" @click="onPrimaryClick">
      {{ primaryText }}
    </n-button>

    <n-dropdown
      v-if="options.length > 0"
      placement="bottom-end"
      trigger="click"
      size="small"
      :show-arrow="true"
      @select="handleSelect"
      :options="options"
    >
      <n-button :ghost="ghost">
        <template #icon>
          <n-icon :component="Down" />
        </template>
      </n-button>
    </n-dropdown>
  </n-button-group>
</template>

<script lang="ts">
import { Down } from '@icon-park/vue-next'
export default {
  components: {
    Down
  }
}
</script>
