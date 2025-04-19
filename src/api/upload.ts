import { createApiCall } from './request.ts'

// 上传头像裁剪图片服务接口
export const ServUploadImage = createApiCall('/api/v1/upload/media-file')

// 查询大文件拆分信息服务接口
export const ServUploadInitMultipart = createApiCall('/api/v1/upload/init-multipart')

// 文件拆分上传服务接口
export const ServUploadMultipart = createApiCall('/api/v1/upload/multipart')
