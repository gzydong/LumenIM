<template>
  <div>
    <el-container class="mian-layout">
      <el-aside width="70px" class="side-edge">
        <el-container class="hv100 ov-hidden">
          <el-header height="70px" class="padding0">
            <el-popover placement="right" trigger="click" :visible-arrow="false" popper-class="padding0">
              <user-card />
              <div class="userlogo" slot="reference">
                <img :src="$store.state.user.avatar" :onerror="$store.state.user.detaultAvatar" class="no-user-select" />
                <p class="p1" v-show="!$store.state.socketStatus"></p>
                <p class="p2" v-show="!$store.state.socketStatus"></p>
                <p class="p3" v-show="!$store.state.socketStatus"></p>
              </div>
            </el-popover>
          </el-header>
          <el-main class="padding0 ov-hidden">
            <div class="sidebar-menu">
              <el-tooltip class="item" content="我的聊天消息" placement="right" :visible-arrow="false">
                <router-link to="/message">
                  <div class="menu-items" :class="{'menu-items-active':idx == 0}">
                    <i class="iconfont icon-duanxin"></i>
                    <span v-show="$store.state.notify.unreadNum" class="message-notify"></span>
                  </div>
                </router-link>
              </el-tooltip>

              <el-tooltip class="item" content="我的好友及群聊" placement="right" :visible-arrow="false">
                <router-link to="/contacts">
                  <div class="menu-items" :class="{'menu-items-active':idx == 1}">
                    <i class="iconfont icon-qunzu"></i>
                  </div>
                </router-link>
              </el-tooltip>

              <el-tooltip class="item" content="我的笔记" placement="right" :visible-arrow="false">
                <router-link to="/notes">
                  <div class="menu-items" :class="{'menu-items-active':idx == 2}">
                    <i class="el-icon-notebook-2"></i>
                  </div>
                </router-link>

              </el-tooltip>
            </div>
          </el-main>
          <el-footer height="60px" class="padding0">
            <div class="fixed-sidebar">
              <div class="menu-items" @click="logout">
                <span style="color: #9e9e9e;">退出</span>
              </div>
            </div>
          </el-footer>
        </el-container>
      </el-aside>

      <el-main class="padding0">
        <slot name="container"></slot>
      </el-main>
    </el-container>

    <audio id="audio" preload="auto" loop>
      <source src="/static/image/59y888piCn92.mp3" type="audio/mp3" />
    </audio>
  </div>
</template>

<script>
  import {
    removeClass,
    addClass
  } from "@/utils/functions";

  import UserCard from "@/components/user/UserCard";
  export default {
    name: "main-layout",
    components: {
      UserCard
    },
    props: {
      idx: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        lastRunTime: 0,
        currentTime: 0
      };
    },
    computed: {
      msg() {
        return this.$store.state.notify.unreadNum;
      }
    },
    watch: {
      msg(n, o) {
        if (n > 0 && n > o) {
          this.play();
        }
      }
    },
    methods: {
      // 播放消息提示音
      play() {
        this.lastRunTime = Date.now();
        let audio = document.querySelector("#audio");
        if (!this.isPlaying) {
          audio.play();
          this.isPlaying = true;
        }
        let timeOut = setTimeout(() => {
          this.stop(timeOut);
        }, 1000);
      },
      // 停止消息提示音
      stop(timeOut) {
        this.currentTime = Date.now();
        let audio = document.querySelector("#audio");
        if (this.currentTime - this.lastRunTime < 1000) {} else {
          if (this.isPlaying) {
            audio.currentTime = 0;
            audio.pause();
            this.isPlaying = false;
          }
        }
        clearTimeout(timeOut);
      },
      logout() {
        this.$store.dispatch("ACT_USER_LOGOUT", this.$router);
      }
    }
  };

</script>

<style scoped="scoped">
  .mian-layout {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .mian-layout .side-edge {
    background-color: #202225;
  }

  .sidebar-menu {
    width: 60px;
    margin: 0 auto;
    text-align: center;
  }

  .sidebar-menu .menu-items {
    cursor: pointer;
    color: #afabab;
    position: relative;
    width: 45px;
    height: 45px;
    background: #3a3232;
    margin: 10px auto 0;
    line-height: 45px;
    text-align: center;
    border-radius: 50%;
  }

  .sidebar-menu .menu-items-active {
    color: #416641 !important;
  }

  .sidebar-menu .menu-items:hover {
    background: #38373a;
    color: white !important;
    font-weight: bold;
  }

  .sidebar-menu .menu-items:active {
    box-shadow: 0px 0px 8px white;
    transition-duration: 0.2s;
  }

  .sidebar-menu .menu-items i {
    font-size: 20px;
    margin-left: 3px;
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
  }

  .userlogo img {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;

  }

  .userlogo img:hover {
    transform: scale(1.1);
    transition: ease-in 1s;
  }

  .userlogo .p1:after,
  .userlogo .p2:after,
  .userlogo .p3:after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 50%;
    border: 2px solid #75abfa;
    opacity: 0;
    background-color: rgba(160, 195, 244, .3);
  }

  .userlogo .p1:after {
    -webkit-animation: ripple 4.5s ease-out 225ms infinite;
    animation: ripple 4.5s ease-out 225ms infinite;
  }

  .userlogo .p2:after {
    -webkit-animation: ripple 4.5s ease-out .9s infinite;
    animation: ripple 4.5s ease-out .9s infinite;
  }

  .userlogo .p3:after {
    -webkit-animation: ripple 4.5s ease-out 1.8s infinite;
    animation: ripple 4.5s ease-out 6s infinite;
  }

  @-webkit-keyframes ripple {
    0% {
      opacity: 0;
      -webkit-transform: scale(0.01);
    }

    5% {
      opacity: 1
    }

    to {
      opacity: 0;
      -webkit-transform: scale(1.5);
    }
  }

  @keyframes ripple {
    0% {
      opacity: 0;
      -webkit-transform: scale(0.01);
      transform: scale(0.01);
    }

    5% {
      opacity: 1
    }

    to {
      opacity: 0;
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
  }

</style>
