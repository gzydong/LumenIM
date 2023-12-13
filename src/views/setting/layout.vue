<script lang="ts" setup>
import SubViewLayout from '@/layout/SubViewLayout.vue'
import { Tool, Protect, Remind, LinkThree, User } from '@icon-park/vue-next'

const menus = [
  {
    name: '个人中心',
    path: '/settings/detail',
    icon: User
  },
  {
    name: '安全设置',
    path: '/settings/security',
    icon: Protect
  },
  {
    name: '个性设置',
    path: '/settings/personalize',
    icon: Tool
  },
  {
    name: '绑定设置',
    path: '/settings/binding',
    icon: LinkThree
  },
  {
    name: '通知设置',
    path: '/settings/notification',
    icon: Remind
  }
]
</script>

<template>
  <SubViewLayout title="我的设置" :menus="menus" />
</template>
