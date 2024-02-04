<script setup>
import './sys-message.less'
import { useInject } from '@/hooks'

defineProps({
  extra: Object,
  data: Object
})

const { toShowUserInfo } = useInject()
</script>

<template>
  <div class="immsg-systext">
    <div class="sys-text">
      <a @click="toShowUserInfo(extra.owner_id)">{{ extra.owner_name }}</a>

      <span>已开启全员禁言</span>
    </div>
  </div>
</template>
