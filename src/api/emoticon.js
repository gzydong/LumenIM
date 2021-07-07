import { post, get, upload } from '@/utils/request'

// 查询用户表情包服务接口
export const ServeFindUserEmoticon = () => {
  return get('/api/v1/emoticon/list')
}

// 查询系统表情包服务接口
export const ServeFindSysEmoticon = () => {
  return get('/api/v1/emoticon/system')
}

// 设置用户表情包服务接口
export const ServeSetUserEmoticon = data => {
  return post('/api/v1/emoticon/set-user-emoticon', data)
}

// 移除收藏表情包服务接口
export const ServeDelCollectEmoticon = data => {
  return post('/api/v1/emoticon/del-collect-emoticon', data)
}

// 上传表情包服务接口
export const ServeUploadEmoticon = data => {
  return upload('/api/v1/emoticon/upload-emoticon', data)
}
