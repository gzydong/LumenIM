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
      <a @click="showUserModal(extra.old_owner_id)">{{
        extra.old_owner_name
      }}</a>
      <span>将群主转让给</span>
      <a @click="showUserModal(extra.new_owner_id)">{{
        extra.new_owner_name
      }}</a>
    </div>
  </div>
</template>
