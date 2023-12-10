import { h } from 'vue'
import { MessageApi, NIcon } from 'naive-ui'

/**
 * 防抖函数
 *
 * @returns MessageApi
 */
export const message = function (): MessageApi {
  return window.$message
}

export const renderIcon = (icon: any) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}
