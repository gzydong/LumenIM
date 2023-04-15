<script setup>
import { markRaw, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useTalkStore } from '@/store/talk'
import { NPopover } from 'naive-ui'
import AccountCard from './AccountCard.vue'
import { defAvatar } from '@/constant/default'
import {
  PersonOutline,
  SettingsOutline,
  ChatboxEllipsesOutline,
  ArrowDownCircle,
} from '@vicons/ionicons5'
import { LogoGithub, MdBook } from '@vicons/ionicons4'

defineProps({
  index: {
    type: Number,
    default: 0,
  },
})

const userStore = useUserStore()
const talkStore = useTalkStore()
const router = useRouter()

const menus = reactive([
  {
    link: '/message',
    icon: markRaw(ChatboxEllipsesOutline),
    title: '消息',
    hotspot: computed(() => talkStore.talkUnreadNum > 0),
  },
  {
    link: '/contact/friend',
    icon: markRaw(PersonOutline),
    title: '通讯录',
    hotspot: computed(() => userStore.isContactApply),
  },
  {
    link: '/note',
    icon: markRaw(MdBook),
    title: '笔记',
  },
  {
    link: 'https://github.com/gzydong/LumenIM',
    icon: markRaw(LogoGithub),
    external: true,
    title: '源码',
  },
  {
    link: '/settings/detail',
    icon: markRaw(SettingsOutline),
    title: '设置',
  },
])

const onLogout = () => {
  userStore.logoutLogin()
}

const onClickMenu = menu => {
  if (menu.external) {
    window.location.href = menu.link
  } else {
    router.push(menu.link)
  }
}
</script>

<template>
  <section class="menu">
    <header class="menu-header">
      <n-popover
        :overlap="false"
        placement="right"
        trigger="hover"
        :show-arrow="false"
        :raw="true"
        :animated="true"
        style="margin-left: 16px"
      >
        <template #trigger>
          <n-avatar
            class="logo"
            round
            :size="35"
            :src="userStore.avatar"
            :fallback-src="defAvatar"
          />
        </template>
        <AccountCard />
      </n-popover>

      <span class="online-status" :class="{ online: userStore.online }">
        {{ userStore.online ? '在线' : '连接中...' }}
      </span>
    </header>

    <main class="menu-main">
      <div
        class="menu-items"
        :class="{
          active: i == index,
        }"
        v-for="(nav, i) in menus"
        :key="nav.link"
        @click="onClickMenu(nav)"
      >
        <!-- 消息提示 -->
        <div class="hotspot" v-if="nav.hotspot" />

        <p><n-icon :size="20" :component="nav.icon" /></p>
        <p style="font-size: 12px">{{ nav.title }}</p>
      </div>
    </main>

    <footer class="menu-footer pointer">
      <p>
        <n-popover
          :style="{ marginLeft: '30px', marginTop: '-6px', height: '100px' }"
          trigger="hover"
          placement="right"
        >
          <template #trigger>
            <n-icon
              size="22"
              color="rgb(177 162 162)"
              :component="ArrowDownCircle"
            />
          </template>

          <div style="width: 200px; height: 100px; padding-top: 10px">
            <h3>下载客户端(预览)</h3>
            <br />
            <a
              style="color: #03a9f4"
              href="https://im.gzydong.club/public/pkg/LumenIM.dmg"
              target="_blank"
              >Mac 客户端</a
            >&nbsp;&nbsp;|&nbsp;&nbsp;
            <a
              style="color: #03a9f4"
              href="https://im.gzydong.club/public/pkg/LumenIM.exe"
              target="_blank"
              >Windows x64</a
            >
          </div>
        </n-popover>
      </p>
      <p @click="onLogout">退出</p>
    </footer>
  </section>
</template>

<style lang="less" scoped>
.menu {
  height: 100%;
  width: 100%;
  background-color: #001427;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .menu-header {
    height: 90px;
    width: 100%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 18px;
    box-sizing: border-box;
    cursor: pointer;

    .online-status {
      margin-top: 5px;
      font-size: 13px;
      font-weight: 300;
      color: rgb(185, 181, 181);

      &.online {
        color: #65c468;
      }
    }
  }

  .menu-main {
    flex: auto;
    width: 100%;
    overflow: hidden;
  }

  .menu-footer {
    height: 100px;
    width: 100%;
    flex-shrink: 0;
    font-size: 15px;
    color: rgb(207, 207, 207);
    font-weight: 300;

    p {
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
  }
}

.menu-items {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 8px 3px;
  color: #a4a4a4;
  padding: 5px;
  user-select: none;
  cursor: pointer;
  border-radius: 3px;
  font-size: 13px;

  &:hover,
  &.active {
    background-color: #ffffff26;
    color: rgb(194, 204, 193);
    font-weight: 600;
  }

  .hotspot {
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
</style>
