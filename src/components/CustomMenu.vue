<template>
  <!-- 定义递归渲染菜单项 -->
  <ul v-if="menu?.length">
    <li v-for="(item, index) in menu" :key="index">
      <div class="menu-item">
        <span v-if="item.icon" :class="`icon ${item.icon}`"></span>
        <span v-if="!item.isShowInput">{{ item.name }}</span>
        <input v-else type="text" placeholder="请输入..." :value="item.name" />
        <span v-if="item.isNewNode" class="new-node-label">New Node</span>

        <!-- 如果存在子菜单，递归渲染 -->
        <custom-menu v-if="item.children" :menu="item.children"></custom-menu>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// 引入并使用您提供的Menu接口
interface Menu {
  name: string
  icon?: string
  isShowInput?: boolean
  isNewNode?: boolean
  children?: Menu[]
}

export default defineComponent({
  name: 'CustomMenu',
  props: {
    menu: {
      type: Array as () => Menu[],
      required: true
    }
  }
})
</script>

<style scoped>
/* 添加必要的CSS样式以美化菜单组件 */
.icon {
  /* 根据实际图标库调整样式 */
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: middle;
}

.menu-item {
  /* display: flex; */
}

.new-node-label {
  font-weight: bold;
  color: #007bff; /* 可根据实际情况调整颜色 */
}

ul {
  width: 100%;
}
</style>
