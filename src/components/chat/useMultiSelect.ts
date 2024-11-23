import { ref } from 'vue'
import { IChatItem } from './types.ts'

export function useMultiSelect() {
  const isShow = ref<boolean>(false)

  const selectedItems = ref<string[]>([])

  /**
   * 选中的元素
   * @param elements string[]
   */
  function setMultiSelect(elements: string[]) {
    if (elements.length === 0) return

    // 使用 Set 进行快速查找
    const set = new Set<string>(selectedItems.value)

    for (const element of elements) {
      if (set.has(element)) {
        set.delete(element)
      } else {
        set.add(element)
      }
    }

    const newSelectedItems = Array.from(set)
    const length = selectedItems.value.length
    selectedItems.value.splice(0, length, ...newSelectedItems)
  }

  /**
   * 检查项是否被选中
   * @param item IChatItem
   * @returns {boolean}
   */
  function isSelected(item: IChatItem): boolean {
    return selectedItems.value.some((value) => value === item.msg_id)
  }

  function enable(value: boolean): void {
    isShow.value = value

    // 如果自动关闭则清空已选项
    if (!value) clearMultiSelect()
  }

  function clearMultiSelect(): void {
    selectedItems.value = []
  }

  function getMultiSelect(): string[] {
    return [...Array.from(selectedItems.value)]
  }

  return {
    isEnable: () => isShow.value,
    enable,
    clearMultiSelect,
    setMultiSelect,
    isSelected,
    getMultiSelect
  }
}
