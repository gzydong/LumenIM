<script lang="ts" setup>
import { isElectronMode } from '@/utils/electron.ts'
import Menu from './component/Menu.vue'
import Sponsor from './component/Sponsor.vue'
</script>

<template>
  <section class="el-container is-vertical im-container">
    <!-- <header class="el-header border-bottom flex" style="height: 50px; align-items: center">
      <div style="font-size: 18px">LumenIM</div>
    </header> -->
    <main class="el-main">
      <section class="el-container">
        <aside :class="{ pd20: isElectronMode() }" class="el-aside app-drag border-right">
          <Menu />
        </aside>
        <main class="el-main">
          <router-view />
        </main>
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
    box-sizing: border-box;

    &.pd20 {
      padding-top: 20px;
    }
  }
}

html[theme-mode='dark'] {
  .im-container {
    background-color: unset;
  }
}
</style>
