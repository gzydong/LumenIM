import { MessageApi } from 'naive-ui'

/**
 * 防抖函数
 *
 * @returns MessageApi
 */
export const message = function (): MessageApi {
  return window.$message
}
