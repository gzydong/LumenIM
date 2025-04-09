import { Ref } from 'vue'
import { AxiosError } from 'axios'

export * from './request'

interface ApiResponse<T = any> {
  status: number // http 状态码非200则处理失败
  code: number // 具体的业务错误码 200 表示成功
  message: string // 错误信息
  data?: T // 仅当 http status 为 200 时有效
}

/**
 * 封装 API 调用
 * @param fn - 执行 API 调用的函数
 * @param data - API 调用的数据参数
 * @param options - 调用选项
 * @returns Promise<ApiResponse<T>>
 */
export async function toApi<T = any>(
  fn: (data: object) => Promise<any>,
  data?: object,
  options?: {
    // 是否显示加载状态
    loading?: Ref<boolean>
    // 是否显示错误消息
    isShowError?: boolean
    // 是否显示成功消息
    showMessageText?: string
    // 成功回调
    onSuccess?: Function
  }
): Promise<ApiResponse<T>> {
  if (options?.loading) options.loading.value = true

  try {
    const res = await fn(data || {})

    if (options?.loading) options.loading.value = false

    if (options?.showMessageText) {
      window['$message']?.success(options?.showMessageText)
    }

    if (options?.onSuccess) {
      options?.onSuccess()
    }

    return { status: 200, code: 200, message: 'success', ...res }
  } catch (err: unknown) {
    if (options?.loading) options.loading.value = false

    if (err instanceof AxiosError) {
      if (!err.response) {
        error(err.message)
        return {
          status: -1,
          code: 500,
          message: err.message
        }
      }

      const status = err.response.status as number
      const { code, message } = err.response.data

      if (options?.isShowError || options?.isShowError == undefined) {
        error(message || err.message)
      }

      return { status, code, message: message }
    }

    error('An unexpected error occurred.')
    return {
      status: -2,
      code: 500,
      message: 'An unexpected error occurred.'
    }
  }
}

function error(message: string) {
  if (window['$message']) {
    return window['$message'].error(message)
  }

  window.alert(message)
}
