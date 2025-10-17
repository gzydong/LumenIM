import { ApiClient, ApiError } from '@/apis/client'
import { deleteToken, getToken } from '@/utils/auth.ts'
import { useThrottleFn } from '@vueuse/core'

export const client = new ApiClient(import.meta.env.VITE_BASE_API, {
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000 // 默认请求超时时间 5 秒
})

client.interceptor.request.use((_: string, req: RequestInit) => {
  const token = getToken()

  if (token) {
    req.headers = {
      ...req.headers,
      Authorization: `Bearer ${token}`
    }
  }

  return req
})

const showAuthDialog = useThrottleFn(() => {
  deleteToken()

  window['$modal']?.create({
    preset: 'dialog',
    title: '登录提示',
    content: '登录已过期，请重新登录',
    style: 'width: 500px;',
    positiveText: '立即登录',
    negativeText: '取消',
    onPositiveClick: () => {
      location.href = '/auth/login'
    }
  })
}, 5000)

client.interceptor.response.use((res: Response, body: any) => {
  if (res.status == 401) showAuthDialog()

  return body
})

// 高阶函数：创建 API 调用函数
export const createApi = client.request.bind(client)

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
