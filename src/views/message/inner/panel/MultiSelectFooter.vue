<script lang="ts" setup>
import { ref } from 'vue'
import { useDialogueStore } from '@/store'
import { Share, ShareThree, Delete, Close } from '@icon-park/vue-next'

import ContactModal from '@/components/user/ContactModal.vue'

const dialogueStore = useDialogueStore()
const isShowContactModal = ref(false)
const forwardMode = ref(0)

const onShowContactModal = (type: number) => {
  forwardMode.value = type
  isShowContactModal.value = true
}

const onClose = () => {
  dialogueStore.closeMultiSelect()
}

const onMergeForward = () => {
  if (dialogueStore.selectItems.length) {
    onShowContactModal(2)
  }
}

const onSingleForward = () => {
  if (dialogueStore.selectItems.length) {
    onShowContactModal(1)
  }
}

const onMultiDelete = () => {
  // 批量删除
  let msgIds = dialogueStore.selectItems.map((item: any) => item.msg_id)

  if (!msgIds.length) return

  dialogueStore.ApiDeleteRecord(msgIds)
}

const onContactModal = (data: { id: number; type: number }[]) => {
  let msg_ids = dialogueStore.selectItems.map((item: any) => item.msg_id)

  let user_ids: number[] = []
  let group_ids: number[] = []

  for (let o of data) {
    if (o.type == 1) {
      user_ids.push(o.id)
    } else {
      group_ids.push(o.id)
    }
  }

  dialogueStore.ApiForwardRecord({
    mode: forwardMode.value,
    message_ids: msg_ids,
    uids: user_ids,
    gids: group_ids
  })

  isShowContactModal.value = false
}
</script>

<template>
  <section class="section bdr-t">
    <div class="multi-title">
      <span>已选中：{{ dialogueStore.selectItems.length }} 条消息</span>
    </div>
    <div class="multi-groups">
      <div class="btn-group">
        <div class="multi-icon pointer flex-center" @click="onMergeForward">
          <n-icon :size="22" :component="Share" />
        </div>
        <p>合并转发</p>
      </div>
      <div class="btn-group">
        <div class="multi-icon pointer flex-center" @click="onSingleForward">
          <n-icon :size="22" :component="ShareThree" />
        </div>
        <p>逐条转发</p>
      </div>
      <div class="btn-group">
        <div class="multi-icon pointer flex-center" @click="onMultiDelete">
          <n-icon :size="22" :component="Delete" />
        </div>
        <p>批量删除</p>
      </div>
      <div class="btn-group">
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
  height: 100%;
  width: 100%;
  box-sizing: border-box;

  .multi-title {
    width: 100%;
    height: 80px;
    line-height: 80px;
    text-align: center;
    color: #878484;
    font-size: 14px;
  }

  .multi-groups {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;

    .btn-group {
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
