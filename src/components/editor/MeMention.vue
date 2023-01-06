<script setup>
import { useEditorStore } from '@/store/editor'
import { ArrowBackCircleOutline } from '@vicons/ionicons5'
import { defAvatar } from '@/constant/default'

const emit = defineEmits(['on-select', 'on-close'])

const editorStore = useEditorStore()
</script>

<template>
  <section class="el-container is-vertical height100 bdr-r">
    <header class="el-header bdr-t bdr-b" style="height: 38px">
      <span>提及列表({{ editorStore.mention.items.length - 1 }})</span>
      <n-icon
        :size="20"
        class="pointer"
        :component="ArrowBackCircleOutline"
        @click="emit('on-close')"
      />
    </header>
    <main
      class="el-main mention-items me-scrollbar"
      id="mention-items-container"
    >
      <div
        class="item"
        v-for="item in editorStore.mention.items"
        :key="item.id"
        @click="emit('on-select', item.id, item.name)"
      >
        <n-avatar
          round
          :size="18"
          :src="item.avatar"
          :fallback-src="defAvatar"
          lazy
          :intersection-observer-options="{
            root: '#mention-items-container',
          }"
          v-show="item.id"
          class="icon"
        />
        <span class="name text-ellipsis">{{ item.name }}</span>
      </div>
    </main>
  </section>
</template>

<style lang="less" scoped>
.el-container {
  width: 150px;

  .el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5px;
    background: #f5f5f5;
  }
}

.mention-items {
  height: inherit;

  .item {
    height: 30px;
    margin: 5px;
    cursor: pointer;
    border: 1px solid #e2e2e2;
    border-radius: 5px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    user-select: none;

    .icon {
      margin-right: 10px;
    }

    .name {
      width: 90px;
    }

    &:hover {
      border-color: rgb(80 138 254);
      color: rgb(80 138 254);
    }
  }
}
</style>
