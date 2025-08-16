<script lang="ts" setup>
import Menu from './component/Menu.vue'
import Sponsor from './component/Sponsor.vue'
import { isElectronMode } from '@/utils/electron.ts'
</script>

<template>
  <section class="el-container is-vertical im-container">
    <main class="el-main">
      <section class="el-container">
        <aside :class="{ pd20: isElectronMode() }" class="el-aside app-drag">
          <Menu></Menu>
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

    .el-aside {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
}
</style>
