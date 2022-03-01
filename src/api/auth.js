// 授权相关接口
import { post } from '@/utils/request'

// 登录服务接口
export const ServeLogin = data => {
  return post('/api/v1/auth/login', data)
}

// 注册服务接口
export const ServeRegister = data => {
  return post('/api/v1/auth/register', data)
}

// 退出登录服务接口
export const ServeLogout = data => {
  return post('/api/v1/auth/logout', data)
}

// 刷新登录Token服务接口
export const ServeRefreshToken = () => {
  return post('/api/v1/auth/refresh-token')
}

// 找回密码服务
export const ServeForgetPassword = data => {
  return post('/api/v1/auth/forget', data)
}
