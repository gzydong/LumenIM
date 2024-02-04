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
      <a @click="toShowUserInfo(extra.owner_id)">
        {{ extra.owner_name }}
      </a>

      <span>退出了群聊</span>
    </div>
  </div>
</template>
