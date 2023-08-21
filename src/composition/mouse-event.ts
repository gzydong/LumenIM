import { ref, onBeforeUnmount } from 'vue'

const INPUT_INIT_HEIGHT = 200
const INPUT_HEIGHT_MAX = 500
export const inputHeight = ref<number>(INPUT_INIT_HEIGHT)

let resizing = false

// 添加上边框拖拽相关逻辑
export const startResizeTop = (event: any) => {
  resizing = true
  const initialHeight = inputHeight.value
  const startY = event.clientY

  const handleResizeTop = (event: any) => {
    if (resizing) {
      const deltaY = startY - event.clientY
      const newHeight = initialHeight + deltaY

      inputHeight.value = Math.max(
        INPUT_INIT_HEIGHT,
        Math.min(newHeight, INPUT_HEIGHT_MAX)
      )
    }
  }

  const stopResize = () => {
    resizing = false
    window.removeEventListener('mousemove', handleResizeTop)
  }

  window.addEventListener('mousemove', handleResizeTop)
  window.addEventListener('mouseup', stopResize)

  // 在组件卸载时移除事件监听器，以防止内存泄漏
  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', handleResizeTop)
    window.removeEventListener('mouseup', stopResize)
  })
}
