import { post } from './request'

// 发送找回密码验证码
export const ServeSendVerifyCode = (data) => {
  return post('/api/v1/common/send-sms-code', data)
}

// 发送邮箱验证码服务接口
export const ServeSendEmailCode = (data) => {
  return post('/api/v1/common/send-email-code', data)
}
