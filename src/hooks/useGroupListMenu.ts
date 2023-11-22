import { reactive } from 'vue'

interface IDropdown {
  options: any[]
  show: boolean
  x: number
  y: number
  item: any
}

export function useGroupListMenu() {
  const dropdown: IDropdown = reactive({
    options: [],
    show: false,
    x: 0,
    y: 0,
    item: {}
  })

  const showDropdownMenu = (e: any, item: any) => {
    dropdown.item = Object.assign({}, item)

    dropdown.options = []

    dropdown.options.push({ label: '添加好友', key: 'delete2' })
    dropdown.options.push({ label: '移出群聊', key: 'delete1' })
    dropdown.options.push({ label: '禁止发言', key: 'delete3' })
    dropdown.options.push({ label: '权限分配', key: 'delete4' })
    dropdown.options.push({ label: '@群成员', key: 'delete5' })

    dropdown.x = e.clientX
    dropdown.y = e.clientY
    dropdown.show = true
  }

  const closeDropdownMenu = () => {
    dropdown.show = false
    dropdown.item = {}
  }

  return { dropdown, showDropdownMenu, closeDropdownMenu }
}
