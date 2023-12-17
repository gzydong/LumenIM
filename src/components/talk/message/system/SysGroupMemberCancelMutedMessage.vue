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

      <span>解除了</span>

      <template v-for="(user, index) in extra.members" :key="index">
        <a @click="showUserInfoModal(user.user_id)">{{ user.nickname }}</a>
        <em v-show="index < extra.members.length - 1">、</em>
      </template>

      <span>禁言</span>
    </div>
  </div>
</template>
