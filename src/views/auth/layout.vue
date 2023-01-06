<script setup></script>

<template>
  <div id="logo-name">Lumen IM</div>

  <section class="section">
    <router-view />
  </section>

  <div class="copyright">
    <span>©2020 - 2022 Lumen IM 在线聊天</span>
    <span><a href="http://beian.miit.gov.cn" target="_blank">黔ICP备20006767号</a></span>
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
.section {
  position: fixed;
  height: 100%;
  width: 100%;
}

@import '@/assets/css/login.less';
</style>
