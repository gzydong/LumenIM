<script setup>
import './sys-message.less'
import { useInject } from '@/hooks'

defineProps({
  extra: Object,
  data: Object
})

const { showUserInfoModal } = useInject()
</script>

<template>
  <div class="im-message-sys-text">
    <div class="sys-text">
      <a @click="showUserInfoModal(extra.owner_id)">
        {{ extra.owner_name }}
      </a>

      <span>退出了群聊</span>
    </div>
  </div>
</template>
