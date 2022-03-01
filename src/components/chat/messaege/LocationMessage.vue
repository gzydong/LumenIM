<template>
  <div class="location-message" :class="{ full: full }">
    <baidu-map
      class="bm-view"
      :center="center"
      :zoom="zoom"
      @ready="handler"
    >
    </baidu-map>

    <div class="icon" title="放大/缩放" @click="full = !full">
      <i class="el-icon-zoom-in" v-if="!full"></i>
      <i class="el-icon-zoom-out" v-else></i>
    </div>
  </div>
</template>

<script>

export default {
  name: 'LocationMessage',
  props: {
    lng: 0,
    lat: 0,
  },
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 0,
      full: false,
    }
  },
  methods: {
    handler({ BMap, map }) {
      this.center.lng = this.lng
      this.center.lat = this.lat
      this.zoom = 13
    },
  },
}
</script>
<style lang="less" scoped>
.location-message {
  width: 100%;
  max-width: 300px;
  height: 150px;
  background: rgb(240, 238, 241);
  border-radius: 3px;
  overflow: hidden;
  position: relative;

  &.full {
    max-width: none;
    height: 300px;
  }

  .icon {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 20px;
  }
}

.bm-view {
  width: 100%;
  height: 100%;

  /deep/.anchorBL {
    display: none;
  }
  /deep/.BMap_cpyCtrl {
    display: none;
  }
}
</style>
