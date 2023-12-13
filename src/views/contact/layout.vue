<script lang="ts" setup>
import { reactive, computed, markRaw } from 'vue'
import SubViewLayout from '@/layout/SubViewLayout.vue'
import { useUserStore } from '@/store'
import { PeoplesTwo, ChartGraph, Peoples, People, Permissions } from '@icon-park/vue-next'

const userStore = useUserStore()

const menus = reactive([
  {
    name: '申请管理',
    path: '/contact/apply',
    icon: markRaw(Permissions),
    tips: computed(() => (userStore.isContactApply || userStore.isGroupApply ? 'New' : ''))
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
    path: '/contact/group/open',
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
