import { reactive } from 'vue'

interface IDropdown {
  options: any[]
  show: boolean
  x: number
  y: number
  item: any
}

export function useFriendsMenu() {
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
    dropdown.options.push({ label: '删除好友', key: 'delete' })

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
