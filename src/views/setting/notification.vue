<script lang="ts" setup>
import { computed, ref } from 'vue'
import { NSwitch } from 'naive-ui'
import { useSettingsStore } from '@/store'

const settingsStore = useSettingsStore()

const isPromptTone = computed({
  get: () => settingsStore.isPromptTone,
  set: (value) => {
    settingsStore.setPromptTone(value)
  }
})

const isKeyboard = computed({
  get: () => settingsStore.isKeyboard,
  set: (value) => {
    settingsStore.setKeyboard(value)
  }
})

const isNotify = computed({
  get: () => settingsStore.isNotify,
  set: (value) => {
    settingsStore.setNotify(value)
    value && toPermission()
  }
})

const hasPermission = ref(false)

hasPermission.value = Notification.permission === 'granted'

const toPermission = () => {
  Notification.requestPermission().then((permission) => {
    hasPermission.value = permission === 'granted'
  })
}
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
          <div class="desc">
            消息通知：{{ isNotify ? '已开启' : '已关闭' }}

            <span v-show="isNotify && !hasPermission">
              (当前未获得浏览器通知权限，
              <n-button type="primary" text @click="toPermission">点击获取权限</n-button>)
            </span>
          </div>
        </div>
        <div class="tools">
          <n-switch size="medium" v-model:value="isNotify" />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
@import '@/assets/css/settting.less';
</style>
