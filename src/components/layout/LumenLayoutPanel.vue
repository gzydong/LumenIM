<template>
  <div id="luem-layout-panel">
    <div v-if="subarea" class="luem-panel-lcolumn">
      <slot name="lcolumn"></slot>
    </div>
    <div class="luem-panel-rcolumn" :class="{'luem-panel-cover':!subarea}">
      <slot name="rcolumn"></slot>
    </div>
    <div style="clear: both;"></div>
  </div>
</template>

<script>
  export default {
    name: "luem-layout-panel",
    props: {
      subarea: {
        type: Boolean, //是否分栏
        default: false
      }
    }
  };
</script>

<style scoped>
  #luem-layout-panel {
    width: 100%;
    height: 100%;
  }

  #luem-layout-panel .luem-panel-cover {
    width: 100% !important;
  }

  #luem-layout-panel .luem-panel-lcolumn {
    float: left;
    width: 250px;
    height: 100%;
    background: #f0efef;
  }

  #luem-layout-panel .luem-panel-rcolumn {
    float: left;
    width: calc(100% - 250px);
    width: -moz-calc(100% - 250px);
    width: -webkit-calc(100% - 250px);
    height: 100%;
    background: #f5f5f5;
  }
</style>
