<script setup>
import { computed } from 'vue'
import { NSwitch } from 'naive-ui'
import { useNotifyStore } from '@/store/notify'
import { isElectronMode } from '@/utils/common'

const notifyStore = useNotifyStore()

const isFullScreen = computed({
  get: () => notifyStore.isFullScreen,
  set: val => {
    notifyStore.setFullScreen(val)
  },
})
</script>

<template>
  <section>
    <h3 class="title">个性设置</h3>

    <div class="view-box">
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
          <n-button type="info" text> 修改 </n-button>
        </div>
      </div>

      <div class="view-list">
        <div class="content">
          <div class="name">聊天背景</div>
          <div class="desc">当前未设置聊天背景图</div>
        </div>
        <div class="tools">
          <n-button type="info" text> 修改 </n-button>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
@import '@/assets/css/settting.less';
</style>
