<template>
  <div>
    <el-dialog
      title="位置定位"
      :visible="true"
      :show-close="true"
      :append-to-body="true"
    >
      <baidu-map class="bm-view" @ready="handler" :center="center" :zoom="zoom">
        <bm-geolocation
          anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
          :showAddressBar="true"
          :autoLocation="true"
        ></bm-geolocation>
      </baidu-map>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MeEditorLocation',
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 0,
    }
  },
  computed: {},
  watch: {},
  methods: {
    handler({ BMap, map }) {
      this.zoom = 17

      var geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(
        r => {
          console.log(r)
          this.center = { lng: r.longitude, lat: r.latitude } // 设置center属性值
          this.autoLocationPoint = { lng: r.longitude, lat: r.latitude } // 自定义覆盖物
          this.initLocation = true
        },
        { enableHighAccuracy: true }
      )
    },
  },
  created() {},
}
</script>
<style lang="less" scoped>
.bm-view {
  width: 100%;
  height: 300px;

  /deep/.anchorBL {
    display: none;
  }
  /deep/.BMap_cpyCtrl {
    display: none;
  }
}
</style>
