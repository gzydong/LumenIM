import {
  post,
  get,
  upload
} from '@/utils/request';


//上传头像裁剪图片服务接口
export const uploadFileStreamServ = (data) => {
  return post('/api/upload/file-stream', data);
}

//查询大文件拆分信息服务接口
export const findFileSplitInfoServ = (data = {}) => {
  return get('/api/upload/get-file-split-info', data);
}

//文件拆分上传服务接口
export const fileSubareaUploadServ = (data = {}, options = {}) => {
  return upload('/api/upload/file-subarea-upload', data, options);
}
