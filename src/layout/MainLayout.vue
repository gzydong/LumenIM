<script lang="ts" setup>
import Menu from './component/Menu.vue'
import Sponsor from './component/Sponsor.vue'
import { useSettingsStore } from '@/store'
import { isElectronMode } from '@/utils/common'

const settingsStore = useSettingsStore()
</script>

<template>
  <section class="container flex-center">
    <section
      class="el-container im-container"
      :class="{
        'small-screen': !settingsStore.isFullScreen
      }"
    >
      <aside
        class="el-aside"
        :class="{
          'pd-t15': isElectronMode()
        }"
      >
        <Menu />
      </aside>
      <main class="el-main">
        <router-view />
      </main>
    </section>
  </section>

  <Sponsor />
</template>
<style lang="less" scoped>
.container {
  height: 100vh;
  width: 100vw;
  background: url(@/assets/image/background.jpeg);
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;

  .im-container {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background-color: #fff;

    .el-aside {
      width: 65px;
      box-shadow: 2px 0 8px 0 var(--im-broadside-box-shadow);
    }

    &.small-screen {
      position: fixed;
      width: 1000px;
      height: 650px;
      border-radius: 10px;
      transition: all 0.5s;
    }
  }
}

html[theme-mode='dark'] {
  .container {
    background: unset;

    .im-container {
      background-color: unset;
    }
  }

  .small-screen {
    border: 1px solid #494949;
  }
}
</style>
