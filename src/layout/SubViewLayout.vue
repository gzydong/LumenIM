<script lang="ts" setup>
import { markRaw } from 'vue'

interface Menu {
  name: string
  path: string
  icon: any
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
    <header class="el-header bdr-b">{{ title }}</header>
    <section class="el-container o-hidden">
      <aside class="el-aside bdr-r">
        <router-link v-for="(menu, key) in menus" :to="menu.path" :key="key">
          <div
            v-if="menu.show !== false"
            class="menu pointer"
            :class="{
              selectd: $route.path == menu.path
            }"
          >
            <div class="icon">
              <n-icon :size="menu.size || 15" :component="markRaw(menu.icon)" />
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
      height: 35px;
      padding: 0 5px;
      font-size: 13px;
      border-radius: 5px;
      margin: 8px 2px;
      display: flex;
      align-items: center;
      color: var(--im-text-color);

      > div {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .icon {
        width: 30px;
      }

      .name {
        flex: auto;
        justify-content: flex-start;
        padding-left: 5px;
      }

      .tips {
        width: 30px;

        .badge {
          background-color: #ff4d4f;
          color: white;
        }
      }

      &.selectd {
        background-color: var(--im-hover-bg-color);
        font-weight: 400;
        color: var(--im-primary-color);
      }
    }
  }
}
</style>
