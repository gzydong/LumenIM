// 授权相关接口
import { createApiCall, EmptyRequest } from './request.ts'

export const ServAuthLogin = createApiCall<ServAuthLoginRequest, ServAuthLoginResponse>(
  '/api/v1/auth/login'
)

export const ServAuthRegister = createApiCall<ServAuthRegisterRequest, null>(
  '/api/v1/auth/register'
)

export const ServAuthLogout = createApiCall<EmptyRequest, null>('/api/v1/auth/logout')

export const ServAuthForget = createApiCall<ServAuthForgetRequest, null>('/api/v1/auth/forget')

export interface ServAuthLoginRequest {
  mobile: string
  password: string
  platform: string
}

export interface ServAuthLoginResponse {
  access_token: string
  expires_in: number
  type: string
}

interface ServAuthRegisterRequest {
  nickname: string
  mobile: string
  password: string
  platform: string
  sms_code: string
}

interface ServAuthForgetRequest {
  mobile: string
  password: string
  sms_code: string
}
