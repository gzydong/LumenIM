<script lang="ts" setup>
import { reactive, computed, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore, useSettingsStore, useTalkStore } from '@/store'
import { NPopover } from 'naive-ui'
import AccountCard from './AccountCard.vue'
import {
  GithubOne,
  SettingTwo,
  Message,
  NotebookAndPen,
  People
  // SmartOptimization
} from '@icon-park/vue-next'

defineProps({
  index: {
    type: Number,
    default: 0
  }
})

const userStore = useUserStore()
const talkStore = useTalkStore()
const router = useRouter()

const settingsStore = useSettingsStore()

const color = computed(() => {
  return settingsStore.darkTheme ? '#ffffff' : '#333'
})

const menus = reactive([
  {
    link: '/message',
    icon: markRaw(Message),
    title: '消息',
    hotspot: computed(() => talkStore.talkUnreadNum > 0)
  },
  {
    link: '/contact',
    icon: markRaw(People),
    title: '通讯录',
    hotspot: computed(() => userStore.isContactApply || userStore.isGroupApply)
  },
  {
    link: '/note',
    icon: markRaw(NotebookAndPen),
    title: '笔记'
  },
  // {
  //   link: '/settings',
  //   icon: markRaw(SmartOptimization),
  //   title: 'Ai助手'
  // },
  {
    link: '/settings',
    icon: markRaw(SettingTwo),
    title: '设置'
  }
])

const onLogout = () => {
  userStore.logoutLogin()
}

const onClickMenu = (menu) => {
  if (menu.external) {
    window.open(menu.link)
  } else {
    router.push(menu.link)
  }
}

const isActive = (menu) => {
  return router.currentRoute.value.path.indexOf(menu.link) >= 0
}
</script>

<template>
  <section class="menu">
    <header class="menu-header" :url="router.currentRoute.value.path">
      <n-popover
        placement="right"
        trigger="hover"
        :raw="true"
        style="margin-left: 16px; border-radius: 8px; overflow: hidden"
      >
        <template #trigger>
          <im-avatar
            class="logo"
            :size="35"
            :src="userStore.avatar"
            :username="userStore.nickname"
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
        v-for="nav in menus"
        :key="nav.link"
        :class="{
          'menu-items': true,
          active: isActive(nav)
        }"
        @click="onClickMenu(nav)"
      >
        <!-- 消息提示 -->
        <div class="hotspot" v-if="nav.hotspot" />

        <p>
          <component
            :is="nav.icon"
            :theme="isActive(nav) ? 'filled' : 'outline'"
            :fill="isActive(nav) ? '#1890ff' : color"
            :strokeWidth="2"
            :size="22"
          />
        </p>

        <span>{{ nav.title }}</span>
      </div>
    </main>

    <footer class="menu-footer">
      <div>
        <a class="pointer" href="https://github.com/gzydong/LumenIM" target="_blank">
          <github-one theme="outline" size="22" :fill="color" :strokeWidth="2" />
        </a>
      </div>
      <div @click="onLogout" class="pointer">退出</div>
    </footer>
  </section>
</template>

<style lang="less" scoped>
.menu {
  height: 100%;
  width: 100%;
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
    height: 90px;
    width: 100%;

    div {
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.menu-items {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
  border-radius: 3px;
  font-size: 12px;
  width: 54px;
  height: 54px;
  margin: 8px auto;
  border-radius: 10px;

  // &.active {
  //   &::after {
  //     position: absolute;
  //     content: '';
  //     width: 0;
  //     height: 0;
  //     right: -8px;
  //     border-top: 8px solid transparent;
  //     border-bottom: 8px solid transparent;
  //     border-right: 8px solid #ffffff;
  //   }
  // }

  .hotspot {
    width: 5px;
    height: 5px;
    --hotspot: #ff1e1e;
    background: var(--hotspot);
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
    background: var(--hotspot);
  }

  25% {
    background: transparent;
  }

  50% {
    background: var(--hotspot);
  }

  75% {
    background: transparent;
  }

  100% {
    background: var(--hotspot);
  }
}

@-webkit-keyframes notifymove {
  0% {
    background: #ff1e1e;
  }

  25% {
    background: transparent;
  }

  50% {
    background: #ff1e1e;
  }

  75% {
    background: transparent;
  }

  100% {
    background: #ff1e1e;
  }
}
</style>
