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
        showView: true // 用于点击当前页的router时，刷新当前页
      }
    },
    methods: {
      // 刷新当前路由方法
      refreshView() {
        this.showView = false // 通过v-if移除router-view节点
        this.$nextTick(() => {
          this.showView = true // DOM更新后再通过v-if添加router-view节点
        });
      }
    }
  };

</script>
