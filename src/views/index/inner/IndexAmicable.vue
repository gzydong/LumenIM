<template>
  <div class="amicable flex-center">
    <div class="content">
      <img src="@/assets/image/welcome.svg" alt="" />
      <p>LumenIM 欢迎您 (*^__^*)</p>
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
    text-align: center;
    color: #ccc;
    margin-top: -10%;
    font-size: 18px;
    font-weight: 300;
  }
}
</style>
