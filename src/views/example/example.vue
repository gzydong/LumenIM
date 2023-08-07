<template>
  <RecycleScroller
    class="scroller scroll"
    :items="list"
    :item-size="32"
    :buffer="20"
    key-field="id"
    v-slot="{ item }"
  >
    <div class="item">
      <span>{{ item.title }}</span>
      <span>{{ item.date }}</span>
    </div>
  </RecycleScroller>
</template>
<script setup>
import { ref } from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

let items = []

for (let index = 0; index < 2000; index++) {
  items.push({
    id: index,
    title: index + 'Vue3.0 无缝滚动组件展示数据第1条',
    date: Date.now(),
  })
}

const list = ref(items)
</script>

<style>
.scroll {
  height: 270px;
  width: 500px;
  margin: 100px auto;
  overflow: hidden;
}

.scroll .item {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0;
}
</style>
