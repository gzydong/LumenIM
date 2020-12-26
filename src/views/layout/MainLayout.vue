<template>
  <div class="body-background" :class="themeBagImg">
    <el-container class="mian-layout" :class="{ 'full-mode': themeMode }">
      <el-aside width="70px" class="side-edge no-select">
          <el-container class="hv100 ov-hidden">
            <el-header height="100px" class="padding0">
              <div class="userlogo" v-popover:usercard>
                <img :src="userAvatar" :onerror="detaultAvatar" />
              </div>
              <p class="user-status">
                <span class="online" v-if="socketStatus">在线</span>
                <span v-else>连线中...</span>
              </p>
            </el-header>
            <el-main class="padding0 ov-hidden">
              <div class="sidebar-menu">
                <el-tooltip
                  content="我的消息"
                  placement="right"
                  :visible-arrow="false"
                >
                  <router-link to="/message">
                    <div
                      class="menu-items"
                      :class="{ 'menu-items-active': idx == 0 }"
                    >
                      <i class="el-icon-chat-line-round"></i>
                      <span v-show="unreadNum" class="message-notify"></span>
                    </div>
                  </router-link>
                </el-tooltip>

                <el-tooltip
                  content="我的联系人"
                  placement="right"
                  :visible-arrow="false"
                >
                  <router-link to="/contacts">
                    <div
                      class="menu-items"
                      :class="{ 'menu-items-active': idx == 1 }"
                    >
                      <i class="el-icon-user-solid"></i>
                      <span v-show="applyNum" class="message-notify"></span>
                    </div>
                  </router-link>
                </el-tooltip>

                <el-tooltip
                  content="我的笔记"
                  placement="right"
                  :visible-arrow="false"
                >
                  <router-link to="/notes">
                    <div
                      class="menu-items"
                      :class="{ 'menu-items-active': idx == 2 }"
                    >
                      <i class="el-icon-notebook-1"></i>
                    </div>
                  </router-link>
                </el-tooltip>

                <el-tooltip
                  content="我的设置"
                  placement="right"
                  :visible-arrow="false"
                >
                  <router-link to="/settings">
                    <div
                      class="menu-items"
                      :class="{ 'menu-items-active': idx == 3 }"
                    >
                      <i class="el-icon-setting"></i>
                    </div>
                  </router-link>
                </el-tooltip>
              </div>
            </el-main>
            <el-footer height="60px" class="padding0">
              <div class="fixed-sidebar">
                <div class="menu-items" @click="logout">
                  <span class="logout">退出</span>
                </div>
              </div>
            </el-footer>
          </el-container>
        </el-aside>

        <el-main class="padding0 bag-white">
          <slot name="container"></slot>
        </el-main>
    </el-container>

    <!-- 消息提示 -->
    <audio id="audio" preload="auto">
      <source src="~@/assets/image/1701.mp3" type="audio/mp3" />
    </audio>

    <!-- 用户卡片 -->
    <el-popover
      ref="usercard"
      placement="right-start"
      trigger="hover"
      :visible-arrow="false"
      popper-class="padding0"
    >
      <user-card />
    </el-popover>

    <!-- 版权信息 -->
    <div
      class="copyright no-select"
      v-show="themeMode == false"
      v-html="$store.state.copyright"
    ></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import UserCard from "@/components/user/UserCard";
import { ServeFindFriendApplyNum } from "@/api/user";

export default {
  name: "main-layout",
  components: {
    UserCard,
  },
  props: {
    idx: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      userAvatar: (state) => state.user.avatar,
      detaultAvatar: (state) => state.detaultAvatar,
      socketStatus: (state) => state.socketStatus,
      unreadNum: (state) => state.notify.unreadNum,
      applyNum: (state) => state.notify.applyNum,
      notifyCueTone: (state) => state.settings.notifyCueTone,
      themeMode: (state) => state.settings.themeMode,
      themeBagImg: (state) => state.settings.themeBagImg,
    }),
  },
  watch: {
    unreadNum(n, o) {
      if (n > 0 && n > o && this.notifyCueTone) {
        this.play();
      }
    },
  },
  created() {
    this.setApplyNum();
  },
  methods: {
    // 播放消息提示音
    play() {
      let audio = document.querySelector("#audio");
      audio.play().catch((err) => {
        console.log("提示音播放异常");
      });
    },
    logout() {
      this.$store.dispatch("ACT_USER_LOGOUT", this.$router);
    },
    setApplyNum() {
      ServeFindFriendApplyNum().then((res) => {
        if (res.code == 200 && res.data.unread_num > 0) {
          this.$store.commit("incrApplyNum");
        }
      });
    },
  },
};
</script>
<style lang="css" scoped="scoped">
.mian-layout {
  position: fixed;
  width: 80%;
  height: 80%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  overflow: hidden;
  transition: ease 0.5s;
  border-radius: 5px;
}

.full-mode {
  width: 100%;
  height: 100%;
  border-radius: 0;
}

.mian-layout .bag-white {
  background: white;
}

@media screen and (max-width: 1000px) {
  .mian-layout {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  .copyright {
    display: none;
  }
}

@media screen and (max-height: 700px) {
  .copyright {
    display: none;
  }
}

.mian-layout .side-edge {
  background-color: #202225;
}

.sidebar-menu {
  width: 60px;
  margin: 0 auto;
  text-align: center;
}

.sidebar-menu a {
  text-decoration: none;
}

.sidebar-menu .menu-items {
  cursor: pointer;
  color: #706d6d;
  position: relative;
  width: 45px;
  height: 45px;
  margin: 6px auto 0;
  line-height: 45px;
  text-align: center;
}

.sidebar-menu .menu-items-active {
  color: #416641 !important;
}

.sidebar-menu .menu-items i {
  font-size: 20px;
}

.sidebar-menu .menu-items:hover i {
  transform: scale(1.3);
}

.sidebar-menu .menu-items .message-notify {
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

.fixed-sidebar .menu-items {
  height: 25px;
  line-height: 25px;
  padding: 10px 5px;
  cursor: pointer;
  box-shadow: 0 0 0 0 #ccc9c9;
  text-align: center;
  color: #afabab;
}

.fixed-sidebar .menu-items i {
  font-size: 20px;
}

.fixed-sidebar .menu-items .logout {
  color: #9e9e9e;
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

.userlogo {
  width: 50px;
  height: 50px;
  margin: 10px auto 0;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: ease-in 3s;
}

.userlogo img {
  width: 100%;
  height: 100%;
}

.userlogo:hover {
  transform: rotate(360deg);
}

.user-status {
  text-align: center;
  margin-top: 10px;
  color: #ccc9c9;
  font-size: 13px;
  font-weight: 300;
}

.user-status .online {
  color: #0d710d;
}

.copyright {
  width: 300px;
  color: #545050 !important;
  height: 30px;
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 0;
  font-size: 13px;
}

/* 主题背景图片 */
.body-background {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
  background-color: #121212;
  transition: ease-in 0.5s;
}

.bag001 {
  background: url(~@/assets/image/background/001.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.bag002 {
  background: url(~@/assets/image/background/002.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.bag003 {
  background: url(~@/assets/image/background/003.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.bag004 {
  background: url(~@/assets/image/background/004.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
