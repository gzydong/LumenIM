import { Ref } from 'vue'
import { AxiosError } from 'axios'

export * from './request'

interface ApiResponse<T = any> {
  code: number // http 状态码非200则处理失败
  error_code: string // 错误码
  message: string // 错误信息
  data?: T // 仅当 code 为 200 时有效
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

    return { code: 200, message: 'success', error_code: '', ...res } as ApiResponse
  } catch (err: unknown) {
    if (options?.loading) options.loading.value = false

    if (err instanceof AxiosError) {
      if (!err.response) {
        error(err.message)

        return { code: 500, error_code: err.code as string, message: err.message } as ApiResponse
      }

      const status = err.response.status as number
      const { code, message } = err.response.data

      if (options?.isShowError || options?.isShowError == undefined) {
        error(message || err.message)
      }

      return { code: status || 500, error_code: `${code}`, message: message }
    } else {
      // 处理其他类型的错误
      error('An unexpected error occurred.')

      return {
        code: 500,
        error_code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred.'
      } as ApiResponse
    }
  }
}

function error(message: string) {
  if (window['$message']) {
    return window['$message'].error(message)
  }

  window.alert(message)
}
