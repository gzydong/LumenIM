<script setup>
import Menu from './component/Menu.vue'
import Sponsor from './component/Sponsor.vue'
import { useNotifyStore } from '@/store/notify'
import { isElectronMode } from '@/utils/common'

const notifyStore = useNotifyStore()

defineProps({
  index: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <section class="container flex-center">
    <section
      class="el-container im-container"
      :class="{
        'small-screen': !notifyStore.isFullScreen,
      }"
    >
      <aside
        class="el-aside"
        :class="{
          'pd-t15': isElectronMode(),
        }"
      >
        <Menu :index="index" />
      </aside>
      <main class="el-main">
        <slot></slot>
      </main>
    </section>
  </section>

  <Sponsor />
</template>
<style lang="less" scoped>
.container {
  height: 100vh;
  width: 100vw;
  background: url(@/assets/image/iTab-exSKJMg-_vI.jpeg);
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;

  .im-container {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background-color: #ffffff;

    .el-aside {
      width: 70px;
      // background-color: #001427;
      // background-color: #efefef;
      box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
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
</style>
