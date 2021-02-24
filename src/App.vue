<template>
  <div id="app">
    <router-view v-if="showView" />
  </div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      // 用于点击当前页的router时，刷新当前页
      showView: true,
    };
  },
  methods: {
    // 刷新当前路由方法
    refreshView() {
      this.showView = false;
      this.$nextTick(() => (this.showView = true));
    },
  },
};
</script>