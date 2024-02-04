<script lang="ts" setup>
import { reactive, computed, markRaw } from 'vue'
import SubViewLayout from '@/layout/SubViewLayout.vue'
import { useUserStore } from '@/store'
import { PeoplesTwo, ChartGraph, Peoples, People, Remind } from '@icon-park/vue-next'

const userStore = useUserStore()

const menus = reactive([
  {
    name: '好友通知',
    path: '/contact/friend/apply',
    icon: markRaw(Remind),
    tips: computed(() => (userStore.isContactApply ? 'New' : ''))
  },
  {
    name: '群聊通知',
    path: '/contact/group/apply',
    icon: markRaw(Remind),
    tips: computed(() => (userStore.isGroupApply ? 'New' : ''))
  },
  {
    name: '我的好友',
    path: '/contact/friend',
    icon: markRaw(People)
  },
  {
    name: '我的群聊',
    path: '/contact/group',
    icon: markRaw(Peoples)
  },
  {
    name: '公开群聊',
    path: '/contact/open-group',
    icon: markRaw(PeoplesTwo)
  },
  {
    name: '组织架构',
    path: '/contact/organize',
    icon: markRaw(ChartGraph),
    show: computed(() => userStore.isQiye)
  }
])
</script>

<template>
  <SubViewLayout title="通讯录" :menus="menus" />
</template>
