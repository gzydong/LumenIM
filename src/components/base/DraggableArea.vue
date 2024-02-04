<template>
  <div ref="containerRef" class="draggable-area">
    <div
      v-if="isDragging"
      class="draggable-area-box"
      :style="{
        left: selectionBox.startX + 'px',
        top: selectionBox.startY + 'px',
        width: selectionBox.endX - selectionBox.startX + 'px',
        height: selectionBox.endY - selectionBox.startY + 'px'
      }"
    ></div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, onBeforeUnmount } from 'vue'

const emit = defineEmits(['selected-elements'])

enum StrategyEnum {
  Intersect = 'intersect',
  Contain = 'contain'
}

const props = defineProps({
  closest: {
    type: String,
    default: ''
  },
  elment: {
    type: String,
    required: true
  },
  elmentKey: {
    type: String,
    required: true
  },
  // 选中策略 intersect: 交集, contain: 包含
  strategy: {
    type: String,
    default: 'contain'
  }
})

const containerRef = ref<HTMLDivElement | null>(null)

const isDragging = ref(false)

let initStartPosition = reactive({
  x: 0,
  y: 0
})

let selectionBox = reactive({ startX: 0, startY: 0, endX: 0, endY: 0 })

const selectedElements = ref<Array<string | number>>([]) // 存储选中的元素

let mouseMoveHandler: any | null = null
let mouseUpHandler: any | null = null

const handleMouseDown = (e: MouseEvent) => {
  const target = e.target as HTMLElement

  // 判断点击的是否是容器
  if (target.closest(props.closest) !== null) return

  e.preventDefault()

  isDragging.value = true

  initStartPosition.x = e.pageX
  initStartPosition.y = e.pageY

  selectionBox.startX = e.pageX
  selectionBox.startY = e.pageY
  selectionBox.endX = e.pageX
  selectionBox.endY = e.pageY

  mouseMoveHandler = handleMouseMove
  mouseUpHandler = handleMouseUp
  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return

  const rect = containerRef.value?.getBoundingClientRect() as DOMRect

  const { pageX: x, pageY: y } = e

  selectionBox.endX = x
  selectionBox.endY = y

  // 处理左上角坐标
  if (initStartPosition.x > x) {
    selectionBox.startX = x
    selectionBox.endX = initStartPosition.x
  } else {
    selectionBox.startX = initStartPosition.x
    selectionBox.endX = x
  }

  // 右脚坐标
  if (initStartPosition.y > y) {
    selectionBox.startY = y
    selectionBox.endY = initStartPosition.y
  } else {
    selectionBox.startY = initStartPosition.y
    selectionBox.endY = y
  }

  if (selectionBox.startX <= rect?.left) {
    selectionBox.startX = rect?.left
  }

  if (selectionBox.endX >= rect?.right) {
    selectionBox.endX = rect?.right
  }

  if (selectionBox.startY <= rect?.top) {
    selectionBox.startY = rect?.top
  }

  if (selectionBox.endY >= rect?.bottom) {
    selectionBox.endY = rect?.bottom
  }
}

const handleMouseUp = () => {
  isDragging.value = false

  // 移动距离小于10px则不触发
  if (Math.abs(selectionBox.startY - selectionBox.endY) <= 10) return

  document.removeEventListener('mousemove', mouseMoveHandler!)
  document.removeEventListener('mouseup', mouseUpHandler!)

  // 确定哪些元素被选中
  selectedElements.value = []
  const elements = containerRef.value!.querySelectorAll(props.elment) // 假设子元素有类名为 .item

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    const elementRect = element.getBoundingClientRect()

    const selectBoxRect = {
      left: selectionBox.startX,
      top: selectionBox.startY,
      right: selectionBox.endX,
      bottom: selectionBox.endY
    }

    // 包含
    if (props.strategy == StrategyEnum.Intersect) {
      let ok =
        (elementRect.top >= selectBoxRect.top || elementRect.bottom >= selectBoxRect.top) &&
        (elementRect.bottom <= selectBoxRect.bottom || elementRect.top <= selectBoxRect.bottom)

      if (!ok) continue
    }

    // 包含
    if (props.strategy == StrategyEnum.Contain) {
      let ok =
        elementRect.left >= selectBoxRect.left &&
        elementRect.right <= selectBoxRect.right &&
        elementRect.top >= selectBoxRect.top &&
        elementRect.bottom <= selectBoxRect.bottom

      if (!ok) continue
    }

    // 包含
    const value = element.getAttribute(`data-${props.elmentKey}`)
    value && selectedElements.value.push(value)
  }

  // 触发事件或更新状态
  emitSelectedElements()
}

const emitSelectedElements = () => {
  emit('selected-elements', selectedElements.value)
}

onMounted(() => {
  containerRef.value?.addEventListener('mousedown', handleMouseDown)
})

onBeforeUnmount(() => {
  containerRef.value?.removeEventListener('mousedown', handleMouseDown)
})
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
