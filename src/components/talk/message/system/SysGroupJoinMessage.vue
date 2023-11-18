<script setup>
import { inject } from 'vue'
import './sys-message.less'

defineProps({
  extra: Object,
  data: Object,
})

const showUserModal = inject('$user')
</script>

<template>
  <div class="im-message-sys-text">
    <div class="sys-text">
      <a @click="showUserModal(extra.owner_id)">
        {{ extra.owner_name }}
      </a>

      <span>邀请了</span>

      <template v-for="(user, index) in extra.members">
        <a @click="showUserModal(user.user_id)">{{ user.nickname }}</a>
        <em v-show="index < extra.members.length - 1">、</em>
      </template>

      <span>加入群聊</span>
    </div>
  </div>
</template>