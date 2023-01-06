<script setup>
import IMLayoutMenu from './IMLayoutMenu.vue'
import Sponsor from '@/components/base/Sponsor.vue'
import { useNotifyStore } from '@/store/notify'

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
      <aside class="el-aside" style="width: 60px">
        <IMLayoutMenu :index="index" />
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

    &.small-screen {
      position: fixed;
      width: 70%;
      min-width: 800px;
      height: 650px;
      border-radius: 10px;
      transition: all 0.5s;
    }
  }
}
</style>
