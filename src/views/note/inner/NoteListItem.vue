<script lang="ts" setup>
import { MoreOne, Star } from '@icon-park/vue-next'

const emit = defineEmits(['click-more'])

defineProps<{
  title: string
  datetime: string
  classname?: string
  active: boolean
  isAsterisk: boolean
}>()

const tools = () => {
  emit('click-more')
}

// 格式化时间显示，如果是本年度则不显示年份
const formatDateTime = (datetime: string) => {
  if (!datetime) return ''

  const date = new Date(datetime)
  const currentYear = new Date().getFullYear()
  const dateYear = date.getFullYear()

  // 如果是本年度，只显示月日和时间
  if (dateYear === currentYear) {
    // 返回格式 MM/DD HH:mm
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${month}/${day} ${hours}:${minutes}`
  } else {
    // 如果不是本年度，显示年月日和时间
    const year = String(date.getFullYear()).substring(2) // 只取年份后两位
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}/${month}/${day} ${hours}:${minutes}`
  }
}
</script>

<template>
  <div class="note-list-item pointer border-bottom" :class="{ active: active }">
    <div class="title text-ellipsis">
      <n-icon v-if="isAsterisk" size="16" :component="Star" class="pointer" color="red" />
      {{ title }}
    </div>

    <div class="content">
      <span style="width: 100%; max-width: fit-content">{{ formatDateTime(datetime) }} </span>
      <n-divider vertical />
      <span class="text-ellipsis">{{ classname }}</span>

      <n-icon
        size="18"
        :component="MoreOne"
        class="pointer"
        @click.stop="tools"
        style="margin-left: auto"
      />
    </div>
  </div>
</template>

<style lang="less">
.note-list-item {
  min-height: 50px;
  transition: all 0.5s ease;
  overflow: hidden;
  padding: 8px;
  margin: 8px 0;
  user-select: none;

  &:hover,
  &.active {
    border-color: transparent;
    border-radius: 10px;
    background-color: var(--note-list-active-bg-color);
  }

  .title {
    height: 26px;
    line-height: 26px;
    font-size: 15px;
    width: 100%;
  }

  .content {
    margin-top: 5px;
    height: 26px;
    line-height: 26px;
    font-size: 13px;
    width: 100%;
    display: flex;
    align-items: center;
    color: var(--im-text-color-grey);
  }
}
</style>
