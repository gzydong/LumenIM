import { reactive, ref, h } from 'vue'

export function useContextMenu() {
  const isShow = ref(false)
  const menus = reactive([])

  const showContextMenu = () => {
    isShow = true
  }

  const closeContextMenu = () => {}

  const renderContextMenu = () => {
    return h(
      'div', // type
      { id: 'foo', class: 'bar' }, // props
      [
        /* children */
      ]
    )
  }

  return {
    showContextMenu,
    closeContextMenu,
    renderContextMenu,
  }
}
