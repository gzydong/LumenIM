<script setup>
import './sys-message.less'
import { useInject } from '@/hooks'

const { showUserInfoModal } = useInject()

defineProps({
  extra: Object,
  data: Object
})
</script>

<template>
  <div class="im-message-sys-text">
    <div class="sys-text">
      <a @click="showUserInfoModal(extra.owner_id)">
        {{ extra.owner_name }}
      </a>

      <span>取消了全员禁言</span>
    </div>
  </div>
</template>
