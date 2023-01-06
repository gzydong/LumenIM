<script setup>
import { reactive, markRaw, computed } from 'vue'
import {
  GitNetworkOutline,
  PersonAddOutline,
  BalloonOutline,
  PeopleOutline,
} from '@vicons/ionicons5'
import IMLayout from '@/views/layout/IMLayout.vue'
import SubViewLayout from '@/components/base/SubViewLayout.vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const menus = reactive([
  {
    name: '我的好友',
    path: '/contact/friend',
    icon: markRaw(PersonAddOutline),
    size: 18,
    tips: computed(() => (userStore.isContactApply ? 'New' : '')),
  },
  {
    name: '我的群组',
    path: '/contact/group',
    icon: markRaw(PeopleOutline),
    size: 20,
  },
  {
    name: '公开群组',
    path: '/contact/group/open',
    icon: markRaw(BalloonOutline),
    size: 18,
  },
  {
    name: '组织架构',
    path: '/contact/organize',
    icon: markRaw(GitNetworkOutline),
    show: computed(() => userStore.isQiye),
    size: 18,
  },
])
</script>

<template>
  <IMLayout :index="1">
    <SubViewLayout title="通信录" :menus="menus" />
  </IMLayout>
</template>
