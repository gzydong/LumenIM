<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import { Modal } from 'ant-design-vue'
import { IClose, ISet, IExit } from '../icons'
import { queryAppVersion } from '@/api/user'
import Chat from './chat.vue'
import Summary from './summary.vue'
import Knowledge from './Knowledge.vue'
import Translate from './Translate.vue'


// 定义组件可以发出的事件
const emit = defineEmits(['close', 'logout', 'update-api-key'])

const icon = '/src/assets/echo.png'
const curTab = ref('chat')
const shouldUpdateVersion = ref(false)

const handleClose = () => {
  emit('close')
}

const handleUpdateApiKey = () => {
  // TODO: Implement update API key logic here
  emit('update-api-key')
}

const handleLogout = () => {
  Modal.confirm({
    title: '确认退出登录？',
    content: '退出登录后，将无法使用Echo',
    okText: '确认',
    cancelText: '取消',
    zIndex: 2147483650,
    onOk() {
      emit('logout')
    }
  })
}

const fetchVersion = async () => {
  shouldUpdateVersion.value = false

  // try {
  //   const response = await queryAppVersion({
  //     version: '1.0.3'
  //   })
  //   shouldUpdateVersion.value = response.data.shouldUpdate
  // } catch (e) {
  //   shouldUpdateVersion.value = false
  // }
}

const handleChangeTab = (type) => {
  curTab.value = type
}

onMounted(async () => {
  await fetchVersion()
})
</script>

<template>
  <div
    id="echo-main-window-root"
    class="main-window mode-sidebar"
    style="min-width: 350px;max-width: 350px; height: 100vh"
  >
    <header class="header">
      <div class="header-left">
        <a class="logo-wrapper" target="_blank" rel="noreferrer"
          ><img
            :src="icon"
            class="logo logo-img"
            style="width: 22px; height: 22px; border-radius: 4px"
          /><span class="title">Chat Copilot </span></a
        >
        <!-- <div style="font-size: 12px; color: #999; margin-left: 10px" v-if="shouldUpdateVersion">
          有版本更新，<a
            target="_blank"
            :href="`https://help-doc.oss-cn-beijing.aliyuncs.com/echo-pro.zip?t=${Date.now()}`"
            >点击下载</a
          >
        </div> -->
      </div>
      <div class="header-center"></div>
      <div class="header-right">
        <div class="operation-item" @click="handleUpdateApiKey">
          <ISet></ISet>
        </div>
        <!-- <div class="operation-item" @click="handleLogout">
          <IExit></IExit>
        </div> -->
        <!-- <div class="operation-item" @click="handleClose">
          <IClose :width="16" :height="16"></IClose>
        </div> -->
      </div>
    </header>
    <div class="tabs-wrapper">
      <div class="main-window-tabs">
        <div
          class="tab-item"
          :class="{ 'tab-item-active': curTab === 'chat' }"
          @click="handleChangeTab('chat')"
        >
          <div>聊天</div>
        </div>
        <div
          class="tab-item"
          :class="{ 'tab-item-active': curTab === 'knowledge' }"
          @click="handleChangeTab('knowledge')"
        >
          <div>知识库</div>
        </div>
        <div
          class="tab-item"
          :class="{ 'tab-item-active': curTab === 'summary' }"
          @click="handleChangeTab('summary')"
        >
          <div>摘要</div>
        </div>
        <div
          class="tab-item"
          :class="{ 'tab-item-active': curTab === 'translate' }"
          @click="handleChangeTab('translate')"
        >
          <div>翻译</div>
        </div>
        <div
          class="tab-active-bar"
          :class="{
            'tab-bar-knowledge': curTab === 'knowledge',
            'tab-bar-summary': curTab === 'summary',
            'tab-bar-chat': curTab === 'chat',
            'tab-bar-translate': curTab === 'translate'
          }"
        ></div>
      </div>
    </div>
    <Chat v-if="curTab === 'chat'"></Chat>
    <Knowledge v-if="curTab === 'knowledge'"></Knowledge>
    <Summary v-if="curTab === 'summary'"></Summary>
    <Translate v-if="curTab === 'translate'"></Translate>
  </div>
</template>
<style scoped>
.main-window {
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    Segoe UI,
    Helvetica,
    Arial,
    sans-serif,
    'Apple Color Emoji',
    'Segoe UI Emoji';
  color: #212b36;
  user-select: text;
  text-align: left;
  font-weight: 400;
  position: fixed;
  background: #ffffff;
  border: 1px solid #e5e8eb;
  box-shadow: 0 8px 16px #919eab29;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  z-index: 5;
  overflow: hidden;
  font-size: 14px;
  line-height: normal;
}
.main-window.mode-sidebar {
  top: 0;
  bottom: 0;
  right: 0;
  border-radius: 0;
  border-top: none;
  border-bottom: none;
}
.main-window .header {
  position: relative;
  display: flex;
  align-items: center;
  height: 60px;
  min-height: 60px;
  max-height: 60px;
  /* border-top: 1px solid #f2f2f2;
  border-bottom: 1px solid #f2f2f2; */
  padding: 0 15px;
  user-select: none;
}
.main-window .header .header-left {
  display: flex;
  align-items: center;
  height: 22px;
}
.main-window .header .header-left .logo-wrapper {
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  text-decoration: none;
  color: #3872e0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.logo-img {
  -webkit-user-drag: none;
}
.main-window .header .header-left .logo-wrapper .logo {
  margin-right: 8px;
  margin-top: -2px;
  margin-left: -2px;
}
.main-window .header .header-left .logo-wrapper .title {
  font-weight: 600;
  font-size: 16px;
  color: #000;
}
.main-window .header .header-center {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.header-right {
  user-select: text;
  display: flex;
  align-items: center;
  height: 22px;
  gap: 12px;
}
.header-right .operation-item {
  position: relative;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  color: #838ba7;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 16px;
}
.main-window .tabs-wrapper {
  display: flex;
  flex-direction: row;
  background: #ffffff;
  box-shadow: 0 4px 4px -2px #0000000d;
  height: 39px;
  min-height: 39px;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 0 16px;
  position: relative;
}
.main-window-tabs {
  position: relative;
  display: flex;
  align-items: center;
  gap: 28px;
}
.main-window-tabs .tab-item {
  font-weight: 500;
  font-size: 15px;
  color: #637381;
  display: flex;
  align-items: center;
  height: 39px;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
}
.main-window-tabs .tab-item-active {
  color: #212b36;
}
.main-window-tabs .tab-active-bar {
  position: absolute;
  bottom: 0;
  height: 2px;
  background: #3872e0;
  transition: left 0.32s;
}
.tab-bar-chat {
  left: -1px;
  width: 32px;
}
.tab-bar-knowledge {
  left: 64px;
  width: 32px;
}
.tab-bar-summary {
  left: 130px;
  width: 32px;
}
.tab-bar-translate {
  left: 188px;
  width: 32px;
}
</style>
