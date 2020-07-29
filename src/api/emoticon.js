import {
  post,
  get,
  upload
} from '@/utils/request';


//查询用户表情包服务接口
export const findUserEmoticonServ = () => {
  return get('/api/emoticon/user-emoticon');
}

//查询系统表情包服务接口
export const findSysEmoticonServ = () => {
  return get('/api/emoticon/system-emoticon');
}

//设置用户表情包服务接口
export const setUserEmoticonServ = (data) => {
  return post('/api/emoticon/set-user-emoticon', data);
}

//收藏表情包服务接口
export const collectEmoticonServ = (data) => {
  return post('/api/emoticon/collect-emoticon', data);
}

//移除收藏表情包服务接口
export const delCollectEmoticonServ = (data) => {
  return post('/api/emoticon/del-collect-emoticon', data);
}

//上传表情包服务接口
export const uploadEmoticonServ = (data) => {
  return upload('/api/emoticon/upload-emoticon', data);
}
