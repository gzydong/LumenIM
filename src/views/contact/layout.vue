<script lang="ts" setup>
import SubViewLayout from '@/layout/SubViewLayout.vue'
import { useUserStore } from '@/store'
import { ChartGraph, Mail, People, Peoples, PeoplesTwo } from '@icon-park/vue-next'
import FriendApply from './inner/FriendApply.vue'
import GroupApply from './inner/GroupApply.vue'

const userStore = useUserStore()

const isNew = computed(() => {
  const ok = userStore.isContactApply || userStore.isGroupApply
  return ok
})

const menus = reactive([
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
    name: '企业组织',
    path: '/contact/organize',
    icon: markRaw(ChartGraph),
    show: computed(() => userStore.isQiye)
  }
])
</script>

<template>
  <SubViewLayout title="通讯录" :menus="menus">
    <template #action>
      <n-popover trigger="click">
        <template #trigger>
          <n-badge dot :show="isNew" :offset="[-80, 5]">
            <div class="flex pointer" style="align-items: center; gap: 8px">
              <n-icon :component="Mail" :size="18" />
              <span>好友/群通知</span>
            </div>
          </n-badge>
        </template>

        <n-tabs type="line" justify-content="start" pane-style="height: 500px;width: 350px;">
          <n-tab-pane name="friend" tab="好友通知">
            <n-scrollbar style="height: 100%">
              <FriendApply />
            </n-scrollbar>
          </n-tab-pane>
          <n-tab-pane name="group" tab="入群通知">
            <n-scrollbar style="height: 100%">
              <GroupApply />
            </n-scrollbar>
          </n-tab-pane>
        </n-tabs>
      </n-popover>
    </template>
  </SubViewLayout>
</template>
