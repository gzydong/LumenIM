import { post, get, upload } from './request'

// 查询用户表情包服务接口
export const ServeCustomizeEmoticonList = () => {
  return get('/api/v1/emoticon/customize/list')
}

// 上传表情包服务接口
export const ServeCustomizeEmoticonUpload = (data) => {
  return upload('/api/v1/emoticon/customize/upload', data)
}

export const ServeCustomizeEmoticonDelete = (data) => {
  return upload('/api/v1/emoticon/customize/delete', data)
}

export const ServeCustomizeEmoticonCreate = (data) => {
  return upload('/api/v1/emoticon/customize/create', data)
}
