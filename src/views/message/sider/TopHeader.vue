<script lang="ts" setup>
import type { ISession } from '@/types/chat'

const emit = defineEmits(['tab-talk'])

defineProps<{
  indexName: String
  items: ISession[]
}>()
</script>

<template>
  <header class="el-header top-header">
    <n-popover v-for="item in items" :key="item.index_name" placement="bottom" trigger="hover">
      <template #trigger>
        <div
          class="top-item pointer"
          :class="{
            active: item.index_name == indexName
          }"
          @click="emit('tab-talk', item)"
        >
          <im-avatar :src="item.avatar" :size="34" :username="item.name" />

          <span class="icon-mark robot" v-show="item.is_robot === 1"> 助 </span>

          <span class="icon-mark group" v-show="item.talk_mode == 2"> 群 </span>

          <span class="text">{{ item.remark || item.name }}</span>
        </div>
      </template>
      <span> {{ item.remark || item.name }} </span>
    </n-popover>
  </header>
</template>

<style lang="less" scoped>
.top-header {
  padding: 5px 8px;
  padding-right: 0;
  padding-right: 8px;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  grid-gap: 0 14px;
  grid-template-columns: repeat(auto-fill, 32px);
  display: grid;
  box-sizing: border-box;

  .top-item {
    flex-basis: 46px;
    flex-shrink: 0;
    height: 56px;
    margin: 3px 2px 3px 2px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;

    .icon-mark {
      position: absolute;
      height: 25px;
      width: 25px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      right: -12px;
      bottom: 15px;
      transform: scale(0.6);
      border-radius: 50%;

      &.group {
        color: #3370ff;
        background-color: #e1eaff;
      }

      &.robot {
        color: #dc9b04 !important;
        background-color: #faf1d1 !important;
      }
    }
    &.active {
      .text {
        color: rgb(80 138 254);
      }
    }

    .text {
      display: inline-block;
      height: 20px;
      font-size: 12px;
      transform: scale(0.9);
      text-align: center;
      line-height: 20px;
      word-break: break-all;
      overflow: hidden;
    }
  }
}
</style>
