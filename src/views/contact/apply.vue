<script lang="ts" setup>
import { ref } from 'vue'
import { NTabs, NTab } from 'naive-ui'
import FriendApply from './inner/FriendApply.vue'
import GroupApply from './inner/GroupApply.vue'

const tabIndex = ref('friend')

const components = {
  friend: FriendApply,
  group: GroupApply
}
</script>

<template>
  <section class="el-container is-vertical height100">
    <header class="el-header me-view-header bdr-b">
      <n-tabs v-model:value="tabIndex">
        <n-tab name="friend"> 好友申请 </n-tab>
        <n-tab name="group"> 入群申请 </n-tab>
      </n-tabs>
    </header>

    <main class="el-main me-scrollbar me-scrollbar-thumb">
      <component :is="components[tabIndex]" />
    </main>
  </section>
</template>

<style lang="less" scoped></style>
