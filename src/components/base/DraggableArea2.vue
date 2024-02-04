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
import { ref, onMounted, reactive, onUnmounted } from 'vue'

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

function getMousePosInContainer(event: MouseEvent, container: HTMLDivElement) {
  const rect = container.getBoundingClientRect()
  const scrollLeft = container.scrollLeft
  const scrollTop = container.scrollTop

  const x = event.clientX - rect.left - scrollLeft
  const y = event.clientY - rect.top + scrollTop

  return { x, y }
}

const handleMouseDown = (e: MouseEvent) => {
  if (!e.target) return

  // const target = e.target as HTMLElement

  // 判断点击的是否是容器
  // if (target.closest(props.closest) !== null) return

  isDragging.value = true

  const { x, y } = getMousePosInContainer(e, containerRef.value!)

  initStartPosition.x = x
  initStartPosition.y = y

  selectionBox.startX = initStartPosition.x
  selectionBox.startY = initStartPosition.y

  selectionBox.endX = initStartPosition.x
  selectionBox.endY = initStartPosition.y

  mouseMoveHandler = handleMouseMove
  mouseUpHandler = handleMouseUp

  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return

  const rect = containerRef.value as HTMLDivElement

  const { x, y } = getMousePosInContainer(e, rect)

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

  if (rect.scrollHeight <= y) {
    selectionBox.endY = rect.scrollHeight
  }

  if (rect.scrollWidth <= x) {
    selectionBox.endX = rect.scrollWidth
  }
}

const handleMouseUp = () => {
  document.removeEventListener('mousemove', mouseMoveHandler!)
  document.removeEventListener('mouseup', mouseUpHandler!)

  isDragging.value = false

  // 移动距离小于10px则不触发
  if (Math.abs(selectionBox.startY - selectionBox.startY) <= 10) return

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
  console.log(selectedElements.value)
  emit('selected-elements', selectedElements.value)
}

onMounted(() => {
  document.addEventListener('mousedown', handleMouseDown)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleMouseDown)
})
</script>

<style lang="less" scoped>
.draggable-area {
  width: inherit;
  height: inherit;
  position: relative;

  &-box {
    position: absolute;
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
