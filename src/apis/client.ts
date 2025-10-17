export type ApiFunction<R, T> = (params: R, options?: ApiOptions) => Promise<T>

export type IRequestInterceptor = (
  url: string,
  req: RequestInit
) => Promise<RequestInit> | RequestInit

export type IResponseInterceptor = (resp: Response, body: any) => Promise<any> | any

export class ApiError extends Error {
  errcode: number

  constructor(errcode: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.errcode = errcode
  }
}

export interface ApiOptions extends RequestInit {
  timeout?: number
  retry?: number // 重试次数
  retryDelay?: number // 重试延迟（毫秒）
}

export class ApiClient {
  private readonly baseUrl: string

  private readonly defaultOptions: ApiOptions = {
    method: 'POST',
    timeout: 5000, // 默认超时5秒
    retry: 1, // 默认重试一次
    retryDelay: 500, // 默认重试延迟500ms
    headers: {
      'Content-Type': 'application/json'
    }
  }

  public readonly interceptor = new Interceptors()

  constructor(baseUrl: string, options?: ApiOptions) {
    this.baseUrl = baseUrl
    this.defaultOptions = {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...(this.defaultOptions.headers as Record<string, string>),
        ...(options?.headers as Record<string, string>)
      }
    }
  }

  request<R = any, T = any>(url: string, method?: string): ApiFunction<R, T> {
    return async (params: R, options?: ApiOptions): Promise<T> => {
      const uri = this.baseUrl + url

      const mergedOptions: ApiOptions = {
        ...this.defaultOptions,
        ...options,
        method: options?.method || method || this.defaultOptions.method
      }

      let req: RequestInit = { ...mergedOptions }

      req.headers = {
        ...(this.defaultOptions.headers as Record<string, string>),
        ...(options?.headers as Record<string, string>)
      }

      if (mergedOptions.method != 'GET') {
        if (params instanceof FormData) {
          req.body = params
          delete req.headers['Content-Type'] // 移除 Content-Type ，表单上传会自动设置
        } else {
          req.body = JSON.stringify(params)
        }
      }

      for (const interceptor of this.interceptor.request.interceptors) {
        req = await interceptor(uri, req)
      }

      const to = async () => {
        let timer: NodeJS.Timeout | number | undefined
        let abortController: AbortController | undefined
        try {
          if (!mergedOptions.signal) {
            abortController = new AbortController()
            timer = setTimeout(() => {
              abortController?.abort()
            }, mergedOptions.timeout)
            req.signal = abortController.signal
          }

          const resp = await fetch(uri, req)
          let body = await resp.json()

          // 执行响应拦截器
          for (const interceptor of this.interceptor.response.interceptors) {
            body = await interceptor(resp, body)
          }

          if (resp.status === 200) return body

          // 只在 data.code 明确为 number 时使用，否则用 400
          throw new ApiError(
            typeof body?.code === 'number' ? body.code : 400,
            body?.message || '业务错误'
          )
        } catch (err: any) {
          if (err instanceof ApiError) throw err
          if (err instanceof TypeError) {
            throw new ApiError(-1, '网络连接失败，请重试')
          } else if (err instanceof Error && err.name === 'AbortError') {
            throw new ApiError(-2, '请求超时')
          }
          throw new ApiError(-3, err?.message || '未知错误')
        } finally {
          if (timer) clearTimeout(timer)
        }
      }

      // 优化重试参数判断，支持 retry=0
      const retry = mergedOptions.retry ?? 1
      for (let i = 0; i <= retry; i++) {
        try {
          return await to()
        } catch (err: any) {
          const isRetriableErr = err instanceof ApiError && [-1, -2].includes(err.errcode)
          const hasRetryAttempts = i < retry
          if (isRetriableErr && hasRetryAttempts && !mergedOptions.signal) {
            const delay = mergedOptions.retryDelay ?? 1000
            await new Promise((resolve) => setTimeout(resolve, delay))
            continue
          }
          throw err
        }
      }

      throw new ApiError(-4, '请求失败')
    }
  }
}

class Interceptors {
  request: Interceptor<IRequestInterceptor>
  response: Interceptor<IResponseInterceptor>

  constructor() {
    this.request = new Interceptor<IRequestInterceptor>()
    this.response = new Interceptor<IResponseInterceptor>()
  }
}

class Interceptor<T> {
  interceptors: T[] = []

  use(fn: T) {
    this.interceptors.push(fn)
  }
}
