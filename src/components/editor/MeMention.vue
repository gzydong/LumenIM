<script setup>
import { ref, onUnmounted } from 'vue'
import { useEditorStore } from '@/store/editor'
import { ArrowCircleLeft } from '@icon-park/vue-next'
import { defAvatar } from '@/constant/default'
const emit = defineEmits(['on-select', 'on-close'])

const index = ref(-1)

function callBack(e) {
  if (e.keyCode == 38 || e.keyCode == 40) {
    if (e.keyCode == 38) {
      if (index.value > 0) {
        index.value--
      }
    } else {
      if (index.value < editorStore.mention.items.length - 1) {
        index.value++
      }
    }

    window.document.getElementById('mention-items-container').scrollTop =
      index.value * 32
  } else if (e.keyCode == 13) {
    const item = editorStore.mention.items[index.value]
    editorStore.mention.isShow = false
    emit('on-select', item.id, item.name)
    return e.preventDefault()
  }
}

window.addEventListener('keyup', callBack)

onUnmounted(() => {
  window.removeEventListener('keyup', callBack)
})

const editorStore = useEditorStore()
</script>

<template>
  <section class="el-container is-vertical height100 bdr-r">
    <header class="el-header bdr-t bdr-b" style="height: 38px">
      <span>提及列表({{ editorStore.mention.items.length - 1 }})</span>
      <n-icon
        :size="20"
        class="pointer"
        :component="ArrowCircleLeft"
        @click="emit('on-close')"
      />
    </header>
    <main
      class="el-main mention-items me-scrollbar"
      id="mention-items-container"
    >
      <div
        class="item"
        v-for="(item, i) in editorStore.mention.items"
        :key="item.id"
        :class="{
          selectd: i == index,
        }"
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

    &.selectd {
      border-color: rgb(80 138 254);
      color: rgb(80 138 254);
    }
  }
}
</style>
