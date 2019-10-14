<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: "App",
  };
</script>

<style>
  #app {
    width: 100%;
    height: 100%;
    background: url('//res.wx.qq.com/a/wx_fed/webwx/res/static/img/2zrdI1g.jpg') no-repeat;
    overflow: hidden;
    background-size: 100% 100%;
  }
</style>
