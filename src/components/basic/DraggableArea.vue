<template>
  <div ref="containerRef" class="draggable-area" @mousedown="handleMouseDown">
    <div
      v-if="isDragging"
      class="draggable-area-box"
      :style="{
        left: selectionBox.startX + 'px',
        top: selectionBox.startY + 'px',
        width: selectionBox.width + 'px',
        height: selectionBox.height + 'px'
      }"
    ></div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const emit = defineEmits(['selected-elements'])

enum SelectionStrategy {
  Intersect = 'intersect',
  Contain = 'contain'
}

const props = defineProps({
  closest: {
    type: String,
    required: true
  },
  element: {
    type: String,
    required: true
  },
  elementKey: {
    type: String,
    required: true
  },
  strategy: {
    type: String,
    default: 'contain'
  },
  enable: {
    type: Boolean,
    default: false
  }
})

const containerRef = ref<HTMLDivElement | null>(null)

const isDragging = ref(false)

const initPosition = reactive({
  x: 0,
  y: 0
})

const selectionBox = reactive({
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  width: 0,
  height: 0
})

const selectedElements = ref<Array<string | number>>([])

let mouseMoveHandler: ((event: MouseEvent) => void) | null = null
let mouseUpHandler: (() => void) | null = null

const handleMouseDown = (event: MouseEvent) => {
  const target = event.target as HTMLElement

  if (!props.enable) return

  // 右键菜单直接返回
  if (event.button === 2) return

  // 判断点击的是否是容器
  if (props.closest && target.closest(props.closest)) return

  event.preventDefault()

  isDragging.value = true

  initPosition.x = event.pageX
  initPosition.y = event.pageY

  updateSelectionBox(event.pageX, event.pageY)

  mouseMoveHandler = handleMouseMove
  mouseUpHandler = handleMouseUp
  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value) return

  updateSelectionBox(event.pageX, event.pageY)
}

const handleMouseUp = () => {
  isDragging.value = false

  // 移动距离小于10px则不触发
  if (selectionBox.width <= 10 && selectionBox.height <= 10) return

  document.removeEventListener('mousemove', mouseMoveHandler!)
  document.removeEventListener('mouseup', mouseUpHandler!)

  // 确定哪些元素被选中
  selectedElements.value = getSelectedElements()

  // 触发事件或更新状态
  emitSelectedElements()
}

const updateSelectionBox = (x: number, y: number) => {
  selectionBox.endX = x
  selectionBox.endY = y

  // 处理左上角坐标
  selectionBox.startX = Math.min(initPosition.x, x)
  selectionBox.startY = Math.min(initPosition.y, y)
  selectionBox.endX = Math.max(initPosition.x, x)
  selectionBox.endY = Math.max(initPosition.y, y)

  const containerRect = containerRef.value?.getBoundingClientRect() as DOMRect

  // 限制选择框在容器内
  selectionBox.startX = Math.max(selectionBox.startX, containerRect.left)
  selectionBox.startY = Math.max(selectionBox.startY, containerRect.top)
  selectionBox.endX = Math.min(selectionBox.endX, containerRect.right)
  selectionBox.endY = Math.min(selectionBox.endY, containerRect.bottom)

  selectionBox.width = selectionBox.endX - selectionBox.startX
  selectionBox.height = selectionBox.endY - selectionBox.startY
}

const getSelectedElements = (): Array<string | number> => {
  const elements = containerRef.value!.querySelectorAll(props.element)
  const selected: Array<string | number> = []

  for (const element of elements) {
    const elementRect = element.getBoundingClientRect()
    const selectBoxRect = {
      left: selectionBox.startX,
      top: selectionBox.startY,
      right: selectionBox.endX,
      bottom: selectionBox.endY
    }

    if (isElementSelected(elementRect, selectBoxRect)) {
      const value = element.getAttribute(`data-${props.elementKey}`)
      if (value) {
        selected.push(value)
      }
    }
  }

  return selected
}

const isElementSelected = (
  elementRect: DOMRect,
  selectBoxRect: { left: number; top: number; right: number; bottom: number }
): boolean => {
  switch (props.strategy) {
    case SelectionStrategy.Intersect:
      return (
        elementRect.left < selectBoxRect.right &&
        elementRect.right > selectBoxRect.left &&
        elementRect.top < selectBoxRect.bottom &&
        elementRect.bottom > selectBoxRect.top
      )
    case SelectionStrategy.Contain:
      return (
        elementRect.left >= selectBoxRect.left &&
        elementRect.right <= selectBoxRect.right &&
        elementRect.top >= selectBoxRect.top &&
        elementRect.bottom <= selectBoxRect.bottom
      )
    default:
      return false
  }
}

const emitSelectedElements = () => {
  emit('selected-elements', selectedElements.value)
}
</script>

<style lang="less" scoped>
.draggable-area {
  width: inherit;
  height: inherit;

  &-box {
    position: fixed;
    background-color: rgba(0, 0, 255, 0.1);
    user-select: none;
    z-index: 99999999;
  }
}

html[theme-mode='dark'] {
  .draggable-area-box {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
