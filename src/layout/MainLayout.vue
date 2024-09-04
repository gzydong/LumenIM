<script lang="ts" setup>
import Menu from './component/Menu.vue'
import Sponsor from './component/Sponsor.vue'
import { isElectronMode } from '@/utils/electron'

const isElectron = isElectronMode()
</script>

<template>
  <section class="el-container is-vertical im-container">
    <header v-if="isElectron" class="el-header app-header flex-center app-drag">
      LumenIM 在线聊天
    </header>
    <main class="el-main">
      <section class="el-container">
        <aside class="el-aside"><Menu></Menu></aside>
        <main class="el-main"><router-view /></main>
      </section>
    </main>
  </section>

  <Sponsor />
</template>
<style lang="less" scoped>
.im-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #ffffff;

  .app-header {
    height: 28px;
    background-color: #1890ff;
    color: #ffffff;
    font-size: 13px;
    cursor: pointer;
    user-select: none;
  }

  .el-aside {
    width: 60px;
    box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
  }
}

html[theme-mode='dark'] {
  .im-container {
    background-color: unset;

    .app-header {
      background-color: #383838;
      color: #9d9696;
    }

    .el-aside {
      background-color: rgba(255, 255, 255, 0.05);
      box-shadow: unset;
    }
  }
}
</style>
