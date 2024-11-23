<script lang="ts" setup>
import { nextTick, onMounted, useId, ref } from 'vue'
import { ChatProps, AlignEnum } from './types.ts'
import ChatItem from './ChatItem.vue'
import FooterLoadToolbar from './FooterToolbar.vue'
import HeaderToolbar from './HeaderToolbar.vue'
import SkipBottomButton from './SkipBottomButton.vue'
import DraggableArea from '@/components/basic/DraggableArea.vue'
import { useContextMenu } from './useContextMenu.ts'
import { useMultiSelect } from './useMultiSelect.ts'
import { useLoadMore } from './useLoadMore.ts'

const {
  alignMode = AlignEnum.LEFT_RIGHT,
  showAvatar = true,
  multiSelectMode = false,
  dataSourceMode = 'custom',
  items,
  onScrollLoadMore,
  contextMenu,
  customRender,
  contextMenuOption,
  unread
} = defineProps<ChatProps>()

const emit = defineEmits<{
  (e: 'user-click-event', key: 'nickname' | 'avatar', raw: any): void
  (e: 'context-menu-event', key: string, raw: any): void
  (e: 'element-event', key: string, raw: any): void
  (e: 'element-select', element: string[]): void
}>()

const containerId = `chat-container-${useId()}`

// 是否滚动到底部
const isScrollBottom = ref(false)
// 获取聊天容器
const container = (): HTMLElement | null => {
  return document.getElementById(containerId)
}

// 多选组件
const multiSelect = useMultiSelect()

// 加载数据
const { loadStatus, toLoadMore } = useLoadMore(dataSourceMode, container, onScrollLoadMore)

// 右键菜单
const { menu, ContextMenuElement } = useContextMenu(contextMenuHandle)

/**
 * 设置是否开启多选
 */
function enableMultiSelect(value: boolean): void {
  multiSelect.enable(value)
}

/**
 * 设置是否开启多选
 */
function clearMultiSelect(): void {
  multiSelect.clearMultiSelect()
}

function setMultiSelect(elements: string[]): void {
  if (elements.length === 0 || !multiSelectMode) return

  multiSelect.enable(true)
  multiSelect.setMultiSelect(elements)

  emit('element-select', getMultiSelect())
}

function getMultiSelect(): string[] {
  return multiSelect.getMultiSelect()
}

/**
 * 滚动到底部
 * @param animation 是否使用动画
 */
function scrollToBottom(animation: boolean = false): void {
  const el = container()
  el?.scrollTo({
    top: el?.scrollHeight + 1000,
    behavior: animation ? 'smooth' : 'auto'
  })
}

/**
 * 右键显示菜单
 * @param e Event
 * @param item 消息对象
 */
function onContextMenu(e: MouseEvent, item: any): void {
  if (!contextMenu || !contextMenuOption || multiSelect.isEnable()) return

  menu.show(e, contextMenuOption(item), item)
}

function contextMenuHandle(key: string): void {
  const raw = menu.getItem()
  menu.close()
  emit('context-menu-event', key, raw)
}

function onElementEvent(key: string, item: any): void {
  emit('element-event', key, item)
}

function onClickAvatar(item: any) {
  emit('user-click-event', 'avatar', item)
}

function onClickName(item: any) {
  emit('user-click-event', 'nickname', item)
}

function scrollToBottomWithDelay() {
  scrollToBottom()
  for (let i = 0; i < 5; i++) {
    setTimeout(scrollToBottom, i * 100)
  }
}
function reload(): void {
  multiSelect.enable(false)

  toLoadMore(true)

  if (dataSourceMode === 'pulldown') {
    nextTick(() => {
      scrollToBottomWithDelay()
    })
  }
}

onMounted(() => {
  if (dataSourceMode === 'pulldown') {
    scrollToBottomWithDelay()
  }
})

defineExpose({
  enableMultiSelect,
  clearMultiSelect,
  setMultiSelect,
  getMultiSelect,
  scrollToBottom,
  reload,
  getContainerId: () => containerId
})
</script>

<template>
  <section class="section">
    <DraggableArea
      :id="containerId"
      class="chat-container me-scrollbar"
      closest=".immsg"
      element-key="index"
      element=".chat-container-item"
      strategy="intersect"
      :enable="multiSelectMode"
      @selected-elements="setMultiSelect"
    >
      <HeaderToolbar
        v-if="dataSourceMode === 'pulldown'"
        :load-status="loadStatus"
        :fn="toLoadMore"
      />

      <ChatItem
        v-for="item in items"
        :key="item.msg_id"
        :data-index="item.msg_id"
        :align="alignMode"
        :show-checkbox="multiSelect.isEnable()"
        :show-avatar="showAvatar"
        :item="customRender(item)"
        :raw="item"
        :is-selected="multiSelect.isSelected(item)"
        @element-event="onElementEvent"
        @selected-element="setMultiSelect([item.msg_id])"
        @click-avatar="onClickAvatar"
        @click-name="onClickName"
        :on-context-menu="onContextMenu"
        :showToolsMenus="showToolsMenus"
      />

      <FooterLoadToolbar
        v-model="isScrollBottom"
        :load-mode="dataSourceMode"
        :load-status="loadStatus"
        :fn="toLoadMore"
      />
    </DraggableArea>

    <!-- 右键菜单 -->
    <ContextMenuElement />

    <!-- 置底按钮(仅下拉加载数据显示置底按钮) -->
    <SkipBottomButton
      v-if="dataSourceMode === 'pulldown'"
      v-model="isScrollBottom"
      :unread="unread"
      :scrollToBottom="scrollToBottom"
    />
  </section>
</template>

<style lang="less" scoped>
.section {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.chat-container {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding: 0px 5px;
  box-sizing: border-box;
}
</style>
