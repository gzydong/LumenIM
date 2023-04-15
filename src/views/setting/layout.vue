<script setup>
import {
  PersonOutline,
  ShieldCheckmarkOutline,
  ShirtOutline,
  NotificationsOutline,
} from '@vicons/ionicons5'
import Layout from '@/layout/index.vue'
import SubViewLayout from '@/layout/SubViewLayout.vue'

const menus = [
  {
    name: '个人中心',
    path: '/settings/detail',
    icon: PersonOutline,
  },
  {
    name: '安全设置',
    path: '/settings/security',
    icon: ShieldCheckmarkOutline,
  },
  {
    name: '个性设置',
    path: '/settings/personalize',
    icon: ShirtOutline,
  },
  {
    name: '绑定设置',
    path: '/settings/binding',
    icon: PersonOutline,
  },
  {
    name: '通知设置',
    path: '/settings/notification',
    icon: NotificationsOutline,
  },
]
</script>

<template>
  <Layout :index="4">
    <SubViewLayout title="我的设置" :menus="menus" />
  </Layout>
</template>