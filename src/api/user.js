import { post, get } from './request'

// 修改密码服务接口
export const ServeUpdatePassword = (data) => {
  return post('/api/v1/user/password/update', data)
}

// 修改手机号服务接口
export const ServeUpdateMobile = (data) => {
  return post('/api/v1/user/mobile/update', data)
}

// 修改手机号服务接口
export const ServeUpdateEmail = (data) => {
  return post('/api/v1/user/email/update', data)
}

// 修改个人信息服务接口
export const ServeUpdateUserDetail = (data) => {
  return post('/api/v1/user/update', data)
}

// 查询用户信息服务接口
export const ServeGetUserDetail = () => {
  return get('/api/v1/user/detail')
}

// 获取用户相关设置信息
export const ServeGetUserSetting = () => {
  return get('/api/v1/user/setting')
}
