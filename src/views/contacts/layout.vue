<template>
  <div>
    <MainLayout :idx="1">
      <el-container slot="container" class="full-height">
        <!-- 左侧侧边栏 -->
        <el-aside width="250px" class="aside-box">
          <el-container class="full-height" direction="vertical">
            <!-- 搜索栏 -->
            <el-header height="60px" class="no-padding header">
              <div class="from">
                <el-input
                  v-model="input"
                  prefix-icon="el-icon-search"
                  placeholder="搜索好友 / 群组"
                  size="small"
                />
              </div>

              <!-- 工具栏 -->
              <div class="tools" v-outside="closeSubMenu">
                <el-button
                  icon="el-icon-plus"
                  circle
                  plain
                  size="small"
                  @click="submenu = !submenu"
                />

                <transition name="el-zoom-in-top">
                  <div class="tools-menu" v-show="submenu">
                    <div class="menu1-item" @click="triggerSubMenu(1)">
                      创建群组
                    </div>
                    <div class="menu1-item" @click="triggerSubMenu(2)">
                      添加好友
                    </div>
                  </div>
                </transition>
              </div>
            </el-header>

            <!-- 对话列表栏 -->
            <el-main class="no-padding no-select">
              <router-link
                v-for="(menu, index) in menus"
                :to="menu.path"
                :key="index"
              >
                <div
                  class="menu-list"
                  :class="{
                    selectd: $route.path == menu.path,
                  }"
                  v-text="menu.name"
                />
              </router-link>
            </el-main>
          </el-container>
        </el-aside>

        <!-- 聊天面板容器 -->
        <el-main class="no-padding ov-hidden">
          <router-view />
        </el-main>
      </el-container>
    </MainLayout>

    <!-- 创建群聊组件 -->
    <GroupLaunch
      v-if="launchGroupShow"
      @close="launchGroupShow = false"
      @create-success="launchSuccess"
    />

    <!-- 用户查询 -->
    <UserSearch ref="searchUsers" />
  </div>
</template>
<script>
import MainLayout from '@/views/layout/MainLayout'
import GroupLaunch from '@/components/group/GroupLaunch'
import UserSearch from '@/components/user/UserSearch'
import { toTalk } from '@/utils/talk'

export default {
  name: 'ContactsPage',
  components: {
    MainLayout,
    GroupLaunch,
    UserSearch,
  },
  data() {
    return {
      launchGroupShow: false,

      // 查询关键词
      input: '',

      submenu: false,
      menus: [
        {
          name: '新的联系人',
          path: '/contacts/apply',
        },
        {
          name: '我的好友',
          path: '/contacts/friends',
        },
        {
          name: '我的群组',
          path: '/contacts/groups',
        },
      ],
    }
  },
  methods: {
    // header 功能栏隐藏事件
    closeSubMenu() {
      this.submenu = false
    },

    // 工具栏事件
    triggerSubMenu(type) {
      this.closeSubMenu()
      if (type == 1) {
        this.launchGroupShow = true
      } else {
        this.$refs.searchUsers.open()
      }
    },

    // 发起群聊回调事件
    launchSuccess(data) {
      toTalk(2, data.group_id)
    },
  },
}
</script>
<style scoped lang="less">
.menu-list {
  height: 42px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  cursor: pointer;
  border-left: 3px solid white;
  position: relative;
  transition: 0.2s ease-in;
  font-size: 14px;
  color: black;

  &:hover {
    background-color: #eff0f1;
    border-color: #eff0f1;
  }

  &.selectd {
    border-color: #3370ff !important;
    background-color: #eff0f1;
  }
}

@import '~@/assets/css/page/contacts.less';
</style>
