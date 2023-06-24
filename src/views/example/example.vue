<template>
  <div>
    <!-- <Draggable
      class="draggable-ul"
      animation="300"
      :list="demandList"
      itemKey="name"
    >
      <template #item="{ element }">
        <div class="cursor-move draggable-li">
          <span class="ml-2">{{ element.name }}</span>
        </div>
      </template>
    </Draggable> -->

    <div class="ids" v-loading="true"></div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import Draggable from 'vuedraggable'

const demandList = reactive([
  { name: '预约表单页面，能填写预约相关信息', id: 1 },
  { name: '促销活动页面，包含促销广告展示', id: 2 },
  { name: '商品列表，需要一个到货提醒功能', id: 3 },
  { name: '商品需要一个评价功能', id: 4 },
  { name: '商品图片需要提供放大镜', id: 5 },
  { name: '订单需要提供删除到回收站', id: 6 },
  { name: '用户头像上传，需要支持裁剪', id: 7 },
  { name: '据说Vue3.2发布了，setup啥时候支持？', id: 8 },
])
</script>

<style lang="less" scoped>
.ids {
  width: 300px;
  height: 300px;
}

.draggable-ul {
  width: 100%;
  overflow: hidden;
  margin-top: -16px;

  .draggable-li {
    width: 100%;
    padding: 16px 10px;
    color: #333;
    border-bottom: 1px solid #efeff5;
  }
}
</style>
