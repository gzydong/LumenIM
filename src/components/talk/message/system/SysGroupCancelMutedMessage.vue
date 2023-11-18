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

      <span>取消了全员禁言</span>
    </div>
  </div>
</template>
