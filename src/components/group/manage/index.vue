<script lang="ts" setup>
import { ref } from 'vue'
import { NModal } from 'naive-ui'
import DetailTab from './DetailTab.vue'
import MemberTab from './MemberTab.vue'
import NoticeTab from './NoticeTab.vue'
import ApplyTab from './ApplyTab.vue'
import ConfigTab from './ConfigTab.vue'

const emit = defineEmits(['close'])

defineProps({
  gid: {
    type: Number,
    default: 0
  }
})

const isShowBox = ref(true)
const tabIndex = ref(0)
const menus = [
  { name: '群信息', component: DetailTab },
  { name: '群成员', component: MemberTab },
  { name: '群公告', component: NoticeTab },
  { name: '群申请', component: ApplyTab },
  { name: '群设置', component: ConfigTab }
]

const onMaskClick = () => {
  emit('close')
}
</script>

<template>
  <n-modal
    v-model:show="isShowBox"
    preset="card"
    title="群管理"
    class="modal-radius"
    style="max-width: 800px"
    :on-after-leave="onMaskClick"
    :segmented="{
      content: true
    }"
    :content-style="{
      padding: 0
    }"
  >
    <section class="el-container container-box">
      <aside class="el-aside bdr-r" style="width: 100px">
        <div
          v-for="(menu, index) in menus"
          :key="menu.name"
          class="menu-list pointer"
          :class="{ selectd: tabIndex == index }"
          v-text="menu.name"
          @click="tabIndex = index"
        />
      </aside>

      <main class="el-main">
        <component :is="menus[tabIndex].component" :id="gid" @close="onMaskClick" />
      </main>
    </section>
  </n-modal>
</template>

<style lang="less" scoped>
.container-box {
  height: 550px;
  width: 100%;
  overflow: hidden;
}

.menu-list {
  height: 25px;
  line-height: 25px;
  margin: 16px 0px;
  font-weight: 400;
  font-size: 14px;
  border-right: 3px solid transparent;
  text-align: center;

  &.selectd {
    color: #2196f3;
    border-color: #2196f3;
  }
}
</style>
