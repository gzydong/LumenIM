<script setup>
import './sys-message.less'
import { inject } from 'vue'

const showUserModal = inject('$user')

defineProps({
  extra: Object,
  data: Object,
})
</script>

<template>
  <div class="im-message-sys-text">
    <div class="sys-text">
      <a @click="showUserModal(extra.owner_id)">
        {{ extra.owner_name }}
      </a>

      <span>将</span>

      <template v-for="(user, index) in extra.members">
        <a @click="showUserModal(user.user_id)">{{ user.nickname }}</a>
        <em v-show="index < extra.members.length - 1">、</em>
      </template>

      <span>踢出群聊</span>
    </div>
  </div>
</template>
