<template>
  <div class="body-bag" :class="themeBagImg">
    <el-container class="main-layout" :class="{ 'full-mode': themeMode }">
      <el-aside width="70px" class="side-edge">
        <el-container class="full-height">
          <el-header height="100px" class="logo-header">
            <div class="userlogo" v-popover:usercard>
              <img :src="userAvatar" :onerror="detaultAvatar" />
            </div>
            <p class="user-status">
              <span v-if="socketStatus" class="online">在线</span>
              <span v-else>连接中...</span>
            </p>
          </el-header>
          <el-main class="sidebar-menu">
            <el-tooltip
              content="我的消息"
              placement="right"
              :visible-arrow="false"
            >
              <router-link to="/message">
                <div class="menu-items" :class="{ active: idx == 0 }">
                  <i class="el-icon-chat-line-round" />
                  <span v-show="unreadNum" class="notify"></span>
                </div>
              </router-link>
            </el-tooltip>

            <el-tooltip
              content="我的联系人"
              placement="right"
              :visible-arrow="false"
            >
              <router-link to="/contacts">
                <div class="menu-items" :class="{ active: idx == 1 }">
                  <i class="el-icon-user-solid" />
                  <span v-show="applyNum" class="notify"></span>
                </div>
              </router-link>
            </el-tooltip>

            <el-tooltip
              content="我的笔记"
              placement="right"
              :visible-arrow="false"
            >
              <router-link to="/note">
                <div class="menu-items" :class="{ active: idx == 2 }">
                  <i class="el-icon-notebook-1" />
                </div>
              </router-link>
            </el-tooltip>

            <el-tooltip
              content="我的设置"
              placement="right"
              :visible-arrow="false"
            >
              <router-link to="/settings">
                <div class="menu-items" :class="{ active: idx == 3 }">
                  <i class="el-icon-setting" />
                </div>
              </router-link>
            </el-tooltip>

            <el-tooltip
              content="Gitub 源码"
              placement="right"
              :visible-arrow="false"
            >
              <a target="_blank" href="https://github.com/gzydong/LumenIM">
                <div class="menu-items">
                  <i class="iconfont icon-github" />
                </div>
              </a>
            </el-tooltip>
          </el-main>
          <el-footer height="60px" class="fixed-sidebar">
            <div class="menu-items" @click="logout">
              <span class="logout">退出</span>
            </div>
          </el-footer>
        </el-container>
      </el-aside>

      <el-main class="no-padding" style="background: white">
        <slot name="container"></slot>
      </el-main>
    </el-container>

    <!-- 用户卡片 -->
    <el-popover
      ref="usercard"
      trigger="hover"
      placement="right-start"
      popper-class="no-padding"
      :visible-arrow="false"
    >
      <AccountCard />
    </el-popover>

    <!-- 语音消息提示 -->
    <audio id="audio" preload="auto">
      <source src="@/assets/image/1701.mp3" type="audio/mp3" />
    </audio>

    <!-- 打赏组件(自行删除) -->
    <RewardModule />

    <!-- 广告组件(自行删除) -->
    <AbsModule />
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import AccountCard from '@/components/user/AccountCard'
import RewardModule from '@/components/layout/RewardModule'
import AbsModule from '@/components/layout/AbsModule'
import { ServeFindFriendApplyNum } from '@/api/contacts'

