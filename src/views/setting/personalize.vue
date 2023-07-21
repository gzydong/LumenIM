<script setup>
import { computed } from 'vue'
import { NSwitch } from 'naive-ui'
import { Brightness, Moon, DarkMode } from '@icon-park/vue-next'
import { useNotifyStore } from '@/store/notify'
import { isElectronMode } from '@/utils/common'

const notifyStore = useNotifyStore()

const isFullScreen = computed({
  get: () => notifyStore.isFullScreen,
  set: val => {
    notifyStore.setFullScreen(val)
  },
})

const darkTheme = computed({
  get: () => !notifyStore.darkTheme,
  set: val => {
    notifyStore.setDarkTheme(!val)
  },
})

const railStyle = ({ focused, checked }) => {
  const style = {}
  if (checked) {
    style.background = '#d03050'
    if (focused) {
      style.boxShadow = '0 0 0 2px #d0305040'
    }
  } else {
    style.background = '#2080f0'
    if (focused) {
      style.boxShadow = '0 0 0 2px #2080f040'
    }
  }
  return style
}
</script>

<template>
  <section>
    <h3 class="title">个性设置</h3>

    <div class="view-box">
      <div class="view-list">
        <div class="content">
          <div class="name">主题颜色</div>
          <div class="desc">
            当前主题颜色 ：{{ darkTheme ? '浅色' : '深色' }}
          </div>
        </div>
        <div class="tools">
          <n-switch v-model:value="darkTheme" size="medium" />
        </div>
      </div>

      <div v-show="!isElectronMode()" class="view-list">
        <div class="content">
          <div class="name">主题模式</div>
          <div class="desc">
            当前主题模式 ：{{ isFullScreen ? '全屏模式' : '居中模式' }}
          </div>
        </div>
        <div class="tools">
          <n-switch size="medium" v-model:value="isFullScreen" />
        </div>
      </div>

      <div class="view-list">
        <div class="content">
          <div class="name">我的名片</div>
          <div class="desc">当前未设置名片背景</div>
        </div>
        <div class="tools">
          <n-button type="primary" text> 修改 </n-button>
        </div>
      </div>

      <div class="view-list">
        <div class="content">
          <div class="name">聊天背景</div>
          <div class="desc">当前未设置聊天背景图</div>
        </div>
        <div class="tools">
          <n-button type="primary" text> 修改 </n-button>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
@import '@/assets/css/settting.less';
</style>
