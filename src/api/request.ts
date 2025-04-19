import axios, { AxiosError } from 'axios'
import * as auth from '@/utils/auth.ts'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: import.meta.env.VITE_BASE_API,

  // 请求超时时间
  timeout: 10000
})

let once = false

/**
 * 异常拦截处理器
 *
 * @param {*} error
 */
const errorHandler = (error: AxiosError) => {
  // 判断是否是响应错误信息
  if (error.response) {
    if (error.response.status == 401) {
      auth.deleteToken()

      if (!once) {
        once = true
        window['$dialog']?.info({
          title: '友情提示',
          content: '当前登录已失效，请重新登录？',
          positiveText: '立即登录?',
          maskClosable: false,
          onPositiveClick: () => {
            location.reload()
          }
        })
      }
    }
  }

  return Promise.reject(error)
}

request.interceptors.request.use((config) => {
  const token = auth.getToken()

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  return config
}, errorHandler)

request.interceptors.response.use((response: any) => {
  const refreshAccessToken = response.headers.get('refresh-access-token')
  const refreshTokenExpire = response.headers.get('refresh-access-expires-at')

  if (refreshAccessToken && refreshTokenExpire) {
    auth.setToken(refreshAccessToken, parseInt(refreshTokenExpire))
  }

  return response.data
}, errorHandler)

export const get = (url: string, data: any = {}) => {
  return request({
    url,
    params: data,
    method: 'get'
  })
}

export const post = (url: string, data: any = {}) => {
  return request({
    url,
    method: 'post',
    data: data
  })
}

export interface ApiResponse<T = any> {
  status: number // http 状态码非200则处理失败
  code: number // 具体的业务错误码 200 表示成功
  message: string // 错误信息
  data?: T // 仅当 http status 为 200 时有效
}

export type Response<T> = Promise<ApiResponse<T>>

export interface ApiOptions {
  // 是否显示加载状态
  loading?: Ref<boolean>
  // 是否显示错误消息
  error?: boolean
  // 自定义错误信息
  failText?: string
  // 成功显示的文本信息
  successText?: string
  // 重试次数
  retry?: number
  onSuccess?: Function
}

export async function api<T = any>(uri: string, params?: any, options?: ApiOptions): Response<T> {
  if (options?.loading) options.loading.value = true

  try {
    // @ts-ignore
    const { code, message, data } = await post(uri, params)

    if (options?.successText) {
      window['$message']?.success(options?.successText)
    }

    if (options?.onSuccess) options.onSuccess()

    return { status: 200, code, message, data: data as T }
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      if (!err.response) {
        if (options?.error || options?.error == undefined) {
          error(err.message)
        }

        return {
          status: -1,
          code: 500,
          message: err.message
        }
      }

      const status = err.response.status as number
      const { code, message } = err.response.data

      if (options?.error || options?.error == undefined) {
        error(options?.failText || message || err.message)
      }

      return { status, code, message: message }
    }

    return {
      status: -2,
      code: 500,
      message: 'An unexpected error occurred.'
    }
  } finally {
    if (options?.loading) options.loading.value = false
  }
}

function error(message: string) {
  if (window['$message']) {
    return window['$message'].error(message)
  }

  window.alert(message)
}

export const createApiCall = <R = any, T = any>(url: string) => {
  return (data?: R, options?: ApiOptions): Response<T> => {
    return api(url, data, options)
  }
}

export interface EmptyRequest {}
