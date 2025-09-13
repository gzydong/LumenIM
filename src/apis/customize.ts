import { createApi, upload } from './request'

/**
 * 表情包上传接口
 */
export const fetchEmoticonUpload2 = (data: FormData) => {
  return upload('/api/v1/emoticon/customize/upload', data)
}

/**
 * 文章附件上传接口
 */
export const fetchArticleAnnexUpload = (data: FormData) => {
  return upload('/api/v1/article-annex/upload', data)
}

// 上传头像裁剪图片服务接口
export const fetchUploadImage = (data: FormData) => {
  return upload('/api/v1/upload/media-file', data)
}

// 查询大文件拆分信息服务接口
export const fetchUploadInitMultipart = createApi('/api/v1/upload/init-multipart')

// 文件拆分上传服务接口
export const fetchUploadMultipart = (data: FormData) => {
  return upload('/api/v1/upload/multipart', data)
}

// 发送代码块消息服务接口
export const fetchMessageSend = createApi<ServTalkMessageSendRequest, any>('/api/v1/message/send')

interface ServTalkMessageSendRequest {
  type: string
  quote_id?: string
  body: any
  talk_mode: number
  to_from_id: number
  msg_id?: string
}
