<script setup>
import { ref } from 'vue'
import { NTabs, NTab } from 'naive-ui'
import { Search } from '@icon-park/vue-next'
import FriendApply from './inner/FriendApply.vue'
import GroupApply from './inner/GroupApply.vue'

const tabIndex = ref('friend')

const components = {
  friend: FriendApply,
  group: GroupApply,
}
</script>

<template>
  <section class="el-container is-vertical height100">
    <header class="el-header header bdr-b">
      <n-tabs v-model:value="tabIndex">
        <n-tab name="friend"> 好友申请 </n-tab>
        <n-tab name="group"> 入群申请 </n-tab>
      </n-tabs>

      <!-- <n-input placeholder="搜索" clearable style="max-width: 200px" round>
        <template #prefix>
          <n-icon :component="Search" />
        </template>
      </n-input> -->
    </header>

    <main class="el-main me-scrollbar me-scrollbar-thumb">
      <component :is="components[tabIndex]" />
    </main>
  </section>
</template>

<style lang="less" scoped>
.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
}
</style>
