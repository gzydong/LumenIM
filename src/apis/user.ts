import { createApi, EmptyRequest, EmptyResponse } from './request.ts'

// 用户详情接口
export interface UserDetailResponse {
  avatar: string
  birthday: string
  email: string
  gender: number
  id: number
  mobile: string
  motto: string
  nickname: string
}

export const apiUserDetail = createApi<EmptyRequest, UserDetailResponse>('/api/v1/user/detail')

// 修改密码请求接口
export interface UserPasswordUpdateRequest {
  old_password: string
  new_password: string
}

// 修改密码服务接口
export const apiUserPasswordUpdate = createApi<UserPasswordUpdateRequest, EmptyResponse>(
  '/api/v1/user/password/update'
)

// 修改手机号请求接口
export interface UserMobileUpdateRequest {
  mobile: string
  password: string
  sms_code: string
}

// 修改手机号服务接口
export const apiUserMobileUpdate = createApi<UserMobileUpdateRequest, EmptyResponse>(
  '/api/v1/user/mobile/update'
)

// 修改邮箱请求接口
export interface UserEmailUpdateRequest {
  email: string
  password: string
  code: string
}

// 修改邮箱服务接口
export const apiUserEmailUpdate = createApi<UserEmailUpdateRequest, EmptyResponse>(
  '/api/v1/user/email/update'
)

// 修改个人信息请求接口
export interface UserUpdateRequest {
  nickname: string
  avatar: string
  motto: string
  gender: number
  birthday: string
}

// 修改个人信息服务接口
export const apiUserUpdate = createApi<UserUpdateRequest, EmptyResponse>('/api/v1/user/update')

// 获取用户相关设置信息
export const apiUserSetting = createApi<EmptyRequest, EmptyResponse>('/api/v1/user/setting')
