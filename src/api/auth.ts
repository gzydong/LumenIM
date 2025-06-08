// 授权相关接口
import { createApi, EmptyRequest } from './request.ts'

export const ServAuthLogin = createApi<ServAuthLoginRequest, ServAuthLoginResponse>(
  '/api/v1/auth/login'
)

export const ServAuthRegister = createApi<ServAuthRegisterRequest, null>('/api/v1/auth/register')

export const ServAuthLogout = createApi<EmptyRequest, null>('/api/v1/auth/logout')

export const ServAuthForget = createApi<ServAuthForgetRequest, null>('/api/v1/auth/forget')

export const ServAuthOauth = createApi<ServAuthOauthRequest, ServAuthOauthResponse>(
  '/api/v1/auth/oauth'
)

export const ServAuthOauthLogin = createApi<ServAuthOauthLoginRequest, ServAuthOauthLoginResponse>(
  '/api/v1/auth/oauth/login'
)

export const ServAuthOauthBind = createApi<ServAuthOauthBindRequest, ServAuthOauthBindResponse>(
  '/api/v1/auth/oauth/bind'
)

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

export interface ServAuthRegisterRequest {
  nickname: string
  mobile: string
  password: string
  platform: string
  sms_code: string
}

export interface ServAuthForgetRequest {
  mobile: string
  password: string
  sms_code: string
}

export interface ServAuthOauthRequest {
  oauth_type: 'github' | 'gitee'
}

export interface ServAuthOauthResponse {
  uri: string
}

export interface ServAuthOauthLoginRequest {
  code: string
  state: string
  oauth_type: 'github' | 'gitee'
}

export interface ServAuthOauthLoginResponse {
  // 是否认证成功 Y: 未认证 N: 已认证
  is_authorize: string
  // 认证成功后的登录授权信息
  authorize: {
    access_token: string
    expires_in: number
    type: string
  }
  // 绑定授权码
  bind_token: string
}

export interface ServAuthOauthBindRequest {
  bind_token: string
  mobile: string
  sms_code: string
}

export interface ServAuthOauthBindResponse {
  // 认证成功后的登录授权信息
  authorize: {
    access_token: string
    expires_in: number
    type: string
  }
}
