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
      <a @click="toShowUserInfo(extra.old_owner_id)">{{ extra.old_owner_name }}</a>
      <span>将群主转让给</span>
      <a @click="toShowUserInfo(extra.new_owner_id)">{{ extra.new_owner_name }}</a>
    </div>
  </div>
</template>
