import { h } from 'vue'
import { NIcon } from 'naive-ui'

export const renderIcon = (icon: any) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}
