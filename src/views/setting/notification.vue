<script setup>
import { computed } from 'vue'
import { NSwitch } from 'naive-ui'
import { useNotifyStore } from '@/store/notify'

const notifyStore = useNotifyStore()

const isPromptTone = computed({
  get: () => notifyStore.isPromptTone,
  set: val => {
    notifyStore.setPromptTone(val)
  },
})

const isKeyboard = computed({
  get: () => notifyStore.isKeyboard,
  set: val => {
    notifyStore.setKeyboard(val)
  },
})

const isWebNotify = computed({
  get: () => notifyStore.isWebNotify,
  set: val => {
    if (val === false) {
      notifyStore.isWebNotify = false
    } else {
      window.Notification.requestPermission(res => {
        console.log(res)
        notifyStore.isWebNotify = 'granted' === res
      })
    }
  },
})
</script>

<template>
  <section>
    <h3 class="title">通知设置</h3>

    <div class="view-box">
      <div class="view-list">
        <div class="content">
          <div class="name">新消息提示音</div>
          <div class="desc">新消息提示音 ：{{ isPromptTone ? '已开启' : '已关闭' }}</div>
        </div>
        <div class="tools">
          <n-switch size="medium" v-model:value="isPromptTone" />
        </div>
      </div>

      <div class="view-list">
        <div class="content">
          <div class="name">推送键盘输入消息</div>
          <div class="desc">推送键盘输入消息：{{ isKeyboard ? '已开启' : '已关闭' }}</div>
        </div>
        <div class="tools">
          <n-switch size="medium" v-model:value="isKeyboard" />
        </div>
      </div>
      <div class="view-list">
        <div class="content">
          <div class="name">消息通知</div>
          <div class="desc">消息通知：{{ isWebNotify ? '已开启' : '已关闭' }}</div>
        </div>
        <div class="tools">
          <n-switch size="medium" v-model:value="isWebNotify" />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
@import '@/assets/css/settting.less';
</style>
