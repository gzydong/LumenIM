<template>
  <div>
    <MainLayout :idx="3">
      <el-container slot="container" class="container">
        <el-header height="60px" class="header no-select">个人设置</el-header>
        <el-container class="full-height">
          <el-aside width="180px" class="aside no-select">
            <router-link
              v-for="(menu, key) in menus"
              :to="menu.path"
              :key="key"
            >
              <div
                class="menu-list pointer"
                :class="{
                  selectd: $route.path == menu.path,
                }"
                v-text="menu.name"
              />
            </router-link>
          </el-aside>
          <el-main>
            <router-view />
          </el-main>
        </el-container>
      </el-container>
    </MainLayout>
  </div>
</template>
<script>
import MainLayout from '@/views/layout/MainLayout'
export default {
  name: 'SettingsPage',
  components: {
    MainLayout,
  },
  data() {
    return {
      menus: [
        {
          name: '个人信息',
          path: '/settings/detail',
        },
        {
          name: '安全设置',
          path: '/settings/security',
        },
        {
          name: '个性化',
          path: '/settings/personalize',
        },
        {
          name: '账户绑定',
          path: '/settings/binding',
        },
        {
          name: '消息通知',
          path: '/settings/notification',
        },
      ],
    }
  },
}
</script>
<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  overflow: hidden;

  .header {
    line-height: 60px;
    border-bottom: 1px solid #f5f5f5;
  }

  .aside {
    display: flex;
    flex-direction: column;
    padding: 8px;
    background-color: #f0f2f5;

    a {
      text-decoration: none;
      color: rgba(0, 0, 0, 0.65);
    }

    .menu-list {
      height: 35px;
      line-height: 35px;
      padding-left: 25px;
      font-weight: 400;
      font-size: 13px;
      background-color: white;
      border-left: 3px solid white;
      border-radius: 5px;
      margin: 4px 2px;
      transition: ease 0.5s;

      &:hover {
        color: rgb(24, 144, 255);
      }

      &.selectd {
        border-left-color: #2196f3;
        color: #2196f3;
      }
    }
  }
}
</style>
