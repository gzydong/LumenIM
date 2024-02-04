<script setup>
import './sys-message.less'
import { useInject } from '@/hooks'

defineProps({
  extra: Object,
  data: Object
})

const { toShowUserInfo } = useInject()
</script>

<template>
  <div class="immsg-systext">
    <div class="sys-text">
      <a @click="toShowUserInfo(extra.owner_id)">
        {{ extra.owner_name }}
      </a>

      <span>创建了群聊，并邀请了</span>

      <template v-for="(user, index) in extra.members" :key="index">
        <a @click="toShowUserInfo(user.user_id)">{{ user.nickname }}</a>
        <em v-show="index < extra.members.length - 1">、</em>
      </template>
    </div>
  </div>
</template>
