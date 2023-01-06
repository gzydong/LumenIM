<script setup>
defineProps({
  invite: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['user-info'])

const onCatInfo = uid => {
  emit('user-info', uid)
}
</script>

<template>
  <div class="invite-message">
    <div v-if="invite.type == 1 || invite.type == 3" class="sys-text">
      <a @click="onCatInfo(invite.operate_user.id)">
        {{ invite.operate_user.nickname }}
      </a>
      <span>{{ invite.type == 1 ? '邀请了' : '将' }}</span>
      <template v-for="(user, uidx) in invite.users">
        <a @click="onCatInfo(user.id)">{{ user.nickname }}</a>
        <em v-show="uidx < invite.users.length - 1">、</em>
      </template>
      <span>{{ invite.type == 1 ? '加入了群聊' : '踢出了群聊' }}</span>
    </div>

    <div v-else-if="invite.type == 2" class="sys-text">
      <a @click="onCatInfo(invite.operate_user.id)">
        {{ invite.operate_user.nickname }}
      </a>
      <span>退出了群聊</span>
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
  // word-break: break-all;
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
