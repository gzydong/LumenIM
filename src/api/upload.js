import { post, upload } from './request'

// 上传头像裁剪图片服务接口
export const ServeUploadImage = (data) => {
  return post('/api/v1/upload/media-file', data)
}

// 查询大文件拆分信息服务接口
export const ServeFindFileSplitInfo = (data = {}) => {
  return post('/api/v1/upload/init-multipart', data)
}

// 文件拆分上传服务接口
export const ServeFileSubareaUpload = (data = {}, options = {}) => {
  return upload('/api/v1/upload/multipart', data, options)
}
