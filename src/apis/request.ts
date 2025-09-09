import * as auth from '@/utils/auth.ts'

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
  options?: RequestInit
): (params: R) => Promise<T> {
  options = options || {}
  options.method = 'POST'

  // @ts-ignore
  return async (params: R): Promise<T> => {
    const abortController = new AbortController()
    const timeoutId = setTimeout(() => {
      abortController.abort()
    }, defaultOptions.timeout)

    const token = auth.getToken()
    // @ts-ignore
    defaultOptions.headers['Authorization'] = `Bearer ${token}`

    return fetch(import.meta.env.VITE_BASE_API + url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options?.headers
      },
      body: JSON.stringify(params),
      signal: abortController.signal
    })
      .then(async (res) => {
        clearTimeout(timeoutId)

        const data = await res.json()
        if (res.ok) return data.data

        throw new ApiError(data?.code || 400, data?.message || '业务错误')
      })
      .catch((err) => {
        clearTimeout(timeoutId)

        if (err instanceof ApiError) throw err

        // 更详细的错误分类
        if (err instanceof TypeError) {
          throw new ApiError(-1, '网络连接失败')
        } else if (err.name === 'AbortError') {
          throw new ApiError(-2, '请求超时')
        }

        throw new ApiError(-3, err?.message || '未知错误')
      })
  }
}

export interface FetchApiOption {
  loading?: Ref<boolean>
  error?: boolean // 是否显示错误消息
  errorText?: string // 自定义错误信息
  successText?: string // 成功显示的文本信息
}

export async function fetchApi<R, T>(
  fn: (param: R) => Promise<T>,
  param: R,
  options?: FetchApiOption
) {
  if (!options?.error) options = { ...options, error: true }

  try {
    if (options?.loading) options.loading.value = true

    const data = await fn(param)

    if (options?.successText) {
      window['$message']?.success(options?.successText)
    }

    return [undefined, data] as [undefined, T]
  } catch (err) {
    if (options?.error) error((err as Error)?.message || '未知错误')

    return [err, undefined] as [any, undefined]
  } finally {
    if (options?.loading) options.loading.value = false
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

export interface EmptyRequest {}
export interface EmptyResponse {}
