<script lang="ts" setup>
import { isElectronMode } from '@/utils/common'
</script>

<template>
  <div id="logo-name" v-if="!isElectronMode()">Lumen IM</div>

  <section class="section">
    <router-view />
  </section>

  <div class="copyright">
    <span>©2020 - 2023 Lumen IM 在线聊天</span>
    <span><a href="http://beian.miit.gov.cn" target="_blank">黔ICP备20006767号-2</a></span>
    <span>Github源码</span>
  </div>

  <div class="fly-box">
    <div class="fly bg-fly-circle1"></div>
    <div class="fly bg-fly-circle2"></div>
    <div class="fly bg-fly-circle3"></div>
    <div class="fly bg-fly-circle4"></div>
  </div>
</template>

<style lang="less" scoped>
body {
  -webkit-app-region: drag;
}
@import '@/assets/css/login.less';

.section {
  height: 100vh;
  width: 100vw;
}
</style>
