import { getToken } from '@/utils/auth.ts'

export interface ApiOptions extends RequestInit {
  timeout?: number
  retry?: number // 重试次数
  retryDelay?: number // 重试延迟（毫秒）
}

export class ApiError extends Error {
  err_code: number

  constructor(err_code: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.err_code = err_code
  }
}

const defaultOptions: ApiOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 默认10秒超时
}

// 高阶函数：创建 API 调用函数
export function createApi<R = any, T = any>(
  url: string,
  method?: string
): (params: R, options?: ApiOptions) => Promise<T> {
  return async (params: R, options?: ApiOptions): Promise<T> => {
    options = options || {}
    options.method = options.method || method || 'POST'

    const uri = import.meta.env.VITE_BASE_API + url

    const req: RequestInit = { ...defaultOptions, ...options }
    req.headers = { ...req.headers, ...options.headers }

    const token = getToken()
    if (token) {
      req.headers['Authorization'] = `Bearer ${token}`
    }

    if (options.method != 'GET') {
      req.body = JSON.stringify(params)
    }

    const request = async () => {
      try {
        if (!options?.signal) {
          const abortController = new AbortController()
          setTimeout(() => {
            abortController.abort()
          }, options?.timeout || defaultOptions.timeout)

          req.signal = abortController.signal
        }

        const res = await fetch(uri, req)

        const data = await res.json()
        if (res.status === 200) return data

        throw new ApiError(data?.code || 400, data?.message || '业务错误')
      } catch (e: any) {
        if (e instanceof ApiError) throw e

        if (e instanceof TypeError) {
          throw new ApiError(-1, '网络连接失败，请重试')
        } else if (e instanceof Error && e.name === 'AbortError') {
          throw new ApiError(-2, '请求超时')
        }

        throw new ApiError(-3, e?.message || '未知错误')
      }
    }

    const retry = options.retry || 2 // 默认重试2次
    for (let i = 0; i <= retry; i++) {
      try {
        return await request()
      } catch (e: any) {
        const isRetriableError = e instanceof ApiError && [-1, -2].includes(e.err_code)
        const hasRetryAttempts = i < retry

        // 检查是否是需要重试的错误类型，并且还有重试次数
        if (isRetriableError && hasRetryAttempts && !options?.signal) {
          const delay = options?.retryDelay || 1000 // ms
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }

        throw e
      }
    }

    // 添加默认返回值以解决 TypeScript 错误
    throw new ApiError(-4, '请求失败')
  }
}

export interface FetchApiOption {
  loading?: Ref<boolean>
  error?: boolean // 是否显示错误消息
  errorText?: string // 自定义错误信息
  successText?: string // 成功显示的文本信息
  onSuccess?: () => void
}

export async function fetchApi<R, T>(
  fn: (param: R) => Promise<T>,
  param: R,
  options?: FetchApiOption
) {
  // 默认显示错误消息
  if (options?.error === undefined) options = { ...options, error: true }

  try {
    if (options?.loading) options.loading.value = true

    const data = await fn(param)

    if (options?.successText) {
      window['$message']?.success(options?.successText)
    }

    return [undefined, data] as [undefined, T]
  } catch (err) {
    if (options?.error) error((err as Error)?.message || '未知错误')

    return [err, undefined] as [any, T]
  } finally {
    if (options?.loading) options.loading.value = false
  }
}

/**
 * 使用 fetch 上传文件
 * @param url 上传接口地址
 * @param data FormData 数据
 * @param options 请求选项
 * @returns Promise
 */
export const upload = async (url: string, data: FormData, options?: RequestInit): Promise<any> => {
  options = { method: 'POST', ...options }

  try {
    // 获取认证 token
    const token = getToken()

    // 构建请求选项
    const fetchOptions: RequestInit = {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options?.headers
      },
      body: data
    }

    // 发起请求
    const response = await fetch(import.meta.env.VITE_BASE_API + url, fetchOptions)

    // 解析响应
    const result = await response.json()

    if (response.ok) {
      return result?.data || result
    }

    throw new ApiError(result?.code || response.status || 400, result?.message || '上传失败')
  } catch (err) {
    if (err instanceof ApiError) {
      throw err
    }

    // 更详细的错误分类
    if (err instanceof TypeError) {
      throw new ApiError(-1, '网络连接失败')
    } else if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiError(-2, '请求超时')
    }

    // @ts-ignore
    throw new ApiError(-3, err?.message || '未知错误')
  }
}

interface SyncOptions {
  loading?: Ref<boolean>
  error?: boolean // 是否显示错误消息
  errorText?: string // 自定义错误信息
  successText?: string // 成功显示的文本信息
  onError?: (err: any) => void
  onComplete?: () => void
  onSuccess?: () => void
}

export function sync(fn: () => Promise<void>, options?: SyncOptions): void {
  if (options?.loading) options.loading.value = true

  fn()
    .then(() => {
      if (options?.loading) options.loading.value = false

      if (options?.successText) {
        window['$message']?.success(options?.successText)
      }

      options?.onSuccess?.()
      options?.onComplete?.()
    })
    .catch((err) => {
      if (options?.loading) options.loading.value = false

      error(options?.errorText || err?.message)

      console.error('[sync] error:', err)
      options?.onError?.(err)
    })
}

export function isApiError(err: any): err is ApiError {
  return err instanceof ApiError
}

function error(message: string) {
  if (window['$message']) {
    window['$message']?.error(message)
  } else {
    alert(message)
  }
}

export interface EmptyRequest {
  [key: string]: any
}
export interface EmptyResponse {}
