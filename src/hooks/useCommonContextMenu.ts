import { reactive, defineComponent, h } from 'vue'
import { NDropdown, DropdownOption } from 'naive-ui'

export interface IDropdown {
  options: any[]
  show: boolean
  x: number
  y: number
  item: any
}

export function useCommonContextMenu(handle: (key: string, option: DropdownOption) => void) {
  const dropdown: IDropdown = reactive({
    options: [] as DropdownOption[],
    show: false,
    x: 0,
    y: 0,
    item: {} as any
  })

  const close = () => {
    dropdown.show = false
    dropdown.item = {}
  }

  const show = (e: MouseEvent, options: DropdownOption[], item: any) => {
    dropdown.item = item
    dropdown.options = [...options]
    dropdown.x = e.clientX
    dropdown.y = e.clientY
    dropdown.show = true
    e.preventDefault()
  }

  const getItem = () => dropdown.item

  const handleSelect = (key: string, option: DropdownOption) => {
    handle(key, option)
    close()
  }

  const handleClickOutside = () => {
    close()
  }

  const ContextMenuElement = defineComponent({
    name: 'ContextMenuElement',
    render() {
      return h(NDropdown, {
        options: dropdown.options,
        x: dropdown.x,
        y: dropdown.y,
        show: dropdown.show,
        onSelect: handleSelect,
        onClickoutside: handleClickOutside,
        animated: true,
        placement: 'right',
        showArrow: true
      })
    }
  })

  return { menu: { close, show, getItem }, ContextMenuElement }
}

export type IDropdownOption = DropdownOption
