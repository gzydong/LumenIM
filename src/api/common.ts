import { createApi } from './request.ts'

// 发送找回密码验证码
export const ServCommonSendSmsCode = createApi<{ mobile: string; channel: string }, any>(
  '/api/v1/common/send-sms-code'
)

// 发送邮箱验证码服务接口
export const ServCommonSendEmailCode = createApi<{ email: string }, any>(
  '/api/v1/common/send-email-code'
)
