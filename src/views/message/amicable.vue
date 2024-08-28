<script lang="ts" setup>
import Welcome from '@/assets/image/welcome.svg'
</script>

<template>
  <div class="amicable flex-center">
    <div class="content">
      <img :src="Welcome" />
      <p>LumenIM 欢迎您(*^__^*)</p>
    </div>
  </div>
</template>

<style lang="less" scoped>
.amicable {
  height: 100%;
  width: 100%;
  -webkit-app-region: drag;

  .content {
    width: 400px;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 18px;
    font-weight: 300;
  }
}
</style>
