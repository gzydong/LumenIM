<template>
  <div>
    <main-layout :idx="3">
      <el-container slot="container" class="container hv100 ov-hidden">
        <el-header height="60px" class="header no-select">个人设置</el-header>
        <el-container class="hv100">
          <el-aside width="200px" class="aside no-select">
            <router-link to="/settings/base">
              <div class="menu-list" :class="{'menu-list-selectd':$route.path == '/settings/base'}">个人信息</div>
            </router-link>
            <router-link to="/settings/security">
              <div class="menu-list" :class="{'menu-list-selectd':$route.path == '/settings/security'}">安全设置</div>
            </router-link>
            <router-link to="/settings/personalize">
              <div class="menu-list" :class="{'menu-list-selectd':$route.path == '/settings/personalize'}">个性化</div>
            </router-link>
            <router-link to="/settings/binding">
              <div class="menu-list" :class="{'menu-list-selectd':$route.path == '/settings/binding'}">账户绑定</div>
            </router-link>
            <router-link to="/settings/notification">
              <div class="menu-list" :class="{'menu-list-selectd':$route.path == '/settings/notification'}">消息通知</div>
            </router-link>
          </el-aside>
          <el-main>
            <!-- 渲染子路由 -->
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </main-layout>
  </div>
</template>

<script>
  import MainLayout from "@/views/layout/MainLayout";
  export default {
    name: 'contacts-page',
    components: {
      MainLayout
    }
  };

</script>
<style scoped>
  .container {
    height: 100%;
    width: 100%;
  }

  .container .header {
    line-height: 60px;
    border-bottom: 1px solid #f5f5f5;
  }

  .container .aside {
    border-right: 1px solid #f5f5f5;
    background-color: #f0f2f5;
    display: flex;
    flex-direction: column;
    padding: 8px;
  }

  .aside a {
    text-decoration: none;
    color: rgba(0, 0, 0, .65);
  }

  .menu-list {
    height: 35px;
    line-height: 35px;
    margin: 4px 2px;
    padding-left: 25px;
    font-weight: 400;
    font-size: 13px;
    background-color: white;
    cursor: pointer;
    transition: ease .2s;
  }

  .menu-list-selectd {
    background: #2196F3;
    color: white !important;
  }

  .menu-list:hover {
    color: rgb(24, 144, 255);
  }

</style>
