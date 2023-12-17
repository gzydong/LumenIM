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
      <a @click="showUserInfoModal(extra.old_owner_id)">{{ extra.old_owner_name }}</a>
      <span>将群主转让给</span>
      <a @click="showUserInfoModal(extra.new_owner_id)">{{ extra.new_owner_name }}</a>
    </div>
  </div>
</template>
