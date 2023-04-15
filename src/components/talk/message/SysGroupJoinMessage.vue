<script setup>
import { inject } from 'vue'

defineProps({
  extra: Object,
  data: Object,
})

const showUserModal = inject('showUserModal')
</script>

<template>
  <div class="invite-message">
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

<style lang="less" scoped>
.invite-message {
  display: flex;
  justify-content: center;
}

.sys-text {
  margin: 10px auto;
  background-color: #f5f5f5;
  font-size: 11px;
  line-height: 30px;
  padding: 0 8px;
  word-wrap: break-word;
  color: #979191;
  user-select: none;
  font-weight: 300;
  display: inline-block;
  border-radius: 3px;
  max-width: 80%;
  text-align: center;

  span {
    margin: 0 5px;
  }

  a {
    color: #939596;
    cursor: pointer;
    font-size: 12px;
    font-weight: 400;

    &:hover {
      color: black;
    }
  }
}
</style>
