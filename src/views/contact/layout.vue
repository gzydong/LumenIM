<script setup>
import { reactive, computed, markRaw } from 'vue'
import Layout from '@/layout/index.vue'
import SubViewLayout from '@/layout/SubViewLayout.vue'
import { useUserStore } from '@/store/user'
import {
  PeoplesTwo,
  ChartGraph,
  ShareThree,
  PersonalCollection,
} from '@icon-park/vue-next'

const userStore = useUserStore()

const menus = reactive([
  {
    name: '我的好友',
    path: '/contact/friend',
    icon: markRaw(PersonalCollection),
    size: 18,
    tips: computed(() => (userStore.isContactApply ? 'New' : '')),
  },
  {
    name: '我的群组',
    path: '/contact/group',
    icon: markRaw(PeoplesTwo),
    size: 20,
  },
  {
    name: '公开群组',
    path: '/contact/group/open',
    icon: markRaw(ShareThree),
    size: 18,
  },
  {
    name: '组织架构',
    path: '/contact/organize',
    icon: markRaw(ChartGraph),
    show: computed(() => userStore.isQiye),
    size: 18,
  },
])
</script>

<template>
  <Layout :index="1">
    <SubViewLayout title="通信录" :menus="menus" />
  </Layout>
</template>
