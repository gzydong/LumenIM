<script lang="ts" setup>
import { markRaw, Component } from 'vue'

interface Menu {
  name: string
  path: string
  icon: Component
  iconBgColor?: string
  show?: boolean
  size?: string
  tips?: string
}

defineProps<{
  title: string
  menus: Menu[]
}>()
</script>

<template>
  <section class="el-container is-vertical section">
    <header class="el-header border-bottom">{{ title }}</header>
    <section class="el-container o-hidden">
      <aside class="el-aside border-right">
        <router-link v-for="(menu, key) in menus" :to="menu.path" :key="key">
          <div
            v-if="menu.show !== false"
            class="menu pointer"
            :class="{
              selectd: $route.path == menu.path
            }"
          >
            <div class="icon">
              <n-icon :size="menu.size || 16" :component="markRaw(menu.icon)" />
            </div>

            <div class="name">
              {{ menu.name || '' }}
            </div>

            <div class="tips" v-if="menu.tips">
              <span class="badge">{{ menu.tips }}</span>
            </div>
          </div>
        </router-link>
      </aside>
      <main class="el-main router-view">
        <router-view />
      </main>
    </section>
  </section>
</template>

<style lang="less" scoped>
.section {
  height: 100%;

  .el-header {
    height: 60px;
    line-height: 60px;
    padding-left: 15px;
    font-size: 18px;
    -webkit-app-region: drag;
  }

  .el-aside {
    width: 180px;
    padding: 8px;
    padding-top: 3px;

    a {
      text-decoration: none;
      color: var(--im-text-color);
    }

    .menu {
      height: 36px;
      padding: 0 5px;
      font-size: 14px;
      border-radius: 5px;
      margin: 6px 0px;
      display: flex;
      align-items: center;
      color: var(--im-text-color);
      padding-left: 10px;

      > div {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .icon {
        width: 26px;
        height: 26px;
      }

      .name {
        flex: auto;
        justify-content: flex-start;
      }

      .tips {
        width: 30px;

        .badge {
          background-color: #ff4d4f;
          color: white;
        }
      }

      &:hover,
      &.selectd {
        background-color: var(--im-hover-bg-color);
      }
    }
  }
}
</style>
