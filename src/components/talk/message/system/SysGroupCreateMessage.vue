<script setup>
import './sys-message.less'

import { inject } from 'vue'

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

      <span>创建了群聊，并邀请了</span>

      <template v-for="(user, index) in extra.members">
        <a @click="showUserModal(user.user_id)">{{ user.nickname }}</a>
        <em v-show="index < extra.members.length - 1">、</em>
      </template>
    </div>
  </div>
</template>
