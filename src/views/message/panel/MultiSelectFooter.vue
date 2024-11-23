<script lang="ts" setup>
import { ref } from 'vue'
import { Share, ShareThree, Delete, Close } from '@icon-park/vue-next'
import ContactModal from '@/components/user/ContactModal.vue'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'delete'): void
  (e: 'forward', key: 'merge' | 'single', items: { id: number; type: number }[]): void
}>()

const { count } = defineProps<{
  count: number
}>()

const isShowContactModal = ref(false)
const forwardMode = ref(0)

const onShowContactModal = (type: number) => {
  forwardMode.value = type
  isShowContactModal.value = true
}

const onClose = () => {
  emit('close')
}

const onMultiDelete = () => {
  emit('delete')
}

const onContactModal = (items: { id: number; type: number }[]) => {
  isShowContactModal.value = false
  emit('forward', forwardMode.value === 1 ? 'single' : 'merge', items)
}
</script>

<template>
  <section class="section border-top">
    <div class="multi-title">
      <span>已选中：{{ count }} 条消息</span>
    </div>
    <div class="multi-group">
      <div class="multi-group-item">
        <div class="multi-icon pointer flex-center" @click="onShowContactModal(2)">
          <n-icon :size="22" :component="Share" />
        </div>
        <p>合并转发</p>
      </div>
      <div class="multi-group-item">
        <div class="multi-icon pointer flex-center" @click="onShowContactModal(1)">
          <n-icon :size="22" :component="ShareThree" />
        </div>
        <p>逐条转发</p>
      </div>
      <div class="multi-group-item">
        <div class="multi-icon pointer flex-center" @click="onMultiDelete">
          <n-icon :size="22" :component="Delete" />
        </div>
        <p>批量删除</p>
      </div>
      <div class="multi-group-item">
        <div class="multi-icon pointer flex-center" @click="onClose">
          <n-icon :size="22" :component="Close" />
        </div>
        <p>关闭</p>
      </div>
    </div>
  </section>

  <ContactModal
    v-if="isShowContactModal"
    v-on:close="isShowContactModal = false"
    v-on:on-submit="onContactModal"
  />
</template>
<style lang="less" scoped>
.section {
  height: inherit;
  width: 100%;
  box-sizing: border-box;
  user-select: none;
  position: relative;

  .multi-title {
    width: 100%;
    height: 45px;
    color: #878484;
    font-size: 14px;
    align-items: center;
    display: flex;
    justify-content: center;
  }

  .multi-group {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;

    &-item {
      width: 50px;
      height: 80px;
      margin: 0 15px;

      .multi-icon {
        width: 50px;
        height: 50px;
        background-color: var(--im-active-bg-color);
        border-radius: 50%;

        &:hover {
          background-color: #ff5722;
          color: #fff;
        }
      }

      p {
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        text-align: center;
      }
    }
  }
}
</style>
