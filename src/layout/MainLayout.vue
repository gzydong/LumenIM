<script lang="ts" setup>
import Menu from './component/Menu.vue'
import Sponsor from './component/Sponsor.vue'
import { isElectronMode } from '@/utils/electron.ts'
</script>

<template>
  <section class="el-container is-vertical im-container">
    <main class="el-main">
      <section class="el-container">
        <aside class="el-aside" :class="{ pd20: isElectronMode() }"><Menu></Menu></aside>
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

  .el-aside {
    width: 60px;
    box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
    box-sizing: border-box;
    -webkit-app-region: drag;

    &.pd20 {
      padding-top: 20px;
    }
  }
}

html[theme-mode='dark'] {
  .im-container {
    background-color: unset;

    .el-aside {
      background-color: rgba(255, 255, 255, 0.05);
      box-shadow: unset;
    }
  }
}
</style>
