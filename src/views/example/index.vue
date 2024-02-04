<script lang="ts" setup>
import DraggableArea from '@/components/base/DraggableArea2.vue'
</script>

<template>
  <div style="height: 200px; width: 100px; background-color: #ccc"></div>
  <div style="width: 500px; height: 500px; overflow-y: auto; border: 1px solid red">
    <DraggableArea
      elment-key="index"
      closest=".immsg"
      elment=".item"
      strategy="intersect"
      @selected-elements="(selectedElements) => console.log(selectedElements)"
    >
      <div
        v-for="i in 30"
        class="item"
        :key="i"
        style="
          height: 30px;
          width: 100%;
          background-color: #ccc;
          margin-bottom: 30px;
          text-align: center;
        "
        :data-index="i"
      >
        {{ i }}
      </div>
    </DraggableArea>
  </div>
</template>