export default {
  name: 'MainLayout',
  components: {
    AccountCard,
    RewardModule,
    AbsModule,
  },
  props: {
    idx: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    ...mapState({
      userAvatar: state => state.user.avatar,
      detaultAvatar: state => state.detaultAvatar,
      socketStatus: state => state.socketStatus,
      applyNum: state => state.notify.applyNum,
      notifyCueTone: state => state.settings.notifyCueTone,
      themeMode: state => state.settings.themeMode,
      themeBagImg: state => state.settings.themeBagImg,
    }),
    ...mapGetters(['unreadNum']),
  },
  watch: {
    unreadNum(n, o) {
      if (n > 0 && n > o && this.notifyCueTone) {
        this.play()
      }
    },
  },
  created() {
    this.setApplyNum()
  },
  methods: {
    play() {
      document.querySelector('#audio').play()
    },
    logout() {
      this.$store.dispatch('ACT_USER_LOGOUT')
    },
    setApplyNum() {
      ServeFindFriendApplyNum().then(res => {
        if (res.code == 200 && res.data.unread_num > 0) {
          this.$store.commit('INCR_APPLY_NUM')
        }
      })
    },
  },
}
</script>
<style lang="less">
.main-layout {
  position: fixed;
  width: 75%;
  height: 80%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  overflow: hidden;
  transition: ease 0.5s;
  border-radius: 10px;

  &.full-mode {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  .side-edge {
    user-select: none;
    background-color: #202225;

    .logo-header {
      padding: 0;
      .userlogo {
        width: 50px;
        height: 50px;
        margin: 10px auto 0;
        border-radius: 50%;
        position: relative;
        cursor: pointer;
        overflow: hidden;
        transition: ease-in 3s;

        img {
          width: 100%;
          height: 100%;
        }

        &:hover {
          transform: rotate(360deg);
        }
      }

      .user-status {
        text-align: center;
        margin-top: 10px;
        color: #ccc9c9;
        font-size: 13px;
        font-weight: 300;
        .online {
          color: #0d710d;
        }
      }
    }
  }

  .sidebar-menu {
    width: 60px;
    margin: 0 auto;
    text-align: center;
    padding: 0;
    overflow: hidden;

    a {
      text-decoration: none;
    }

    .menu-items {
      cursor: pointer;
      color: #706d6d;
      position: relative;
      width: 45px;
      height: 45px;
      margin: 6px auto 0;
      line-height: 45px;
      text-align: center;

      i {
        font-size: 20px;

        &:hover {
          transform: scale(1.3);
        }
      }

      .notify {
        width: 5px;
        height: 5px;
        background: #ff1e1e;
        display: inline-block;
        border-radius: 5px;
        position: absolute;
        right: 5px;
        top: 9px;
        animation: notifymove 3s infinite;
        animation-direction: alternate;
        -webkit-animation: notifymove 3s infinite;
      }

      &.active {
        color: #416641 !important;
      }
    }
  }
}

.fixed-sidebar {
  padding: 0;
  .menu-items {
    height: 25px;
    line-height: 25px;
    padding: 10px 5px;
    cursor: pointer;
    box-shadow: 0 0 0 0 #ccc9c9;
    text-align: center;
    color: #afabab;

    i {
      font-size: 20px;
    }

    .logout {
      font-weight: 300;
      font-size: 15px;
      color: #9e9e9e;
      transition: ease 0.5;
      &:hover {
        font-size: 16px;
      }
    }
  }
}

/* 主题背景图片 */
.body-bag {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
  background-color: #121212;
  transition: ease-in 0.5s;

  &.bag001 {
    background: url(~@/assets/image/background/001.jpg);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  &.bag002 {
    background: url(~@/assets/image/background/002.jpg);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  &.bag003 {
    background: url(~@/assets/image/background/003.jpg);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  &.bag004 {
    background: url(~@/assets/image/background/005.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}

@keyframes notifymove {
  0% {
    background: #ff1e1e;
  }

  25% {
    background: #2e3238;
  }

  50% {
    background: #ff1e1e;
  }

  75% {
    background: #2e3238;
  }

  100% {
    background: #ff1e1e;
  }
}

@-webkit-keyframes notifymove {
  0% {
    background: #ff1e1e;
  }

  25% {
    background: #2e3238;
  }

  50% {
    background: #ff1e1e;
  }

  75% {
    background: #2e3238;
  }

  100% {
    background: #ff1e1e;
  }
}

@media screen and (max-width: 1000px) {
  .main-layout {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
}
</style>
