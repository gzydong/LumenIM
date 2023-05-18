import { reactive, nextTick } from 'vue'

interface IDropdown {
  options: DropdownOption[]
  show: boolean
  x: number
  y: number
  item: any
}

export function useMenu() {

  const dropdown: IDropdown = reactive({
    options: [],
    show: false,
    x: 0,
    y: 0,
    item: {},
  })

  const showDropdownMenu = (e: any, uid: number, item: any) => {
    dropdown.show = false
    dropdown.item = Object.assign({}, item)
    dropdown.options = [
      {
        label: '复制',
        key: 'copy',
        disabled: !item.content,
      },
      {
        label: `撤回`,
        key: 'revoke',
        disabled: (() => {
          if (uid != item.user_id) {
            return true
          }

          let datetime = item.created_at.replace(/-/g, '/')

          let time = new Date().getTime() - Date.parse(datetime)

          return Math.floor(time / 1000 / 60) > 2
        })(),
      },
      {
        label: '删除',
        key: 'delete',
        disabled: false,
      },
      {
        label: '多选',
        key: 'multiSelect',
        disabled: false,
      },
    ]

    nextTick(() => {
      dropdown.show = true
      dropdown.x = e.clientX
      dropdown.y = e.clientY
    })
  }

  const closeDropdownMenu = () => {
    dropdown.show = false
    dropdown.item = {}
  }

  return { dropdown, showDropdownMenu, closeDropdownMenu }
}
