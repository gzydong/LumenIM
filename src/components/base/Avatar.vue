<script lang="ts" setup>
import { hashStrToHexColor } from '@/utils/common'
import { defAvatar } from '@/constant/default'

defineProps({
  src: {
    type: String,
    default: ''
  },
  username: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 30
  },
  fontSize: {
    type: Number,
    default: 14
  }
})
</script>

<template>
  <n-avatar v-if="src.length" round :src="src" :size="size" :fallback-src="defAvatar" />

  <n-avatar
    v-else
    round
    :style="{
      color: '#ffffff',
      backgroundColor: hashStrToHexColor(username || ''),
      fontSize: fontSize + 'px'
    }"
    :size="size"
  >
    {{ username && username.substring(0, 1) }}
  </n-avatar>
</template>
<style lang="less" scoped></style>
