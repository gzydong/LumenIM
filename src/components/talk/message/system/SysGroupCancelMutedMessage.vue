<script setup>
import './sys-message.less'
import { useInject } from '@/hooks'

const { toShowUserInfo } = useInject()

defineProps({
  extra: Object,
  data: Object
})
</script>

<template>
  <div class="immsg-systext">
    <div class="sys-text">
      <a @click="toShowUserInfo(extra.owner_id)">{{ extra.owner_name }}</a>

      <span>已关闭全员禁言</span>
    </div>
  </div>
</template>
